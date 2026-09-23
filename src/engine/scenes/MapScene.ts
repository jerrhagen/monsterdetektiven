import * as Phaser from "phaser";
import { cases } from "../../cases";
import { MAP_SPOTS, hideCityMap, showCityMap } from "../../ui/cityMap";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { isUnlocked, loadSave } from "../save";
import { newGame, session } from "../session";
import { registerSprites } from "../textures";

// The town map follows the architect's drawing (assets/bilder/teckningar/stadskarta.jpg):
// the stream winds under the toy shop and the bakery, loops around the meadow with the
// clock tower, the library and the festival tent, and runs down past the forest.

type Point = [number, number];

const MEADOW = 0x8cc751;
const MEADOW_DARK = 0x6fae3f;
const MEADOW_LIGHT = 0xa9dd6a;
const FOREST_FLOOR = 0x4f9a3e;
const FOREST_DARK = 0x3a7a32;
const WATER = 0x3a8fd6;
const WATER_EDGE = 0x245f9e;
const WATER_LIGHT = 0x8fd0f5;
const ROAD = 0xeaa45e;
const ROAD_EDGE = 0xc07a3a;
const ROAD_LIGHT = 0xf4c088;
const PLANK = 0xa0703a;
const PLANK_DARK = 0x6a4020;

/** The stream: from the top right, under the bakery and the toy shop, down past the forest. */
const STREAM: Point[] = [
  [324, 36], [296, 58], [250, 68], [200, 71], [150, 73], [110, 76], [60, 80], [30, 88], [14, 112], [8, 150], [6, 196],
];
/** …and the loop around the meadow. */
const LOOP: Point[] = [
  [118, 76], [130, 96], [142, 120], [152, 146], [168, 170], [205, 178], [262, 177], [296, 162], [306, 122], [302, 84], [294, 60],
];

/** Roads between the places. */
const ROADS: Point[][] = [
  [[60, 62], [76, 56], [100, 48], [140, 42], [176, 44], [190, 54], [200, 60], [220, 60]], // toy shop – bakery
  [[58, 62], [58, 72], [58, 90], [62, 112], [70, 134]], // toy shop – forest
  [[220, 60], [212, 63], [210, 66], [210, 78], [204, 92], [188, 104], [170, 116]], // bakery – clock tower
  [[170, 116], [200, 110], [235, 101], [268, 94]], // clock tower – library
  [[268, 94], [264, 118], [248, 140], [232, 158]], // library – tent
  [[72, 134], [100, 140], [130, 140], [162, 139], [170, 128], [170, 116]], // forest – clock tower
];

/** Where the roads cross the water. */
const BRIDGES: { x: number; y: number; across: "vertical" | "horizontal" }[] = [
  { x: 58, y: 80, across: "vertical" },
  { x: 210, y: 71, across: "vertical" },
  { x: 150, y: 140, across: "horizontal" },
];

/** The dark forest floor, as a few overlapping round patches. */
const FOREST: [number, number, number][] = [
  [40, 112, 28], [92, 110, 26], [60, 150, 34], [110, 160, 26], [28, 170, 22],
];

const TREES: { x: number; y: number; round?: boolean }[] = [
  { x: 30, y: 106 }, { x: 94, y: 102, round: true }, { x: 116, y: 114 }, { x: 32, y: 132, round: true },
  { x: 98, y: 128 }, { x: 22, y: 166 }, { x: 46, y: 178, round: true }, { x: 104, y: 172 },
  { x: 128, y: 162, round: true }, { x: 254, y: 42 }, { x: 280, y: 44, round: true }, { x: 120, y: 30, round: true },
];

/** The buildings, in case order, standing on their map spot. */
const BUILDINGS = ["mapToyShop", "mapBakery", "mapLibrary", null, "mapClockTower", "mapTent"];

