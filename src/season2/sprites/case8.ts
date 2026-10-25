import { drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// Case 8 – the school at night (see SEASON2.md – spoilers).
// The s2… sprites are PLACEHOLDERS for Nora's characters (names in names.ts); they will be
// redrawn from her drawings. Everything else is prefixed "school".

const O = "#1a1024";

/** A sprite written as text rows, with a shared palette. */
function grid(palette: Record<string, string | null>, ...frames: string[][]): PixelSprite {
  return { palette: { ".": null, o: O, ...palette }, frames };
}

// ---------- Placeholders for Nora's characters ----------

/**
 * The teacher (S2.teacher), from Nora's drawing: yellow hair to her shoulders, big round eyes and
 * a smile, a rainbow-striped shirt with a purple heart, short striped sleeves with red cuffs, jeans and black shoes.
 */
export const s2Teacher: PixelSprite = drawSprite(16, 20, (d) => {
  const SKIN = "#e8a868";
  d.part((p) => p.ellipse(8, 4, 5, 4, "#ecc840").rect(3, 4, 10, 5, "#ecc840").paint((x, y) => y > 5 && (x === 3 || x === 12), "#d4ac30"));
  d.part((p) =>
    p
      .line(4, 9, 2, 12, "#2ab0a0")
      .line(4, 10, 2, 13, "#2ab0a0")
      .line(11, 9, 13, 12, "#2ab0a0")
      .line(11, 10, 13, 13, "#2ab0a0")
      .paint((_, y) => y % 3 === 1, "#f08a30")
      .paint((_, y) => y % 3 === 2, "#3a9a4a")
      .paint((_, y) => y === 13, "#902030")
      .rect(1, 14, 2, 2, SKIN)
      .rect(13, 14, 2, 2, SKIN),
  );
  d.part((p) =>
    p
      // Rainbow stripes, one colour per column, and a little purple heart.
      .rect(5, 9, 6, 6, "#d83a3a")
      .paint((x) => x === 6, "#f08a30")
      .paint((x) => x === 7, "#ecd040")
      .paint((x) => x === 8, "#3a9a4a")
      .paint((x) => x === 9, "#2a8ad8")
      .paint((x) => x === 10, "#9a5ad0")
      .set(7, 11, "#3a1a6a")
      .set(9, 11, "#3a1a6a")
      .set(8, 12, "#3a1a6a"),
  );
  d.part((p) => p.rect(5, 15, 2, 4, "#3a9ad8").rect(9, 15, 2, 4, "#3a9ad8").rect(4, 19, 3, 1, "#3a3a44").rect(9, 19, 3, 1, "#3a3a44"));
  d.part((p) =>
    p
      .ellipse(8, 5.5, 3, 3, SKIN)
      .set(6, 5, "#ffffff")
      .set(7, 5, O)
      .set(9, 5, "#ffffff")
      .set(10, 5, O)
      .set(7, 7, "#a02a3a")
      .set(8, 7, "#a02a3a")
      .set(9, 7, "#a02a3a")
      .set(8, 9, SKIN),
  );
  d.part((p) => p.rect(5, 2, 7, 1, "#ecc840").set(8, 1, "#ecc840"), false);
});

/**
 * The janitor (S2.janitor), from the kids' drawing: a big cap (it was yellow – now it's grey), an
 * open, cheerful mouth, a magenta shirt, brown trousers, big boots and a broom.
 */
export const s2Janitor: PixelSprite = drawSprite(16, 20, (d) => {
  const SKIN = "#f0b060";
  d.part((p) => p.line(1, 5, 1, 15, "#8a5a2a").tri(1, 14, -1, 19, 4, 19, "#e0902a").paint((x, y) => y > 15 && x % 2 === 0, "#b86a1a"));
  d.part((p) => p.line(5, 15, 5, 17, "#9a6a40").line(6, 15, 6, 17, "#9a6a40").line(9, 15, 10, 17, "#9a6a40").line(10, 15, 11, 17, "#9a6a40"));
  d.part((p) => p.rect(3, 18, 4, 2, "#4a2a1a").rect(9, 18, 4, 2, "#4a2a1a"));
  d.part((p) => p.line(4, 12, 2, 13, SKIN).line(4, 13, 2, 14, SKIN).line(11, 12, 13, 13, SKIN).line(11, 13, 13, 14, SKIN).ellipse(13.5, 14, 1.5, 1.5, SKIN).rect(1, 12, 2, 2, SKIN));
  d.part((p) => p.rect(5, 11, 6, 4, "#b02070").paint((x, y) => y === 14 && x % 2 === 0, "#8a1858"));
  d.part((p) =>
    p
      .ellipse(8, 7.5, 4, 3, SKIN)
      .set(6, 7, O)
      .set(10, 7, O)
      .rect(7, 9, 3, 1, O)
      .set(8, 10, "#e05080"),
  );
  d.part((p) => p.ellipse(8, 2.5, 4.5, 2.5, "#9a9aa4", 4).rect(3, 4, 11, 1, "#6e6e7a").paint((x, y) => y < 2 && x % 3 === 0, "#b4b4c0"));
});

/**
 * The sponge monster (S2.sponge): a light yellow sponge with a green scrubby top. Like everything
 * yellow at the school its colour has faded, so it is drawn washed-out. Frames 0–1: scuttling.
 */
export const s2Sponge: PixelSprite = (() => {
  const body = [
    "................",
    "................",
    "..oooooooooooo..",
    "..oggggggggggo..",
    "..oGgGgGgGgGgo..",
    "..oooooooooooo..",
    "..obbbbbbbbbbo..",
    "..obwwbbbbwwbo..",
    "..obwebBbbwebo..",
    "..obbbbbbbbbbo..",
    "..obBbmmmmbBbo..",
    "..obbbbmmbbbBo..",
    "..oBbbbbbbBbbo..",
    "..oooooooooooo..",
  ];
  return grid(
    { g: "#4aa85a", G: "#2a6a3a", b: "#e6e2b8", B: "#c2be96", w: "#ffffff", e: O, m: "#c04060" },
    [...body, "...o.o....o.o...", "..oo......oo...."],
    [...body, "....o.o..o.o....", "....oo....oo...."],
  );
})();

/** The chalk monster (S2.chalk). Frame 0: sneaking, glowing red eyes. Frame 1: frozen, eyes shut. */
export const s2Chalk: PixelSprite = (() => {
  const palette = { w: "#f4f4f0", W: "#c8c8c4", r: "#ff4a4a", R: "#a02020", b: O, m: "#3a2a3a", t: "#ffffff", d: "#e0e0dc" };
  const legs = ["....oWWWWWWo....", "....ooo..ooo....", "..d.........d...", "................"];
  return grid(
    palette,
    [
      "................",
      ".....oooooo.....",
      "....owwwwwwo....",
      "....owwwwwwo....",
      "....obwwwwbo....",
      "....owbwwbwo....",
      "....orRwwRro....",
      "....owwwwwwo....",
      "....ommmmmmo....",
      "....omtmtmto....",
      "....owwwwwwo....",
      "..oooWwwwwWooo..",
      "....owwwwwWo....",
      "....owwwwwWo....",
      "....oWwwwwWo....",
      "....owwwwwWo....",
      ...legs,
    ],
    [
      "................",
      ".....oooooo.....",
      "....owwwwwwo....",
      "....owwwwwwo....",
      "....owwwwwwo....",
      "....owwwwwwo....",
      "....obbwwbbo....",
      "....owwwwwwo....",
      "....owmmmmwo....",
      "....owwwwwwo....",
      "....owwwwwwo....",
      "....oWwwwwWo....",
      "...oowwwwwWoo...",
      "....owwwwwWo....",
      "....oWwwwwWo....",
      "....owwwwwWo....",
      ...legs,
    ],
  );
})();

/** The class pet (S2.classPet): a white rabbit with grey-brown spots and long ears. */
export const s2ClassPet: PixelSprite = grid(
  { w: "#f4f0ec", s: "#8a7a68", p: "#f0a0b0", e: O, n: "#ff8ab0" },
  [
    "....oo....oo....",
    "...owwo..owwo...",
    "...owpo..opso...",
    "...owpo..opwo...",
    "...oswo..owwo...",
    "...owwwwwwwwo...",
    "..owwwwwwwsswo..",
    "..owewwwwwwewo..",
    "..owwwwnnwwwwo..",
    "...owwwwwwwwo...",
    "..owwsswwwwwwo..",
    ".owwssswwwwswwo.",
    ".owwwwwwwssssso.",
    ".owsswwwwwsswwo.",
    "..oowwoooowwoo..",
    "...oooo..oooo...",
  ],
);

/** The class's turtle (S2.turtle) in his glass terrarium, with sand and a lettuce leaf. */
export const s2Turtle = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 12, 14, 3, "#c05050"));
  d.part((p) => p.rect(2, 5, 12, 7, "#d8f0f8").rect(2, 10, 12, 2, "#e8d49a").set(4, 6, "#ffffff").set(5, 7, "#ffffff"));
  d.part((p) => p.rect(12, 9, 2, 1, "#6ac050").set(13, 8, "#6ac050"));
  d.part((p) => p.ellipse(7, 10, 3.5, 3, "#3a8a4a", 9).paint((x, y) => (x + y) % 2 === 0, "#2a6a3a").rect(4, 10, 1, 1, "#8ac070").rect(9, 10, 1, 1, "#8ac070"));
  d.part((p) => p.rect(10, 8, 2, 2, "#8ac070").set(11, 8, O), false);
});

