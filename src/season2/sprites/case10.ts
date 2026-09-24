import { type Painter, drawSprite } from "../../sprites/pixelDraw";
import type { PixelSprite } from "../../sprites/pixelSprite";

// Case 10 – "Bläckfiskens hemlighet": the aquarium entrance, the big tank, the pump room and the seal pool.
// s2Diver, s2Octopus, s2Seal and s2Jellyfish are placeholders until Nora has drawn them (names in names.ts).

const OUT = "#1a1024";
const WHITE = "#fff6e0";

/** Several one-frame drawings of the same size as one sprite with a shared palette. */
function framesOf(list: PixelSprite[], extra: Partial<PixelSprite> = {}): PixelSprite {
  const palette: Record<string, string | null> = { ".": null };
  const keyOf = new Map<string, string>();
  const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const frames = list.map((f) =>
    f.frames[0].map((row) =>
      [...row]
        .map((ch) => {
          const colour = f.palette[ch];
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
  return { palette, frames, ...extra };
}

// ---------- Nora's characters (placeholders) ----------

/** Dykar-Dina – the aquarium's diver: wetsuit with orange stripes, yellow mask up on her forehead, yellow flippers. */
export const s2Diver: PixelSprite = {
  palette: {
    ".": null,
    o: OUT,
    h: "#6a3a1e", // hair
    m: "#f2d24b", // mask frame
    g: "#9ad0f0", // mask glass
    G: "#ffffff",
    s: "#f5c8a0", // skin
    k: OUT,
    r: "#b04a4a", // smile
    w: "#2a3450", // wetsuit
    W: "#f07a3a", // stripe
    t: "#c8c4d4", // air tank straps
    f: "#f2d24b", // flippers
  },
  frames: [
    [
      "................",
      "......oooo......",
      "....oohhhhoo....",
      "...ohhhhhhhho...",
      "..oommmmmmmmoo..",
      "..omgGgmmgGgmo..",
      "..oommmmmmmmoo..",
      "...ohssssssho...",
      "...osksssskso...",
      "...osssrrssso...",
      "....oossssoo....",
      "...otwwwwwwto...",
      "..otwwWWWWwwto..",
      "..owwwwwwwwwwo..",
      "..oswwwwwwwwso..",
      "..oowwWWWWwwoo..",
      "....owwwwwwo....",
      "....owwoowwo....",
      "...offfoofffo...",
      "..offffo.offffo.",
    ],
  ],
};

/** A round-headed octopus with eight curly arms. */
function drawOctopus(d: Painter, body: string, dark: string, light: string, step: number, mood: "scared" | "happy"): void {
  // Arms first, so the head's outline sits on top of them.
  d.part((p) => {
    const starts = [[3, 9], [5, 10], [7, 11], [9, 11], [11, 10], [13, 9]];
    const ends = step
      ? [[0, 12], [2, 15], [6, 15], [10, 15], [13, 15], [15, 12]]
      : [[1, 14], [3, 15], [7, 15], [9, 14], [12, 15], [15, 14]];
    starts.forEach(([sx, sy], i) => {
      const [ex, ey] = ends[i];
      p.line(sx, sy, ex, ey, body).line(sx + 1, sy, ex + (ex >= sx ? 0 : 1), ey - 1, body);
      p.set(ex, ey, light);
    });
  });
  d.part((p) => {
    p.ellipse(8, 5.5, 5, 5, body);
    p.paint((_, y) => y >= 9, dark);
    // Spots, like on a real octopus – or like the speckles on a stone.
    p.set(6, 2, light).set(10, 3, light).set(5, 5, light).set(11, 6, dark).set(8, 1, light);
    p.set(5, 7, WHITE).set(6, 7, OUT).set(10, 7, WHITE).set(11, 7, OUT);
    if (mood === "scared") p.set(5, 6, dark).set(11, 6, dark).set(8, 9, OUT);
    else p.set(7, 9, OUT).set(8, 10, OUT).set(9, 9, OUT);
  });
}

/**
 * Åtta – the octopus (working name in names.ts: S2.octopus). Frames 0–1: crawling, disguised as a grey
 * speckled stone. Frame 2: happy and back in its own reddish colours (the finale).
 */
export const s2Octopus: PixelSprite = framesOf(
  [
    drawSprite(16, 16, (d) => drawOctopus(d, "#8a8690", "#6a6670", "#aeaab6", 0, "scared")),
    drawSprite(16, 16, (d) => drawOctopus(d, "#8a8690", "#6a6670", "#aeaab6", 1, "scared")),
    drawSprite(16, 16, (d) => drawOctopus(d, "#e0603a", "#b04028", "#ffa27a", 0, "happy")),
  ],
  // The crawling animation (named after the sprite) only uses the stone frames.
  { animations: { "": { frames: [0, 1], frameRate: 6 } } },
);

/** Sälle – a plump grey seal sitting up, with big dark eyes and whiskers. */
export const s2Seal: PixelSprite = drawSprite(20, 16, (d) => {
  const grey = "#8a9aa8";
  d.part((p) => p.tri(0, 15, 5, 10, 5, 15, grey).tri(0, 11, 4, 12, 3, 15, grey));
  d.part((p) => {
    p.ellipse(9, 10.5, 7, 4, grey);
    p.paint((x, y) => y >= 11 && x >= 8, "#b8c4cc");
    p.set(5, 9, "#6a7a88").set(8, 8, "#6a7a88").set(4, 11, "#6a7a88");
  });
  d.part((p) => p.ellipse(11, 13.5, 2.5, 1, "#6a7a88"));
  d.part((p) => {
    p.ellipse(14, 5, 4, 3.5, grey);
    p.ellipse(15, 7, 2, 1, "#b8c4cc");
    p.set(12, 4, OUT).set(13, 4, OUT).set(12, 3, WHITE).set(16, 4, OUT).set(17, 4, OUT).set(17, 3, WHITE);
    p.set(14, 6, OUT).set(15, 6, OUT).set(15, 8, "#6a3a3a");
  });
  d.part((p) => p.line(10, 7, 12, 7, "#e8eef2").line(17, 7, 19, 6, "#e8eef2").line(17, 8, 19, 8, "#e8eef2"), false);
});

/** A glowing jellyfish: a round bell with two eyes and long wavy arms. */
function drawJellyfish(d: Painter, step: number): void {
  d.part(
    (p) => {
      const colours = ["#c8a0f0", "#9ad8ff", "#c8a0f0", "#9ad8ff", "#c8a0f0"];
      [4, 6, 8, 10, 12].forEach((x, i) => {
        for (let y = 9; y < 20; y++) p.set(x + ((y + i * 2 + step * 2) % 4 < 2 ? 0 : 1), y, colours[i]);
      });
    },
    false,
  );
  d.part((p) => {
    p.ellipse(8, 6, 6.5, 5.5, "#9ad8ff", 8);
    p.paint((_, y) => y <= 3, "#d0f0ff");
    p.paint((x, y) => y === 8 && x % 2 === 0, "#6ab0e8");
    p.set(5, 5, OUT).set(6, 5, OUT).set(5, 4, "#ffffff").set(10, 5, OUT).set(11, 5, OUT).set(11, 4, "#ffffff");
    p.set(7, 7, "#6a3a8a").set(8, 7, "#6a3a8a").set(9, 7, "#6a3a8a");
    p.set(4, 2, "#ffffff").set(5, 1, "#ffffff");
  });
}

/** Glim – the jellyfish who floats around the big tank hall and glows in the dark. Two frames: the arms wave. */
export const s2Jellyfish: PixelSprite = framesOf(
  [drawSprite(16, 20, (d) => drawJellyfish(d, 0)), drawSprite(16, 20, (d) => drawJellyfish(d, 1))],
  { frameRate: 4 },
);

// ---------- Monsters ----------

function drawRobot(d: Painter, step: number): void {
  d.part((p) => p.line(8, 0, 8, 3, "#8a8ea0").set(8, 0, "#e04848"));
  d.part((p) => {
    p.ellipse(8, 11, 7, 3.5, "#c8ccd8");
    p.paint((_, y) => y >= 13, "#8a8ea0");
    p.rect(2, 11, 12, 1, "#f2d24b");
  });
  d.part((p) => {
    p.ellipse(8, 6.5, 4, 3, "#9ad0f0", 9);
    p.set(10, 6, "#e04848").set(11, 6, "#e04848").set(10, 5, "#ff9a9a").set(6, 5, "#ffffff");
  });
  // Spinning brushes.
  d.part((p) => {
    if (step) p.line(0, 15, 3, 14, "#f2d24b").line(12, 14, 15, 15, "#f2d24b");
    else p.line(0, 14, 3, 15, "#f2d24b").line(12, 15, 15, 14, "#f2d24b");
  }, false);
}

/** The cleaning robot – round, with one red eye, spinning brushes and a blinking antenna. Faces right. */
export const aqRobot: PixelSprite = framesOf([drawSprite(16, 16, (d) => drawRobot(d, 0)), drawSprite(16, 16, (d) => drawRobot(d, 1))], {
  frameRate: 8,
});

function drawWalrus(d: Painter, awake: boolean): void {
  const brown = "#a0785a";
  d.part((p) => p.tri(0, 17, 4, 11, 6, 17, brown).tri(0, 12, 5, 13, 3, 17, brown));
  d.part((p) => {
    p.ellipse(11, 12, 9, 5, brown);
    p.paint((x, y) => y >= 14 && x > 5, "#7a5a42");
    p.set(6, 9, "#c8a080").set(10, 8, "#c8a080").set(13, 10, "#c8a080");
  });
  d.part((p) => {
    p.ellipse(18, 7, 5, 4.5, brown);
    p.ellipse(18.5, 9.5, 3, 1.5, "#c8a080");
    p.set(18, 8, OUT).set(19, 8, OUT);
    if (awake) {
      p.set(15, 5, WHITE).set(16, 5, "#c0182c").set(20, 5, "#c0182c").set(21, 5, WHITE);
      p.set(15, 4, OUT).set(16, 4, OUT).set(20, 4, OUT).set(21, 4, OUT);
    } else {
      p.set(15, 6, OUT).set(16, 6, OUT).set(20, 6, OUT).set(21, 6, OUT);
    }
  });
  // Long white tusks.
  d.part((p) => p.rect(16, 11, 1, awake ? 6 : 5, WHITE).rect(20, 11, 1, awake ? 6 : 5, WHITE));
}

/** Valrossen Betan – a huge walrus asleep on the pier. Frame 0 asleep, frame 1 awake and grumpy. */
export const aqWalrus: PixelSprite = framesOf([drawSprite(24, 18, (d) => drawWalrus(d, false)), drawSprite(24, 18, (d) => drawWalrus(d, true))]);

// ---------- Things ----------

/** The ticket machine by the gate: a screen, a coin slot and a ticket sticking out. */
export const aqTicketMachine: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(3, 1, 10, 14, "#3a6ab0").rect(3, 1, 10, 2, "#2a4a80").rect(4, 14, 8, 1, "#2a4a80"));
  d.part((p) => p.rect(5, 4, 6, 3, "#9ad0f0").set(6, 5, "#ffffff"));
  d.part((p) => p.rect(10, 8, 1, 2, OUT).set(6, 8, "#f2d24b").set(7, 8, "#f2d24b"), false);
  d.part((p) => p.rect(5, 11, 5, 2, "#f4ecd8").set(6, 11, "#3a7ad8").set(8, 12, "#3a7ad8"));
});

/** A child's ticket with a little fish on it. */
export const aqTicket: PixelSprite = drawSprite(14, 10, (d) => {
  d.part((p) => p.rect(1, 1, 12, 8, "#f4ecd8").set(1, 4, "#d8d0c0").set(12, 4, "#d8d0c0"));
  d.part((p) => p.ellipse(6, 5, 2, 1, "#3a7ad8").tri(8, 5, 10, 3, 10, 7, "#3a7ad8").set(5, 5, OUT), false);
});

/** The big board in the entrance: every animal in the aquarium, in Swedish and English. */
export const aqAnimalBoard: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(3, 11, 1, 5, "#5a3a1e").rect(12, 11, 1, 5, "#5a3a1e"));
  d.part((p) => {
    p.rect(1, 1, 14, 11, "#f4ecd8");
    const icons = ["#f28c38", "#e0603a", "#8a9aa8", "#c8a0f0", "#e04848", "#f2d24b"];
    icons.forEach((c, i) => {
      const x = 2 + (i % 2) * 6;
      const y = 2 + Math.floor(i / 2) * 3;
      p.rect(x, y, 2, 2, c).rect(x + 3, y, 2, 1, "#8a86a0");
    });
  });
});