/** Small pseudo-random number from a position, so the map looks the same every time. */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Smooth curve through the points (Catmull-Rom), one sample per pixel or so. */
function smooth(points: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const [p1, p2] = [points[i], points[i + 1]];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const steps = Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

function inForest(x: number, y: number): boolean {
  return FOREST.some(([fx, fy, r]) => Math.hypot(x - fx, y - fy) < r);
}

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

    this.marker = this.add.sprite(0, 0, "nora-0").setOrigin(0.5, 1).setDepth(1000);
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
    const y = spot.y + 4;
    this.tweens.killTweensOf(this.marker);
    if (animate) this.tweens.add({ targets: this.marker, x, y, duration: 250, ease: "Sine.Out" });
    else this.marker.setPosition(x, y);
  }

  private drawTown(): void {
    const g = this.add.graphics();

    // Meadow everywhere, with little tufts and flowers.
    g.fillStyle(MEADOW).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    for (const [fx, fy, r] of FOREST) g.fillStyle(FOREST_FLOOR).fillCircle(fx, fy, r);
    for (let y = 0; y < GAME_HEIGHT; y += 3) {
      for (let x = 0; x < GAME_WIDTH; x += 3) {
        const h = hash(x, y);
        const forest = inForest(x, y);
        if (h < 0.12) g.fillStyle(forest ? FOREST_DARK : MEADOW_DARK).fillRect(x, y, 1, 2);
        else if (h < 0.17) g.fillStyle(forest ? MEADOW_DARK : MEADOW_LIGHT).fillRect(x + 1, y, 1, 1);
        else if (!forest && h > 0.992) g.fillStyle([0xffffff, 0xffd66b, 0xf28ac0][Math.floor(h * 1000) % 3]).fillRect(x, y, 1, 1);
      }
    }

    // Roads, with a darker edge and a few pebbles. All edges first, so there are no seams where roads meet.
    const roads = ROADS.map(smooth);
    for (const pts of roads) for (const [x, y] of pts) g.fillStyle(ROAD_EDGE).fillCircle(x, y, 4);
    for (const pts of roads) for (const [x, y] of pts) g.fillStyle(ROAD).fillCircle(x, y, 3);
    for (const pts of roads) {
      pts.forEach(([x, y], i) => {
        if (i % 7 === 3) g.fillStyle(ROAD_LIGHT).fillRect(Math.round(x + (hash(x, y) - 0.5) * 4), Math.round(y), 1, 1);
      });
    }

    // The stream.
    const stream = [smooth(STREAM), smooth(LOOP)];
    for (const pts of stream) for (const [x, y] of pts) g.fillStyle(WATER_EDGE).fillCircle(x, y, 6);
    for (const pts of stream) for (const [x, y] of pts) g.fillStyle(WATER).fillCircle(x, y, 5);

    // Glints on the water that come and go.
    const glints = this.add.graphics();
    for (const pts of stream) {
      pts.forEach(([x, y], i) => {
        if (i % 11 === 0) glints.fillStyle(WATER_LIGHT).fillRect(Math.round(x + (hash(i, y) - 0.5) * 5), Math.round(y), 3, 1);
      });
    }
    this.tweens.add({ targets: glints, alpha: { from: 1, to: 0.3 }, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.InOut" });

    // Wooden bridges.
    const b = this.add.graphics();
    for (const { x, y, across } of BRIDGES) {
      const [w, h] = across === "vertical" ? [10, 18] : [18, 10];
      const left = x - w / 2;
      const top = y - h / 2;
      b.fillStyle(PLANK_DARK).fillRect(left - 1, top - 1, w + 2, h + 2);
      b.fillStyle(PLANK).fillRect(left, top, w, h);
      b.fillStyle(PLANK_DARK);
      if (across === "vertical") {
        for (let py = top + 2; py < top + h; py += 3) b.fillRect(left + 1, py, w - 2, 1);
        b.fillRect(left, top, 1, h).fillRect(left + w - 1, top, 1, h);
      } else {
        for (let px = left + 2; px < left + w; px += 3) b.fillRect(px, top + 1, 1, h - 2);
        b.fillRect(left, top, w, 1).fillRect(left, top + h - 1, w, 1);
      }
    }

    // Things standing on the map, drawn front to back.
    const put = (key: string, x: number, y: number) => this.add.image(x, y, `${key}-0`).setOrigin(0.5, 1).setDepth(y);
    for (const t of TREES) put(t.round ? "mapTreeRound" : "mapTree", t.x, t.y);
    for (const [x, y] of [[82, 120], [87, 123], [79, 125], [91, 118], [48, 118]]) put("mapChanterelle", x, y);
    put("mapCave", 76, 101);
    for (const [x, y] of [[198, 90], [208, 94], [218, 90]]) put("mapTulip", x, y);
    for (const [x, y] of [[100, 66], [150, 60], [284, 104], [284, 140], [190, 140]]) put("mapBush", x, y);

    const save = loadSave();
    const ids = cases.map((c) => c.id);
    MAP_SPOTS.forEach((spot, i) => {
      const key = BUILDINGS[i];
      if (!key) return;
      const building = put(key, spot.x, spot.y);
      const open = !!cases[i] && isUnlocked(ids, i, save);
      if (!open) building.setTint(0x6a6480);
    });
  }
}
