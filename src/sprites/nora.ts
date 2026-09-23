import type { PixelSprite } from "./pixelSprite";

// Detective Nora, from the architect's drawing (assets/bilder/teckningar/nora.jpg):
// long green hair with brown clips, black jacket, teal/purple top, brown belt,
// burgundy skirt with green stripes and yellow hem, grey tights, red boots.
// 16 × 20 pixels. Frames are a body (16 rows) plus legs (4 rows).

const front = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhco..",
  "..ohhsssssshho..",
  "..ohsessssesho..",
  "..ohssssssssho..",
  "..ohsssmmsssho..",
  "..ohhhssssshho..",
  ".ohhjjjttjjjhho.",
  ".ohhjjvvvvjjhho.",
  ".ohjjjVVVVjjjho.",
  "..sjjjvvvvjjjs..",
  "...ojccccccjo...",
  "...orrgrrgrro...",
  "..orrgrrrrgrro..",
  "..oyyyyyyyyyyo..",
];

const back = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhco..",
  "..ohhhhhhhhhho..",
  "..ohhhhHhhhhho..",
  "..ohhhhHhhhhho..",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  ".ohhjjhhhhjjhho.",
  ".ohhjjhhhhjjhho.",
  ".ohjjjhHHhjjjho.",
  "..sjjjjjjjjjjs..",
  "...ojccccccjo...",
  "...orrgrrgrro...",
  "..orrgrrrrgrro..",
  "..oyyyyyyyyyyo..",
];

const side = [
  ".....ooooooo....",
  "....ohhhhhhho...",
  "...ohhhhhhhhco..",
  "...ohhhhhssso...",
  "...ohhhhhsesso..",
  "...ohhhhhsssso..",
  "...ohhhhhssmo...",
  "...ohhhhhhsso...",
  "...ohhhhjjjto...",
  "...ohhhjjjjvo...",
  "...ohhjjjjjVo...",
  "....ohjjjsjvo...",
  ".....ojccccco...",
  ".....orrgrrro...",
  "....orrgrrrrro..",
  "....oyyyyyyyyo..",
];

const legsStand = ["....olo..olo....", "....olo..olo....", "...offo..offo...", "....oo....oo...."];
const legsStepA = ["....olo..olo....", "....olo..offo...", "...offo...oo....", "....oo.........."];
const legsStepB = ["....olo..olo....", "...offo..olo....", "....oo...offo...", "..........oo...."];
const sideStand = ["......olo.......", "......olo.......", "......offfo.....", ".......ooo......"];
const sideStep = [".....olo.olo....", "....olo...olo...", "...offo....offo.", "....oo......oo.."];

export const nora: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024", // outline
    h: "#6cc24a", // hair
    H: "#3f8a2e", // hair shade
    c: "#7a3b1e", // hair clip / belt
    s: "#f5c8a0", // skin
    e: "#2a1a2e", // eyes
    m: "#b05050", // mouth
    j: "#262233", // jacket
    t: "#1f9fb0", // teal top
    v: "#9b6bd6", // purple stripe
    V: "#6a45a8", // purple stripe, dark
    r: "#8a2346", // skirt
    g: "#2a8a6a", // skirt stripe
    y: "#f2d24b", // skirt hem
    l: "#8a86a0", // tights
    f: "#d23b3b", // red boots
  },
  frames: [
    [...front, ...legsStand], // 0 down
    [...front, ...legsStepA], // 1
    [...front, ...legsStepB], // 2
    [...back, ...legsStand], // 3 up
    [...back, ...legsStepA], // 4
    [...back, ...legsStepB], // 5
    [...side, ...sideStand], // 6 side (facing right; flipped for left)
    [...side, ...sideStep], // 7
  ],
  animations: {
    "walk-down": { frames: [1, 0, 2, 0], frameRate: 8 },
    "walk-up": { frames: [4, 3, 5, 3], frameRate: 8 },
    "walk-side": { frames: [7, 6], frameRate: 6 },
  },
};

export const NORA_IDLE_FRAME = { down: 0, up: 3, side: 6 } as const;
