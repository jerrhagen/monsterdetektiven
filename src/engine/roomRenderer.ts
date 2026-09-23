import type * as Phaser from "phaser";
import { ROOM_COLS, ROOM_ROWS, TILE } from "./config";
import { type ParsedRoom, type TileKind, tileAt } from "./room";

const C = {
  outline: 0x1a1024,
  floor: 0xb98556,
  floorSeam: 0x9c6a40,
  floorLight: 0xc9956a,
  wallTop: 0x2a1a3a,
  wallEdge: 0x4a3266,
  paper: 0x6b4a8c,
  paperStripe: 0x7d5aa0,
  paperTrim: 0x4a2f66,
  baseboard: 0x3a2350,
  woodLight: 0xa8744a,
  woodDark: 0x7a4f2a,
  woodMid: 0x9c6a40,
  counterTop: 0xd9a877,
  slime: 0x5cd65c,
  slimeDark: 0x2e8a3a,
  slimeLight: 0xb8ffb8,
  mat: 0xa33a3a,
  matStripe: 0xc95050,
  gold: 0xffd66b,
};

const TOY_COLOURS = [0xe04848, 0x4a90e2, 0xf2d24b, 0x5cc46a, 0xff8ade, 0x9b6bd6, 0xf28c38];

/** Deterministic "random" per tile, so rooms look the same every time. */
function hash(col: number, row: number, salt = 0): number {
  let h = (col * 374761393 + row * 668265263 + salt * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Draws the whole room (floor, walls, furniture) into one Graphics object. */
export function drawRoom(scene: Phaser.Scene, room: ParsedRoom): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  for (let row = 0; row < ROOM_ROWS; row++) {
    for (let col = 0; col < ROOM_COLS; col++) {
      drawTile(g, room, col, row, tileAt(room, col, row));
    }
  }
  return g;
}

function drawTile(g: Phaser.GameObjects.Graphics, room: ParsedRoom, col: number, row: number, kind: TileKind): void {
  const x = col * TILE;
  const y = row * TILE;
  switch (kind) {
    case "wall":
      return drawWall(g, room, col, row, x, y);
    case "door":
      return drawDoor(g, room, col, row, x, y);
    case "shelf":
      return drawShelf(g, col, row, x, y);
    case "counter":
      return drawCounter(g, room, col, row, x, y);
    case "slime":
      drawFloor(g, col, row, x, y);
      return drawSlime(g, room, col, row, x, y);
    case "blocks":
      drawFloor(g, col, row, x, y);
      return drawBlocks(g, col, row, x, y);
    default:
      return drawFloor(g, col, row, x, y);
  }
}

function drawFloor(g: Phaser.GameObjects.Graphics, col: number, row: number, x: number, y: number): void {
  g.fillStyle(C.floor).fillRect(x, y, TILE, TILE);
  // Planks: 4 px tall, with seams at shifting positions.
  for (let i = 0; i < 4; i++) {
    const py = y + i * 4;
    g.fillStyle(C.floorSeam).fillRect(x, py + 3, TILE, 1);
    const seam = ((row * 4 + i) * 7 + col * 16) % 16;
    g.fillRect(x + seam, py, 1, 3);
    if (hash(col, row, i) < 0.3) g.fillStyle(C.floorLight).fillRect(x + ((seam + 5) % 14), py + 1, 2, 1);
  }
}

function drawWall(g: Phaser.GameObjects.Graphics, room: ParsedRoom, col: number, row: number, x: number, y: number): void {
  const below = tileAt(room, col, row + 1);
  const facesRoom = row < ROOM_ROWS - 1 && below !== "wall" && below !== "door";
  if (facesRoom) {
    // The front of the wall: wallpaper with stripes and a baseboard.
    g.fillStyle(C.paper).fillRect(x, y, TILE, TILE);
    for (let sx = 0; sx < TILE; sx += 4) g.fillStyle(C.paperStripe).fillRect(x + sx, y + 2, 2, 11);
    g.fillStyle(C.paperTrim).fillRect(x, y, TILE, 2);
    g.fillStyle(C.baseboard).fillRect(x, y + 13, TILE, 3);
    g.fillStyle(C.woodMid).fillRect(x, y + 13, TILE, 1);
    return;
  }
  g.fillStyle(C.wallTop).fillRect(x, y, TILE, TILE);
  // Light edge where the wall meets the room.
  const inside = (k: TileKind) => k !== "wall" && k !== "door";
  g.fillStyle(C.wallEdge);
  if (inside(tileAt(room, col - 1, row))) g.fillRect(x, y, 2, TILE);
  if (inside(tileAt(room, col + 1, row))) g.fillRect(x + TILE - 2, y, 2, TILE);
  if (inside(tileAt(room, col, row - 1))) g.fillRect(x, y, TILE, 2);
}

function drawDoor(g: Phaser.GameObjects.Graphics, room: ParsedRoom, col: number, row: number, x: number, y: number): void {
  if (row === ROOM_ROWS - 1) {
    // Entrance in the bottom wall: an opening with a doormat.
    g.fillStyle(C.floor).fillRect(x, y, TILE, TILE);
    g.fillStyle(C.mat).fillRect(x, y + 2, TILE, 10);
    for (let sx = 1; sx < TILE; sx += 3) g.fillStyle(C.matStripe).fillRect(x + sx, y + 3, 1, 8);
    const leftWall = tileAt(room, col - 1, row) === "wall";
    const rightWall = tileAt(room, col + 1, row) === "wall";
    g.fillStyle(C.woodDark);
    if (leftWall) g.fillRect(x, y, 2, TILE);
    if (rightWall) g.fillRect(x + TILE - 2, y, 2, TILE);
    return;
  }
  // A wooden door in a side wall.
  g.fillStyle(C.wallTop).fillRect(x, y, TILE, TILE);
  const topHalf = tileAt(room, col, row - 1) !== "door";
  const bottomHalf = tileAt(room, col, row + 1) !== "door";
  g.fillStyle(C.woodDark).fillRect(x + 3, y + (topHalf ? 1 : 0), 10, TILE - (topHalf ? 1 : 0) - (bottomHalf ? 1 : 0));
  g.fillStyle(C.woodMid).fillRect(x + 4, y + (topHalf ? 2 : 0), 8, TILE - (topHalf ? 2 : 0) - (bottomHalf ? 2 : 0));
  if (bottomHalf) g.fillStyle(C.gold).fillRect(x + 5, y + 2, 2, 2);
}

function drawShelf(g: Phaser.GameObjects.Graphics, col: number, row: number, x: number, y: number): void {
  g.fillStyle(C.woodLight).fillRect(x, y, TILE, 5);
  g.fillStyle(C.woodDark).fillRect(x, y + 5, TILE, 10);
  g.fillStyle(C.outline).fillRect(x, y + 15, TILE, 1);
  // Two shelves with toys on them.
  for (const [shelfY, salt] of [[y + 9, 1], [y + 14, 2]] as const) {
    g.fillStyle(C.woodMid).fillRect(x, shelfY, TILE, 1);
    let tx = x + 1;
    while (tx < x + TILE - 3) {
      const r = hash(col, row, salt * 17 + tx);
      const w = 2 + Math.floor(r * 3);
      const h = 2 + Math.floor(hash(col, row, tx) * 2);
      g.fillStyle(TOY_COLOURS[Math.floor(r * TOY_COLOURS.length)]).fillRect(tx, shelfY - h, w, h);
      tx += w + 1;
    }
  }
}

function drawCounter(g: Phaser.GameObjects.Graphics, room: ParsedRoom, col: number, row: number, x: number, y: number): void {
  const counterAbove = tileAt(room, col, row - 1) === "counter";
  const counterBelow = tileAt(room, col, row + 1) === "counter";
  g.fillStyle(C.counterTop).fillRect(x, y, TILE, counterBelow ? TILE : 10);
  if (!counterBelow) {
    g.fillStyle(C.woodMid).fillRect(x, y + 10, TILE, 5);
    g.fillStyle(C.outline).fillRect(x, y + 15, TILE, 1);
  }
  g.fillStyle(C.woodLight);
  if (tileAt(room, col - 1, row) !== "counter") g.fillRect(x, y, 1, TILE);
  if (tileAt(room, col + 1, row) !== "counter") g.fillRect(x + TILE - 1, y, 1, TILE);
  // Cash register on the top-left counter tile.
  if (!counterAbove && tileAt(room, col - 1, row) !== "counter") {
    g.fillStyle(0x6a6a80).fillRect(x + 3, y + 1, 10, 7);
    g.fillStyle(0x5cc46a).fillRect(x + 4, y + 2, 5, 2);
    g.fillStyle(0x3d3d50).fillRect(x + 4, y + 5, 8, 2);
  }
}

function drawSlime(g: Phaser.GameObjects.Graphics, room: ParsedRoom, col: number, row: number, x: number, y: number): void {
  const same = (dc: number, dr: number) => tileAt(room, col + dc, row + dr) === "slime";
  const radius = {
    tl: !same(-1, 0) && !same(0, -1) ? 6 : 0,
    tr: !same(1, 0) && !same(0, -1) ? 6 : 0,
    bl: !same(-1, 0) && !same(0, 1) ? 6 : 0,
    br: !same(1, 0) && !same(0, 1) ? 6 : 0,
  };
  const inset = { l: same(-1, 0) ? 0 : 1, r: same(1, 0) ? 0 : 1, t: same(0, -1) ? 0 : 1, b: same(0, 1) ? 0 : 1 };
  const w = TILE - inset.l - inset.r;
  const h = TILE - inset.t - inset.b;
  g.fillStyle(C.slimeDark).fillRoundedRect(x + inset.l, y + inset.t, w, h, radius);
  g.fillStyle(C.slime).fillRoundedRect(x + inset.l + 1, y + inset.t + 1, w - 2, h - 3, radius);
  g.fillStyle(C.slimeLight).fillRect(x + 4 + Math.floor(hash(col, row) * 5), y + 4, 3, 2);
  g.fillRect(x + 9, y + 9 + Math.floor(hash(row, col) * 3), 1, 1);
}

function drawBlocks(g: Phaser.GameObjects.Graphics, col: number, row: number, x: number, y: number): void {
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
