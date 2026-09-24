import { type Painter, drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// Case 9 – "Spöket i växthuset". Everything new that the greenhouse case needs (SPOILERS in the case file).
// s2Gardener, s2Snail and s2Flytrap are placeholders for Nora's own drawings (see SEASON2.md).
// The real plants in the greenhouse have lost their green – their leaves are drawn grey. The puzzle
// pictures (sudoku, the tomato's life) are drawn in colour, like pictures in a book.

const INK = "#1a1024";
const WHITE = "#ffffff";
const LEAF_GREY = "#a4aba4";
const LEAF_GREY_DARK = "#737b73";
const POT = "#c0643e";
const POT_DARK = "#8a4228";
const SOIL = "#5a3a22";
const RED = "#d8403a";
const RED_DARK = "#9a2424";
const GREEN = "#4fb84a";
const GREEN_DARK = "#2f7a36";
const YELLOW = "#f2d24b";
const PAPER = "#f4f0e4";

/** Several single-frame pictures of the same size as one sprite with frames and a shared palette. */
function framesOf(pictures: PixelSprite[], frameRate = 6): PixelSprite {
  const palette: Record<string, string | null> = { ".": null };
  const keyOf = new Map<string, string>();
  const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const frames = pictures.map((pic) =>
    pic.frames[0].map((row) =>
      [...row]
        .map((ch) => {
          const colour = pic.palette[ch];
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
  return { palette, frames, frameRate };
}

/** A terracotta pot standing on the bottom rows. */
function pot(d: Painter, x: number, y: number, w: number, h: number): void {
  d.part((p) => p.rect(x, y, w, 1, POT).rect(x + 1, y + 1, w - 2, h - 1, POT).paint((_, py) => py === y + h - 1, POT_DARK));
}

// ---------- Nora's characters (placeholders) ----------

/**
 * S2.gardener – the gardener: a wide straw hat with a red band, grey hair, rosy cheeks,
 * a green apron with a pocket and brown boots.
 */
export const s2Gardener: PixelSprite = {
  palette: {
    ".": null,
    o: INK,
    y: "#e8c870", // straw
    Y: "#c8a050", // straw, dark
    r: "#d04848", // hat band
    h: "#c8c4cc", // grey hair
    s: "#f2c8a0", // skin
    p: "#f0a0a0", // cheeks
    m: "#a04848", // mouth
    w: "#f4f0e8", // shirt
    g: "#5a9a4a", // apron
    G: "#3e7036", // apron pocket
    t: "#6a5a8a", // trousers
    b: "#6a4228", // boots
  },
  frames: [
    [
      "....oooooooo....",
      "...oyyyyyyyyo...",
      "...oyyyYyyyyo...",
      "...orrrrrrrro...",
      ".ooyyyyyyyyyyoo.",
      "oYYYYYYYYYYYYYYo",
      "..ohssssssssho..",
      "..ohsossssosho..",
      "..ohpsssssspho..",
      "..ohhssmmsshho..",
      "...oohsssshoo...",
      "..owwggggggwwo..",
      ".owwwggggggwwwo.",
      ".owwoggGGggowwo.",
      ".ossoggGGggosso.",
      "..oooggggggooo..",
      "....oggggggo....",
      "...otto..otto...",
      "..obbbo..obbbo..",
      "..ooooo..ooooo..",
    ],
  ],
};

/** S2.snail – a shy snail monster with a big spiral shell and eyes on stalks. Two frames: crawling. */
function snailFrame(step: number): PixelSprite {
  const body = "#b8c890";
  const bodyDark = "#8a9a68";
  const shell = "#d08a4a";
  const shellDark = "#9a5a2a";
  return drawSprite(20, 16, (d) => {
    // Eye stalks, behind the head.
    d.part((p) => p.line(15, 6, 14 - step, 3, body).line(17, 6, 18 + step, 3, body));
    d.part((p) =>
      p
        .ellipse(14 - step, 2, 1.2, 1.2, WHITE)
        .ellipse(18 + step, 2, 1.2, 1.2, WHITE)
        .set(14 - step, 2, INK)
        .set(18 + step, 2, INK),
    );
    // The soft body along the ground, and the head.
    d.part((p) =>
      p
        .ellipse(10 + step * 0.5, 13, 8.5 + step * 0.5, 1.8, body)
        .ellipse(16, 9, 2.5, 3.5, body)
        .paint((_, y) => y >= 14, bodyDark)
        .set(16, 10, "#6a3040")
        .set(17, 10, "#6a3040")
        .set(18, 9, "#f0a0a0")
        .set(14, 9, "#f0a0a0"),
    );
    // The big shell with a spiral.
    d.part((p) =>
      p
        .ellipse(8, 8, 5, 5, shell)
        .paint((x, y) => {
          const r = Math.hypot(x - 8, y - 8);
          return (r > 2.6 && r < 3.7 && !(x > 8 && y < 8)) || (r < 1.2 && x >= 8);
        }, shellDark)
        .set(5, 5, "#f0b878")
        .set(6, 4, "#f0b878"),
    );
    // A shiny drop of slime.
    d.part((p) => p.set(3 - step, 14, "#e0f0ff").set(2 - step, 14, "#e0f0ff"), false);
  });
}
export const s2Snail: PixelSprite = framesOf([snailFrame(0), snailFrame(1)], 4);

/**
 * S2.flytrap – a big carnivorous plant in a pot. It has lost its green too: grey lobes,
 * a red mouth. Frame 0: asleep, jaws shut. Frame 1: awake, jaws wide open, glowing eyes.
 */
function flytrapFrame(awake: boolean): PixelSprite {
  const lobe = "#98a298";
  const lobeDark = "#6e786e";
  const mouth = "#c83848";
  const glow = "#ffe27a";
  return drawSprite(20, 22, (d) => {
    // Stem and two leaves.
    d.part((p) => p.rect(9, 12, 2, 5, lobeDark).ellipse(6, 14, 2.5, 1, lobe).ellipse(14, 14, 2.5, 1, lobe));
    if (awake) {
      // Open jaws: a red mouth between two lobes, with teeth.
      d.part((p) => p.rect(4, 5, 12, 5, mouth).rect(6, 7, 8, 2, "#7a1a28"));
      d.part((p) => {
        p.ellipse(10, 3, 7, 2.5, lobe).paint((_, y) => y <= 1, lobeDark);
        p.set(7, 2, glow).set(8, 2, glow).set(12, 2, glow).set(13, 2, glow).set(8, 2, INK).set(12, 2, INK);
      });
      d.part((p) => p.ellipse(10, 11, 6, 1.8, lobe).paint((_, y) => y >= 12, lobeDark));
      d.part((p) => {
        for (let x = 4; x <= 16; x += 2) p.set(x, 5, WHITE).set(x + 1, 9, WHITE);
      }, false);
    } else {
      // Jaws shut: one fat head with a zigzag of teeth along the seam, eyes closed.
      d.part((p) => {
        p.ellipse(10, 7, 7, 4.5, lobe).paint((_, y) => y <= 3, lobeDark);
        for (let x = 4; x <= 16; x++) p.set(x, 7 + (x % 2), x % 2 ? WHITE : mouth);
        p.set(7, 5, INK).set(8, 5, INK).set(12, 5, INK).set(13, 5, INK);
      });
    }
    // The pot she lives in.
    pot(d, 4, 16, 12, 5);
  });
}
export const s2Flytrap: PixelSprite = { ...framesOf([flytrapFrame(false), flytrapFrame(true)]), animations: {} };

// ---------- Monsters and witnesses ----------

/** The bumblebee (Surr) – big, round and grumpy. Two frames: buzzing wings. */
function bumbleFrame(up: boolean, resting = false): PixelSprite {
  const body = "#f2c030";
  const stripe = "#2a2030";
  const wing = "#dcecff";
  return drawSprite(16, 16, (d) => {
    if (resting) {
      // Sitting on a grey flower.
      d.part((p) => p.rect(7, 12, 2, 4, LEAF_GREY_DARK).ellipse(8, 12, 4, 1, LEAF_GREY));
    }
    const oy = resting ? 1 : 0;
    // Wings behind the body.
    d.part((p) =>
      resting
        ? p.ellipse(6, 4 + oy, 3, 1.2, wing)
        : up
          ? p.ellipse(5, 3, 2, 2.5, wing).ellipse(9, 3, 2, 2.5, wing)
          : p.ellipse(4, 6, 3, 1.5, wing).ellipse(10, 6, 3, 1.5, wing),
    );
    // Body with stripes, a stinger and a grumpy face.
    d.part((p) =>
      p
        .ellipse(8, 8 + oy, 5, 3.5, body)
        .paint((x) => x === 5 || x === 8, stripe)
        .set(2, 8 + oy, stripe)
        .set(11, 7 + oy, WHITE)
        .set(12, 7 + oy, WHITE)
        .set(12, 7 + oy, INK)
        .set(11, 6 + oy, INK)
        .set(12, 5 + oy, INK)
        .set(12, 9 + oy, "#8a2a2a"),
    );
    d.part((p) => p.line(11, 5 + oy, 13, 2 + oy, stripe).set(14, 1 + oy, stripe), false);
  });
}
export const greenhouseBumble: PixelSprite = framesOf([bumbleFrame(true), bumbleFrame(false)], 12);
export const greenhouseBumbleRest: PixelSprite = bumbleFrame(false, true);

// ---------- Things and clues ----------

/** The "ghost": a long pointy shadow and a floating light on the glass. */
export const greenhouseGhost: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 1, 14, 14, "#bfe0e8").rect(8, 1, 1, 14, "#9ac8d0"));
  d.part((p) => p.tri(6, 2, 2, 14, 10, 14, "#4a4a6a").rect(4, 11, 5, 4, "#4a4a6a"), false);
  d.part((p) => p.ellipse(12, 9, 2, 2, "#fff4b0").set(12, 9, WHITE), false);
});

/** The gardener's notebook, open, with a little leaf doodle. */
export const greenhouseNotebook: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 3, 14, 11, "#7a4a2a"));
  d.part((p) =>
    p
      .rect(2, 3, 12, 10, PAPER)
      .paint((x, y) => y % 2 === 0 && y > 4 && x !== 8 && x > 2 && x < 13, "#a8a4c4")
      .paint((x) => x === 8, "#d8d0c0")
      .set(11, 5, LEAF_GREY_DARK)
      .set(12, 4, LEAF_GREY_DARK)
      .set(10, 6, LEAF_GREY_DARK),
    false,
  );
});

