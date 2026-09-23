import { sprites } from "../sprites";
import { frameToCanvas } from "../sprites/pixelSprite";

const cache = new Map<string, string>();

/** A pixel sprite as an <img> URL, for use in the HTML layer. */
export function spriteUrl(key: string): string {
  let url = cache.get(key);
  if (!url) {
    const sprite = sprites[key];
    url = sprite ? frameToCanvas(sprite, sprite.frames[0]).toDataURL() : "";
    cache.set(key, url);
  }
  return url;
}
