import { describe, expect, it, vi } from "vitest";
import { season1Cases as cases } from "../src/cases";
import { PLAYABLE_CASES } from "../src/engine/config";
import { formatTime, isUnlocked, recordSolved, starsFor } from "../src/engine/save";
import { season2Cases } from "../src/season2";
import { sprites } from "../src/sprites";

describe("stjärnor och tid", () => {
  it("ger en stjärna för att lösa fallet, en för få tips och en för ägget", () => {
    expect(starsFor(5, false)).toBe(1);
    expect(starsFor(2, false)).toBe(2);
    expect(starsFor(0, true)).toBe(3);
  });

  it("nytt rekord bara när man slår en tidigare tid", () => {
    // A pretend storage in memory – the real browser storage is never touched.
    const memory = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => memory.set(k, v),
      removeItem: (k: string) => memory.delete(k),
    });
    const first = recordSolved("test", { stars: 3, seconds: 300, egg: true }, []);
    expect(first.newRecord).toBe(false);
    expect(first.previousBest).toBeUndefined();
    const slower = recordSolved("test", { stars: 3, seconds: 400, egg: true }, []);
    expect(slower.newRecord).toBe(false);
    expect(slower.previousBest).toBe(300);
    const faster = recordSolved("test", { stars: 3, seconds: 200, egg: true }, []);
    expect(faster.newRecord).toBe(true);
    expect(faster.previousBest).toBe(300);
    vi.unstubAllGlobals();
  });

  it("skriver tiden i minuter och sekunder", () => {
    expect(formatTime(372.4)).toBe("6 min 12 s");
  });
});

describe("slutet på fallen", () => {
  for (const c of cases) {
    it(`'${c.title}' har bara figurer som finns i slutet och på monsterkorten`, () => {
      const used = [
        ...c.cards.map((card) => card.sprite),
        ...c.finale.flatMap((s) => ("sprite" in s ? [s.sprite] : [])),
      ];
      for (const sprite of used) expect(sprites, sprite).toHaveProperty(sprite);
    });
  }
});

describe("hemliga panelen", () => {
  it("sätter klara fall och monsterkort för en spelare", async () => {
    const save = await import("../src/engine/save");
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => (store[k] = v),
      removeItem: (k: string) => delete store[k],
    });
    save.setSolvedCases(1, { toystore: { stars: 3, bestTime: 60, egg: true } }, ["Fladder"]);
    expect(save.listPlayers()[1].data).toEqual({ cases: { toystore: { stars: 3, bestTime: 60, egg: true } }, cards: ["Fladder"] });
    vi.unstubAllGlobals();
  });
});

describe("fotona i detektivboken", () => {
  it("finns för varje fall i säsong 1 och använder bara figurer som finns", async () => {
    const { PHOTO_CASES, PHOTO_SPRITES } = await import("../src/ui/casePhotos");
    expect(PHOTO_CASES.sort()).toEqual(cases.map((c) => c.id).sort());
    for (const key of PHOTO_SPRITES) expect(sprites, key).toHaveProperty(key);
  });
});

describe("del 2 öppnas fall för fall", () => {
  const all = [...cases, ...season2Cases];
  const ids = all.map((c) => c.id);
  const solved = (n: number) => ({ cases: Object.fromEntries(ids.slice(0, n).map((id) => [id, { stars: 1, bestTime: 1, egg: false }])), cards: [] });

  it("fall 7 öppnas när fall 6 är löst", () => {
    expect(isUnlocked(ids, 6, solved(5))).toBe(false);
    expect(isUnlocked(ids, 6, solved(6))).toBe(true);
  });

  it("fall som inte är klara att spela är låsta, även om fallet före är löst", () => {
    expect(isUnlocked(ids, PLAYABLE_CASES - 1, solved(PLAYABLE_CASES - 1))).toBe(true);
    expect(isUnlocked(ids, PLAYABLE_CASES, solved(PLAYABLE_CASES))).toBe(false);
  });
});
