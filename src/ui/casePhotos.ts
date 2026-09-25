// Secret photos in the detective book: one silly snapshot of Nora and Ester for every solved case.
// They are made from the game's own pixel sprites on a little painted background. Which photos
// show is worked out from the solved cases, so they always match the save – also after the secret panel.

import { sprites } from "../sprites";
import { frameToCanvas } from "../sprites/pixelSprite";

const W = 80;
const H = 60;
/** Where everyone's feet are. */
const FLOOR = 53;

interface Box {
  top: number;
  left: number;
  right: number;
}

/** Small seeded random generator, so a photo looks the same every time. */
function seeded(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Photo {
  readonly canvas = document.createElement("canvas");
  private readonly ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext("2d")!;
  }

  rect(x: number, y: number, w: number, h: number, colour: string): this {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(x, y, w, h);
    return this;
  }

  /** Horizontal bands from `y0` down to `y1`, like a soft gradient. */
  bands(colours: string[], y0: number, y1: number): this {
    const step = (y1 - y0) / colours.length;
    colours.forEach((c, i) => this.rect(0, Math.round(y0 + i * step), W, Math.ceil(step) + 1, c));
    return this;
  }

  /**
   * Draws a sprite with the middle of its visible pixels at `cx` and its lowest visible pixel
   * at `bottom`. Returns where it ended up, so things can be put on someone's head.
   */
  stamp(key: string, cx: number, bottom: number, { frame = 0, flip = false } = {}): Box {
    const sprite = sprites[key];
    const rows = sprite.frames[frame];
    let minX = Infinity;
    let maxX = -1;
    let minY = Infinity;
    let maxY = -1;
    rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (!sprite.palette[ch]) return;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }),
    );
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const left = Math.round(cx - w / 2);
    const top = bottom - h + 1;
    const image = frameToCanvas(sprite, rows);
    this.ctx.save();
    if (flip) {
      this.ctx.translate(left + w, top);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(image, minX, minY, w, h, 0, 0, w, h);
    } else {
      this.ctx.drawImage(image, minX, minY, w, h, left, top, w, h);
    }
    this.ctx.restore();
    return { top, left, right: left + w - 1 };
  }

  /** Scattered single pixels (flour, confetti, fireflies…). */
  sprinkle(x0: number, y0: number, x1: number, y1: number, count: number, colours: string[], seed: number): this {
    const rand = seeded(seed);
    for (let i = 0; i < count; i++) {
      const x = Math.floor(x0 + rand() * (x1 - x0));
      const y = Math.floor(y0 + rand() * (y1 - y0));
      this.rect(x, y, 1, 1, colours[Math.floor(rand() * colours.length)]);
    }
    return this;
  }

  url(): string {
    return this.canvas.toDataURL();
  }
}

interface CasePhoto {
  caption: string;
  alt: string;
  draw: (p: Photo) => void;
}

/** Nora and Ester, side by side. Returns their boxes. */
function duo(p: Photo, noraX: number, esterX: number): { nora: Box; ester: Box } {
  return { nora: p.stamp("nora", noraX, FLOOR), ester: p.stamp("ester", esterX, FLOOR) };
}

