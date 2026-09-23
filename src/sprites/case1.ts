import type { PixelSprite } from "./pixelSprite";

/** Stina Snurr, owner of the toy store: grey bun, glasses, pink cardigan, yellow apron. */
export const stina: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    h: "#c8c4d4", // hair
    s: "#f5c8a0", // skin
    e: "#2a1a2e", // eyes
    w: "#cfe8ff", // glasses
    m: "#b05050", // mouth
    p: "#e06a9a", // cardigan
    P: "#b04a78", // cardigan, dark
    a: "#f2d24b", // apron
    l: "#5a4a6a", // legs
    f: "#3a2a3a", // shoes
  },
  frames: [
    [
      ".....oooooo.....",
      "....ohhhhhho....",
      "...oohhhhhhoo...",
      "..ohhhhhhhhhho..",
      "..ohssssssssho..",
      "..ohswewswewho..",
      "..ohssssssssho..",
      "...ossmmmmsso...",
      "....osssssso....",
      "...oppppppppo...",
      "..opppaaaapppo..",
      "..opPaaaaaaPpo..",
      "..osPaaaaaaPso..",
      "...oaaaaaaaao...",
      "...oaaaaaaaao...",
      "...oPPPPPPPPo...",
      "....olo..olo....",
      "....olo..olo....",
      "...offo..offo...",
      "....oo....oo....",
    ],
  ],
};

/** Fladder asleep, hanging upside down with the wings wrapped around her. */
export const fladderSleep: PixelSprite = {
  palette: { ".": null, k: "#14101c", m: "#b0226e", p: "#ff8ade", P: "#c93aa6" },
  frames: [
    [
      "................",
      "......k..k......",
      "......kkkk......",
      ".....PppppP.....",
      "....PppppppP....",
      "....PppkkppP....",
      "....PkkkkkkP....",
      ".....kkkkkk.....",
      ".....kkkkkk.....",
      "......kkkk......",
      ".......mm.......",
      "................",
    ],
  ],
};

/** Viskan the ghost, peeking out of a trash can. */
export const viskanBin: PixelSprite = {
  palette: { ".": null, o: "#1a1024", g: "#eef2e6", e: "#0a0a12", c: "#8a94a8", C: "#5f687c", l: "#a9b2c4" },
  frames: [
    [
      "................",
      "................",
      ".....oooooo.....",
      "....oggggggo....",
      "...oggggggggo...",
      "...ogeeggeego...",
      "...ogeeggeego...",
      "...oggggggggo...",
      "...oggeeeeggo...",
      "..oooooooooooo..",
      "..ollllllllllo..",
      "..oooooooooooo..",
      "...occCcccCcco..",
      "...occCcccCcco..",
      "...occCcccCcco..",
      "...occCcccCcco..",
      "...occCcccCcco..",
      "...occCcccCcco..",
      "...ooooooooooo..",
      "................",
    ],
  ],
};

/** A notice board with a paper note on it. */
export const noticeboard: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#7a4f2a", c: "#c9a06a", p: "#f4ecd8", t: "#c0182c", W: "#5a3a1e" },
  frames: [
    [
      "................",
      ".oooooooooooooo.",
      ".owwwwwwwwwwwwo.",
      ".owccppppppccwo.",
      ".owccpttttpccwo.",
      ".owccppppppccwo.",
      ".owccpttpppccwo.",
      ".owccppppppccwo.",
      ".owccccccccccwo.",
      ".owwwwwwwwwwwwo.",
      ".oooooooooooooo.",
      "...oWo....oWo...",
      "...oWo....oWo...",
      "...oWo....oWo...",
      "..ooooo..ooooo..",
      "................",
    ],
  ],
};

/** Clue: small handprints in the dust. */
export const handprints: PixelSprite = {
  palette: { ".": null, d: "#6b5566" },
  frames: [
    [
      "................",
      "................",
      "..d.d.d.........",
      "..d.d.d.d.......",
      "..ddddddd.......",
      "..dddddd.d......",
      "...ddddd........",
      "................",
      "........d.d.d...",
      "......d.d.d.d...",
      ".......ddddddd..",
      ".....d.dddddd...",
      "........ddddd...",
      "................",
      "................",
      "................",
    ],
  ],
};

/** Clue: a green wool thread. */
export const thread: PixelSprite = {
  palette: { ".": null, g: "#3fae4a" },
  frames: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "....gg..........",
      "...g..g....gg...",
      "..g....g..g..g..",
      "........gg....g.",
      "...............g",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
  ],
};