/** Grey potted plants that all lean the same way – to the right, towards the sunny glass. */
export const greenhouseLeaning: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, h] of [[3, 7], [10, 9]]) {
    d.part((p) => {
      p.line(x + 1, 11, x + 1, 11 - Math.floor(h / 2), LEAF_GREY_DARK).line(x + 1, 11 - Math.floor(h / 2), x + 4, 11 - h, LEAF_GREY_DARK);
      p.ellipse(x + 3, 11 - h + 1, 1.8, 1, LEAF_GREY).ellipse(x + 3, 9 - Math.floor(h / 3), 1.8, 1, LEAF_GREY).set(x + 5, 11 - h, LEAF_GREY);
    });
    pot(d, x - 1, 12, 5, 4);
  }
});

/** A measuring stick next to a potted plant. */
export const greenhouseRuler: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 1, 3, 15, YELLOW).paint((x, y) => x === 4 && y % 2 === 1, INK).paint((x, y) => x === 3 && y % 4 === 1, INK));
  d.part((p) => p.line(10, 12, 10, 6, LEAF_GREY_DARK).line(10, 6, 13, 3, LEAF_GREY_DARK).ellipse(12, 3, 1.5, 1, LEAF_GREY).ellipse(8, 8, 1.5, 1, LEAF_GREY).ellipse(12, 7, 1.5, 1, LEAF_GREY));
  pot(d, 7, 12, 7, 4);
});

