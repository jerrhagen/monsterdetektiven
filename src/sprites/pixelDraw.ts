import type { PixelSprite } from "./pixelSprite";

/**
 * Draw a pixel sprite with shapes instead of typing every row – handy for bigger pictures
 * like the buildings on the town map. Each `part` gets a dark outline where it meets
 * anything else, so roofs, walls and doors stay crisp.
 */

const OUTLINE = "#1a1024";

/** 3 × 5 pixel letters for signs. */
const FONT: Record<string, string[]> = {
  A: [".#.", "#.#", "###", "#.#", "#.#"],
  B: ["##.", "#.#", "##.", "#.#", "##."],
  E: ["###", "#..", "##.", "#..", "###"],
  G: [".##", "#..", "#.#", "#.#", ".##"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  K: ["#.#", "#.#", "##.", "#.#", "#.#"],
  L: ["#..", "#..", "#..", "#..", "###"],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  S: [".##", "#..", ".#.", "..#", "##."],
};

export class Part {
  readonly px = new Map<number, string>();

  constructor(private readonly w: number, private readonly h: number) {}

  set(x: number, y: number, c: string): this {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) this.px.set(y * this.w + x, c);
    return this;
  }

  rect(x0: number, y0: number, w: number, h: number, c: string): this {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) this.set(x, y, c);
    return this;
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, c: string, maxY = Infinity): this {
    for (let y = Math.floor(cy - ry); y <= Math.min(cy + ry, maxY); y++) {
      for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
        const dx = (x - cx) / (rx + 0.5);
        const dy = (y - cy) / (ry + 0.5);
        if (dx * dx + dy * dy <= 1) this.set(x, y, c);
      }
    }
    return this;
  }

  /** A filled triangle. */
  tri(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, c: string): this {
    const side = (px: number, py: number, x0: number, y0: number, x1: number, y1: number) =>
      (px - x1) * (y0 - y1) - (x0 - x1) * (py - y1);
    for (let y = Math.floor(Math.min(ay, by, cy)); y <= Math.max(ay, by, cy); y++) {
      for (let x = Math.floor(Math.min(ax, bx, cx)); x <= Math.max(ax, bx, cx); x++) {
        const d1 = side(x + 0.5, y + 0.5, ax, ay, bx, by);
        const d2 = side(x + 0.5, y + 0.5, bx, by, cx, cy);
        const d3 = side(x + 0.5, y + 0.5, cx, cy, ax, ay);
        const neg = d1 < 0 || d2 < 0 || d3 < 0;
        const pos = d1 > 0 || d2 > 0 || d3 > 0;
        if (!(neg && pos)) this.set(x, y, c);
      }
    }
    return this;
  }

  line(x0: number, y0: number, x1: number, y1: number, c: string): this {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }

  /** Recolours pixels that already belong to the part (shading, stripes). */
  paint(test: (x: number, y: number) => boolean, c: string): this {
    for (const i of [...this.px.keys()]) {
      const x = i % this.w;
      const y = Math.floor(i / this.w);
      if (test(x, y)) this.px.set(i, c);
    }
    return this;
  }

  /** Capital letters from the little 3 × 5 font, one pixel apart. */
  text(x: number, y: number, s: string, c: string): this {
    [...s].forEach((ch, i) => {
      FONT[ch]?.forEach((row, ry) => {
        [...row].forEach((p, rx) => {
          if (p === "#") this.set(x + i * 4 + rx, y + ry, c);
        });
      });
    });
    return this;
  }
}

export class Painter {
  private readonly grid: (string | null)[];

  constructor(readonly w: number, readonly h: number) {
    this.grid = new Array(w * h).fill(null);
  }

  /** Draws a part; with `outline` it gets a dark line all around where it meets anything else. */
  part(draw: (p: Part) => void, outline = true): this {
    const part = new Part(this.w, this.h);
    draw(part);
    if (outline) {
      for (const i of part.px.keys()) {
        const x = i % this.w;
        const y = Math.floor(i / this.w);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= this.w || ny < 0 || ny >= this.h) continue;
          if (!part.px.has(ny * this.w + nx)) this.grid[ny * this.w + nx] = OUTLINE;
        }
      }
    }
    for (const [i, c] of part.px) this.grid[i] = c;
    return this;
  }

  /** Turns the picture into a pixel sprite (a palette letter per colour). */
  sprite(): PixelSprite {
    const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const palette: Record<string, string | null> = { ".": null };
    const byColour = new Map<string, string>();
    const rows: string[] = [];
    for (let y = 0; y < this.h; y++) {
      let row = "";
      for (let x = 0; x < this.w; x++) {
        const c = this.grid[y * this.w + x];
        if (!c) {
          row += ".";
          continue;
        }
        let key = byColour.get(c);
        if (!key) {
          key = keys[byColour.size];
          byColour.set(c, key);
          palette[key] = c;
        }
        row += key;
      }
      rows.push(row);
    }
    return { palette, frames: [rows] };
  }
}

/** Shorthand: draw a w × h sprite. */
export function drawSprite(w: number, h: number, draw: (p: Painter) => void): PixelSprite {
  const painter = new Painter(w, h);
  draw(painter);
  return painter.sprite();
}
