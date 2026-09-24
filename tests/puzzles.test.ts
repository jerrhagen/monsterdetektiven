import { describe, expect, it } from "vitest";
import type { CodePuzzle, CoinsPuzzle, GridPuzzle, OrderPuzzle, RevealQuestion, WordPuzzle } from "../src/cases/types";
import { cases } from "../src/cases";
import { CaseState } from "../src/engine/caseState";
import { checkCode, checkCoins, checkEvidence, checkGrid, checkOrder, checkWord, explainEvidence } from "../src/engine/puzzleCheck";
import { countGridSolutions, evaluate, fewestCoins, fillIn, fitsInGrid, rollPuzzle, timeText, toCipher } from "../src/engine/puzzleRoll";

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
  proof: ["a", "b", "c"],
  why: { falskt: "Det där bevisar inget." },
  missing: { b: "Glömde du b?" },
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
  it("kräver att man markerar alla ledtrådar som visar svaret, och inga andra", () => {
    expect(checkEvidence(reveal, ["a", "b", "c"])).toBe(true);
    expect(checkEvidence(reveal, ["c", "a", "b"])).toBe(true);
    expect(checkEvidence(reveal, ["a", "b"])).toBe(false);
    expect(checkEvidence(reveal, ["a", "b", "falskt"])).toBe(false);
    expect(checkEvidence(reveal, ["a", "b", "c", "falskt"])).toBe(false);
  });

  it("Ester förklarar först det som är fel, sedan det som saknas", () => {
    expect(explainEvidence(reveal, ["a", "falskt", "c"])).toBe("Det där bevisar inget.");
    expect(explainEvidence(reveal, ["a", "c"])).toBe("Glömde du b?");
    expect(explainEvidence(reveal, ["b"])).toContain("saknas");
  });

  it("i fall 1 räcker det inte att välja sanna ledtrådar på måfå", () => {
    const p = cases[0].puzzles!.reveal;
    if (p.type !== "reveal") throw new Error("fel typ");
    const [what, whose] = p.questions;
    expect(checkEvidence(what, ["sandprints", "fladderSaw"])).toBe(false);
    expect(checkEvidence(what, ["dots", "sandprints", "fladderSaw", "viskan"])).toBe(true);
    expect(checkEvidence(whose, ["customerBook", "gift", "sleeve", "poster"])).toBe(false);
    expect(checkEvidence(whose, ["poster", "sameG", "gift", "customerBook"])).toBe(true);
  });

  it("i fall 1 behövs ledtrådar från alla tre rummen för att lösa det", () => {
    const p = cases[0].puzzles!.reveal;
    if (p.type !== "reveal") throw new Error("fel typ");
    const roomOf = (clue: string) =>
      Object.entries(cases[0].rooms).find(([, r]) =>
        [...Object.values(r.clues ?? {}), ...Object.values(r.things ?? {}).flatMap((t) => [t.clue, ...(t.talkIf ?? []).map((v) => v.clue)].flat()),
          ...(r.monsters ?? []).flatMap((m) => ("thing" in m && m.thing ? [m.thing.clue, ...(m.thing.talkIf ?? []).map((v) => v.clue)].flat() : []))].includes(clue),
      )?.[0];
    const rooms = new Set(p.questions.flatMap((q) => q.proof.map(roomOf)));
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

describe("nya pusseltyper", () => {
  it("räknar med gånger också", () => {
    expect(evaluate("{a}*2", { a: "7" })).toBe(14);
    expect(evaluate("2+3*4-1", {})).toBe(13);
  });

  it("skriver klockan på svenska", () => {
    expect(timeText(3, 0)).toBe("tre");
    expect(timeText(3, 15)).toBe("kvart över tre");
    expect(timeText(3, 30)).toBe("halv fyra");
    expect(timeText(12, 45)).toBe("kvart i ett");
  });

  it("klockpusslet har fyra olika klockor och en rätt", () => {
    for (let i = 0; i < 100; i++) {
      const { puzzle } = rollPuzzle("clock", { type: "clock", title: "", text: ["Klockan är {time}."], gives: "x", minutes: [0, 30] });
      if (puzzle.type !== "clock") throw new Error("fel typ");
      const keys = new Set(puzzle.times!.map((t) => `${t.hour}:${t.minute}`));
      expect(keys.size).toBe(4);
      const right = puzzle.times!.find((t) => t.id === puzzle.answer)!;
      expect(puzzle.text[0]).toBe(`Klockan är ${timeText(right.hour, right.minute)}.`);
    }
  });

  it("ABC-ordning sorterar som på svenska (å ä ö sist)", () => {
    const { puzzle } = rollPuzzle("abc", {
      type: "order",
      title: "",
      text: [],
      options: [],
      answer: [],
      gives: "x",
      alphabetize: { words: ["öga", "äpple", "bok", "ål"], pick: 4 },
    });
    if (puzzle.type !== "order") throw new Error("fel typ");
    expect(puzzle.answer).toEqual(["bok", "ål", "äpple", "öga"]);
  });

  it("talföljder kan räknas fram ur slumpade tal", () => {
    const { vars, puzzle } = rollPuzzle("seq", {
      type: "code",
      title: "",
      text: ["{a}, {b}, {c}, ?"],
      random: { a: [2, 5], step: [2, 3] },
      derive: { b: "{a}+{step}", c: "{b}+{step}" },
      answer: "{c}+{step}",
      gives: "x",
    });
    if (puzzle.type !== "code") throw new Error("fel typ");
    expect(Number(puzzle.answer)).toBe(Number(vars.c) + Number(vars.step));
  });
});

describe("nya pusseltyper (säsong 2)", () => {
  it("klockan i femminuterssteg", () => {
    expect(timeText(3, 5)).toBe("fem över tre");
    expect(timeText(3, 25)).toBe("fem i halv fyra");
    expect(timeText(3, 35)).toBe("fem över halv fyra");
    expect(timeText(3, 40)).toBe("tjugo i fyra");
    expect(timeText(12, 55)).toBe("fem i ett");
  });

  const seq = (values: number[]) => {
    let i = 0;
    return () => values[i++ % values.length];
  };

  it("skriv ordet: blandar, vänder, gör kod och rättar förlåtande", () => {
    const base = { title: "", text: [] as string[], gives: "x", words: ["FYREN"] };
    const anagram = rollPuzzle("a", { ...base, type: "word", mode: "anagram" }).puzzle as WordPuzzle;
    expect(anagram.shown).not.toBe("FYREN");
    expect([...anagram.shown!].sort().join("")).toBe([..."FYREN"].sort().join(""));
    expect((rollPuzzle("r", { ...base, type: "word", mode: "reverse" }).puzzle as WordPuzzle).shown).toBe("NERYF");
    expect(toCipher("HEJ")).toBe("8-5-10");
    expect(toCipher("ÖÄ")).toBe("29-28");
    const rolled = rollPuzzle("c", { ...base, type: "word", mode: "cipher" });
    expect(rolled.vars).toEqual({ "c:first": "F", "c:length": "5" });
    expect(checkWord(rolled.puzzle as WordPuzzle, " fyren ")).toBe(true);
    expect(checkWord(rolled.puzzle as WordPuzzle, "FYRAN")).toBe(false);
  });

  it("handla: exakt summa, och med få mynt när det krävs", () => {
    expect(fewestCoins(17, [1, 2, 5, 10])).toBe(3);
    const p = rollPuzzle("m", { type: "coins", title: "", text: ["Det kostar {price} kr."], gives: "x", price: [17, 17], coins: [1, 2, 5, 10], fewest: true }).puzzle as CoinsPuzzle;
    expect(p.text[0]).toBe("Det kostar 17 kr.");
    expect(checkCoins(p, [10, 5, 2])).toBe("ok");
    expect(checkCoins(p, [5, 5, 5, 2])).toBe("many");
    expect(checkCoins(p, [10, 5])).toBe("little");
    expect(checkCoins(p, [10, 10])).toBe("much");
  });

  it("monster-sudoku: giltig lösning, bara ett sätt att lösa, och rättning", () => {
    for (let n = 0; n < 50; n++) {
      const p = rollPuzzle("g", { type: "grid", title: "", text: [], gives: "x", symbols: ["a", "b", "c", "d"], givens: 6 }).puzzle as GridPuzzle;
      const sol = p.solution!;
      expect(sol.every((v, i) => fitsInGrid(sol, i, v))).toBe(true);
      const cells = sol.map((v, i) => (p.given![i] ? v : null));
      expect(countGridSolutions(cells)).toBe(1);
      expect(p.given!.filter(Boolean).length).toBeGreaterThanOrEqual(6);
      expect(checkGrid(p, sol)).toBe(true);
      expect(checkGrid(p, cells)).toBe(false);
    }
    // A swapped pair breaks a row.
    const p = rollPuzzle("g", { type: "grid", title: "", text: [], gives: "x", symbols: ["a", "b", "c", "d"], givens: 16 }, seq([0.1, 0.7, 0.3])).puzzle as GridPuzzle;
    const wrong = [...p.solution!];
    [wrong[0], wrong[1]] = [wrong[1], wrong[0]];
    expect(checkGrid({ ...p, given: new Array(16).fill(false) }, wrong)).toBe(false);
  });
});
