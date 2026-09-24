import type { Case } from "../cases/types";
import type { PixelSprite } from "../sprites/pixelSprite";
import { case7 } from "./cases/case7-harbor";
import { case8 } from "./cases/case8-school";
import { case9 } from "./cases/case9-greenhouse";
import { case10 } from "./cases/case10-aquarium";
import { case11 } from "./cases/case11-fair";
import { case12 } from "./cases/case12-museum";
import { sharedSprites } from "./sprites/shared";
import { case7Sprites } from "./sprites/case7";
import { case8Sprites } from "./sprites/case8";
import { case9Sprites } from "./sprites/case9";
import { case10Sprites } from "./sprites/case10";
import { case11Sprites } from "./sprites/case11";
import { case12Sprites } from "./sprites/case12";

/**
 * Season 2 – prepared but NOT plugged into the game yet (see SEASON2.md, spoilers).
 * Integration: add these cases after season 1's and merge `season2Sprites` into the sprite registry.
 */
export const season2Cases: Case[] = [case7, case8, case9, case10, case11, case12];

/** Every sprite set of season 2, kept apart so the test can check that no key is defined twice. */
export const season2SpriteSets: Record<string, PixelSprite>[] = [
  sharedSprites,
  case7Sprites,
  case8Sprites,
  case9Sprites,
  case10Sprites,
  case11Sprites,
  case12Sprites,
];

export const season2Sprites: Record<string, PixelSprite> = Object.assign({}, ...season2SpriteSets);
