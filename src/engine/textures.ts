import type * as Phaser from "phaser";
import { sprites } from "../sprites";
import { frameToCanvas, validatePixelSprite } from "../sprites/pixelSprite";

/**
 * Turns every pixel sprite into Phaser textures. Frame textures are named
 * `<key>-0`, `<key>-1`, …; multi-frame sprites also get an animation `<key>`.
 */
export function registerSprites(scene: Phaser.Scene): void {
  for (const [key, sprite] of Object.entries(sprites)) {
    const errors = validatePixelSprite(key, sprite);
    if (errors.length > 0) throw new Error(errors.join("\n"));

    const frameKeys = sprite.frames.map((frame, i) => {
      const frameKey = `${key}-${i}`;
      if (!scene.textures.exists(frameKey)) {
        scene.textures.addCanvas(frameKey, frameToCanvas(sprite, frame));
      }
      return frameKey;
    });

    if (frameKeys.length > 1 && !scene.anims.exists(key)) {
      scene.anims.create({
        key,
        frames: frameKeys.map((k) => ({ key: k })),
        frameRate: sprite.frameRate ?? 6,
        repeat: -1,
      });
    }
  }
}