/** Clue: drops of blood. */
export const bloodDrops: PixelSprite = {
  palette: { ".": null, r: "#c0182c", R: "#7a0f1c" },
  frames: [
    [
      "................",
      "................",
      "................",
      "...rr...........",
      "...rR...........",
      "................",
      ".......r........",
      ".......rr.......",
      "................",
      "...........rr...",
      "...........rR...",
      "................",
      "..............r.",
      "................",
      "................",
      "................",
    ],
  ],
};

/** Clue: drag marks and finger dots in the sand. */
export const dragMarks: PixelSprite = {
  palette: { ".": null, s: "#b8955a", d: "#7a5a30" },
  frames: [
    [
      "................",
      "................",
      "................",
      ".d.d.d.d.d......",
      "..ssssssssssss..",
      "................",
      "..ssssssssssss..",
      "................",
      "..ssssssssssss..",
      "................",
      ".d.d.d.d.d......",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
  ],
};

/** Clue: pink, see-through scales – like Fladder's wings. */
export const pinkScales: PixelSprite = {
  palette: { ".": null, p: "#ff8ade", P: "#c93aa6" },
  frames: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "....pp..........",
      "...pPPp....pp...",
      "....pp....pPPp..",
      "...........pp...",
      "................",
      "......pp........",
      ".....pPPp.......",
      "......pp........",
      "................",
      "................",
      "................",
    ],
  ],
};

/** Stina's knitting basket with green yarn. */
export const yarnBasket: PixelSprite = {
  palette: { ".": null, o: "#1a1024", k: "#c8c4d4", g: "#3fae4a", G: "#2a8a3a", b: "#b07a44", w: "#7a4f2a" },
  frames: [
    [
      "................",
      "................",
      "................",
      "................",
      "......k...k.....",
      ".......k.k......",
      "....ggg.ggg.....",
      "...gGggggGgg....",
      "..oooooooooooo..",
      "..obwbwbwbwbwo..",
      "..owbwbwbwbwbo..",
      "..obwbwbwbwbwo..",
      "...oooooooooo...",
      "................",
      "................",
      "................",
    ],
  ],
};

/** Item: the storeroom key. */
export const key: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#ffd66b" },
  frames: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "...ooo..........",
      "..oyyyoooooooo..",
      "..oy.yyyyyyyyyo.",
      "..oyyyoooyoyoo..",
      "...ooo...o.o....",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
  ],
};

/**
 * A toy car with rolling wheels: from the side (facing right, flipped for left),
 * from the front (driving down) and from behind (driving up).
 */
function toyCar(body: string, dark: string): PixelSprite {
  const side = ["..ooooo.....", ".orwwwro....", "orrwwwrroooo", "orrrrrrrrrry", "tRRRRRRRRRRo"];
  const front = ["...oooooo...", "..owwwwwwo..", ".orrrrrrrro.", "oyrrrrrrrryo", "oRRRRRRRRRRo"];
  const back = ["...oooooo...", "..owwwwwwo..", ".orrrrrrrro.", "otrrrrrrrrto", "oRRRRRRRRRRo"];
  const wheelsA = ["okkRRRRRRkko", ".oo......oo.", "............"];
  const wheelsB = ["okgRRRRRRgko", ".oo......oo.", "............"];
  return {
    palette: { ".": null, o: "#1a1024", r: body, R: dark, w: "#bfe3ff", k: "#1a1024", g: "#8a86a0", y: "#ffe27a", t: "#ff3b3b" },
    frames: [
      [...side, ".okgo...okgo", "..oo.....oo.", "............"],
      [...side, ".ogko...ogko", "..oo.....oo.", "............"],
      [...front, ...wheelsA],
      [...front, ...wheelsB],
      [...back, ...wheelsA],
      [...back, ...wheelsB],
    ],
    animations: {
      side: { frames: [0, 1], frameRate: 8 },
      down: { frames: [2, 3], frameRate: 8 },
      up: { frames: [4, 5], frameRate: 8 },
    },
  };
}

export const toyCarRed = toyCar("#e04848", "#a02a2a");
export const toyCarBlue = toyCar("#4a90e2", "#2d5f9e");

/** A jar of toy slime that has tipped over. */
export const slimeJar: PixelSprite = {
  palette: { ".": null, o: "#1a1024", g: "#cfe8ff", G: "#8ab0d0", s: "#5cd65c", S: "#2e8a3a" },
  frames: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "......ooooooo...",
      ".....ogggggggo..",
      "....ssgsGgggGo..",
      "..sssssssssggo..",
      ".sSssssssGgggo..",
      "..ssSsssooooo...",
      "...sss..........",
      "................",
      "................",
      "................",
    ],
  ],
};
