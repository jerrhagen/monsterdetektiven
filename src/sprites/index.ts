import {
  bloodDrops,
  dragMarks,
  fladderSleep,
  handprints,
  key,
  noticeboard,
  slimeJar,
  stina,
  thread,
  toyCarBlue,
  toyCarRed,
  viskanBin,
} from "./case1";
import { alertBubble, ester } from "./ester";
import { fladder } from "./fladder";
import { nora } from "./nora";
import type { PixelSprite } from "./pixelSprite";
import { hintBubble, sign, teddy } from "./things";

/** Every pixel sprite in the game, by texture key. */
export const sprites: Record<string, PixelSprite> = {
  fladder,
  fladderSleep,
  nora,
  ester,
  stina,
  viskanBin,
  sign,
  noticeboard,
  teddy,
  handprints,
  thread,
  bloodDrops,
  dragMarks,
  key,
  slimeJar,
  toyCarRed,
  toyCarBlue,
  hintBubble,
  alertBubble,
};
