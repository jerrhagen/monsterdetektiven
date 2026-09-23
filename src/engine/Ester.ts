import type * as Phaser from "phaser";
import { NORA_IDLE_FRAME } from "../sprites/nora";
import type { Facing } from "./Player";

const NEAR = 30; // px – close enough, stop following
const FAR = 60; // px – too far away, start following
const FOLLOW_SPEED = 70;
const WANDER_SPEED = 24;
const WANDER_RADIUS = 24;
const HOP_HEIGHT = 4;
const TRAIL_STEP = 3; // px between recorded points of Nora's path
const TRAIL_LENGTH = 200;

/** What the room can tell Ester about the floor. */
export interface EsterGround {
  /** Can Ester stroll here on her own (plain floor)? */
  isFloorAt(x: number, y: number): boolean;
  /** Is there something here to hop over (slime, blocks)? */
  isLowObstacleAt(x: number, y: number): boolean;
}

type Mode = "idle" | "wander" | "follow";

/**
 * Ester stays nearby without copying every step: she stands and looks around,
 * strolls a little on her own, and only walks after Nora (along Nora's own path,
 * so she never cuts through walls) when Nora gets too far away.
 */
export class Ester {
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  private readonly alert: Phaser.GameObjects.Image;
  private readonly trail: { x: number; y: number }[] = [];
  private trailIndex = 0;
  private mode: Mode = "idle";
  private modeTime = 0;
  private idleFor = 2;
  private wanderTo = { x: 0, y: 0 };
  private facing: Facing = "up";
  private alerting = false;
  x: number;
  y: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly ground: EsterGround,
  ) {
    this.x = x;
    this.y = y;
    this.shadow = scene.add.ellipse(x, y - 1, 9, 3, 0x000000, 0.3);
    this.sprite = scene.add.sprite(x, y, `ester-${NORA_IDLE_FRAME.up}`).setOrigin(0.5, 1);
    this.alert = scene.add.image(x, y, "alertBubble-0").setOrigin(0.5, 1).setDepth(10_001).setVisible(false);
    this.trail.push({ x, y });
  }

  /** Shows the "!" and makes her bounce when she has a hint. */
  setAlert(on: boolean): void {
    this.alerting = on;
    this.alert.setVisible(on);
    if (on && this.mode === "wander") this.startIdle();
  }

  update(dt: number, time: number, nora: { x: number; y: number }): void {
    this.recordTrail(nora);
    this.modeTime += dt;
    const toNora = Math.hypot(nora.x - this.x, nora.y - this.y);

    if (this.mode !== "follow" && toNora > FAR) this.startFollow();

    let walking = false;
    if (this.mode === "follow") {
      if (toNora < NEAR) {
        this.startIdle();
      } else {
        const target = this.trail[Math.max(0, this.trailIndex)];
        if (this.moveToward(target, FOLLOW_SPEED, dt)) {
          this.trailIndex = Math.min(this.trailIndex + 1, this.trail.length - 1);
        }
        walking = true;
      }
    } else if (this.mode === "wander") {
      const arrived = this.moveToward(this.wanderTo, WANDER_SPEED, dt);
      walking = !arrived;
      if (arrived || this.modeTime > 3) this.startIdle();
    } else {
      this.lookAround(nora, time);
      if (!this.alerting && this.modeTime > this.idleFor) this.startWander(nora);
    }

    this.draw(walking, time);
  }

  private recordTrail(nora: { x: number; y: number }): void {
    const last = this.trail[this.trail.length - 1];
    if (Math.hypot(nora.x - last.x, nora.y - last.y) < TRAIL_STEP) return;
    this.trail.push({ x: nora.x, y: nora.y });
    if (this.trail.length > TRAIL_LENGTH) {
      this.trail.shift();
      this.trailIndex--;
    }
  }

  private startFollow(): void {
    this.mode = "follow";
    this.modeTime = 0;
    // Join Nora's path at the point closest to where Ester is now.
    let best = 0;
    let bestDist = Infinity;
    this.trail.forEach((p, i) => {
      const d = Math.hypot(p.x - this.x, p.y - this.y);
      if (d < bestDist) {
        best = i;
        bestDist = d;
      }
    });
    this.trailIndex = best;
  }

  private startIdle(): void {
    this.mode = "idle";
    this.modeTime = 0;
    this.idleFor = 1.5 + Math.random() * 3.5;
  }

  /** Stroll to a random nearby spot she can reach in a straight line, not too far from Nora. */
  private startWander(nora: { x: number; y: number }): void {
    for (let attempt = 0; attempt < 8; attempt++) {
      const x = this.x + (Math.random() * 2 - 1) * WANDER_RADIUS;
      const y = this.y + (Math.random() * 2 - 1) * WANDER_RADIUS;
      const toNora = Math.hypot(nora.x - x, nora.y - y);
      if (toNora < 18 || toNora > FAR - 8) continue;
      if (!this.clearLine(x, y)) continue;
      this.mode = "wander";
      this.modeTime = 0;
      this.wanderTo = { x, y };
      return;
    }
    this.startIdle();
  }

  private clearLine(x: number, y: number): boolean {
    const steps = Math.ceil(Math.hypot(x - this.x, y - this.y) / 3);
    for (let i = 1; i <= steps; i++) {
      const px = this.x + ((x - this.x) * i) / steps;
      const py = this.y + ((y - this.y) * i) / steps;
      for (const [ox, oy] of [[-4, -1], [4, -1], [-4, -5], [4, -5]]) {
        if (!this.ground.isFloorAt(px + ox, py + oy)) return false;
      }
    }
    return true;
  }

  /** Returns true when the target is reached. */
  private moveToward(target: { x: number; y: number }, speed: number, dt: number): boolean {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return true;
    const step = Math.min(dist, speed * dt);
    this.x += (dx / dist) * step;
    this.y += (dy / dist) * step;
    this.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    return step >= dist;
  }

  /** Mostly watches Nora, but now and then looks somewhere else. */
  private lookAround(nora: { x: number; y: number }, time: number): void {
    const glancingAway = !this.alerting && Math.floor(time / 2300) % 3 === 2;
    if (glancingAway) return;
    const dx = nora.x - this.x;
    const dy = nora.y - this.y;
    if (Math.hypot(dx, dy) > 4) {
      this.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    }
  }

  private draw(walking: boolean, time: number): void {
    const dir = this.facing === "left" || this.facing === "right" ? "side" : this.facing;
    this.sprite.setFlipX(this.facing === "left");
    if (walking) {
      this.sprite.play(`ester-walk-${dir}`, true);
    } else {
      this.sprite.stop();
      this.sprite.setTexture(`ester-${NORA_IDLE_FRAME[dir]}`);
    }

    let lift = this.ground.isLowObstacleAt(this.x, this.y - 3) ? HOP_HEIGHT : 0;
    // Bounce up and down when she wants to tell Nora something.
    if (this.alerting && !walking) lift = Math.max(lift, Math.round(Math.abs(Math.sin(time / 180)) * 3));

    this.sprite.setPosition(Math.round(this.x), Math.round(this.y - lift)).setDepth(this.y);
    this.shadow.setPosition(Math.round(this.x), Math.round(this.y - 1)).setDepth(this.y - 0.5);
    this.alert.setPosition(Math.round(this.x), Math.round(this.y - lift - 19));
  }
}
