import type { CodePuzzle, OrderPuzzle, RevealPuzzle } from "../cases/types";

/** Digits typed into a code lock. Spaces and leading zeros don't matter. */
export function checkCode(p: CodePuzzle, input: string): boolean {
  const clean = (s: string) => s.replace(/\s/g, "").replace(/^0+(?=\d)/, "");
  return clean(input) === clean(p.answer);
}

export function checkOrder(p: OrderPuzzle, picked: string[]): boolean {
  return picked.length === p.answer.length && picked.every((id, i) => id === p.answer[i]);
}

/** One clue from each proof group – each clue has to show something different. */
export function checkEvidence(p: RevealPuzzle, picked: string[]): boolean {
  if (picked.length !== p.proof.length || new Set(picked).size !== picked.length) return false;
  // Try to match every picked clue to its own group.
  const match = (i: number, used: Set<number>): boolean => {
    if (i === picked.length) return true;
    return p.proof.some((group, g) => !used.has(g) && group.includes(picked[i]) && match(i + 1, new Set([...used, g])));
  };
  return match(0, new Set());
}

/** What Ester says when the evidence doesn't hold. */
export function explainEvidence(p: RevealPuzzle, picked: string[]): string {
  const useless = picked.find((id) => !p.proof.some((group) => group.includes(id)));
  if (useless) return p.why?.[useless] ?? "Den ledtråden bevisar inte det. Välj en annan!";
  return "De två ledtrådarna visar nästan samma sak. Välj en som visar något annat också!";
}
