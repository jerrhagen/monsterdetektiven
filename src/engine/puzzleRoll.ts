import type { ChoicePuzzle, ClockPuzzle, CodePuzzle, CoinsPuzzle, GridPuzzle, OrderPuzzle, Puzzle, WordPuzzle } from "../cases/types";

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

/**
 * Swedish clock time, in five-minute steps: "tre", "fem över tre", "kvart över tre",
 * "fem i halv fyra", "halv fyra", "tio över halv fyra", "kvart i fyra", "fem i fyra".
 */
export function timeText(hour: number, minute: number): string {
  const h = (n: number) => HOURS[((n - 1) % 12) + 1];
  const next = h(hour + 1);
  const words: Record<number, string> = {
    0: h(hour),
    5: `fem över ${h(hour)}`,
    10: `tio över ${h(hour)}`,
    15: `kvart över ${h(hour)}`,
    20: `tjugo över ${h(hour)}`,
    25: `fem i halv ${next}`,
    30: `halv ${next}`,
    35: `fem över halv ${next}`,
    40: `tjugo i ${next}`,
    45: `kvart i ${next}`,
    50: `tio i ${next}`,
    55: `fem i ${next}`,
  };
  const text = words[minute];
  if (!text) throw new Error(`Klockan ${hour}:${minute} går inte att säga i femminuterssteg.`);
  return text;
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
    case "word":
      return rollWord(id, p, random);
    case "coins":
      return rollCoins(p, random);
    case "grid":
      return rollGrid(p, random);
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

/** The Swedish alphabet, for the secret number code (A=1 … Ö=29). */
export const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ"];

/** A word as the secret number code: "HEJ" → "8-5-10". */
export function toCipher(word: string): string {
  return [...word].map((ch) => ALPHABET.indexOf(ch) + 1).join("-");
}

function rollWord(id: string, p: WordPuzzle, random: () => number): Rolled {
  const word = p.words[Math.floor(random() * p.words.length)];
  let shown = word;
  if (p.mode === "anagram") {
    // Mix the letters, but never leave the word as it was.
    for (let i = 0; i < 20 && shown === word; i++) shown = shuffled([...word], random).join("");
  } else if (p.mode === "reverse") {
    shown = [...word].reverse().join("");
  } else if (p.mode === "cipher") {
    shown = toCipher(word);
  }
  const vars = { [`${id}:first`]: word[0], [`${id}:length`]: String([...word].length) };
  return { puzzle: { ...p, answer: word, shown }, vars };
}

/** The fewest coins that make exactly `amount` (or Infinity if it can't be done). */
export function fewestCoins(amount: number, coins: number[]): number {
  const best = new Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a && best[a - c] + 1 < best[a]) best[a] = best[a - c] + 1;
  }
  return best[amount];
}

function rollCoins(p: CoinsPuzzle, random: () => number): Rolled {
  const amount = Array.isArray(p.price) ? p.price[0] + Math.floor(random() * (p.price[1] - p.price[0] + 1)) : p.price;
  const vars = { price: String(amount), fewest: String(fewestCoins(amount, p.coins)) };
  return { puzzle: { ...p, amount, text: p.text.map((t) => fillIn(t, vars)) }, vars };
}

/** All ways to finish a 4 × 4 picture sudoku (stops counting at `limit`). */
export function countGridSolutions(cells: (number | null)[], limit = 2): number {
  const i = cells.indexOf(null);
  if (i < 0) return 1;
  let count = 0;
  for (let v = 0; v < 4 && count < limit; v++) {
    if (fitsInGrid(cells, i, v)) {
      const next = [...cells];
      next[i] = v;
      count += countGridSolutions(next, limit - count);
    }
  }
  return count;
}

/** Can symbol `v` go in square `i` – not already in its row, column or 2 × 2 box? */
export function fitsInGrid(cells: (number | null)[], i: number, v: number): boolean {
  const row = Math.floor(i / 4);
  const col = i % 4;
  for (let k = 0; k < 16; k++) {
    if (k === i || cells[k] !== v) continue;
    const r = Math.floor(k / 4);
    const c = k % 4;
    const sameBox = Math.floor(r / 2) === Math.floor(row / 2) && Math.floor(c / 2) === Math.floor(col / 2);
    if (r === row || c === col || sameBox) return false;
  }
  return true;
}

function rollGrid(p: GridPuzzle, random: () => number): Rolled {
  // Start from a valid square, then shuffle symbols, rows within bands, bands, columns and stacks.
  const base = [0, 1, 2, 3, 2, 3, 0, 1, 1, 0, 3, 2, 3, 2, 1, 0];
  const symbols = shuffled([0, 1, 2, 3], random);
  const flip = () => (random() < 0.5 ? [0, 1] : [1, 0]);
  const [b0, b1] = flip();
  const rows = [...flip().map((r) => b0 * 2 + r), ...flip().map((r) => b1 * 2 + r)];
  const [s0, s1] = flip();
  const cols = [...flip().map((c) => s0 * 2 + c), ...flip().map((c) => s1 * 2 + c)];
  const solution = Array.from({ length: 16 }, (_, i) => symbols[base[rows[Math.floor(i / 4)] * 4 + cols[i % 4]]]);
  // Hide squares one by one, as long as there is still only one way to finish it.
  const given = new Array(16).fill(true);
  for (const i of shuffled([...Array(16).keys()], random)) {
    if (given.filter(Boolean).length <= p.givens) break;
    given[i] = false;
    const cells = solution.map((v, k) => (given[k] ? v : null));
    if (countGridSolutions(cells) !== 1) given[i] = true;
  }
  return { puzzle: { ...p, solution, given }, vars: {} };
}

/** A copy of the options in a new random order – so the right one isn't always in the same place. */
export function shuffleOptions<T>(options: T[], random: () => number = Math.random): T[] {
  return shuffled(options, random);
}
