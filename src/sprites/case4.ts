import type { PixelSprite } from "./pixelSprite";

// Case 4 – "Ljuden i skogen". Everything new that the forest case needs.

const O = "#1a1024"; // outline, same as everywhere else
const E16 = "................";

/**
 * Trattis – the architect's own monster (assets/bilder/teckningar/trattis.jpg):
 * a tall pointy funnel hat like a golden chanterelle, long stringy hair, big round
 * eyes, a small smile, a long skirt and round shoes.
 */
export const trattis: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    y: "#f5b82e", // chanterelle gold
    Y: "#d98a1c", // hat shadow
    g: "#b8661a", // gills under the hat
    h: "#7a4a22", // stringy hair
    s: "#f3e3c3", // pale skin
    w: "#ffffff", // eyes
    m: "#3a1020", // mouth
    t: "#e8a83a", // blouse
    d: "#d0701e", // long skirt
    D: "#9a4a14", // skirt, dark
    f: "#4a2a18", // shoes
  },
  frames: [
    [
      "........o.......",
      ".......oyo......",
      ".......oyYo.....",
      "......oyyYo.....",
      "......oyyyYo....",
      ".....oyyyyYo....",
      "....oyyyyyyYo...",
      "...oyyyyyyyyYo..",
      ".ooyyyyyyyyyyyYo",
      "oggYgYgYgYgYgggo",
      ".ohssssssssssho.",
      ".ohswwsssswwsho.",
      ".ohswosssswosho.",
      ".ohssssssssssho.",
      ".ohssmssssmssho.",
      ".ohossmmmmssoho.",
      ".hhhottttttohhh.",
      ".h.otttttttto.h.",
      "...otttttttto...",
      "..osoddddddoso..",
      "...odddddddDo...",
      "..oddddddddDDo..",
      ".oDDDDDDDDDDDDo.",
      "...offo..offo...",
    ],
  ],
};

/** Mossjätten – a huge giant made of moss. Frame 0: asleep. Frame 1: awake, with glowing eyes. */
export const mossjatte: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    g: "#3f7a2e", // moss
    G: "#2a5620", // dark moss
    l: "#7ab84a", // light moss
    e: "#ffe27a", // glowing eyes
    m: "#2a0f18", // mouth
    w: "#ffffff", // teeth
    b: "#6a4a2a", // bark feet
    r: "#d04040", // a tiny red mushroom growing on it
  },
  frames: [
    [
      "........................",
      "........................",
      "........................",
      "..........oooo..........",
      "........oolglgoo........",
      ".......olggggggGo.......",
      "......olgggrggggGo......",
      ".....olggggggggGGo......",
      ".....oggooggggoogGo.....",
      "....olggggggggggggGo....",
      "....oggggggmmggggGGo....",
      "...olgggggggggggggGGo...",
      "..olggGgggggggggggGgGo..",
      "..oggGggggglggggggGggo..",
      ".olggGgggggggggggggGggo.",
      ".oggGGggglgggggglgggGgo.",
      ".olgGggggggggggggggggGo.",
      ".oggGgggggrgggggggggGGo.",
      ".oGggggggggggggggggggGo.",
      ".oGGggggggggggggggggGGo.",
      "..oGGGggggggggggggGGGo..",
      "..obbbGGGGGGGGGGGGbbbo..",
      "..oooooooooooooooooooo..",
      "........................",
    ],
    [
      "........................",
      ".........oooooo.........",
      ".......oolglgloo........",
      "......olggggggrgGo......",
      ".....olggggggggggGo.....",
      ".....oggeeggggeegGo.....",
      ".....oggeeggggeegGo.....",
      ".....oggggggggggGGo.....",
      ".....oggommmmmmogGo.....",
      ".....oggwmwmmwmwgGo.....",
      "....olgggggggggggGGo....",
      ".oolooggggggggggggooGoo.",
      "olgggGggggggggggggGggGgo",
      "oGo.oggggglgggggggGo.oGo",
      "....oggggggggggggggGo...",
      "....olgggggrggggggGo....",
      "....oggGgggggggggGgo....",
      "....oGggggglgggggGGo....",
      "....oGGggggggggggGGo....",
      ".....oGGGGGGGGGGGGo.....",
      ".....obbbo....obbbo.....",
      ".....obbbo....obbbo.....",
      "....obbbbo....obbbbo....",
      "....oooooo....oooooo....",
    ],
  ],
};

