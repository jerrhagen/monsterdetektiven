import { drawSprite } from "./pixelDraw";
import type { PixelSprite } from "./pixelSprite";

// The town map, from the architect's drawing (assets/bilder/teckningar/stadskarta.jpg):
// the yellow toy shop with the orange roof, the bakery with the rainbow roof, the tall
// clock tower with the pink spire, the orange library, the festival tent, and the forest
// with red-dotted trees and chanterelles.

const DARK = "#1a1024";
const SKY_GLASS = "#bfe8ff";
const GLASS_SHADE = "#8cc4e8";

/** 1. Leksaksaffären: yellow walls, round orange roof, red lamps, a blue door with a face. */
export const mapToyShop: PixelSprite = drawSprite(52, 40, (d) => {
  d.part((p) =>
    p
      .ellipse(25.5, 13, 24, 12, "#f07a3a", 12)
      .paint((x, y) => y > 8 && x > 30, "#d8622a")
      .paint((x, y) => y < 5 && x < 22, "#f79a5a")
      .paint((x, y) => y % 4 === 3 && x % 6 === (y % 8 === 3 ? 1 : 4), "#d8622a"),
  );
  d.part((p) =>
    p
      .rect(4, 13, 44, 26, "#f2d24b")
      .paint((x) => x >= 45, "#d8b030")
      .paint((_, y) => y === 38, "#d8b030"),
  );
  d.part((p) => p.text(10, 15, "LEKSAKER", "#2f5fb8"), false);
  for (const [x, y] of [[4, 15], [47, 15], [4, 26], [47, 26], [4, 36], [47, 36]]) {
    d.part((p) => p.ellipse(x, y, 1.5, 1.5, "#e04848").set(x - 1, y - 1, "#ff9a9a"));
  }
  // Window with a grid.
  d.part((p) => p.rect(8, 24, 10, 8, SKY_GLASS).paint((x, y) => x === 12 || y === 27, "#3a2a50").set(9, 25, "#ffffff"));
  // The blue door with a smiling face.
  d.part((p) =>
    p
      .rect(21, 24, 10, 15, "#1f8a9a")
      .paint((x) => x === 21, "#3ab0c0")
      .set(24, 29, DARK)
      .set(27, 29, DARK)
      .set(23, 31, DARK)
      .set(24, 32, DARK)
      .set(25, 32, DARK)
      .set(26, 32, DARK)
      .set(27, 31, DARK),
  );
  // Shop window with a teddy and a yellow duck, like in the drawing.
  d.part((p) =>
    p
      .rect(34, 24, 12, 10, "#fbe3ef")
      // The teddy: ears, head, body and a little face.
      .set(35, 25, "#8a5a2a")
      .set(38, 25, "#8a5a2a")
      .rect(35, 26, 4, 3, "#b07a40")
      .set(36, 27, DARK)
      .set(37, 27, DARK)
      .set(36, 28, "#e8c090")
      .set(37, 28, "#e8c090")
      .rect(35, 29, 4, 4, "#8a5a2a")
      .rect(36, 30, 2, 2, "#e8c090")
      .set(34, 30, "#8a5a2a")
      .set(39, 30, "#8a5a2a")
      // The duck.
      .ellipse(42.5, 31, 2, 1, "#f2d24b")
      .set(41, 29, "#f2d24b")
      .set(41, 28, "#f2d24b")
      .set(42, 28, "#f2d24b")
      .set(42, 29, DARK)
      .set(40, 29, "#f07a3a")
      .set(43, 30, "#d8b030"),
  );
});

/** 2. Bageriet: a white house with a rainbow-edged roof, a cinnamon bun sign, a heart and a green door. */
export const mapBakery: PixelSprite = drawSprite(36, 42, (d) => {
  const rainbow = ["#e04848", "#f07a3a", "#f2d24b", "#4fb84a", "#5ab8e8", "#8a4ac8"];
  d.part((p) => {
    p.tri(18, 0, 0, 16, 35, 16, "#f07a3a").paint((x, y) => y < 12 && x > 18, "#d8622a");
    // A rainbow edge along the bottom of the roof.
    rainbow.forEach((c, i) => p.paint((x, y) => y >= 13 && Math.floor(x / 3) % rainbow.length === i, c));
  });
  d.part((p) => p.rect(3, 17, 30, 25, "#f4ecd8").paint((x) => x >= 30, "#d8ccb4"));
  d.part((p) => p.text(5, 19, "BAGERI", "#9a5a2a"), false);
  // Cinnamon bun sign.
  d.part((p) =>
    p
      .ellipse(32, 21, 2.5, 2.5, "#e0a060")
      .set(32, 21, "#9a5a2a")
      .set(33, 21, "#9a5a2a")
      .set(33, 20, "#9a5a2a")
      .set(31, 20, "#9a5a2a")
      .set(31, 22, "#9a5a2a")
      .set(34, 22, "#9a5a2a"),
  );
  // A red heart.
  d.part(
    (p) =>
      p
        .rect(6, 28, 2, 2, "#e04848")
        .rect(9, 28, 2, 2, "#e04848")
        .rect(6, 29, 5, 2, "#e04848")
        .rect(7, 31, 3, 1, "#e04848")
        .set(8, 32, "#e04848")
        .set(6, 28, "#ff9a9a"),
    false,
  );
  // Green arched door.
  d.part((p) => p.rect(15, 31, 7, 11, "#4fb84a").ellipse(18, 31, 3, 2, "#4fb84a").paint((x) => x === 15, "#7fd86a").set(20, 36, "#f2d24b"));
  d.part((p) => p.rect(25, 30, 5, 5, SKY_GLASS).paint((x, y) => x === 27 || y === 32, "#3a2a50"));
});

