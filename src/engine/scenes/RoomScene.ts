import * as Phaser from "phaser";
import type { Edge, Flags, Mover } from "../../cases/types";
import { advanceDialog, isDialogOpen, openDialog } from "../../ui/dialog";
import { hideHud, showHud, updateHud } from "../../ui/hud";
import { closeNotebook, isNotebookOpen, toggleNotebook } from "../../ui/notebook";
import { spriteUrl } from "../../ui/spriteImage";
import { roomSign, toast } from "../../ui/toast";
import { clueFlag } from "../caseState";
import { TILE } from "../config";
import { Ester } from "../Ester";
import { type Facing, Player } from "../Player";
import {
  OPPOSITE,
  type ParsedRoom,
  doorAt,
  entryPoint,
  isLowObstacle,
  isWalkable,
  parseRoom,
  tileAt,
  visitedFlag,
} from "../room";
import { drawRoom } from "../roomRenderer";
import { session } from "../session";
import { registerSprites } from "../textures";

type Target =
  | { kind: "ester" }
  | { kind: "thing"; index: number }
  | { kind: "clue"; index: number }
  | { kind: "door"; col: number; row: number };

interface RoomSceneData {
  roomId?: string;
  /** The edge Nora enters through. */
  from?: Edge;
}

const ENCOURAGEMENT = [
  "Försök lite till! Du klarar det.",
  "Titta i detektivboken. Tryck B!",
  "Undersök allt som glöder.",
  "Prata med alla – även de läskiga…",
];

const FACING_FROM_EDGE: Record<Edge, Facing> = { left: "right", right: "left", top: "down", bottom: "up" };

