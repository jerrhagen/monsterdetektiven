import { type Painter, drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// Case 12 – "Färgtjuven" (the museum, the season finale). Everything new the case needs.
// SPOILER: see SEASON2.md. s2Painter and s2Guard are placeholders until Nora has drawn them.

const O = "#1a1024";
const PAPER = "#f4f0e4";
const PENCIL = "#8a86a0";
const PENCIL_DARK = "#5a566e";
const GOLD = "#c9a040";
const GOLD_DARK = "#9a7428";
const WOOD = "#8a5a3a";
const WOOD_DARK = "#6a4028";

const RED = "#e04848";
const ORANGE = "#f07a3a";
const YELLOW = "#f2d24b";
const GREEN = "#4fb84a";
const BLUE = "#3a7ad8";
const PURPLE = "#8a4ac8";

/** Several drawn frames as one sprite with a shared palette. */
function frames(pictures: PixelSprite[], animations?: PixelSprite["animations"]): PixelSprite {
  const palette: Record<string, string | null> = { ".": null };
  const keyOf = new Map<string, string>();
  const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rekeyed = pictures.map((pic) =>
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
  return { palette, frames: rekeyed, ...(animations ? { animations } : {}) };
}

// ---------- Placeholders for Nora's characters ----------

/**
 * The painter (S2.painter) – a purple beret, a paint-spotted smock, a palette in one hand
 * and a brush in the other. Placeholder until Nora has drawn her.
 */
export const s2Painter: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(5, 16, 2, 2, "#4a4460").rect(9, 16, 2, 2, "#4a4460"));
  d.part((p) => p.rect(4, 18, 3, 2, "#3a2a2a").rect(9, 18, 3, 2, "#3a2a2a"));
  d.part((p) =>
    p
      .rect(4, 10, 8, 7, PAPER)
      .rect(3, 11, 1, 4, PAPER)
      .rect(12, 11, 1, 4, PAPER)
      .set(5, 12, RED)
      .set(10, 11, BLUE)
      .set(9, 14, YELLOW)
      .set(6, 15, GREEN)
      .set(11, 13, PURPLE),
  );
  d.part((p) => p.ellipse(8, 6, 5, 4.5, "#7a3a2a"));
  d.part(
    (p) =>
      p
        .ellipse(8, 6.5, 3.5, 3.5, "#f2c8a0")
        .set(6, 6, O)
        .set(10, 6, O)
        .set(7, 8, "#c0504a")
        .set(8, 8, "#c0504a")
        .set(9, 8, "#c0504a")
        .set(5, 7, "#f0a0a0")
        .set(11, 7, "#f0a0a0"),
    false,
  );
  d.part((p) => p.ellipse(7, 2, 5, 1.6, PURPLE).set(9, 0, PURPLE).set(4, 2, "#a870e0"));
  d.part((p) => p.ellipse(2, 13, 2, 1.5, "#c89a60").set(1, 13, RED).set(2, 12, BLUE).set(3, 13, YELLOW));
  d.part((p) => p.line(13, 9, 14, 14, "#a0643a").set(13, 8, RED), false);
});

/** The museum guard (S2.guard) with his cap, moustache and torch. Frames 0–1: walking. */
function drawGuard(d: Painter, step: number): void {
  const spread = step ? 1 : 0;
  d.part((p) => p.rect(5 - spread, 15, 2, 4, "#1a2440").rect(9 + spread, 15, 2, 4, "#1a2440"));
  d.part((p) => p.rect(4 - spread, 19, 3, 1, "#2a1a1a").rect(9 + spread, 19, 3, 1, "#2a1a1a"));
  d.part((p) =>
    p
      .rect(4, 9, 8, 6, "#2a3a6a")
      .rect(2, 10, 2, 4, "#2a3a6a")
      .rect(12, 10, 2, 3, "#2a3a6a")
      .rect(4, 13, 8, 1, "#3a2a1a")
      .set(6, 10, YELLOW)
      .set(9, 11, "#6a7aa8")
      .set(9, 12, "#6a7aa8"),
  );
  d.part((p) => p.rect(12, 13, 3, 2, "#6a6a80").set(14, 13, "#fff2b0").set(14, 14, "#fff2b0"));
  d.part((p) => p.ellipse(8, 6, 3.5, 3.5, "#e8b890").set(6, 6, O).set(10, 6, O).line(6, 8, 10, 8, "#5a3a2a").set(8, 7, "#d09870"));
  d.part((p) => p.rect(4, 1, 8, 3, "#2a3a6a").rect(3, 4, 10, 1, "#1a2440").set(8, 2, YELLOW));
}

