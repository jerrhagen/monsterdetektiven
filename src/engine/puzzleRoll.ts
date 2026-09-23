import type { ChoicePuzzle, CodePuzzle, OrderPuzzle, Puzzle } from "../cases/types";

/** A rolled puzzle, plus values that goal hints may show with {name}. */
export interface Rolled {
  puzzle: Puzzle;
  vars: Record<string, string>;
}

const ORDINALS = ["Först", "Sedan", "Sist"];

export function fillIn(text: string, vars: Record<string, string>): string {
  return text.replace(/\{([^{}]+)\}/g, (whole, name: string) => vars[name] ?? whole);
}

/** Evaluates "12", "{a}+{b}" or "{a}-{b}+3" once the numbers are filled in. */
export function evaluate(expression: string, vars: Record<string, string>): number {
  const filled = fillIn(expression, vars).replace(/\s/g, "");
  if (!/^\d+([+-]\d+)*$/.test(filled)) throw new Error(`Kan inte räkna ut '${expression}'.`);
  return filled.match(/[+-]?\d+/g)!.reduce((sum, term) => sum + Number(term), 0);
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Turns a puzzle with random parts into a concrete one. Puzzles without random parts come back unchanged. */
export function rollPuzzle(id: string, p: Puzzle, random: () => number = Math.random): Rolled {
  switch (p.type) {
    case "code":
      return p.random ? rollCode(p, random) : { puzzle: p, vars: {} };
    case "order":
      return p.describe && p.pick ? rollOrder(p, random) : { puzzle: p, vars: {} };
    case "choice":
      return p.variants?.length ? rollChoice(id, p, random) : { puzzle: p, vars: {} };
    default:
      return { puzzle: p, vars: {} };
  }
}

function rollCode(p: CodePuzzle, random: () => number): Rolled {
  for (let attempt = 0; attempt < 200; attempt++) {
    const vars: Record<string, string> = {};
    for (const [name, [min, max]] of Object.entries(p.random!)) {
      vars[name] = String(min + Math.floor(random() * (max - min + 1)));
    }
    for (const [name, choices] of Object.entries(p.words ?? {})) {
      const unused = choices.filter((w) => !Object.values(vars).includes(w));
      vars[name] = unused[Math.floor(random() * unused.length)];
    }
    const answer = evaluate(p.answer, vars);
    const [low, high] = p.answerRange ?? [0, Infinity];
    if (answer >= low && answer <= high) {
      return { puzzle: { ...p, text: p.text.map((t) => fillIn(t, vars)), answer: String(answer) }, vars };
    }
  }
  throw new Error(`Pusslet '${p.title}' hittar inga tal som passar.`);
}

function rollOrder(p: OrderPuzzle, random: () => number): Rolled {
  const chosen = shuffled(Object.keys(p.describe!), random).slice(0, p.pick);
  const lines = chosen.map((id, i) => {
    const ordinal = i === chosen.length - 1 ? ORDINALS[2] : ORDINALS[Math.min(i, 1)];
    return `${ordinal} ${p.describe![id]}.`;
  });
  return { puzzle: { ...p, text: [...p.text, ...lines], answer: chosen }, vars: {} };
}

function rollChoice(id: string, p: ChoicePuzzle, random: () => number): Rolled {
  const v = p.variants![Math.floor(random() * p.variants!.length)];
  return { puzzle: { ...p, text: v.text, options: v.options, answer: v.answer }, vars: { [`${id}:hint`]: v.hint } };
}

/** A copy of the options in a new random order – so the right one isn't always in the same place. */
export function shuffleOptions<T>(options: T[], random: () => number = Math.random): T[] {
  return shuffled(options, random);
}
