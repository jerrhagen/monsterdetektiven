import { type Painter, drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// Sprites for case 11 – the fair (see SEASON2.md – spoilers).
// s2Director, s2Clown and s2MirrorGhost are placeholders until Nora has drawn them.

const INK = "#1a1024";
const GOLD = "#e0b040";
const GOLD_DARK = "#a8782a";
const GLASS = "#cfe0f0";
const GLASS_DARK = "#9ab4cc";
const WHITE = "#ffffff";
const RED = "#c83a3a";
const RED_DARK = "#8a2430";
const GREY = "#a8a4b0";
const GREY_DARK = "#7a7684";
const PAPER = "#f4f0e4";
const ORANGE = "#f07a3a";
const PINK = "#f8a8d0";
const PINK_LIGHT = "#ffd6ea";
const WOOD = "#a8744a";
const WOOD_DARK = "#6e4a2a";
const SKIN = "#f0c8a0";

/** Several frames drawn with shapes, merged into one sprite with a shared palette. */
function framesOf(w: number, h: number, draws: ((d: Painter) => void)[]): PixelSprite {
  const pictures = draws.map((draw) => drawSprite(w, h, draw));
  const palette: Record<string, string | null> = { ".": null };
  const keyOf = new Map<string, string>();
  const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const frames = pictures.map((pic) =>
    pic.frames[0].map((row) =>
      [...row]
        .map((ch) => {
          const colour = pic.palette[ch];
          if (!colour) return ".";
          let k = keyOf.get(colour);
          if (!k) {
            k = keys[keyOf.size];
            keyOf.set(colour, k);
            palette[k] = colour;
          }
          return k;
        })
        .join(""),
    ),
  );
  return { palette, frames };
}

// ---------------------------------------------------------------------------------------------
// Nora's characters (placeholders).
// ---------------------------------------------------------------------------------------------

/** The fair's director (S2.director): tall top hat, big moustache, red coat – with a hole in the pocket. */
export const s2Director: PixelSprite = drawSprite(16, 20, (d) => {
  // Top hat with a red band.
  d.part((p) => p.rect(5, 0, 6, 5, "#2a2436").rect(5, 4, 6, 1, RED).rect(3, 5, 10, 1, "#2a2436"));
  // Face and moustache.
  d.part((p) =>
    p
      .ellipse(8, 8.5, 3.5, 2.5, SKIN)
      .set(6, 8, INK)
      .set(10, 8, INK)
      .set(8, 9, "#e0a080"),
  );
  d.part((p) => p.line(5, 10, 11, 10, "#5a3a2a").set(4, 9, "#5a3a2a").set(12, 9, "#5a3a2a"), false);
  // Red coat over a round belly, gold buttons, and the torn pocket.
  d.part((p) =>
    p
      .ellipse(8, 14.5, 5.5, 3.5, RED)
      .rect(4, 11, 8, 3, RED)
      .paint((x) => x === 8, "#f4ecd8")
      .set(8, 12, "#f2d24b")
      .set(8, 14, "#f2d24b")
      .set(8, 16, "#f2d24b")
      .rect(10, 15, 3, 1, RED_DARK)
      .set(11, 16, INK),
  );
  // Legs and shoes.
  d.part((p) => p.rect(5, 18, 2, 2, "#2a2436").rect(9, 18, 2, 2, "#2a2436"));
});

function drawClown(d: Painter, step: number): void {
  // Big shoes.
  d.part((p) => p.ellipse(4 + step, 18.5, 3, 1, "#e04848").ellipse(12 - step, 18.5 - step, 3, 1, "#e04848"));
  // A round striped body.
  d.part((p) =>
    p.ellipse(8, 14, 5, 3.5, "#f2d24b").paint((x) => Math.floor(x / 2) % 2 === 0, "#4a90e2"),
  );
  // White clown face with a red nose and a big smile.
  d.part((p) =>
    p
      .ellipse(8, 7, 4.5, 4, "#f8f4ec")
      .set(6, 6, INK)
      .set(10, 6, INK)
      .set(6, 5, "#4a90e2")
      .set(10, 5, "#4a90e2")
      .line(6, 10, 10, 10, "#e04848")
      .set(5, 9, "#e04848")
      .set(11, 9, "#e04848"),
  );
  d.part((p) => p.ellipse(8, 8, 1, 1, "#e03040").set(7, 7, "#ff9aa0"));
  // Blue curls and a tiny pointed hat.
  d.part((p) => p.ellipse(3, 5, 1.5, 1.5, "#4a90e2").ellipse(13, 5, 1.5, 1.5, "#4a90e2"));
  d.part((p) => p.tri(8, 0, 6, 3, 10, 3, "#8a4ac8").set(8, 0, WHITE));
}

/** The clown (S2.clown): a small round clown who does everything backwards. Frames 0–1: scurrying. */
export const s2Clown: PixelSprite = { ...framesOf(16, 20, [(d) => drawClown(d, 0), (d) => drawClown(d, 1)]), frameRate: 8 };

function drawMirrorGhost(d: Painter, eyesShut: boolean): void {
  d.part((p) => {
    p.ellipse(8, 7, 6, 6.5, GLASS).rect(2, 7, 13, 9, GLASS);
    // A wavy hem.
    for (let x = 2; x <= 14; x++) p.rect(x, 16, 1, x % 3 === 0 ? 3 : 2, GLASS);
    // Silver shine, like light on glass.
    p.paint((x, y) => (x + y) % 7 === 0, WHITE).paint((x, y) => x > 11 && y > 3, GLASS_DARK);
  });
  d.part((p) => {
    if (eyesShut) {
      p.line(4, 7, 6, 7, INK).line(10, 7, 12, 7, INK);
    } else {
      p.ellipse(5, 7, 1.5, 2, INK).ellipse(11, 7, 1.5, 2, INK).set(5, 6, "#8ad8ff").set(11, 6, "#8ad8ff");
    }
    p.ellipse(8, 11, 1, 1, "#4a3a6a");
  }, false);
}

/** The mirror ghost (S2.mirrorGhost), who lives in the glass. Frame 0: eyes open. Frame 1: frozen, eyes shut. */
export const s2MirrorGhost: PixelSprite = framesOf(16, 20, [(d) => drawMirrorGhost(d, false), (d) => drawMirrorGhost(d, true)]);

// ---------------------------------------------------------------------------------------------
// Monsters.
// ---------------------------------------------------------------------------------------------

function drawVaddis(d: Painter, awake: boolean): void {
  // A heap of pink cotton-candy fluff, lying down.
  d.part((p) =>
    p
      .ellipse(12, 10, 10, 4.5, PINK)
      .ellipse(7, 7, 5, 4, PINK)
      .ellipse(17, 8, 5, 3.5, PINK)
      .ellipse(4, 4, 2, 2.5, PINK)
      .ellipse(10, 4, 2, 2.5, PINK)
      .paint((x, y) => (x * 3 + y * 5) % 11 === 0, PINK_LIGHT)
      .paint((x, y) => y >= 13 && x % 4 !== 0, "#e088b8"),
  );
  d.part((p) => {
    if (awake) {
      p.ellipse(5, 7, 1.5, 1.5, WHITE).ellipse(10, 7, 1.5, 1.5, WHITE).set(5, 7, "#c0182c").set(10, 7, "#c0182c");
      p.rect(5, 10, 6, 2, "#6a1a3a").set(6, 10, WHITE).set(8, 10, WHITE).set(10, 10, WHITE);
    } else {
      p.line(4, 7, 6, 7, INK).line(9, 7, 11, 7, INK).line(7, 10, 8, 10, "#6a1a3a");
    }
    p.set(7, 9, "#8a2a5a");
  }, false);
}

/** Vaddis, a huge cotton-candy monster who sleeps in the director's wagon. Frame 0: asleep. Frame 1: awake! */
export const fairVaddis: PixelSprite = framesOf(24, 16, [(d) => drawVaddis(d, false), (d) => drawVaddis(d, true)]);

// ---------------------------------------------------------------------------------------------
// The fair square.
// ---------------------------------------------------------------------------------------------

/** The balloon stand – every orange balloon has turned grey. */
export const fairBalloonsGrey: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.line(4, 7, 7, 14, "#5a566e").line(8, 6, 8, 14, "#5a566e").line(12, 7, 9, 14, "#5a566e"), false);
  d.part((p) => p.ellipse(4, 4, 2.5, 3, GREY).set(3, 3, "#d8d4e0"));
  d.part((p) => p.ellipse(12, 4, 2.5, 3, GREY).set(11, 3, "#d8d4e0"));
  d.part((p) => p.ellipse(8, 3, 2.5, 3, "#b86a6a").set(7, 2, "#e0a0a0"));
  d.part((p) => p.rect(2, 14, 12, 4, "#e04848").paint((x) => x % 4 < 2, "#f4ecd8").rect(3, 18, 2, 2, WOOD_DARK).rect(11, 18, 2, 2, WOOD_DARK));
});

