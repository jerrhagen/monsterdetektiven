import type { PixelSprite } from "./pixelSprite";

const E16 = "................";
const E12 = "............";

/** Clue: five small dots in a row in the dust – fingertips, but you can't tell yet. */
export const fingerDots: PixelSprite = {
  palette: { ".": null, d: "#6b5566" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      E16,
      "...d.d.d.d......",
      "...........d....",
      E16,
      E16,
      E16,
      ".......d.d.d.d..",
      "..............d.",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** A present with a bow and a label. */
export const gift: PixelSprite = {
  palette: { ".": null, o: "#1a1024", r: "#e04848", R: "#a02a2a", y: "#ffd66b", w: "#f4ecd8" },
  frames: [
    [
      E16,
      E16,
      E16,
      ".....yy..yy.....",
      "....y..yy..y....",
      "...oooooyoooo...",
      "...orrrryrrro...",
      "...orrrryrrro...",
      "...oyyyyyyyyo...",
      "...orrrryrrro.ww",
      "...orrrryrrro.ww",
      "...oRRRRyRRRo...",
      "...oooooooooo...",
      E16,
      E16,
      E16,
    ],
  ],
};

/** A torn bit of green jumper on a nail, with a little blood. */
export const sleeveScrap: PixelSprite = {
  palette: { ".": null, o: "#1a1024", g: "#3fae4a", G: "#2a8a3a", n: "#8a86a0", r: "#c0182c" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      "......n.........",
      ".....ogoo.......",
      "....ogggGo......",
      "....oggGggo.....",
      ".....ogggrgo....",
      "......oggGo.r...",
      ".......oo.......",
      "............r...",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** Stina's customer book, open on the counter. */
export const customerBook: PixelSprite = {
  palette: { ".": null, o: "#1a1024", p: "#f4ecd8", t: "#6a5a7a", b: "#8a2346" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      "..oooooo.oooooo.",
      "..opppppopppppo.",
      "..opttppoptttpo.",
      "..opppppopppppo.",
      "..optttpopttppo.",
      "..opppppopppppo.",
      "..bbbbbbbbbbbbb.",
      E16,
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** Fladder resting, hanging upside down – awake, with open eyes. */
export const fladderHang: PixelSprite = {
  palette: { ".": null, k: "#14101c", m: "#b0226e", p: "#ff8ade", P: "#c93aa6", w: "#e8e8f0" },
  frames: [
    [
      E16,
      "......k..k......",
      "......kkkk......",
      ".....PppppP.....",
      "....PppppppP....",
      "....PppkkppP....",
      "....PkkkkkkP....",
      ".....kwkkwk.....",
      ".....kkkkkk.....",
      "......kkkk......",
      ".......mm.......",
      E16,
    ],
  ],
};

// ---------- Four kinds of G, for comparing handwriting ----------

const G = (rows: string[]): PixelSprite => ({ palette: { ".": null, o: "#2a1a2e", r: "#e04848" }, frames: [rows] });

export const gCurly = G([
  ".......oo...",
  ".....oo..o..",
  "...oo.......",
  "..o.........",
  ".o....ooooo.",
  ".o.......o..",
  "..o.....o...",
  "...ooooo.o..",
  ".........o..",
  "......ooo...",
  E12,
  E12,
]);

export const gBlock = G([
  E12,
  ".oooooooo...",
  ".oooooooo...",
  ".oo.........",
  ".oo..oooo...",
  ".oo..oooo...",
  ".oo....oo...",
  ".oooooooo...",
  ".oooooooo...",
  E12,
  E12,
  E12,
]);

export const gThin = G([
  E12,
  "..oooooo....",
  ".o......o...",
  ".o..........",
  ".o...oooo...",
  ".o......o...",
  ".o......o...",
  "..oooooo....",
  E12,
  E12,
  E12,
  E12,
]);

export const gDotted = G([
  E12,
  "..oooooo....",
  ".o......o...",
  ".o..........",
  ".o...oooo...",
  ".o..r...o...",
  ".o......o...",
  "..oooooo....",
  E12,
  E12,
  E12,
  E12,
]);