/** The robot's charging plate, with its dust bag of sand. */
export const aqRobotDock: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(9, 2, 3, 11, "#8a8ea0").set(10, 4, "#f2d24b").set(10, 5, "#f2d24b").set(9, 6, "#f2d24b").set(10, 7, "#f2d24b"));
  d.part((p) => p.rect(1, 12, 14, 3, "#c8ccd8").rect(1, 14, 14, 1, "#8a8ea0"));
  d.part((p) => p.ellipse(4, 9, 3, 2.5, "#c8b890").set(3, 8, "#e8d8a8").set(4, 7, "#a09070"));
});

/** The octopus's empty tank: the lid is locked, but there's a little round hole in the bottom. */
export const aqOctoTank: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(7, 14, 3, 2, "#6a6a7a"));
  d.part((p) => {
    p.rect(1, 3, 14, 11, "#c8d4dc");
    p.rect(2, 5, 12, 8, "#8a96a0");
    p.rect(2, 11, 12, 2, "#a09a90").set(4, 11, "#7a7470").set(11, 11, "#7a7470");
    p.set(8, 12, OUT).set(9, 12, OUT);
    p.set(3, 6, "#ffffff").set(3, 7, "#ffffff");
  });
  d.part((p) => p.rect(0, 2, 16, 1, "#5a5a6a"));
  d.part((p) => p.rect(7, 0, 3, 2, "#f2d24b").set(8, 1, OUT));
});

