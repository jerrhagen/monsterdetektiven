import { describe, expect, it } from "vitest";
import { cases } from "../src/cases";
import type { Case, Puzzle, Thing } from "../src/cases/types";
import { CaseState, clueFlag, flagList } from "../src/engine/caseState";
import { emergedFlag } from "../src/engine/monsters";
import { rollPuzzle } from "../src/engine/puzzleRoll";
import { SYSTEM_FLAGS, visitedFlag } from "../src/engine/room";
import { sprites } from "../src/sprites";
import { validatePixelSprite } from "../src/sprites/pixelSprite";

/** Every thing in a case, including the ones that belong to monsters. */
function allThings(c: Case): Thing[] {
  return Object.values(c.rooms).flatMap((r) => [
    ...Object.values(r.things ?? {}),
    ...(r.monsters ?? []).flatMap((m) => ("thing" in m && m.thing ? [m.thing] : [])),
  ]);
}

function puzzleSprites(p: Puzzle): (string | undefined)[] {
  switch (p.type) {
    case "order":
      return [...p.options.map((o) => o.sprite), p.alphabetize?.sprite];
    case "choice":
      return [...p.options, ...(p.variants ?? []).flatMap((v) => v.options)].map((o) => o.sprite);
    case "reveal":
      return p.questions.flatMap((q) => q.options.map((o) => o.sprite));
    case "match":
      return p.rightSprites ? p.pairs.map((pair) => pair[1]) : [];
    default:
      return [];
  }
}

/** Where a clue can be found (room id). */
function roomOfClue(c: Case, clue: string): string | undefined {
  return Object.entries(c.rooms).find(([, r]) => {
    const things = [
      ...Object.values(r.things ?? {}),
      ...(r.monsters ?? []).flatMap((m) => ("thing" in m && m.thing ? [m.thing] : [])),
    ];
    const fromThings = things.flatMap((t) => [t, ...(t.talkIf ?? [])].flatMap((v) => flagList(v.clue)));
    return [...Object.values(r.clues ?? {}), ...fromThings, ...flagList(r.onEnter?.clue)].includes(clue);
  })?.[0];
}

