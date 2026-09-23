import type { PixelSprite } from "./pixelSprite";

// Case 5 – "Klocktornet har stannat": the square, the tower stairs and the clockwork room.

const E = "................";

/**
 * Kugg-trollet – a tiny copper troll who lives in the clockwork. His head is a cogwheel,
 * his eyes glow like two yellow lamps, and he clutches a glowing blue shard.
 * Two frames: scuttling on short legs.
 */
export const kuggtroll: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    c: "#c97a3a", // copper
    l: "#f0b070", // copper, shiny
    C: "#8a4a22", // overalls, dark copper
    y: "#ffe27a", // lamp eyes
    k: "#1a1024",
    w: "#fff6e0", // teeth
    b: "#b8f0ff", // the shard
    B: "#7ac8e8",
  },
  frameRate: 10,
  frames: [
    [
      "......oooo......",
      "..oo.ollllo.oo..",
      "..olooccccoolo..",
      "...occcccccco...",
      ".oocyyccccyycoo.",
      ".olcykccccykclo.",
      ".oocccccccccooo.",
      "...occwwwwcco...",
      "....occcccco....",
      ".....oCCCCo.....",
      "....oCCCCCCobBo.",
      "....oCCCCCCoBbo.",
      ".....oCCCCo.oo..",
      ".....oo..oo.....",
      "....ooo..ooo....",
      E,
    ],
    [
      "......oooo......",
      "..oo.ollllo.oo..",
      "..olooccccoolo..",
      "...occcccccco...",
      ".oocyyccccyycoo.",
      ".olcykccccykclo.",
      ".oocccccccccooo.",
      "...occwwwwcco...",
      "....occcccco....",
      ".....oCCCCo.....",
      "....oCCCCCCobBo.",
      "....oCCCCCCoBbo.",
      ".....oCCCCo.oo..",
      "....oo....oo....",
      "...ooo....ooo...",
      E,
    ],
  ],
};

/** Tornvakten Knut – the grumpy old tower keeper: navy cap, bushy grey beard, keys on his belt. */
export const clockKeeper: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    b: "#2d3a6a", // coat and cap
    B: "#1c2448", // cap brim
    y: "#ffd66b", // brass
    s: "#f5c8a0", // skin
    g: "#c8c4d4", // grey hair and beard
    k: "#1a1024",
    n: "#e0a080", // nose
    m: "#6a3a3a", // grumpy mouth
    L: "#5a3a1e", // belt
    f: "#4a2a18", // boots
  },
  frames: [
    [
      E,
      "....oooooooo....",
      "...obbbbbbbbo...",
      "...obbbyybbbo...",
      "..oBBBBBBBBBBo..",
      "...oggssssggo...",
      "...osksssskso...",
      "...osssnnssso...",
      "...oggggggggo...",
      "...oggmmmmggo...",
      "....oggggggo....",
      "...obbbggbbbo...",
      "..obbbbybbbbbo..",
      "..osbbbbbbbbso..",
      "..osbbbybbbbso..",
      "...oLLLyyLLLo...",
      "...obbbbbbbbo...",
      "....obbo.obbo...",
      "...offfo.offfo..",
      "....ooo...ooo...",
    ],
  ],
};

/** Mister Fluff – a furry turquoise tourist monster: three eyes, fangs, straw hat, flowery shirt and a camera. */
export const touristFluff: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    y: "#f2d24b", // straw hat
    Y: "#e04848", // hat band
    t: "#4ac8c0", // fur
    w: "#ffffff",
    k: "#1a1024",
    m: "#6a1a2a", // mouth
    p: "#ff8ade", // shirt
    P: "#f2d24b", // flowers
    L: "#4a90e2", // camera lens
    S: "#f28c38", // shorts
    d: "#a0643a", // sandals
  },
  frames: [
    [
      E,
      ".....yyyyyy.....",
      "....yYYYYYYy....",
      "..oyyyyyyyyyyo..",
      "...otttttttto...",
      "..otwktwktwkto..",
      "..otttttttttto..",
      "..otmmmmmmmmto..",
      "..otmwmmmmwmto..",
      "...otttttttto...",
      "..oppppppppppo..",
      ".otpPppkkppPpto.",
      ".otppPpkLkpPpto.",
      "..tppPpkkpPppt..",
      "...oppppppppo...",
      "...oSSSSSSSSo...",
      "...oSSSooSSSo...",
      "....otto..otto..",
      "...oddddo.oddddo",
      E,
    ],
  ],
};