/** Mossungen – the giant's little one, teary-eyed. */
export const mossunge: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    g: "#4a8a36",
    G: "#2f6224",
    l: "#8cc85a",
    w: "#ffffff",
    k: O,
    c: "#7ad8ff", // tears
    m: "#2a0f18",
    b: "#6a4a2a",
  },
  frames: [
    [
      E16,
      E16,
      "......oooo......",
      ".....olglgo.....",
      "....olggggGo....",
      "...olggggggGo...",
      "...ogwwggwwgGo..",
      "...ogwkggwkgGo..",
      "...ogcggggcgGo..",
      "...oggggmggggo..",
      "..olgggggggggGo.",
      "..oggGggggggGgo.",
      "..oGgggggggggGo.",
      "...oGGGGGGGGGo..",
      "...obbo...obbo..",
      "...ooo.....ooo..",
    ],
  ],
};

/** A soft mound of moss in the mushroom ring. (Someone small hides underneath…) */
export const mossMound: PixelSprite = {
  palette: { ".": null, o: O, g: "#4a8a36", G: "#2f6224", l: "#8cc85a", w: "#f4f0e0" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      E16,
      E16,
      "......oooo......",
      "....oolglgoo....",
      "...olgggggggo...",
      "..olggglggggGo..",
      ".olgggggggwgGGo.",
      ".oggGggggggggGo.",
      "oggGgggglggggGGo",
      "oGGgggggggggGGGo",
      "oooooooooooooooo",
      E16,
    ],
  ],
};

/** Haren Hilma, who wrote to the detective agency. */
export const hareHilma: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    f: "#b89a74", // fur
    F: "#8a6e4e", // fur, dark
    w: "#f4ece0", // belly
    p: "#f0a0b0", // inside the ears
    e: O,
    n: "#e06a7a", // nose
  },
  frames: [
    [
      "....oo....oo....",
      "...ofpo..opfo...",
      "...ofpo..opfo...",
      "...ofpo..opfo...",
      "...ofpo..opfo...",
      "....ofo..ofo....",
      "....offoooffo...",
      "...offffffffo...",
      "..offeffffeffo..",
      "..offffnnffffo..",
      "..offfwwwwfffo..",
      "...offffffffo...",
      "..offwwwwwwffo..",
      ".ofoFwwwwwwFofo.",
      ".ofoFwwwwwwFofo.",
      "..ooFwwwwwwFoo..",
      "...oFFwwwwFFo...",
      "...offFFFFffo...",
      "..offfo..offfo..",
      "..ooooo..ooooo..",
    ],
  ],
};

/** Bävern Bruno, who measures everything with his paws. */
export const beaverBruno: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    b: "#8a5a30",
    B: "#5e3a1c",
    t: "#4a3a4a", // flat tail
    w: "#fff4d0", // big front teeth
    e: O,
    n: "#2a1a1a",
  },
  frames: [
    [
      E16,
      "....oo....oo....",
      "...oboooooobo...",
      "...obbbbbbbbo...",
      "..obbebbbbebbo..",
      "..obbbbnnbbbbo..",
      "..obbbbwwbbbbo..",
      "...obbbwwbbbo...",
      "..obbbbbbbbbbo..",
      ".obbBbbbbbbBbbo.",
      ".obbBbbbbbbBbbo.",
      "..obbbbbbbbbbo..",
      "..obbbbbbbbbbooo",
      "..oBBo..oBBottto",
      "..ooo....ooottto",
      "............oooo",
    ],
  ],
};