/** A grey tomato plant – with red tomatoes full of round holes. */
export const greenhouseTomatoPlant: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .line(8, 12, 8, 2, LEAF_GREY_DARK)
      .ellipse(5, 4, 2.5, 1.2, LEAF_GREY)
      .ellipse(11, 3, 2.5, 1.2, LEAF_GREY)
      .ellipse(5, 8, 2.5, 1.2, LEAF_GREY)
      .ellipse(11, 7, 2.5, 1.2, LEAF_GREY),
  );
  d.part((p) => p.ellipse(4, 6, 1.6, 1.6, RED).ellipse(12, 10, 1.6, 1.6, RED).set(4, 6, "#f4d8c8").set(12, 10, "#f4d8c8").set(11, 9, "#ff8a80"));
  pot(d, 5, 12, 7, 4);
});

/** A bitten tomato: round, smooth holes, and slime shining around them. */
export const greenhouseBitten: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .ellipse(8, 9, 5.5, 5, RED)
      .paint((x, y) => x > 10 && y > 10, RED_DARK)
      .ellipse(6, 9, 1.2, 1.2, "#f4d8c8")
      .ellipse(10, 11, 1, 1, "#f4d8c8")
      .set(5, 6, "#ff8a80")
      .set(6, 5, "#ff8a80"),
  );
  d.part((p) => p.set(8, 3, LEAF_GREY_DARK).set(7, 4, LEAF_GREY).set(9, 4, LEAF_GREY).set(8, 4, LEAF_GREY_DARK));
  d.part((p) => p.set(4, 11, "#e8f8ff").set(8, 8, "#e8f8ff").set(12, 12, "#e8f8ff").set(9, 13, "#e8f8ff"), false);
});