/** One grey balloon drifting over the square. */
export const fairBalloon: PixelSprite = drawSprite(10, 16, (d) => {
  d.part((p) => p.line(5, 9, 4, 12, "#5a566e").line(4, 12, 5, 15, "#5a566e"), false);
  d.part((p) => p.ellipse(5, 4.5, 3.5, 4, GREY).set(3, 2, "#d8d4e0").set(3, 3, "#d8d4e0").set(5, 9, GREY_DARK));
});

/** The ticket booth, with a striped roof and a jar for the money. */
export const fairTicketBooth: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(2, 7, 12, 13, WOOD).rect(4, 9, 8, 5, "#3a2a4a").rect(2, 14, 12, 1, WOOD_DARK));
  d.part((p) => p.tri(8, 0, 0, 6, 15, 6, "#c0303a").paint((x) => x % 4 < 2, "#f4ecd8"));
  d.part((p) => p.rect(9, 11, 3, 3, GLASS).set(10, 12, "#f2d24b").set(9, 13, "#f2d24b"));
  d.part((p) => p.rect(5, 16, 6, 2, PAPER).set(6, 16, INK).set(8, 16, INK).set(9, 17, INK), false);
});

/** The ride schedule: a board on a post with lines of text and a little clock face. */
export const fairSchedule: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(7, 10, 2, 6, WOOD_DARK));
  d.part((p) =>
    p
      .rect(1, 1, 14, 10, PAPER)
      .paint((x, y) => y % 2 === 1 && y > 2 && x > 6 && x < 14 && y < 10, "#5a566e"),
  );
  d.part((p) => p.ellipse(4, 5, 2, 2, WHITE).set(4, 4, INK).set(4, 5, INK).set(5, 5, INK));
});

