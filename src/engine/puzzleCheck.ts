import type { CodePuzzle, CoinsPuzzle, GridPuzzle, OrderPuzzle, RevealQuestion, WordPuzzle } from "../cases/types";
import { fewestCoins, fitsInGrid } from "./puzzleRoll";

/** Digits typed into a code lock. Spaces and leading zeros don't matter. */
export function checkCode(p: CodePuzzle, input: string): boolean {
  const clean = (s: string) => s.replace(/\s/g, "").replace(/^0+(?=\d)/, "");
  return clean(input) === clean(p.answer);
}

/** A typed word: big or small letters and spaces don't matter. */
export function checkWord(p: WordPuzzle, typed: string): boolean {
  return typed.replace(/\s/g, "").toLocaleUpperCase("sv") === p.answer;
}

/** What the paid coins say: right, too little, too much, or right amount but too many coins. */
export function checkCoins(p: CoinsPuzzle, paid: number[]): "ok" | "little" | "much" | "many" {
  const sum = paid.reduce((a, b) => a + b, 0);
  if (sum < p.amount!) return "little";
  if (sum > p.amount!) return "much";
  if (p.fewest && paid.length > fewestCoins(p.amount!, p.coins)) return "many";
  return "ok";
}

/** A finished picture sudoku: every square filled, the given ones unchanged, no picture twice in a line or box. */
export function checkGrid(p: GridPuzzle, cells: (number | null)[]): boolean {
  if (cells.some((v) => v === null)) return false;
  if (p.given!.some((g, i) => g && cells[i] !== p.solution![i])) return false;
  return cells.every((v, i) => fitsInGrid(cells, i, v!));
}

export function checkOrder(p: OrderPuzzle, picked: string[]): boolean {
  return picked.length === p.answer.length && picked.every((id, i) => id === p.answer[i]);
}

/** Marked clues that don't show the answer, and proof clues that weren't marked. */
export function evidenceErrors(p: RevealQuestion, picked: string[]): { wrong: string[]; missing: string[] } {
  return {
    wrong: picked.filter((id) => !p.proof.includes(id)),
    missing: p.proof.filter((id) => !picked.includes(id)),
  };
}

/** Every clue that shows the answer is marked, and nothing else. */
export function checkEvidence(p: RevealQuestion, picked: string[]): boolean {
  const { wrong, missing } = evidenceErrors(p, picked);
  return wrong.length === 0 && missing.length === 0;
}

/** What Ester says when the evidence doesn't hold: first about a wrong clue, else about a missing one. */
export function explainEvidence(p: RevealQuestion, picked: string[]): string {
  const { wrong, missing } = evidenceErrors(p, picked);
  if (wrong.length) return p.why?.[wrong[0]] ?? "Den ledtråden visar inte det. Tänk en gång till!";
  if (missing.length) return p.missing?.[missing[0]] ?? "Det saknas en ledtråd. Titta i detektivboken!";
  return "";
}