/** 3. Biblioteket: an orange building with a dark roof, a tall tower and an open book over the door. */
export const mapLibrary: PixelSprite = drawSprite(50, 46, (d) => {
  d.part((p) => p.rect(38, 13, 10, 33, "#e06a2a").paint((x) => x >= 46, "#c0561e"));
  d.part((p) => p.tri(43, 0, 36, 14, 49, 14, "#2a2a5a").paint((x) => x > 43, "#1f1f48"));
  d.part((p) => p.rect(3, 19, 36, 27, "#f07a3a").paint((_, y) => y === 45, "#d8622a"));
  d.part((p) =>
    p
      .tri(21, 3, 0, 20, 42, 20, "#2a2a5a")
      .paint((x, y) => (x + y) % 5 === 0, "#3a3a7a")
      .paint((x, y) => x > 26 && y > 10, "#1f1f48"),
  );
  // Arched windows.
  for (const [x, y, w, h] of [[7, 28, 5, 7], [30, 28, 5, 7], [41, 21, 4, 6], [41, 32, 4, 6]]) {
    d.part((p) => p.rect(x, y, w, h, SKY_GLASS).ellipse(x + (w - 1) / 2, y, (w - 1) / 2, 1.5, SKY_GLASS).paint((_, yy) => yy > y + h - 3, GLASS_SHADE));
  }
  // An open book over the door.
  d.part((p) => p.rect(15, 23, 5, 5, "#f4ecd8").rect(21, 23, 5, 5, "#f4ecd8").rect(20, 23, 1, 6, "#8a2346").rect(15, 28, 11, 1, "#8a2346").set(16, 25, "#8a86a0").set(22, 25, "#8a86a0").set(17, 26, "#8a86a0").set(23, 26, "#8a86a0"));
  d.part((p) => p.rect(16, 35, 9, 11, "#f2d24b").ellipse(20, 35, 4, 2, "#f2d24b").paint((x) => x === 20, "#c9a02a").set(18, 40, "#9a5a2a").set(22, 40, "#9a5a2a"));
});

/** 4. The forest: trees with red berries, like in the drawing. */
export const mapTree: PixelSprite = drawSprite(18, 24, (d) => {
  d.part((p) => p.rect(7, 13, 4, 11, "#8a5a2a").paint((x) => x === 10, "#6a4020"));
  d.part((p) =>
    p
      .ellipse(9, 8, 8, 7, "#2f7a36")
      .ellipse(4, 11, 3.5, 3, "#2f7a36")
      .ellipse(14, 11, 3.5, 3, "#2f7a36")
      .paint((x, y) => x + y > 20, "#1f5a2a")
      .paint((x, y) => x + y < 9, "#4e9a3e")
      .set(5, 4, "#6cc24a")
      .set(6, 3, "#6cc24a"),
  );
  for (const [x, y] of [[5, 7], [11, 5], [13, 10], [8, 11], [3, 11], [10, 8]]) d.part((p) => p.set(x, y, "#e04848").set(x, y - 1, "#ff8a8a"), false);
});

export const mapTreeRound: PixelSprite = drawSprite(16, 22, (d) => {
  d.part((p) => p.rect(6, 12, 4, 10, "#8a5a2a").paint((x) => x === 9, "#6a4020"));
  d.part((p) =>
    p
      .ellipse(8, 7, 7, 7, "#3a8a3e")
      .paint((x, y) => x + y > 17, "#246a30")
      .paint((x, y) => x + y < 8, "#5aae48")
      .paint((x, y) => (x * 3 + y * 5) % 11 === 0, "#246a30"),
  );
  for (const [x, y] of [[4, 6], [10, 4], [11, 10], [6, 10]]) d.part((p) => p.set(x, y, "#e04848"), false);
});

export const mapChanterelle: PixelSprite = drawSprite(7, 6, (d) => {
  d.part((p) => p.rect(2, 2, 3, 4, "#f0b050"));
  d.part((p) => p.tri(0, 0, 6, 0, 3, 3, "#e8a13a").rect(0, 0, 7, 1, "#e8a13a").set(1, 0, "#ffd080"));
});