/** Yellow pollen shaken all over a tomato flower. */
export const greenhousePollen: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .tri(8, 2, 5, 8, 11, 8, YELLOW)
      .tri(8, 14, 5, 8, 11, 8, YELLOW)
      .tri(2, 8, 8, 5, 8, 11, YELLOW)
      .tri(14, 8, 8, 5, 8, 11, YELLOW)
      .ellipse(8, 8, 1.5, 1.5, "#e09a20"),
  );
  d.part((p) => {
    for (const [x, y] of [[2, 2], [13, 3], [12, 13], [3, 12], [14, 10], [1, 6]]) p.set(x, y, "#ffe070");
  }, false);
});

/** A shiny slime trail on the floor. */
export const greenhouseSlime: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => {
    for (let x = 1; x <= 14; x++) {
      const y = 8 + Math.round(Math.sin(x / 2) * 2);
      p.set(x, y, "#c8dce0").set(x, y + 1, "#c8dce0");
    }
    p.paint((x) => x % 4 === 1, "#f4ffff");
  });
});

/** Little drops of green paint that have run along the floor. */
export const greenhouseGreenDrips: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[3, 3], [9, 6], [5, 11], [12, 12]]) {
    d.part((p) => p.tri(x, y - 2, x - 1.5, y + 0.5, x + 1.5, y + 0.5, GREEN).ellipse(x, y + 1, 1.2, 1.2, GREEN).set(x - 1, y, "#a8e89a"));
  }
});

/** Tiny plants under a grow lamp – they all bend towards the lamp. */
export const greenhouseLampSprouts: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(13, 0, 13, 1, "#5a566e").tri(10, 4, 15, 4, 13, 1, "#5a566e"));
  d.part((p) => p.ellipse(12.5, 5, 2, 1, "#fff4b0"), false);
  d.part((p) => p.rect(1, 12, 13, 3, SOIL));
  for (const x of [2, 6, 10]) {
    d.part((p) => p.line(x, 11, x + 1, 9, LEAF_GREY_DARK).line(x + 1, 9, x + 3, 7, LEAF_GREY_DARK).set(x + 3, 6, LEAF_GREY).set(x + 4, 7, LEAF_GREY).set(x + 2, 7, LEAF_GREY), false);
  }
});

