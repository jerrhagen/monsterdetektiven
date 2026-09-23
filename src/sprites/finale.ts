import type { PixelSprite } from "./pixelSprite";

// Grymlan – from the architect's drawing (assets/bilder/teckningar/lila-har.jpg):
// spiky purple hair, green jumper, brown trousers. Frame 0: one arm missing. Frame 1: whole again.

const head = [
  "..p.p..p..p.p...",
  "..ppp.ppp.ppp...",
  "..oppppppppppo..",
  "..oppssssssppo..",
  "..opsksssskspo..",
  "..opsssssssspo..",
  "..opswkwwkwspo..",
  "...opssssssspo..",
  "...ogggggggggo..",
  "..oggggggggggo..",
];
const legs = [
  "...obbbbbbbbo...",
  "...obbo..obbo...",
  "...obbo..obbo...",
  "...obbo..obbo...",
  "..oBBBo..oBBBo..",
  "..ooooo..ooooo..",
];

export const grymlan: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    p: "#9b4ac8", // hair
    s: "#d8e8c8", // pale skin
    k: "#1a1024",
    w: "#ffffff", // teeth
    g: "#6cc24a", // jumper
    b: "#7a4526", // trousers
    B: "#4a2a18", // shoes
    r: "#c0182c", // blood
  },
  frames: [
    [...head, ".oggggggggggor..", ".ogoggggggggo.r.", ".sgoggggggggo...", ".s.obbbbbbbbo...", ...legs],
    [...head, ".oggggggggggggo.", ".ogoggggggggogo.", ".sgoggggggggogs.", ".s.obbbbbbbbo.s.", ...legs],
  ],
};

/** A piece of the Moonstone – glowing, cold and blue. */
export const moonShard: PixelSprite = {
  palette: { ".": null, o: "#3a6a8a", w: "#ffffff", c: "#b8f0ff", C: "#7ac8e8" },
  frames: [
    [
      ".....oo.....",
      "....owco....",
      "....owcco...",
      "...owccCco..",
      "...owcCCco..",
      "..owccCCcco.",
      "..owcCCCcco.",
      "...occCCco..",
      "....occco...",
      ".....oco....",
      "......o.....",
      "............",
    ],
  ],
};

/** A secret monster egg, hidden somewhere in each case. */
export const monsterEgg: PixelSprite = {
  palette: { ".": null, o: "#1a1024", p: "#b98ae8", P: "#8a5ac8", Y: "#ffd66b", w: "#ffffff" },
  frames: [
    [
      "............",
      "....oooo....",
      "...oppppo...",
      "..opwppppo..",
      "..oppYpppo..",
      ".opppppYppo.",
      ".opYpppppo..",
      ".oppppYpppo.",
      ".oPpppppPPo.",
      "..oPPPPPPo..",
      "...oooooo...",
      "............",
    ],
  ],
};

/** Motion marks over a shelf where something is hiding. */
export const rustle: PixelSprite = {
  palette: { ".": null, w: "#ffffff" },
  frames: [
    [
      "................",
      "...w.......w....",
      "..w.w.....w.w...",
      ".....w...w......",
      "................",
    ],
  ],
};
