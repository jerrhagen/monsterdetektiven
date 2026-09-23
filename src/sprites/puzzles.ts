import type { PixelSprite } from "./pixelSprite";

const E = "................";

/** Cash register standing on the counter, with a receipt sticking up. */
export const register: PixelSprite = {
  palette: { ".": null, o: "#1a1024", g: "#6a6a80", G: "#3d3d50", s: "#5cc46a", p: "#f4ecd8", y: "#ffd66b" },
  frames: [
    [
      E,
      E,
      "......pp........",
      "......pp........",
      "..oooooooooooo..",
      "..oggsssssgggo..",
      "..oggsssssgggo..",
      "..oggggggggggo..",
      "..oGyGyGyGyGGo..",
      "..oGGyGyGyGGGo..",
      "..oggggggggggo..",
      "..oooooooooooo..",
      E,
      E,
      E,
      E,
    ],
  ],
};

// ---------- Shapes for the shape lock ----------

export const shapeSphere: PixelSprite = {
  palette: { ".": null, o: "#1a1024", b: "#4a90e2", B: "#2d5f9e", w: "#cfe8ff" },
  frames: [
    [
      E,
      ".....oooooo.....",
      "...oobbbbbboo...",
      "..obwwbbbbbbbo..",
      "..obwbbbbbbbbo..",
      ".obbbbbbbbbbbbo.",
      ".obbbbbbbbbbbbo.",
      ".obbbbbbbbbbbBo.",
      ".obbbbbbbbbbbBo.",
      ".obbbbbbbbbbBBo.",
      "..obbbbbbbbBBo..",
      "..obbbbbbbBBBo..",
      "...oobbbBBBoo...",
      ".....oooooo.....",
      E,
      E,
    ],
  ],
};

export const shapeCube: PixelSprite = {
  palette: { ".": null, o: "#1a1024", t: "#ff8a8a", r: "#e04848", R: "#a02a2a" },
  frames: [
    [
      E,
      "....ooooooooo...",
      "...otttttttoRo..",
      "..otttttttoRRo..",
      ".ooooooooooRRo..",
      ".orrrrrrrroRRo..",
      ".orrrrrrrroRRo..",
      ".orrrrrrrroRRo..",
      ".orrrrrrrroRRo..",
      ".orrrrrrrroRRo..",
      ".orrrrrrrroRo...",
      ".orrrrrrrroo....",
      ".oooooooooo.....",
      E,
      E,
      E,
    ],
  ],
};

export const shapeCylinder: PixelSprite = {
  palette: { ".": null, o: "#1a1024", t: "#b8f0a0", g: "#5cc46a", G: "#2e8a3a" },
  frames: [
    [
      E,
      "....oooooooo....",
      "...otttttttto...",
      "...oottttttoo...",
      "...ogggggggGo...",
      "...ogggggggGo...",
      "...ogggggggGo...",
      "...ogggggggGo...",
      "...ogggggggGo...",
      "...ogggggggGo...",
      "...ogggggggGo...",
      "...ogggggggGo...",
      "...oogggggGoo...",
      "....oooooooo....",
      E,
      E,
    ],
  ],
};

export const shapeCone: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#f2d24b", Y: "#c9a21e" },
  frames: [
    [
      E,
      ".......oo.......",
      "......oyyo......",
      "......oyyo......",
      ".....oyyyYo.....",
      ".....oyyyYo.....",
      "....oyyyyYYo....",
      "....oyyyyYYo....",
      "...oyyyyyyYYo...",
      "...oyyyyyyYYo...",
      "..oyyyyyyyyYYo..",
      "..oyyyyyyyyYYo..",
      "..ooyyyyyyYYoo..",
      "....oooooooo....",
      E,
      E,
    ],
  ],
};

// ---------- Pictures for Viskan's riddle ----------

export const towel: PixelSprite = {
  palette: { ".": null, o: "#1a1024", B: "#4a90e2", w: "#ffffff" },
  frames: [
    [
      E,
      E,
      "..oooooooooooo..",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oBBwwBBwwo...",
      "...oooooooooo...",
      E,
      E,
    ],
  ],
};

