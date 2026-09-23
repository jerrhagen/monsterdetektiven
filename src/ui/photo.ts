// The secret photo at the back of the detective book: Nora and Ester, cheek to cheek.
// Drawn in finer pixels than the game sprites, from the architect's drawings
// (assets/bilder/teckningar/nora.jpg and ester.jpg).

const W = 80;
const H = 60;
const OUTLINE = "#1a1024";

/** One part of the picture (hair, face …). Its outline is drawn around the whole part. */
class Part {
  readonly px = new Map<number, string>();

  set(x: number, y: number, c: string): this {
    if (x >= 0 && x < W && y >= 0 && y < H) this.px.set(y * W + x, c);
    return this;
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, c: string, maxY = H): this {
    for (let y = Math.floor(cy - ry); y <= Math.min(cy + ry, maxY); y++) {
      for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
        const dx = (x - cx) / (rx + 0.5);
        const dy = (y - cy) / (ry + 0.5);
        if (dx * dx + dy * dy <= 1) this.set(x, y, c);
      }
    }
    return this;
  }

  rect(x0: number, y0: number, w: number, h: number, c: string): this {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) this.set(x, y, c);
    return this;
  }

  /** Recolours pixels that already belong to the part (shading inside it). */
  paint(xs: [number, number][], c: string): this {
    for (const [x, y] of xs) if (this.px.has(y * W + x)) this.set(x, y, c);
    return this;
  }

  dots(xs: [number, number][], c: string): this {
    for (const [x, y] of xs) this.set(x, y, c);
    return this;
  }
}

function line(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  const out: [number, number][] = [];
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) out.push([Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n)]);
  return out;
}

/** Draws parts in order; each part gets a dark outline where it meets anything else. */
function compose(parts: Part[]): (string | null)[] {
  const grid: (string | null)[] = new Array(W * H).fill(null);
  for (const part of parts) {
    for (const i of part.px.keys()) {
      const x = i % W;
      const y = Math.floor(i / W);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        if (!part.px.has(ny * W + nx)) grid[ny * W + nx] = OUTLINE;
      }
    }
    for (const [i, c] of part.px) grid[i] = c;
  }
  return grid;
}

const SKIN = "#f5c8a0";
const SKIN_SHADE = "#e3a882";
const BLUSH = "#f2939a";
const EYE = "#2a1a2e";
const WHITE = "#ffffff";

function background(): Part {
  const bg = new Part();
  const bands = ["#9fd6ee", "#aedcee", "#bde2ec", "#cde7e6", "#dcebdc", "#e9ecd0", "#f3e9c4", "#f8e3b6"];
  for (let y = 0; y < H; y++) bg.rect(0, y, W, 1, bands[Math.min(bands.length - 1, Math.floor(y / 8))]);
  // Soft light spots, like a sunny day behind them.
  for (const [x, y, r] of [[8, 10, 4], [70, 8, 3], [66, 44, 5], [10, 46, 3], [75, 24, 2]]) bg.ellipse(x, y, r, r, "#fdf6e0");
  return bg;
}

function heart(x: number, y: number): Part {
  const c = "#e0405a";
  return new Part()
    .rect(x, y, 2, 2, c)
    .rect(x + 3, y, 2, 2, c)
    .rect(x - 1, y + 1, 7, 2, c)
    .rect(x, y + 3, 5, 1, c)
    .rect(x + 1, y + 4, 3, 1, c)
    .set(x + 2, y + 5, c)
    .set(x, y, "#ff8a9a");
}

// ---- Nora (left, taller): long green hair with brown clips, black jacket, teal and purple top.

const N_HAIR = "#6cc24a";
const N_HAIR_SHADE = "#3f8a2e";
const N_HAIR_LIGHT = "#94dc6c";

function noraHairBack(): Part {
  const p = new Part().ellipse(31, 23, 15, 15, N_HAIR).rect(16, 23, 31, 37, N_HAIR);
  for (const x of [18, 22, 42, 45]) p.paint(line(x, 30, x, 59), N_HAIR_SHADE);
  return p;
}

function noraBody(): Part {
  const p = new Part()
    .ellipse(31, 62, 21, 14, "#262233")
    .rect(28, 36, 7, 12, SKIN) // neck
    .rect(26, 45, 11, 15, "#1f9fb0");
  p.rect(26, 53, 11, 2, "#9b6bd6").rect(26, 57, 11, 2, "#6a45a8");
  p.paint(line(25, 47, 21, 59), "#3a3450").paint(line(37, 47, 41, 59), "#3a3450"); // jacket edges
  p.paint(line(28, 38, 34, 38), SKIN_SHADE);
  return p;
}

function noraFace(): Part {
  const p = new Part().ellipse(31, 25, 11, 12, SKIN);
  p.paint(line(22, 30, 25, 35), SKIN_SHADE);
  // Eyes with a shine.
  p.rect(26, 25, 2, 3, EYE).rect(35, 25, 2, 3, EYE).set(26, 25, WHITE).set(35, 25, WHITE);
  p.ellipse(23, 30, 2, 1, BLUSH).ellipse(39, 30, 2, 1, BLUSH);
  // Open, happy smile.
  p.dots(line(28, 31, 34, 31), EYE).dots([[28, 32], [34, 32], [29, 33], [33, 33]], EYE).dots(line(30, 34, 32, 34), EYE);
  p.dots(line(29, 32, 33, 32), "#8a2a3a").dots(line(30, 33, 32, 33), "#e87a8a");
  return p;
}

