import type { ChoicePuzzle, ClockPuzzle, CodePuzzle, OrderPuzzle, Puzzle } from "../cases/types";

/** A rolled puzzle, plus values that goal hints may show with {name}. */
export interface Rolled {
  puzzle: Puzzle;
  vars: Record<string, string>;
}

const ORDINALS = ["Först", "Sedan", "Sist"];

export function fillIn(text: string, vars: Record<string, string>): string {
  return text.replace(/\{([^{}]+)\}/g, (whole, name: string) => vars[name] ?? whole);
}

/** Evaluates "12", "{a}+{b}", "{a}-{b}+3" or "{a}*2" once the numbers are filled in. */
export function evaluate(expression: string, vars: Record<string, string>): number {
  const filled = fillIn(expression, vars).replace(/\s/g, "").replace(/×/g, "*");
  if (!/^\d+([+*-]\d+)*$/.test(filled)) throw new Error(`Kan inte räkna ut '${expression}'.`);
  // Multiplication first, then plus and minus.
  return filled.match(/[+-]?[\d*]+/g)!.reduce((sum, term) => {
    const sign = term.startsWith("-") ? -1 : 1;
    const product = term.replace(/^[+-]/, "").split("*").reduce((p, f) => p * Number(f), 1);
    return sum + sign * product;
  }, 0);
}

const HOURS = ["tolv", "ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "elva", "tolv"];

/** Swedish clock time: "tre", "kvart över tre", "halv fyra", "kvart i fyra". */
export function timeText(hour: number, minute: number): string {
  const h = (n: number) => HOURS[((n - 1) % 12) + 1];
  if (minute === 0) return h(hour);
  if (minute === 15) return `kvart över ${h(hour)}`;
  if (minute === 30) return `halv ${h(hour + 1)}`;
  return `kvart i ${h(hour + 1)}`;
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
      if (p.alphabetize) return rollAlphabet(p, random);
      return p.describe && p.pick ? rollOrder(p, random) : { puzzle: p, vars: {} };
    case "choice":
      return p.variants?.length ? rollChoice(id, p, random) : { puzzle: p, vars: {} };
    case "match":
      return { puzzle: { ...p, pairs: shuffled(p.pairs, random).slice(0, p.pick ?? p.pairs.length) }, vars: {} };
    case "clock":
      return rollClock(p, random);
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
    for (const [name, expression] of Object.entries(p.derive ?? {})) {
      vars[name] = String(evaluate(expression, vars));
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

function rollAlphabet(p: OrderPuzzle, random: () => number): Rolled {
  const { words, pick, sprite } = p.alphabetize!;
  const chosen = shuffled(words, random).slice(0, pick);
  const options = chosen.map((w) => ({ id: w, label: w, sprite }));
  const answer = [...chosen].sort((a, b) => a.localeCompare(b, "sv"));
  return { puzzle: { ...p, options, answer }, vars: {} };
}

function rollClock(p: ClockPuzzle, random: () => number): Rolled {
  const minutes = p.minutes ?? [0, 15, 30, 45];
  const hour = 1 + Math.floor(random() * 12);
  const minute = minutes[Math.floor(random() * minutes.length)];
  const same = (a: { hour: number; minute: number }, b: { hour: number; minute: number }) =>
    a.hour === b.hour && a.minute === b.minute;
  const right = { hour, minute };
  // Wrong clocks that are easy to mix up: an hour off, the other kind of time, and a random one.
  const candidates = [
    { hour: (hour % 12) + 1, minute },
    { hour: ((hour + 10) % 12) + 1, minute },
    { hour, minute: minutes[(minutes.indexOf(minute) + 1) % minutes.length] },
    { hour: minute === 30 ? (hour % 12) + 1 : hour, minute: minute === 30 ? 0 : 30 },
    { hour: 1 + Math.floor(random() * 12), minute: minutes[Math.floor(random() * minutes.length)] },
  ];
  const wrong: { hour: number; minute: number }[] = [];
  for (const c of shuffled(candidates, random)) {
    if (wrong.length < 3 && !same(c, right) && !wrong.some((w) => same(w, c))) wrong.push(c);
  }
  const times = shuffled([right, ...wrong], random).map((t, i) => ({ id: `t${i}`, ...t }));
  const answer = times.find((t) => same(t, right))!.id;
  const vars = { time: timeText(hour, minute) };
  return { puzzle: { ...p, text: p.text.map((t) => fillIn(t, vars)), times, answer }, vars: {} };
}

function rollChoice(id: string, p: ChoicePuzzle, random: () => number): Rolled {
  const v = p.variants![Math.floor(random() * p.variants!.length)];
  return { puzzle: { ...p, text: v.text, options: v.options, answer: v.answer }, vars: { [`${id}:hint`]: v.hint } };
}

/** A copy of the options in a new random order – so the right one isn't always in the same place. */
export function shuffleOptions<T>(options: T[], random: () => number = Math.random): T[] {
  return shuffled(options, random);
}