const PHOTOS: Record<string, CasePhoto> = {
  toystore: {
    caption: "Nallen ville också vara med!",
    alt: "Nora med en nalle på huvudet i leksaksaffären",
    draw: (p) => {
      p.bands(["#8a5a3a", "#9a6844", "#a8744a"], 0, 40).rect(0, 40, W, H - 40, "#c9956a");
      // A shelf full of tiny toys behind them.
      p.rect(0, 14, W, 2, "#5a3a22").rect(0, 28, W, 2, "#5a3a22");
      p.sprinkle(0, 8, W, 14, 40, ["#e04848", "#4a90e2", "#f2d24b", "#5cc46a", "#ff8ade"], 11);
      p.sprinkle(0, 22, W, 28, 40, ["#e04848", "#4a90e2", "#f2d24b", "#5cc46a", "#9b6bd6"], 12);
      p.stamp("stina", 12, FLOOR);
      const { nora, ester } = duo(p, 32, 49);
      p.stamp("teddy", 32, nora.top + 5);
      p.stamp("toyCarRed", 58, ester.top + 11);
      p.stamp("grymlan", 69, FLOOR, { flip: true });
      p.stamp("fladderHang", 41, 11);
    },
  },
  bakery: {
    caption: "Mjölkrig! Vem började?",
    alt: "Nora och Ester täckta av mjöl i bageriet",
    draw: (p) => {
      p.bands(["#efe6d6", "#f4ecde", "#f8f2e6"], 0, 42).rect(0, 42, W, H - 42, "#d8c8b0");
      p.rect(0, 16, W, 2, "#8a5a3a");
      p.sprinkle(2, 11, W - 2, 16, 26, ["#e0a050", "#c98a3a", "#f0c070"], 21);
      p.stamp("berit", 11, FLOOR);
      const { nora, ester } = duo(p, 29, 45);
      p.stamp("bakeryGlowBun", 45, ester.top + 3);
      p.stamp("smulan", 61, FLOOR);
      p.stamp("gardskatt", 73, FLOOR);
      // Flour everywhere – on them and in the air.
      p.sprinkle(nora.left, nora.top, ester.right, FLOOR, 90, ["#ffffff", "#f4f0e4"], 22);
      p.sprinkle(18, 20, 56, 34, 30, ["#ffffff"], 23);
    },
  },
  library: {
    caption: "Böcker på huvudet. Svårare än det ser ut!",
    alt: "Nora och Ester balanserar böcker på huvudet i biblioteket",
    draw: (p) => {
      p.bands(["#5a1a2a", "#6a2232", "#7a2a3a"], 0, 42).rect(0, 42, W, H - 42, "#a04a5a");
      for (const y of [6, 18, 30]) {
        p.rect(0, y + 8, W, 2, "#2a1a14");
        p.sprinkle(0, y, W, y + 8, 60, ["#8a2346", "#2d5f9e", "#2a8a6a", "#c9961e", "#6a45a8"], y);
      }
      p.stamp("bodil", 11, FLOOR);
      const { nora, ester } = duo(p, 29, 45);
      const book = p.stamp("libraryBook", 29, nora.top + 3);
      p.stamp("libraryBook", 30, book.top + 3);
      p.stamp("libraryBook", 45, ester.top + 3);
      const pile = p.stamp("libraryBook", 63, FLOOR);
      p.stamp("bladdra", 63, pile.top + 2);
      p.stamp("ugo", 70, 14);
    },
  },
  forest: {
    caption: "Hem till mamma!",
    alt: "Nora och Ester i skogen med Trattis och mosskompisar",
    draw: (p) => {
      p.bands(["#1f2a4a", "#2a3a5a", "#34506a", "#3a6a5a"], 0, 40).rect(0, 40, W, H - 40, "#2f6a2e");
      p.sprinkle(0, 0, W, 20, 18, ["#ffe9a8", "#d9ccff"], 41);
      p.stamp("mossjatte", 68, FLOOR);
      p.stamp("trattis", 10, FLOOR);
      duo(p, 25, 52);
      p.stamp("mossunge", 38, FLOOR);
      p.stamp("lingonBasket", 18, FLOOR + 1);
      // Fireflies.
      p.sprinkle(0, 10, W, 44, 22, ["#fff27a", "#d8ff8a"], 42);
    },
  },
  clocktower: {
    caption: "Tick, tack – SMIL!",
    alt: "Nora och Ester på torget framför klocktornet",
    draw: (p) => {
      p.bands(["#9fd6ee", "#b8e0ee", "#d0e8e4"], 0, 40).rect(0, 40, W, H - 40, "#9a8a7a");
      // The clock tower behind them.
      p.rect(30, 0, 20, 40, "#6a6470").rect(33, 6, 14, 14, "#1a1024").rect(34, 7, 12, 12, "#f3e9c6");
      p.rect(39, 9, 1, 5, "#1a1024").rect(40, 13, 4, 1, "#1a1024");
      const knut = p.stamp("clockKeeper", 11, FLOOR);
      p.stamp("kuggtroll", 11, knut.top + 4);
      const { ester } = duo(p, 30, 46);
      p.stamp("clockPigeon", 46, ester.top + 2);
      p.stamp("touristFluff", 66, FLOOR, { flip: true });
    },
  },
  festival: {
    caption: "Alla får vara med!",
    alt: "Nora och Ester på Monsterfesten med lyktor",
    draw: (p) => {
      p.bands(["#0b0620", "#170b31", "#261244", "#381b55"], 0, 42).rect(0, 42, W, H - 42, "#4a3a5a");
      p.sprinkle(0, 0, W, 24, 20, ["#ffe9a8", "#d9ccff"], 61);
      p.stamp("festLanternLit", 6, FLOOR);
      p.stamp("festLanternLit", 74, FLOOR);
      p.stamp("moonStone", 40, 16);
      duo(p, 24, 40);
      p.stamp("skuggan", 55, FLOOR);
      p.stamp("skuggNightLight", 64, FLOOR);
      // Confetti!
      p.sprinkle(0, 18, W, FLOOR, 50, ["#e04848", "#4a90e2", "#f2d24b", "#5cc46a", "#ff8ade", "#9b6bd6"], 62);
    },
  },
};

const cache = new Map<string, string>();

/** The photo for a solved case, or nothing if that case has no photo (yet). */
export function casePhoto(caseId: string): { url: string; caption: string; alt: string } | undefined {
  const photo = PHOTOS[caseId];
  if (!photo) return undefined;
  let url = cache.get(caseId);
  if (!url) {
    const p = new Photo();
    photo.draw(p);
    url = p.url();
    cache.set(caseId, url);
  }
  return { url, caption: photo.caption, alt: photo.alt };
}

/** Every case that has a photo (for tests). */
export const PHOTO_CASES = Object.keys(PHOTOS);

/** The sprites the photos use (for tests). */
export const PHOTO_SPRITES = [
  "nora", "ester", "stina", "teddy", "toyCarRed", "grymlan", "fladderHang", "berit", "bakeryGlowBun", "smulan",
  "gardskatt", "bodil", "libraryBook", "bladdra", "ugo", "mossjatte", "trattis", "mossunge", "lingonBasket",
  "clockKeeper", "kuggtroll", "clockPigeon", "touristFluff", "festLanternLit", "moonStone", "skuggan", "skuggNightLight",
];