/** The snail's food bowl, full of grey leaves nobody has eaten. */
export const greenhouseSnailBowl: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(8, 8, 2.5, 1.5, LEAF_GREY).ellipse(5, 9, 2.5, 1.2, LEAF_GREY).ellipse(11, 9, 2.5, 1.2, LEAF_GREY_DARK));
  d.part((p) => p.ellipse(8, 11, 6.5, 3, "#6a8ab8", 14).rect(2, 9, 13, 2, "#6a8ab8").paint((_, y) => y === 9, "#8aaad8"));
});

/** A lantern with a warm flame. */
export const greenhouseLantern: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(6, 2, 8, 0, "#5a566e").line(8, 0, 10, 2, "#5a566e"));
  d.part((p) => p.rect(5, 3, 7, 2, "#5a4a3a").rect(5, 13, 7, 2, "#5a4a3a").rect(5, 5, 7, 8, "#ffe890").rect(8, 5, 1, 8, "#5a4a3a"));
  d.part((p) => p.set(7, 9, "#ff9a3a").set(7, 10, "#ff9a3a").set(7, 8, "#ffd060"), false);
});

/** The gardener's poster: the sun shines on a green leaf. */
export const greenhousePoster: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 1, 14, 14, PAPER));
  d.part((p) => p.ellipse(11, 4, 2, 2, YELLOW));
  d.part((p) => p.ellipse(6, 10, 3.5, 2, GREEN).line(3, 12, 9, 8, GREEN_DARK));
  d.part((p) => p.set(9, 6, YELLOW).set(8, 7, YELLOW), false);
});

/** The compost heap: old leaves and peel turning into soil, with little mushrooms. */
export const greenhouseCompost: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .ellipse(8, 13, 7, 4, SOIL, 15)
      .set(4, 11, "#c87a3a")
      .set(9, 10, "#d8a040")
      .set(12, 12, LEAF_GREY)
      .set(6, 13, "#c87a3a")
      .set(10, 13, "#d8a040"),
  );
  for (const [x, y] of [[4, 8], [11, 7]]) {
    d.part((p) => p.rect(x, y + 1, 1, 2, "#f3e3c3").ellipse(x, y, 1.6, 0.8, "#f5b82e"));
  }
});

// ---------- Puzzle pictures (in colour, like pictures in a book) ----------

/** Sudoku picture: a sunflower. */
export const greenhouseSunflower: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(7, 9, 2, 7, GREEN_DARK).ellipse(5, 12, 2, 1, GREEN));
  d.part((p) => p.ellipse(8, 6, 5, 5, YELLOW).ellipse(8, 6, 2, 2, "#7a4a22").paint((x, y) => (x + y) % 5 === 0 && Math.hypot(x - 8, y - 6) > 3, "#e0a020"));
});

/** Sudoku picture: a cactus in a pot. */
export const greenhouseCactus: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .rect(6, 2, 4, 10, GREEN)
      .rect(2, 5, 2, 4, GREEN)
      .rect(3, 8, 3, 2, GREEN)
      .rect(12, 4, 2, 4, GREEN)
      .rect(10, 7, 3, 2, GREEN)
      .paint((x, y) => (x === 7 || x === 9) && y % 3 === 0, "#d8f0a0")
      .paint((x) => x === 6, GREEN_DARK),
  );
  pot(d, 4, 12, 8, 4);
});

/** Sudoku picture: a red tulip. */
export const greenhouseTulip: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(7, 8, 2, 8, GREEN_DARK).ellipse(4, 12, 2.5, 1, GREEN).ellipse(11, 11, 2.5, 1, GREEN));
  d.part((p) => p.ellipse(8, 5, 4, 3.5, "#e0406a").tri(4, 1, 6, 4, 4, 5, "#e0406a").tri(12, 1, 10, 4, 12, 5, "#e0406a").set(8, 2, "#e0406a").set(7, 3, "#ff7a9a"));
});

