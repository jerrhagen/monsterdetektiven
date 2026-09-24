import type { PixelSprite } from "./pixelSprite";

// Case 3 – Spöket i biblioteket. People, monsters, things and clues.

const E16 = "................";

/** Bodil Bok, the librarian: big dark curls with a pencil, red glasses, purple cardigan, mustard skirt. */
export const bodil: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    h: "#2a1a14", // hair
    H: "#4a3024", // hair, light
    y: "#f2d24b", // pencil
    s: "#a8704a", // skin
    r: "#d04a4a", // glasses
    e: "#1a1024", // eyes
    m: "#6a2a2a", // mouth
    c: "#7a5ac8", // cardigan
    C: "#5a3a98", // cardigan, dark
    b: "#f4ecd8", // blouse
    k: "#c9961e", // skirt
    K: "#9a7014", // skirt, dark
    l: "#3a2a3a", // legs
    f: "#2a1a2e", // shoes
  },
  frames: [
    [
      "....oooooooo....",
      "...ohhhhhhhho.y.",
      "..ohhhHhhhhhhoy.",
      "..ohhhhhhhhhhho.",
      "..ohsssssssshho.",
      "..ohrerssrerhho.",
      "..ohsssssssshho.",
      "...ossmmmssso...",
      "....osssssso....",
      "...occbbbbcco...",
      "..occcbbbbccco..",
      "..ocCcbbbbcCco..",
      "..osccccccccso..",
      "...okkkkkkkko...",
      "...okkkkkkkko...",
      "..okkKkkkkKkko..",
      "..oooooooooooo..",
      "....olo..olo....",
      "...offo..offo...",
      "....oo....oo....",
    ],
  ],
};

/** Pelle, a boy who reads in the library every day: messy blond hair, freckles, striped shirt. */
export const pelle: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    h: "#f2d24b", // hair
    H: "#c9a02a", // hair, dark
    s: "#f5c8a0", // skin
    f: "#d08a6a", // freckles
    e: "#1a1024", // eyes
    m: "#b05050", // mouth
    b: "#4a8ae8", // shirt
    B: "#f4ecd8", // stripes
    n: "#3a4a7a", // shorts
    F: "#c0182c", // shoes
  },
  frames: [
    [
      ".....o.oo.o.....",
      "....ohohhoho....",
      "...ohhhhhhhho...",
      "...ohHhhhhHho...",
      "...ohssssssho...",
      "...osesssseso...",
      "...osfssssfso...",
      "....ossmmsso....",
      "......osso......",
      "....obbbbbbo....",
      "...obBBBBBBbo...",
      "...obbbbbbbbo...",
      "...sbBBBBBBbs...",
      "....obbbbbbo....",
      "....onnnnnno....",
      "....onno.nno....",
      "....oso..oso....",
      "....oso..oso....",
      "...oFFo..oFFo...",
      "...oooo..oooo...",
    ],
  ],
};

/**
 * Bokmalen Bläddra – a bookworm with round glasses who wants to learn to read.
 * Two frames: wriggling (hump up, hump down). Other cases may reference this key.
 */
export const bladdra: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    g: "#8ad86a", // body
    G: "#5aa84a", // segments
    y: "#d8f0a0", // belly
    F: "#b04a2a", // glasses frame
    w: "#cfe8ff", // lenses
    k: "#1a1024", // eyes
    p: "#ff9ab8", // cheeks
    m: "#7a2a3a", // mouth
    r: "#e04848", // little book on the back
    R: "#a02a2a",
  },
  frameRate: 6,
  frames: [
    [
      "..........oooo..",
      "..ooo....oggggo.",
      ".orrRo..ogFFgFFo",
      ".orrRo..oFwkFwko",
      "..ooooo.ogFFgFFo",
      "..oggggoogpggpgo",
      ".oggGgggGggmmgo.",
      ".oggGgggGgggggo.",
      "oyyyyyyyyyyyyo..",
      ".oooooooooooo...",
      E16,
      E16,
    ],
    [
      "..........oooo..",
      ".........oggggo.",
      "........ogFFgFFo",
      "..ooo...oFwkFwko",
      ".orrRo..ogFFgFFo",
      ".orrRooooogpgpgo",
      "oggggGggGggmmgo.",
      "oggggGggGgggggo.",
      "yyyyyyyyyyyyyo..",
      "ooooooooooooo...",
      E16,
      E16,
    ],
  ],
};