/** The stand with the tank signs – most of them have fallen off. */
export const aqSignStand: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(7, 2, 2, 13, "#5a3a1e").rect(4, 14, 8, 1, "#5a3a1e"));
  d.part((p) => p.rect(2, 2, 12, 3, "#f4ecd8").rect(3, 3, 7, 1, "#8a86a0"));
  d.part((p) => p.rect(9, 7, 6, 3, "#f4ecd8").rect(10, 8, 4, 1, "#8a86a0"));
  d.part((p) => p.line(0, 14, 5, 12, "#f4ecd8").line(0, 15, 5, 13, "#f4ecd8"));
});

/** A bucket for the octopus's shrimp – empty! */
export const aqShrimpBucket: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => {
    p.tri(2, 5, 14, 5, 12, 15, "#5a8ac8").tri(2, 5, 4, 15, 12, 15, "#5a8ac8");
    p.rect(5, 8, 6, 3, "#f4ecd8").set(6, 9, "#e0603a").set(7, 9, "#e0603a").set(9, 9, "#8a86a0");
  });
  d.part((p) => p.ellipse(8, 5, 6, 1.5, "#2a3a5a"));
  d.part((p) => p.line(2, 4, 5, 1, "#8a8ea0").line(5, 1, 11, 1, "#8a8ea0").line(11, 1, 14, 4, "#8a8ea0"), false);
});

