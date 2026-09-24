import { ROOM_COLS, ROOM_ROWS } from "../src/engine/config";
import { type ParsedRoom, isLowObstacle, isWalkable, tileAt } from "../src/engine/room";

/**
 * Every place Nora can stand in a room, starting from where she comes in: walking,
 * and jumping over up to three low obstacles (puddles, blocks) in a row. Things are solid.
 */
export function reachableFrom(room: ParsedRoom, from: { col: number; row: number }, jump = true): Set<string> {
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
      for (let n = 1; jump && n <= 3 && isLowObstacle(tileAt(room, c + n * dc, r + n * dr)); n++) {
        queue.push([c + (n + 1) * dc, r + (n + 1) * dr]);
      }
    }
  }
  return seen;
}

export const nearAny = (spots: Set<string>, col: number, row: number) =>
  [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => spots.has(`${col + dc},${row + dr}`));
