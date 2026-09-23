import type { PixelSprite } from "./pixelSprite";

// Case 6 – "Monsterfesten", the finale. Everything new that the festival needs.

const O = "#1a1024"; // outline, same as everywhere else
const E16 = "................";

// ---------- Skuggan ----------

const skugganTop = [
  E16,
  ".....oooooo.....",
  "....oddddDDo....",
  "...odddddddDo...",
  "..oddddddddddo..",
];
const skugganEyes = ["..odyyddddyydo..", "..odYyddddYydo..", "..odyyddddyydo.."];
const skugganHappyEyes = ["..oddyddddyddo..", "..odydyddydydo..", "..odbddddddbdo.."];
const skugganBody = ["..oddddddddddo..", "..oddddddddddo.."];

/**
 * Skuggan – a shadow with glowing eyes. Spooky, but mostly scared himself.
 * Frames 0–1: creeping (the wisps at the bottom move). Frame 2: happy, with a smile.
 */
export const skuggan: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    d: "#2b1f45", // shadow body
    D: "#4a3a70", // a little rim of light
    y: "#ffe27a", // glowing eyes
    Y: "#ffffff", // shine
    b: "#e06a9a", // blush
  },
  animations: { "": { frames: [0, 1], frameRate: 6 } },
  frames: [
    [
      ...skugganTop,
      ...skugganEyes,
      ".ooddddddddddoo.",
      "ododdddooddddodo",
      ".ooddddddddddoo.",
      ...skugganBody,
      "..odo.oddo.odo..",
      "...o...oo...o...",
      E16,
    ],
    [
      ...skugganTop,
      ...skugganEyes,
      ".ooddddddddddoo.",
      "ododdddooddddodo",
      ".ooddddddddddoo.",
      ...skugganBody,
      "..oddo.oo.oddo..",
      "...oo......oo...",
      E16,
    ],
    [
      ...skugganTop,
      ...skugganHappyEyes,
      ".ooddddddddddoo.",
      "ododddoddodddodo",
      ".ooddddooddddoo.",
      ...skugganBody,
      "..odo.oddo.odo..",
      "...o...oo...o...",
      E16,
    ],
  ],
};

// ---------- The Moonstone ----------

/** The whole Moonstone, put together again – round, glowing and cold blue. */
export const moonStone: PixelSprite = {
  palette: { ".": null, o: "#3a6a8a", w: "#ffffff", c: "#b8f0ff", C: "#7ac8e8" },
  frames: [
    [
      "............w...",
      ".....oooooo.....",
      "...oowwcccCoo...",
      "..owwccccCCCco..",
      "..owcccCCCcCco..",
      ".owcccCCcccCCco.",
      ".owccCCccccCCco.",
      ".occcCcccwccCco.",
      ".occCCcccwcCCco.",
      ".occCccccccCcco.",
      "..occcCCcccCco..",
      "..oCcccCCcccCo..",
      "...ooCcccCcoo...",
      ".....oooooo.....",
      "..w.............",
      E16,
    ],
  ],
};

/** The Moonstone on the fountain – dull, with a dark hole where the last piece should be. */
export const festMoonStand: PixelSprite = {
  palette: { ".": null, o: "#3a6a8a", k: O, w: "#cfe8f0", c: "#8ab8cc", C: "#5a8aa8" },
  frames: [
    [
      E16,
      E16,
      ".....oooooo.....",
      "...oowwcccCoo...",
      "..owwccocCCCco..",
      "..owccookCCCco..",
      ".owccokkkkoCCco.",
      ".owcokkkkkkoCco.",
      ".occokkkkkkoCco.",
      ".occCokkkkoCcco.",
      "..occcookooCco..",
      "..oCcccCocccCo..",
      "...ooCcccCcoo...",
      ".....oooooo.....",
      E16,
      E16,
    ],
  ],
};

// ---------- Festival things ----------

const lanternTop = ["......oooo......", ".....oMMMMo.....", "....oMmmmmMo....", "....oooooooo...."];
const lanternPole = [
  "....oooooooo....",
  ".....ommmmo.....",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  "......oppo......",
  ".....oppppo.....",
  "....oppppppo....",
  "....oooooooo....",
];
const lanternPalette = {
  ".": null,
  o: O,
  m: "#3d3d50", // metal
  M: "#6a6a80", // metal, light
  p: "#4a4460", // pole
  g: "#2a2438", // dark glass
  G: "#4a4460",
  y: "#ffd66b", // candle light
  Y: "#fff2b0",
  h: "#ffe9a0", // glow
};