/** Uppslagsboken Ugo – an encyclopedia that woke up and started flying. Frame 0: pages up, frame 1: pages down. */
export const ugo: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    p: "#f4ecd8", // pages
    L: "#b8a888", // lines on the pages
    b: "#3a6ac8", // cover
    B: "#24488a", // cover, dark
    y: "#ffe27a", // glowing eyes
    k: "#1a1024", // mouth
    w: "#ffffff", // teeth
  },
  frameRate: 7,
  frames: [
    [
      "pp............pp",
      "pLp..........pLp",
      ".pLpoooooooopLp.",
      ".pLLobbbbbboLLp.",
      "..pLobybbyboLp..",
      "...pobkkkkbop...",
      "....obwkwkbo....",
      "....obkkkkbo....",
      "....obbbbbbo....",
      "....oBBBBBBo....",
      "....oooooooo....",
      E16,
    ],
    [
      E16,
      E16,
      "....oooooooo....",
      "....obbbbbbo....",
      "....obybbybo....",
      "ppppobkkkkbopppp",
      "pLLLobwkwkboLLLp",
      ".pLpobkkkkbopLp.",
      "..ppobbbbbbopp..",
      "....oBBBBBBo....",
      "....oooooooo....",
      E16,
    ],
  ],
};

/** Ugo resting on top of a shelf, eyes shut – now he can be talked to. */
export const ugoRest: PixelSprite = {
  palette: { ".": null, o: "#1a1024", b: "#3a6ac8", B: "#24488a", k: "#1a1024", p: "#f4ecd8", L: "#b8a888" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      "..oooooooooooo..",
      "..obbbbbbbbbbo..",
      "..obkkbbbbkkbo..",
      "..obbbbbbbbbbo..",
      "..oBBBBBBBBBBo..",
      "..oppppppppppo..",
      "..oLLLLLLLLLLo..",
      "..oooooooooooo..",
    ],
  ],
};

/** Dammis – a huge dust bunny with glowing red eyes that rolls around the cellar. */
export const dammis: PixelSprite = {
  palette: { ".": null, d: "#4a4454", g: "#8a8496", G: "#6a6478", r: "#ff4a4a", y: "#ffd0d0", k: "#1a1024" },
  frameRate: 6,
  frames: [
    [
      E16,
      ".....d..d..d....",
      "...d.ddddddd.d..",
      "....dgggGgggd...",
      "..ddgggggggggdd.",
      "...dgrrgggrrgd..",
      "..ddgrygggrygdd.",
      "...dggggGggggd..",
      "..ddggkkkkkggdd.",
      "...dgggggggggd..",
      "....ddgGgggdd...",
      "...d..ddddd..d..",
      "......d...d.....",
      E16,
    ],
    [
      E16,
      "....d..d..d..d..",
      "..d.ddddddddd...",
      "...dgggGggggd...",
      ".ddgggggggggdd..",
      "..dgrrgggrrggd..",
      ".ddgrygggryggdd.",
      "..dggggGgggggd..",
      ".ddggkkkkkgggdd.",
      "..dggggggggggd..",
      "...ddgggGgdd....",
      "..d..ddddd..d...",
      ".....d...d......",
      E16,
    ],
  ],
};

/** A closed library book – the options in the alphabet puzzle. */
export const libraryBook: PixelSprite = {
  palette: { ".": null, o: "#1a1024", R: "#8a2a3a", r: "#c84a5a", w: "#f4ecd8", k: "#5a4a6a", y: "#ffd66b", p: "#e8dcc0" },
  frames: [
    [
      E16,
      E16,
      "...ooooooooooo..",
      "...oRrrrrrrrro..",
      "...oRrwwwwwwro..",
      "...oRrwkkkkwro..",
      "...oRrwwwwwwro..",
      "...oRrrrrrrrro..",
      "...oRrrryrrrro..",
      "...oRrrrrrrrro..",
      "...oRrrrrrrrro..",
      "...oRppppppppo..",
      "...ooooooooooo..",
      E16,
      E16,
      E16,
    ],
  ],
};

/** Bodil's book cart, full of books every which way. */
export const bookCart: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    r: "#c84a5a",
    b: "#4a8ae8",
    g: "#5cc46a",
    y: "#f2d24b",
    p: "#b98ae8",
    w: "#a86a3a",
    k: "#5a5468",
  },
  frames: [
    [
      E16,
      E16,
      E16,
      "...r..g....p....",
      "..rrb.gy..bpy...",
      "..rrbygy.gbpyr..",
      "..rrbygyggbpyr..",
      "..rrbygyggbpyr..",
      ".oooooooooooooo.",
      ".owwwwwwwwwwwwo.",
      ".oooooooooooooo.",
      "..o..........o..",
      "..o..........o..",
      ".ooo........ooo.",
      ".oko........oko.",
      "..o..........o..",
    ],
  ],
};

