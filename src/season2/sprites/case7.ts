import { type Painter, drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// Case 7 – "Fyren som tappade färgen": the quay, the fish shed and the lighthouse.
// Everything that was red in the harbour has turned grey, so the boat, the lamp glass and the
// paint are drawn grey on purpose. Nora's characters (s2Keeper, s2Fisher, s2Seagull, s2SeaMonster,
// s2Crab) are placeholders until she has drawn them.

const K = "#1a1024";
const SKIN = "#f5c8a0";
const GREY = "#8a8a96";
const GREY_DARK = "#5e5e6a";
const GREY_LIGHT = "#b4b4c0";
const WHITE = "#f4f4f8";
const WOOD = "#8a6a3a";
const WOOD_DARK = "#5a3a1e";
const PAPER = "#f4f0e4";
const BRASS = "#c9a040";

/** Several frames drawn with shapes, merged into one palette. */
function animated(
  w: number,
  h: number,
  draws: ((d: Painter) => void)[],
  extra: Pick<PixelSprite, "animations" | "frameRate"> = {},
): PixelSprite {
  const singles = draws.map((draw) => drawSprite(w, h, draw));
  const palette: Record<string, string | null> = { ".": null };
  const keyOf = new Map<string, string>();
  const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const frames = singles.map((s) =>
    s.frames[0].map((row) =>
      [...row]
        .map((ch) => {
          const colour = s.palette[ch];
          if (!colour) return ".";
          let k = keyOf.get(colour);
          if (!k) {
            k = keys[keyOf.size];
            keyOf.set(colour, k);
            palette[k] = colour;
          }
          return k;
        })
        .join(""),
    ),
  );
  return { palette, frames, ...extra };
}

// ---------- Nora's characters (placeholders) ----------

/** The lighthouse keeper (S2.keeper): yellow raincoat, navy knitted cap, a long grey braid. */
export const s2Keeper: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(11, 7, 2, 7, "#c8c4d4").set(11, 14, "#4a90e2").set(12, 14, "#4a90e2"));
  d.part((p) =>
    p
      .rect(4, 10, 8, 7, "#f2d24b")
      .rect(3, 11, 1, 5, "#f2d24b")
      .rect(12, 11, 1, 5, "#f2d24b")
      .paint((x, y) => x === 8 && y > 10, "#c9a020")
      .set(6, 12, "#c9a020")
      .set(6, 14, "#c9a020")
      .set(3, 15, SKIN)
      .set(12, 15, SKIN),
  );
  d.part((p) => p.rect(5, 17, 2, 3, "#2d3a6a").rect(9, 17, 2, 3, "#2d3a6a"));
  d.part((p) => p.ellipse(8, 6, 3.5, 3.5, SKIN).set(6, 6, K).set(10, 6, K).set(7, 8, "#c07060").set(8, 8, "#c07060").set(5, 7, "#f0a0a0").set(11, 7, "#f0a0a0"));
  d.part((p) => p.rect(4, 0, 8, 2, "#2d3a6a").rect(4, 2, 8, 1, "#1c2448").paint((x, y) => y === 1 && x % 2 === 0, "#3e4e8a"));
});

/** The fisherman (S2.fisher): green sou'wester, bushy grey beard, blue sweater, rubber boots. */
export const s2Fisher: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) =>
    p
      .rect(4, 10, 8, 7, "#3a6ab0")
      .rect(3, 11, 1, 5, "#3a6ab0")
      .rect(12, 11, 1, 5, "#3a6ab0")
      .paint((_, y) => y % 2 === 0 && y > 11, "#2d5a9a")
      .set(3, 16, SKIN)
      .set(12, 16, SKIN),
  );
  d.part((p) => p.rect(5, 17, 2, 3, "#2f6a3a").rect(9, 17, 2, 3, "#2f6a3a"));
  d.part((p) => p.ellipse(8, 6, 3.5, 3, SKIN).set(6, 6, K).set(10, 6, K).line(5, 5, 7, 5, "#6a6a70").line(9, 5, 11, 5, "#6a6a70").set(8, 7, "#e0a080"));
  // The bushy beard (no outline, so the face stays visible).
  d.part(
    (p) =>
      p
        .ellipse(8, 9.5, 3.5, 2, "#c8c4d4")
        .paint((x, y) => y === 11 || x === 4 || x === 12, "#a8a4b4")
        .set(7, 9, "#6a3a3a")
        .set(8, 9, "#6a3a3a")
        .set(9, 9, "#6a3a3a"),
    false,
  );
  // The sou'wester, wide at the back.
  d.part((p) => p.ellipse(8, 2, 4, 1.5, "#3a8a4a", 2).rect(3, 3, 11, 1, "#2f6a3a").rect(12, 4, 2, 1, "#2f6a3a"));
});

