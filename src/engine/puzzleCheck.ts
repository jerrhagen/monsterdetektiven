import type { CodePuzzle, OrderPuzzle, RevealQuestion } from "../cases/types";

/** Digits typed into a code lock. Spaces and leading zeros don't matter. */
export function checkCode(p: CodePuzzle, input: string): boolean {
  const clean = (s: string) => s.replace(/\s/g, "").replace(/^0+(?=\d)/, "");
  return clean(input) === clean(p.answer);
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
