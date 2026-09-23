import type { CodePuzzle, OrderPuzzle, RevealPuzzle } from "../cases/types";

/** Digits typed into a code lock. Spaces and leading zeros don't matter. */
export function checkCode(p: CodePuzzle, input: string): boolean {
  const clean = (s: string) => s.replace(/\s/g, "").replace(/^0+(?=\d)/, "");
  return clean(input) === clean(p.answer);
}

export function checkOrder(p: OrderPuzzle, picked: string[]): boolean {
  return picked.length === p.answer.length && picked.every((id, i) => id === p.answer[i]);
}

/** Two different clues, both of which prove the answer. */
export function checkEvidence(p: RevealPuzzle, picked: string[]): boolean {
  return picked.length === 2 && new Set(picked).size === 2 && picked.every((id) => p.evidence.includes(id));
}