/** Sudoku picture: a carrot. */
export const greenhouseCarrot: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(8, 5, 6, 1, GREEN).line(8, 5, 8, 0, GREEN).line(8, 5, 11, 1, GREEN));
  d.part((p) => p.tri(4, 5, 12, 5, 8, 15, "#f08a2a").paint((x, y) => y % 3 === 0 && x < 8, "#c86a1a"));
});

/** The tomato's life, 1: a seed in the soil. */
export const greenhouseSeed: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(0, 9, 16, 7, SOIL).paint((x, y) => (x * 3 + y) % 7 === 0, "#7a5230"));
  d.part((p) => p.ellipse(8, 11, 2, 1.3, "#f0d890").set(7, 11, "#fff4c8"));
});

/** The tomato's life, 2: a sprout with two tiny leaves. */
export const greenhouseSprout: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(0, 11, 16, 5, SOIL));
  d.part((p) => p.rect(8, 6, 1, 5, GREEN_DARK).ellipse(6, 6, 2, 1, GREEN).ellipse(11, 6, 2, 1, GREEN));
});

/** The tomato's life, 3: a young plant with many leaves. */
export const greenhouseSeedling: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .rect(7, 2, 2, 10, GREEN_DARK)
      .ellipse(4, 4, 2.5, 1.2, GREEN)
      .ellipse(12, 3, 2.5, 1.2, GREEN)
      .ellipse(4, 8, 2.5, 1.2, GREEN)
      .ellipse(12, 8, 2.5, 1.2, GREEN),
  );
  pot(d, 4, 12, 8, 4);
});

/** The tomato's life, 4: a yellow tomato flower. */
export const greenhouseFlower: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(7, 9, 2, 7, GREEN_DARK).ellipse(4, 13, 2.5, 1, GREEN).ellipse(12, 12, 2.5, 1, GREEN));
  d.part((p) =>
    p
      .tri(8, 1, 6, 6, 10, 6, YELLOW)
      .tri(3, 5, 7, 4, 7, 8, YELLOW)
      .tri(13, 5, 9, 4, 9, 8, YELLOW)
      .tri(5, 10, 7, 6, 8, 8, YELLOW)
      .tri(11, 10, 9, 6, 8, 8, YELLOW)
      .ellipse(8, 6, 1.2, 1.2, "#e09a20"),
  );
});

/** The tomato's life, 5: a red tomato. */
export const greenhouseFruit: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(8, 9, 5.5, 5, RED).paint((x, y) => x > 10 && y > 10, RED_DARK).set(5, 6, "#ff8a80").set(6, 5, "#ff8a80"));
  d.part((p) => p.set(8, 2, GREEN_DARK).set(8, 3, GREEN).set(6, 4, GREEN).set(7, 4, GREEN).set(9, 4, GREEN).set(10, 4, GREEN));
});

export const case9Sprites: Record<string, PixelSprite> = {
  s2Gardener,
  s2Snail,
  s2Flytrap,
  greenhouseBumble,
  greenhouseBumbleRest,
  greenhouseGhost,
  greenhouseNotebook,
  greenhouseLeaning,
  greenhouseRuler,
  greenhouseTomatoPlant,
  greenhouseBitten,
  greenhousePollen,
  greenhouseSlime,
  greenhouseGreenDrips,
  greenhouseLampSprouts,
  greenhouseSnailBowl,
  greenhouseLantern,
  greenhousePoster,
  greenhouseCompost,
  greenhouseSunflower,
  greenhouseCactus,
  greenhouseTulip,
  greenhouseCarrot,
  greenhouseSeed,
  greenhouseSprout,
  greenhouseSeedling,
  greenhouseFlower,
  greenhouseFruit,
};