const wolfTop = [
  "..............o..o..",
  ".............ogoogo.",
  ".............oggggo.",
  "oo...........ogeggGo",
  "ogo..........oggggGk",
  ".ogoooooooooooogwwo.",
  "..ogggggggggggGgwwo.",
  "..ogGgggggggggGgggo.",
  "..oggggggggggggggo..",
  "..owwwwwwwwwwwwwo...",
];

/** The wolf that walks back and forth by the forest path. Faces right. */
export const forestWolf: PixelSprite = {
  palette: { ".": null, o: O, g: "#8a8a9a", G: "#5a5a6a", w: "#d0d0dc", e: "#ffe27a", k: O },
  frameRate: 6,
  frames: [
    [...wolfTop, "..oGgo.....oGgo.....", "..oGgo.....oGgo.....", "..oGgo.....oGgo.....", "..ooo......ooo......"],
    [...wolfTop, ".oGgo.......oGgo....", ".oGo.........oGo....", "oGo...........oGo...", "oo.............oo..."],
  ],
};

/** A swarm of fireflies that swoops at Nora around the mushroom ring. */
export const forestFireflies: PixelSprite = {
  palette: { ".": null, y: "#d8ff6a", Y: "#ffffff" },
  frameRate: 5,
  frames: [
    [
      E16,
      "...y............",
      "..yYy.......y...",
      "...y.......yYy..",
      "............y...",
      ".......y........",
      "......yYy.......",
      ".......y........",
      "..y.............",
      ".yYy.......y....",
      "..y.......yYy...",
      "...........y....",
      "....y...........",
      "...yYy....y.....",
      "....y....yYy....",
      "..........y.....",
    ],
    [
      E16,
      ".........y......",
      "........yYy.....",
      "..y......y......",
      ".yYy............",
      "..y.........y...",
      "...........yYy..",
      "......y.....y...",
      ".....yYy........",
      "......y.........",
      "..y.............",
      ".yYy.......y....",
      "..y.......yYy...",
      "...........y....",
      ".....y..........",
      "....yYy.........",
    ],
  ],
};

/** The forest warden's board about animal tracks. */
export const trackBoard: PixelSprite = {
  palette: { ".": null, o: O, w: "#7a4f2a", p: "#f4ecd8", k: "#3a2a1a", W: "#5a3a1e" },
  frames: [
    [
      E16,
      ".oooooooooooooo.",
      ".owwwwwwwwwwwwo.",
      ".owppppppppppwo.",
      ".owpkpkpppkppwo.",
      ".owpkkkppkkkpwo.",
      ".owppppppppppwo.",
      ".owpkpkpppkpkwo.",
      ".owppkppppkkpwo.",
      ".owppppppppppwo.",
      ".owwwwwwwwwwwwo.",
      ".oooooooooooooo.",
      "...oWo....oWo...",
      "...oWo....oWo...",
      "..ooooo..ooooo..",
      E16,
    ],
  ],
};

/** A little empty bed of moss next to the sleeping giant. */
export const mossNest: PixelSprite = {
  palette: { ".": null, o: O, g: "#4a8a36", G: "#2f6224", l: "#8cc85a", d: "#1f3a18" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      E16,
      E16,
      "....oooooooo....",
      "..oolgllglgloo..",
      ".olggGGGGGGgglo.",
      ".oggGddddddGggo.",
      ".olgGddddddGglo.",
      "..ogggGGGGgggo..",
      "...oooooooooo...",
      E16,
      E16,
      E16,
    ],
  ],
};

/** Trattis' basket of lingonberries – it drips red. */
export const lingonBasket: PixelSprite = {
  palette: { ".": null, o: O, r: "#c0182c", R: "#ff5a6a", b: "#c89a50", B: "#8a6430" },
  frames: [
    [
      E16,
      E16,
      ".....oooooo.....",
      "....o......o....",
      "...o........o...",
      "..orrRrrrRrrro..",
      ".orRrrrRrrRrrro.",
      ".obbbbbbbbbbbbo.",
      ".obBbBbBbBbBbbo.",
      "..obBbBbBbBbbo..",
      "..obbbbbbbbbbo..",
      "...oooooooooo...",
      "....r...........",
      E16,
      "...r............",
      E16,
    ],
  ],
};