/** Mister Fluff's suitcase, covered in stickers – something glows blue through the gap. */
export const touristSuitcase: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    b: "#a0643a",
    B: "#7a4526",
    r: "#e04848",
    y: "#f2d24b",
    g: "#5cc46a",
    c: "#b8f0ff",
    C: "#ffffff",
  },
  frames: [
    [
      E,
      E,
      E,
      "......oooo......",
      "......o..o......",
      "..oooooooooooo..",
      "..obbrrbbbbybo..",
      "..obbrrbbbbbbo..",
      "..ocCccccCccco..",
      "..obbbbbgbbbbo..",
      "..obbbbbbbbbbo..",
      "..obbbbbbbbbbo..",
      "..oBBBBBBBBBBo..",
      "..oooooooooooo..",
      "...oo......oo...",
      E,
    ],
  ],
};

/** The crank used to wind up the tower clock. */
export const clockCrank: PixelSprite = {
  palette: { ".": null, o: "#1a1024", b: "#a0643a", g: "#b8b4c4", G: "#6a6478" },
  frames: [
    [
      E,
      E,
      E,
      E,
      "...........oo...",
      "..........obbo..",
      "..........obbo..",
      "...........gg...",
      "..ooo......gg...",
      "..oGgggggggggo..",
      "..oGoooooooooo..",
      "..ooo...........",
      E,
      E,
      E,
      E,
    ],
  ],
};

/** A small, shiny, oily cogwheel. */
export const clockTinyGear: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#d9a84a", l: "#fff0b0" },
  frames: [
    [
      E,
      E,
      E,
      E,
      "......oyyo......",
      "...oo.oyyo.oo...",
      "...oyooylooyo...",
      "....oyyyyyyo....",
      "..ooyyyooyyyoo..",
      "..ooylyooyyyoo..",
      "....oyyyyyyo....",
      "...oyooyyooyo...",
      "...oo.oyyo.oo...",
      "......oyyo......",
      E,
      E,
    ],
  ],
};

/** A pigeon pecking about on the square. */
export const clockPigeon: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    G: "#9a98b0",
    g: "#6e6c84",
    k: "#1a1024",
    y: "#e0b060",
    p: "#5cc46a",
    P: "#9b6bd6",
    r: "#e06a4a",
  },
  frameRate: 6,
  frames: [
    [
      "............",
      ".......ooo..",
      "......oGGGo.",
      "......oGkGoy",
      ".oo..opPPGo.",
      "oGGooGGGGGo.",
      ".oGgggggGGo.",
      "..oGGGGGGo..",
      "...oooooo...",
      "....r..r....",
    ],
    [
      "............",
      "............",
      ".......ooo..",
      "......oGGGo.",
      ".oo..opGkGoy",
      "oGGooGpPPGo.",
      ".oGgggggGGo.",
      "..oGGGGGGo..",
      "...oooooo...",
      "...r....r...",
    ],
  ],
};

/** A compass rose set into the cobblestones: N in red. */
export const squareCompass: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    s: "#b8a898",
    r: "#e04848",
    R: "#a02a2a",
    w: "#e8e0d0",
    d: "#6a5a4a",
  },
  frames: [
    [
      E,
      E,
      ".......oo.......",
      ".......rr.......",
      ".....ooRRoo.....",
      "....ossrrsso....",
      "...osssrrssso...",
      ".oowwwwwwwwwwoo.",
      ".oowwwwwwwwwwoo.",
      "...osssddssso...",
      "....ossddsso....",
      ".....ooddoo.....",
      ".......dd.......",
      ".......oo.......",
      E,
      E,
    ],
  ],
};

