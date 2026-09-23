import type { PixelSprite } from "./pixelSprite";

// Ester, Nora's friend and helper – from the architect's drawing
// (assets/bilder/teckningar/ester.jpg): long pink hair, yellow cardigan with
// grey dots and a green bow, blue top, rainbow skirt, pink tights, teal shoes.
// Shorter than Nora, like a little sister: 16 × 17, body (14 rows) + legs (3 rows).

const front = [
  ".....oooooo.....",
  "....ohhhhhho....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohssssssssho..",
  "..ohsessssesho..",
  "..ohsssmmsssho..",
  "..ohhossssohho..",
  "..ohybbbbgyyho..",
  "..ohydbbbbdyho..",
  "..syydbbbbdyys..",
  "...o12345677o...",
  "..o1123456677o..",
  "..o1223456777o..",
];

const back = [
  ".....oooooo.....",
  "....ohhhhhho....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..ohyhhhhhhyho..",
  "..ohyyhhhhyyho..",
  "..syyyyyyyyyys..",
  "...o12345677o...",
  "..o1123456677o..",
  "..o1223456777o..",
];

const side = [
  "....oooooo......",
  "...ohhhhhho.....",
  "..ohhhhhhhho....",
  "..ohhhhhhhhho...",
  "..ohhhhhsssso...",
  "..ohhhhhsseso...",
  "..ohhhhhsssmo...",
  "..ohhhhhsso.....",
  "..ohhhyybgo.....",
  "..ohhyyybbo.....",
  "...ohyyysyo.....",
  "...o1234567o....",
  "...o12345677o...",
  "..o112345677o...",
];

const legsStand = ["....opo..opo....", "...otto..otto...", "....oo....oo...."];
const legsStepA = ["....opo..otto...", "...otto...oo....", "....oo.........."];
const legsStepB = ["...otto..opo....", "....oo...otto...", "..........oo...."];
const sideStand = ["......opo.......", ".....ottto......", "......ooo......."];
const sideStep = [".....opo.opo....", "....otto..otto..", ".....oo....oo..."];

export const ester: PixelSprite = {
  palette: {
    ".": null,
    o: "#1a1024", // outline
    h: "#f28ac0", // pink hair
    s: "#f5c8a0", // skin
    e: "#2a1a2e", // eyes
    m: "#c0506a", // mouth
    y: "#f7d23e", // yellow cardigan
    d: "#9a96aa", // grey dots
    b: "#2f5fb8", // blue top
    g: "#2f8a3a", // green bow
    "1": "#4fb84a", // rainbow skirt…
    "2": "#f2d24b",
    "3": "#f07a3a",
    "4": "#5ab8e8",
    "5": "#1f9f9f",
    "6": "#2a2a5a",
    "7": "#8a4ac8",
    p: "#e87ab0", // pink tights
    t: "#1f8a8a", // teal shoes
  },
  frames: [
    [...front, ...legsStand], // 0 down
    [...front, ...legsStepA], // 1
    [...front, ...legsStepB], // 2
    [...back, ...legsStand], // 3 up
    [...back, ...legsStepA], // 4
    [...back, ...legsStepB], // 5
    [...side, ...sideStand], // 6 side (facing right)
    [...side, ...sideStep], // 7
  ],
  animations: {
    "walk-down": { frames: [1, 0, 2, 0], frameRate: 8 },
    "walk-up": { frames: [4, 3, 5, 3], frameRate: 8 },
    "walk-side": { frames: [7, 6], frameRate: 6 },
  },
};

/** Yellow "!" bubble shown above Ester when she has a hint. */
export const alertBubble: PixelSprite = {
  palette: { ".": null, o: "#1a1024", y: "#ffd66b" },
  frames: [
    [
      ".ooooo.",
      "oyyyyyo",
      "oyyoyyo",
      "oyyoyyo",
      "oyyoyyo",
      "oyyyyyo",
      "oyyoyyo",
      "oyyyyyo",
      ".ooooo.",
      "..ooo..",
      "...o...",
    ],
  ],
};
