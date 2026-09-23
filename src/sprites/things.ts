import type { PixelSprite } from "./pixelSprite";

/** A standing wooden sign. */
export const sign: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#b07a44", W: "#7a4f2a", p: "#f4ecd8", t: "#6a5a7a" },
  frames: [
    [
      "................",
      ".oooooooooooooo.",
      ".owwwwwwwwwwwwo.",
      ".owppppppppppwo.",
      ".owpttttttttpwo.",
      ".owppppppppppwo.",
      ".owpttttttpppwo.",
      ".owppppppppppwo.",
      ".owwwwwwwwwwwwo.",
      ".oooooooooooooo.",
      "......oWWo......",
      "......oWWo......",
      "......oWWo......",
      "......oWWo......",
      ".....oooooo.....",
      "................",
    ],
  ],
};

/** A teddy bear with a red scarf. */
export const teddy: PixelSprite = {
  palette: { ".": null, o: "#1a1024", b: "#a0643a", B: "#7a4526", l: "#d9a877", r: "#d23b3b" },
  frames: [
    [
      "................",
      "...ooo....ooo...",
      "..oBbo....obBo..",
      "..obbboooobbbo..",
      "...obbbbbbbbo...",
      "..obbobbbbobbo..",
      "..obbbllllbbbo..",
      "..obbbloolbbbo..",
      "...obbllllbbo...",
      "....orrrrrro....",
      "...obbbllbbbo...",
      "..obbbllllbbbo..",
      "..obbbllllbbbo..",
      "..oBBobbbboBBo..",
      "...oo.oooo.oo...",
      "................",
    ],
  ],
};

/** Z's floating above a sleeping monster. */
export const zzz: PixelSprite = {
  palette: { ".": null, w: "#ffffff" },
  frames: [
    [
      "wwww....",
      "..w.....",
      ".w......",
      "wwww.www",
      "......w.",
      ".....www",
    ],
  ],
};

/** "?" – a monster that lost sight of Nora. */
export const questionBubble: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#ffffff" },
  frames: [
    [
      ".ooooo.",
      "owwwwwo",
      "owooowo",
      "owwwowo",
      "owwowwo",
      "owwwwwo",
      "owwowwo",
      ".ooooo.",
      "...o...",
    ],
  ],
};

/** Shown over a clue or a thing Nora can look at. */
export const lookBubble: PixelSprite = {
  palette: { ".": null, o: "#1a1024", r: "#ffd66b", l: "#bfe8ff", s: "#ffffff", h: "#8a5a2a" },
  frames: [
    [
      "..oooo....",
      ".orrrro...",
      "orlsllro..",
      "orslllro..",
      "orllllro..",
      "orllllro..",
      ".orrrrohh.",
      "..oooohhho",
      ".......hho",
      "........o.",
    ],
  ],
};

/** Small speech bubble shown above someone Nora can talk to. */
export const hintBubble: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#ffffff" },
  frames: [
    [
      ".ooooooo.",
      "owwwwwwwo",
      "owowowowo",
      "owwwwwwwo",
      ".ooowooo.",
      "....o....",
    ],
  ],
};
