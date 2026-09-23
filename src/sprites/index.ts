import {
  bloodDrops,
  dragMarks,
  fladderSleep,
  handprints,
  key,
  noticeboard,
  pinkScales,
  slimeJar,
  stina,
  thread,
  toyCarBlue,
  toyCarRed,
  viskanBin,
  yarnBasket,
} from "./case1";
import { case2Sprites } from "./case2";
import { case3Sprites } from "./case3";
import { case4Sprites } from "./case4";
import { case5Sprites } from "./case5";
import { case6Sprites } from "./case6";
import { mapSprites } from "./map";
import { alertBubble, ester } from "./ester";
import { magnifier, shadowEyes, trashBin, viskanGhost } from "./monsters";
import { customerBook, fingerDots, fladderHang, gBlock, gCurly, gDotted, gThin, gift, sleeveScrap } from "./clues";
import { fladder } from "./fladder";
import { dustFall, grymlan, monsterEgg, moonShard, rustle } from "./finale";
import { nora } from "./nora";
import type { PixelSprite } from "./pixelSprite";
import {
  arm,
  chair,
  comb,
  iceCream,
  needle,
  register,
  shapeCone,
  shapeCube,
  shapeCylinder,
  shapeSphere,
  sun,
  towel,
  umbrella,
} from "./puzzles";
import { hintBubble, lookBubble, questionBubble, sign, teddy, zzz } from "./things";

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
  pinkScales,
  yarnBasket,
  bloodDrops,
  dragMarks,
  key,
  slimeJar,
  toyCarRed,
  toyCarBlue,
  register,
  arm,
  shapeSphere,
  shapeCube,
  shapeCylinder,
  shapeCone,
  towel,
  umbrella,
  iceCream,
  sun,
  comb,
  needle,
  chair,
  viskanGhost,
  trashBin,
  shadowEyes,
  magnifier,
  grymlan,
  moonShard,
  monsterEgg,
  rustle,
  dustFall,
  fingerDots,
  gift,
  sleeveScrap,
  customerBook,
  fladderHang,
  gCurly,
  gBlock,
  gThin,
  gDotted,
  hintBubble,
  lookBubble,
  questionBubble,
  zzz,
  alertBubble,
  ...case2Sprites,
  ...case3Sprites,
  ...case4Sprites,
  ...case5Sprites,
  ...case6Sprites,
  ...mapSprites,
};
