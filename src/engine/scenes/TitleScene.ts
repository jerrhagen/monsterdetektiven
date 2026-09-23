import * as Phaser from "phaser";
import { startMusic } from "../../ui/music";
import { hideTitle, showTitle } from "../../ui/title";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { newGame } from "../session";
import { registerSprites } from "../textures";

/** Small seeded random generator, so the town looks the same every time. */
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Height of the dark strip at the bottom where the players are listed. */
const PLAYER_STRIP = 22;

const SKY = [0x0b0620, 0x110828, 0x170b31, 0x1e0e3a, 0x261244, 0x2f164d, 0x381b55, 0x42205c];
const SILHOUETTE = 0x0d0718;
const WINDOW_LIT = 0xffd66b;
const WINDOW_DARK = 0x1c1230;

/** Title screen: Mystiska staden at night, with Fladder flying past. */
export class TitleScene extends Phaser.Scene {
  constructor() {
    super("title");
  }

  create(): void {
    registerSprites(this);
    const rand = seededRandom(7);

    this.drawSky();
    this.drawStars(rand);
    this.drawMoon(GAME_WIDTH - 26, 50);
    this.launchFladder();
    this.drawTown(rand);

    // The title is plain HTML (players, name boxes) – Phaser must not swallow keys like space.
    this.input.keyboard!.clearCaptures();
    showTitle(() => {
      newGame();
      startMusic();
      this.scene.start("room");
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, hideTitle);
  }

  private drawSky(): void {
    const g = this.add.graphics();
    const band = Math.ceil(GAME_HEIGHT / SKY.length);
    SKY.forEach((colour, i) => {
      g.fillStyle(colour).fillRect(0, i * band, GAME_WIDTH, band);
    });
  }

  private drawStars(rand: () => number): void {
    for (let i = 0; i < 45; i++) {
      const x = Math.floor(rand() * GAME_WIDTH);
      const y = Math.floor(rand() * 120);
      const star = this.add.rectangle(x, y, 1, 1, rand() < 0.2 ? 0xffe9a8 : 0xd9ccff).setOrigin(0);
      this.tweens.add({
        targets: star,
        alpha: { from: 1, to: 0.15 },
        duration: 900 + rand() * 1800,
        delay: rand() * 2000,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private drawMoon(x: number, y: number): void {
    const g = this.add.graphics();
    g.fillStyle(0xf3e9c6, 0.12).fillCircle(x, y, 17);
    g.fillStyle(0xf3e9c6).fillCircle(x, y, 11);
    g.fillStyle(0xdcd0a8).fillCircle(x - 4, y - 2, 2).fillCircle(x + 3, y + 4, 3).fillCircle(x + 4, y - 5, 1);
  }

  /** Fladder flaps across the sky every now and then. */
  private launchFladder(): void {
    const fladder = this.add.sprite(-20, 110, "fladder-0").play("fladder");
    const fly = () => {
      const goingRight = Math.random() < 0.5;
      const baseY = 80 + Math.random() * 22;
      fladder.setPosition(goingRight ? -20 : GAME_WIDTH + 20, baseY);
      this.tweens.add({
        targets: fladder,
        x: goingRight ? GAME_WIDTH + 20 : -20,
        duration: 5500,
        onUpdate: (tween) => {
          fladder.y = baseY + Math.sin(tween.progress * Math.PI * 6) * 6;
        },
        onComplete: () => this.time.delayedCall(2500 + Math.random() * 3000, fly),
      });
    };
    this.time.delayedCall(1200, fly);
  }

  private drawTown(rand: () => number): void {
    const g = this.add.graphics();
    // The town stands a bit up; the dark strip below it holds the players.
    const ground = GAME_HEIGHT - PLAYER_STRIP;
    const lit: { x: number; y: number }[] = [];
    const dark: { x: number; y: number }[] = [];

    let x = -6;
    while (x < GAME_WIDTH) {
      const w = 26 + Math.floor(rand() * 22);
      const h = 26 + Math.floor(rand() * 30);
      const top = ground - h;
      g.fillStyle(SILHOUETTE).fillRect(x, top, w, h);
      // Pointy roof or flat roof with a chimney.
      if (rand() < 0.6) {
        g.fillTriangle(x - 2, top, x + w + 2, top, x + w / 2, top - 10 - rand() * 8);
      } else {
        g.fillRect(x + w - 8, top - 7, 4, 7);
      }
      for (let wy = top + 5; wy < ground - 8; wy += 9) {
        for (let wx = x + 4; wx < x + w - 6; wx += 8) {
          (rand() < 0.35 ? lit : dark).push({ x: wx, y: wy });
        }
      }
      x += w + 2 + Math.floor(rand() * 6);
    }

    // Clock tower (case 5) in the middle of town.
    const tx = 150;
    g.fillStyle(SILHOUETTE).fillRect(tx, ground - 80, 20, 80);
    g.fillTriangle(tx - 3, ground - 80, tx + 23, ground - 80, tx + 10, ground - 100);
    g.fillStyle(0xe8dcb0).fillCircle(tx + 10, ground - 66, 6);
    g.lineStyle(1, SILHOUETTE).lineBetween(tx + 10, ground - 66, tx + 10, ground - 70);
    g.lineBetween(tx + 10, ground - 66, tx + 13, ground - 66);

    for (const w of lit) g.fillStyle(WINDOW_LIT).fillRect(w.x, w.y, 3, 4);
    for (const w of dark) g.fillStyle(WINDOW_DARK).fillRect(w.x, w.y, 3, 4);

    // Street, and the dark ground below it.
    g.fillStyle(0x07040f).fillRect(0, ground, GAME_WIDTH, GAME_HEIGHT - ground);

    // Something with glowing eyes watches from a dark window…
    const spot = dark[Math.floor(dark.length / 3)];
    if (spot) {
      g.fillStyle(0x000000).fillRect(spot.x, spot.y, 3, 4);
      const eyes = this.add.graphics();
      eyes.fillStyle(0xff3b3b).fillRect(spot.x, spot.y + 1, 1, 1).fillRect(spot.x + 2, spot.y + 1, 1, 1);
      eyes.setVisible(false);
      const blink = () => {
        eyes.setVisible(!eyes.visible);
        this.time.delayedCall(eyes.visible ? 1400 : 2500 + Math.random() * 4000, blink);
      };
      this.time.delayedCall(2000, blink);
    }
  }
}