export const s2Guard: PixelSprite = frames(
  [drawSprite(16, 20, (d) => drawGuard(d, 0)), drawSprite(16, 20, (d) => drawGuard(d, 1))],
  { "": { frames: [0, 1], frameRate: 4 } },
);

// ---------- The museum's own monsters ----------

const STONE = "#a8a298";
const STONE_LIGHT = "#c8c2b8";
const STONE_DARK = "#7a746a";

/** Granit – a big stone statue that walks in his sleep. Frame 0: asleep on his plinth. Frame 1: awake! */
function drawGranit(d: Painter, awake: boolean): void {
  if (awake) {
    d.part((p) => p.rect(5, 18, 4, 4, STONE_DARK).rect(11, 18, 4, 4, STONE_DARK));
    d.part((p) => p.ellipse(3, 8, 2, 3, STONE).ellipse(17, 8, 2, 3, STONE));
  } else {
    d.part((p) => p.rect(2, 18, 16, 4, "#8a8478").rect(2, 18, 16, 1, STONE_LIGHT));
    d.part((p) => p.ellipse(4, 13, 2, 3, STONE).ellipse(16, 13, 2, 3, STONE));
  }
  d.part((p) =>
    p
      .ellipse(10, 13, 6, 5.5, STONE)
      .paint((x, y) => x < 7 && y < 12, STONE_LIGHT)
      .line(12, 10, 13, 13, STONE_DARK)
      .line(13, 13, 12, 15, STONE_DARK),
  );
  d.part((p) => {
    p.ellipse(10, 6, 5, 4.5, STONE).paint((x, y) => x < 8 && y < 5, STONE_LIGHT).line(6, 3, 7, 4, STONE_DARK);
    if (awake) {
      p.rect(7, 5, 2, 2, "#ff5a3a").rect(12, 5, 2, 2, "#ff5a3a").set(7, 5, "#ffd0a0").set(12, 5, "#ffd0a0");
      p.rect(8, 8, 5, 2, "#2a1a1a").set(8, 8, "#ffffff").set(12, 8, "#ffffff");
    } else {
      p.line(7, 6, 8, 6, O).line(12, 6, 13, 6, O).line(9, 9, 11, 9, STONE_DARK);
    }
  });
}

export const museumGranit: PixelSprite = frames([
  drawSprite(20, 22, (d) => drawGranit(d, false)),
  drawSprite(20, 22, (d) => drawGranit(d, true)),
]);

/** Mona – a portrait on a stand whose eyes follow you around the room. */
export const museumMona: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.line(3, 16, 2, 19, WOOD_DARK).line(12, 16, 13, 19, WOOD_DARK), false);
  d.part((p) => p.rect(1, 1, 14, 16, GOLD).rect(1, 1, 14, 1, "#e8c870").rect(1, 16, 14, 1, GOLD_DARK));
  d.part((p) => p.rect(3, 3, 10, 12, "#2a4a3a"), false);
  d.part((p) => p.ellipse(8, 7, 3.5, 3.5, "#3a2a1a").set(8, 3, "#3a2a1a"), false);
  d.part((p) => p.rect(5, 12, 6, 3, "#6a4a8a").set(8, 12, "#f0d0a8"), false);
  d.part(
    (p) =>
      p
        .ellipse(8, 8, 2, 2.5, "#f0d0a8")
        .set(6, 8, "#ffffff")
        .set(7, 8, O)
        .set(9, 8, "#ffffff")
        .set(10, 8, O)
        .set(8, 10, "#c05060"),
    false,
  );
});

// ---------- Things in the museum ----------

/** The screen that shows what the camera at the entrance has seen – grey and blurry. */
export const museumCamera: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(5, 13, 6, 2, "#3d3d50").rect(7, 11, 2, 2, "#3d3d50"));
  d.part((p) => p.rect(1, 2, 14, 10, "#3d3d50").set(13, 3, RED));
  d.part((p) => p.rect(2, 3, 10, 8, "#8a8a9a").paint((x, y) => (x + y) % 3 === 0, "#9a9aaa").ellipse(8, 7, 1.5, 1.5, "#d0c0f0").set(8, 7, "#ffffff"), false);
});

