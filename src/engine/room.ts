import type { Case, Clue, Door, Edge, Room, Thing } from "../cases/types";
import { clueFlag, flagList } from "./caseState";
import { ROOM_COLS, ROOM_ROWS } from "./config";

export type TileKind =
  | "wall"
  | "floor"
  | "sand"
  | "puddle"
  | "blocks"
  | "door"
  | "shelf"
  | "counter"
  | "crate"
  | "tree"
  | "thing";

/** Layout characters. Lowercase letters are things and digits are clues, both defined in the room. */
export const TILE_CHARS: Record<string, TileKind> = {
  "#": "wall",
  ".": "floor",
  S: "sand",
  "~": "puddle", // jump over (slime indoors, water outdoors)
  "=": "blocks", // jump over
  D: "door",
  H: "shelf",
  K: "counter",
  L: "crate",
  T: "tree",
  N: "floor", // Nora's start
  E: "floor", // Ester's spot
};

const LOW_OBSTACLES: TileKind[] = ["puddle", "blocks"];
const WALKABLE: TileKind[] = ["floor", "sand"];

export interface PlacedThing {
  col: number;
  row: number;
  thing: Thing;
}

export interface PlacedClue {
  col: number;
  row: number;
  id: string;
  clue: Clue;
}

export interface ParsedRoom {
  id: string;
  data: Room;
  /** What Nora collides with. */
  tiles: TileKind[][];
  /** What is drawn (things stand on floor, or on e.g. the counter). */
  base: TileKind[][];
  spawn: { col: number; row: number } | null;
  things: PlacedThing[];
  clues: PlacedClue[];
}

export function parseRoom(c: Case, id: string): ParsedRoom {
  const data = c.rooms[id];
  const tiles: TileKind[][] = [];
  const base: TileKind[][] = [];
  const things: PlacedThing[] = [];
  const clues: PlacedClue[] = [];
  let spawn: ParsedRoom["spawn"] = null;

  data.layout.forEach((line, row) => {
    const baseLine: TileKind[] = [];
    base.push(baseLine);
    tiles.push(
      [...line].map((ch, col) => {
        if (ch === "N") spawn = { col, row };
        const thing = data.things?.[ch];
        const nextToSand = [line[col - 1], line[col + 1]].some((n) => TILE_CHARS[n] === "sand");
        const ground: TileKind = nextToSand ? "sand" : "floor";
        if (thing) {
          things.push({ col, row, thing });
          baseLine.push(thing.on ? (TILE_CHARS[thing.on] ?? ground) : ground);
          return "thing";
        }
        const clueId = data.clues?.[ch];
        if (clueId) {
          clues.push({ col, row, id: clueId, clue: c.clues[clueId] });
          baseLine.push(ground);
          return ground;
        }
        const kind = TILE_CHARS[ch] ?? "wall";
        baseLine.push(kind);
        return kind;
      }),
    );
  });
  return { id, data, tiles, base, spawn, things, clues };
}

export function tileAt(room: ParsedRoom, col: number, row: number): TileKind {
  return room.tiles[row]?.[col] ?? "wall";
}

export function isWalkable(kind: TileKind, airborne: boolean): boolean {
  return WALKABLE.includes(kind) || (airborne && LOW_OBSTACLES.includes(kind));
}

export function isLowObstacle(kind: TileKind): boolean {
  return LOW_OBSTACLES.includes(kind);
}

/** Which edge a door tile is on. */
export function edgeOf(col: number, row: number): Edge | null {
  if (col === 0) return "left";
  if (col === ROOM_COLS - 1) return "right";
  if (row === 0) return "top";
  if (row === ROOM_ROWS - 1) return "bottom";
  return null;
}

export function doorAt(room: ParsedRoom, col: number, row: number): Door | undefined {
  if (tileAt(room, col, row) !== "door") return undefined;
  const edge = edgeOf(col, row);
  return room.data.doors?.find((d) => d.at === edge);
}

export const OPPOSITE: Record<Edge, Edge> = { left: "right", right: "left", top: "bottom", bottom: "top" };

/** Where Nora appears when entering through the door on `edge`: one tile inside, in the middle of the door. */
export function entryPoint(room: ParsedRoom, edge: Edge): { col: number; row: number } {
  const tiles: { col: number; row: number }[] = [];
  room.tiles.forEach((line, row) =>
    line.forEach((kind, col) => {
      if (kind === "door" && edgeOf(col, row) === edge) tiles.push({ col, row });
    }),
  );
  const mid = (xs: number[]) => (Math.min(...xs) + Math.max(...xs)) / 2;
  const col = mid(tiles.map((t) => t.col));
  const row = mid(tiles.map((t) => t.row));
  const inward = { left: [1, 0], right: [-1, 0], top: [0, 1], bottom: [0, -1] }[edge];
  return { col: col + inward[0], row: row + inward[1] };
}

/** Flags set by the game itself rather than by things in the rooms. */
export const SYSTEM_FLAGS = ["solved"];

/** Set the first time Nora walks into a room. */
export const visitedFlag = (roomId: string) => `visited:${roomId}`;

/** Every flag something in the case can give. */
function givableFlags(c: Case): Set<string> {
  const out = new Set<string>(SYSTEM_FLAGS);
  for (const id of Object.keys(c.rooms)) out.add(visitedFlag(id));
  for (const p of Object.values(c.puzzles ?? {})) out.add(p.gives);
  for (const room of Object.values(c.rooms)) {
    for (const clueId of Object.values(room.clues ?? {})) out.add(clueFlag(clueId));
    for (const thing of Object.values(room.things ?? {})) {
      for (const t of [thing, ...(thing.talkIf ?? [])]) {
        flagList(t.gives).forEach((f) => out.add(f));
        if (t.clue) out.add(clueFlag(t.clue));
      }
    }
  }
  return out;
}

