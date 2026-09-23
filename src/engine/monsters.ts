import type * as Phaser from "phaser";
import type { Flags, MonsterDef, Thing } from "../cases/types";
import { TILE } from "./config";
import type { Facing } from "./Player";

/** What a monster may know about and do to the rest of the room. */
export interface MonsterWorld {
  nora(): { x: number; y: number; facing: Facing };
  /** False during a grace period after a scare, in dialogs, while carried, etc. */
  canCatch(): boolean;
  caught(by: Monster): void;
  has(flags?: Flags): boolean;
  give(flag: string): void;
  /** A fright that doesn't catch Nora – e.g. a monster jumping out. */
  startle(text: string): void;
  /** Is there cover (a crate, a shelf…) between this point and Nora? */
  isNoraHiddenFrom(x: number, y: number): boolean;
}

export interface Monster {
  readonly kind: MonsterDef["type"];
  readonly sprite: Phaser.GameObjects.Sprite;
  /** Position on the ground (feet). */
  x: number;
  y: number;
  /** Something to say when Nora talks to it, if it can be talked to. */
  readonly thing?: Thing;
  /** Can Nora talk to it right now? (Defaults to yes, if it has a `thing`.) */
  canTalk?(): boolean;
  update(dt: number, time: number): void;
  /** After catching Nora: back off for a while. */
  retreat(): void;
}

/** Set when Nora catches the culprit at the end of a case. */
export const CAUGHT_FLAG = "caught";

/** Set when a hiding monster has jumped out, so it stays out when Nora comes back. */
export const emergedFlag = (sprite: string) => `emerged:${sprite}`;

const tileCenter = ([col, row]: [number, number]) => ({ x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 });

export function createMonster(scene: Phaser.Scene, def: MonsterDef, world: MonsterWorld): Monster {
  switch (def.type) {
    case "flyer":
      return new Flyer(scene, def, world);
    case "sneaker":
      return new Sneaker(scene, def, world);
    case "crawler":
      return new Crawler(scene, def, world);
  }
}

// ---------- Flyer: loops around the room and swoops at Nora ----------

const FLY_HEIGHT = 16;

class Flyer implements Monster {
  readonly kind = "flyer";
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  private readonly puzzled: Phaser.GameObjects.Image;
  private readonly center: { x: number; y: number };
  private readonly size: { x: number; y: number };
  private mode: "loop" | "windup" | "swoop" | "return" | "rest" | "toPerch" | "perched" = "loop";
  private puzzledFor = 0;
  private readonly perch?: { x: number; y: number };
  private readonly spriteKey: string;
  private readonly perchSprite?: string;
  private readonly talkHint: Phaser.GameObjects.Image;
  readonly thing?: Thing;
  /** Seconds of flying left before the next rest on the perch. */
  private flyFor = 8 + Math.random() * 4;
  private modeTime = 0;
  private t = Math.random() * Math.PI * 2;
  x: number;
  y: number;

  constructor(
    scene: Phaser.Scene,
    def: Extract<MonsterDef, { type: "flyer" }>,
    private readonly world: MonsterWorld,
  ) {
    this.center = tileCenter(def.center);
    this.size = { x: def.size[0] * TILE, y: def.size[1] * TILE };
    this.perch = def.perch ? tileCenter(def.perch) : undefined;
    this.spriteKey = def.sprite;
    this.perchSprite = def.perchSprite;
    this.thing = def.thing;
    const start = this.loopPoint();
    this.x = start.x;
    this.y = start.y;
    this.shadow = scene.add.ellipse(this.x, this.y, 10, 3, 0x000000, 0.25).setDepth(1);
    this.sprite = scene.add.sprite(this.x, this.y - FLY_HEIGHT, `${def.sprite}-0`).play(def.sprite).setDepth(9000);
    this.puzzled = scene.add.image(0, 0, "questionBubble-0").setOrigin(0.5, 1).setDepth(9001).setVisible(false);
    this.talkHint = scene.add.image(0, 0, "hintBubble-0").setOrigin(0.5, 1).setDepth(9001).setVisible(false);
  }

  canTalk(): boolean {
    return this.mode === "perched";
  }

  /** A figure-eight around the centre of the room. */
  private loopPoint(): { x: number; y: number } {
    return { x: this.center.x + Math.sin(this.t) * this.size.x, y: this.center.y + Math.sin(this.t * 2) * this.size.y };
  }

