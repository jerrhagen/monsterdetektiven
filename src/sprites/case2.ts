import type { PixelSprite } from "./pixelSprite";

// Case 2 – "Vem tog bullarna?": the bakery, the yard and the flour cellar.

const E = "................";
const O = "#1a1024";

/** Baker Berit: tall white baker's hat, rosy cheeks, blue dress and a floury apron. */
export const berit: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    w: "#f8f4ec", // hat
    W: "#d8d0c4", // hat shade
    h: "#8a4a2a", // hair
    s: "#f5c8a0", // skin
    e: "#2a1a2e", // eyes
    r: "#f08a8a", // cheeks
    m: "#b05050", // mouth
    d: "#4a7ac8", // dress
    D: "#345a9a", // dress, dark
    a: "#fbf8f0", // apron
    A: "#d8d2c8", // flour on the apron
    l: "#5a4a6a", // legs
    f: "#3a2a3a", // shoes
  },
  frames: [
    [
      "....oooooooo....",
      "...owwwwwwwwo...",
      "..owwwwwwwwwwo..",
      "..owwwWwwwwwwo..",
      "...oWWWWWWWWo...",
      "...ohhhhhhhho...",
      "..ohssssssssho..",
      "..ohsessssesho..",
      "..ohrssssssrho..",
      "...ossmmmmsso...",
      "....osssssso....",
      "...oddaaaaddo...",
      "..odddaaaadddo..",
      "..osdaaaaaadso..",
      "...oaaAaaAaao...",
      "...oaaaaaaaao...",
      "...oDDDDDDDDo...",
      "....olo..olo....",
      "...offo..offo...",
      "....oo....oo....",
    ],
  ],
};

/** Neighbour Gustav: flat cap, big white beard, green jumper and brand new black rubber boots. */
export const gustav: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    c: "#6a5a4a", // cap
    C: "#4a3e32", // cap brim
    s: "#f0c0a0", // skin
    e: "#2a1a2e", // eyes
    n: "#e0907a", // nose
    b: "#e8e4ec", // beard
    B: "#b8b4c0", // beard shade
    g: "#3a8a5a", // jumper
    G: "#2a6a44", // jumper, dark
    p: "#5a5a7a", // trousers
    k: "#15121c", // black boots
    K: "#4a4458", // boot shine
  },
  frames: [
    [
      E,
      "....oooooooo....",
      "...occccccccoo..",
      "..oCCCCCCCCCCCo.",
      "...osssssssso...",
      "...osesssseso...",
      "...osssnnssso...",
      "...obbbbbbbbo...",
      "..obbbBbbBbbbo..",
      "...obbbbbbbbo...",
      "....obbBbbbo....",
      "..oggggggggggo..",
      ".ogggGggggGgggo.",
      ".osgGggggggGgso.",
      "..oggggggggggo..",
      "...oppppppppo...",
      "...oppo..oppo...",
      "...okko..okko...",
      "..okKko..okKko..",
      "..ooooo..ooooo..",
    ],
  ],
};

/**
 * Smulan – a small, round, blue snack monster with blue fluff, little fangs and THREE toes on each foot.
 * Frames 0–1: scuttling. Frame 2: happily holding a fresh bun (used in the ending).
 */
