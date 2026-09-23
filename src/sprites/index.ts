import { fladder } from "./fladder";
import type { PixelSprite } from "./pixelSprite";

/** Every pixel sprite in the game, by texture key. */
export const sprites: Record<string, PixelSprite> = {
  fladder,
};