export const umbrella: PixelSprite = {
  palette: { ".": null, o: "#1a1024", r: "#e04848", k: "#5a3a1e" },
  frames: [
    [
      E,
      ".......oo.......",
      ".....oorroo.....",
      "...oorrrrrroo...",
      "..orrrrrrrrrro..",
      ".orrrrrrrrrrrro.",
      ".oooooooooooooo.",
      ".......ok.......",
      ".......ok.......",
      ".......ok.......",
      ".......ok.......",
      ".....k..k.......",
      "......kk........",
      E,
      E,
      E,
    ],
  ],
};

export const iceCream: PixelSprite = {
  palette: { ".": null, o: "#1a1024", p: "#ff8ade", w: "#ffffff", l: "#d9a877" },
  frames: [
    [
      E,
      "......oooo......",
      ".....oppppo.....",
      "....oppwpppo....",
      "....opppppppo...",
      "....oooooooo....",
      ".....ollllo.....",
      ".....ollllo.....",
      "......ollo......",
      "......ollo......",
      ".......oo.......",
      E,
      E,
      E,
      E,
      E,
    ],
  ],
};

export const sun: PixelSprite = {
  palette: { ".": null, o: "#c97a1e", y: "#ffd66b" },
  frames: [
    [
      E,
      "..y....y....y...",
      "...y..ooo..y....",
      ".....oyyyo......",
      "....oyyyyyo.....",
      "yy..oyyyyyo..yy.",
      "....oyyyyyo.....",
      ".....oyyyo......",
      "...y..ooo..y....",
      "..y....y....y...",
      E,
      E,
      E,
      E,
      E,
      E,
    ],
  ],
};

/** A hand in a green sleeve, scuttling on its fingertips like a spider. */
export const arm: PixelSprite = {
  palette: { ".": null, o: "#1a1024", g: "#3fae4a", s: "#b8d8a0", r: "#c0182c" },
  frameRate: 10,
  frames: [
    [
      E,
      E,
      "......oooooo....",
      ".ooooosssssso...",
      "orggggossssssoo.",
      "orggggossssssso.",
      ".ooooooossssoo..",
      ".......os.os.so.",
      "......os..os..so",
      "......o...o....o",
      E,
      E,
    ],
    [
      E,
      E,
      "......oooooo....",
      ".ooooosssssso...",
      "orggggossssssoo.",
      "orggggossssssso.",
      ".ooooooossssoo..",
      "........so.so.os",
      ".........so.so.o",
      "..........o..o..",
      E,
      E,
    ],
  ],
};

// ---------- More pictures for riddles ----------

export const comb: PixelSprite = {
  palette: { ".": null, o: "#1a1024", p: "#ff8ade", P: "#c93aa6" },
  frames: [
    [
      E,
      E,
      E,
      E,
      "..oooooooooooo..",
      "..oppppppppppo..",
      "..oPPPPPPPPPPo..",
      "..oPoPoPoPoPoo..",
      "..oPoPoPoPoPoo..",
      "..oPoPoPoPoPoo..",
      "..o.o.o.o.o.o...",
      E,
      E,
      E,
      E,
      E,
    ],
  ],
};

export const needle: PixelSprite = {
  palette: { ".": null, o: "#1a1024", G: "#c8c4d4", r: "#e04848" },
  frames: [
    [
      E,
      "..........oo....",
      ".........oGGo...",
      ".........oG.o...",
      "........oGGo....",
      "........oGo.r...",
      ".......oGGo..r..",
      ".......oGo...r..",
      "......oGGo..r...",
      "......oGo..r....",
      ".....oGGo.r.....",
      ".....oGo........",
      "....oGo.........",
      "....oo..........",
      E,
      E,
    ],
  ],
};

export const chair: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#b07a44", W: "#7a4f2a" },
  frames: [
    [
      E,
      "...oooooo.......",
      "...owwwwo.......",
      "...owWWwo.......",
      "...owwwwo.......",
      "...owWWwo.......",
      "...owwwwoooooo..",
      "...owwwwwwwwwo..",
      "...oooooooooooo.",
      "...oWo.....oWo..",
      "...oWo.....oWo..",
      "...oWo.....oWo..",
      "...oWo.....oWo..",
      "...ooo.....ooo..",
      E,
      E,
    ],
  ],
};
