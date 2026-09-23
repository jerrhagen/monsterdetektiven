import type { Case, Room, Thing } from "../cases/types";
import { ROOM_COLS, ROOM_ROWS } from "./config";

export type TileKind = "wall" | "floor" | "slime" | "blocks" | "door" | "shelf" | "counter" | "thing";

/** Layout characters. Lowercase letters are things defined in the room. */
export const TILE_CHARS: Record<string, TileKind> = {
  "#": "wall",
  ".": "floor",
  "~": "slime", // jump over
  "=": "blocks", // jump over
  D: "door",
  H: "shelf",
  K: "counter",
  N: "floor", // Nora's start
  E: "floor", // Ester's spot
};

const LOW_OBSTACLES: TileKind[] = ["slime", "blocks"];
const WALKABLE: TileKind[] = ["floor"];

export interface PlacedThing {
  char: string;
  col: number;
  row: number;
  thing: Thing;
}

export interface ParsedRoom {
  name: string;
  tiles: TileKind[][];
  spawn: { col: number; row: number } | null;
  things: PlacedThing[];
}

export function parseRoom(room: Room): ParsedRoom {
  const tiles: TileKind[][] = [];
  const things: PlacedThing[] = [];
  let spawn: ParsedRoom["spawn"] = null;

  room.layout.forEach((line, row) => {
    tiles.push(
      [...line].map((ch, col) => {
        if (ch === "N") spawn = { col, row };
        const thing = room.things?.[ch];
        if (thing) {
          things.push({ char: ch, col, row, thing });
          return "thing";
        }
        return TILE_CHARS[ch] ?? "wall";
      }),
    );
  });
  return { name: room.name, tiles, spawn, things };
}

export function tileAt(room: ParsedRoom, col: number, row: number): TileKind {
  return room.tiles[row]?.[col] ?? "wall";
}

/** Can Nora's feet be on this tile? Low obstacles are fine while jumping. */
export function isPassable(kind: TileKind, airborne: boolean): boolean {
  return WALKABLE.includes(kind) || (airborne && LOW_OBSTACLES.includes(kind));
}

export function isLowObstacle(kind: TileKind): boolean {
  return LOW_OBSTACLES.includes(kind);
}

/** Checks a whole case. Returns problems in Swedish – empty when OK. */
export function validateCase(c: Case): string[] {
  const errors: string[] = [];
  if (!c.rooms[c.startRoom]) errors.push(`Fallet '${c.title}': startrummet '${c.startRoom}' finns inte.`);

  for (const [id, room] of Object.entries(c.rooms)) {
    const where = `Rummet '${room.name}'`;
    if (room.layout.length !== ROOM_ROWS) {
      errors.push(`${where} har ${room.layout.length} rader, ska ha ${ROOM_ROWS}.`);
    }
    room.layout.forEach((line, r) => {
      if (line.length !== ROOM_COLS) {
        errors.push(`Rad ${r + 1} i ${where.toLowerCase()} har ${line.length} tecken, ska ha ${ROOM_COLS}.`);
      }
      for (const ch of line) {
        if (!(ch in TILE_CHARS) && !room.things?.[ch]) {
          errors.push(`Rad ${r + 1} i ${where.toLowerCase()}: tecknet '${ch}' betyder ingenting.`);
        }
      }
    });
    for (const ch of Object.keys(room.things ?? {})) {
      if (!room.layout.some((line) => line.includes(ch))) {
        errors.push(`${where}: saken '${ch}' finns inte på kartan.`);
      }
    }
    const starts = room.layout.join("").split("N").length - 1;
    if (id === c.startRoom && starts !== 1) {
      errors.push(`${where} är startrum och ska ha exakt ett N, har ${starts}.`);
    }
  }
  return errors;
}