const smulanTop = [
  E,
  "......l.l.l.....",
  ".....oblblbo....",
  "...oobbbbbbboo..",
  "..obbbbbbbbbbbo.",
  "..obbwwbbbwwbbo.",
  "..obbwkbbbwkbbo.",
  ".obbbbbbbbbbbbbo",
];
export const smulan: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    b: "#4aa3ff", // fur
    B: "#2a6ad0", // fur, dark
    l: "#a8dcff", // fluff
    w: "#ffffff", // eyes
    k: "#1a1024", // pupils
    m: "#6a1a3a", // mouth
    t: "#ffffff", // fangs
    u: "#d0843a", // bun
    U: "#f0b060", // bun, light
  },
  animations: { "": { frames: [0, 1], frameRate: 8 } },
  frames: [
    [
      ...smulanTop,
      ".oblbbmmmmmbblbo",
      ".obbbbmtmtmbbbbo",
      ".oblbbbmmmbbblbo",
      "..obbbbbbbbbbbo.",
      "..oBbbbbbbbbbBo.",
      "...oBBBBBBBBBo..",
      "..obbbo..obbbo..",
      "..B.B.B..B.B.B..",
    ],
    [
      ...smulanTop,
      ".oblbbmmmmmbblbo",
      ".obbbbmtmtmbbbbo",
      ".oblbbbmmmbbblbo",
      "..obbbbbbbbbbbo.",
      "..oBbbbbbbbbbBo.",
      "...oBBBBBBBBBo..",
      "...obbbo.obbbo..",
      "...B.B.B.......B",
    ],
    [
      E,
      "......l.l.l.....",
      ".....oblblbo....",
      "...oobbbbbbboo..",
      "..obbbbbbbbbbbo.",
      "..obbkbbbbbkbbo.",
      "..obkbkbbbkbkbo.",
      ".obbbbbbbbbbbbbo",
      ".oblbbmmmmmbblbo",
      ".obbbbbmtmbbbbbo",
      ".oblbooooooblbo.",
      "..obouUUUUuobo..",
      "..oBouuUUuuoBo..",
      "...oBoooooooo...",
      "..obbbo..obbbo..",
      "..B.B.B..B.B.B..",
    ],
  ],
};

/** Måns, the yard cat. Frame 0: curled up asleep. Frame 1: awake – arched back and glowing eyes! */
export const gardskatt: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    g: "#8a8494", // fur
    G: "#5e5868", // stripes
    l: "#b8b2c0", // light fur
    y: "#ffe27a", // glowing eyes
    k: "#1a1024", // pupils
    p: "#f08aa8", // nose
    w: "#ffffff", // fangs
  },
  frames: [
    [
      E,
      E,
      E,
      E,
      E,
      E,
      "..o..o..........",
      ".ogoogooooooo...",
      ".ogggggggglgggo.",
      "ogGGgGGgggglgggo",
      "ogggpgggGgggGggo",
      "oglgggggggggggGo",
      ".oggggggggggggGo",
      "..ollllllllllGo.",
      "...oooooooooooo.",
      E,
    ],
    [
      E,
      ".o..............",
      "ogo........o..o.",
      "ogo.......ogoogo",
      ".ogo.....ogggggo",
      ".og.....ogykgyko",
      ".og..oooogggpggo",
      ".ogooggggggwgwgo",
      "..oggggggggggGo.",
      "..ogGgggGgggggo.",
      "..oggggggggggo..",
      "...ogggggggggo..",
      "...ogo..ogo.ogo.",
      "...ogo..ogo.ogo.",
      "..oggo.oggo.oggo",
      "..ooo..ooo..ooo.",
    ],
  ],
};

/** Mjölspöket – a ghost made of flour, with hollow eyes and tiny red pupils. Floats back and forth. */
export const bakeryFlourGhost: PixelSprite = {
  palette: {
    ".": null,
    o: "#7a7084",
    w: "#f6f2ea", // flour
    W: "#d8d0c4", // flour shade
    e: "#1a1024", // hollow eyes
    r: "#e0304a", // pupils
    d: "#ffffff", // flour dust
  },
  frameRate: 4,
  frames: [
    [
      "d...............",
      "......oooo....d.",
      "....oowwwwoo....",
      "...owwwwwwwwo...",
      "..owwwwwwwwwwo..",
      "..oweewwwweewo..",
      "..owerwwwwerwo..",
      "..owwwwwwwwwwo..",
      ".oowwwweewwwwoo.",
      "owwwwwweewwwwwwo",
      "owWwwwwwwwwwwWwo",
      ".oowwwwwwwwwwoo.",
      "...owwwwwwwwo...",
      "...owWwwwWwwo...",
      "...owo.owo.owo..",
      "....o...o...o..d",
    ],
    [
      "...............d",
      "......oooo......",
      "....oowwwwoo....",
      "...owwwwwwwwo...",
      "..owwwwwwwwwwo..",
      "..oweewwwweewo..",
      "..owerwwwwerwo..",
      "..owwwwwwwwwwo..",
      ".oowwwweewwwwoo.",
      "owwwwwweewwwwwwo",
      "owWwwwwwwwwwwWwo",
      ".oowwwwwwwwwwoo.",
      "...owwwwwwwwo...",
      "...owwWwwwWwo...",
      "..owo.owo.owo...",
      "d..o...o...o....",
    ],
  ],
};