/**
 * The seagull (S2.seagull). Frame 0: sitting, frames 1–2: flying (the animation). The flyer rests
 * on frame 0 too, so the whole bird is one sprite key. The spot on her beak has gone grey as well.
 */
export const s2Seagull: PixelSprite = animated(
  16,
  16,
  [
    (d) => {
      d.part((p) => p.rect(12, 8, 3, 2, GREY).set(14, 10, K));
      d.part((p) => p.line(6, 12, 6, 14, "#f28c38").line(9, 12, 9, 14, "#f28c38").set(5, 14, "#f28c38").set(8, 14, "#f28c38"), false);
      d.part((p) => p.ellipse(8, 9, 4.5, 3, WHITE).ellipse(4, 5, 2.5, 2.5, WHITE));
      d.part((p) => p.ellipse(9, 8.5, 3, 2, GREY_LIGHT).set(12, 9, K).set(11, 10, K));
      d.part((p) => p.rect(0, 5, 2, 1, "#f2d24b").set(1, 6, GREY).set(3, 4, K), false);
    },
    (d) => {
      d.part((p) => p.tri(6, 8, 11, 8, 12, 1, GREY_LIGHT).set(12, 1, K).set(11, 2, K));
      d.part((p) => p.ellipse(8, 9, 4.5, 2.5, WHITE).ellipse(3, 8, 2, 2, WHITE).rect(12, 8, 3, 2, WHITE));
      d.part((p) => p.rect(0, 8, 1, 1, "#f2d24b").set(0, 9, GREY).set(2, 7, K).line(13, 10, 14, 11, "#f28c38"), false);
    },
    (d) => {
      d.part((p) => p.ellipse(8, 8, 4.5, 2.5, WHITE).ellipse(3, 7, 2, 2, WHITE).rect(12, 7, 3, 2, WHITE));
      d.part((p) => p.tri(6, 9, 11, 9, 11, 15, GREY_LIGHT).set(11, 15, K).set(10, 14, K));
      d.part((p) => p.rect(0, 7, 1, 1, "#f2d24b").set(0, 8, GREY).set(2, 6, K), false);
    },
  ],
  { animations: { "": { frames: [1, 2], frameRate: 6 } } },
);

/** The sea monster (S2.seaMonster): green and huge, glowing yellow eyes, far too many teeth. */
export const s2SeaMonster: PixelSprite = drawSprite(24, 20, (d) => {
  // A hump of its tail behind it.
  d.part((p) => p.ellipse(4, 15, 3.5, 3, "#3a8a7a", 17).paint((x, y) => y <= 13 && x % 2 === 0, "#2a6a5a"));
  // Spiky fin crest.
  d.part((p) => p.tri(9, 5, 11, 0, 13, 4, "#8ad0b0").tri(17, 3, 21, 0, 21, 6, "#8ad0b0"));
  // Neck, with a pale belly.
  d.part((p) => p.rect(11, 9, 9, 9, "#3a8a7a").rect(14, 11, 4, 7, "#8ad0b0").paint((x, y) => x === 11 && y % 2 === 0, "#2a6a5a"));
  // Head.
  d.part((p) =>
    p
      .ellipse(15, 6, 6.5, 4.5, "#3a8a7a")
      .paint((x, y) => y <= 3 && (x + y) % 3 === 0, "#2a6a5a")
      .rect(10, 3, 3, 2, "#ffe27a")
      .set(11, 4, K)
      .rect(17, 3, 3, 2, "#ffe27a")
      .set(18, 4, K)
      .rect(10, 8, 11, 2, "#4a1a2a")
      .paint((x, y) => y === 8 && x % 2 === 0 && x >= 10 && x <= 20, "#fff6e0")
      .paint((x, y) => y === 9 && x % 2 === 1 && x >= 10 && x <= 20, "#fff6e0")
      .set(8, 6, "#2a6a5a")
      .set(9, 6, K),
  );
  // Ripples in the water around it.
  d.part((p) => p.rect(0, 18, 24, 2, "#6ab0f0").paint((x, y) => (x + y * 3) % 5 === 0, "#b8dcff"), false);
});

