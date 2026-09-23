import { describe, expect, it } from "vitest";
import { cases } from "../src/cases";
import { sprites } from "../src/sprites";
import { validateCase } from "../src/engine/room";

describe("fallen", () => {
  for (const c of cases) {
    it(`'${c.title}' är korrekt byggt`, () => {
      expect(validateCase(c)).toEqual([]);
    });

    it(`'${c.title}' använder bara figurer som finns`, () => {
      for (const room of Object.values(c.rooms)) {
        for (const thing of Object.values(room.things ?? {})) {
          expect(sprites, `${room.name}: ${thing.name}`).toHaveProperty(thing.sprite);
        }
      }
    });
  }

  it("hittar fel i en trasig karta", () => {
    const broken = {
      id: "x",
      title: "Trasig",
      startRoom: "a",
      rooms: { a: { name: "A", layout: ["#?#"], things: {} } },
    };
    const errors = validateCase(broken);
    expect(errors.some((e) => e.includes("rader"))).toBe(true);
    expect(errors.some((e) => e.includes("'?'"))).toBe(true);
    expect(errors.some((e) => e.includes("exakt ett N"))).toBe(true);
  });
});