/** Bodil's list of missing books. */
export const libraryMissingList: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#f4ecd8", r: "#c0182c", k: "#5a4a6a" },
  frames: [
    [
      E16,
      E16,
      "....oooooooo....",
      "....owwwwwwo....",
      "....orrrrrwo....",
      "....owwwwwwo....",
      "....okkkkwwo....",
      "....owwwwwwo....",
      "....okkkwkwo....",
      "....owwwwwwo....",
      "....okkkkkwo....",
      "....owwwwwwo....",
      "....okkwwwwo....",
      "....oooooooo....",
      E16,
      E16,
    ],
  ],
};

/** Clue: open books lying on the floor. */
export const messyBooks: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#f4ecd8", L: "#b8a888", g: "#5cc46a", G: "#3a8a4a" },
  frames: [
    [
      E16,
      E16,
      ".ooooooooo......",
      ".owwwowwwo......",
      ".oLLwoLLwo......",
      ".ooooooooo......",
      "..........ooooo.",
      "..........ogggo.",
      "..........oGGGo.",
      "..........ooooo.",
      "...ooooooooo....",
      "...owwwowwwo....",
      "...owLLowLLo....",
      "...ooooooooo....",
      E16,
      E16,
    ],
  ],
};

/** Clue: little pink crumbs – chewed paper? (No: eraser crumbs.) */
export const eraserCrumbs: PixelSprite = {
  palette: { ".": null, p: "#ff9ab8", w: "#f4ecd8" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      E16,
      "....p.....w.....",
      "......w.p.......",
      "...w......p..w..",
      ".......pp.......",
      "..p..w.....w....",
      "........w..p....",
      ".....p........w.",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** The book about the Moonstone – dark blue with a glowing crescent, pages torn out. */
export const moonstoneBook: PixelSprite = {
  palette: { ".": null, o: "#1a1024", N: "#141a3a", n: "#24305a", c: "#b8f0ff", w: "#f4ecd8" },
  frames: [
    [
      E16,
      E16,
      "...ooooooooooo..",
      "...oNnnnnnnnco..",
      "...oNnnnnccnno..",
      "...oNnnnccnnno..",
      "...oNnnnccnnno..",
      "...oNnnnnccnno..",
      "...oNnnnnnnnno..",
      "...oNncnnnnnno..",
      "...oNwowwowwoo..",
      "...ooooooooooo..",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: books in a line on the floor, towards the cellar door. */
export const bookTrail: PixelSprite = {
  palette: { ".": null, o: "#1a1024", r: "#c84a5a", b: "#4a8ae8", g: "#5cc46a", y: "#f2d24b" },
  frames: [
    [
      E16,
      E16,
      "oooo............",
      "orro............",
      "oooo.oooo.......",
      ".....obbo.......",
      ".....oooo.oooo..",
      "..........oggo..",
      "..........oooo..",
      "...........oooo.",
      "...........oyyo.",
      "...........oooo.",
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: a long wriggly trail in the cellar dust – no footprints at all. */
export const bladdraTrail: PixelSprite = {
  palette: { ".": null, d: "#3e3848", D: "#9a94a8" },
  frames: [
    [
      E16,
      E16,
      E16,
      E16,
      "..DDD.......DDD.",
      ".DdddD.....DdddD",
      "Dd...dD...Dd...d",
      "d.....dDDDd.....",
      ".......ddd......",
      E16,
      E16,
      E16,
      E16,
      E16,
      E16,
      E16,
    ],
  ],
};

/** Clue: a practice sheet – B O K written over and over, erased bits, and a crumbly pink eraser. */
export const bladdraPractice: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#f4ecd8", k: "#5a4a6a", g: "#c8bca8", p: "#ff9ab8" },
  frames: [
    [
      E16,
      ".oooooooooooooo.",
      ".owwwwwwwwwwwwo.",
      ".okkwwkkkwkwkwo.",
      ".okwkwkwkwkkwwo.",
      ".okkwwkwkwkwwwo.",
      ".okwkwkwkwkkwwo.",
      ".okkwwkkkwkwkwo.",
      ".owwwwwwwwwwwwo.",
      ".owgggwwgggwwwo.",
      ".owwwwwwwwwwwwo.",
      ".oooooooooooooo.",
      "..........oooo..",
      "........p.oppo..",
      "......p...oooo..",
      E16,
    ],
  ],
};

/** A little fort of library books in the cellar, with a faint blue glow in the middle. */
export const bladdraFort: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    r: "#c84a5a",
    b: "#4a8ae8",
    g: "#5cc46a",
    y: "#f2d24b",
    c: "#b8f0ff",
    C: "#7ac8e8",
  },
  frames: [
    [
      E16,
      E16,
      E16,
      ".oooo......oooo.",
      ".orro......obbo.",
      ".oooo......oooo.",
      ".oggo......oyyo.",
      ".oooo..cc..oooo.",
      ".obbo.cCCc.orro.",
      ".oooo.cCCc.oooo.",
      ".oyyo..cc..oggo.",
      ".oooooooooooooo.",
      ".orrrbbbgggyyyo.",
      ".oooooooooooooo.",
      ".obbbrrryyygggo.",
      ".oooooooooooooo.",
    ],
  ],
};

/** An old wooden chest in the cellar – Viskan has moved in. */
export const libraryChest: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#8a5a2a", W: "#5a3a1a", y: "#c9a02a", k: "#1a1024" },
  frames: [
    [
      E16,
      E16,
      E16,
      "..oooooooooooo..",
      ".owwwwwwwwwwwwo.",
      ".owwwwwwwwwwwwo.",
      ".oyooooooooooyo.",
      ".owwwwwyywwwwwo.",
      ".owwwwwykwwwwwo.",
      ".owwwwwwwwwwwwo.",
      ".owwwwwwwwwwwwo.",
      ".oyWWWWWWWWWWyo.",
      ".oWWWWWWWWWWWWo.",
      ".oyWWWWWWWWWWyo.",
      ".oooooooooooooo.",
      E16,
    ],
  ],
};

/** Clue: a note in mirror writing, signed with a backwards S. */
export const cellarMirrorNote: PixelSprite = {
  palette: { ".": null, o: "#1a1024", w: "#e8e0cc", k: "#2a1a2e", d: "#6a6478" },
  frames: [
    [
      E16,
      E16,
      "...oooooooooo...",
      "...owwwwwwwwo...",
      "...owkwkkwkwo...",
      "...owwwwwwwwo...",
      "...okkwkwkkwo...",
      "...owwwwwwwwo...",
      "...owwwkkkwwo...",
      "...owwwwwkwwo...",
      "...owwwkkkwwo...",
      "...owwwkwwwwo...",
      "...odwwkkkwdo...",
      "...oooooooooo...",
      E16,
      E16,
    ],
  ],
};

/** The window at the top of the library tower: blue sky, a cloud and red town roofs far below. */
export const towerWindow: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024",
    F: "#a8744a", // frame
    f: "#7a4f2a", // window bars
    S: "#b8dcff", // sky
    s: "#8ac0ec", // sky, lower
    w: "#ffffff", // cloud
    r: "#c95050", // roofs
    R: "#a33a3a", // roofs, dark
    g: "#4ea84a", // a treetop
  },
  frames: [
    [
      E16,
      ".....ooooooo....",
      "...ooFFFFFFFoo..",
      "..oFSSSSfSSSSFo.",
      "..oFSwwSfSSSSFo.",
      "..oFwwwwfSSwSFo.",
      "..oFSSSSfSwwwFo.",
      "..oFfffffffffFo.",
      "..oFssssfssssFo.",
      "..oFsrrsfsssgFo.",
      "..oFrrrrfsrrgFo.",
      "..oFRRRRfrrrrFo.",
      "..oFRRRRfRRRRFo.",
      "..oFFFFFFFFFFFo.",
      ".oFFFFFFFFFFFFFo",
      ".oooooooooooooo.",
    ],
  ],
};

const EMPTY = "................";

/** A booklouse – a tiny pale bug that lives in old books. Harmless, and it scurries off fast. */
export const libraryBooklouse: PixelSprite = {
  palette: { ".": null, o: "#5a4a3a", w: "#e8dcc4", W: "#c8b894", k: "#1a1024" },
  frames: [
    [
      ...Array<string>(10).fill(EMPTY),
      "...........o.o..",
      "....oooooooo.o..",
      "...owWwWwWwwoo..",
      "..owwwwwwwwwkwo.",
      "...oooooooooooo.",
      "....o.o.o.o.o...",
    ],
    [
      ...Array<string>(10).fill(EMPTY),
      "...........o.o..",
      "....oooooooo.o..",
      "...owWwWwWwwoo..",
      "..owwwwwwwwwkwo.",
      "...oooooooooooo.",
      ".....o.o.o.o.o..",
    ],
  ],
  frameRate: 12,
};

export const case3Sprites: Record<string, PixelSprite> = {
  libraryBooklouse,
  bodil,
  pelle,
  bladdra,
  ugo,
  ugoRest,
  dammis,
  libraryBook,
  bookCart,
  libraryMissingList,
  messyBooks,
  eraserCrumbs,
  moonstoneBook,
  bookTrail,
  bladdraTrail,
  bladdraPractice,
  bladdraFort,
  libraryChest,
  cellarMirrorNote,
  towerWindow,
};