/** The crab (S2.crab): brown and grumpy, with one big claw. Two frames: scuttling. */
export const s2Crab: PixelSprite = animated(
  16,
  12,
  [0, 1].map((step) => (d: Painter) => {
    d.part((p) => {
      for (const x of [4, 6, 10, 12]) p.line(x, 8, x + (x < 8 ? -2 : 2), 10 + ((x + step) % 2), "#6a3a1e");
    }, false);
    d.part((p) => p.ellipse(8, 7, 5, 2.5, "#b86a2a").paint((_, y) => y === 5, "#d88a4a").set(6, 8, "#8a4a1a").set(10, 8, "#8a4a1a"));
    d.part((p) => p.ellipse(2, 4 - step, 2, 2, "#b86a2a").set(1, 2 - step, K).ellipse(14, 5, 1.5, 1.5, "#b86a2a"));
    d.part((p) => p.line(6, 4, 6, 2, "#6a3a1e").line(10, 4, 10, 2, "#6a3a1e").set(6, 1, WHITE).set(10, 1, WHITE).set(6, 2, K).set(10, 2, K), false);
  }),
  { frameRate: 8 },
);

// ---------- Things and clues ----------

/** The fisherman's boat, drained of its red: grey hull, grey cabin roof, in the water. */
export const harborBoat: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(11, 1, 11, 7, WOOD_DARK).tri(11, 1, 11, 4, 14, 3, GREY_LIGHT), false);
  d.part((p) => p.rect(4, 5, 6, 4, WHITE).rect(5, 6, 2, 2, "#7ab0d8").rect(3, 4, 8, 1, GREY_DARK));
  d.part((p) => p.rect(2, 9, 12, 3, GREY).tri(0, 9, 2, 9, 2, 12, GREY).tri(14, 9, 16, 9, 14, 12, GREY).rect(1, 9, 14, 1, GREY_LIGHT).set(5, 10, GREY_DARK).set(9, 10, GREY_DARK));
  d.part((p) => p.rect(0, 13, 16, 3, "#4a90e2").paint((x, y) => (x + y * 2) % 5 === 0, "#b8dcff"), false);
});

/** Big wet flipper prints on the planks. */
export const harborWetPrints: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [
    [4, 5],
    [11, 11],
  ]) {
    d.part((p) => p.ellipse(x, y, 2.5, 2, "#3e3a4a").tri(x - 3, y - 1, x + 3, y - 1, x, y - 5, "#3e3a4a").set(x - 1, y - 3, "#9ac4e8").set(x, y, "#9ac4e8"), false);
  }
  d.part((p) => p.set(8, 8, "#3e3a4a").set(9, 7, "#3e3a4a").set(13, 3, "#3e3a4a"), false);
});

/** Fish scraps with big tooth marks. */
export const harborFishScraps: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(3, 9, 11, 9, "#e8e0d0").tri(0, 7, 3, 9, 0, 11, "#e8e0d0").tri(11, 7, 15, 9, 11, 11, "#9aaab8").set(13, 8, K));
  d.part((p) => {
    for (let x = 4; x <= 10; x += 2) p.set(x, 8, "#e8e0d0").set(x, 10, "#e8e0d0");
  }, false);
  d.part((p) => p.ellipse(5, 13, 2.5, 1.5, "#9aaab8").set(3, 13, K).set(7, 12, "#3e3a4a").set(6, 12, "#3e3a4a"));
});

/** A tin of boat paint, full – the label says RED, but the paint is grey. */
export const harborPaintCan: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(4, 4, 8, 1, GREY_DARK).line(8, 1, 12, 4, GREY_DARK), false);
  d.part((p) => p.rect(4, 5, 8, 10, "#b4b4bc").rect(4, 5, 8, 1, "#d8d8e0").rect(5, 4, 6, 1, "#9a9aa4"));
  d.part((p) => p.rect(5, 8, 6, 6, PAPER).text(7, 8, "R", GREY).set(10, 6, GREY).set(10, 7, GREY).set(5, 5, GREY).set(6, 5, GREY), false);
});