/** One room of a case: Nora walks around, jumps, uses things and finds clues. */
export class RoomScene extends Phaser.Scene {
  private room!: ParsedRoom;
  private player!: Player;
  private ester!: Ester;
  private esterCalled = false;
  private thingSprites: Phaser.GameObjects.Sprite[] = [];
  private glows = new Map<number, Phaser.GameObjects.GameObject[]>();
  private bubble!: Phaser.GameObjects.Image;
  private target: Target | null = null;
  private leaving = false;
  private entry: RoomSceneData = {};
  private keys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    use: Phaser.Input.Keyboard.Key[];
    book: Phaser.Input.Keyboard.Key;
    escape: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super("room");
  }

  private get state() {
    return session.state;
  }

  init(data: RoomSceneData): void {
    this.entry = data ?? {};
    this.leaving = false;
    this.glows = new Map();
  }

  create(): void {
    registerSprites(this);
    const roomId = this.entry.roomId ?? this.state.data.startRoom;
    this.room = parseRoom(this.state.data, roomId);
    drawRoom(this, this.room);

    // Clues lie on the floor; unfound ones glow softly.
    this.room.clues.forEach((c, index) => {
      const x = c.col * TILE + TILE / 2;
      const y = c.row * TILE + TILE / 2;
      const key = `${c.clue.sprite}-0`;
      this.add.image(x, y, key).setDepth(1);
      if (!this.state.hasClue(c.id)) this.glows.set(index, this.addGlow(x, y, key));
    });

    this.room.data.movers?.forEach((m) => this.addMover(m));

    this.thingSprites = this.room.things.map(({ col, row, thing }) => {
      const x = col * TILE + TILE / 2;
      const y = row * TILE + TILE;
      this.add.ellipse(x, y - 1, 12, 4, 0x000000, 0.25).setDepth(y - 0.5);
      return this.add.sprite(x, y, `${thing.sprite}-0`).setOrigin(0.5, 1).setDepth(y);
    });

    const from = this.entry.from;
    const start = from ? entryPoint(this.room, from) : (this.room.spawn ?? { col: 1, row: 1 });
    this.player = new Player(
      this,
      {
        canStand: (col, row, airborne) => this.canStand(col, row, airborne),
        isLowObstacle: (col, row) => isLowObstacle(tileAt(this.room, col, row)),
      },
      start.col * TILE + TILE / 2,
      start.row * TILE + TILE - 1,
      from ? FACING_FROM_EDGE[from] : "up",
    );

    // Ester appears just behind Nora.
    const behind = { up: [0, 14], down: [0, -14], left: [14, 0], right: [-14, 0] }[this.player.facing];
    const tile = (x: number, y: number) => tileAt(this.room, Math.floor(x / TILE), Math.floor(y / TILE));
    this.ester = new Ester(this, this.player.x + behind[0], this.player.y + behind[1], {
      isFloorAt: (x, y) => isWalkable(tile(x, y), false),
      isLowObstacleAt: (x, y) => isLowObstacle(tile(x, y)),
    });
    this.esterCalled = false;

    this.bubble = this.add.image(0, 0, "hintBubble-0").setOrigin(0.5, 1).setDepth(10_000).setVisible(false);

    const kb = this.input.keyboard!;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {
      up: kb.addKey(K.UP),
      down: kb.addKey(K.DOWN),
      left: kb.addKey(K.LEFT),
      right: kb.addKey(K.RIGHT),
      jump: kb.addKey(K.SPACE),
      use: [kb.addKey(K.CTRL), kb.addKey(K.E), kb.addKey(K.ENTER)],
      book: kb.addKey(K.B),
      escape: kb.addKey(K.ESC),
    };

    showHud(() => toggleNotebook(this.state));
    updateHud(this.state);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      hideHud();
      closeNotebook();
    });

    roomSign(this.room.data.name);
    if (!this.state.visitedRooms.has(roomId)) {
      this.state.visitedRooms.add(roomId);
      this.reward(visitedFlag(roomId));
    }
    this.cameras.main.fadeIn(180);
  }

  update(time: number, deltaMs: number): void {
    const dt = Math.min(deltaMs / 1000, 0.05);
    const JustDown = Phaser.Input.Keyboard.JustDown;
    const usePressed = this.keys.use.some((k) => JustDown(k));
    const jumpPressed = JustDown(this.keys.jump);
    const bookPressed = JustDown(this.keys.book);
    const escPressed = JustDown(this.keys.escape);

    if (isNotebookOpen()) {
      if (bookPressed || escPressed || usePressed) closeNotebook();
      this.idle(dt);
      return;
    }
    if (isDialogOpen()) {
      if (usePressed || jumpPressed) advanceDialog();
      this.idle(dt);
      return;
    }
    if (bookPressed) {
      toggleNotebook(this.state);
      return;
    }
    if (this.leaving) return;

    this.tickHintTimer(dt);

    const dx = (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);
    const dy = (this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0);
    this.player.update(dt, { dx, dy, jump: jumpPressed });
    this.ester.update(dt, time, this.player);

    if (!this.player.airborne && this.checkDoorway()) return;

    this.target = this.player.airborne ? null : this.findTarget();
    this.showBubble(time);
    if (usePressed && this.target) this.use(this.target);
  }

  /** A thin golden outline that pulses slowly on a clue that hasn't been found yet. */
  private addGlow(x: number, y: number, key: string): Phaser.GameObjects.GameObject[] {
    const outline = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].map(([dx, dy]) =>
      this.add
        .image(x + dx, y + dy, key)
        .setTint(0xffd66b)
        .setTintMode(Phaser.TintModes.FILL)
        .setDepth(0.9)
        .setAlpha(0.15),
    );
    this.tweens.add({ targets: outline, alpha: 0.9, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    return outline;
  }

  /** Something that drives around by itself, stopping now and then. */
  private addMover(m: Mover): void {
    const at = ([col, row]: [number, number]) => ({ x: col * TILE + TILE / 2, y: row * TILE + TILE - 2 });
    const start = at(m.path[0]);
    const sprite = this.add.sprite(start.x, start.y, `${m.sprite}-0`).setOrigin(0.5, 1).setDepth(start.y);
    const directional = this.anims.exists(`${m.sprite}-side`);
    const speed = m.speed ?? 30;
    const pause = m.pause ?? 2000;
    let i = 0;
    const next = () => {
      i = (i + 1) % m.path.length;
      const to = at(m.path[i]);
      const dx = to.x - sprite.x;
      const dy = to.y - sprite.y;
      let anim = m.sprite;
      if (directional) {
        anim = `${m.sprite}-${Math.abs(dx) >= Math.abs(dy) ? "side" : dy > 0 ? "down" : "up"}`;
        sprite.setFlipX(Math.abs(dx) >= Math.abs(dy) && dx < 0);
      } else if (dx !== 0) {
        sprite.setFlipX(dx < 0);
      }
      sprite.play(anim, true);
      this.tweens.add({
        targets: sprite,
        x: to.x,
        y: to.y,
        duration: (Math.hypot(dx, dy) / speed) * 1000,
        onUpdate: () => sprite.setDepth(sprite.y),
        onComplete: () => {
          sprite.stop();
          this.time.delayedCall(pause * (0.4 + Math.random() * 0.6), next);
        },
      });
    };
    this.time.delayedCall(pause * Math.random(), next);
  }

  private idle(dt: number): void {
    this.player.update(dt, { dx: 0, dy: 0, jump: false });
    this.ester.update(dt, this.time.now, this.player);
    this.bubble.setVisible(false);
  }

  /** When Nora has been stuck for a while, Ester calls for her. */
  private tickHintTimer(dt: number): void {
    const timer = session.hintTimer;
    timer.tick(dt);
    const ready = timer.ready && this.state.nextHintAvailable();
    this.ester.setAlert(ready);
    if (ready && !this.esterCalled) {
      this.esterCalled = true;
      toast("💬 Psst, Nora! Ester vill säga något!");
    }
    if (!ready) this.esterCalled = false;
  }

  private isDoorOpen(col: number, row: number): boolean {
    const door = doorAt(this.room, col, row);
    return !!door?.to && this.state.has(door.requires);
  }

  private canStand(col: number, row: number, airborne: boolean): boolean {
    const kind = tileAt(this.room, col, row);
    if (kind === "door") return this.isDoorOpen(col, row);
    return isWalkable(kind, airborne);
  }

  /** Walks through an open door into the next room. */
  private checkDoorway(): boolean {
    const { col, row } = this.player.feetTile();
    const door = doorAt(this.room, col, row);
    if (!door?.to || !this.isDoorOpen(col, row)) return false;
    this.leaving = true;
    this.cameras.main.fadeOut(180);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.restart({ roomId: door.to, from: OPPOSITE[door.at] } satisfies RoomSceneData);
    });
    return true;
  }

  /** The thing, clue or locked door closest to the point in front of Nora (forgiving on purpose). */
  private findTarget(): Target | null {
    const p = this.player.frontPoint();
    const reach = 13;
    const dist = (col: number, row: number) => Math.hypot(col * TILE + TILE / 2 - p.x, row * TILE + TILE / 2 - p.y);

    let best: Target | null = null;
    let bestDist = reach;
    const consider = (target: Target, col: number, row: number) => {
      const d = dist(col, row);
      if (d < bestDist) {
        best = target;
        bestDist = d;
      }
    };
    const esterDist = Math.hypot(this.ester.x - p.x, this.ester.y - 6 - p.y);
    if (esterDist < reach) {
      best = { kind: "ester" };
      bestDist = esterDist;
    }
    this.room.things.forEach((t, index) => consider({ kind: "thing", index }, t.col, t.row));
    this.room.clues.forEach((c, index) => consider({ kind: "clue", index }, c.col, c.row));

    // Nora can also stand on a clue, so check the tile under her feet too.
    const feet = this.player.feetTile();
    const under = this.room.clues.findIndex((c) => c.col === feet.col && c.row === feet.row);
    if (!best && under >= 0) best = { kind: "clue", index: under };
    if (best) return best;

    const c0 = Math.floor(p.x / TILE);
    const r0 = Math.floor(p.y / TILE);
    for (let row = r0 - 1; row <= r0 + 1; row++) {
      for (let col = c0 - 1; col <= c0 + 1; col++) {
        if (tileAt(this.room, col, row) === "door" && !this.isDoorOpen(col, row)) {
          consider({ kind: "door", col, row }, col, row);
        }
      }
    }
    return best;
  }

  /** The little "…" bubble above whatever Nora can use right now. */
  private showBubble(time: number): void {
    const target = this.target;
    if (!target) {
      this.bubble.setVisible(false);
      return;
    }
    const bob = Math.round(Math.sin(time / 200));
    if (target.kind === "ester") {
      this.bubble.setVisible(false);
      return;
    }
    if (target.kind === "thing") {
      const s = this.thingSprites[target.index];
      this.bubble.setPosition(s.x, s.y - s.height - 1 + bob);
    } else if (target.kind === "clue") {
      const c = this.room.clues[target.index];
      this.bubble.setPosition(c.col * TILE + TILE / 2, c.row * TILE + 2 + bob);
    } else {
      this.bubble.setPosition(target.col * TILE + TILE / 2, target.row * TILE - 1 + bob);
    }
    this.bubble.setVisible(true);
  }

  private use(target: Target): void {
    if (target.kind === "ester") {
      this.talkToEster();
    } else if (target.kind === "thing") {
      const { thing } = this.room.things[target.index];
      const talk = this.state.talkFor(thing);
      openDialog(thing.name, talk.talk, () => this.reward(talk.gives, talk.clue));
    } else if (target.kind === "clue") {
      const c = this.room.clues[target.index];
      openDialog(c.clue.name, [c.clue.text], () => {
        this.glows.get(target.index)?.forEach((o) => o.destroy());
        this.glows.delete(target.index);
        this.reward(undefined, c.id);
      });
    } else {
      const door = doorAt(this.room, target.col, target.row);
      openDialog("Nora", [door?.lockedText ?? "Dörren är låst."]);
    }
  }

  /** Ester gives a hint if Nora has been stuck long enough, otherwise she encourages her. */
  private talkToEster(): void {
    const timer = session.hintTimer;
    const goal = this.state.data.goals[this.state.currentGoalIndex()];
    if (timer.ready) {
      const hint = this.state.nextHint();
      if (hint) {
        timer.hintGiven();
        this.ester.setAlert(false);
        openDialog("Ester", ["Psst, Nora! Jag har en idé:", hint]);
        return;
      }
    }
    const cheer = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
    openDialog("Ester", goal ? [`Vi ska: ${goal.text.toLowerCase()}.`, cheer] : ["Vi klarade det, Nora!"]);
  }

  /** Gives flags/clues and tells the player about anything new. */
  private reward(gives?: Flags, clueId?: string): void {
    const goalBefore = this.state.currentGoalIndex();
    const added = this.state.give([...(Array.isArray(gives) ? gives : gives ? [gives] : []), ...(clueId ? [clueFlag(clueId)] : [])]);
    const { data } = this.state;
    if (added.length > 0) session.hintTimer.progress();

    for (const flag of added) {
      const item = data.items?.[flag];
      if (item) toast(`<img src="${spriteUrl(item.sprite)}" alt=""> Du fick: ${item.name}`);
      if (flag.startsWith("clue:")) {
        const clue = data.clues[flag.slice(5)];
        toast(`🔍 Ny ledtråd: ${clue.name}! <kbd>B</kbd>`);
      }
    }

    const goalAfter = this.state.currentGoalIndex();
    if (goalAfter > goalBefore && data.goals[goalAfter]) {
      window.setTimeout(() => toast(`➜ Nytt mål: ${data.goals[goalAfter].text}`), 700);
    }
    updateHud(this.state);
  }
}
