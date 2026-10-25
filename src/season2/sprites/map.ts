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

/** The greenhouse: an orange roof with scales, glass walls with a plant on each side, the sign and a black step. */
export const mapGreenhouse: PixelSprite = drawSprite(44, 38, (d) => {
  d.part((p) =>
    p.tri(22, 0, 0, 14, 43, 14, "#f0a850").paint((x, y) => {
      // Rows of little scales, every other row shifted.
      const row = Math.floor((y - 2) / 3);
      const sx = (x + (row % 2) * 2) % 4;
      const sy = (y - 2) % 3;
      return (sx === 0 && sy < 2) || (sx !== 0 && sy === 2);
    }, "#c87a28"),
  );
  d.part((p) => {
    p.rect(2, 15, 40, 19, "#f2f8fc").paint((x, y) => x === 13 || x === 30 || y === 15, "#cfe4f0");
    p.text(15, 19, "VÄXT", "#3a3a4a").text(17, 26, "HUS", "#3a3a4a");
  });
  // A plant on each side, like in the drawing.
  for (const x of [7, 36]) {
    d.part((p) =>
      p
        .rect(x, 26, 1, 7, "#3a7a2a")
        .ellipse(x - 2, 22, 2, 3, "#8ad06a")
        .ellipse(x + 2, 22, 2, 3, "#8ad06a")
        .ellipse(x, 19, 2, 3, "#8ad06a")
        .ellipse(x - 2, 27, 2, 2, "#6ab84a")
        .ellipse(x + 2, 27, 2, 2, "#6ab84a")
        .paint((px) => px === x, "#3a7a2a"),
    );
  }
  d.part((p) => p.rect(0, 34, 44, 3, "#2a2a32"));
});

/** The museum: a slimy purple blob with big green spots, the sign on top and a dark door. */
export const mapMuseum: PixelSprite = drawSprite(52, 40, (d) => {
  d.part((p) => {
    // Lumps that run together like slime, spreading out into a puddle at the bottom.
    p.ellipse(26, 27, 22, 11, "#a066d6")
      .ellipse(14, 17, 10, 8, "#a066d6")
      .ellipse(28, 12, 12, 9, "#a066d6")
      .ellipse(40, 19, 8, 8, "#a066d6")
      .ellipse(26, 37, 25, 2, "#a066d6")
      // Drips running down the sides.
      .rect(4, 21, 2, 9, "#a066d6")
      .ellipse(4.5, 30, 1, 1, "#a066d6")
      .rect(47, 25, 2, 7, "#a066d6")
      .ellipse(47.5, 32, 1, 1, "#a066d6")
      // Wavy lighter streaks running down like slime, a darker bottom and a shiny gleam.
      .paint((x, y) => (x + Math.round(Math.sin(y / 2.5) * 1.5)) % 7 === 0 && y < 34, "#b88ae6")
      .paint((x, y) => y >= 35 || (y >= 31 && (x < 8 || x > 44)), "#8448bc")
      .paint((x, y) => (y === 5 && x >= 30 && x <= 33) || (y === 6 && x === 29) || (y === 13 && x >= 35 && x <= 36), "#eadcf8")
      .text(12, 15, "MUSEUM", "#1a1024");
    // The door, with a round top.
    p.rect(19, 27, 6, 9, "#1a1024").rect(20, 26, 4, 1, "#1a1024");
  });
  // Big green spots, some of them sticking out over the edge.
  for (const [x, y, r] of [[8, 12, 3], [24, 4, 3], [43, 13, 3], [49, 28, 3], [4, 33, 3], [33, 27, 3], [14, 29, 2], [40, 35, 2]]) {
    d.part((p) => p.ellipse(x, y, r, r, "#3aa040").set(x - 1, y - 1, "#7ad06a"));
  }
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

/** A carousel horse looking right: b body, m mane and tail, e eye. */
const HORSE = [
  "........mm...",
  ".......mbbb..",
  ".......mbebb.",
  "......mbb.bb.",
  ".....bbb.....",
  ".mbbbbbbb....",
  "m.bbbbbbb....",
  "m.b.....b....",
  "..b.....b....",
  "..b.....b....",
];

/** The fair: a big carousel with a striped roof and three horses on poles, like in the drawing. */
export const mapFair: PixelSprite = drawSprite(60, 40, (d) => {
  const MAGENTA = "#c8367a";
  const BLUE = "#3ab0e0";
  // The roof: a scalloped edge, and stripes running down from the ball on top.
  for (let i = 0; i < 15; i++) d.part((p) => p.ellipse(2 + i * 4, 16, 1.5, 1.5, i % 2 ? MAGENTA : BLUE));
  d.part((p) =>
    p.tri(30, 3, 1, 15, 59, 15, MAGENTA).paint(
      (x, y) => Math.floor((Math.atan2(x + 0.5 - 30, y + 0.5 - 2) + 2) * 5) % 2 === 0,
      BLUE,
    ),
  );
  d.part((p) => p.ellipse(30, 2, 2, 2, "#8a1a4a").set(29, 1, "#e06a9a"));
  // Gold poles from the roof down to the floor.
  for (const x of [11, 30, 49]) d.part((p) => p.rect(x, 18, 1, 13, "#f0d070"), false);
  // Three horses: purple, green and yellow, with pink manes and tails.
  [["#7a4ac8", 5], ["#3a8a3a", 24], ["#c8962a", 43]].forEach(([body, left]) => {
    d.part((p) =>
      HORSE.forEach((row, y) =>
        [...row].forEach((ch, x) => {
          const colour = { b: body as string, m: "#f2a6b8", e: "#1a1024" }[ch];
          if (colour) p.set((left as number) + x, 19 + y, colour);
        }),
      ),
    );
  });
  // The floor with a striped skirt and grey steps up in the middle.
  d.part((p) =>
    p
      .rect(1, 30, 58, 2, "#f0d070")
      .rect(2, 32, 56, 8, MAGENTA)
      .paint((x, y) => y >= 32 && Math.floor(x / 3) % 2 === 0, BLUE),
  );
  d.part((p) => p.rect(25, 31, 10, 9, "#b4b4bc").paint((_, y) => y % 2 === 0, "#7a7a86"));
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