/** A poster for the new art museum: a painter's palette in a gold frame. */
export const fairPoster: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 0, 12, 15, "#6a4a8a").rect(3, 1, 10, 1, GOLD).rect(3, 13, 10, 1, GOLD));
  d.part((p) =>
    p
      .ellipse(8, 7, 4, 3, "#e8d0a0")
      .set(6, 6, "#e04848")
      .set(8, 5, "#3a7ad8")
      .set(10, 6, "#4fb84a")
      .set(9, 8, "#f2d24b")
      .set(7, 8, "#8a4ac8"),
  );
  d.part((p) => p.rect(4, 11, 8, 1, PAPER), false);
});

/** Little orange drops of paint in the sand, in a trail. */
export const fairOrangeDrops: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[3, 12], [7, 9], [10, 6], [13, 3]]) {
    d.part((p) => p.ellipse(x, y, 1.5, 1, ORANGE).set(x, y - 2, ORANGE).set(x - 1, y - 1, "#ffb888"));
  }
});

/** A paper ticket. */
export const fairTicket: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .rect(1, 4, 14, 8, "#f2d24b")
      .set(1, 7, "#1a1024")
      .set(14, 7, "#1a1024")
      .paint((x) => x === 5, "#c0303a")
      .rect(7, 6, 6, 1, "#8a6a2a")
      .rect(7, 9, 4, 1, "#8a6a2a"),
  );
});

// ---------------------------------------------------------------------------------------------
// The hall of mirrors.
// ---------------------------------------------------------------------------------------------

/** A tall mirror in a gold frame. */
export const fairMirror: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(2, 0, 12, 19, GOLD).rect(3, 19, 2, 1, GOLD_DARK).rect(11, 19, 2, 1, GOLD_DARK));
  d.part((p) =>
    p
      .rect(4, 2, 8, 15, GLASS)
      .paint((x, y) => x + y === 10 || x + y === 11 || x + y === 18, WHITE)
      .paint((x, y) => x > 9 && y > 12, GLASS_DARK),
  );
});

