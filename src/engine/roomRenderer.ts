import type * as Phaser from "phaser";
import type { Theme } from "../cases/types";
import { ROOM_COLS, ROOM_ROWS, TILE } from "./config";
import type { ParsedRoom, TileKind } from "./room";

type G = Phaser.GameObjects.Graphics;

const C = {
  outline: 0x1a1024,
  woodLight: 0xa8744a,
  woodDark: 0x7a4f2a,
  woodMid: 0x9c6a40,
  counterTop: 0xd9a877,
  slime: 0x5cd65c,
  slimeDark: 0x2e8a3a,
  slimeLight: 0xb8ffb8,
  water: 0x4a90e2,
  waterDark: 0x2d5f9e,
  waterLight: 0xb8dcff,
  mat: 0xa33a3a,
  matStripe: 0xc95050,
  gold: 0xffd66b,
  sand: 0xe0c38a,
  sandDot: 0xc9a86a,
  sandEdge: 0xa88a5a,
  leaf: 0x2f7a36,
  leafLight: 0x4ea84a,
  leafDark: 0x1f5426,
};

/** Colours that change with the room's theme. */
const THEMES: Record<Theme, { floor: number; seam: number; light: number; wallTop: number; wallEdge: number }> = {
  shop: { floor: 0xb98556, seam: 0x9c6a40, light: 0xc9956a, wallTop: 0x2a1a3a, wallEdge: 0x4a3266 },
  storage: { floor: 0x6f6a78, seam: 0x5f5a68, light: 0x807b8a, wallTop: 0x221a26, wallEdge: 0x3e3444 },
  yard: { floor: 0x4e9a3e, seam: 0x3f8a32, light: 0x6cc24a, wallTop: 0x5a3a1e, wallEdge: 0x7a4f2a },
  bakery: { floor: 0xefe6d6, seam: 0x4a3a50, light: 0xffffff, wallTop: 0x5a3a2a, wallEdge: 0x8a5a3a },
  library: { floor: 0x7a2a3a, seam: 0x5a1a2a, light: 0xa04a5a, wallTop: 0x2a1a14, wallEdge: 0x4a3020 },
  forest: { floor: 0x2f6a2e, seam: 0x24522a, light: 0x4a8a3a, wallTop: 0x1a3a1c, wallEdge: 0x2a5a2a },
  tower: { floor: 0x6a6470, seam: 0x4a4450, light: 0x8a8490, wallTop: 0x2a2630, wallEdge: 0x4a4450 },
  square: { floor: 0x9a8a7a, seam: 0x6a5a4a, light: 0xb8a898, wallTop: 0x6a2a2a, wallEdge: 0x8a3a3a },
};

/** Outdoor themes have water in their puddles instead of slime. */
const OUTDOORS: Theme[] = ["yard", "forest", "square"];

const BOOK_COLOURS = [0x8a2346, 0x2d5f9e, 0x2a8a6a, 0xc9961e, 0x6a45a8, 0xa0643a, 0x3d3d50];

const TOY_COLOURS = [0xe04848, 0x4a90e2, 0xf2d24b, 0x5cc46a, 0xff8ade, 0x9b6bd6, 0xf28c38];

interface Toy {
  pixels: string[];
}

const TOY_PALETTE: Record<string, number> = {
  w: 0xffffff,
  k: 0x1a1024,
  b: 0xa0643a, // teddy brown
  l: 0xd9a877, // light brown
  y: 0xf2d24b,
  o: 0xf28c38,
  g: 0x5cc46a,
  s: 0xf5c8a0, // skin
  h: 0x7a3b1e, // doll hair
  r: 0xe04848,
  B: 0x4a90e2,
  G: 0x8a86a0, // grey
};