/** A mossy stone with a dark hole – something lives in there… */
export const mapCave: PixelSprite = drawSprite(22, 15, (d) => {
  d.part((p) =>
    p
      .ellipse(11, 9, 10, 6, "#8a86a0")
      .paint((x, y) => x + y > 22, "#6a6680")
      .paint((x, y) => y < 6 && x > 4 && x < 16, "#4e9a3e")
      .set(6, 5, "#6cc24a")
      .set(10, 4, "#6cc24a"),
  );
  d.part((p) => p.ellipse(11, 11, 4, 3, "#1a1024").set(10, 10, "#ffd66b").set(12, 10, "#ffd66b"), false);
});

export const mapTulip: PixelSprite = drawSprite(5, 8, (d) => {
  d.part((p) => p.line(2, 3, 2, 7, "#2f8a3a").set(1, 5, "#4fb84a").set(3, 6, "#4fb84a"), false);
  d.part((p) => p.rect(1, 1, 3, 2, "#f07a3a").set(1, 0, "#f07a3a").set(3, 0, "#f07a3a").set(2, 1, "#ffb060"));
});

export const mapBush: PixelSprite = drawSprite(12, 8, (d) => {
  d.part((p) =>
    p
      .ellipse(4, 5, 3.5, 2.5, "#3a8a3e")
      .ellipse(8, 4, 3.5, 3, "#3a8a3e")
      .paint((x, y) => x + y > 11, "#246a30")
      .set(7, 2, "#5aae48")
      .set(3, 4, "#5aae48"),
  );
});

/** 5. Klocktornet: tall grey stone with a pink spire, a clock and a purple door. */
export const mapClockTower: PixelSprite = drawSprite(22, 68, (d) => {
  d.part((p) => p.line(11, 0, 11, 3, DARK).rect(12, 0, 3, 2, "#e04848"), false);
  d.part((p) => p.tri(11, 3, 0, 19, 21, 19, "#f28ac0").paint((x) => x > 11, "#d0609e").paint((x, y) => x < 9 && y > 10 && x > 4, "#ffb0da"));
  d.part((p) =>
    p
      .rect(2, 19, 18, 49, "#a8a4b8")
      .paint((_, y) => y % 5 === 0, "#8a86a0")
      .paint((x, y) => x % 6 === (Math.floor(y / 5) % 2 ? 2 : 5), "#8a86a0")
      .paint((x) => x >= 18, "#7a7690"),
  );
  d.part((p) => p.rect(1, 19, 20, 2, "#7a7690"));
  // The clock.
  d.part((p) =>
    p
      .ellipse(11, 29, 5, 5, "#f4ecd8")
      .line(11, 29, 11, 25, DARK)
      .line(11, 29, 14, 29, DARK)
      .set(11, 33, "#8a86a0")
      .set(7, 29, "#8a86a0")
      .set(15, 29, "#8a86a0"),
  );
  d.part((p) => p.rect(9, 41, 4, 6, "#2a2a5a").ellipse(10.5, 41, 1.5, 1, "#2a2a5a").set(10, 42, "#ffd66b"));
  d.part((p) => p.rect(7, 58, 8, 10, "#8a4ac8").ellipse(10.5, 58, 3.5, 2, "#8a4ac8").paint((x) => x === 7, "#b07ae0").set(13, 63, "#ffd66b"));
});

/** 6. Monsterfesten: a striped festival tent with a flag and a red lantern. */
export const mapTent: PixelSprite = drawSprite(46, 42, (d) => {
  d.part((p) => p.line(23, 0, 23, 6, DARK).tri(24, 0, 29, 2, 24, 4, "#e04848"), false);
  d.part((p) =>
    p
      .rect(4, 21, 38, 21, "#e87ab0")
      .paint((x) => Math.floor((x - 4) / 4) % 2 === 1, "#b060c8")
      .paint((x) => x >= 40, "#8a4aa0"),
  );
  d.part((p) =>
    p
      .tri(23, 6, 0, 22, 45, 22, "#6a45a8")
      .paint((x, y) => Math.floor((x - 23) / ((y - 5) / 2.5 + 1)) % 2 === 0 && y > 8, "#4a2a7a"),
  );
  // Scalloped edge under the roof.
  d.part((p) => {
    for (let x = 3; x <= 42; x += 5) p.ellipse(x, 22, 2, 1.5, "#ffd66b");
  });
  // The opening.
  d.part((p) => p.tri(15, 42, 23, 28, 31, 42, "#2a1a3a").set(23, 33, "#ffd66b").set(21, 37, "#ffd66b").set(25, 38, "#ffd66b"));
  // A red lantern, like the red circle in the drawing.
  d.part((p) => p.ellipse(35, 29, 2.5, 3, "#e04848").set(34, 28, "#ffb0a0").rect(34, 25, 3, 1, DARK));
});

export const mapSprites: Record<string, PixelSprite> = {
  mapToyShop,
  mapBakery,
  mapLibrary,
  mapTree,
  mapTreeRound,
  mapChanterelle,
  mapCave,
  mapTulip,
  mapBush,
  mapClockTower,
  mapTent,
};