/** A stone with a compass carved into it (N at the top). */
export const compassStone: PixelSprite = {
  palette: { ".": null, o: O, g: "#9a9aa8", G: "#6a6a78", w: "#f4f0e0", d: "#4a4a58" },
  frames: [
    [
      E16,
      E16,
      ".....oooooo.....",
      "...ooggwggggoo..",
      "..ogggwwwggggo..",
      ".oggggdwdggggGo.",
      ".oggwwwwwwwggGo.",
      ".oggggdwdggggGo.",
      ".ogggggwgggggGo.",
      ".oGgggggggggGGo.",
      "..oGGgggggGGGo..",
      "..oooooooooooo..",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** A golden funnel chanterelle – the mushroom ring is made of them. */
export const ringMushroom: PixelSprite = {
  palette: { ".": null, o: O, y: "#f5b82e", Y: "#d98a1c", g: "#b8661a" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      "..oo.oooooo.oo..",
      ".oyyoyyyyyyoyyo.",
      ".oYyyyyyyyyyyYo.",
      "..oYyyyyyyyyYo..",
      "...oggYyyYggo...",
      "....ogYyyYgo....",
      ".....oyyyyo.....",
      ".....oyyyyo.....",
      "......oyyo......",
      "......oyyo......",
      ".....oooooo.....",
      E16,
    ],
  ],
};

// ---------- Clues ----------

/** Clue: a huge footprint with moss between the toes. */
export const giantFootprint: PixelSprite = {
  palette: { ".": null, d: "#3a2a1a", g: "#4a8a36", l: "#8cc85a" },
  frames: [
    [
      E16,
      "...gg.gg.gg.....",
      "..gddgddgddg....",
      "..gddgddgddg....",
      "...gg.gg.gg.....",
      "..gddddddddg....",
      ".gddddddddddg...",
      ".gdddlddddddg...",
      ".gddddddddldg...",
      ".gddddddddddg...",
      ".gdddldddddg....",
      "..gddddddddg....",
      "..gddddddddg....",
      "...gddddddg.....",
      "....gggggg......",
      E16,
    ],
  ],
};

/** Clue: tiny mossy footprints – the same shape as the giant's. */
export const mossungeFootprints: PixelSprite = {
  palette: { ".": null, d: "#3a2a1a", g: "#4a8a36", l: "#8cc85a" },
  frames: [
    [
      E16,
      "..........g.g.g.",
      "..........gdddg.",
      "..........gdldg.",
      "...........ggg..",
      E16,
      "......g.g.g.....",
      "......gdddg.....",
      "......gdldg.....",
      ".......ggg......",
      E16,
      "..g.g.g.........",
      "..gdddg.........",
      "..gdldg.........",
      "...ggg..........",
      E16,
    ],
  ],
};

/** Clue: big footprints going round and round. */
export const giantCirclePrints: PixelSprite = {
  palette: { ".": null, d: "#3a2a1a", g: "#4a8a36" },
  frames: [
    [
      E16,
      "......dd.dd.....",
      "....dg.....gd...",
      "...d.........d..",
      "..dg.........gd.",
      "..d...........d.",
      E16,
      ".dg...........gd",
      ".dd...........dd",
      E16,
      "..d...........d.",
      "..dg.........gd.",
      "...d.........d..",
      "....dg.....gd...",
      "......dd.dd.....",
      E16,
    ],
  ],
};

/** Clue: a tuft of grey fur on a twig. */
export const wolfFur: PixelSprite = {
  palette: { ".": null, g: "#a8a8b8", G: "#6a6a7a", b: "#6a4a2a" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      E16,
      "......g.g.......",
      ".....gGgGg......",
      "....gGgggGg.....",
      "...bbbbbbbbbbb..",
      "....gGgGgg......",
      ".....g.g.g......",
      E16,
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: small wet tears on a stone, glittering blue. */
export const mossTears: PixelSprite = {
  palette: { ".": null, c: "#7ad8ff", C: "#3a8ac8", w: "#ffffff" },
  frames: [
    [
      E16,
      E16,
      "....c...........",
      "...cCc..........",
      "...cCc.....c....",
      "....c.....cCc...",
      "..........cCc...",
      "......w....c....",
      ".....c..........",
      "....cCc.........",
      "....cCc...w.....",
      ".....c..........",
      E16,
      "..w......c......",
      ".........c......",
      E16,
    ],
  ],
};

/** Clue: cold blue glitter in the moss. */
export const forestGlowDust: PixelSprite = {
  palette: { ".": null, c: "#7ad8ff", w: "#ffffff", g: "#4a8a36" },
  frames: [
    [
      E16,
      "..w.......c.....",
      ".wcw.....cwc....",
      "..w.......c.....",
      "......c.........",
      ".....cwc....w...",
      "......c....wcw..",
      "............w...",
      "...c............",
      "..cwc.....c.....",
      "...c.....cwc....",
      "..........c.....",
      "....g.gg.g..gg..",
      "...gggggggggggg.",
      E16,
      E16,
    ],
  ],
};

// ---------- Animal tracks (the track puzzle) ----------

const TRACK = { ".": null, d: "#3a2a1a", k: O };

export const forestTrackHare: PixelSprite = {
  palette: TRACK,
  frames: [
    [
      E16,
      "...dd......dd...",
      "..dddd....dddd..",
      "..dddd....dddd..",
      "..dddd....dddd..",
      "..dddd....dddd..",
      "...dd......dd...",
      E16,
      ".......dd.......",
      "......dddd......",
      ".......dd.......",
      E16,
      ".......dd.......",
      "......dddd......",
      ".......dd.......",
      E16,
    ],
  ],
};

export const forestTrackFox: PixelSprite = {
  palette: TRACK,
  frames: [
    [
      E16,
      E16,
      "......dd.dd.....",
      "......dd.dd.....",
      "...dd.......dd..",
      "...dd.......dd..",
      E16,
      ".....ddddddd....",
      "....ddddddddd...",
      "....ddddddddd...",
      ".....ddddddd....",
      "......ddddd.....",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

export const forestTrackMoose: PixelSprite = {
  palette: TRACK,
  frames: [
    [
      E16,
      E16,
      "......d..d......",
      ".....dd..dd.....",
      ".....dd..dd.....",
      "....ddd..ddd....",
      "....ddd..ddd....",
      "....ddd..ddd....",
      "....ddd..ddd....",
      "....ddd..ddd....",
      ".....dd..dd.....",
      E16,
      "...d........d...",
      "...d........d...",
      E16,
      E16,
    ],
  ],
};

export const forestTrackBird: PixelSprite = {
  palette: TRACK,
  frames: [
    [
      E16,
      E16,
      "...d...d...d....",
      "....d..d..d.....",
      ".....d.d.d......",
      "......ddd.......",
      ".......d........",
      ".......d........",
      ".......d........",
      ".......d........",
      ".......d........",
      E16,
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

export const forestTrackBear: PixelSprite = {
  palette: TRACK,
  frames: [
    [
      E16,
      E16,
      ".k..k..k..k..k..",
      ".dd.dd.dd.dd.dd.",
      ".dd.dd.dd.dd.dd.",
      E16,
      ".ddddddddddddd..",
      ".dddddddddddddd.",
      ".dddddddddddddd.",
      "..ddddddddddddd.",
      "..dddddddddddd..",
      "...dddddddddd...",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

// ---------- Compass directions (the way-home puzzle) ----------

/** A compass ring with a red arrow pointing north. */
const compassNorth = [
  "......cccc......",
  "....cc.rr.cc....",
  "...c..rrrr..c...",
  "..c..rrrrrr..c..",
  ".c..rrrrrrrr..c.",
  ".c.....rr.....c.",
  "c......rr......c",
  "c......oo......c",
  "c......oo......c",
  "c..............c",
  ".c............c.",
  ".c............c.",
  "..c..........c..",
  "...c........c...",
  "....cc....cc....",
  "......cccc......",
];

/** Turns a square frame a quarter turn clockwise. */
const turn = (frame: string[]): string[] => frame.map((_, r) => frame.map((row) => row[r]).reverse().join(""));

const COMPASS = { ".": null, c: "#8a8aa0", r: "#d8303a", o: O };

export const forestCompassN: PixelSprite = { palette: COMPASS, frames: [compassNorth] };
export const forestCompassE: PixelSprite = { palette: COMPASS, frames: [turn(compassNorth)] };
export const forestCompassS: PixelSprite = { palette: COMPASS, frames: [turn(turn(compassNorth))] };
export const forestCompassW: PixelSprite = { palette: COMPASS, frames: [turn(turn(turn(compassNorth)))] };

// ---------- Seasons (one of Trattis' questions) ----------

export const forestSeasonWinter: PixelSprite = {
  palette: { ".": null, b: "#6ab0e8", w: "#ffffff" },
  frames: [
    [
      E16,
      ".......b........",
      "......bbb.......",
      "..b....b....b...",
      "...b...b...b....",
      "....b..b..b.....",
      ".....b.b.b......",
      ".bbbbbbwbbbbbbb.",
      ".....b.b.b......",
      "....b..b..b.....",
      "...b...b...b....",
      "..b....b....b...",
      "......bbb.......",
      ".......b........",
      E16,
      E16,
    ],
  ],
};

export const forestSeasonSpring: PixelSprite = {
  palette: { ".": null, p: "#ff9ad0", P: "#e05aa0", y: "#ffd84a", Y: "#f0a020", g: "#4a8a36" },
  frames: [
    [
      E16,
      E16,
      "......pppp......",
      ".....pPPPPp.....",
      "..ppp.pPPp.ppp..",
      ".pPPPp.yy.pPPPp.",
      ".pPPPpyYYypPPPp.",
      ".pPPPpyYYypPPPp.",
      ".pPPPp.yy.pPPPp.",
      "..ppp.pPPp.ppp..",
      ".....pPPPPp.....",
      "......pppp......",
      ".......gg.......",
      "......ggg.......",
      ".......gg.......",
      E16,
    ],
  ],
};

export const forestSeasonAutumn: PixelSprite = {
  palette: { ".": null, a: "#e8702a", A: "#b8481a", s: "#6a4a2a" },
  frames: [
    [
      E16,
      ".......a........",
      "......aaa.......",
      "..a..aaAaa..a...",
      "..aaaaaAaaaaa...",
      "...aaaaAaaaa....",
      ".aaaaaaAaaaaaa..",
      "..aaAaaAaaAaa...",
      "...aaAaAaAaa....",
      "....aaaAaaa.....",
      "......aAa.......",
      ".......s........",
      ".......s........",
      "........s.......",
      E16,
      E16,
    ],
  ],
};

/** Every new sprite in case 4, by texture key. */
export const case4Sprites: Record<string, PixelSprite> = {
  trattis,
  mossjatte,
  mossunge,
  mossMound,
  hareHilma,
  beaverBruno,
  forestWolf,
  forestFireflies,
  trackBoard,
  mossNest,
  lingonBasket,
  compassStone,
  ringMushroom,
  giantFootprint,
  mossungeFootprints,
  giantCirclePrints,
  wolfFur,
  mossTears,
  forestGlowDust,
  forestTrackHare,
  forestTrackFox,
  forestTrackMoose,
  forestTrackBird,
  forestTrackBear,
  forestCompassN,
  forestCompassE,
  forestCompassS,
  forestCompassW,
  forestSeasonWinter,
  forestSeasonSpring,
  forestSeasonAutumn,
};
