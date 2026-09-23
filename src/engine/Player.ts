import * as Phaser from "phaser";
import { NORA_IDLE_FRAME } from "../sprites/nora";
import { TILE } from "./config";

export type Facing = "down" | "up" | "left" | "right";

/** Asks the room whether Nora's feet may be on a tile. */
export interface Ground {
  canStand(col: number, row: number, airborne: boolean): boolean;
  isLowObstacle(col: number, row: number): boolean;
}

export interface PlayerInput {
  dx: number;
  dy: number;
  jump: boolean;
}

const SPEED = 62; // px per second
const JUMP_TIME = 0.45; // seconds in the air
const JUMP_HEIGHT = 7; // px
const MAX_AIR_TIME = 1.2; // safety: never hover longer than this
// Collision box around the feet (x = centre, y = bottom).
const FEET_HALF_W = 5;
const FEET_H = 6;

/** Detective Nora: walking, jumping over low obstacles, facing direction. */
export class Player {
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  x: number;
  y: number;
  facing: Facing = "up";
  private airTime = -1; // < 0 when on the ground
  private jumpDir = { x: 0, y: 0 };
  private takeoff = { x: 0, y: 0 };

  constructor(
    scene: Phaser.Scene,
    private readonly ground: Ground,
    x: number,
    y: number,
    facing: Facing = "up",
  ) {
    this.facing = facing;
    this.x = x;
    this.y = y;
    this.shadow = scene.add.ellipse(x, y - 1, 10, 4, 0x000000, 0.3);
    this.sprite = scene.add.sprite(x, y, `nora-${NORA_IDLE_FRAME.up}`).setOrigin(0.5, 1);
    this.animate(false);
    this.sync(0);
  }

  get airborne(): boolean {
    return this.airTime >= 0;
  }

  update(dt: number, input: PlayerInput): void {
    let { dx, dy } = input;

    if (input.jump && !this.airborne) {
      this.airTime = 0;
      this.takeoff = { x: this.x, y: this.y };
      const len = Math.hypot(dx, dy);
      this.jumpDir = len > 0 ? { x: dx / len, y: dy / len } : { x: 0, y: 0 };
    }

    if (this.airborne) {
      // Keep the momentum from the take-off while in the air.
      dx = this.jumpDir.x;
      dy = this.jumpDir.y;
      this.airTime += dt;
      const landed = this.airTime >= JUMP_TIME && !this.overLowObstacle();
      if (landed) {
        this.airTime = -1;
      } else if (this.airTime > MAX_AIR_TIME) {
        // Stuck above an obstacle (e.g. jumped into a wall): go back.
        this.x = this.takeoff.x;
        this.y = this.takeoff.y;
        this.airTime = -1;
      }
    }

    const len = Math.hypot(dx, dy);
    const moving = len > 0;
    if (moving) {
      const step = (SPEED * dt) / len;
      this.tryMove(dx * step, 0);
      this.tryMove(0, dy * step);
      if (!this.airborne || this.airTime === 0) this.facing = facingFrom(dx, dy, this.facing);
    }

    this.animate(moving && !this.airborne);
    this.sync(this.airborne ? Math.sin((Math.min(this.airTime, JUMP_TIME) / JUMP_TIME) * Math.PI) * JUMP_HEIGHT : 0);
  }

  /** The tile under the middle of Nora's feet. */
  feetTile(): { col: number; row: number } {
    return { col: Math.floor(this.x / TILE), row: Math.floor((this.y - FEET_H / 2) / TILE) };
  }

  /** The point just in front of Nora – used to find things to use. */
  frontPoint(): { x: number; y: number } {
    const reach = 11;
    const cy = this.y - FEET_H / 2;
    switch (this.facing) {
      case "up":
        return { x: this.x, y: cy - reach };
      case "down":
        return { x: this.x, y: cy + reach };
      case "left":
        return { x: this.x - reach, y: cy };
      case "right":
        return { x: this.x + reach, y: cy };
    }
  }

  private tryMove(mx: number, my: number): void {
    const nx = this.x + mx;
    const ny = this.y + my;
    if (this.boxFits(nx, ny)) {
      this.x = nx;
      this.y = ny;
    }
  }

  private feetTiles(x: number, y: number): { col: number; row: number }[] {
    const left = Math.floor((x - FEET_HALF_W) / TILE);
    const right = Math.floor((x + FEET_HALF_W - 0.01) / TILE);
    const top = Math.floor((y - FEET_H) / TILE);
    const bottom = Math.floor((y - 0.01) / TILE);
    const out = [];
    for (let row = top; row <= bottom; row++) for (let col = left; col <= right; col++) out.push({ col, row });
    return out;
  }

  private boxFits(x: number, y: number): boolean {
    return this.feetTiles(x, y).every(({ col, row }) => this.ground.canStand(col, row, this.airborne));
  }

  private overLowObstacle(): boolean {
    return this.feetTiles(this.x, this.y).some(({ col, row }) => this.ground.isLowObstacle(col, row));
  }

  private animate(walking: boolean): void {
    const dir = this.facing === "left" || this.facing === "right" ? "side" : this.facing;
    this.sprite.setFlipX(this.facing === "left");
    if (walking) {
      this.sprite.play(`nora-walk-${dir}`, true);
    } else {
      this.sprite.stop();
      this.sprite.setTexture(`nora-${NORA_IDLE_FRAME[dir]}`);
    }
  }

  private sync(lift: number): void {
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y - lift));
    this.sprite.setDepth(this.y);
    this.shadow.setPosition(Math.round(this.x), Math.round(this.y - 1));
    this.shadow.setScale(1 - lift / 20);
    this.shadow.setDepth(this.y - 0.5);
  }
}

function facingFrom(dx: number, dy: number, current: Facing): Facing {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  if (Math.abs(dy) > Math.abs(dx)) return dy > 0 ? "down" : "up";
  // Diagonal: keep the current facing if it matches one of the directions.
  if ((current === "left" && dx < 0) || (current === "right" && dx > 0)) return current;
  if ((current === "up" && dy < 0) || (current === "down" && dy > 0)) return current;
  return dx > 0 ? "right" : "left";
}
