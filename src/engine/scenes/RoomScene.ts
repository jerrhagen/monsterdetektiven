import * as Phaser from "phaser";
import type { Edge, FinaleStep, Flags, Mover, Puzzle, Thing } from "../../cases/types";
import { isCaseScreenOpen, showCaseIntro, showCaseResult, showLeaveCase } from "../../ui/caseScreens";
import { advanceDialog, dismissDialog, isDialogOpen, openDialog } from "../../ui/dialog";
import { hideHud, setHudRoomClues, showHud, updateHud, updateMusicButton } from "../../ui/hud";
import { toggleMusic } from "../../ui/music";
import { closeNotebook, isNotebookOpen, toggleNotebook } from "../../ui/notebook";
import { closePuzzle, isPuzzleOpen, openPuzzle } from "../../ui/puzzle";
import { spriteUrl } from "../../ui/spriteImage";
import { playClick, playScare, playSuccess } from "../../ui/sound";
import { roomSign, toast } from "../../ui/toast";
import {
  type ActionIcon,
  hideTouchControls,
  setActionIcon,
  setTouchControlsVisible,
  showTouchControls,
  takeAction,
  touchInput,
} from "../../ui/touch";
import { clueFlag, flagList } from "../caseState";
import { TILE } from "../config";
import { Ester } from "../Ester";
import { CAUGHT_FLAG, Crawler, type Monster, createMonster } from "../monsters";
import { type Facing, Player } from "../Player";
import {
  OPPOSITE,
  type ParsedRoom,
  cluesInRoom,
  doorAt,
  entryPoint,
  isLowObstacle,
  isWalkable,
  parseRoom,
  tileAt,
  visitedFlag,
} from "../room";
import { drawRoom } from "../roomRenderer";
import { recordSolved, starsFor } from "../save";
import { MAGNIFIER, newGame, session } from "../session";
import { registerSprites } from "../textures";

/** Pixels a thing on a counter is lifted, so it stands on the counter top. */
const ON_TOP_LIFT = 6;

