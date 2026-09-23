/** One flag or several flags that must all be set. */
export type Flags = string | string[];

/** What happens when Nora uses a thing: speech bubbles, and what it gives. */
export interface Talk {
  talk: string[];
  /** Flags (or item ids) given when the dialog closes. */
  gives?: Flags;
  /** Clue id added to the detective book when the dialog closes. */
  clue?: string;
}

/** Something in a room Nora can look at or talk to (a lowercase letter in the layout). */
export interface Thing extends Talk {
  name: string;
  /** Pixel sprite key, see src/sprites. */
  sprite: string;
  /** Layout character of what's drawn underneath, e.g. "K" for something standing on the counter. */
  on?: string;
  /** Alternative talks, checked in order – the first whose `when` flags are all set is used. */
  talkIf?: (Talk & { when: Flags })[];
  /** A puzzle that starts when Nora uses the thing (until it's solved). */
  puzzle?: string;
  /** Flags needed before the puzzle is offered. */
  puzzleWhen?: Flags;
  /** Said just before the puzzle opens (defaults to the current talk). */
  puzzleIntro?: string[];
  /** The thing disappears when these flags are set (e.g. a secret egg once found). */
  hideWhen?: Flags;
}

export interface PuzzleOption {
  id: string;
  label: string;
  sprite?: string;
}

interface PuzzleBase {
  title: string;
  text: string[];
  /** Flag given when solved. */
  gives: string;
}

/** Type a number, e.g. the code to a lock. */
export interface CodePuzzle extends PuzzleBase {
  type: "code";
  /** The code – or a sum like "{ball}+{car}" when `random` is used. */
  answer: string;
  /**
   * Random numbers, rolled once per case: `{ name: [min, max] }`. Write {name}
   * in the text (and in goal hints) to show them.
   */
  random?: Record<string, [number, number]>;
  /** Random words, rolled once per case: `{ name: [choices] }`. Two names never get the same word. */
  words?: Record<string, string[]>;
  /** Roll again until the answer is inside this range, e.g. [11, 19] for a two-digit answer. */
  answerRange?: [number, number];
}

/** Pick options in the right order. */
export interface OrderPuzzle extends PuzzleBase {
  type: "order";
  options: PuzzleOption[];
  answer: string[];
  /**
   * For a random order: a description per option id. `pick` of them are chosen
   * in random order and written as "Först …", "Sedan …", "Sist …" after the text.
   */
  describe?: Record<string, string>;
  pick?: number;
}

export interface ChoiceVariant {
  text: string[];
  options: PuzzleOption[];
  answer: string;
  /** Ester's last hint for this variant – available as {<puzzle id>:hint} in goal hints. */
  hint: string;
}

/** Pick the one right option. */
export interface ChoicePuzzle extends PuzzleBase {
  type: "choice";
  options: PuzzleOption[];
  answer: string;
  /** Several riddles to choose from: one is picked at random per case. */
  variants?: ChoiceVariant[];
}

/**
 * The big reveal: point out who did it, then prove it with clues from the book.
 * `proof` is a list of groups; Nora must pick one clue from each group – clues
 * that each show something different – so random pairs don't work.
 */
export interface RevealPuzzle extends PuzzleBase {
  type: "reveal";
  options: PuzzleOption[];
  answer: string;
  proof: string[][];
  /** Ester's comment when a wrong suspect is picked (by option id). */
  whyNot?: Record<string, string>;
  /** Ester's comment when a clue doesn't prove it (by clue id). */
  why?: Record<string, string>;
}

export type Puzzle = CodePuzzle | OrderPuzzle | ChoicePuzzle | RevealPuzzle;

export type Edge = "left" | "right" | "top" | "bottom";

/** A door is a group of `D` tiles on one edge of the room. */
export interface Door {
  at: Edge;
  /** Room id it leads to. Without `to` the door is always locked. */
  to?: string;
  /** Flag needed to open it. */
  requires?: string;
  lockedText?: string;
  /** A puzzle on the lock – solving it should give the `requires` flag. */
  puzzle?: string;
}

