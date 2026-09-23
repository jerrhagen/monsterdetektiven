import { describe, expect, it } from "vitest";
import { sprites } from "../src/sprites";
import { validatePixelSprite } from "../src/sprites/pixelSprite";

describe("pixelfigurer", () => {
  for (const [key, sprite] of Object.entries(sprites)) {
    it(`'${key}' är korrekt ritad`, () => {
      expect(validatePixelSprite(key, sprite)).toEqual([]);
    });
  }

  it("hittar fel i en trasig figur", () => {
    const broken = { palette: { ".": null }, frames: [["..", "...", "x."]] };
    expect(validatePixelSprite("trasig", broken)).toHaveLength(2);
  });
});