/** An old brass plaque on a stand, with a little moon in the corner. */
export const towerPlaque: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#d9a84a", Y: "#a0782a", t: "#6a4a1a", c: "#b8f0ff" },
  frames: [
    [
      E,
      E,
      "..oooooooooooo..",
      "..oyyyyyyyyyyo..",
      "..oyctttttttyo..",
      "..oyyyyyyyyyyo..",
      "..oyttttttyyyo..",
      "..oyyyyyyyyyyo..",
      "..oyttttttttyo..",
      "..oyyyyyyyyyyo..",
      "..oYYYYYYYYYYo..",
      "..oooooooooooo..",
      ".......oo.......",
      ".......oo.......",
      ".....oooooo.....",
      E,
    ],
  ],
};

/** The clock's heavy weights, hanging high on their chains – the clock is wound up. */
export const clockWeights: PixelSprite = {
  palette: { ".": null, o: "#1a1024", g: "#8a86a0", D: "#4a4450", d: "#6a6470", L: "#7a4f2a" },
  frames: [
    [
      "....g......g....",
      "...ooo....ooo...",
      "..oDDDo..oDDDo..",
      "..oDdDo..oDdDo..",
      "..oDdDo..oDdDo..",
      "..oDdDo..oDdDo..",
      "..oDDDo..oDDDo..",
      "...ooo....ooo...",
      "....g......g....",
      "....g......g....",
      "....g......g....",
      "....g......g....",
      "....g......g....",
      "..oooooooooooo..",
      "..oLLLLLLLLLLo..",
      "..oooooooooooo..",
    ],
  ],
};

/** Clue: tiny oily footprints with three toes, going up and down. */
export const clockOilPrints: PixelSprite = {
  palette: { ".": null, d: "#2a2a30", s: "#7a7a94" },
  frames: [
    [
      E,
      E,
      "...d.d.d........",
      "....dsd.........",
      E,
      E,
      ".........d.d.d..",
      "..........dsd...",
      E,
      E,
      "....d.d.d.......",
      ".....ddd........",
      E,
      E,
      "..........d.d.d.",
      "...........ddd..",
    ],
  ],
};

/** A clockwork beetle of brass with a wind-up key on its back and glowing red eyes. Two walking frames. */
export const clockBeetle: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#d9a84a", Y: "#a0782a", g: "#b8b4c4", r: "#ff4a4a" },
  frameRate: 8,
  frames: [
    [
      E,
      E,
      E,
      E,
      ".....oo.oo......",
      ".....ogogo......",
      "......ooo.......",
      ".......o........",
      "....oooooooo....",
      "...oyyyYyyyyoo..",
      "..oyyyyYyyyyorro",
      "..oYYYYYYYYYoo..",
      "...ooooooooo....",
      "...o.o..o.o.....",
      "..o...o...o.....",
      E,
    ],
    [
      E,
      E,
      E,
      E,
      ".....oo.oo......",
      ".....ogogo......",
      "......ooo.......",
      ".......o........",
      "....oooooooo....",
      "...oyyyYyyyyoo..",
      "..oyyyyYyyyyorro",
      "..oYYYYYYYYYoo..",
      "...ooooooooo....",
      "....o.o..o.o....",
      ".....o...o...o..",
      E,
    ],
  ],
};

/** The round brass hatch where the Moonstone sits – a moon on the front and a cogwheel lock. */
export const moonSlotHatch: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#d9a84a", Y: "#a0782a", c: "#b8f0ff", g: "#8a86a0", L: "#4a4450" },
  frames: [
    [
      E,
      ".....oooooo.....",
      "...ooyyyyyyoo...",
      "..oyyyyyyyyyyo..",
      "..oyyyccyyyyyo..",
      ".oyyyccyyyyyyyo.",
      ".oyyycyyyggyyyo.",
      ".oyyyccyyggyyyo.",
      ".oyyyyccyyyyyyo.",
      "..oyyyyyyyyyyo..",
      "..oYyyyyyyyyYo..",
      "...ooYYYYYYoo...",
      ".....oooooo.....",
      "......oLLo......",
      "....ooLLLLoo....",
      "....oooooooo....",
    ],
  ],
};