/** A festival lantern on a pole – empty and dark. */
export const festLantern: PixelSprite = {
  palette: lanternPalette,
  frames: [
    [
      ...lanternTop,
      "....omggggmo....",
      "....omgGggmo....",
      "....omgGggmo....",
      "....omggggmo....",
      "....omggggmo....",
      ...lanternPole,
    ],
  ],
};

/** The same lantern with a candle burning inside. */
export const festLanternLit: PixelSprite = {
  palette: lanternPalette,
  frames: [
    [
      ...lanternTop,
      "..h.omyyyymo.h..",
      "....omyYYymo....",
      ".h..omyYYymo..h.",
      "....omyyyymo....",
      "..h.omyyyymo.h..",
      ...lanternPole,
    ],
  ],
};

/** Bläddra's little shadow theatre: red curtains, a white screen and a shadow rabbit. */
export const skuggTheatre: PixelSprite = {
  palette: { ".": null, o: O, r: "#c0182c", R: "#8a1020", w: "#fff6e0", k: "#2a1a2e", y: "#ffd66b", b: "#7a4f2a" },
  frames: [
    [
      E16,
      ".oooooooooooooo.",
      ".oRrRrRrRrRrRro.",
      ".orrwwwwwwwwrro.",
      ".orwwwkwkwwwwro.",
      ".orwwwkwkwwwwro.",
      ".orwwkkkkwwwwro.",
      ".orwwkkkkkwwwro.",
      ".orwwwkkkwwwwro.",
      ".orwwwwwwwwwwro.",
      ".orrwwwwwwwwrro.",
      ".oooooooooooooo.",
      ".obbbbbbbbbbbbo.",
      ".ob.........ybo.",
      ".ob..........bo.",
      ".oo..........oo.",
    ],
  ],
};

/** Grymlan at the party – both arms on, and a party hat. */
export const festGrymlan: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    p: "#9b4ac8", // hair
    s: "#d8e8c8", // pale skin
    k: O,
    w: "#ffffff",
    g: "#6cc24a", // jumper
    b: "#7a4526", // trousers
    B: "#4a2a18", // shoes
    y: "#ffd66b", // pompom
    r: "#e04848", // hat
    R: "#ffffff", // hat stripe
  },
  frames: [
    [
      "..p.p..y..p.p...",
      "..ppp.rRr.ppp...",
      "..oppppppppppo..",
      "..oppssssssppo..",
      "..opsksssskspo..",
      "..opsssssssspo..",
      "..opswkwwkwspo..",
      "...opssssssspo..",
      "...ogggggggggo..",
      "..oggggggggggo..",
      ".oggggggggggggo.",
      ".ogoggggggggogo.",
      ".sgoggggggggogs.",
      ".s.obbbbbbbbo.s.",
      "...obbbbbbbbo...",
      "...obbo..obbo...",
      "...obbo..obbo...",
      "...obbo..obbo...",
      "..oBBBo..oBBBo..",
      "..ooooo..ooooo..",
    ],
  ],
};

/** Skuggan's very own night-light: a little lamp with a moon on it. */
export const skuggNightLight: PixelSprite = {
  palette: { ".": null, o: O, y: "#ffd66b", Y: "#fff2b0", h: "#ffe9a0", c: "#b8f0ff", b: "#9b6bd6", B: "#6a45a8" },
  frames: [
    [
      E16,
      "..h.........h...",
      ".....oooooo.....",
      "....oYYYyyyo....",
      "...oYYcYyyyyo...",
      "h..oYccyyyyyo..h",
      "...oYcYyyyyyo...",
      "...oyYyyyyyyo...",
      "....oyyyyyyo....",
      "....oooooooo....",
      "......obbo......",
      "......obbo......",
      "....obbbbbBo....",
      "...obbbbbbbBo...",
      "...oooooooooo...",
      E16,
    ],
  ],
};

// ---------- Monsters ----------

/** Lysa Lyktmal – a big fluffy moth who loves anything that shines. Frames: wings up, wings down. */
export const lysaMoth: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    f: "#efe6cf", // fur
    F: "#c9b891", // fur, shade
    w: "#b8a0c8", // wing
    W: "#8a74a0", // wing edge
    s: "#ffd66b", // eye spot on the wing
    k: O, // eyes
    a: "#8a74a0", // antennae
  },
  frameRate: 8,
  frames: [
    [
      "...a........a...",
      "....a......a....",
      "Wo...offffo...oW",
      "WwWo.offffo.oWwW",
      "WwswoFkffkFowswW",
      "WwwwofkffkfowwwW",
      ".WwwoffffffowwW.",
      "..WwoFffffFowW..",
      "...WoFFffFFoW...",
      ".....oFFFFo.....",
      "......oFFo......",
      ".......oo.......",
    ],
    [
      "...a........a...",
      "....a......a....",
      ".....offffo.....",
      "....offffffo....",
      "...ooFkffkFoo...",
      "WWwwofkffkfowwWW",
      "WwswoffffffowswW",
      "WwwwoFffffFowwwW",
      ".WWWoFFffFFoWWW.",
      "..W..oFFFFo..W..",
      "......oFFo......",
      ".......oo.......",
    ],
  ],
};