  update(dt: number, time: number): void {
    this.modeTime += dt;
    const nora = this.world.nora();
    const toNora = Math.hypot(nora.x - this.x, nora.y - this.y);

    const hidden = this.world.isNoraHiddenFrom(this.x, this.y);
    let shake = 0;

    if (this.mode === "loop") {
      this.t += dt * 0.6;
      this.flyFor -= dt;
      const p = this.loopPoint();
      this.moveTo(p.x, p.y, 80, dt);
      if (toNora < 48 && !hidden && this.world.canCatch()) this.setMode("windup");
      else if (this.perch && this.flyFor <= 0) this.setMode("toPerch");
    } else if (this.mode === "toPerch") {
      if (this.moveTo(this.perch!.x, this.perch!.y, 60, dt) < 1) this.land();
    } else if (this.mode === "perched") {
      // Resting, hanging upside down – she won't attack now, and can be talked to.
      if (this.modeTime > 7) this.takeOff();
    } else if (this.mode === "windup") {
      // Hovers and shivers for a moment before diving – time to hide!
      shake = Math.sin(time / 25) * 1.5;
      if (hidden) this.giveUp();
      else if (this.modeTime > 0.55) this.setMode("swoop");
    } else if (this.mode === "swoop") {
      this.moveTo(nora.x, nora.y, 88, dt);
      if (hidden) this.giveUp();
      else if (toNora < 9 && this.world.canCatch()) this.world.caught(this);
      else if (this.modeTime > 1.3) this.setMode("return");
    } else if (this.mode === "return") {
      const p = this.loopPoint();
      if (this.moveTo(p.x, p.y, 60, dt) < 2) this.setMode("loop");
    } else if (this.modeTime > 3) {
      this.setMode("return");
    }

    const bob = this.mode === "perched" ? 0 : Math.sin(time / 120) * 2;
    this.sprite.setPosition(Math.round(this.x + shake), Math.round(this.y - FLY_HEIGHT + bob));
    this.talkHint
      .setVisible(this.mode === "perched" && !!this.thing && toNora < 64)
      .setPosition(this.sprite.x, this.sprite.y - 8 + Math.round(Math.sin(time / 200)));
    this.shadow.setPosition(Math.round(this.x), Math.round(this.y));
    this.puzzledFor = Math.max(0, this.puzzledFor - dt);
    this.puzzled.setVisible(this.puzzledFor > 0).setPosition(this.sprite.x, this.sprite.y - 7);
  }

  private land(): void {
    this.setMode("perched");
    if (this.perchSprite) this.sprite.stop().setTexture(`${this.perchSprite}-0`);
  }

  private takeOff(): void {
    this.flyFor = 8 + Math.random() * 4;
    this.sprite.play(this.spriteKey);
    this.setMode("return");
  }

  /** Nora hid behind something: "Huh? Where did she go?" */
  private giveUp(): void {
    this.puzzledFor = 1.2;
    this.setMode("return");
  }

  /** Moves toward a point; returns the distance left. */
  private moveTo(x: number, y: number, speed: number, dt: number): number {
    const dx = x - this.x;
    const dy = y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.5) {
      const step = Math.min(dist, speed * dt);
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
      if (Math.abs(dx) > 0.5) this.sprite.setFlipX(dx < 0);
    }
    return dist;
  }

  private setMode(mode: Flyer["mode"]): void {
    this.mode = mode;
    this.modeTime = 0;
  }

  retreat(): void {
    this.setMode("rest");
  }
}

// ---------- Sneaker: creeps closer when Nora looks away ----------

const FACING_VEC: Record<Facing, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

class Sneaker implements Monster {
  readonly kind = "sneaker";
  readonly sprite: Phaser.GameObjects.Sprite;
  readonly thing: Thing;
  private readonly home: { x: number; y: number };
  private readonly calmWhen?: Flags;
  private readonly spriteKey: string;
  private readonly hideUntil?: { when: Flags; delay: number };
  private readonly talkHint: Phaser.GameObjects.Image;
  private restFor = 0;
  private hiddenFor = 0;
  /** 0 → 1 while jumping out of the hiding place. */
  private emerging = 1;
  x: number;
  y: number;

  constructor(
    scene: Phaser.Scene,
    def: Extract<MonsterDef, { type: "sneaker" }>,
    private readonly world: MonsterWorld,
  ) {
    this.home = tileCenter(def.home);
    this.x = this.home.x;
    this.y = this.home.y + 6;
    this.thing = def.thing;
    this.calmWhen = def.calmWhen;
    this.sprite = scene.add.sprite(this.x, this.y, `${def.sprite}-0`).setOrigin(0.5, 1).setDepth(8000);
    this.spriteKey = def.sprite;
    this.hideUntil = def.hideUntil;
    this.talkHint = scene.add.image(0, 0, "hintBubble-0").setOrigin(0.5, 1).setDepth(8001).setVisible(false);
    if (this.isHiding()) this.sprite.setVisible(false);
  }