/** The guard's logbook – open, with neat lines. */
export const museumGuardLog: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 4, 14, 10, "#2a3a6a"));
  d.part((p) => {
    p.rect(2, 4, 6, 9, PAPER).rect(8, 4, 6, 9, PAPER).line(8, 4, 8, 12, "#c8c0b0");
    for (const y of [6, 8, 10]) p.line(3, y, 6, y, PENCIL).line(9, y, 12, y, PENCIL);
  }, false);
});

/** Grey, shiny smudges on the floor – they rub out like pencil. */
export const museumSmudges: PixelSprite = drawSprite(16, 16, (d) => {
  d.part(
    (p) =>
      p
        .ellipse(5, 5, 3, 1.5, PENCIL_DARK)
        .ellipse(11, 10, 3, 1.5, PENCIL_DARK)
        .ellipse(4, 12, 1.5, 1, PENCIL)
        .set(4, 5, "#d8d8e8")
        .set(10, 10, "#d8d8e8")
        .set(5, 4, PENCIL)
        .set(12, 9, PENCIL),
    false,
  );
});

/** Stone dust and big round footprints. */
export const museumStonePrints: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(5, 5, 3.5, 2.5, STONE_DARK).ellipse(5, 5, 2, 1, STONE), false);
  d.part((p) => p.ellipse(11, 11, 3.5, 2.5, STONE_DARK).ellipse(11, 11, 2, 1, STONE), false);
  d.part((p) => p.set(9, 3, STONE).set(13, 6, STONE).set(2, 11, STONE).set(7, 14, STONE_DARK), false);
});

/** The painting that lost its purple – brush strokes but no colour, and purple drips below. */
export const museumGreyPainting: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(3, 12, 2, 15, WOOD_DARK).line(12, 12, 13, 15, WOOD_DARK), false);
  d.part((p) => p.rect(1, 0, 14, 12, GOLD).rect(1, 11, 14, 1, GOLD_DARK));
  d.part((p) => p.rect(3, 2, 10, 8, "#a0a0a8").line(4, 4, 11, 3, "#b8b8c0").line(4, 7, 11, 6, "#b8b8c0").line(5, 9, 10, 8, "#8a8a92"), false);
  d.part((p) => p.set(7, 13, PURPLE).set(7, 14, PURPLE).set(9, 14, PURPLE).set(10, 15, "#c8a0f0"), false);
});

/** The studio wall: colours that ran down around an empty, round little shape. */
export const museumWallTries: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => {
    p.ellipse(3, 4, 2.5, 2.5, RED).ellipse(12, 3, 2.5, 2, YELLOW).ellipse(2, 10, 2, 2.5, GREEN).ellipse(13, 9, 2.5, 2.5, BLUE).ellipse(8, 2, 2, 1.5, ORANGE);
    p.line(3, 6, 3, 14, RED).line(12, 5, 12, 12, YELLOW).line(2, 12, 2, 15, GREEN).line(13, 11, 13, 15, BLUE).line(9, 3, 9, 5, ORANGE);
    p.ellipse(8, 8, 3.5, 3, "#e8e0f0");
  }, false);
  d.part((p) => p.line(6, 11, 5, 13, PENCIL).line(10, 11, 11, 13, PENCIL).set(7, 7, PENCIL_DARK).set(9, 7, PENCIL_DARK), false);
});

/** A little note in wobbly pencil letters. */
export const museumNote: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(3, 4, 10, 8, PAPER).set(12, 4, "#d8d0c0").set(12, 5, "#d8d0c0"));
  d.part((p) => {
    for (let x = 4; x <= 11; x++) p.set(x, 6 + (x % 2), PENCIL_DARK);
    for (let x = 4; x <= 9; x++) p.set(x, 9 + ((x + 1) % 2), PENCIL_DARK);
  }, false);
});

/** A big tin of grey paint with the lid dried stuck. */
export const museumGreyBucket: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(3, 5, 8, 1, "#5a5a68").line(8, 1, 13, 5, "#5a5a68"), false);
  d.part((p) => p.rect(3, 5, 10, 10, "#8a8a92").rect(3, 5, 10, 1, "#b0b0b8").rect(4, 8, 8, 4, "#a0a0a8").set(5, 13, "#6a6a72"));
});

