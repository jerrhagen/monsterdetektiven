import * as Phaser from "phaser";
import { cases } from "../../cases";
import { MAP_SPOTS, hideCityMap, showCityMap } from "../../ui/cityMap";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { isUnlocked, loadSave } from "../save";
import { newGame, session } from "../session";
import { registerSprites } from "../textures";

const GRASS = 0x3f7a3a;
const ROAD = 0xc9a86a;

/** The town map: choose which case to play. */
export class MapScene extends Phaser.Scene {
  private marker!: Phaser.GameObjects.Sprite;

  constructor() {
    super("map");
  }

  create(): void {
    registerSprites(this);
    this.input.keyboard!.clearCaptures();
    this.drawTown();

    const save = loadSave();
    const ids = cases.map((c) => c.id);
    // Start on the newest case the player can play.
    let selected = session.caseIndex;
    if (!save.cases[ids[selected]]) {
      selected = Math.max(0, ...cases.map((_, i) => i).filter((i) => isUnlocked(ids, i, save)));
    }

    this.marker = this.add.sprite(0, 0, "nora-0").setOrigin(0.5, 1).setDepth(100);
    this.moveMarker(selected, false);

    showCityMap(selected, {
      play: (index) => {
        newGame(index);
        this.scene.start("room", {});
      },
      select: (index) => this.moveMarker(index, true),
      players: () => this.scene.start("title"),
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, hideCityMap);
    this.cameras.main.fadeIn(200);
  }

  private moveMarker(index: number, animate: boolean): void {
    const spot = MAP_SPOTS[index];
    const x = spot.x;
    const y = spot.y + 2;
    this.tweens.killTweensOf(this.marker);
    if (animate) this.tweens.add({ targets: this.marker, x, y, duration: 250, ease: "Sine.Out" });
    else this.marker.setPosition(x, y);
  }

  /** Grass, roads and a little building for each place. */
  private drawTown(): void {
    const g = this.add.graphics();
    g.fillStyle(GRASS).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    for (let i = 0; i < 160; i++) {
      const x = (i * 97) % GAME_WIDTH;
      const y = (i * 53) % GAME_HEIGHT;
      g.fillStyle(i % 2 ? 0x4e9a3e : 0x34682f).fillRect(x, y, 2, 1);
    }

    // Roads between the places, in order.
    g.lineStyle(6, ROAD);
    for (let i = 0; i < MAP_SPOTS.length - 1; i++) {
      const a = MAP_SPOTS[i];
      const b = MAP_SPOTS[i + 1];
      g.lineBetween(a.x, a.y, b.x, b.y);
    }
    g.lineBetween(MAP_SPOTS[0].x, MAP_SPOTS[0].y, MAP_SPOTS[3].x, MAP_SPOTS[3].y);

    // The forest around place 4.
    const forest = MAP_SPOTS[3];
    for (let i = 0; i < 14; i++) {
      const x = forest.x - 40 + ((i * 23) % 80);
      const y = forest.y - 22 + ((i * 17) % 40);
      g.fillStyle(0x1f5426).fillCircle(x, y, 7);
      g.fillStyle(0x2f7a36).fillCircle(x - 1, y - 2, 5);
    }

    const buildings: { roof: number; wall: number; icon: (x: number, y: number) => void }[] = [
      { roof: 0x8a4ac8, wall: 0xf2d24b, icon: (x, y) => g.fillStyle(0xe04848).fillRect(x - 3, y - 3, 6, 6) }, // toy block
      { roof: 0xc9854a, wall: 0xf4ecd8, icon: (x, y) => g.fillStyle(0xc9854a).fillEllipse(x, y, 9, 5) }, // bun
      { roof: 0x2d5f9e, wall: 0xb8a898, icon: (x, y) => g.fillStyle(0x8a2346).fillRect(x - 4, y - 3, 8, 6) }, // book
      { roof: 0x1f5426, wall: 0x7a4f2a, icon: (x, y) => g.fillStyle(0xe8a13a).fillTriangle(x - 4, y + 2, x + 4, y + 2, x, y - 4) }, // chanterelle
      { roof: 0x4a4450, wall: 0x8a8490, icon: (x, y) => g.fillStyle(0xe8dcb0).fillCircle(x, y, 4) }, // clock
      { roof: 0xc0182c, wall: 0xe0c38a, icon: (x, y) => g.fillStyle(0xffd66b).fillCircle(x, y, 3) }, // lantern
    ];
    const save = loadSave();
    const ids = cases.map((c) => c.id);
    MAP_SPOTS.forEach((spot, i) => {
      const b = buildings[i];
      const open = !!cases[i] && isUnlocked(ids, i, save);
      const x = spot.x;
      const y = spot.y;
      const tall = i === 4;
      const h = tall ? 30 : 16;
      g.fillStyle(0x000000, 0.25).fillEllipse(x, y + 2, 30, 6);
      g.fillStyle(0x1a1024).fillRect(x - 13, y - h - 1, 26, h + 2);
      g.fillStyle(b.wall).fillRect(x - 12, y - h, 24, h);
      g.fillStyle(0x1a1024).fillTriangle(x - 15, y - h + 1, x + 15, y - h + 1, x, y - h - 12);
      g.fillStyle(b.roof).fillTriangle(x - 13, y - h, x + 13, y - h, x, y - h - 10);
      b.icon(x, y - h / 2 - 1);
      if (!open) g.fillStyle(0x07040f, 0.55).fillRect(x - 15, y - h - 12, 30, h + 14);
    });
  }
}
