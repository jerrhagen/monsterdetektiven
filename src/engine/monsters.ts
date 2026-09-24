import type * as Phaser from "phaser";
import type { Flags, MonsterDef, Thing } from "../cases/types";
import { TILE } from "./config";
import type { Facing } from "./Player";

/** What a monster may know about and do to the rest of the room. */
export interface MonsterWorld {
  nora(): { x: number; y: number; facing: Facing; airborne: boolean };
  /** False during a grace period after a scare, in dialogs, while carried, etc. */
  canCatch(): boolean;
  caught(by: Monster): void;
  has(flags?: Flags): boolean;
  give(flag: string): void;
  /** A fright that doesn't catch Nora – e.g. a monster jumping out. */
  startle(text: string): void;
  /** Is there cover (a crate, a shelf…) between this point and Nora? */
  isNoraHiddenFrom(x: number, y: number): boolean;
  /** Is Nora right next to a person who looks after her? Then a woken monster gives up. */
  isNoraSafe(): boolean;
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
  /** Is its own speech bubble showing right now? */
  showsTalkHint?(): boolean;
  update(dt: number, time: number): void;
  /** After catching Nora: back off for a while. */
  retreat(): void;
  /** What it shouts when it catches Nora (see MonsterDef.cry). */
  cry?: string;
  /** If it is chasing Nora and will follow her out through a door: who comes after her. */
  pursuit?(): PursuerInfo | undefined;
}

/** A monster on its way after Nora into the next room (kept in the session between rooms). */
export interface PursuerInfo {
  sprite: string;
  cry?: string;
  /** Seconds it keeps chasing once it's through the door. */
  chaseFor: number;
}

/** Set when Nora catches the culprit at the end of a case. */
export const CAUGHT_FLAG = "caught";

/** Set when a hiding monster has jumped out, so it stays out when Nora comes back. */
export const emergedFlag = (sprite: string) => `emerged:${sprite}`;

const tileCenter = ([col, row]: [number, number]) => ({ x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 });

export function createMonster(scene: Phaser.Scene, def: MonsterDef, world: MonsterWorld): Monster {
  const monster = buildMonster(scene, def, world);
  monster.cry = def.cry;
  return monster;
}

function buildMonster(scene: Phaser.Scene, def: MonsterDef, world: MonsterWorld): Monster {
  switch (def.type) {
    case "flyer":
      return new Flyer(scene, def, world);
    case "sneaker":
      return new Sneaker(scene, def, world);
    case "crawler":
      return new Crawler(scene, def, world);
    case "patroller":
      return new Patroller(scene, def, world);
    case "sleeper":
      return new Sleeper(scene, def, world);
  }
}

/** Moves (x, y) toward a point; returns the new position and whether it arrived. */
function step(from: { x: number; y: number }, to: { x: number; y: number }, speed: number, dt: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return { x: to.x, y: to.y, arrived: true, dx };
  const s = Math.min(dist, speed * dt);
  return { x: from.x + (dx / dist) * s, y: from.y + (dy / dist) * s, arrived: s >= dist, dx };
}

// ---------- Patroller: walks back and forth ----------

class Patroller implements Monster {
  readonly kind = "patroller";
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  private readonly path: { x: number; y: number }[];
  private readonly speed: number;
  private readonly walkAnim?: string;
  private readonly calmWhen?: Flags;
  private target = 1;
  private direction = 1;
  private restFor = 0;
  x: number;
  y: number;

  constructor(
    scene: Phaser.Scene,
    def: Extract<MonsterDef, { type: "patroller" }>,
    private readonly world: MonsterWorld,
  ) {
    this.path = def.path.map(([c, r]) => ({ x: c * TILE + TILE / 2, y: r * TILE + TILE - 2 }));
    this.speed = def.speed ?? 32;
    this.calmWhen = def.calmWhen;
    this.x = this.path[0].x;
    this.y = this.path[0].y;
    this.shadow = scene.add.ellipse(this.x, this.y, 12, 4, 0x000000, 0.3);
    this.sprite = scene.add.sprite(this.x, this.y, `${def.sprite}-0`).setOrigin(0.5, 1);
    if (scene.anims.exists(def.sprite)) this.walkAnim = def.sprite;
  }