/** A skuggkryp – a little creature made of darkness. Faces right. Frames 0–1: walking. */
export const skuggkryp: PixelSprite = {
  palette: { ".": null, o: O, d: "#241a38", y: "#ffe27a", w: "#ffffff" },
  frameRate: 8,
  frames: [
    [
      E16,
      E16,
      E16,
      ".....oooooo.....",
      "...oodddddddo...",
      "..oddddddyddyo..",
      ".odddddddyddydo.",
      ".oddddddddddddo.",
      ".oddddddddwdwdo.",
      "..oddddddddddo..",
      "...o.o...o.o....",
      "..o...o.o...o...",
    ],
    [
      E16,
      E16,
      E16,
      ".....oooooo.....",
      "...oodddddddo...",
      "..oddddddyddyo..",
      ".odddddddyddydo.",
      ".oddddddddddddo.",
      ".oddddddddwdwdo.",
      "..oddddddddddo..",
      "....o.o...o.o...",
      "....o.o...o.o...",
    ],
  ],
};

// ---------- The cave ----------

/** Skuggan's little bed of moss – with the candles from the lanterns standing in a ring around it. */
export const skuggBed: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    g: "#4ea84a", // moss
    G: "#2f7a36",
    b: "#6a45a8", // blanket
    B: "#9b6bd6",
    c: "#f4ecd8", // candle
    y: "#ffd66b", // flame
  },
  frames: [
    [
      "..y....y....y...",
      "..c....c....c...",
      E16,
      "y..oooooooooo..y",
      "c.oggggggggggo.c",
      "..ogGbbbbbbGgo..",
      "..ogbBBBBBBbgo..",
      "y.ogbBBBBBBbgo.y",
      "c.ogbbbbbbbbgo.c",
      "..oggGggggGggo..",
      "...oooooooooo...",
      "y..............y",
      "c..y....y....y.c",
      "...c....c....c..",
      E16,
      E16,
    ],
  ],
};

