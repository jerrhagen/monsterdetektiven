import { describe, expect, it } from "vitest";
import { cases } from "../src/cases";
import { formatTime, starsFor } from "../src/engine/save";
import { sprites } from "../src/sprites";

describe("stjärnor och tid", () => {
  it("ger en stjärna för att lösa fallet, en för få tips och en för ägget", () => {
    expect(starsFor(5, false)).toBe(1);
    expect(starsFor(2, false)).toBe(2);
    expect(starsFor(0, true)).toBe(3);
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