// ---------- Other characters ----------

/** Benke, the school skeleton, who walks the corridor at night. Frames 0–1: walking. */
export const schoolSkeleton: PixelSprite = (() => {
  const top = [
    "................",
    ".....oooooo.....",
    "....owwwwwwo....",
    "...owwwwwwwwo...",
    "...oweewweewo...",
    "...owgewwegwo...",
    "...owwweewwwo...",
    "....oweweweo....",
    ".....oooooo.....",
    ".......oo.......",
    "...ooowwwwooo...",
    "..ow.oweweo.wo..",
    "..ow.owwwwo.wo..",
    "..ow.oweweo.wo..",
    ".ow...owwo...wo.",
    "......owwo......",
  ];
  return grid(
    { w: "#f0ecd8", e: O, g: "#7af0ff" },
    [...top, ".....ow..wo.....", ".....ow..wo.....", "....oww..wwo....", "....ooo..ooo...."],
    [...top, "....ow....wo....", "...ow......wo...", "...oww....wwo...", "...ooo....ooo..."],
  );
})();

// ---------- Things ----------

/** The school bus – yesterday it was yellow. */
export const schoolBus = drawSprite(28, 16, (d) => {
  d.part((p) =>
    p
      .rect(1, 2, 26, 10, "#9a9a9e")
      .rect(1, 9, 26, 1, "#6e6e74")
      .rect(3, 4, 4, 3, "#bcd0dc")
      .rect(8, 4, 4, 3, "#bcd0dc")
      .rect(13, 4, 4, 3, "#bcd0dc")
      .rect(18, 4, 4, 3, "#bcd0dc")
      .rect(23, 3, 3, 5, "#8a8a90")
      .set(26, 10, "#c8c8c8")
      .set(1, 10, "#c8c8c8"),
  );
  d.part((p) => p.ellipse(6, 12.5, 2, 2, "#2a2a30").set(6, 12, "#6a6a70"));
  d.part((p) => p.ellipse(21, 12.5, 2, 2, "#2a2a30").set(21, 12, "#6a6a70"));
});

