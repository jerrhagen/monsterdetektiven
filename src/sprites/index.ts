import { fladder } from "./fladder";
import { nora } from "./nora";
import type { PixelSprite } from "./pixelSprite";
import { hintBubble, sign, teddy } from "./things";

/** Every pixel sprite in the game, by texture key. */
export const sprites: Record<string, PixelSprite> = {
  fladder,
  nora,
  sign,
  teddy,
  hintBubble,
};