/** Wet prints of big diving flippers. */
export const aqFlipperPrints: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y] of [[2, 9], [9, 3]]) {
    d.part((p) => p.tri(x, y + 6, x + 5, y + 6, x + 2.5, y, "#8ab0c8").set(x + 2, y + 2, "#b8d4e8"), false);
  }
});

/** Little round wet marks in a trail, like from suckers. */
export const aqSuckerPrints: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => {
    for (const [x, y] of [[2, 12], [5, 10], [4, 13], [8, 8], [7, 11], [11, 6], [10, 9], [13, 3], [14, 6]]) {
      p.set(x, y, "#a8c0d0").set(x + 1, y, "#a8c0d0").set(x, y + 1, "#a8c0d0").set(x + 1, y + 1, "#6a8aa0");
    }
  }, false);
});

/** A black splash of octopus ink. */
export const aqInk: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .ellipse(8, 9, 5, 3.5, "#2a2438")
      .ellipse(4, 6, 1.5, 1.5, "#2a2438")
      .ellipse(13, 12, 1.5, 1, "#2a2438")
      .ellipse(11, 5, 1, 1, "#2a2438")
      .set(6, 8, "#4a4060")
      .set(7, 8, "#4a4060"),
  );
});

/** The big pipe from the tank above, coming down through the ceiling – wet, with ink around the opening. */
export const aqPipe: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(4, 0, 8, 9, "#8a8ea0").rect(5, 0, 2, 9, "#b0b4c4"));
  d.part((p) => p.rect(2, 8, 12, 3, "#6a6e80").set(3, 9, "#b0b4c4"));
  d.part((p) => p.ellipse(8, 12.5, 3, 1, OUT));
  d.part((p) => p.set(4, 14, "#2a2438").set(11, 14, "#2a2438").set(12, 15, "#2a2438").set(3, 15, "#9ad0f0"), false);
});

