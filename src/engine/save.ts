/**
 * Progress saved in the browser (localStorage), for up to four players.
 * Everything is wrapped in try/catch: storage can be blocked, and the game must still work.
 */

const KEY = "monsterdetektiven-v2";
const OLD_KEY = "monsterdetektiven-v1";
export const PLAYER_COUNT = 4;

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

export interface Player {
  name: string;
  data: SaveData;
}

interface Store {
  current: number;
  players: Player[];
}

const emptyData = (): SaveData => ({ cases: {}, cards: [] });
const defaultName = (i: number) => `Spelare ${i + 1}`;

function freshStore(): Store {
  return { current: 0, players: Array.from({ length: PLAYER_COUNT }, (_, i) => ({ name: defaultName(i), data: emptyData() })) };
}

function readStore(): Store {
  const store = freshStore();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Store>;
      store.current = Math.min(Math.max(saved.current ?? 0, 0), PLAYER_COUNT - 1);
      saved.players?.slice(0, PLAYER_COUNT).forEach((p, i) => {
        store.players[i] = { name: p.name || defaultName(i), data: { cases: p.data?.cases ?? {}, cards: p.data?.cards ?? [] } };
      });
      return store;
    }
    // Progress saved before there were players belongs to player 1.
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const data = JSON.parse(old) as Partial<SaveData>;
      store.players[0].data = { cases: data.cases ?? {}, cards: data.cards ?? [] };
    }
  } catch {
    // Nothing saved, or storage not available.
  }
  return store;
}

function writeStore(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    localStorage.removeItem(OLD_KEY);
  } catch {
    // The game still works, it just doesn't remember.
  }
}

export function listPlayers(): Player[] {
  return readStore().players;
}

export function currentPlayer(): number {
  return readStore().current;
}

export function selectPlayer(index: number): void {
  const store = readStore();
  store.current = index;
  writeStore(store);
}

export function renamePlayer(index: number, name: string): void {
  const store = readStore();
  store.players[index].name = name.trim().slice(0, 14) || defaultName(index);
  writeStore(store);
}

/** Forgets everything a player has done (after the player confirmed it). */
export function clearPlayer(index: number): void {
  const store = readStore();
  store.players[index] = { name: defaultName(index), data: emptyData() };
  writeStore(store);
}

/** The current player's progress. */
export function loadSave(): SaveData {
  const store = readStore();
  return store.players[store.current].data;
}

export interface Result {
  stars: number;
  seconds: number;
  egg: boolean;
  newRecord: boolean;
  newCards: string[];
}

/** Remembers a solved case for the current player: best stars, best time, the egg and new monster cards. */
export function recordSolved(
  caseId: string,
  run: { stars: number; seconds: number; egg: boolean },
  cards: string[],
): Result {
  const store = readStore();
  const data = store.players[store.current].data;
  const before = data.cases[caseId];
  const newRecord = !before || run.seconds < before.bestTime;
  data.cases[caseId] = {
    stars: Math.max(run.stars, before?.stars ?? 0),
    bestTime: Math.min(run.seconds, before?.bestTime ?? Infinity),
    egg: run.egg || !!before?.egg,
  };
  const newCards = cards.filter((c) => !data.cards.includes(c));
  data.cards.push(...newCards);
  writeStore(store);
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