/** Sunflowers that have lost their yellow and hang their heads. */
export const schoolSunflowers = drawSprite(16, 20, (d) => {
  d.part((p) => p.line(5, 8, 5, 19, "#4a8a3a").line(11, 6, 11, 19, "#4a8a3a").rect(6, 13, 2, 1, "#4a8a3a").rect(9, 11, 2, 1, "#4a8a3a"), false);
  d.part((p) => p.ellipse(4, 7, 3, 2.5, "#b4b2aa").ellipse(4, 7.5, 1.5, 1.2, "#4a3a2e"));
  d.part((p) => p.ellipse(12, 5, 3, 2.5, "#b4b2aa").ellipse(12, 5.5, 1.5, 1.2, "#4a3a2e"));
});

/** The blackboard: almost wiped clean, still wet – but numbers in one corner. */
export const schoolBoard = drawSprite(24, 16, (d) => {
  d.part((p) => p.rect(0, 1, 24, 13, "#8a5a2a"));
  d.part((p) => {
    p.rect(1, 2, 22, 11, "#2e4a3a");
    for (let x = 3; x < 17; x += 4) p.line(x, 4, x + 3, 9, "#44664f").line(x + 1, 9, x + 3, 5, "#44664f");
    p.set(18, 4, "#f4f4f0").set(20, 4, "#f4f4f0").set(18, 6, "#f4f4f0").set(19, 6, "#f4f4f0").set(21, 6, "#f4f4f0").set(19, 8, "#f4f4f0").set(21, 8, "#f4f4f0");
  }, false);
  d.part((p) => p.rect(2, 13, 20, 2, "#6a4220").set(6, 13, "#f4f4f0").set(7, 13, "#f4f4f0"));
});