/** A monitor showing last night's picture: something small and grey, carrying a blue glow. */
export const aqCameraScreen: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(6, 12, 4, 3, "#5a5a6a"));
  d.part((p) => {
    p.rect(1, 2, 14, 10, "#2a2a3a");
    p.rect(2, 3, 12, 8, "#6a6a78");
    p.ellipse(7, 7, 2, 2, "#c8c4d4").set(6, 7, OUT).set(8, 7, OUT).set(6, 10, "#c8c4d4").set(8, 10, "#c8c4d4");
    p.set(10, 6, "#3a7ad8").set(11, 6, "#6aa8ff").set(10, 7, "#6aa8ff").set(11, 7, "#3a7ad8");
    p.set(3, 3, "#e04848");
  });
});

/** The big water pump, with a glass tube full of grey water. */
export const aqPump: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.rect(0, 10, 3, 2, "#6a6e80").rect(13, 5, 3, 2, "#6a6e80"));
  d.part((p) => p.rect(3, 3, 10, 12, "#6a8a6a").rect(3, 3, 10, 2, "#4a6a4a"));
  d.part((p) => p.rect(5, 6, 2, 7, "#dce8f0").rect(5, 9, 2, 4, "#8a96a0"));
  d.part((p) => p.ellipse(10, 8, 1.5, 1.5, "#f4ecd8").set(10, 8, "#e04848"));
});

/** Pink shrimp shells, scattered around. */
export const aqShrimpShells: PixelSprite = drawSprite(16, 16, (d) => {
  for (const [x, y, flip] of [[2, 4, 0], [9, 7, 1], [4, 11, 1], [11, 12, 0]]) {
    d.part((p) => {
      p.line(x, y, x + 3, y, "#f09a80").line(x + (flip ? 0 : 3), y + 1, x + (flip ? 0 : 3), y + 1, "#f09a80");
      p.set(x + 1, y, "#ffc8b0").set(x + (flip ? 4 : -1), y - 1, "#e07058");
    });
  }
});

/** A small tank where the water has gone grey – and so has the fish. */
export const aqGreyTank: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => {
    p.rect(1, 3, 14, 11, "#c8d4dc");
    p.rect(2, 5, 12, 8, "#8a8a92");
    p.ellipse(7, 9, 2.5, 1.5, "#b0aeb4").tri(9, 9, 12, 7, 12, 11, "#b0aeb4").set(6, 8, OUT);
    p.set(3, 6, "#ffffff");
  });
  d.part((p) => p.rect(0, 2, 16, 1, "#5a5a6a"));
});