  update(dt: number): void {
    if (this.calmWhen !== undefined && this.world.has(this.calmWhen)) {
      // Calmed down: it walks back to the start of its path and stays there, harmless.
      const home = step(this, this.path[0], this.speed * 0.7, dt);
      this.x = home.x;
      this.y = home.y;
      if (Math.abs(home.dx) > 0.5) this.sprite.setFlipX(home.dx < 0);
      if (this.walkAnim && !home.arrived) this.sprite.play(this.walkAnim, true);
      else this.sprite.stop();
      this.sprite.setPosition(Math.round(this.x), Math.round(this.y)).setDepth(this.y);
      this.shadow.setPosition(Math.round(this.x), Math.round(this.y - 1)).setDepth(this.y - 0.5);
      return;
    }
    if (this.restFor > 0) {
      this.restFor -= dt;
    } else {
      const next = step(this, this.path[this.target], this.speed, dt);
      this.x = next.x;
      this.y = next.y;
      if (Math.abs(next.dx) > 0.5) this.sprite.setFlipX(next.dx < 0);
      if (next.arrived) {
        if (this.target === this.path.length - 1 || this.target === 0) {
          this.direction *= -1;
          this.restFor = 0.8;
        }
        this.target += this.direction;
      }
      if (this.walkAnim) this.sprite.play(this.walkAnim, true);
    }
    if (this.restFor > 0 && this.walkAnim) this.sprite.stop();

    const nora = this.world.nora();
    if (Math.hypot(nora.x - this.x, nora.y - this.y) < 10 && this.world.canCatch()) this.world.caught(this);
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y)).setDepth(this.y);
    this.shadow.setPosition(Math.round(this.x), Math.round(this.y - 1)).setDepth(this.y - 0.5);
  }

  /** Stops for a moment after a scare, so Nora can get away. */
  retreat(): void {
    this.restFor = 2.5;
  }
}

// ---------- Sleeper: wakes up if Nora jumps close by ----------

/** Seconds a woken sleeper stays in its startled pose before it starts running. */
const STARTLED_TIME = 0.4;
const SLEEPER_AWAKE = 3.5;

class Sleeper implements Monster {
  readonly kind = "sleeper";
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly zzz: Phaser.GameObjects.Image;
  private readonly home: { x: number; y: number };
  private readonly wakeRadius: number;
  private readonly spriteKey: string;
  private readonly runAnim?: string;
  private readonly calmWhen?: Flags;
  private readonly follows: boolean;
  private awakeFor = 0;
  cry?: string;
  x: number;
  y: number;

  constructor(
    scene: Phaser.Scene,
    def: Extract<MonsterDef, { type: "sleeper" }>,
    private readonly world: MonsterWorld,
  ) {
    this.home = { x: def.at[0] * TILE + TILE / 2, y: def.at[1] * TILE + TILE - 2 };
    this.x = this.home.x;
    this.y = this.home.y;
    this.wakeRadius = (def.wakeRadius ?? 3) * TILE;
    this.spriteKey = def.sprite;
    this.calmWhen = def.calmWhen;
    this.follows = def.follows ?? false;
    if (scene.anims.exists(`${def.sprite}-run`)) this.runAnim = `${def.sprite}-run`;
    scene.add.ellipse(this.x, this.y - 1, 14, 4, 0x000000, 0.3).setDepth(this.y - 0.5);
    this.sprite = scene.add.sprite(this.x, this.y, `${def.sprite}-0`).setOrigin(0.5, 1).setDepth(this.y);
    this.zzz = scene.add.image(this.x + 8, this.y - 18, "zzz-0").setDepth(9000);
  }