/** Berit's chalkboard with her regular customers. */
export const bakeryBoard: PixelSprite = {
  palette: { ".": null, o: O, f: "#8a5a3a", b: "#2e3a34", c: "#e8e8e0", p: "#f08aa8" },
  frames: [
    [
      E,
      ".oooooooooooooo.",
      ".offffffffffffo.",
      ".ofbbbbbbbbbbfo.",
      ".ofbccccbbbbbfo.",
      ".ofbbbbbbbbbbfo.",
      ".ofbcccbccbpbfo.",
      ".ofbbbbbbbbbbfo.",
      ".ofbccbcccbpbfo.",
      ".ofbbbbbbbbbbfo.",
      ".ofbcccccbbpbfo.",
      ".offffffffffffo.",
      ".oooooooooooooo.",
      "..of........fo..",
      "..of........fo..",
      ".ooo........ooo.",
    ],
  ],
};

/** Berit's coffee cup – and a half-eaten bun next to it. */
export const bakeryCoffee: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    w: "#f4f0f8",
    W: "#c8c4d4",
    c: "#5a3420",
    b: "#d0843a",
    B: "#9a5a2a",
    l: "#f0b060",
    s: "#ffffff",
    v: "#e8e4ec",
  },
  frames: [
    [
      E,
      E,
      "...v............",
      "....v...........",
      "...v............",
      E,
      E,
      ".oooooo.........",
      ".occcco..ooo....",
      ".owwwwoooslo....",
      ".owwwwo.ollo.o..",
      ".owwwwo.olsbllo.",
      ".oWwwWo.obbbbbo.",
      "..oooo..oBBBBBo.",
      ".........ooooo..",
      E,
    ],
  ],
};

/** The baking table with Berit's big dough bowl. */
export const bakeryDough: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    t: "#b07a44", // table
    T: "#7a4f2a", // table, dark
    b: "#e06a5a", // bowl
    B: "#a84a40", // bowl, dark
    d: "#f6e8c8", // dough
    p: "#fbf8f0", // paper (the recipe)
    x: "#6a5a7a", // writing
  },
  frames: [
    [
      E,
      E,
      "...oooooooo.....",
      "..odddddddddo...",
      ".obddddddddbo...",
      ".obbbbbbbbbbo...",
      "..oBBBBBBBBo.ooo",
      "oooooooooooooppo",
      "otttttttttttopxo",
      "otttttttttttoppo",
      "oTTTTTTTTTTTTooo",
      "ooooooooooooooo.",
      ".oTo.......oTo..",
      ".oTo.......oTo..",
      ".oTo.......oTo..",
      ".ooo.......ooo..",
    ],
  ],
};

/** Måns's food bowl – with bun crumbs in it. */
export const bakeryCatBowl: PixelSprite = {
  palette: { ".": null, o: O, r: "#d23b3b", R: "#9a2a2a", c: "#e8b060", w: "#ffffff" },
  frames: [
    [
      E,
      E,
      E,
      E,
      E,
      E,
      E,
      E,
      "....c..c.c......",
      "..oooooooooooo..",
      "..occcrcccrcco..",
      "..orrrrrrrrrro..",
      "...orrwrrwrro...",
      "...oRRRRRRRRo...",
      "....oooooooo....",
      E,
    ],
  ],
};

/** Smulan's nest behind the flour sacks: blue fluff, crumbs and a tiny sign. */
export const smulanNest: PixelSprite = {
  palette: {
    ".": null,
    o: O,
    b: "#4aa3ff",
    l: "#a8dcff",
    B: "#2a6ad0",
    c: "#e8b060",
    g: "#b8f0ff",
    s: "#b07a44",
    p: "#f4ecd8",
    x: "#6a5a7a",
  },
  frames: [
    [
      "..oooooo........",
      "..opxxpo........",
      "..opppxo........",
      "..oooooo........",
      "....os..........",
      "....os..........",
      "....os..........",
      "...oolbolboo....",
      "..olbblbblblo...",
      ".olbbcbbbgbblo..",
      ".obBbbbbcbbBbo..",
      ".olbbbgbbbbblo..",
      "..oBblbbblbBo...",
      "...oBBBBBBBo....",
      "....ooooooo.....",
      E,
    ],
  ],
};