// ---------- Pictures for the English signs ----------

export const aqPicFish: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.tri(10, 8, 15, 4, 15, 12, "#f28c38"));
  d.part((p) => p.ellipse(7, 8, 5.5, 3.5, "#f28c38").paint((x) => x === 7 || x === 9, "#f2d24b").set(4, 7, OUT).set(3, 6, WHITE));
});

export const aqPicOctopus: PixelSprite = drawSprite(16, 16, (d) => drawOctopus(d, "#e0603a", "#b04028", "#ffa27a", 0, "happy"));

export const aqPicSeal: PixelSprite = drawSprite(16, 16, (d) => {
  const grey = "#8a9aa8";
  d.part((p) => p.tri(0, 15, 4, 10, 4, 15, grey));
  d.part((p) => p.ellipse(7, 11, 6, 3.5, grey).paint((x, y) => y >= 12 && x > 5, "#b8c4cc"));
  d.part((p) => p.ellipse(11, 6, 3.5, 3, grey).set(10, 5, OUT).set(13, 5, OUT).set(12, 7, OUT));
});

export const aqPicJellyfish: PixelSprite = drawSprite(16, 16, (d) => {
  d.part(
    (p) => {
      [4, 7, 10, 12].forEach((x, i) => {
        for (let y = 8; y < 16; y++) p.set(x + ((y + i) % 4 < 2 ? 0 : 1), y, "#c8a0f0");
      });
    },
    false,
  );
  d.part((p) => p.ellipse(8, 6, 6, 5, "#ff9ad0", 7).paint((_, y) => y <= 2, "#ffd0e8").set(6, 5, OUT).set(10, 5, OUT));
});

export const aqPicCrab: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) => p.line(3, 12, 1, 15, "#b02828").line(12, 12, 14, 15, "#b02828").line(5, 13, 4, 15, "#b02828").line(10, 13, 11, 15, "#b02828"), false);
  d.part((p) => p.ellipse(2.5, 4, 2, 2, "#e04848").ellipse(13.5, 4, 2, 2, "#e04848").set(2, 3, "#b02828").set(13, 3, "#b02828"));
  d.part((p) => p.ellipse(8, 10, 5.5, 3.5, "#e04848").set(6, 8, OUT).set(10, 8, OUT).set(6, 7, WHITE).set(10, 7, WHITE));
});

export const aqPicStarfish: PixelSprite = drawSprite(16, 16, (d) => {
  d.part((p) =>
    p
      .tri(8, 0, 5, 7, 11, 7, "#f2d24b")
      .tri(0, 6, 8, 5, 6, 10, "#f2d24b")
      .tri(16, 6, 8, 5, 10, 10, "#f2d24b")
      .tri(3, 15, 6, 7, 9, 10, "#f2d24b")
      .tri(13, 15, 10, 7, 7, 10, "#f2d24b")
      .set(7, 6, "#f28c38")
      .set(9, 8, "#f28c38")
      .set(6, 9, "#f28c38"),
  );
});

export const case10Sprites: Record<string, PixelSprite> = {
  s2Diver,
  s2Octopus,
  s2Seal,
  s2Jellyfish,
  aqRobot,
  aqWalrus,
  aqTicketMachine,
  aqTicket,
  aqAnimalBoard,
  aqRobotDock,
  aqOctoTank,
  aqSignStand,
  aqShrimpBucket,
  aqFlipperPrints,
  aqSuckerPrints,
  aqInk,
  aqPipe,
  aqCameraScreen,
  aqPump,
  aqShrimpShells,
  aqGreyTank,
  aqPicFish,
  aqPicOctopus,
  aqPicSeal,
  aqPicJellyfish,
  aqPicCrab,
  aqPicStarfish,
};
