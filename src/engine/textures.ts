import type * as Phaser from "phaser";
import { sprites } from "../sprites";
import { frameToCanvas, validatePixelSprite } from "../sprites/pixelSprite";

/**
 * Turns every pixel sprite into Phaser textures. Frame textures are named
 * `<key>-0`, `<key>-1`, …. Animations are named `<key>-<animation>`, or just
 * `<key>` for sprites with frames but no named animations.
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

    const animations =
      sprite.animations ??
      (frameKeys.length > 1
        ? { "": { frames: frameKeys.map((_, i) => i), frameRate: sprite.frameRate ?? 6 } }
        : {});

    for (const [name, anim] of Object.entries(animations)) {
      const animKey = name ? `${key}-${name}` : key;
      if (scene.anims.exists(animKey)) continue;
      scene.anims.create({
        key: animKey,
        frames: anim.frames.map((i) => ({ key: frameKeys[i] })),
        frameRate: anim.frameRate,
        repeat: -1,
      });
    }
  }
}
