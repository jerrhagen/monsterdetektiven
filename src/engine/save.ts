/** Progress saved in the browser (localStorage). Everything is wrapped in try/catch: storage can be blocked. */

const KEY = "monsterdetektiven-v1";

export interface CaseRecord {
  stars: number;
  /** Fastest time in seconds. */
  bestTime: number;
  egg: boolean;
}

export interface SaveData {
  cases: Record<string, CaseRecord>;
  /** Names of the monster cards collected. */
  cards: string[];
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<SaveData>;
      return { cases: data.cases ?? {}, cards: data.cards ?? [] };
    }
  } catch {
    // Nothing saved, or storage not available.
  }
  return { cases: {}, cards: [] };
}

function write(data: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // The game still works, it just doesn't remember.
  }
}

export interface Result {
  stars: number;
  seconds: number;
  egg: boolean;
  newRecord: boolean;
  newCards: string[];
}

/** Remembers a solved case: best stars, best time, the egg and new monster cards. */
export function recordSolved(
  caseId: string,
  run: { stars: number; seconds: number; egg: boolean },
  cards: string[],
): Result {
  const data = loadSave();
  const before = data.cases[caseId];
  const newRecord = !before || run.seconds < before.bestTime;
  data.cases[caseId] = {
    stars: Math.max(run.stars, before?.stars ?? 0),
    bestTime: Math.min(run.seconds, before?.bestTime ?? Infinity),
    egg: run.egg || !!before?.egg,
  };
  const newCards = cards.filter((c) => !data.cards.includes(c));
  data.cards.push(...newCards);
  write(data);
  return { ...run, newRecord, newCards };
}

/** Stars for a solved case: solved, at most two hints from Ester, found the secret egg. */
export function starsFor(hintsUsed: number, egg: boolean): number {
  return 1 + (hintsUsed <= 2 ? 1 : 0) + (egg ? 1 : 0);
}

export function formatTime(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)} min ${s % 60} s`;
}