/** Tiny toys for the shelves (at most 5 px tall). `*` = a random bright colour. */
const TOYS: Toy[] = [
  { pixels: [".**.", "*w**", "****", ".**."] }, // ball
  { pixels: ["b...b", "bbbbb", "bkbkb", "bblbb", ".bbb."] }, // teddy
  { pixels: [".yy..", ".yko.", "yyyyy", ".yyy."] }, // rubber duck
  { pixels: [".r.", "www", "wBw", "www", "r.r"] }, // rocket
  { pixels: [".h.", "hsh", ".*.", "***", ".s."] }, // doll
  { pixels: ["..gg", ".gkg", "ggg.", "g.g."] }, // dinosaur
  { pixels: [".**..", "*****", ".k.k."] }, // toy car
  { pixels: ["***", "*w*", "***"] }, // building block
  { pixels: [".G.", "GGG", "*G*", "***"] }, // robot
  { pixels: ["..*", ".*.", "***", "***"] }, // sailing boat
];

/** Deterministic "random" per tile, so rooms look the same every time. */
function hash(col: number, row: number, salt = 0): number {
  let h = (col * 374761393 + row * 668265263 + salt * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Draws the whole room (floor, walls, furniture) into one Graphics object. */
export function drawRoom(scene: Phaser.Scene, room: ParsedRoom): G {
  const g = scene.add.graphics();
  const painter = new Painter(g, room);
  for (let row = 0; row < ROOM_ROWS; row++) {
    for (let col = 0; col < ROOM_COLS; col++) painter.tile(col, row, room.base[row][col]);
  }
  return g;
}

class Painter {
  private readonly theme: Theme;
  private readonly t: (typeof THEMES)[Theme];

  constructor(
    private readonly g: G,
    private readonly room: ParsedRoom,
  ) {
    this.theme = room.data.theme;
    this.t = THEMES[this.theme];
  }

  private at(col: number, row: number): TileKind {
    return this.room.base[row]?.[col] ?? "wall";
  }

  tile(col: number, row: number, kind: TileKind): void {
    const x = col * TILE;
    const y = row * TILE;
    switch (kind) {
      case "wall":
        return this.wall(col, row, x, y);
      case "door":
        return this.door(col, row, x, y);
      case "shelf":
        return this.shelf(col, row, x, y);
      case "counter":
        return this.counter(col, row, x, y);
      case "crate":
        this.floor(col, row, x, y);
        return this.crate(col, row, x, y);
      case "tree":
        this.floor(col, row, x, y);
        return this.tree(col, row, x, y);
      case "sand":
        return this.sand(col, row, x, y);
      case "puddle":
        this.floor(col, row, x, y);
        return this.puddle(col, row, x, y);
      case "blocks":
        this.floor(col, row, x, y);
        return this.blocks(col, row, x, y);
      case "water":
        return this.water(col, row, x, y);
      case "oven":
        this.floor(col, row, x, y);
        return this.oven(col, row, x, y);
      case "gear":
        this.floor(col, row, x, y);
        return this.gear(col, row, x, y);
      case "fountain":
        this.floor(col, row, x, y);
        return this.fountain(col, row, x, y);
      case "rock":
        this.floor(col, row, x, y);
        return this.rock(col, row, x, y);
      default:
        return this.floor(col, row, x, y);
    }
  }

  private floor(col: number, row: number, x: number, y: number): void {
    const { g, t } = this;
    g.fillStyle(t.floor).fillRect(x, y, TILE, TILE);
    if (this.theme === "shop") {
      // Wooden planks.
      for (let i = 0; i < 4; i++) {
        const py = y + i * 4;
        g.fillStyle(t.seam).fillRect(x, py + 3, TILE, 1);
        const seam = ((row * 4 + i) * 7 + col * 16) % 16;
        g.fillRect(x + seam, py, 1, 3);
        if (hash(col, row, i) < 0.3) g.fillStyle(t.light).fillRect(x + ((seam + 5) % 14), py + 1, 2, 1);
      }
    } else if (this.theme === "storage") {
      // Concrete with specks and the odd crack.
      for (let i = 0; i < 6; i++) {
        g.fillStyle(hash(col, row, i) < 0.5 ? t.seam : t.light);
        g.fillRect(x + Math.floor(hash(col, row, i + 10) * 15), y + Math.floor(hash(col, row, i + 20) * 15), 1, 1);
      }
      if (hash(col, row, 99) < 0.12) {
        g.fillStyle(t.seam).fillRect(x + 4, y + 6, 4, 1).fillRect(x + 8, y + 7, 3, 1).fillRect(x + 11, y + 8, 2, 1);
      }
    } else if (this.theme === "bakery") {
      // Black-and-white chequered tiles.
      for (let cy = 0; cy < 2; cy++) {
        for (let cx = 0; cx < 2; cx++) {
          if ((cx + cy + col + row) % 2) g.fillStyle(0xd8ccb8).fillRect(x + cx * 8, y + cy * 8, 8, 8);
        }
      }
    } else if (this.theme === "library") {
      // Soft red carpet with a small diamond pattern.
      g.fillStyle(t.seam).fillRect(x + 7, y + 3, 2, 2).fillRect(x + 5, y + 5, 2, 2).fillRect(x + 9, y + 5, 2, 2).fillRect(x + 7, y + 7, 2, 2);
      g.fillStyle(t.light).fillRect(x + 7, y + 5, 2, 2);
      if (row % 2 === 0) g.fillStyle(t.seam).fillRect(x, y + 14, TILE, 1);
    } else if (this.theme === "tower") {
      // Big stone blocks.
      const offset = row % 2 ? 8 : 0;
      g.fillStyle(t.seam).fillRect(x, y + 7, TILE, 1).fillRect(x, y + 15, TILE, 1);
      g.fillRect(x + ((offset + 0) % 16), y, 1, 7).fillRect(x + ((offset + 8) % 16), y + 8, 1, 7);
      if (hash(col, row) < 0.3) g.fillStyle(t.light).fillRect(x + 3, y + 2, 2, 1);
    } else if (this.theme === "square") {
      // Cobblestones.
      for (let cy = 0; cy < 4; cy++) {
        for (let cx = 0; cx < 4; cx++) {
          const sx = x + cx * 4 + (cy % 2 ? 2 : 0);
          g.fillStyle(hash(col * 4 + cx, row * 4 + cy) < 0.5 ? t.light : t.floor).fillRect(sx, y + cy * 4, 3, 3);
        }
      }
      g.fillStyle(t.seam);
      for (let cy = 0; cy < 4; cy++) g.fillRect(x, y + cy * 4 + 3, TILE, 1);
    } else {
      // Grass tufts (and in the forest the odd fallen leaf or tiny mushroom).
      if (this.theme === "forest" && hash(col, row, 42) < 0.15) {
        g.fillStyle(hash(col, row, 43) < 0.5 ? 0xc97a1e : 0xe04848).fillRect(x + 5 + Math.floor(hash(col, row, 44) * 6), y + 8, 2, 2);
      }
      for (let i = 0; i < 5; i++) {
        const gx = x + Math.floor(hash(col, row, i) * 14);
        const gy = y + Math.floor(hash(col, row, i + 7) * 14);
        g.fillStyle(i % 2 ? t.light : t.seam).fillRect(gx, gy, 1, 2).fillRect(gx + 1, gy + 1, 1, 1);
      }
    }
  }

  private wall(col: number, row: number, x: number, y: number): void {
    const { g, t } = this;
    const below = this.at(col, row + 1);
    const facesRoom = row < ROOM_ROWS - 1 && below !== "wall" && below !== "door";

    if (this.theme === "forest") {
      // The forest is walled in by dense trees.
      this.floor(col, row, x, y);
      const same = (dc: number, dr: number) => {
        const k = this.at(col + dc, row + dr);
        return k === "wall";
      };
      const r = { tl: 0, tr: 0, bl: 0, br: 0 };
      if (!same(-1, 0) && !same(0, -1)) r.tl = 6;
      if (!same(1, 0) && !same(0, -1)) r.tr = 6;
      if (!same(-1, 0) && !same(0, 1)) r.bl = 6;
      if (!same(1, 0) && !same(0, 1)) r.br = 6;
      g.fillStyle(0x12301a).fillRoundedRect(x, y, TILE, TILE, r);
      g.fillStyle(0x1f5426).fillRoundedRect(x + 1, y, TILE - 2, TILE - 3, r);
      for (let i = 0; i < 3; i++) {
        g.fillStyle(0x2f7a36).fillRect(x + 2 + Math.floor(hash(col, row, i) * 10), y + 1 + Math.floor(hash(col, row, i + 5) * 9), 3, 2);
      }
      return;
    }

    if (this.theme === "square" && facesRoom) {
      // House fronts around the square, each in its own colour, with a window.
      const colours = [0xc9855a, 0x8a6aa8, 0x5a8a9a, 0xb8a05a, 0xa05a5a];
      const house = colours[Math.floor(col / 3) % colours.length];
      g.fillStyle(house).fillRect(x, y, TILE, TILE);
      g.fillStyle(C.outline, 0.3).fillRect(x, y + 15, TILE, 1);
      if (col % 3 === 1) {
        g.fillStyle(0x2a2030).fillRect(x + 4, y + 3, 8, 8);
        g.fillStyle(hash(col, row) < 0.5 ? 0xffd66b : 0x4a4460).fillRect(x + 5, y + 4, 6, 6);
        g.fillStyle(0x2a2030).fillRect(x + 7, y + 4, 2, 6).fillRect(x + 5, y + 6, 6, 1);
      }
      if (col % 3 === 0) g.fillStyle(C.outline, 0.25).fillRect(x, y, 1, TILE);
      return;
    }

    if (this.theme === "yard" && !(row === 0 && facesRoom)) {
      // Wooden fence around the yard, running sideways or up/down.
      this.floor(col, row, x, y);
      const isWall = (k: TileKind) => k === "wall" || k === "door";
      const horizontal = isWall(this.at(col - 1, row)) && isWall(this.at(col + 1, row));
      if (horizontal) {
        g.fillStyle(t.wallTop).fillRect(x, y + 4, TILE, 8);
        for (let px = 1; px < TILE; px += 4) g.fillStyle(t.wallEdge).fillRect(x + px, y + 3, 3, 10);
        g.fillStyle(C.outline, 0.35).fillRect(x, y + 13, TILE, 1);
      } else {
        g.fillStyle(t.wallTop).fillRect(x + 4, y, 8, TILE);
        for (let py = 1; py < TILE; py += 4) g.fillStyle(t.wallEdge).fillRect(x + 3, y + py, 10, 3);
        g.fillStyle(C.outline, 0.35).fillRect(x + 13, y, 1, TILE);
      }
      return;
    }

    if (facesRoom && this.theme === "bakery") {
      // White tiles with a blue stripe.
      g.fillStyle(0xf4f0e8).fillRect(x, y, TILE, TILE);
      g.fillStyle(0xc8c4d4).fillRect(x, y + 7, TILE, 1).fillRect(x + 7, y, 1, TILE);
      g.fillStyle(0x4a90e2).fillRect(x, y + 11, TILE, 2);
      g.fillStyle(C.outline, 0.3).fillRect(x, y + 15, TILE, 1);
      return;
    }
    if (facesRoom && this.theme === "library") {
      // Dark wooden panels.
      g.fillStyle(0x4a2e1e).fillRect(x, y, TILE, TILE);
      g.fillStyle(0x5a3a26).fillRect(x + 2, y + 2, 12, 11);
      g.fillStyle(0x3a2216).fillRect(x, y + 14, TILE, 2);
      return;
    }
    if (facesRoom) {
      if (this.theme === "shop") {
        // Wallpaper with stripes and a baseboard.
        g.fillStyle(0x6b4a8c).fillRect(x, y, TILE, TILE);
        for (let sx = 0; sx < TILE; sx += 4) g.fillStyle(0x7d5aa0).fillRect(x + sx, y + 2, 2, 11);
        g.fillStyle(0x4a2f66).fillRect(x, y, TILE, 2);
        g.fillStyle(0x3a2350).fillRect(x, y + 13, TILE, 3);
        g.fillStyle(C.woodMid).fillRect(x, y + 13, TILE, 1);
      } else {
        // Bricks.
        const grey = this.theme === "tower";
        const brick = grey ? 0x7a7484 : this.theme === "storage" ? 0x6e3a3a : 0x9a4a3a;
        const mortar = grey ? 0x4a4450 : this.theme === "storage" ? 0x4a2626 : 0x6a3026;
        g.fillStyle(mortar).fillRect(x, y, TILE, TILE);
        for (let by = 0; by < 4; by++) {
          const offset = by % 2 ? 4 : 0;
          for (let bx = -offset; bx < TILE; bx += 8) {
            const left = Math.max(x, x + bx);
            const right = Math.min(x + TILE, x + bx + 7);
            if (right > left) g.fillStyle(brick).fillRect(left, y + by * 4, right - left, 3);
          }
        }
        g.fillStyle(C.outline, 0.4).fillRect(x, y + 15, TILE, 1);
      }
      return;
    }

    g.fillStyle(t.wallTop).fillRect(x, y, TILE, TILE);
    // Light edge where the wall meets the room.
    const inside = (k: TileKind) => k !== "wall" && k !== "door";
    g.fillStyle(t.wallEdge);
    if (inside(this.at(col - 1, row))) g.fillRect(x, y, 2, TILE);
    if (inside(this.at(col + 1, row))) g.fillRect(x + TILE - 2, y, 2, TILE);
    if (inside(this.at(col, row - 1))) g.fillRect(x, y, TILE, 2);
  }

  private door(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    if (row === ROOM_ROWS - 1) {
      // Opening in the bottom wall, with a doormat.
      this.floor(col, row, x, y);
      g.fillStyle(C.mat).fillRect(x, y + 2, TILE, 10);
      for (let sx = 1; sx < TILE; sx += 3) g.fillStyle(C.matStripe).fillRect(x + sx, y + 3, 1, 8);
      g.fillStyle(C.woodDark);
      if (this.at(col - 1, row) === "wall") g.fillRect(x, y, 2, TILE);
      if (this.at(col + 1, row) === "wall") g.fillRect(x + TILE - 2, y, 2, TILE);
      return;
    }
    if (row === 0) {
      // Door in the top wall, seen from the front.
      g.fillStyle(C.outline).fillRect(x, y, TILE, TILE);
      const leftEdge = this.at(col - 1, row) !== "door";
      const rightEdge = this.at(col + 1, row) !== "door";
      g.fillStyle(C.woodDark).fillRect(x + (leftEdge ? 2 : 0), y + 1, TILE - (leftEdge ? 2 : 0) - (rightEdge ? 2 : 0), 15);
      g.fillStyle(C.woodMid).fillRect(x + (leftEdge ? 3 : 0), y + 2, TILE - (leftEdge ? 3 : 0) - (rightEdge ? 3 : 0), 14);
      if (rightEdge) g.fillStyle(C.gold).fillRect(x + 3, y + 8, 2, 2);
      return;
    }
    // A wooden door in a side wall.
    g.fillStyle(this.t.wallTop).fillRect(x, y, TILE, TILE);
    const topHalf = this.at(col, row - 1) !== "door";
    const bottomHalf = this.at(col, row + 1) !== "door";
    g.fillStyle(C.woodDark).fillRect(x + 3, y + (topHalf ? 1 : 0), 10, TILE - (topHalf ? 1 : 0) - (bottomHalf ? 1 : 0));
    g.fillStyle(C.woodMid).fillRect(x + 4, y + (topHalf ? 2 : 0), 8, TILE - (topHalf ? 2 : 0) - (bottomHalf ? 2 : 0));
    if (bottomHalf) g.fillStyle(C.gold).fillRect(x + (col === 0 ? 10 : 5), y + 2, 2, 2);
  }

  private shelf(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    g.fillStyle(C.woodLight).fillRect(x, y, TILE, 3);
    g.fillStyle(0x5a3a1e).fillRect(x, y + 3, TILE, 12); // back panel
    g.fillStyle(C.woodMid).fillRect(x, y + 9, TILE, 1);
    g.fillStyle(C.outline).fillRect(x, y + 15, TILE, 1);
    // Side boards where the shelf ends.
    g.fillStyle(C.woodDark);
    if (this.at(col - 1, row) !== "shelf") g.fillRect(x, y + 3, 1, 12);
    if (this.at(col + 1, row) !== "shelf") g.fillRect(x + TILE - 1, y + 3, 1, 12);

    if (this.theme === "library" || this.theme === "bakery" || this.theme === "tower") {
      this.shelfGoods(col, row, x, y);
      return;
    }
    // Two compartments full of different toys, standing on the planks.
    for (const [floorY, salt] of [[y + 9, 1], [y + 15, 2]] as const) {
      let tx = x + 1 + Math.floor(hash(col, row, salt) * 2);
      let i = 0;
      while (true) {
        const toy = TOYS[Math.floor(hash(col, row, salt * 31 + i) * TOYS.length)];
        const w = toy.pixels[0].length;
        if (tx + w > x + TILE - 1) break;
        const main = TOY_COLOURS[Math.floor(hash(col, row, salt * 53 + i) * TOY_COLOURS.length)];
        this.stamp(toy, tx, floorY - toy.pixels.length, main);
        tx += w + 1;
        i++;
      }
    }
  }

  /** Books in the library, bread in the bakery, gears and tools in the clock tower. */
  private shelfGoods(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    for (const [floorY, salt] of [[y + 9, 1], [y + 15, 2]] as const) {
      let tx = x + 1;
      let i = 0;
      while (tx < x + TILE - 2) {
        const r = hash(col, row, salt * 13 + i);
        if (this.theme === "library") {
          const w = 1 + Math.floor(r * 2);
          const h = 4 + Math.floor(hash(col, row, salt + i * 3) * 2);
          g.fillStyle(BOOK_COLOURS[Math.floor(r * BOOK_COLOURS.length)]).fillRect(tx, floorY - h, w, h);
          g.fillStyle(0xffd66b, 0.6).fillRect(tx, floorY - h + 1, w, 1);
          tx += w + (hash(col, row, i + 50) < 0.2 ? 1 : 0);
        } else if (this.theme === "bakery") {
          const bun = r < 0.5;
          g.fillStyle(0x7a4526).fillRect(tx, floorY - 3, bun ? 3 : 5, 3);
          g.fillStyle(0xc9854a).fillRect(tx, floorY - 3, bun ? 3 : 5, 2);
          g.fillStyle(0xf4ecd8).fillRect(tx + 1, floorY - 3, 1, 1);
          tx += (bun ? 3 : 5) + 1;
        } else {
          g.fillStyle(r < 0.5 ? 0x8a86a0 : 0xc97a3a).fillRect(tx, floorY - 4, 4, 4);
          g.fillStyle(0x2a2630).fillRect(tx + 1, floorY - 3, 2, 2);
          tx += 5;
        }
        i++;
      }
    }
  }

  private water(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    g.fillStyle(C.waterDark).fillRect(x, y, TILE, TILE);
    g.fillStyle(C.water).fillRect(x, y + 1, TILE, TILE - 2);
    g.fillStyle(C.waterLight);
    for (let i = 0; i < 2; i++) {
      const wx = x + Math.floor(hash(col, row, i) * 11);
      const wy = y + 3 + i * 6 + Math.floor(hash(col, row, i + 4) * 2);
      g.fillRect(wx, wy, 4, 1).fillRect(wx + 1, wy - 1, 2, 1);
    }
    // Banks where the water meets land.
    g.fillStyle(0x6a5a3a);
    if (this.at(col, row - 1) !== "water") g.fillRect(x, y, TILE, 2);
    if (this.at(col, row + 1) !== "water") g.fillRect(x, y + TILE - 2, TILE, 2);
  }

  private oven(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    g.fillStyle(C.outline).fillRect(x, y + 1, TILE, 15);
    g.fillStyle(0x9a4a3a).fillRect(x + 1, y + 2, 14, 13);
    for (let by = 0; by < 3; by++) g.fillStyle(0x6a3026).fillRect(x + 1, y + 5 + by * 4, 14, 1);
    g.fillStyle(0x1a1024).fillRect(x + 4, y + 7, 8, 7);
    g.fillStyle(0xf28c38).fillRect(x + 5, y + 10, 6, 4);
    g.fillStyle(0xffd66b).fillRect(x + 6 + Math.floor(hash(col, row) * 3), y + 11, 2, 3);
  }

  private gear(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    const cx = x + 8;
    const cy = y + 8;
    g.fillStyle(C.outline).fillCircle(cx, cy, 7);
    g.fillStyle(0xc97a3a).fillCircle(cx, cy, 6);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + hash(col, row);
      g.fillStyle(0xc97a3a).fillRect(Math.round(cx + Math.cos(a) * 7) - 1, Math.round(cy + Math.sin(a) * 7) - 1, 3, 3);
    }
    g.fillStyle(0x7a4a2a).fillCircle(cx, cy, 3);
    g.fillStyle(C.outline).fillCircle(cx, cy, 1);
  }

  private fountain(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    const same = (dc: number, dr: number) => this.at(col + dc, row + dr) === "fountain";
    const r = { tl: 0, tr: 0, bl: 0, br: 0 };
    if (!same(-1, 0) && !same(0, -1)) r.tl = 7;
    if (!same(1, 0) && !same(0, -1)) r.tr = 7;
    if (!same(-1, 0) && !same(0, 1)) r.bl = 7;
    if (!same(1, 0) && !same(0, 1)) r.br = 7;
    g.fillStyle(0x8a8490).fillRoundedRect(x, y, TILE, TILE, r);
    g.fillStyle(C.water).fillRoundedRect(x + 2, y + 2, TILE - 4, TILE - 4, r);
    g.fillStyle(C.waterLight).fillRect(x + 5 + Math.floor(hash(col, row) * 5), y + 6, 3, 1);
  }

  private rock(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    g.fillStyle(C.outline).fillRoundedRect(x + 1, y + 3, 14, 12, 5);
    g.fillStyle(0x8a8490).fillRoundedRect(x + 2, y + 4, 12, 9, 4);
    g.fillStyle(0xb8b4c4).fillRect(x + 4, y + 5, 4, 2);
    if (hash(col, row) < 0.5) g.fillStyle(0x4ea84a).fillRect(x + 9, y + 11, 4, 2);
  }

  /** Draws a tiny pixel toy. `*` pixels get the toy's main colour. */
  private stamp(toy: Toy, x: number, y: number, main: number): void {
    toy.pixels.forEach((line, dy) => {
      [...line].forEach((ch, dx) => {
        if (ch === ".") return;
        const colour = ch === "*" ? main : TOY_PALETTE[ch];
        this.g.fillStyle(colour).fillRect(x + dx, y + dy, 1, 1);
      });
    });
  }

  private counter(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    const counterAbove = this.at(col, row - 1) === "counter";
    const counterBelow = this.at(col, row + 1) === "counter";
    g.fillStyle(C.counterTop).fillRect(x, y, TILE, counterBelow ? TILE : 10);
    if (!counterBelow) {
      g.fillStyle(C.woodMid).fillRect(x, y + 10, TILE, 5);
      g.fillStyle(C.outline).fillRect(x, y + 15, TILE, 1);
    }
    g.fillStyle(C.woodLight);
    if (this.at(col - 1, row) !== "counter") g.fillRect(x, y, 1, TILE);
    if (this.at(col + 1, row) !== "counter") g.fillRect(x + TILE - 1, y, 1, TILE);
    if (!counterAbove) g.fillStyle(C.outline, 0.25).fillRect(x, y, TILE, 1);
  }

  private crate(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    const same = (dc: number, dr: number) => this.at(col + dc, row + dr) === "crate";
    const tall = hash(col, row) < 0.5;
    g.fillStyle(C.outline).fillRect(x, y + 1, TILE, 15);
    g.fillStyle(0xc9955a).fillRect(x + 1, y + 2, 14, 4); // top
    g.fillStyle(0xa8744a).fillRect(x + 1, y + 6, 14, 9); // front
    g.fillStyle(C.woodDark).fillRect(x + 1, y + 6, 14, 1).fillRect(x + 1, y + 10, 14, 1);
    g.fillRect(x + 7, y + 6, 2, 9);
    if (tall && !same(0, -1)) g.fillStyle(0xe8d9b0).fillRect(x + 3, y + 3, 4, 2); // paper label
  }

  private tree(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    const same = (dc: number, dr: number) => this.at(col + dc, row + dr) === "tree";
    const r = { tl: 0, tr: 0, bl: 0, br: 0 };
    if (!same(-1, 0) && !same(0, -1)) r.tl = 6;
    if (!same(1, 0) && !same(0, -1)) r.tr = 6;
    if (!same(-1, 0) && !same(0, 1)) r.bl = 6;
    if (!same(1, 0) && !same(0, 1)) r.br = 6;
    g.fillStyle(C.leafDark).fillRoundedRect(x, y, TILE, TILE, r);
    g.fillStyle(C.leaf).fillRoundedRect(x + 1, y, TILE - 2, TILE - 3, r);
    for (let i = 0; i < 4; i++) {
      g.fillStyle(C.leafLight).fillRect(x + 2 + Math.floor(hash(col, row, i) * 10), y + 1 + Math.floor(hash(col, row, i + 5) * 9), 3, 2);
    }
  }

  private sand(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    g.fillStyle(C.sand).fillRect(x, y, TILE, TILE);
    for (let i = 0; i < 6; i++) {
      g.fillStyle(C.sandDot).fillRect(x + Math.floor(hash(col, row, i) * 15), y + Math.floor(hash(col, row, i + 9) * 15), 1, 1);
    }
    // Wooden frame around the sandbox.
    g.fillStyle(C.sandEdge);
    if (this.at(col - 1, row) !== "sand") g.fillRect(x, y, 2, TILE);
    if (this.at(col + 1, row) !== "sand") g.fillRect(x + TILE - 2, y, 2, TILE);
    if (this.at(col, row - 1) !== "sand") g.fillRect(x, y, TILE, 2);
    if (this.at(col, row + 1) !== "sand") g.fillRect(x, y + TILE - 2, TILE, 2);
  }

  private puddle(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    const outdoors = OUTDOORS.includes(this.theme);
    const [dark, mid, light] = outdoors ? [C.waterDark, C.water, C.waterLight] : [C.slimeDark, C.slime, C.slimeLight];
    const same = (dc: number, dr: number) => this.at(col + dc, row + dr) === "puddle";
    const radius = {
      tl: !same(-1, 0) && !same(0, -1) ? 6 : 0,
      tr: !same(1, 0) && !same(0, -1) ? 6 : 0,
      bl: !same(-1, 0) && !same(0, 1) ? 6 : 0,
      br: !same(1, 0) && !same(0, 1) ? 6 : 0,
    };
    const inset = { l: same(-1, 0) ? 0 : 1, r: same(1, 0) ? 0 : 1, t: same(0, -1) ? 0 : 1, b: same(0, 1) ? 0 : 1 };
    const w = TILE - inset.l - inset.r;
    const h = TILE - inset.t - inset.b;
    g.fillStyle(dark).fillRoundedRect(x + inset.l, y + inset.t, w, h, radius);
    g.fillStyle(mid).fillRoundedRect(x + inset.l + 1, y + inset.t + 1, w - 2, h - 3, radius);
    g.fillStyle(light).fillRect(x + 4 + Math.floor(hash(col, row) * 5), y + 4, 3, 1);
    g.fillRect(x + 9, y + 9 + Math.floor(hash(row, col) * 3), 2, 1);
  }

  private blocks(col: number, row: number, x: number, y: number): void {
    const { g } = this;
    const pick = (salt: number) => TOY_COLOURS[Math.floor(hash(col, row, salt) * TOY_COLOURS.length)];
    const block = (bx: number, by: number, colour: number) => {
      g.fillStyle(C.outline).fillRect(bx, by, 7, 7);
      g.fillStyle(colour).fillRect(bx + 1, by + 1, 5, 5);
      g.fillStyle(0xffffff, 0.35).fillRect(bx + 1, by + 1, 5, 1);
    };
    block(x + 1, y + 8, pick(1));
    block(x + 8, y + 8, pick(2));
    block(x + 4 + Math.floor(hash(col, row, 3) * 3), y + 2, pick(3));
  }
}