/** Clue: the Moonstone's place, open and EMPTY – only a little blue glitter left. */
export const moonSlotEmpty: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#d9a84a", d: "#0d0718", c: "#b8f0ff" },
  frames: [
    [
      E,
      ".....oooooo.....",
      "...ooyyyyyyoo...",
      "..oyyooooooyyo..",
      "..oyoddddddoyo..",
      ".oyoddcdddddoyo.",
      ".oyoddddddcdoyo.",
      ".oyodcddddddoyo.",
      ".oyoddddddddoyo.",
      "..oyoddddddoyo..",
      "..oyyooooooyyo..",
      "...ooyyyyyyoo...",
      ".....oooooo.....",
      E,
      E,
      E,
    ],
  ],
};

/** Clue: big black footprints with long pointed toes. */
export const towerBlackPrints: PixelSprite = {
  palette: { ".": null, d: "#0d0718", D: "#2a1a40" },
  frames: [
    [
      E,
      "..d.d.d.........",
      "..d.d.d.........",
      "..ddddd.........",
      "..dDddd.........",
      "...ddd..........",
      "...ddd..........",
      E,
      ".........d.d.d..",
      ".........d.d.d..",
      ".........ddddd..",
      ".........dDddd..",
      "..........ddd...",
      "..........ddd...",
      E,
      E,
    ],
  ],
};

/** Kugg-trollet's tiny bed in a box of cogwheels – with blue glitter on the pillow. */
export const kuggtrollBed: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#f4ecd8", c: "#b8f0ff", b: "#6a45a8", L: "#a8744a", g: "#d9a84a" },
  frames: [
    [
      E,
      E,
      E,
      E,
      E,
      E,
      ".oooooooooooooo.",
      ".owwcbbbbbbbbbo.",
      ".owcwbbbbbbbbbo.",
      ".oLLLLLLLLLLLLo.",
      ".oLgLLLLLLLgLLo.",
      ".oLLLLLLLLLLLLo.",
      ".oooooooooooooo.",
      "..oo........oo..",
      E,
      E,
    ],
  ],
};

/** A map: from the tower north to the forest, then west to a red X – with two yellow dots next to it. */
export const shadowCaveMap: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    p: "#e8d9b0",
    k: "#c0182c",
    g: "#2f7a36",
    r: "#7a4f2a",
    y: "#ffe27a",
    T: "#4a4450",
  },
  frames: [
    [
      E,
      E,
      "..oooooooooooo..",
      "..oppppppppppo..",
      "..okpkppggggpo..",
      "..opkprrrrggpo..",
      "..okpkppprggpo..",
      "..oypyppprpppo..",
      "..opppppprpppo..",
      "..oppppppprTpo..",
      "..opppppppTTpo..",
      "..oppppppppppo..",
      "..oooooooooooo..",
      E,
      E,
      E,
    ],
  ],
};

/** The clock's pendulum, hanging perfectly still. */
export const clockPendulum: PixelSprite = {
  palette: { ".": null, o: "#1a1024", L: "#4a4450", g: "#8a86a0", y: "#d9a84a", Y: "#a0782a" },
  frames: [
    [
      "......oooo......",
      "......oLLo......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".......gg.......",
      ".....oooooo.....",
      "....oyyyyyyo....",
      "...oyyYyyyyyo...",
      "...oyYyyyyyyo...",
      "...oyyyyyyYyo...",
      "....oyyyyyyo....",
      ".....oooooo.....",
      E,
      E,
    ],
  ],
};

export const case5Sprites: Record<string, PixelSprite> = {
  kuggtroll,
  clockKeeper,
  touristFluff,
  touristSuitcase,
  clockCrank,
  clockTinyGear,
  clockPigeon,
  squareCompass,
  towerPlaque,
  clockWeights,
  clockOilPrints,
  clockBeetle,
  moonSlotHatch,
  moonSlotEmpty,
  towerBlackPrints,
  kuggtrollBed,
  shadowCaveMap,
  clockPendulum,
};
