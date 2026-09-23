/**
 * Pixel art written as text. Each character is one pixel and maps to a
 * colour in `palette` (null = transparent). Kept free of Phaser so it can
 * be validated in tests.
 */
export interface PixelSprite {
  palette: Record<string, string | null>;
  /** One or more frames, each a list of equally long rows. */
  frames: string[][];
  /**
   * Named animations as lists of frame indices. Sprites with several frames
   * and no `animations` get a single looping animation named after the sprite.
   */
  animations?: Record<string, { frames: number[]; frameRate: number }>;
  frameRate?: number;
}

/** Returns a list of problems (in Swedish, shown in-game) – empty when OK. */
export function validatePixelSprite(name: string, sprite: PixelSprite): string[] {
  const errors: string[] = [];
  if (sprite.frames.length === 0) errors.push(`Figuren '${name}' har inga bilder.`);
  const width = sprite.frames[0]?.[0]?.length ?? 0;
  const height = sprite.frames[0]?.length ?? 0;

  sprite.frames.forEach((frame, f) => {
    if (frame.length !== height) {
      errors.push(`Figuren '${name}', bild ${f + 1}: har ${frame.length} rader, ska ha ${height}.`);
    }
    frame.forEach((row, r) => {
      if (row.length !== width) {
        errors.push(`Figuren '${name}', bild ${f + 1}, rad ${r + 1}: har ${row.length} pixlar, ska ha ${width}.`);
      }
      for (const ch of row) {
        if (!(ch in sprite.palette)) {
          errors.push(`Figuren '${name}', bild ${f + 1}, rad ${r + 1}: färgen '${ch}' finns inte i paletten.`);
        }
      }
    });
  });

  for (const [anim, { frames }] of Object.entries(sprite.animations ?? {})) {
    for (const i of frames) {
      if (i < 0 || i >= sprite.frames.length) {
        errors.push(`Figuren '${name}', animationen '${anim}': bild ${i} finns inte.`);
      }
    }
  }
  return errors;
}

/** Draws one frame onto a new canvas. */
export function frameToCanvas(sprite: PixelSprite, frame: string[]): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = frame[0].length;
  canvas.height = frame.length;
  const ctx = canvas.getContext("2d")!;
  frame.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const colour = sprite.palette[ch];
      if (colour) {
        ctx.fillStyle = colour;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
  return canvas;
}