// ---------- Clues ----------

/** Clue: bun crumbs on the floor. */
export const bakeryCrumbs: PixelSprite = {
  palette: { ".": null, c: "#e8b060", C: "#b07a30" },
  frames: [
    [
      E,
      E,
      E,
      "..c.............",
      "...C...c........",
      "......cC........",
      "..........c.....",
      "........C.......",
      "...........cc...",
      "............C...",
      "..............c.",
      E,
      E,
      E,
      E,
      E,
    ],
  ],
};

/** Clue: grey cat hairs. */
export const bakeryCatHair: PixelSprite = {
  palette: { ".": null, g: "#8a8494", l: "#b8b2c0" },
  frames: [
    [
      E,
      E,
      E,
      E,
      "...g............",
      "....g.....l.....",
      "....g......l....",
      ".....g.....l....",
      ".....g....l.....",
      "......g.........",
      "........g.......",
      ".........gg.....",
      "...........g....",
      E,
      E,
      E,
    ],
  ],
};

/** Clue: a tuft of soft blue fluff. */
export const bakeryBlueFluff: PixelSprite = {
  palette: { ".": null, b: "#4aa3ff", l: "#a8dcff", B: "#2a6ad0" },
  frames: [
    [
      E,
      E,
      E,
      E,
      "......l..l......",
      "....l.bllb.l....",
      ".....bbbbbbl....",
      "...lbbBbbbbb....",
      "....bbbbbBbbl...",
      "...l.bbBbbbb....",
      ".....lbbbbl.l...",
      "....l..l.b......",
      E,
      E,
      E,
      E,
    ],
  ],
};

/** Clue: small round footprints with THREE toes. */
export const bakeryToePrints: PixelSprite = {
  palette: { ".": null, d: "#6a4a2a" },
  frames: [
    [
      E,
      "..d.d.d.........",
      "................",
      "..ddddd.........",
      ".ddddddd........",
      ".ddddddd........",
      "..ddddd.........",
      "................",
      "........d.d.d...",
      "................",
      "........ddddd...",
      ".......ddddddd..",
      ".......ddddddd..",
      "........ddddd...",
      E,
      E,
    ],
  ],
};

/** Clue: long, narrow black footprints in the flour. */
export const bakeryBlackPrints: PixelSprite = {
  palette: { ".": null, k: "#0d0718", K: "#2a1c3a" },
  frames: [
    [
      "..........k.....",
      ".........kK.....",
      ".........kK.....",
      ".........kk.....",
      "..........k.....",
      "..k.............",
      ".kK.............",
      ".kK.............",
      ".kk.......k.....",
      "..k......kK.....",
      ".........kK.....",
      ".........kk.....",
      "..........k.....",
      E,
      E,
      E,
    ],
  ],
};

/** Clue: crumbs that glow faintly, like tiny stars. */
export const bakeryGlowCrumbs: PixelSprite = {
  palette: { ".": null, c: "#e8b060", g: "#b8f0ff", w: "#ffffff" },
  frames: [
    [
      E,
      E,
      "...g............",
      "..gwg...........",
      "...g.....c......",
      "................",
      ".......g........",
      "......gcg.......",
      ".......g.....g..",
      "............gwg.",
      "...c.........g..",
      "........c.......",
      E,
      E,
      E,
      E,
    ],
  ],
};

/** Clue: the bun that glowed when it came out of the oven. */
export const bakeryGlowBun: PixelSprite = {
  palette: { ".": null, o: O, b: "#d0843a", l: "#f0b060", s: "#ffffff", g: "#b8f0ff", G: "#7ac8e8" },
  frames: [
    [
      E,
      ".......g........",
      "..g....g....g...",
      "...g.......g....",
      "......oooo......",
      "....oollsloo....",
      "g..olslllllso..g",
      "...olllGGllllo..",
      "...olllGGlslbo..",
      "...obllllllbbo..",
      "....obbbbbbbo...",
      "...g.ooooooo.g..",
      "..g.........g...",
      ".......g........",
      ".......g........",
      E,
    ],
  ],
};