/** A bumpy fun-house mirror that makes you long and thin. */
export const fairMirrorWavy: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => {
    for (let y = 0; y < 19; y++) {
      const bend = Math.round(Math.sin(y / 3) * 1.5);
      p.rect(2 + bend, y, 12 - bend * 2, 1, "#8a4ac8");
    }
  });
  d.part((p) => {
    for (let y = 2; y < 17; y++) {
      const bend = Math.round(Math.sin(y / 3) * 1.5);
      p.rect(4 + bend, y, 8 - bend * 2, 1, GLASS);
    }
    // A long, thin Nora in the glass.
    p.rect(7, 4, 2, 2, SKIN).rect(7, 6, 2, 9, "#e04848").paint((x, y) => y > 12 && x === 7, "#3a2a4a");
  });
});

/** A note stuck on a mirror – the letters face the wrong way. */
export const fairMirrorNote: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(2, 2, 12, 12, PAPER).set(13, 2, "#d8d0c0"));
  d.part((p) => {
    for (const y of [4, 6, 8, 10]) p.line(12, y, 4 + (y % 4), y, "#e04848").set(12, y - 1, "#e04848");
    p.line(10, 12, 6, 12, "#5a566e");
  }, false);
});

// ---------------------------------------------------------------------------------------------
// The carousel.
// ---------------------------------------------------------------------------------------------

/** The middle of the carousel: a striped canopy on a gold pole, with mirrors round it. */
export const fairCarousel: PixelSprite = drawSprite(16, 28, (d) => {
  d.part((p) => p.ellipse(8, 26, 7, 1.5, WOOD).rect(7, 9, 2, 17, GOLD));
  d.part((p) => p.rect(4, 12, 8, 5, GLASS).set(5, 13, WHITE).set(6, 13, WHITE).rect(7, 12, 2, 5, GOLD));
  // Red and grey stripes – the grey ones were orange.
  d.part((p) => p.tri(8, 0, 0, 8, 15, 8, RED).paint((x) => Math.floor(x / 2) % 2 === 1, GREY).set(8, 0, "#f2d24b"));
  d.part((p) => p.rect(0, 8, 16, 2, GOLD).paint((x, y) => y === 9 && x % 3 === 1, GOLD_DARK));
});

/** A carousel horse on its pole – grey as stone now. */
export const fairHorse: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(7, 0, 2, 20, GOLD));
  d.part((p) =>
    p
      .ellipse(9, 11, 5, 2.5, GREY)
      .ellipse(3.5, 7, 2, 1.5, GREY)
      .line(4, 8, 6, 10, GREY)
      .line(5, 8, 7, 10, GREY)
      .line(6, 13, 4, 16, GREY)
      .line(12, 13, 13, 16, GREY)
      .set(3, 6, INK)
      .rect(8, 9, 3, 2, "#8a4ac8")
      .paint((x, y) => y === 8 && x > 4 && x < 8, GREY_DARK),
  );
});

/** The cotton-candy machine: a silver bowl with a pink cloud – and something shiny deep inside. */
export const fairCandyMachine: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(8, 7, 5, 4, PINK).paint((x, y) => (x + y) % 3 === 0, PINK_LIGHT));
  d.part((p) => p.ellipse(8, 11, 6.5, 2.5, "#c8ccd8").rect(2, 11, 13, 1, "#9aa0b0").set(10, 12, "#f2d24b"));
  d.part((p) => p.rect(6, 14, 4, 2, "#9aa0b0"));
});

/** The carousel's control box, with an empty keyhole. */
export const fairControlBox: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(3, 5, 10, 10, RED_DARK).rect(4, 6, 8, 3, "#3a2a4a"));
  d.part((p) => p.set(6, 7, "#5a5a6a").set(9, 7, "#5a5a6a").rect(7, 11, 2, 2, INK).set(7, 13, INK), false);
  d.part((p) => p.line(12, 5, 14, 1, "#9aa0b0").ellipse(14, 1, 1, 1, "#e04848"));
});

