import { describe, expect, it } from "vitest";
import { cases } from "../src/cases";
import { ROOM_COLS, ROOM_ROWS } from "../src/engine/config";
import { type ParsedRoom, entryPoint, isLowObstacle, isWalkable, parseRoom, tileAt } from "../src/engine/room";

/**
 * Every place Nora can stand in a room, starting from where she comes in: walking,
 * and jumping over up to three low obstacles (puddles, blocks) in a row. Things are solid.
 */
function reachable(room: ParsedRoom, from: { col: number; row: number }): Set<string> {
  const solid = new Set(room.things.map((t) => `${t.col},${t.row}`));
  const standable = (c: number, r: number) =>
    c >= 0 && r >= 0 && c < ROOM_COLS && r < ROOM_ROWS && !solid.has(`${c},${r}`) && isWalkable(tileAt(room, c, r), false);
  const seen = new Set<string>();
  const queue = [[Math.round(from.col), Math.round(from.row)]];
  while (queue.length) {
    const [c, r] = queue.pop()!;
    const key = `${c},${r}`;
    if (seen.has(key) || !standable(c, r)) continue;
    seen.add(key);
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      queue.push([c + dc, r + dr]);
      // A jump: Nora stays in the air over low obstacles (a puddle, blocks), up to three tiles.
      for (let n = 1; n <= 3 && isLowObstacle(tileAt(room, c + n * dc, r + n * dr)); n++) {
        queue.push([c + (n + 1) * dc, r + (n + 1) * dr]);
      }
    }
  }
  return seen;
}

const near = (spots: Set<string>, col: number, row: number) =>
  [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => spots.has(`${col + dc},${row + dr}`));

describe("Nora kan gå till allt i varje rum", () => {
  for (const c of cases) {
    for (const id of Object.keys(c.rooms)) {
      it(`${c.title}: ${c.rooms[id].name}`, () => {
        const room = parseRoom(c, id);
        const starts = [
          ...(room.spawn ? [room.spawn] : []),
          ...(room.data.doors ?? []).map((d) => entryPoint(room, d.at)),
        ];
        expect(starts.length).toBeGreaterThan(0);
        // Whichever way she comes in, she can get everywhere that matters.
        for (const start of starts) {
          const spots = reachable(room, start);
          for (const t of room.things) expect(near(spots, t.col, t.row), `${t.thing.name} (${t.col},${t.row})`).toBe(true);
          for (const cl of room.clues) expect(near(spots, cl.col, cl.row), `ledtråd ${cl.id}`).toBe(true);
          for (const d of room.data.doors ?? []) {
            const e = entryPoint(room, d.at);
            expect(near(spots, Math.round(e.col), Math.round(e.row)), `dörren ${d.at}`).toBe(true);
          }
        }
      });
    }
  }
});