type Target =
  | { kind: "ester" }
  | { kind: "thing"; index: number }
  | { kind: "monster"; index: number }
  | { kind: "clue"; index: number }
  | { kind: "shelf"; col: number; row: number }
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
  private monsters: Monster[] = [];
  /** Nora can't be caught again before this time (ms). */
  private graceUntil = 0;
  private carried = false;
  /** Where Nora came in – a flying monster carries her back here. */
  private home = { x: 0, y: 0 };
  private esterOffset = { x: 0, y: 0 };
  private pickup: Phaser.GameObjects.GameObject[] = [];
  private thingShadows: Phaser.GameObjects.Ellipse[] = [];
  /** Glowing outlines on things (not people) that have something new. */
  private thingGlows = new Map<number, Phaser.GameObjects.GameObject[]>();
  /** The grey filter for faded rooms (season 2). */
  private fadeFilter?: Phaser.Filters.ColorMatrix;
  /** Speech bubbles over people who have something new to say. */
  private thingBubbles = new Map<number, Phaser.GameObjects.Image>();
  /** True while the ending plays – no walking, no monsters. */
  private cutscene = false;
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
    this.carried = false;
    this.graceUntil = 0;
    this.pickup = [];
    this.cutscene = false;
    this.thingGlows = new Map();
    this.thingBubbles = new Map();
    this.fadeFilter = undefined;
  }

  create(): void {
    registerSprites(this);
    const roomId = this.entry.roomId ?? this.state.data.startRoom;
    this.room = parseRoom(this.state.data, roomId);
    drawRoom(this, this.room);
    this.applyFade(this.room.data.faded ?? 0);

    // Clues lie on the floor; unfound ones glow softly.
    this.room.clues.forEach((c, index) => {
      const x = c.col * TILE + TILE / 2;
      const y = c.row * TILE + TILE / 2;
      const key = `${c.clue.sprite}-0`;
      this.add.image(x, y, key).setDepth(1);
      if (!this.state.hasClue(c.id)) this.glows.set(index, this.addGlow(x, y, key));
    });

    this.room.data.movers?.forEach((m) => this.addMover(m));

    this.thingShadows = [];
    this.thingSprites = this.room.things.map(({ col, row, thing }) => {
      const x = col * TILE + TILE / 2;
      const y = row * TILE + TILE;
      // Something standing on a counter or a shelf sits on its top surface, without a floor shadow.
      const lift = thing.on ? ON_TOP_LIFT : 0;
      this.thingShadows.push(this.add.ellipse(x, y - 1, 12, 4, 0x000000, thing.on ? 0 : 0.25).setDepth(y - 0.5));
      return this.add.sprite(x, y - lift, `${thing.sprite}-0`).setOrigin(0.5, 1).setDepth(y);
    });
    this.updateHiddenThings();

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
    this.esterOffset = { x: behind[0], y: behind[1] };
    const tile = (x: number, y: number) => tileAt(this.room, Math.floor(x / TILE), Math.floor(y / TILE));
    this.ester = new Ester(this, this.player.x + behind[0], this.player.y + behind[1], {
      isFloorAt: (x, y) => isWalkable(tile(x, y), false),
      isLowObstacleAt: (x, y) => isLowObstacle(tile(x, y)),
    });
    this.esterCalled = false;
    this.home = { x: this.player.x, y: this.player.y };

    this.monsters = (this.room.data.monsters ?? []).map((def) =>
      createMonster(this, def, {
        nora: () => this.player,
        canCatch: () => this.canBeCaught(),
        caught: (m) => this.caughtBy(m),
        has: (flags) => this.state.has(flags),
        give: (flag) => this.state.give(flag),
        startle: (text) => {
          this.cameras.main.shake(200, 0.008);
          playScare();
          toast(text, 1200, "scare");
        },
        isNoraHiddenFrom: (x, y) => this.isNoraHiddenFrom(x, y),
        isNoraSafe: () => this.isNoraNextToSomeone(),
      }),
    );

    const dropped = session.dropped;
    if (dropped?.roomId === roomId) this.showPickup(dropped.x, dropped.y);

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
    const onMusicKey = () => {
      toggleMusic();
      updateMusicButton();
    };
    kb.on("keydown-M", onMusicKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => kb.off("keydown-M", onMusicKey));

    showHud(
      () => toggleNotebook(this.state),
      () => {
        if (!this.cutscene) showLeaveCase(() => this.scene.start("map"));
      },
    );
    setHudRoomClues(cluesInRoom(this.state.data, roomId));
    updateHud(this.state);
    showTouchControls();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      hideHud();
      dismissDialog();
      closeNotebook();
      closePuzzle();
      hideTouchControls();
    });

    const enter = () => {
      roomSign(this.room.data.name);
      if (this.state.visitedRooms.has(roomId)) return;
      this.state.visitedRooms.add(roomId);
      this.reward(visitedFlag(roomId));
      const onEnter = this.room.data.onEnter;
      if (onEnter) {
        this.time.delayedCall(600, () =>
          openDialog(onEnter.name, onEnter.talk, () => this.reward(onEnter.gives, onEnter.clue)),
        );
      }
    };
    if (session.started) {
      enter();
    } else {
      showCaseIntro(this.state.data, () => {
        session.started = true;
        session.startedAt = Date.now();
        session.hintTimer.progress();
        enter();
      });
    }
    this.cameras.main.fadeIn(180);
  }

  update(time: number, deltaMs: number): void {
    const dt = Math.min(deltaMs / 1000, 0.05);
    const JustDown = Phaser.Input.Keyboard.JustDown;
    const usePressed = this.keys.use.some((k) => JustDown(k));
    // The touch screen's action button works just like the space bar.
    const jumpPressed = JustDown(this.keys.jump) || takeAction();
    const bookPressed = JustDown(this.keys.book);
    const escPressed = JustDown(this.keys.escape);

    // While someone talks (or a puzzle, the book or the ending is open), the bubbles keep quiet.
    const quiet = isPuzzleOpen() || isCaseScreenOpen() || isNotebookOpen() || isDialogOpen() || this.cutscene;
    this.thingBubbles.forEach((b) => b.setVisible(!quiet));
    if (quiet) this.bubble.setVisible(false);
    setTouchControlsVisible(!(isPuzzleOpen() || isCaseScreenOpen() || isNotebookOpen()));
    if (isDialogOpen()) setActionIcon("next");

    if (isPuzzleOpen() || isCaseScreenOpen()) {
      this.idle(dt);
      return;
    }
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
    if (this.cutscene) {
      this.idle(dt);
      return;
    }
    if (this.carried) {
      this.ester.update(dt, time, this.player);
      return;
    }

    this.tickHintTimer(dt);

    const clamp = (n: number) => Math.max(-1, Math.min(1, n));
    const dx = clamp((this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0) + touchInput.dx);
    const dy = clamp((this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0) + touchInput.dy);
    // Space does what makes sense: next to someone or something it talks or looks – otherwise Nora jumps.
    const spaceUses = jumpPressed && this.target !== null && !this.player.airborne;
    this.player.update(dt, { dx, dy, jump: jumpPressed && !spaceUses });
    this.ester.update(dt, time, this.player);
    for (const m of this.monsters) m.update(dt, time);
    if (this.carried) return;
    this.player.sprite.setAlpha(time < this.graceUntil && Math.floor(time / 120) % 2 ? 0.35 : 1);
    this.checkPickup();

    if (!this.player.airborne && this.checkDoorway()) return;

    this.target = this.player.airborne ? null : this.findTarget();
    this.showBubble(time);
    setActionIcon(this.actionIcon(this.target));
    if ((usePressed || spaceUses) && this.target) this.use(this.target);
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
    this.room.things.forEach((t, index) => {
      if (!this.isThingHidden(index)) consider({ kind: "thing", index }, t.col, t.row);
    });
    this.monsters.forEach((m, index) => {
      if (!m.thing || m.canTalk?.() === false) return;
      const d = Math.hypot(m.x - p.x, m.y - 6 - p.y);
      if (d < bestDist) {
        best = { kind: "monster", index };
        bestDist = d;
      }
    });
    this.room.clues.forEach((c, index) => consider({ kind: "clue", index }, c.col, c.row));

    // Nora can also stand on a clue, so check the tile under her feet too.
    const feet = this.player.feetTile();
    const under = this.room.clues.findIndex((c) => c.col === feet.col && c.row === feet.row);
    if (!best && under >= 0) best = { kind: "clue", index: under };
    if (best) return best;

    const c0 = Math.floor(p.x / TILE);
    const r0 = Math.floor(p.y / TILE);
    const hunting = this.hidingCrawler() !== undefined;
    for (let row = r0 - 1; row <= r0 + 1; row++) {
      for (let col = c0 - 1; col <= c0 + 1; col++) {
        const kind = tileAt(this.room, col, row);
        if (kind === "door" && !this.isDoorOpen(col, row)) consider({ kind: "door", col, row }, col, row);
        if (kind === "shelf" && hunting) consider({ kind: "shelf", col, row }, col, row);
      }
    }
    return best;
  }

  /** The little "…" bubble above whatever Nora can use right now. */
  private showBubble(time: number): void {
    const bob = Math.round(Math.sin(time / 200));
    this.thingBubbles.forEach((b, i) => {
      const s = this.thingSprites[i];
      b.setPosition(s.x, s.y - s.height - 1 + bob);
    });
    const target = this.target;
    if (!target) {
      this.bubble.setVisible(false);
      return;
    }
    if (target.kind === "ester") {
      this.bubble.setVisible(false);
      return;
    }
    const looking =
      target.kind === "clue" || target.kind === "shelf" || (target.kind === "thing" && !this.room.things[target.index].thing.person);
    this.bubble.setTexture(looking ? "lookBubble-0" : "hintBubble-0");
    const ownBubble =
      (target.kind === "thing" && this.thingBubbles.has(target.index)) ||
      (target.kind === "monster" && !!this.monsters[target.index].showsTalkHint?.());
    if (ownBubble) {
      this.bubble.setVisible(false);
      return;
    }
    if (target.kind === "thing" || target.kind === "monster") {
      const s = target.kind === "thing" ? this.thingSprites[target.index] : this.monsters[target.index].sprite;
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
      this.useThing(this.room.things[target.index].thing, this.thingKey(target.index));
    } else if (target.kind === "monster") {
      const thing = this.monsters[target.index].thing;
      if (thing) this.useThing(thing);
    } else if (target.kind === "clue") {
      const c = this.room.clues[target.index];
      if (!this.state.has(MAGNIFIER)) {
        openDialog("Nora", ["Jag ser inte ordentligt utan mitt förstoringsglas…", "Var tappade jag det?"]);
        return;
      }
      openDialog(c.clue.name, [c.clue.text], () => {
        this.glows.get(target.index)?.forEach((o) => o.destroy());
        this.glows.delete(target.index);
        this.reward(undefined, c.id);
      });
    } else if (target.kind === "shelf") {
      this.searchShelf(target.col, target.row);
    } else {
      const door = doorAt(this.room, target.col, target.row);
      const puzzle = this.openPuzzleFor(door?.puzzle);
      openDialog("Nora", [door?.lockedText ?? "Dörren är låst."], () => {
        if (puzzle) this.startPuzzle(puzzle, () => toast("🔓 Dörren är öppen!"));
      });
    }
  }

  /** A puzzle that hasn't been solved yet, or undefined. */
  private openPuzzleFor(id?: string): Puzzle | undefined {
    const puzzle = id ? this.state.puzzle(id) : undefined;
    return puzzle && !this.state.has(puzzle.gives) ? puzzle : undefined;
  }

  /** Talk to a thing – or, if it has an unsolved puzzle that's ready, start that. */
  private useThing(thing: Thing, key?: string): void {
    const puzzle = this.openPuzzleFor(thing.puzzle);
    if (puzzle && this.state.has(thing.puzzleWhen)) {
      const intro = thing.puzzleIntro ?? this.state.talkFor(thing).talk;
      openDialog(thing.name, intro, () =>
        // Afterwards the thing says what it says now that the puzzle is solved.
        this.startPuzzle(puzzle, () => this.useThing(thing, key)),
      );
      return;
    }
    const talk = this.state.talkFor(thing);
    openDialog(thing.name, talk.talk, () => {
      this.reward(talk.gives, talk.clue);
      // Remember what it said now, after its flags – so the bubble only comes back with news.
      if (key) this.state.markHeard(key, thing);
      this.updateHiddenThings();
    });
  }

  /** What the touch screen's action button does next to this target. */
  private actionIcon(target: Target | null): ActionIcon {
    if (!target) return "jump";
    if (target.kind === "ester" || target.kind === "monster") return "talk";
    if (target.kind === "thing" && this.room.things[target.index].thing.person) return "talk";
    return "look";
  }

  /** Identifies a thing across visits to the room. */
  private thingKey(index: number): string {
    const { col, row } = this.room.things[index];
    return `${this.room.id}:${col},${row}`;
  }

  private startPuzzle(puzzle: Puzzle, after: () => void): void {
    openPuzzle(puzzle, this.state, () => {
      this.reward(puzzle.gives);
      after();
    });
  }

  /** Ester gives a hint if Nora has been stuck long enough, otherwise she encourages her. */
  private talkToEster(): void {
    if (!this.state.has(MAGNIFIER) && session.dropped) {
      openDialog("Ester", ["Ditt förstoringsglas! Jag såg var det landade.", "Det glimmar där borta – gå dit och plocka upp det!"]);
      return;
    }
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

  private isThingHidden(index: number): boolean {
    const { hideWhen } = this.room.things[index].thing;
    return hideWhen !== undefined && this.state.has(hideWhen);
  }

  /**
   * Things with `hideWhen` disappear once it's true (e.g. a found egg). Things with something
   * new glow softly – people instead get a speech bubble, and nothing glows once it's all heard.
   */
  private updateHiddenThings(): void {
    this.thingSprites.forEach((s, i) => {
      const hidden = this.isThingHidden(i);
      s.setVisible(!hidden);
      this.thingShadows[i]?.setVisible(!hidden);

      const { thing } = this.room.things[i];
      const news = !hidden && this.state.hasNews(this.thingKey(i), thing);
      const bubble = this.thingBubbles.get(i);
      const glow = this.thingGlows.get(i);
      if (thing.person && news && !bubble) {
        this.thingBubbles.set(i, this.add.image(s.x, s.y - s.height - 1, "hintBubble-0").setOrigin(0.5, 1).setDepth(9999));
      } else if (!(thing.person && news) && bubble) {
        bubble.destroy();
        this.thingBubbles.delete(i);
      }
      if (!thing.person && news && !glow) {
        const g = this.addGlow(s.x, s.y - s.height / 2, `${thing.sprite}-0`);
        g.forEach((o) => (o as Phaser.GameObjects.Image).setDepth(s.depth - 0.1));
        this.thingGlows.set(i, g);
      } else if (!(!thing.person && news) && glow) {
        glow.forEach((o) => o.destroy());
        this.thingGlows.delete(i);
      }
    });
  }

  /** The crawler, if it's hiding in a shelf right now (the end of the case). */
  private hidingCrawler(): Crawler | undefined {
    return this.monsters.find((m): m is Crawler => m instanceof Crawler && m.shelter >= 0);
  }

  /** All shelf tiles connected to (col, row) – one piece of furniture. */
  private shelfGroup(col: number, row: number): Set<string> {
    const group = new Set<string>();
    const stack = [[col, row]];
    while (stack.length) {
      const [c, r] = stack.pop()!;
      const key = `${c},${r}`;
      if (group.has(key) || tileAt(this.room, c, r) !== "shelf") continue;
      group.add(key);
      stack.push([c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]);
    }
    return group;
  }

  /** Nora looks in a shelf: is the culprit hiding there? */
  private searchShelf(col: number, row: number): void {
    const crawler = this.hidingCrawler();
    if (!crawler) return;
    const [sc, sr] = crawler.shelters[crawler.shelter];
    if (this.shelfGroup(col, row).has(`${sc},${sr}`)) {
      void this.playFinale({ crawler, col: sc, row: sr });
    } else {
      openDialog("Nora", ["Ingenting här…", "Var är det som skakar?"]);
    }
  }

  private say(name: string, lines: string[]): Promise<void> {
    return new Promise((done) => openDialog(name, lines, done));
  }

  private tweenTo(target: Phaser.GameObjects.Components.Transform, x: number, y: number, ms: number): Promise<void> {
    return new Promise((done) => this.tweens.add({ targets: target, x, y, duration: ms, onComplete: () => done() }));
  }

  /**
   * The culprit is caught: play the case's ending, then show the result.
   * Either Nora found a hiding crawler (it comes out as the actor "culprit"),
   * or something else gave the "caught" flag (a puzzle, a talk…).
   */
  private async playFinale(hiding?: { crawler: Crawler; col: number; row: number }): Promise<void> {
    if (this.cutscene) return;
    this.cutscene = true;
    this.bubble.setVisible(false);
    if (!this.state.has(CAUGHT_FLAG)) this.reward(CAUGHT_FLAG);
    playSuccess();

    const actors = new Map<string, Phaser.GameObjects.Sprite>([
      ["nora", this.player.sprite],
      ["ester", this.ester.sprite],
    ]);
    if (hiding) {
      // Out it comes!
      const { crawler, col, row } = hiding;
      crawler.vanish();
      const key = crawler.sprite.texture.key;
      const culprit = this.add.sprite(col * TILE + TILE / 2, row * TILE + TILE / 2, key).setDepth(9000);
      culprit.play(key.replace(/-\d+$/, ""), true);
      actors.set("culprit", culprit);
      await this.tweenTo(culprit, this.player.x + 14, this.player.y - 4, 600);
      culprit.stop();
    }

    for (const step of this.state.data.finale) await this.finaleStep(step, actors);
    if (this.state.data.summary.length) await this.say("Ester", this.state.data.summary);

    this.cutscene = false;
    this.showResult();
  }

  private async finaleStep(step: FinaleStep, actors: Map<string, Phaser.GameObjects.Sprite>): Promise<void> {
    if ("say" in step) {
      await this.say(step.say, step.lines);
    } else if ("enter" in step) {
      const [fc, fr] = step.from;
      const [tc, tr] = step.to;
      const sprite = this.add
        .sprite(fc * TILE + TILE / 2, fr * TILE + TILE, `${step.sprite}-0`)
        .setOrigin(0.5, 1)
        .setDepth(tr * TILE + TILE);
      actors.set(step.enter, sprite);
      const bob = this.tweens.add({ targets: sprite, scaleY: 0.92, duration: 150, yoyo: true, repeat: -1 });
      await this.tweenTo(sprite, tc * TILE + TILE / 2, tr * TILE + TILE, 1500);
      bob.stop();
      sprite.setScale(1);
    } else if ("frame" in step) {
      const sprite = actors.get(step.frame);
      sprite?.setTexture(sprite.texture.key.replace(/-\d+$/, `-${step.index}`));
    } else if ("flash" in step) {
      this.cameras.main.flash(500, 255, 255, 255);
      for (let i = 0; i < 4; i++) this.time.delayedCall(i * 120, playClick);
      await new Promise((done) => this.time.delayedCall(700, done));
    } else if ("hide" in step) {
      actors.get(step.hide)?.destroy();
      actors.delete(step.hide);
    } else if ("reveal" in step) {
      const near = actors.get(step.reveal) ?? this.player.sprite;
      const item = this.add.image(near.x + 12, near.y - 2, `${step.sprite}-0`).setDepth(9500).setAlpha(0);
      this.tweens.add({ targets: item, alpha: 1, y: near.y - 8, duration: 700 });
      this.tweens.add({ targets: item, scale: 1.2, duration: 600, yoyo: true, repeat: -1, delay: 700 });
      this.cameras.main.flash(300, 184, 240, 255);
      playSuccess();
      await new Promise((done) => this.time.delayedCall(900, done));
    } else if ("give" in step) {
      this.reward(step.give);
    } else if ("recolor" in step) {
      // The colour flows back in (season 2).
      this.cameras.main.flash(600, 255, 255, 255);
      await new Promise<void>((done) =>
        this.tweens.addCounter({
          from: this.room.data.faded ?? 0,
          to: 0,
          duration: 1500,
          onUpdate: (tween) => this.applyFade(tween.getValue() ?? 0),
          onComplete: () => done(),
        }),
      );
    }
  }

  /** Season 2: the colours are draining away – draw the room this much greyer (0–1). */
  private applyFade(amount: number): void {
    const camera = this.cameras.main;
    if (!this.fadeFilter && amount <= 0) return;
    this.fadeFilter ??= camera.filters.internal.addColorMatrix();
    this.fadeFilter.colorMatrix.reset();
    this.fadeFilter.colorMatrix.saturate(-amount);
  }

  /** Stars, time and monster cards – and remember them. */
  private showResult(): void {
    const { state } = session;
    const seconds = (Date.now() - session.startedAt) / 1000;
    const egg = state.has("egg");
    const result = recordSolved(
      state.data.id,
      { stars: starsFor(state.hintsUsed, egg), seconds, egg },
      state.data.cards.map((c) => c.name),
    );
    showCaseResult(state.data, result, { hintsUsed: state.hintsUsed }, {
      again: () => {
        newGame(session.caseIndex);
        this.scene.restart({});
      },
      map: () => this.scene.start("map"),
    });
  }

  /** Is Nora standing right next to a person (someone to talk to, who is there right now)? */
  private isNoraNextToSomeone(): boolean {
    return this.room.things.some(
      ({ col, row, thing }, i) =>
        thing.person &&
        !this.isThingHidden(i) &&
        Math.hypot(this.player.x - (col * TILE + TILE / 2), this.player.y - (row * TILE + TILE / 2)) < TILE * 1.6,
    );
  }

  /** Is there a crate, shelf, counter or tree on the straight line between (x, y) and Nora? */
  private isNoraHiddenFrom(x: number, y: number): boolean {
    const nx = this.player.x;
    const ny = this.player.y - 3;
    const fromCol = Math.floor(x / TILE);
    const fromRow = Math.floor(y / TILE);
    const steps = Math.ceil(Math.hypot(nx - x, ny - y) / 4);
    for (let i = 1; i < steps; i++) {
      const col = Math.floor((x + ((nx - x) * i) / steps) / TILE);
      const row = Math.floor((y + ((ny - y) * i) / steps) / TILE);
      // The crate the flyer is hovering over doesn't count – only cover in between.
      if (col === fromCol && row === fromRow) continue;
      const kind = tileAt(this.room, col, row);
      if (kind === "crate" || kind === "shelf" || kind === "counter" || kind === "tree") return true;
    }
    return false;
  }

  private canBeCaught(): boolean {
    return (
      !this.carried &&
      !this.leaving &&
      this.time.now > this.graceUntil &&
      !isDialogOpen() &&
      !isPuzzleOpen() &&
      !isNotebookOpen()
    );
  }

  /** A monster got Nora: a scare, she drops the magnifying glass, and flyers carry her off. */
  private caughtBy(monster: Monster): void {
    this.graceUntil = this.time.now + 4000;
    this.cameras.main.shake(300, 0.012);
    playScare();
    toast(monster.cry ?? (monster.kind === "flyer" ? "IIIIIK!" : "BUUU!"), 1400, "scare");
    const at = { x: this.player.x, y: this.player.y };
    this.dropMagnifier(at);

    if (monster.kind !== "flyer") {
      monster.retreat();
      return;
    }
    // Carried through the air back to the door.
    this.carried = true;
    const from = { ...at };
    const progress = { t: 0 };
    this.tweens.add({
      targets: progress,
      t: 1,
      duration: 1500,
      ease: "Sine.InOut",
      onUpdate: () => {
        const x = from.x + (this.home.x - from.x) * progress.t;
        const y = from.y + (this.home.y - from.y) * progress.t;
        const lift = Math.sin(progress.t * Math.PI) * 14 + 4;
        this.player.place(x, y, lift);
        monster.x = x;
        monster.y = y;
        monster.sprite.setPosition(Math.round(x), Math.round(y - lift - 18));
      },
      onComplete: () => {
        this.player.place(this.home.x, this.home.y, 0);
        this.ester.jumpTo(this.home.x + this.esterOffset.x, this.home.y + this.esterOffset.y);
        this.carried = false;
        this.graceUntil = this.time.now + 3000;
        monster.retreat();
      },
    });
  }

  /** Nora drops her magnifying glass; it bounces to a nearby spot she can reach. */
  private dropMagnifier(at: { x: number; y: number }): void {
    if (!this.state.has(MAGNIFIER)) return;
    this.state.take(MAGNIFIER);
    const spot = this.dropSpot(at);
    session.dropped = { roomId: this.room.id, x: spot.x, y: spot.y };
    this.showPickup(spot.x, spot.y, at);
    window.setTimeout(() => toast("🔍 Nora tappade förstoringsglaset!"), 900);
    updateHud(this.state);
  }

  /** A random floor tile 1–3 steps away from Nora that she can walk to. */
  private dropSpot(at: { x: number; y: number }): { x: number; y: number } {
    const startCol = Math.floor(at.x / TILE);
    const startRow = Math.floor((at.y - 3) / TILE);
    const key = (c: number, r: number) => `${c},${r}`;
    const seen = new Set([key(startCol, startRow)]);
    let frontier = [{ col: startCol, row: startRow }];
    const candidates: { col: number; row: number }[] = [];
    for (let depth = 1; depth <= 3; depth++) {
      const next: typeof frontier = [];
      for (const { col, row } of frontier) {
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const c = col + dc;
          const r = row + dr;
          if (seen.has(key(c, r)) || !isWalkable(tileAt(this.room, c, r), false)) continue;
          seen.add(key(c, r));
          next.push({ col: c, row: r });
          if (!this.room.clues.some((cl) => cl.col === c && cl.row === r)) candidates.push({ col: c, row: r });
        }
      }
      frontier = next;
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)] ?? { col: startCol, row: startRow };
    return { x: pick.col * TILE + TILE / 2, y: pick.row * TILE + TILE / 2 };
  }

  private showPickup(x: number, y: number, from?: { x: number; y: number }): void {
    const image = this.add.image(from?.x ?? x, from?.y ?? y, `${MAGNIFIER}-0`).setDepth(2);
    this.pickup = [image];
    const settle = () => this.pickup.push(...this.addGlow(x, y, `${MAGNIFIER}-0`));
    if (!from) {
      settle();
      return;
    }
    // Bounce in an arc from Nora to where it lands.
    const arc = { t: 0 };
    this.tweens.add({
      targets: arc,
      t: 1,
      duration: 700,
      onUpdate: () => {
        image.setPosition(from.x + (x - from.x) * arc.t, from.y + (y - from.y) * arc.t - Math.sin(arc.t * Math.PI) * 18);
        image.setAngle(arc.t * 540);
      },
      onComplete: () => {
        image.setAngle(0);
        settle();
      },
    });
  }

  /** Walking over the dropped magnifying glass picks it up. */
  private checkPickup(): void {
    const dropped = session.dropped;
    if (!dropped || dropped.roomId !== this.room.id || this.pickup.length < 2) return;
    if (Math.hypot(this.player.x - dropped.x, this.player.y - 4 - dropped.y) > 10) return;
    this.pickup.forEach((o) => o.destroy());
    this.pickup = [];
    session.dropped = null;
    this.state.give(MAGNIFIER);
    playClick();
    toast("🔍 Du hittade förstoringsglaset!");
    updateHud(this.state);
  }

  /** Gives flags/clues and tells the player about anything new. */
  private reward(gives?: Flags, clues?: string | string[]): void {
    const goalBefore = this.state.currentGoalIndex();
    const added = this.state.give([...flagList(gives), ...flagList(clues).map(clueFlag)]);
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

    // Caught some other way than in a shelf (a puzzle, a talk…) – on to the ending.
    if (added.includes(CAUGHT_FLAG) && !this.cutscene) {
      window.setTimeout(() => void this.playFinale(), 300);
    }

    const goalAfter = this.state.currentGoalIndex();
    if (goalAfter > goalBefore && data.goals[goalAfter]) {
      window.setTimeout(() => toast(`➜ Nytt mål: ${data.goals[goalAfter].text}`), 700);
    }
    updateHud(this.state);
    this.updateHiddenThings();
  }
}