/** Pia's paint cabinet with a colour lock: three little pots on the door. */
export const museumCabinet: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 1, 12, 14, WOOD).line(8, 2, 8, 14, WOOD_DARK).rect(2, 1, 12, 1, "#a87a52"));
  d.part((p) => p.ellipse(5, 7, 1, 1, RED).ellipse(11, 7, 1, 1, BLUE));
  d.part((p) => p.ellipse(8, 11, 1, 1, YELLOW));
});

/** A shelf of glass jars full of paint – every colour of the season. */
export const museumJarShelf: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(0, 7, 16, 1, WOOD).rect(0, 14, 16, 2, WOOD));
  const jars: [number, number, string][] = [
    [1, 2, RED],
    [6, 2, YELLOW],
    [11, 2, GREEN],
    [1, 9, BLUE],
    [6, 9, ORANGE],
    [11, 9, PURPLE],
  ];
  for (const [x, y, c] of jars) {
    d.part((p) => p.rect(x, y, 4, 5, "#dce8f0").rect(x, y + 2, 4, 3, c).set(x, y, "#8a86a0").set(x + 3, y, "#8a86a0"));
  }
});

/** Pia's old sketchbook – one page is empty, with only a few smudged pencil lines left. */
export const museumSketchbook: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(0, 3, 16, 11, "#7a4a2a"));
  d.part((p) => {
    p.rect(1, 4, 7, 9, PAPER).rect(8, 4, 7, 9, PAPER).line(8, 4, 8, 12, "#d8d0c0");
    p.line(2, 6, 6, 6, PENCIL).line(2, 8, 5, 8, PENCIL).line(3, 10, 6, 11, PENCIL);
    p.set(10, 6, "#c8c4d0").set(12, 6, "#c8c4d0").set(13, 8, "#c8c4d0").set(10, 10, "#c8c4d0").set(12, 11, "#c8c4d0");
  }, false);
});

// ---------- Puzzle pictures ----------

/** A glass jar with one colour – the four pictures of the jar sudoku. */
function jar(colour: string, light: string): PixelSprite {
  return drawSprite(12, 14, (d) => {
    d.part((p) => p.rect(2, 1, 8, 2, "#8a86a0"));
    d.part((p) => p.rect(1, 3, 10, 10, "#dce8f0").rect(2, 6, 8, 6, colour).paint((x, y) => x < 4 && y >= 6, light).set(2, 4, "#ffffff").set(2, 5, "#ffffff"));
  });
}

export const museumJarRed = jar(RED, "#ff9a9a");
export const museumJarYellow = jar(YELLOW, "#fff0a0");
export const museumJarBlue = jar(BLUE, "#9ac4ff");
export const museumJarGreen = jar(GREEN, "#a8e89a");

/** A splash of paint in one colour – pictures for spelling colour words and mixing colours. */
function splash(colour: string, light: string): PixelSprite {
  return drawSprite(16, 14, (d) => {
    d.part((p) =>
      p
        .ellipse(8, 7, 5, 4, colour)
        .ellipse(3, 3, 1, 1, colour)
        .ellipse(13, 11, 1, 1, colour)
        .set(14, 4, colour)
        .set(6, 5, light)
        .set(7, 4, light)
        .set(5, 6, light),
    );
  });
}

export const museumSplashRed = splash(RED, "#ff9a9a");
export const museumSplashOrange = splash(ORANGE, "#ffb888");
export const museumSplashYellow = splash(YELLOW, "#fff0a0");
export const museumSplashGreen = splash(GREEN, "#a8e89a");
export const museumSplashBlue = splash(BLUE, "#9ac4ff");
export const museumSplashPurple = splash(PURPLE, "#c8a0f0");
export const museumSplashPink = splash("#f08ab8", "#ffc8e0");
export const museumSplashBrown = splash("#8a5a30", "#b8885a");

export const case12Sprites: Record<string, PixelSprite> = {
  s2Painter,
  s2Guard,
  museumGranit,
  museumMona,
  museumCamera,
  museumGuardLog,
  museumSmudges,
  museumStonePrints,
  museumGreyPainting,
  museumWallTries,
  museumNote,
  museumGreyBucket,
  museumCabinet,
  museumJarShelf,
  museumSketchbook,
  museumJarRed,
  museumJarYellow,
  museumJarBlue,
  museumJarGreen,
  museumSplashRed,
  museumSplashOrange,
  museumSplashYellow,
  museumSplashGreen,
  museumSplashBlue,
  museumSplashPurple,
  museumSplashPink,
  museumSplashBrown,
};
