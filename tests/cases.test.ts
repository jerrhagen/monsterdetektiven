import { describe, expect, it } from "vitest";
import { cases } from "../src/cases";
import type { Case } from "../src/cases/types";
import { CaseState } from "../src/engine/caseState";
import { entryPoint, parseRoom, validateCase } from "../src/engine/room";
import { sprites } from "../src/sprites";

describe("fallen", () => {
  for (const c of cases) {
    it(`'${c.title}' är korrekt byggt`, () => {
      expect(validateCase(c)).toEqual([]);
    });

    it(`'${c.title}' använder bara figurer som finns`, () => {
      const used = [
        ...Object.values(c.rooms).flatMap((r) => Object.values(r.things ?? {}).map((t) => t.sprite)),
        ...Object.values(c.clues).map((cl) => cl.sprite),
        ...Object.values(c.items ?? {}).map((i) => i.sprite),
        ...Object.values(c.rooms).flatMap((r) => (r.movers ?? []).map((m) => m.sprite)),
      ];
      for (const sprite of used) expect(sprites, sprite).toHaveProperty(sprite);
    });

    it(`'${c.title}': alla dörrar leder till en golvruta`, () => {
      for (const [id, room] of Object.entries(c.rooms)) {
        const parsed = parseRoom(c, id);
        for (const door of room.doors ?? []) {
          const p = entryPoint(parsed, door.at);
          for (const col of [Math.floor(p.col), Math.ceil(p.col)]) {
            for (const row of [Math.floor(p.row), Math.ceil(p.row)]) {
              expect(parsed.tiles[row][col], `${room.name}, dörr ${door.at}`).toMatch(/floor|sand/);
            }
          }
        }
      }
    });
  }

  it("hittar fel i en trasig karta", () => {
    const broken: Case = {
      summary: [],
      id: "x",
      number: 0,
      title: "Trasig",
      intro: [],
      finale: [],
      fact: "",
      cards: [],
      startRoom: "a",
      rooms: { a: { name: "A", theme: "shop", layout: ["#?#"], doors: [{ at: "left", to: "nope", requires: "magi" }] } },
      clues: {},
      goals: [{ text: "Omöjligt", doneWhen: "aldrig", hints: [] }],
    };
    const errors = validateCase(broken);
    expect(errors.some((e) => e.includes("rader"))).toBe(true);
    expect(errors.some((e) => e.includes("'?'"))).toBe(true);
    expect(errors.some((e) => e.includes("exakt ett N"))).toBe(true);
    expect(errors.some((e) => e.includes("'magi' kan man aldrig få"))).toBe(true);
    expect(errors.some((e) => e.includes("'aldrig' kan man aldrig få"))).toBe(true);
    expect(errors.some((e) => e.includes("'nope' som inte finns"))).toBe(true);
    expect(errors.some((e) => e.includes("inga tips"))).toBe(true);
  });
});

describe("detektivens anteckningar", () => {
  const c = cases[0];

  it("börjar med första målet", () => {
    expect(new CaseState(c).currentGoalIndex()).toBe(0);
  });

  it("går vidare till nästa mål när flaggor ges", () => {
    const state = new CaseState(c);
    state.give("talked-to-stina");
    expect(state.currentGoalIndex()).toBe(1);
    state.give(["clue:dots", "clue:thread", "clue:teddy", "clue:customerBook", "storeroom-key"]);
    expect(state.currentGoalIndex()).toBe(2);
    state.give("visited:storeroom");
    expect(state.currentGoalIndex()).toBe(3);
    expect(state.give(["talked-to-stina", "clue:thread"])).toEqual([]);
    expect(state.foundClues()).toEqual(["dots", "thread", "teddy", "customerBook"]);
  });

  it("Ester ger tydligare och tydligare tips för det aktuella målet", () => {
    const state = new CaseState(c);
    const hints = c.goals[0].hints as string[];
    expect(state.nextHint()).toBe(hints[0]);
    expect(state.nextHint()).toBe(hints[1]);
    expect(state.nextHint()).toBe(hints[2]);
    expect(state.nextHint()).toBe(hints[2]);
    expect(state.hintsUsed).toBe(4);
    state.give("talked-to-stina");
    expect(state.nextHint()).toContain("glöder");
  });

  it("målet 'prata med Stina' blir klart även om man hittat ledtrådarna först", () => {
    const state = new CaseState(c);
    state.give(["clue:dots", "clue:thread", "clue:teddy", "clue:customerBook"]);
    const talk = state.talkFor(c.rooms.store.things!.s);
    state.give(talk.gives);
    expect(state.has("talked-to-stina")).toBe(true);
    expect(state.has("heard-about-register")).toBe(true);
    expect(state.currentGoalIndex()).toBe(2);
  });

  it("Ester tipsar inte om sådant man redan gjort", () => {
    const state = new CaseState(c);
    state.give(["talked-to-stina", "clue:teddy"]);
    for (let i = 0; i < 5; i++) expect(state.nextHint()).not.toContain("Nallen");
    state.give(["clue:dots", "clue:thread", "clue:customerBook", "heard-about-register", "storeroom-key"]);
    expect(state.nextHint()).toContain("Du har nyckeln");
  });

  it("väljer rätt repliker beroende på vad man gjort", () => {
    const state = new CaseState(c);
    const stina = c.rooms.store.things!.s;
    expect(state.talkFor(stina).gives).toBe("talked-to-stina");
    state.give("talked-to-stina");
    expect(state.talkFor(stina).gives).toEqual(["talked-to-stina"]);
    state.give(["clue:dots", "clue:thread", "clue:teddy", "clue:customerBook"]);
    expect(state.talkFor(stina).gives).toEqual(["talked-to-stina", "heard-about-register"]);
    state.give("heard-about-register");
    expect(state.talkFor(stina).gives).toEqual(["talked-to-stina"]);
    state.give("storeroom-key");
    expect(state.items()).toEqual(["storeroom-key"]);
  });
});