  update(dt: number, time: number): void {
    const nora = this.world.nora();
    const toNora = Math.hypot(nora.x - this.x, nora.y - this.y);
    let moved = false;

    const calm = this.calmWhen !== undefined && this.world.has(this.calmWhen);
    if (calm) this.awakeFor = 0;

    if (this.awakeFor <= 0) {
      // Asleep. A jump close by is too loud!
      if (!calm && nora.airborne && toNora < this.wakeRadius && this.world.canCatch()) {
        this.awakeFor = SLEEPER_AWAKE;
        this.world.startle(this.cry ?? "GRRR!");
      }
      const next = step(this, this.home, 30, dt);
      moved = !next.arrived;
      if (Math.abs(next.dx) > 0.5) this.sprite.setFlipX(next.dx < 0);
      this.x = next.x;
      this.y = next.y;
    } else if (this.world.isNoraSafe()) {
      // Nora made it to someone who looks after her – not worth it. Back to sleep.
      this.awakeFor = 0;
    } else {
      this.awakeFor -= dt;
      // First a moment in the startled pose (the warning), then the chase.
      if (this.awakeFor < SLEEPER_AWAKE - STARTLED_TIME) {
        const next = step(this, nora, 48, dt);
        this.x = next.x;
        this.y = next.y;
        moved = true;
        if (Math.abs(next.dx) > 0.5) this.sprite.setFlipX(next.dx < 0);
        if (toNora < 10 && this.world.canCatch()) this.world.caught(this);
      }
    }

    const asleep = this.awakeFor <= 0 && !moved;
    if (moved && this.runAnim) {
      this.sprite.play(this.runAnim, true);
    } else {
      this.sprite.stop();
      this.sprite.setTexture(`${this.spriteKey}-${asleep ? 0 : 1}`);
    }
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y)).setDepth(this.y);
    this.zzz.setVisible(asleep).setPosition(this.x + 8, this.y - 20 - (time / 200) % 6).setAlpha(1 - ((time / 200) % 6) / 6);
  }

  /** After catching Nora it goes back to sleep. */
  retreat(): void {
    this.awakeFor = 0;
  }

  pursuit(): PursuerInfo | undefined {
    const chasing = this.follows && this.awakeFor > 0 && this.awakeFor < SLEEPER_AWAKE - STARTLED_TIME;
    return chasing ? { sprite: this.spriteKey, cry: this.cry, chaseFor: this.awakeFor + 1 } : undefined;
  }
}

// ---------- Pursuer: a woken sleeper that followed Nora through a door ----------

/** Seconds before the pursuer comes through the door after Nora. */
const PURSUER_DELAY = 1;

export class Pursuer implements Monster {
  readonly kind = "sleeper";
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  private readonly door: { x: number; y: number };
  private readonly runAnim?: string;
  private wait = PURSUER_DELAY;
  private chaseFor: number;
  private gone = false;
  cry?: string;
  x: number;
  y: number;

  constructor(
    scene: Phaser.Scene,
    private readonly info: PursuerInfo,
    door: { x: number; y: number },
    private readonly world: MonsterWorld,
  ) {
    this.door = door;
    this.x = door.x;
    this.y = door.y;
    this.chaseFor = info.chaseFor;
    this.cry = info.cry;
    if (scene.anims.exists(`${info.sprite}-run`)) this.runAnim = `${info.sprite}-run`;
    this.shadow = scene.add.ellipse(this.x, this.y - 1, 14, 4, 0x000000, 0.3).setVisible(false);
    this.sprite = scene.add.sprite(this.x, this.y, `${info.sprite}-1`).setOrigin(0.5, 1).setVisible(false);
  }

  update(dt: number): void {
    if (this.gone) return;
    if (this.wait > 0) {
      this.wait -= dt;
      if (this.wait <= 0) {
        this.sprite.setVisible(true);
        this.shadow.setVisible(true);
        this.world.startle(this.cry ?? "GRRR!");
      }
      return;
    }

    const nora = this.world.nora();
    if (this.chaseFor > 0 && this.world.isNoraSafe()) this.chaseFor = 0;
    let target = this.door;
    if (this.chaseFor > 0) {
      this.chaseFor -= dt;
      target = nora;
    }
    const next = step(this, target, this.chaseFor > 0 ? 48 : 36, dt);
    this.x = next.x;
    this.y = next.y;
    if (Math.abs(next.dx) > 0.5) this.sprite.setFlipX(next.dx < 0);
    if (this.chaseFor > 0 && Math.hypot(nora.x - this.x, nora.y - this.y) < 10 && this.world.canCatch()) this.world.caught(this);
    if (this.chaseFor <= 0 && next.arrived) {
      // Back out through the door it came in by.
      this.gone = true;
      this.sprite.setVisible(false);
      this.shadow.setVisible(false);
      return;
    }

    if (this.runAnim) this.sprite.play(this.runAnim, true);
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y)).setDepth(this.y);
    this.shadow.setPosition(Math.round(this.x), Math.round(this.y - 1)).setDepth(this.y - 0.5);
  }

  retreat(): void {
    this.chaseFor = 0;
  }

  pursuit(): PursuerInfo | undefined {
    return !this.gone && this.wait <= 0 && this.chaseFor > 0 ? { ...this.info, chaseFor: this.chaseFor + 1 } : undefined;
  }
}

// ---------- Flyer: loops around the room and swoops at Nora ----------

const FLY_HEIGHT = 16;

/** Seconds the dust takes to fall from a shelf. */
const DUST_TIME = 1.2;