/** The seagull's nest up on the crates: seaweed and string, white feathers and a shiny polishing rag. */
export const harborNest: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(8, 11, 6.5, 3, WOOD).paint((x, y) => (x + y) % 3 === 0, WOOD_DARK).paint((x, y) => (x * 2 + y) % 7 === 0, "#4a7a4a"));
  // The shiny polishing rag, on top.
  d.part((p) => p.rect(4, 6, 8, 3, "#dfe8f0").set(5, 6, "#ffffff").set(9, 7, "#ffffff").set(7, 8, "#b4c4d4").set(10, 8, "#b4c4d4"));
  d.part((p) => p.line(12, 7, 15, 3, WHITE).set(14, 4, GREY_LIGHT).set(3, 5, "#ffffff").set(13, 9, "#ffffff"), false);
});

/** White feathers on the floor. */
export const harborFeathers: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y, dx] of [
    [3, 6, 1],
    [9, 11, -1],
    [11, 4, 1],
  ]) {
    d.part((p) => p.line(x, y, x + 3 * dx, y - 3, WHITE).set(x + dx, y - 2, WHITE).set(x + 2 * dx, y, WHITE).set(x, y, GREY_LIGHT));
  }
});

/** The keeper's logbook, open on the desk. */
export const harborLogbook: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 5, 14, 9, "#2d4a8a"));
  d.part((p) => p.rect(2, 5, 6, 8, PAPER).rect(8, 5, 6, 8, "#ebe4d4").paint((x, y) => y % 2 === 1 && x !== 2 && x !== 13 && x !== 7 && x !== 8, "#8a86a0"), false);
  d.part((p) => p.line(8, 4, 8, 13, "#1c2448").set(12, 7, GREY_DARK), false);
});

/** The big lamp at the top of the lighthouse – its glass should be red, but it has gone grey. */
export const harborLampGrey: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(3, 12, 10, 3, BRASS).rect(3, 12, 10, 1, "#e8c870"));
  d.part((p) => p.ellipse(8, 7, 4.5, 5, "#a8a8b4", 11).paint((x) => x <= 5, "#c8c8d4").paint((_, y) => y === 7, "#9a9aa8"));
  d.part((p) => p.ellipse(8, 7, 1.5, 2, "#ffffff").set(8, 7, "#fff6c0"), false);
  d.part((p) => p.tri(3, 2, 13, 2, 8, 0, GREY_DARK));
});

/** An iron bollard with a rope around it – the seagull's favourite resting place (white spots!). */
export const harborBollard: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(5, 6, 6, 9, "#3a3a4a").rect(5, 6, 1, 9, "#4e4e60"));
  d.part((p) => p.rect(5, 10, 6, 2, "#c9a86a").set(6, 10, "#e0c88a").line(11, 11, 14, 14, "#c9a86a"));
  d.part((p) => p.ellipse(8, 5, 4, 1.5, "#4e4e60").set(6, 4, WHITE).set(9, 5, WHITE));
});

/** Fresh mackerel on ice, with a price sign. */
export const harborFishCounter: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(9, 0, 7, 7, PAPER).text(9, 1, "KR", "#2d4a8a"));
  d.part((p) => p.rect(1, 9, 14, 5, "#dce8f0").set(2, 10, "#ffffff").set(12, 12, "#ffffff"));
  for (const [x, y] of [
    [5, 11],
    [10, 12],
  ]) {
    d.part((p) => p.ellipse(x, y, 3, 1, "#6a9ab0").paint((px) => px % 2 === 0, "#2a5a6a").set(x - 3, y, K).tri(x + 3, y, x + 5, y - 1, x + 5, y + 1, "#6a9ab0"));
  }
});

/** A brass telescope on a tripod, by the window at the top. */
export const harborTelescope: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(8, 9, 5, 15, WOOD_DARK).line(8, 9, 11, 15, WOOD_DARK).line(8, 9, 8, 15, WOOD_DARK), false);
  d.part((p) => p.line(3, 8, 13, 3, BRASS).line(3, 9, 13, 4, BRASS).line(4, 9, 12, 5, "#a07a20").set(13, 3, "#b8dcff").set(13, 4, "#b8dcff"));
});

export const case7Sprites: Record<string, PixelSprite> = {
  s2Keeper,
  s2Fisher,
  s2Seagull,
  s2SeaMonster,
  s2Crab,
  harborBoat,
  harborWetPrints,
  harborFishScraps,
  harborPaintCan,
  harborNest,
  harborFeathers,
  harborLogbook,
  harborLampGrey,
  harborBollard,
  harborFishCounter,
  harborTelescope,
};