// ---------- Ingredients for the recipe ----------

/** A sack of flour. */
export const bakeryFlour: PixelSprite = {
  palette: { ".": null, o: O, s: "#d8c8a0", S: "#b0a078", w: "#ffffff", t: "#8a5a3a" },
  frames: [
    [
      E,
      ".....w.w........",
      "....otttto......",
      "....owwwwo......",
      "...owwwwwwo.....",
      "..ossssssssoo...",
      "..osssssssssso..",
      ".ossssSSssssso..",
      ".osssSssSssssso.",
      ".osssSssSssssso.",
      ".osssSSSSssssso.",
      ".osssSssSsssSso.",
      ".oSssSssSsssSSo.",
      "..oSSSSSSSSSSo..",
      "...oooooooooo...",
      E,
    ],
  ],
};

/** A carton of milk. */
export const bakeryMilk: PixelSprite = {
  palette: { ".": null, o: O, w: "#f8f8ff", b: "#4a7ac8", B: "#345a9a" },
  frames: [
    [
      "......oooo......",
      ".....owwwwo.....",
      "....owwwwwwo....",
      "...oooooooooo...",
      "...owwwwwwwwo...",
      "...obbbbbbbbo...",
      "...obwwbbbbbo...",
      "...owwwwbbbbo...",
      "...owwwwwbbbo...",
      "...obwwbbbbbo...",
      "...obbbbbbbbo...",
      "...owwwwwwwwo...",
      "...owwwwwwwwo...",
      "...oBBBBBBBBo...",
      "...oooooooooo...",
      E,
    ],
  ],
};

/** A soft yellow block of butter on its paper. */
export const bakeryButter: PixelSprite = {
  palette: { ".": null, o: O, y: "#f8e070", Y: "#d8b840", w: "#fbf8f0", W: "#d8d2c8" },
  frames: [
    [
      E,
      E,
      E,
      E,
      E,
      "....oooooooo....",
      "...oyyyyyyyyo...",
      "..oyyyyyyyyyyo..",
      "..oyyyyyyyyyYo..",
      "..oYYYYYYYYYYo..",
      "..oYYYYYYYYYYo..",
      ".owwwwwwwwwwwwo.",
      "owwWwwwwwwwwWwwo",
      ".oooooooooooooo.",
      E,
      E,
    ],
  ],
};

/** A bowl of sugar cubes. */
export const bakerySugar: PixelSprite = {
  palette: { ".": null, o: O, w: "#ffffff", W: "#d8d8e8", p: "#9b6bd6", P: "#6a45a8", s: "#fff6a0" },
  frames: [
    [
      E,
      E,
      "..........s.....",
      "....oooo.sws....",
      "....owwWo.s.....",
      "..ooowwWoooo....",
      "..owwWoowwWo....",
      "..owwWoowwWo....",
      ".oooooooooooooo.",
      ".oppppppppppppo.",
      "..oppppppppppo..",
      "..oPppppppppPo..",
      "...oPPPPPPPPo...",
      "....oooooooo....",
      E,
      E,
    ],
  ],
};

/** A little yellow packet of yeast with a red stripe. */
export const bakeryYeast: PixelSprite = {
  palette: { ".": null, o: O, y: "#f2d24b", Y: "#c8a830", r: "#d23b3b", w: "#ffffff" },
  frames: [
    [
      E,
      E,
      E,
      E,
      "...oooooooooo...",
      "...oyyyyyyyyo...",
      "...oyyyyyyyyo...",
      "...orrrrrrrro...",
      "...orwrwrwrro...",
      "...orrrrrrrro...",
      "...oyyyyyyyyo...",
      "...oyyyyyyyyo...",
      "...oYYYYYYYYo...",
      "...oooooooooo...",
      E,
      E,
    ],
  ],
};

/** Cinnamon sticks – brown and rolled up. */
export const bakeryCinnamon: PixelSprite = {
  palette: { ".": null, o: O, c: "#a0582a", C: "#6a3418", l: "#c87a44" },
  frames: [
    [
      E,
      E,
      "..........ooo...",
      ".........olCo...",
      "......ooolcCo...",
      ".....olColcoo...",
      ".....olcolco....",
      "....olcolcCo....",
      "....olcolco.....",
      "...olcolcCo.....",
      "...olcolco......",
      "..olCoolco......",
      "..olcoooo.......",
      "..oooo..........",
      E,
      E,
    ],
  ],
};