/** A roller-coaster car with two seats. */
export const fairCoaster: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(0, 14, 16, 1, "#5a566e").rect(0, 15, 16, 1, WOOD_DARK), false);
  d.part((p) => p.rect(1, 7, 14, 5, "#e04848").rect(2, 4, 3, 3, "#e04848").rect(9, 4, 3, 3, "#e04848").paint((_, y) => y === 9, "#f2d24b"));
  d.part((p) => p.ellipse(4, 12.5, 1.5, 1.5, "#5a566e").ellipse(12, 12.5, 1.5, 1.5, "#5a566e"));
});

/** The carousel key – sticky with sugar crystals. */
export const fairSugarKey: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(4.5, 8, 3, 3, GOLD).set(4, 8, "#fff0c0").rect(7, 7, 7, 2, GOLD).rect(11, 9, 1, 2, GOLD).rect(13, 9, 1, 3, GOLD));
  d.part((p) => p.set(3, 5, WHITE).set(9, 6, WHITE).set(12, 7, PINK_LIGHT).set(6, 10, WHITE).set(2, 9, PINK_LIGHT), false);
});

/** Bun crumbs by the control box. */
export const fairBunCrumbs: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[4, 10], [8, 12], [11, 9], [6, 7], [12, 13]]) {
    d.part((p) => p.rect(x, y, 2, 1, "#d0843a").set(x, y - 1, "#f0b060"));
  }
});

/** A red clown nose. */
export const fairClownNose: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.ellipse(8, 9, 3.5, 3.5, "#e03040").set(6, 7, "#ff9aa0").set(7, 7, "#ff9aa0").set(6, 8, "#ff9aa0"));
});

// ---------------------------------------------------------------------------------------------
// The director's wagon.
// ---------------------------------------------------------------------------------------------

/** The director's red coat on a stand – sticky with sugar, and a big hole in the pocket. */
export const fairCoat: PixelSprite = drawSprite(16, 20, (d) => {
  d.part((p) => p.rect(7, 1, 2, 19, WOOD_DARK).rect(4, 19, 8, 1, WOOD_DARK));
  d.part((p) =>
    p
      .rect(3, 3, 10, 12, RED)
      .tri(3, 15, 3, 17, 7, 15, RED)
      .tri(12, 15, 12, 17, 8, 15, RED)
      .paint((x) => x === 8, "#f4ecd8")
      .set(8, 5, "#f2d24b")
      .set(8, 8, "#f2d24b")
      .rect(9, 11, 3, 1, RED_DARK)
      .rect(10, 12, 2, 2, INK)
      .set(5, 6, PINK_LIGHT)
      .set(11, 4, PINK_LIGHT),
  );
});

/** A framed photo: the director and the clown, laughing together. */
export const fairPhoto: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(1, 1, 14, 13, GOLD));
  d.part((p) => p.rect(2, 2, 12, 11, "#f4ecd8"));
  d.part((p) => p.rect(3, 3, 4, 2, "#2a2436").ellipse(5, 7, 2, 1.5, SKIN).rect(3, 9, 5, 3, RED), false);
  d.part((p) => p.ellipse(10.5, 7, 2, 2, "#f8f4ec").set(10, 7, "#e03040").rect(8, 10, 5, 2, "#f2d24b").set(12, 4, "#4a90e2"), false);
});

/** Yellow reminder notes everywhere – the director forgets things. */
export const fairNotes: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[1, 2], [8, 1], [4, 8]]) {
    d.part((p) => p.rect(x, y, 6, 6, "#f2e27a").rect(x + 1, y + 2, 4, 1, "#8a7a3a").rect(x + 1, y + 4, 3, 1, "#8a7a3a"));
  }
});

export const case11Sprites: Record<string, PixelSprite> = {
  s2Director,
  s2Clown,
  s2MirrorGhost,
  fairVaddis,
  fairBalloonsGrey,
  fairBalloon,
  fairTicketBooth,
  fairSchedule,
  fairPoster,
  fairOrangeDrops,
  fairTicket,
  fairMirror,
  fairMirrorWavy,
  fairMirrorNote,
  fairCarousel,
  fairHorse,
  fairCandyMachine,
  fairControlBox,
  fairCoaster,
  fairSugarKey,
  fairBunCrumbs,
  fairClownNose,
  fairCoat,
  fairPhoto,
  fairNotes,
};