/** The empty rabbit cage – the latch is shut and the carrot is untouched. */
export const schoolCage = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 12, 14, 3, "#c05050"));
  d.part((p) => {
    p.rect(2, 4, 12, 1, "#a0a0b0").rect(2, 4, 1, 8, "#a0a0b0").rect(13, 4, 1, 8, "#a0a0b0");
    for (let x = 4; x < 13; x += 2) p.line(x, 4, x, 11, "#a0a0b0");
    p.line(9, 11, 12, 11, "#f08a30").set(13, 10, "#4aa85a").set(13, 11, "#4aa85a");
    p.rect(4, 11, 4, 1, "#c8b878").set(8, 7, "#c8c8d0");
  }, false);
});

/** The cleaning cupboard where the sponge monster lives – a bucket, a mop and a tiny bed of dishcloths. */
export const schoolCupboard = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(2, 1, 12, 18, "#7a8aa0"));
  d.part((p) => {
    p.rect(3, 2, 7, 16, "#2a2a3a");
    p.line(4, 3, 4, 14, "#c09060").rect(3, 14, 3, 2, "#e0e0e0");
    p.rect(6, 13, 3, 4, "#5a9ad0").set(6, 13, "#8ac0f0");
    p.rect(3, 17, 6, 1, "#e07070");
    p.rect(10, 2, 3, 16, "#95a4b8").set(11, 10, "#d0d0d8");
  }, false);
});

/** The locked store cupboard with a code lock. */
export const schoolStoreCupboard = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(2, 1, 12, 18, "#a0703a").rect(7, 1, 1, 18, "#7a5028").rect(3, 3, 3, 1, "#b8864a").rect(9, 3, 3, 1, "#b8864a"));
  d.part((p) => p.rect(6, 8, 4, 4, "#c8c8d0").set(7, 9, "#2a2a30").set(8, 9, "#2a2a30").set(7, 10, "#2a2a30").set(8, 10, "#2a2a30"));
});

/** The school calendar, with a big red ring around Saturday. */
export const schoolCalendar = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 2, 12, 12, "#f4f0e4"));
  d.part((p) => {
    p.rect(2, 2, 12, 2, "#c04848");
    for (let y = 6; y < 14; y += 3) for (let x = 4; x < 13; x += 3) p.set(x, y, "#8a86a0");
    p.ellipse(10, 9, 2, 1.5, "#e04848").set(10, 9, "#8a86a0");
  }, false);
});

/** A half-made card with cut-out letters all over the place. */
export const schoolLetters = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 5, 10, 8, "#f4a0c0"));
  d.part((p) => p.rect(9, 2, 3, 3, "#4a90e2"));
  d.part((p) => p.rect(12, 8, 3, 3, "#e04848"));
  d.part((p) => p.rect(4, 12, 3, 3, "#5cc46a"));
  d.part((p) => p.set(4, 7, "#ffffff").set(7, 9, "#ffffff").set(10, 7, "#ffffff"), false);
});

/** A shoebox with air holes – something is snoring inside. */
export const schoolShoebox = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 7, 12, 7, "#c09060").rect(1, 5, 14, 2, "#a07040"));
  d.part((p) => p.set(5, 10, O).set(8, 10, O).set(11, 10, O).set(13, 12, "#d89048").set(14, 12, "#d89048"), false);
  d.part((p) => p.line(11, 1, 13, 1, "#8a86a0").line(13, 1, 11, 3, "#8a86a0").line(11, 3, 13, 3, "#8a86a0"), false);
});

