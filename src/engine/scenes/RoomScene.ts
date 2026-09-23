import * as Phaser from "phaser";
import { cases } from "../../cases";
import type { Room } from "../../cases/types";
import { hideControls, showControls } from "../../ui/controls";
import { advanceDialog, isDialogOpen, openDialog } from "../../ui/dialog";
import { TILE } from "../config";
import { Player } from "../Player";
import { type ParsedRoom, parseRoom, tileAt } from "../room";
import { drawRoom } from "../roomRenderer";
import { registerSprites } from "../textures";

type Target = { kind: "thing"; index: number } | { kind: "door"; col: number; row: number };

/** One room of a case: Nora walks around, jumps and uses things. */
export class RoomScene extends Phaser.Scene {
  private roomData!: Room;
  private room!: ParsedRoom;
  private player!: Player;
  private thingSprites: Phaser.GameObjects.Sprite[] = [];
  private bubble!: Phaser.GameObjects.Image;
  private target: Target | null = null;
  private keys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    use: Phaser.Input.Keyboard.Key[];
  };

  constructor() {
    super("room");
  }

  create(): void {
    registerSprites(this);
    const c = cases[0];
    this.roomData = c.rooms[c.startRoom];
    this.room = parseRoom(this.roomData);
    drawRoom(this, this.room);

    this.thingSprites = this.room.things.map(({ col, row, thing }) => {
      const x = col * TILE + TILE / 2;
      const y = row * TILE + TILE;
      this.add.ellipse(x, y - 1, 12, 4, 0x000000, 0.25).setDepth(y - 0.5);
      return this.add.sprite(x, y, `${thing.sprite}-0`).setOrigin(0.5, 1).setDepth(y);
    });

    const spawn = this.room.spawn ?? { col: 1, row: 1 };
    this.player = new Player(this, this.room, spawn.col * TILE + TILE / 2, spawn.row * TILE + TILE - 1);

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
    };

    showControls();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, hideControls);
  }

  update(time: number, deltaMs: number): void {
    const dt = Math.min(deltaMs / 1000, 0.05);
    const usePressed = this.keys.use.some((k) => Phaser.Input.Keyboard.JustDown(k));
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.jump);

    if (isDialogOpen()) {
      if (usePressed || jumpPressed) advanceDialog();
      this.player.update(dt, { dx: 0, dy: 0, jump: false });
      this.bubble.setVisible(false);
      return;
    }

    const dx = (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);
    const dy = (this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0);
    this.player.update(dt, { dx, dy, jump: jumpPressed });

    this.target = this.player.airborne ? null : this.findTarget();
    this.showBubble(time);
    if (usePressed && this.target) this.use(this.target);
  }

  /** The thing or door closest to the point in front of Nora (forgiving on purpose). */
  private findTarget(): Target | null {
    const p = this.player.frontPoint();
    const reach = 13;
    const dist = (col: number, row: number) =>
      Math.hypot(col * TILE + TILE / 2 - p.x, row * TILE + TILE / 2 - p.y);

    let best: Target | null = null;
    let bestDist = reach;
    this.room.things.forEach((t, index) => {
      const d = dist(t.col, t.row);
      if (d < bestDist) {
        best = { kind: "thing", index };
        bestDist = d;
      }
    });
    if (best) return best;

    const c0 = Math.floor(p.x / TILE);
    const r0 = Math.floor(p.y / TILE);
    for (let row = r0 - 1; row <= r0 + 1; row++) {
      for (let col = c0 - 1; col <= c0 + 1; col++) {
        if (tileAt(this.room, col, row) === "door" && dist(col, row) < bestDist) {
          best = { kind: "door", col, row };
          bestDist = dist(col, row);
        }
      }
    }
    return best;
  }

  /** The little "…" bubble above whatever Nora can use right now. */
  private showBubble(time: number): void {
    if (!this.target) {
      this.bubble.setVisible(false);
      return;
    }
    const bob = Math.round(Math.sin(time / 200));
    if (this.target.kind === "thing") {
      const s = this.thingSprites[this.target.index];
      this.bubble.setPosition(s.x, s.y - s.height - 1 + bob);
    } else {
      this.bubble.setPosition(this.target.col * TILE + TILE / 2, this.target.row * TILE - 1 + bob);
    }
    this.bubble.setVisible(true);
  }

  private use(target: Target): void {
    if (target.kind === "thing") {
      const { thing } = this.room.things[target.index];
      openDialog(thing.name, thing.talk);
    } else {
      openDialog("Nora", [this.roomData.doors?.lockedText ?? "Dörren är låst."]);
    }
  }
}