  private isHiding(): boolean {
    return !!this.hideUntil && !this.world.has(emergedFlag(this.spriteKey));
  }

  /** Is Nora looking in the monster's direction? */
  private isWatched(): boolean {
    const nora = this.world.nora();
    const dx = this.x - nora.x;
    const dy = this.y - nora.y;
    const dist = Math.hypot(dx, dy) || 1;
    const [fx, fy] = FACING_VEC[nora.facing];
    return (dx * fx + dy * fy) / dist > 0.35;
  }

  update(dt: number, time: number): void {
    if (this.isHiding()) {
      const { when, delay } = this.hideUntil!;
      if (this.world.has(when)) {
        this.hiddenFor += dt;
        if (this.hiddenFor >= delay) this.jumpOut();
      }
      return;
    }

    const calm = this.calmWhen !== undefined && this.world.has(this.calmWhen);
    let frame = 0;
    let alpha = 0.95;
    this.emerging = Math.min(1, this.emerging + dt / 0.6);

    if (this.emerging < 1) {
      // Rising out of the hiding place.
      alpha = this.emerging;
    } else if (calm || this.restFor > 0) {
      this.restFor = Math.max(0, this.restFor - dt);
      this.drift(this.home.x, this.home.y + 6, 20, dt);
    } else if (this.isWatched()) {
      // Frozen, eyes shut: "you can't see me…"
      frame = 1;
      alpha = 0.7;
    } else {
      const nora = this.world.nora();
      this.drift(nora.x, nora.y, 17, dt);
      if (Math.hypot(nora.x - this.x, nora.y - this.y) < 9 && this.world.canCatch()) this.world.caught(this);
    }

    const float = (5 + Math.sin(time / 300) * 2) * this.emerging + 10 * (1 - this.emerging) * this.emerging;
    this.sprite.setTexture(`${this.spriteKey}-${frame}`).setAlpha(alpha);
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y - float));
    this.sprite.setScale(0.4 + 0.6 * this.emerging);
    // While frozen she can be talked to – show it.
    this.talkHint
      .setVisible(frame === 1 && !calm)
      .setPosition(this.sprite.x, this.sprite.y - this.sprite.height - 1 + Math.round(Math.sin(time / 200)));
  }

  private jumpOut(): void {
    this.world.give(emergedFlag(this.spriteKey));
    this.world.startle("BUU!");
    this.sprite.setVisible(true);
    this.emerging = 0;
    this.restFor = 1.5;
  }

  private drift(x: number, y: number, speed: number, dt: number): void {
    const dx = x - this.x;
    const dy = y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;
    const step = Math.min(dist, speed * dt);
    this.x += (dx / dist) * step;
    this.y += (dy / dist) * step;
    if (Math.abs(dx) > 1) this.sprite.setFlipX(dx < 0);
  }

  /** "Poff!" – back home, and leave Nora alone for a while. */
  retreat(): void {
    this.x = this.home.x;
    this.y = this.home.y + 6;
    this.restFor = 6;
  }
}

// ---------- Crawler: scuttles between hiding places ----------

/**
 * Stays hidden most of the time and now and then scuttles along a short route –
 * always the one farthest from Nora, so it's a glimpse and never an attack.
 * When `catchWhen` is set it hides in one of its shelters, making the toys rustle,
 * until Nora finds it.
 */
export class Crawler implements Monster {
  readonly kind = "crawler";
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly rustle: Phaser.GameObjects.Image;
  private readonly spriteKey: string;
  private readonly routes: { x: number; y: number }[][];
  readonly shelters: [number, number][];
  private readonly catchWhen?: Flags;
  private readonly unseenUntil?: Flags;
  private hiddenFor = 6 + Math.random() * 4;
  private path: { x: number; y: number }[] = [];
  private shelterIndex = -1;
  private shelterTime = 0;
  x: number;
  y: number;

  constructor(
    scene: Phaser.Scene,
    def: Extract<MonsterDef, { type: "crawler" }>,
    private readonly world: MonsterWorld,
  ) {
    this.spriteKey = def.sprite;
    this.routes = def.routes.map((r) => r.map(tileCenter));
    this.shelters = def.shelters ?? [];
    this.catchWhen = def.catchWhen;
    this.unseenUntil = def.unseenUntil;
    this.x = this.routes[0][0].x;
    this.y = this.routes[0][0].y;
    this.sprite = scene.add.sprite(this.x, this.y, `${def.sprite}-0`).setVisible(false);
    this.rustle = scene.add.image(0, 0, "rustle-0").setDepth(9500).setVisible(false);
  }