/** A child's drawing: one half pitch black with two eyes and a tear – the other half a glowing stone and a smile. */
export const skuggDrawing: PixelSprite = {
  palette: { ".": null, o: O, p: "#f4ecd8", k: "#1a1024", y: "#ffd66b", c: "#7ac8e8", s: "#b8f0ff", t: "#c9a06a" },
  frames: [
    [
      "..t..........t..",
      ".oooooooooooooo.",
      ".okkkkkkpppsspo.",
      ".okkkkkkppscsco.",
      ".okkkkkkpppsspo.",
      ".okykykkppppppo.",
      ".okckkkkppppppo.",
      ".okckkkkppkkppo.",
      ".okkkkkkpkyykpo.",
      ".okkkkkkpkkkkpo.",
      ".okkkkkkpkyykpo.",
      ".okkkkkkppkkppo.",
      ".oooooooooooooo.",
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: a round, glittering hollow in the moss – something big and glowing lay here. */
export const skuggNest: PixelSprite = {
  palette: { ".": null, G: "#2f7a36", g: "#4ea84a", d: "#1f3a24", w: "#b8f0ff", W: "#ffffff" },
  frames: [
    [
      E16,
      E16,
      E16,
      ".....gggggg.....",
      "...ggGGGGGGgg...",
      "..gGGddddddGGg..",
      "..gGddwdddddGg..",
      ".gGddddddWddGGg.",
      ".gGdddWdddddGGg.",
      "..gGddddddwdGg..",
      "..gGGddddddGGg..",
      "...ggGGGGGGgg...",
      ".....gggggg.....",
      E16,
      E16,
      E16,
    ],
  ],
};

// ---------- Clues ----------

/** Clue: small black smudges like footprints of ink – no toes. */
export const festInkPrints: PixelSprite = {
  palette: { ".": null, k: "#0d0718", K: "#2a1d40" },
  frames: [
    [
      E16,
      "..kk............",
      ".kKkk...........",
      ".kkk............",
      "......kk........",
      ".....kKkk.......",
      ".....kkk........",
      E16,
      "..........kk....",
      ".........kKkk...",
      ".........kkk....",
      E16,
      ".............kk.",
      "............kKkk",
      "............kkk.",
      E16,
    ],
  ],
};

/** Clue: a tuft of blue fluff. */
export const festFluff: PixelSprite = {
  palette: { ".": null, b: "#4aa3ff", B: "#2d6fb8", w: "#bfe3ff" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      E16,
      "......b.b.......",
      "....b.bwbb.b....",
      ".....bbwbbbb....",
      "...bbbbbBbbb.b..",
      "....bBbbbbBbb...",
      "...b.bbBbbb.....",
      "......b..b......",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: a small brass cog. */
export const festCog: PixelSprite = {
  palette: { ".": null, o: O, y: "#d9a441", Y: "#a8762a", l: "#fff0b0" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      "......o.o.......",
      "....o.oyo.o.....",
      "...oyoylyyoyo...",
      "....oyyooyyo....",
      "...oyyo..oyYo...",
      "....oyyooyYo....",
      "...oyoyYYoYo....",
      "....o.oYo.o.....",
      "......o.o.......",
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: grey, glittering dust – like from a moth's wings. */
export const festMothDust: PixelSprite = {
  palette: { ".": null, g: "#c9c0d8", w: "#ffffff", l: "#b8a0c8" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      ".....g..........",
      "..g.....l...w...",
      "......gg....g...",
      "...l.gwgg.......",
      "......gg...l..g.",
      "..w.......g.....",
      ".....l..gwg.....",
      "..........g..l..",
      "....g...........",
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: drops of candle wax in a row. */
export const festWax: PixelSprite = {
  palette: { ".": null, c: "#f4ecd8", C: "#c9bfa8" },
  frames: [
    [
      E16,
      E16,
      E16,
      "..cc............",
      "..cC............",
      E16,
      "......cc........",
      "......cC........",
      E16,
      "..........cc....",
      "..........cC....",
      E16,
      "..............c.",
      E16,
      E16,
      E16,
    ],
  ],
};

/** A note stuck in a bush, written in mirror writing, with a black smudge. */
export const festNote: PixelSprite = {
  palette: { ".": null, o: O, p: "#f4ecd8", t: "#6a5a7a", k: "#0d0718", g: "#2f7a36", G: "#4ea84a" },
  frames: [
    [
      E16,
      E16,
      "....oooooooo....",
      "....oppppppo....",
      "....opttttpo....",
      "....oppppppo....",
      "....optttppo....",
      "....oppppppo....",
      "....opttkkpo....",
      "....opppkkpo....",
      "..GGoooooooGG...",
      ".GgGGgGGgGGgGG..",
      "GgGgGGgGGgGgGgG.",
      ".GgGgGGgGgGGgG..",
      "..GGgGGgGGgGG...",
      E16,
    ],
  ],
};

// ---------- Light and shadow (Bläddra's question) ----------

const shadowFigure = [
  E16,
  E16,
  E16,
  E16,
  "......oooo......",
  ".....ommmmo.....",
  ".....owmmwo.....",
  ".....ommmmo.....",
  ".....ommmmo.....",
  ".....oommoo.....",
  "......o..o......",
];
const shadowPalette = { ".": null, o: O, m: "#9b6bd6", w: "#ffffff", g: "#c9b48a", G: "#a8926a", k: "#2a2030" };
const shadowPicture = (ground: [string, string, string]): PixelSprite => ({
  palette: shadowPalette,
  frames: [[...shadowFigure, ...ground, E16, E16]],
});

/** A little monster with its shadow to the right (the light comes from the left). */
export const festShadowRight = shadowPicture(["gggggggggkkkkkkk", "GGGGGGGGGGkkkkkk", "GGGGGGGGGGGGGGGG"]);
/** …with its shadow to the left (the light comes from the right). */
export const festShadowLeft = shadowPicture(["kkkkkkkggggggggg", "kkkkkkGGGGGGGGGG", "GGGGGGGGGGGGGGGG"]);
/** …with a small shadow right underneath (the light comes from straight above). */
export const festShadowShort = shadowPicture(["ggggkkkkkkkkgggg", "GGGGGkkkkkkGGGGG", "GGGGGGGGGGGGGGGG"]);
/** …and no shadow at all (no light). */
export const festShadowNone = shadowPicture(["gggggggggggggggg", "GGGGGGGGGGGGGGGG", "GGGGGGGGGGGGGGGG"]);

export const case6Sprites: Record<string, PixelSprite> = {
  skuggan,
  moonStone,
  festMoonStand,
  festLantern,
  festLanternLit,
  skuggTheatre,
  festGrymlan,
  skuggNightLight,
  lysaMoth,
  skuggkryp,
  skuggBed,
  skuggDrawing,
  skuggNest,
  festInkPrints,
  festFluff,
  festCog,
  festMothDust,
  festWax,
  festNote,
  festShadowRight,
  festShadowLeft,
  festShadowShort,
  festShadowNone,
};
