import { describe, expect, it } from "vitest";
import { cases } from "../src/cases";
import { season2Cases, season2SpriteSets, season2Sprites } from "../src/season2";
import { sprites } from "../src/sprites";
import { checkCases } from "./caseChecks";

checkCases("säsong 2", season2Cases, { ...sprites, ...season2Sprites }, 7);

describe("säsong 2 tillsammans med säsong 1", () => {
  it("har inga sprite-nycklar som krockar", () => {
    const seen = new Set(Object.keys(sprites));
    for (const set of season2SpriteSets) {
      for (const key of Object.keys(set)) {
        expect(seen.has(key), key).toBe(false);
        seen.add(key);
      }
    }
  });

  it("har egna fall-id:n", () => {
    const ids = [...cases, ...season2Cases].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ger en droppe i varje fall 7–11 och alla droppar i fall 12", () => {
    const drops = ["drop-red", "drop-yellow", "drop-green", "drop-blue", "drop-orange"];
    season2Cases.slice(0, 5).forEach((c, i) => {
      expect(c.finale?.some((s) => "give" in s && s.give === drops[i]), c.id).toBe(true);
    });
    const last = season2Cases[5];
    expect(last.finale?.some((s) => "give" in s && s.give === "drop-purple")).toBe(true);
    expect(last.finale?.some((s) => "recolor" in s)).toBe(true);
  });
});