export type Theme = "shop" | "storage" | "yard";

/** Something that moves around by itself, e.g. a toy car. Loops through its path (tile positions). */
export interface Mover {
  sprite: string;
  path: [col: number, row: number][];
  /** Pixels per second. */
  speed?: number;
  /** Longest wait at each stop, in milliseconds (the actual wait is random). */
  pause?: number;
}

/** A monster that moves around the room. See DESIGN.md, section 5. */
export type MonsterDef =
  | {
      /** Flies in a figure-eight and swoops at Nora. If she's caught she is carried back to the door. */
      type: "flyer";
      sprite: string;
      center: [col: number, row: number];
      /** Half the width and height of the flight path, in tiles. */
      size: [number, number];
    }
  | {
      /** Creeps closer while Nora looks away and freezes when she looks. Can be talked to. */
      type: "sneaker";
      sprite: string;
      home: [col: number, row: number];
      thing: Thing;
      /** When these flags are set, the monster stops hunting and stays at home. */
      calmWhen?: Flags;
      /** Hides at home until `when` is set, then jumps out after `delay` seconds. */
      hideUntil?: { when: Flags; delay: number };
    }
  | {
      /** Hidden most of the time; now and then scuttles along one of its short routes, far from Nora. */
      type: "crawler";
      sprite: string;
      routes: [col: number, row: number][][];
      /** When `catchWhen` is set it hides in one of these (e.g. shelf tiles) until Nora finds it. */
      shelters?: [col: number, row: number][];
      catchWhen?: Flags;
    };

export interface Room {
  name: string;
  theme: Theme;
  /** 12 rows × 20 characters. See TILE_CHARS in engine/room.ts. */
  layout: string[];
  things?: Record<string, Thing>;
  /** Digits in the layout → clue ids. */
  clues?: Record<string, string>;
  doors?: Door[];
  movers?: Mover[];
  monsters?: MonsterDef[];
  /** Said the first time Nora walks in. */
  onEnter?: Talk & { name: string };
}

export interface Clue {
  name: string;
  sprite: string;
  text: string;
}

export interface Item {
  name: string;
  sprite: string;
}

/**
 * One of Ester's hints. A plain string is always relevant; otherwise it is only
 * given while `when` is true and `skipWhen` is not – so Ester never tells Nora
 * to do something she has already done.
 */
export type Hint = string | { text: string; when?: Flags; skipWhen?: Flags };

export interface Goal {
  text: string;
  doneWhen: Flags;
  /** Ester's hints for this goal: a small nudge, a bigger nudge, almost the answer. */
  hints: Hint[];
}

/** One step of the ending, played after the culprit is caught. */
export type FinaleStep =
  | { say: string; lines: string[] }
  /** Someone walks in from one tile to another. */
  | { enter: string; sprite: string; from: [col: number, row: number]; to: [col: number, row: number] }
  /** Change which frame an actor shows (e.g. Grymlan with both arms again). */
  | { frame: string; index: number }
  /** A white flash – something magical, or quick sewing. */
  | { flash: true }
  /** Something glowing appears next to an actor ("nora" works too). */
  | { reveal: string; sprite: string }
  /** Someone leaves the scene. */
  | { hide: string }
  | { give: string };

export interface MonsterCard {
  sprite: string;
  name: string;
  text: string;
}

export interface Case {
  id: string;
  /** "Fall 1" etc. */
  number: number;
  title: string;
  /** Shown before the case starts: the hook. */
  intro: string[];
  /** Played after the culprit is caught. */
  finale: FinaleStep[];
  /** "Visste du att…?" at the end. */
  fact: string;
  /** Monster cards earned by solving the case. */
  cards: MonsterCard[];
  startRoom: string;
  rooms: Record<string, Room>;
  clues: Record<string, Clue>;
  items?: Record<string, Item>;
  puzzles?: Record<string, Puzzle>;
  goals: Goal[];
}
