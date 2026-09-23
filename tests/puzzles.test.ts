import { describe, expect, it } from "vitest";
import type { CodePuzzle, OrderPuzzle, RevealPuzzle } from "../src/cases/types";
import { checkCode, checkEvidence, checkOrder } from "../src/engine/puzzleCheck";

const code: CodePuzzle = { type: "code", title: "", text: [], answer: "15", gives: "x" };
const order: OrderPuzzle = {
  type: "order",
  title: "",
  text: [],
  options: ["a", "b", "c", "d"].map((id) => ({ id, label: id })),
  answer: ["a", "b", "c"],
  gives: "x",
};
const reveal: RevealPuzzle = {
  type: "reveal",
  title: "",
  text: [],
  options: [{ id: "who", label: "Vem" }],
  answer: "who",
  evidence: ["e1", "e2", "e3"],
  gives: "x",
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
  it("kräver två olika ledtrådar som båda bevisar svaret", () => {
    expect(checkEvidence(reveal, ["e1", "e3"])).toBe(true);
    expect(checkEvidence(reveal, ["e1", "e1"])).toBe(false);
    expect(checkEvidence(reveal, ["e1", "falskt"])).toBe(false);
    expect(checkEvidence(reveal, ["e1"])).toBe(false);
  });
});