/** Balloons from the store cupboard – the yellow ones have turned grey. */
export const schoolBalloons = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(5, 8, 8, 15, "#6a6a7a").line(11, 7, 8, 15, "#6a6a7a").line(8, 9, 8, 15, "#6a6a7a"), false);
  d.part((p) => p.ellipse(5, 5, 2.5, 3, "#e04848").set(4, 3, "#ff9a9a"));
  d.part((p) => p.ellipse(11, 4, 2.5, 3, "#a8a8a8").set(10, 2, "#d0d0d0"));
  d.part((p) => p.ellipse(8, 7, 2.5, 3, "#4a90e2").set(7, 5, "#9ac4ff"));
});

// ---------- Clues ----------

/** Wet, square prints with little holes – like something soft and wet pressed down. */
export const schoolWetPrints = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[2, 2], [9, 5], [3, 10]]) {
    d.part((p) => p.rect(x, y, 5, 4, "#7ab0d0").set(x + 1, y + 1, "#4a80a8").set(x + 3, y + 2, "#4a80a8").set(x + 2, y + 3, "#4a80a8"), false);
  }
});

/** White chalk dust. */
export const schoolChalkDust = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(6, 8, 4, 2, "#e8e8e4").ellipse(11, 10, 3, 1.5, "#f4f4f0").set(3, 4, "#e8e8e4").set(13, 5, "#e8e8e4").set(9, 13, "#d8d8d4"), false);
});

/** Big muddy boot prints. */
export const schoolBootPrints = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 2, 4, 6, "#7a5a3a").rect(2, 9, 4, 2, "#7a5a3a"), false);
  d.part((p) => p.rect(9, 5, 4, 6, "#7a5a3a").rect(9, 12, 4, 2, "#7a5a3a"), false);
});

/** Soap bubbles and wet spots on the floor. */
export const schoolSoapTrail = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(4, 11, 3, 1.5, "#8ab8d8").ellipse(11, 13, 3, 1.5, "#8ab8d8"), false);
  for (const [x, y, r] of [[4, 5, 2], [10, 4, 2.5], [8, 9, 1.5], [13, 8, 1]]) {
    d.part((p) => p.ellipse(x, y, r, r, "#e8f4ff").set(x - 1, y - 1, "#ffffff"));
  }
});

/** Yellow paint drips on the floor, beside tiny grey drawn footprints. */
export const schoolYellowDrips = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[4, 4], [8, 7], [5, 11]]) {
    d.part((p) => p.ellipse(x, y, 1.5, 1.5, "#f2d24b").set(x, y + 2, "#f2d24b").set(x - 1, y - 1, "#fff0a0"));
  }
  for (const [x, y] of [[11, 3], [12, 9], [11, 13]]) {
    d.part((p) => p.line(x, y, x + 2, y, "#8a86a0").set(x, y - 1, "#5a566e").set(x + 2, y - 1, "#5a566e"), false);
  }
});

/** The art room window, set in the wall: night sky and the moon, the right half open (ajar). */
export const schoolWindowAjar: PixelSprite = grid(
  { F: "#d8d4c8", f: "#a8a49a", N: "#1e2a4a", n: "#2e3e66", m: "#f4ecc0", y: "#ffffff", G: "#7a7a84", g: "#5a5a62" },
  [
    "................",
    "..oooooooooo....",
    "..oFFFFFFFFFo...",
    "..oFNNNfNNmFoo..",
    "..oFNyNfNmmFGgo.",
    "..oFNNNfNNNFGgo.",
    "..oFffffNNNFGgo.",
    "..oFnnnfnnnFGgo.",
    "..oFnnnfnnnFGgo.",
    "..oFnnnfnnnFGo..",
    "..oFFFFFFFFFo...",
    ".oFFFFFFFFFFFo..",
    ".ooooooooooooo..",
    "................",
    "................",
    "................",
  ],
);

export const case8Sprites: Record<string, PixelSprite> = {
  s2Teacher,
  s2Janitor,
  s2Sponge,
  s2Chalk,
  s2ClassPet,
  s2Turtle,
  schoolSkeleton,
  schoolBus,
  schoolSunflowers,
  schoolBoard,
  schoolCage,
  schoolCupboard,
  schoolStoreCupboard,
  schoolCalendar,
  schoolLetters,
  schoolShoebox,
  schoolBalloons,
  schoolWetPrints,
  schoolChalkDust,
  schoolBootPrints,
  schoolSoapTrail,
  schoolYellowDrips,
  schoolWindowAjar,
};
