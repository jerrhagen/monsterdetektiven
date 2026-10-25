import { drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// The buildings on the town map of the new district, from the head architect's drawing:
// the striped lighthouse by the sea, the yellow school, the greenhouse, the round purple museum
// with green spots, the green aquarium with a fish in a round window, and the fair.

const GLASS = "#bfe8ff";

/** The lighthouse, red and white striped, with the lamp at the top. */
export const mapLighthouse: PixelSprite = drawSprite(16, 46, (d) => {
  d.part((p) => p.ellipse(8, 43, 7, 3, "#8a8a96").paint((x, y) => (x + y) % 3 === 0, "#6e6e7a"));
  d.part((p) =>
    p
      .tri(8, 12, 2, 42, 14, 42, "#f4f4f8")
      .rect(5, 12, 7, 30, "#f4f4f8")
      .paint((x, y) => Math.floor((y - 12) / 6) % 2 === 0 && y >= 12 && Math.abs(x - 8) <= (y - 4) / 5, "#d83a3a")
      .rect(7, 36, 3, 6, "#6a3a2a"),
  );
  d.part((p) => p.rect(4, 10, 9, 2, "#2a2a3a"));
  d.part((p) => p.rect(5, 5, 7, 5, "#ffe27a").set(7, 6, "#ffffff").set(8, 6, "#ffffff"));
  d.part((p) => p.tri(8, 0, 3, 5, 13, 5, "#d83a3a"));
});

/** The school: yellow and orange, lots of windows and a pointed roof with a blue chimney. */
export const mapSchool: PixelSprite = drawSprite(46, 42, (d) => {
  d.part((p) => p.rect(32, 3, 4, 8, "#3a8ad8"));
  d.part((p) => p.tri(23, 2, 2, 16, 44, 16, "#f08a30").paint((_, y) => y % 3 === 0, "#d06a20"));
  d.part((p) =>
    p
      .rect(4, 16, 38, 25, "#f2cc40")
      .paint((x) => x < 23, "#f0a840")
      .rect(20, 31, 6, 10, "#8a5a2a"),
  );
  d.part((p) => {
    for (const x of [7, 14, 29, 36]) for (const y of [19, 27]) p.rect(x, y, 4, 4, GLASS).set(x + 1, y + 1, "#ffffff");
    p.rect(21, 19, 4, 4, GLASS);
  });
});

/** The greenhouse: glass walls with plants inside and an orange roof. */
export const mapGreenhouse: PixelSprite = drawSprite(40, 28, (d) => {
  d.part((p) => p.tri(20, 0, 1, 10, 39, 10, "#f0a050").paint((x, y) => (x + y) % 4 === 0, "#d08030"));
  d.part((p) => {
    p.rect(3, 10, 34, 17, GLASS).paint((x, y) => x % 8 === 3 || y === 18, "#8cc4e8");
    for (const x of [7, 15, 25, 32]) p.rect(x - 1, 22, 3, 3, "#a0603a").ellipse(x, 18, 2, 3, "#4aa85a").set(x, 16, "#8ad06a");
  });
  d.part((p) => p.rect(18, 19, 4, 8, "#3a3a4a"));
});

/** The museum: big, round and purple, with green spots and a dark door. */
export const mapMuseum: PixelSprite = drawSprite(42, 32, (d) => {
  d.part((p) =>
    p
      .ellipse(21, 18, 19, 13, "#9a5ad0", 31)
      .paint((x, y) => (x * 7 + y * 11) % 23 < 2, "#4aa85a")
      .rect(19, 21, 5, 10, "#2a1a3a"),
  );
});

/** The aquarium: a green house with a big round window and a fish inside. */
export const mapAquarium: PixelSprite = drawSprite(44, 30, (d) => {
  d.part((p) => p.rect(2, 4, 40, 25, "#3ab890").paint((_, y) => y === 4 || y === 5, "#2a9a74"));
  d.part((p) =>
    p
      .ellipse(22, 15, 7, 7, "#3a8ad8")
      .rect(19, 14, 5, 3, "#ffb030")
      .tri(24, 15, 27, 13, 27, 17, "#ffb030")
      .set(20, 14, "#1a1024")
      .set(16, 11, "#bfe8ff")
      .set(25, 19, "#bfe8ff"),
  );
  d.part((p) => p.rect(6, 22, 6, 7, "#2a3a4a"));
});

/** The fair: a striped tent and a carousel with horses. */
export const mapFair: PixelSprite = drawSprite(52, 38, (d) => {
  // The carousel: a striped roof on a pole, and horses going round.
  d.part((p) => p.rect(13, 12, 2, 24, "#c8c4d4"));
  d.part((p) => p.tri(14, 2, 2, 12, 26, 12, "#d83a8a").paint((x) => Math.floor(x / 3) % 2 === 0, "#3ab0e0"));
  d.part((p) => p.rect(3, 32, 22, 4, "#8a5a2a"));
  d.part((p) => p.rect(5, 23, 6, 4, "#a05ad0").rect(9, 21, 2, 3, "#a05ad0").rect(5, 27, 1, 3, "#a05ad0").rect(10, 27, 1, 3, "#a05ad0"));
  d.part((p) => p.rect(17, 25, 6, 4, "#3a9a4a").rect(21, 23, 2, 3, "#3a9a4a").rect(17, 29, 1, 3, "#3a9a4a").rect(22, 29, 1, 3, "#3a9a4a"));
  // The big striped tent.
  d.part((p) =>
    p
      .tri(40, 6, 27, 22, 51, 22, "#d83a8a")
      .rect(29, 22, 21, 15, "#f4f4f8")
      .paint((x) => Math.floor(x / 3) % 2 === 0, "#3ab0e0")
      .rect(37, 27, 6, 10, "#2a1a3a"),
  );
  d.part((p) => p.rect(39, 2, 2, 4, "#8a5a2a").rect(41, 2, 4, 2, "#ffd66b"));
});

/** A seagull gliding over the sea (it's sunny and full of gulls, the head architect decided). */
export const mapGull: PixelSprite = drawSprite(7, 3, (d) => {
  d.part((p) => p.set(0, 0, "#f4f4f8").set(1, 1, "#f4f4f8").set(2, 1, "#f4f4f8").set(3, 2, "#f4f4f8").set(4, 1, "#f4f4f8").set(5, 1, "#f4f4f8").set(6, 0, "#f4f4f8"), false);
});

export const harbourMapSprites: Record<string, PixelSprite> = {
  mapLighthouse,
  mapSchool,
  mapGreenhouse,
  mapMuseum,
  mapAquarium,
  mapFair,
  mapGull,
};