function noraBangs(): Part {
  // Hair parted in the middle, falling over the forehead.
  const p = new Part().ellipse(31, 15, 13, 6, N_HAIR, 18).ellipse(25, 18, 6, 4, N_HAIR).ellipse(37, 18, 5, 3, N_HAIR);
  p.ellipse(21, 23, 2, 7, N_HAIR).ellipse(41, 21, 1, 4, N_HAIR);
  p.paint(line(31, 10, 31, 18), N_HAIR_SHADE).paint(line(29, 12, 24, 20), N_HAIR_SHADE).paint(line(33, 12, 37, 20), N_HAIR_SHADE);
  p.paint(line(24, 13, 28, 12), N_HAIR_LIGHT).paint(line(34, 12, 38, 14), N_HAIR_LIGHT);
  return p;
}

function noraClips(): Part {
  return new Part().ellipse(37, 11, 2, 1, "#7a3b1e").ellipse(40, 14, 1, 1, "#7a3b1e").set(36, 11, "#a0562e");
}

// ---- Ester (right, shorter): pink messy hair, yellow cardigan with grey dots, blue top, green bow.

const E_HAIR = "#f28ac0";
const E_HAIR_SHADE = "#d0609e";
const E_HAIR_LIGHT = "#ffb4dc";

function esterHairBack(): Part {
  const p = new Part().ellipse(52, 28, 14, 14, E_HAIR).rect(40, 28, 26, 22, E_HAIR);
  // Messy ends.
  for (const [x, len] of [[40, 3], [44, 5], [48, 2], [58, 4], [62, 6], [65, 3]]) p.rect(x, 50, 2, len, E_HAIR);
  for (const x of [42, 63]) p.paint(line(x, 32, x, 54), E_HAIR_SHADE);
  return p;
}

function esterBody(): Part {
  const p = new Part()
    .ellipse(52, 63, 18, 12, "#f7d23e")
    .rect(49, 40, 6, 12, SKIN) // neck
    .rect(48, 49, 9, 11, "#2f5fb8");
  p.paint(line(47, 51, 44, 59), "#d8ae22").paint(line(57, 51, 60, 59), "#d8ae22");
  for (const [x, y] of [[39, 57], [42, 53], [62, 56], [66, 59], [44, 58]]) p.paint([[x, y], [x + 1, y]], "#9a96aa");
  // The green bow.
  p.dots([[58, 52], [58, 53], [58, 54], [59, 53], [61, 53], [62, 52], [62, 53], [62, 54]], "#2f8a3a").set(60, 53, "#1f5a26");
  p.paint(line(50, 42, 54, 42), SKIN_SHADE);
  return p;
}

function esterFace(): Part {
  const p = new Part().ellipse(51, 30, 10, 11, SKIN);
  p.paint(line(59, 34, 57, 39), SKIN_SHADE);
  p.rect(47, 29, 2, 3, EYE).rect(55, 29, 2, 3, EYE).set(47, 29, WHITE).set(55, 29, WHITE);
  p.ellipse(44, 35, 2, 1, BLUSH).ellipse(58, 35, 2, 1, BLUSH);
  // A big smile, like in the drawing.
  p.dots(line(46, 35, 56, 35), EYE).dots([[46, 36], [56, 36], [47, 37], [55, 37]], EYE);
  p.dots(line(47, 36, 55, 36), "#7a2a3a").dots(line(48, 37, 54, 37), "#7a2a3a").dots(line(50, 37, 52, 37), "#e87a8a");
  p.dots(line(48, 38, 54, 38), EYE);
  return p;
}

function esterBangs(): Part {
  const p = new Part().ellipse(52, 22, 12, 5, E_HAIR, 24).ellipse(61, 26, 3, 7, E_HAIR);
  // Jagged fringe.
  p.dots([[44, 25], [47, 26], [48, 25], [52, 26], [53, 25], [56, 26]], E_HAIR);
  p.paint(line(46, 20, 49, 24), E_HAIR_SHADE).paint(line(52, 19, 54, 24), E_HAIR_SHADE).paint(line(58, 20, 61, 26), E_HAIR_SHADE);
  p.paint(line(45, 19, 49, 18), E_HAIR_LIGHT).paint(line(55, 18, 58, 19), E_HAIR_LIGHT);
  return p;
}

let cached: string | null = null;

/** The photo as an image URL. */
export function photoUrl(): string {
  if (cached) return cached;
  const grid = compose([
    background(),
    noraHairBack(),
    esterHairBack(),
    noraBody(),
    esterBody(),
    noraFace(),
    noraBangs(),
    noraClips(),
    esterFace(),
    esterBangs(),
    heart(38, 3),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  grid.forEach((c, i) => {
    if (!c) return;
    ctx.fillStyle = c;
    ctx.fillRect(i % W, Math.floor(i / W), 1, 1);
  });
  cached = canvas.toDataURL();
  return cached;
}