/** Checks a whole case. Returns problems in Swedish – empty when OK. */
export function validateCase(c: Case): string[] {
  const errors: string[] = [];
  const givable = givableFlags(c);
  const need = (flags: string[] | string | undefined, where: string) => {
    for (const f of flagList(flags)) {
      if (!givable.has(f)) errors.push(`${where}: '${f}' kan man aldrig få.`);
    }
  };

  if (!c.rooms[c.startRoom]) errors.push(`Fallet '${c.title}': startrummet '${c.startRoom}' finns inte.`);

  for (const [id, room] of Object.entries(c.rooms)) {
    const where = `rummet '${room.name}'`;
    if (room.layout.length !== ROOM_ROWS) {
      errors.push(`I ${where} finns ${room.layout.length} rader, det ska vara ${ROOM_ROWS}.`);
    }
    room.layout.forEach((line, r) => {
      if (line.length !== ROOM_COLS) {
        errors.push(`Rad ${r + 1} i ${where} har ${line.length} tecken, ska ha ${ROOM_COLS}.`);
      }
      [...line].forEach((ch, col) => {
        if (!(ch in TILE_CHARS) && !room.things?.[ch] && !room.clues?.[ch]) {
          errors.push(`Rad ${r + 1} i ${where}: tecknet '${ch}' betyder ingenting.`);
        }
        if (ch === "D") {
          const edge = edgeOf(col, r);
          if (!edge) errors.push(`Rad ${r + 1} i ${where}: dörren måste sitta i en kant.`);
          else if (!room.doors?.some((d) => d.at === edge)) {
            errors.push(`I ${where} finns en dörr i kanten '${edge}' som inte är beskriven.`);
          }
        }
      });
    });
    for (const ch of [...Object.keys(room.things ?? {}), ...Object.keys(room.clues ?? {})]) {
      if (!room.layout.some((line) => line.includes(ch))) errors.push(`I ${where}: '${ch}' finns inte på kartan.`);
    }
    for (const clueId of Object.values(room.clues ?? {})) {
      if (!c.clues[clueId]) errors.push(`I ${where}: ledtråden '${clueId}' är inte beskriven.`);
    }
    for (const thing of Object.values(room.things ?? {})) {
      for (const t of thing.talkIf ?? []) need(t.when, `${thing.name} i ${where}`);
      for (const t of [thing, ...(thing.talkIf ?? [])]) {
        if (t.clue && !c.clues[t.clue]) errors.push(`${thing.name}: ledtråden '${t.clue}' är inte beskriven.`);
      }
    }
    for (const door of room.doors ?? []) {
      need(door.requires, `Dörren '${door.at}' i ${where}`);
      if (!room.layout.some((line, r) => [...line].some((ch, col) => ch === "D" && edgeOf(col, r) === door.at))) {
        errors.push(`I ${where}: dörren '${door.at}' finns inte på kartan.`);
      }
      if (door.to) {
        const target = c.rooms[door.to];
        if (!target) errors.push(`Dörren '${door.at}' i ${where} leder till '${door.to}' som inte finns.`);
        else if (!target.doors?.some((d) => d.at === OPPOSITE[door.at])) {
          errors.push(`Dörren '${door.at}' i ${where} leder till '${target.name}', men där finns ingen dörr tillbaka.`);
        }
      }
    }
    room.movers?.forEach((m, i) => {
      for (const [col, row] of m.path) {
        const ch = room.layout[row]?.[col];
        if (!ch || !WALKABLE.includes(TILE_CHARS[ch] ?? "wall")) {
          errors.push(`I ${where}: leksak nr ${i + 1} kör genom (${col}, ${row}) där det inte är golv.`);
        }
      }
    });
    const starts = room.layout.join("").split("N").length - 1;
    if (id === c.startRoom && starts !== 1) {
      errors.push(`${where} är startrum och ska ha exakt ett N, har ${starts}.`);
    }
  }

  for (const room of Object.values(c.rooms)) {
    const usedPuzzles = [
      ...Object.values(room.things ?? {}).map((t) => t.puzzle),
      ...(room.doors ?? []).map((d) => d.puzzle),
    ];
    for (const id of usedPuzzles) {
      if (id && !c.puzzles?.[id]) errors.push(`I rummet '${room.name}': pusslet '${id}' finns inte.`);
    }
    for (const thing of Object.values(room.things ?? {})) need(thing.puzzleWhen, `${thing.name} (pussel)`);
  }
  for (const [id, p] of Object.entries(c.puzzles ?? {})) {
    const where = `Pusslet '${id}'`;
    if (p.type === "code" && !/^\d+$/.test(p.answer)) errors.push(`${where}: svaret ska bara vara siffror.`);
    if (p.type === "order" || p.type === "choice" || p.type === "reveal") {
      const ids = p.options.map((o) => o.id);
      const answers = p.type === "order" ? p.answer : [p.answer];
      for (const a of answers) if (!ids.includes(a)) errors.push(`${where}: svaret '${a}' finns inte bland valen.`);
    }
    if (p.type === "reveal") {
      if (p.evidence.length < 2) errors.push(`${where}: behöver minst två bevis.`);
      for (const e of p.evidence) if (!c.clues[e]) errors.push(`${where}: beviset '${e}' är ingen ledtråd.`);
    }
  }

  c.goals.forEach((g, i) => {
    need(g.doneWhen, `Mål ${i + 1}`);
    if (g.hints.length === 0) errors.push(`Mål ${i + 1} ('${g.text}') har inga tips från Ester.`);
  });
  return errors;
}