describe("alla fall", () => {
  it("alla figurer är korrekt ritade", () => {
    for (const [key, sprite] of Object.entries(sprites)) expect(validatePixelSprite(key, sprite), key).toEqual([]);
  });

  for (const c of cases) {
    describe(`fall ${c.number}: ${c.title}`, () => {
      it("har rätt nummer och unikt id", () => {
        expect(cases.indexOf(c)).toBe(c.number - 1);
        expect(cases.filter((o) => o.id === c.id)).toHaveLength(1);
      });

      it("använder bara figurer som finns", () => {
        const used = [
          ...allThings(c).map((t) => t.sprite),
          ...Object.values(c.clues).map((cl) => cl.sprite),
          ...Object.values(c.items ?? {}).map((i) => i.sprite),
          ...Object.values(c.rooms).flatMap((r) => (r.movers ?? []).map((m) => m.sprite)),
          ...Object.values(c.rooms).flatMap((r) =>
            (r.monsters ?? []).flatMap((m) => [m.sprite, "perchSprite" in m ? m.perchSprite : undefined]),
          ),
          ...Object.values(c.puzzles ?? {}).flatMap(puzzleSprites),
          ...c.cards.map((card) => card.sprite),
          ...c.finale.flatMap((s) => ("sprite" in s ? [s.sprite] : [])),
        ].filter((s): s is string => !!s);
        for (const key of used) expect(sprites, `${c.title}: ${key}`).toHaveProperty(key);
      });

      it("har förstoringsglas, monsterägg och tre monsterkort", () => {
        expect(c.items).toHaveProperty("magnifier");
        expect(c.items).toHaveProperty("egg");
        expect(allThings(c).some((t) => flagList(t.gives).includes("egg"))).toBe(true);
        expect(c.cards).toHaveLength(3);
        expect(c.fact.length).toBeGreaterThan(20);
        expect(c.intro.length).toBeGreaterThan(1);
      });

      it("alla pussel går att slumpa fram många gånger", () => {
        for (const [id, p] of Object.entries(c.puzzles ?? {})) {
          for (let i = 0; i < 100; i++) expect(() => rollPuzzle(id, p), `${c.title}: ${id}`).not.toThrow();
        }
      });

      it("avslöjandet kräver ledtrådar från minst två rum", () => {
        const reveals = Object.values(c.puzzles ?? {}).filter((p) => p.type === "reveal");
        expect(reveals.length).toBeGreaterThan(0);
        for (const p of reveals) {
          if (p.type !== "reveal") continue;
          for (const q of p.questions) {
            const rooms = new Set(q.proof.map((clue) => roomOfClue(c, clue)));
            expect(rooms.has(undefined), `${c.title}: en bevisledtråd finns inte i något rum`).toBe(false);
            expect(rooms.size, `${c.title}: ${q.question}`).toBeGreaterThanOrEqual(2);
          }
        }
      });

      it("Ester har något att säga om varje ledtråd och varje fel svar", () => {
        for (const p of Object.values(c.puzzles ?? {})) {
          if (p.type !== "reveal") continue;
          for (const q of p.questions) {
            const where = `${c.title}: ${q.question}`;
            for (const clue of Object.keys(c.clues)) {
              if (q.proof.includes(clue)) expect(q.missing?.[clue], `${where} – 'missing' för ${clue}`).toBeTruthy();
              else expect(q.why?.[clue], `${where} – 'why' för ${clue}`).toBeTruthy();
            }
            for (const o of q.options) {
              if (o.id !== q.answer) expect(q.whyNot?.[o.id], `${where} – 'whyNot' för ${o.id}`).toBeTruthy();
            }
          }
        }
      });

      it("avslöjandet öppnas först när alla bevis finns i boken", () => {
        const proof = Object.values(c.puzzles ?? {}).flatMap((p) => (p.type === "reveal" ? p.questions.flatMap((q) => q.proof) : []));
        const opener = allThings(c).find((t) => t.puzzle && c.puzzles?.[t.puzzle]?.type === "reveal");
        expect(opener, c.title).toBeDefined();
        const state = new CaseState(c);
        flagList(opener!.puzzleWhen).forEach((f) => state.give(f));
        for (const clue of proof) expect(state.hasClue(clue), `${c.title}: ${clue} behövs innan avslöjandet`).toBe(true);
      });

      it("Ester sammanfattar och det finns personer att prata med", () => {
        expect(c.summary.length, c.title).toBeGreaterThanOrEqual(3);
        expect(allThings(c).some((t) => t.person), c.title).toBe(true);
      });

      it("slutar med att den skyldige fångas", () => {
        expect(c.goals.at(-1)!.doneWhen).toBe("caught");
        expect(c.finale.length).toBeGreaterThan(2);
      });

      it("låser sig inte om man gör allt i omvänd ordning", () => {
        const state = new CaseState(c);
        // Every flag the case can give, handed out backwards.
        const flags = new Set<string>(SYSTEM_FLAGS);
        Object.keys(c.rooms).forEach((id) => flags.add(visitedFlag(id)));
        Object.values(c.puzzles ?? {}).forEach((p) => flags.add(p.gives));
        Object.values(c.clues).forEach((_, i) => flags.add(clueFlag(Object.keys(c.clues)[i])));
        allThings(c).forEach((t) => [t, ...(t.talkIf ?? [])].forEach((v) => flagList(v.gives).forEach((f) => flags.add(f))));
        Object.values(c.rooms).forEach((r) =>
          (r.monsters ?? []).forEach((m) => m.type === "sneaker" && m.hideUntil && flags.add(emergedFlag(m.sprite))),
        );
        [...flags].reverse().forEach((f) => state.give(f));
        expect(state.currentGoalIndex()).toBe(c.goals.length);
      });
    });
  }
});
