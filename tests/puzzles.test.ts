import { describe, expect, it } from "vitest";
import type { CodePuzzle, OrderPuzzle, RevealQuestion } from "../src/cases/types";
import { cases } from "../src/cases";
import { CaseState } from "../src/engine/caseState";
import { checkCode, checkEvidence, checkOrder, explainEvidence } from "../src/engine/puzzleCheck";
import { evaluate, fillIn, rollPuzzle } from "../src/engine/puzzleRoll";

const code: CodePuzzle = { type: "code", title: "", text: [], answer: "15", gives: "x" };
const order: OrderPuzzle = {
  type: "order",
  title: "",
  text: [],
  options: ["a", "b", "c", "d"].map((id) => ({ id, label: id })),
  answer: ["a", "b", "c"],
  gives: "x",
};
const reveal: RevealQuestion = {
  question: "Vem?",
  options: [{ id: "who", label: "Vem" }],
  answer: "who",
  proof: [
    ["a1", "a2"],
    ["b1", "b2"],
  ],
  why: { falskt: "Det där bevisar inget." },
};

describe("kodlås", () => {
  it("godtar rätt kod, även med mellanslag eller nolla först", () => {
    expect(checkCode(code, "15")).toBe(true);
    expect(checkCode(code, " 1 5 ")).toBe(true);
    expect(checkCode(code, "015")).toBe(true);
  });

  it("säger nej till fel kod", () => {
    expect(checkCode(code, "16")).toBe(false);
    expect(checkCode(code, "")).toBe(false);
  });
});

describe("ordningslås", () => {
  it("måste vara i rätt ordning", () => {
    expect(checkOrder(order, ["a", "b", "c"])).toBe(true);
    expect(checkOrder(order, ["b", "a", "c"])).toBe(false);
    expect(checkOrder(order, ["a", "b"])).toBe(false);
  });
});

describe("bevis i avslöjandet", () => {
  it("kräver en ledtråd från varje grupp", () => {
    expect(checkEvidence(reveal, ["a1", "b2"])).toBe(true);
    expect(checkEvidence(reveal, ["b1", "a2"])).toBe(true);
    expect(checkEvidence(reveal, ["a1", "a2"])).toBe(false);
    expect(checkEvidence(reveal, ["a1", "a1"])).toBe(false);
    expect(checkEvidence(reveal, ["a1", "falskt"])).toBe(false);
    expect(checkEvidence(reveal, ["a1"])).toBe(false);
  });

  it("Ester förklarar varför bevisen inte håller", () => {
    expect(explainEvidence(reveal, ["a1", "falskt"])).toBe("Det där bevisar inget.");
    expect(explainEvidence(reveal, ["a1", "a2"])).toContain("samma sak");
  });

  it("i fall 1 räcker det inte att välja två sanna ledtrådar på måfå", () => {
    const p = cases[0].puzzles!.reveal;
    if (p.type !== "reveal") throw new Error("fel typ");
    const [what, whose] = p.questions;
    expect(checkEvidence(what, ["dots", "teddy"])).toBe(false);
    expect(checkEvidence(what, ["thread", "poster"])).toBe(false);
    expect(checkEvidence(what, ["sandprints", "fladderSaw"])).toBe(true);
    expect(checkEvidence(whose, ["poster", "sleeve"])).toBe(false);
    expect(checkEvidence(whose, ["customerBook", "gift"])).toBe(true);
  });

  it("i fall 1 behövs ledtrådar från alla tre rummen för att lösa det", () => {
    const p = cases[0].puzzles!.reveal;
    if (p.type !== "reveal") throw new Error("fel typ");
    const roomOf = (clue: string) =>
      Object.entries(cases[0].rooms).find(([, r]) =>
        [...Object.values(r.clues ?? {}), ...Object.values(r.things ?? {}).flatMap((t) => [t.clue, ...(t.talkIf ?? []).map((v) => v.clue)].flat()),
          ...(r.monsters ?? []).flatMap((m) => ("thing" in m && m.thing ? [m.thing.clue, ...(m.thing.talkIf ?? []).map((v) => v.clue)].flat() : []))].includes(clue),
      )?.[0];
    const rooms = new Set(p.questions.flatMap((q) => q.proof.map((group) => roomOf(group[0]))));
    expect([...rooms].sort()).toEqual(["store", "storeroom", "yard"]);
  });
});

describe("slumpade pussel", () => {
  const c = cases[0];

  it("räknar ut uttryck med tal", () => {
    expect(evaluate("{a}+{b}", { a: "7", b: "8" })).toBe(15);
    expect(evaluate("20-{a}+1", { a: "5" })).toBe(16);
    expect(fillIn("{a} kr och {okänd}", { a: "3" })).toBe("3 kr och {okänd}");
  });

  it("kassaapparaten ger alltid ett tvåsiffrigt svar som stämmer med kvittot", () => {
    for (let i = 0; i < 200; i++) {
      const { puzzle, vars } = rollPuzzle("register", c.puzzles!.register);
      if (puzzle.type !== "code") throw new Error("fel typ");
      expect(puzzle.answer).toMatch(/^\d\d$/);
      expect(Number(puzzle.answer)).toBe(Number(vars.price1) + Number(vars.price2));
      expect(puzzle.text.join(" ")).toContain(`${vars.price1} kr`);
      expect(vars.toy1).not.toBe(vars.toy2);
    }
  });

  it("kvittot blir olika mellan omgångarna", () => {
    const receipts = new Set<string>();
    for (let i = 0; i < 300; i++) receipts.add(rollPuzzle("register", c.puzzles!.register).puzzle.text.join("|"));
    expect(receipts.size).toBeGreaterThan(100);
  });

  it("formlåset väljer tre olika former, och lappen beskriver dem i rätt ordning", () => {
    for (let i = 0; i < 50; i++) {
      const { puzzle } = rollPuzzle("shape-lock", c.puzzles!["shape-lock"]);
      if (puzzle.type !== "order") throw new Error("fel typ");
      expect(new Set(puzzle.answer).size).toBe(3);
      expect(puzzle.text[1].startsWith("Först")).toBe(true);
      expect(puzzle.text[3].startsWith("Sist")).toBe(true);
    }
  });

  it("Esters tips visar samma tal och samma gåta som pusslen", () => {
    const state = new CaseState(c);
    const register = state.puzzle("register");
    const riddle = state.puzzle("riddle");
    if (register?.type !== "code" || riddle?.type !== "choice") throw new Error("fel typ");
    state.give(["talked-to-stina", "clue:dots", "clue:thread", "clue:teddy", "clue:customerBook", "heard-about-register"]);
    let sumHint = "";
    for (let i = 0; i < 5 && !/\d/.test(sumHint); i++) sumHint = state.nextHint()!;
    const [a, b] = sumHint.match(/\d+/g)!.map(Number);
    expect(a + b).toBe(Number(register.answer));
    expect(state.fill("{riddle:hint}")).not.toContain("{");
  });
});
