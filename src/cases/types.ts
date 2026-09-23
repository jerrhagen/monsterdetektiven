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
  answer: string;
}

/** Pick options in the right order. */
export interface OrderPuzzle extends PuzzleBase {
  type: "order";
  options: PuzzleOption[];
  answer: string[];
}

/** Pick the one right option. */
export interface ChoicePuzzle extends PuzzleBase {
  type: "choice";
  options: PuzzleOption[];
  answer: string;
}

/** The big reveal: point out who did it, then show two clues as evidence. */
export interface RevealPuzzle extends PuzzleBase {
  type: "reveal";
  options: PuzzleOption[];
  answer: string;
  /** Clue ids that prove it – two of them must be chosen. */
  evidence: string[];
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

export interface Goal {
  text: string;
  doneWhen: Flags;
  /** Ester's hints for this goal: a small nudge, a bigger nudge, almost the answer. */
  hints: string[];
}

export interface Case {
  id: string;
  title: string;
  startRoom: string;
  rooms: Record<string, Room>;
  clues: Record<string, Clue>;
  items?: Record<string, Item>;
  puzzles?: Record<string, Puzzle>;
  goals: Goal[];
}
