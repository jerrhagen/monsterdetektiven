import { type Painter, drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// Sprites shared by all season 2 cases (see SEASON2.md – spoilers).
// The little grey monster's final look is a placeholder until Nora has drawn it.

const PENCIL = "#8a86a0";
const PENCIL_DARK = "#5a566e";
const PAPER = "#f4f0e4";

/** A drop of paint, one for each colour of the rainbow – collected at the end of every case. */
function drop(colour: string, light: string): PixelSprite {
  return drawSprite(10, 12, (d) => {
    d.part((p) => p.tri(5, 0, 1, 7, 9, 7, colour).ellipse(5, 7.5, 3.5, 3.5, colour).set(3, 6, light).set(3, 7, light).set(4, 5, light));
  });
}

export const dropRed = drop("#e04848", "#ff9a9a");
export const dropOrange = drop("#f07a3a", "#ffb888");
export const dropYellow = drop("#f2d24b", "#fff0a0");
export const dropGreen = drop("#4fb84a", "#a8e89a");
export const dropBlue = drop("#3a7ad8", "#9ac4ff");
export const dropPurple = drop("#8a4ac8", "#c8a0f0");

/**
 * The little monster made of pencil lines (working name in names.ts: S2.scribble).
 * Frame 0 and 1: walking, all grey. Frame 2: coloured in every colour (the season finale).
 * Built frame by frame so all three share one palette.
 */
function scribbleSprite(): PixelSprite {
  const frames = [
    drawSprite(16, 16, (d) => drawScribble(d, false, 0)),
    drawSprite(16, 16, (d) => drawScribble(d, false, 1)),
    drawSprite(16, 16, (d) => drawScribble(d, true, 0)),
  ];
  // Merge the palettes: give every frame its own letters by re-keying into one palette.
  const palette: Record<string, string | null> = { ".": null };
  const keyOf = new Map<string, string>();
  const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rekeyed = frames.map((f) =>
    f.frames[0].map((row) =>
      [...row]
        .map((ch) => {
          const colour = f.palette[ch];
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
  return {
    palette,
    frames: rekeyed,
    // The walking animation (named after the sprite) only uses the grey frames.
    animations: { "": { frames: [0, 1], frameRate: 5 } },
  };
}

function drawScribble(d: Painter, coloured: boolean, step: number): void {
  const body = coloured ? "#f2d24b" : PAPER;
  d.part((p) => {
    p.ellipse(8, 7, 5.5, 5, body);
    if (coloured) {
      const rainbow = ["#e04848", "#f07a3a", "#f2d24b", "#4fb84a", "#3a7ad8", "#8a4ac8"];
      rainbow.forEach((c, i) => p.paint((_, y) => y >= 2 + i * 2 && y < 4 + i * 2, c));
    } else {
      // Hatching, like shading with a pencil.
      p.paint((x, y) => (x + y) % 4 === 0 && y > 6, PENCIL);
    }
    p.set(6, 6, "#1a1024").set(10, 6, "#1a1024").set(7, 9, PENCIL_DARK).set(8, 9, PENCIL_DARK).set(9, 9, PENCIL_DARK);
  });
  // Scribbly little legs and a pencil curl on top.
  d.part((p) => p.line(5, 12, 4 + step, 15, PENCIL_DARK).line(11, 12, 12 - step, 15, PENCIL_DARK).line(8, 2, 9, 0, PENCIL_DARK).set(10, 0, PENCIL_DARK), false);
}

export const s2Scribble: PixelSprite = scribbleSprite();

/** Grey footprints that look drawn with a pencil – little scribbled feet. */
export const s2ScribblePrints: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[3, 3], [9, 6], [4, 10], [10, 12]]) {
    d.part((p) => p.line(x, y, x + 3, y, PENCIL).line(x, y + 1, x + 2, y + 1, PENCIL).set(x + 1, y - 1, PENCIL_DARK).set(x + 3, y - 1, PENCIL_DARK), false);
  }
});

/** Pencil shavings – curly bits of wood with grey tips. */
export const s2PencilShavings: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[3, 9], [8, 11], [11, 7]]) {
    d.part((p) => p.ellipse(x, y, 2.5, 1.5, "#e0b070").set(x - 2, y, PENCIL_DARK).set(x, y, "#c08040"));
  }
});

/** A torn page from a sketchbook, with a pencil drawing of a little round monster. */
export const s2SketchPage: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 1, 12, 14, PAPER).set(13, 1, "#d8d0c0").set(2, 14, "#d8d0c0").paint((x, y) => x === 2 && y % 3 === 0, "#d8d0c0"));
  d.part((p) => p.ellipse(8, 7, 3, 3, PAPER).line(6, 10, 5, 12, PENCIL).line(10, 10, 11, 12, PENCIL).set(7, 6, PENCIL_DARK).set(9, 6, PENCIL_DARK), false);
  d.part((p) => {
    for (let x = 5; x <= 11; x++) p.set(x, x % 2 ? 4 : 3, PENCIL);
    p.line(4, 7, 4, 9, PENCIL).line(12, 7, 12, 9, PENCIL).line(5, 10, 11, 10, PENCIL);
  }, false);
});

/** A glass jar of paint (the colours are gathered here). */
export const s2PaintJar: PixelSprite = drawSprite(12, 14, (d) => {
  d.part((p) => p.rect(2, 2, 8, 2, "#8a86a0"));
  d.part((p) =>
    p
      .rect(1, 4, 10, 10, "#dce8f0")
      .rect(2, 8, 8, 5, "#8a4ac8")
      .paint((x) => x < 4, "#a070d8")
      .set(2, 5, "#ffffff")
      .set(2, 6, "#ffffff"),
  );
});

export const sharedSprites: Record<string, PixelSprite> = {
  dropRed,
  dropOrange,
  dropYellow,
  dropGreen,
  dropBlue,
  dropPurple,
  s2Scribble,
  s2ScribblePrints,
  s2PencilShavings,
  s2SketchPage,
  s2PaintJar,
};