  /** Gone for good (caught): hide everything right away. */
  vanish(): void {
    this.sprite.setVisible(false);
    this.rustle.setVisible(false);
  }

  /** The shelter it hides in right now (at the end of the case), or -1. */
  get shelter(): number {
    return this.hunted ? this.shelterIndex : -1;
  }

  private get hunted(): boolean {
    return this.catchWhen !== undefined && this.world.has(this.catchWhen) && !this.world.has(CAUGHT_FLAG);
  }

  update(dt: number, time: number): void {
    if (this.hunted) {
      this.hide(dt, time);
      return;
    }
    this.rustle.setVisible(false);
    this.shelterIndex = -1;
    if (this.world.has(CAUGHT_FLAG)) {
      this.sprite.setVisible(false);
      return;
    }

    if (this.unseenUntil !== undefined && !this.world.has(this.unseenUntil)) {
      this.rustleSomewhere(dt, time);
      return;
    }

    if (this.path.length === 0) {
      this.hiddenFor -= dt;
      if (this.hiddenFor <= 0) this.startRun();
      return;
    }
    const target = this.path[0];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const step = Math.min(dist, 110 * dt);
    if (dist > 0) {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
      if (Math.abs(dx) > 0.5) this.sprite.setFlipX(dx < 0);
    }
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y + Math.sin(time / 40))).setDepth(this.y + 6);
    if (dist < 1) {
      this.path.shift();
      if (this.path.length === 0) {
        this.hiddenFor = 9 + Math.random() * 7;
        this.sprite.stop();
        this.sprite.setVisible(false);
      }
    }
  }

  /** Never seen yet: now and then the toys on a shelf far from Nora rustle. */
  private rustleSomewhere(dt: number, time: number): void {
    this.hiddenFor -= dt;
    if (this.hiddenFor <= 0) {
      const nora = this.world.nora();
      const far = this.shelters.filter(([c, r]) => {
        const p = tileCenter([c, r]);
        return Math.hypot(p.x - nora.x, p.y - nora.y) > 64;
      });
      this.shelterIndex = far.length ? this.shelters.indexOf(far[Math.floor(Math.random() * far.length)]) : -1;
      this.shelterTime = 1.2;
      this.hiddenFor = 7 + Math.random() * 6;
    }
    this.shelterTime -= dt;
    if (this.shelterIndex >= 0 && this.shelterTime > 0) {
      const at = tileCenter(this.shelters[this.shelterIndex]);
      this.rustle.setVisible(true).setPosition(at.x + Math.sin(time / 30), at.y - 10);
    } else {
      this.rustle.setVisible(false);
      this.shelterIndex = -1;
    }
  }

  /** Scuttle along the route farthest from Nora – if none is far enough, wait a little. */
  private startRun(): void {
    const nora = this.world.nora();
    const distanceTo = (route: { x: number; y: number }[]) =>
      Math.min(...route.map((p) => Math.hypot(p.x - nora.x, p.y - nora.y)));
    const route = [...this.routes].sort((a, b) => distanceTo(b) - distanceTo(a))[0];
    if (distanceTo(route) < 64) {
      this.hiddenFor = 2;
      return;
    }
    this.path = Math.random() < 0.5 ? [...route] : [...route].reverse();
    const start = this.path.shift()!;
    this.x = start.x;
    this.y = start.y;
    this.sprite.setVisible(true).play(this.spriteKey, true);
  }

  /** Hiding in a shelf: the toys there rustle now and then. It moves to another shelf once in a while. */
  private hide(dt: number, time: number): void {
    this.sprite.setVisible(false);
    this.shelterTime -= dt;
    if (this.shelterIndex < 0 || this.shelterTime <= 0) {
      let next = Math.floor(Math.random() * this.shelters.length);
      if (next === this.shelterIndex) next = (next + 1) % this.shelters.length;
      this.shelterIndex = next;
      this.shelterTime = 12;
    }
    const at = tileCenter(this.shelters[this.shelterIndex]);
    const on = time % 1600 < 700;
    this.rustle.setVisible(on).setPosition(at.x + (on ? Math.sin(time / 30) : 0), at.y - 10);
  }

  retreat(): void {}
}