// ---------- Tracks for Gustav's collection ----------

/** Cat track: a pad and four round toes – no claws. */
export const bakeryTrackCat: PixelSprite = {
  palette: { ".": null, d: "#5a3a2a" },
  frames: [
    [
      E,
      E,
      E,
      "......dd..dd....",
      "......dd..dd....",
      "...dd........dd.",
      "...dd........dd.",
      "................",
      "......dddddd....",
      ".....dddddddd...",
      "....dddddddddd..",
      "....dddddddddd..",
      ".....dddddddd...",
      E,
      E,
      E,
    ],
  ],
};

/** Dog track: four toes WITH claw marks, and a bigger pad. */
export const bakeryTrackDog: PixelSprite = {
  palette: { ".": null, d: "#5a3a2a" },
  frames: [
    [
      E,
      "......d...d.....",
      "......d...d.....",
      ".....ddd.ddd....",
      "..d..ddd.ddd..d.",
      ".ddd.........ddd",
      ".ddd.........ddd",
      "................",
      ".....dddddd.....",
      "....dddddddd....",
      "...dddddddddd...",
      "...dddd..dddd...",
      "....dd....dd....",
      E,
      E,
      E,
    ],
  ],
};

/** Duck track: three toes joined by webbing, like a triangle. */
export const bakeryTrackDuck: PixelSprite = {
  palette: { ".": null, d: "#5a3a2a", w: "#8a6a4a" },
  frames: [
    [
      E,
      E,
      ".d.....d.....d..",
      ".dw....d....wd..",
      "..dw...d...wd...",
      "..dww..d..wwd...",
      "...dwwwdwwwd....",
      "...dwwwdwwwd....",
      "....dwwdwwd.....",
      ".....dwdwd......",
      "......ddd.......",
      ".......d........",
      E,
      E,
      E,
      E,
    ],
  ],
};

/** Horse track: a round hoof shaped like a U. */
export const bakeryTrackHorse: PixelSprite = {
  palette: { ".": null, d: "#5a3a2a" },
  frames: [
    [
      E,
      E,
      ".....dddddd.....",
      "...dddddddddd...",
      "..dddd....dddd..",
      "..ddd......ddd..",
      ".ddd........ddd.",
      ".ddd........ddd.",
      ".ddd........ddd.",
      ".ddd........ddd.",
      "..ddd......ddd..",
      "..ddd......ddd..",
      "..ddd......ddd..",
      E,
      E,
      E,
    ],
  ],
};

/** A person's shoe print, with stripes on the sole. */
export const bakeryTrackShoe: PixelSprite = {
  palette: { ".": null, d: "#5a3a2a" },
  frames: [
    [
      "......dddd......",
      ".....dddddd.....",
      ".....d.dd.d.....",
      ".....dddddd.....",
      ".....d.dd.d.....",
      ".....dddddd.....",
      "......dddd......",
      "......dddd......",
      E,
      "......dddd......",
      ".....d.dd.d.....",
      ".....dddddd.....",
      ".....d.dd.d.....",
      "......dddd......",
      E,
      E,
    ],
  ],
};

/** Every new sprite in case 2. */
export const case2Sprites: Record<string, PixelSprite> = {
  berit,
  gustav,
  smulan,
  gardskatt,
  bakeryFlourGhost,
  bakeryBoard,
  bakeryCoffee,
  bakeryDough,
  bakeryCatBowl,
  smulanNest,
  bakeryCrumbs,
  bakeryCatHair,
  bakeryBlueFluff,
  bakeryToePrints,
  bakeryBlackPrints,
  bakeryGlowCrumbs,
  bakeryGlowBun,
  bakeryFlour,
  bakeryMilk,
  bakeryButter,
  bakerySugar,
  bakeryYeast,
  bakeryCinnamon,
  bakeryTrackCat,
  bakeryTrackDog,
  bakeryTrackDuck,
  bakeryTrackHorse,
  bakeryTrackShoe,
};