/** Seconds a flyer keeps flying before resting, if she never misses Nora. */
const TIRED_AFTER = 30;

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
  private readonly calmWhen?: Flags;
  readonly thing?: Thing;
  /** Missed attacks (Nora hid or got away). Two misses make her tired, and she rests on the perch. */
  private misses = 0;
  /** If Nora never gets attacked, she rests anyway after this many seconds of flying. */
  private flyFor = TIRED_AFTER;
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
    this.calmWhen = def.calmWhen;
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

  showsTalkHint(): boolean {
    return this.talkHint.visible;
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
    const calm = this.calmWhen !== undefined && this.world.has(this.calmWhen);
    let shake = 0;
    // Calmed down: no more diving. With a perch she goes to rest there for good.
    if (calm && (this.mode === "windup" || this.mode === "swoop")) this.setMode("return");

    if (this.mode === "loop") {
      this.t += dt * 0.6;
      this.flyFor -= dt;
      const p = this.loopPoint();
      this.moveTo(p.x, p.y, 80, dt);
      if (calm && this.perch) this.setMode("toPerch");
      else if (!calm && toNora < 48 && !hidden && this.world.canCatch()) this.setMode("windup");
      else if (this.perch && (this.misses >= 2 || this.flyFor <= 0)) this.setMode("toPerch");
    } else if (this.mode === "toPerch") {
      if (this.moveTo(this.perch!.x, this.perch!.y, 60, dt) < 1) this.land();
    } else if (this.mode === "perched") {
      // Resting, hanging upside down – she won't attack now, and can be talked to.
      if (this.modeTime > 7 && !calm) this.takeOff();
    } else if (this.mode === "windup") {
      // Hovers and shivers for a moment before diving – time to hide!
      shake = Math.sin(time / 25) * 1.5;
      if (hidden) this.giveUp();
      else if (this.modeTime > 0.55) this.setMode("swoop");
    } else if (this.mode === "swoop") {
      this.moveTo(nora.x, nora.y, 88, dt);
      if (hidden) this.giveUp();
      else if (toNora < 9 && this.world.canCatch()) this.world.caught(this);
      else if (this.modeTime > 1.3) {
        this.misses++;
        this.setMode("return");
      }
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
    this.flyFor = TIRED_AFTER;
    this.misses = 0;
    this.sprite.play(this.spriteKey);
    this.setMode("return");
  }

  /** Nora hid behind something: "Huh? Where did she go?" */
  private giveUp(): void {
    this.puzzledFor = 1.2;
    this.misses++;
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
  cry?: string;
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

  showsTalkHint(): boolean {
    return this.talkHint.visible;
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
    this.world.startle(this.cry ?? "BUU!");
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
  /** Early in the case only a little dust falls from a shelf – the real shaking is for the end. */
  private readonly dust: Phaser.GameObjects.Image;
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
    this.dust = scene.add.image(0, 0, "dustFall-0").setDepth(9500).setVisible(false);
  }

  /** Gone for good (caught): hide everything right away. */
  vanish(): void {
    this.sprite.setVisible(false);
    this.rustle.setVisible(false);
    this.dust.setVisible(false);
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
    if (this.world.has(CAUGHT_FLAG)) {
      this.sprite.setVisible(false);
      this.dust.setVisible(false);
      return;
    }

    if (this.unseenUntil !== undefined && !this.world.has(this.unseenUntil)) {
      this.rustleSomewhere(dt);
      return;
    }
    this.dust.setVisible(false);
    this.shelterIndex = -1;

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

  /** Never seen yet: now and then a little dust falls from a shelf far from Nora. */
  private rustleSomewhere(dt: number): void {
    this.hiddenFor -= dt;
    if (this.hiddenFor <= 0) {
      const nora = this.world.nora();
      const far = this.shelters.filter(([c, r]) => {
        const p = tileCenter([c, r]);
        return Math.hypot(p.x - nora.x, p.y - nora.y) > 64;
      });
      this.shelterIndex = far.length ? this.shelters.indexOf(far[Math.floor(Math.random() * far.length)]) : -1;
      this.shelterTime = DUST_TIME;
      this.hiddenFor = 7 + Math.random() * 6;
    }
    this.shelterTime -= dt;
    if (this.shelterIndex >= 0 && this.shelterTime > 0) {
      const at = tileCenter(this.shelters[this.shelterIndex]);
      const fall = 1 - this.shelterTime / DUST_TIME;
      this.dust.setVisible(true).setAlpha(1 - fall * 0.8).setPosition(at.x, at.y - 4 + Math.round(fall * 8));
    } else {
      this.dust.setVisible(false);
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
