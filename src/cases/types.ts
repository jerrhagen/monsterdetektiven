/** One flag or several flags that must all be set. */
export type Flags = string | string[];

/** What happens when Nora uses a thing: speech bubbles, and what it gives. */
export interface Talk {
  talk: string[];
  /** Flags (or item ids) given when the dialog closes. */
  gives?: Flags;
  /** Clue id(s) added to the detective book when the dialog closes. */
  clue?: string | string[];
}

/** Something in a room Nora can look at or talk to (a lowercase letter in the layout). */
export interface Thing extends Talk {
  name: string;
  /**
   * Someone Nora talks to (a person, an animal, a monster, a teddy…). They never glow –
   * instead a speech bubble shows when they have something new to say.
   */
  person?: boolean;
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
  /** What is said after a wrong answer (there is a friendly default). */
  wrong?: string;
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
  /**
   * Values worked out from the random ones, in order – e.g. a number sequence:
   * `{ b: "{a}+{step}", c: "{b}+{step}" }`. Expressions may use + − and ×(*).
   */
  derive?: Record<string, string>;
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
  /** Alphabetical order: `pick` random words become the options, and the answer is A–Ö. */
  alphabetize?: { words: string[]; pick: number; sprite?: string };
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
  /** Show the text in mirror writing. */
  mirror?: boolean;
}

/** Match things in pairs, e.g. rhyming words or animals and their tracks. */
export interface MatchPuzzle extends PuzzleBase {
  type: "match";
  /** Left and right item of each pair (text, or sprite keys with `sprites`). */
  pairs: [string, string][];
  /** How many of the pairs to use (random), default all. */
  pick?: number;
  /** Show the right-hand items as pictures (sprite keys) instead of words. */
  rightSprites?: boolean;
}

/**
 * Which clock shows the time? The time is random; write {time} in the text
 * ("halv fyra"). `minutes` limits the kinds of times, e.g. [0, 30] for hel and halv.
 */
export interface ClockPuzzle extends PuzzleBase {
  type: "clock";
  minutes?: number[];
  /** Filled in when rolled. */
  times?: { id: string; hour: number; minute: number }[];
  answer?: string;
}

/**
 * Type a word (UPPER CASE Swedish letters). One word is picked at random per case and shown
 * – with its letters mixed up (anagram), backwards, as numbers (A=1, B=2 … Ö=29, with the
 * table shown), or as a picture to spell. Nora builds the answer with letter buttons or the keyboard.
 * Goal hints can use {id:first} (the first letter) and {id:length}.
 */
export interface WordPuzzle extends PuzzleBase {
  type: "word";
  mode: "anagram" | "reverse" | "cipher" | "spell";
  words: string[];
  /** For "spell": a picture (sprite key) for every word. */
  pictures?: Record<string, string>;
  /** Filled in when rolled. */
  answer?: string;
  shown?: string;
}

/**
 * Pay with coins and notes. `price` is a number or a random [min, max] rolled per case –
 * write {price} in the text. With `fewest`, it must be paid with as few coins as possible.
 */
export interface CoinsPuzzle extends PuzzleBase {
  type: "coins";
  price: number | [number, number];
  /** The coins and notes to pay with, in kronor, e.g. [1, 2, 5, 10, 20]. */
  coins: number[];
  fewest?: boolean;
  /** Filled in when rolled. */
  amount?: number;
}

/**
 * A 4 × 4 picture sudoku: each of the four pictures once in every row, column and 2 × 2 box.
 * `givens` squares are filled in from the start (fewer is harder). Rolled per case.
 */
export interface GridPuzzle extends PuzzleBase {
  type: "grid";
  symbols: string[];
  givens: number;
  /** Filled in when rolled: the solution (symbol index per square) and which squares are given. */
  solution?: number[];
  given?: boolean[];
}

/**
 * One question in the reveal: pick the answer, then mark EVERY clue in the book that shows it.
 * Nora is told how many to mark. A clue that shows the answer must be in `proof`, and every
 * other clue needs a `why` – so a player who reasons right is never told she's wrong.
 */
export interface RevealQuestion {
  question: string;
  options: PuzzleOption[];
  answer: string;
  /** All the clues that show the answer (from at least two rooms). */
  proof: string[];
  /** Ester's comment when a wrong answer is picked (by option id). */
  whyNot?: Record<string, string>;
  /** Ester's comment when a marked clue doesn't show it (by clue id). */
  why?: Record<string, string>;
  /** Ester's nudge when a proof clue is missing (by clue id) – points the way without giving it away. */
  missing?: Record<string, string>;
}

/** The big reveal: one or more questions, e.g. "What is it?" and then "Whose is it?". */
export interface RevealPuzzle extends PuzzleBase {
  type: "reveal";
  questions: RevealQuestion[];
}

export type Puzzle =
  | CodePuzzle
  | OrderPuzzle
  | ChoicePuzzle
  | RevealPuzzle
  | MatchPuzzle
  | ClockPuzzle
  | WordPuzzle
  | CoinsPuzzle
  | GridPuzzle;

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
  /** Drawn as a staircase instead of a door: up to a higher floor, or down to a lower one. */
  stairs?: "up" | "down";
}

export type Theme =
  | "shop"
  | "storage"
  | "yard"
  | "bakery"
  | "library"
  | "forest"
  | "tower"
  | "square"
  // Season 2:
  | "harbor"
  | "school"
  | "greenhouse"
  | "aquarium"
  | "fair"
  | "museum";

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
export type MonsterDef = (
  | {
      /** Flies in a figure-eight and swoops at Nora. If she's caught she is carried back to the door. */
      type: "flyer";
      sprite: string;
      center: [col: number, row: number];
      /** Half the width and height of the flight path, in tiles. */
      size: [number, number];
      /** Now and then it rests here (hanging, sprite `perchSprite`) and can be talked to. */
      perch?: [col: number, row: number];
      perchSprite?: string;
      thing?: Thing;
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
      /** Walks back and forth along a path. Time it right to get past. */
      type: "patroller";
      /** Frame 0 (and 1 for walking, if there is one). Faces right; flipped when walking left. */
      sprite: string;
      path: [col: number, row: number][];
      /** Pixels per second (default 32). */
      speed?: number;
    }
  | {
      /**
       * Sleeps (frame 0). Wakes up (frame 1) and chases Nora if she JUMPS close by – so tiptoe past!
       * Runs with the animation `<sprite>-run` if the sprite has one. Gives up if Nora reaches a person.
       */
      type: "sleeper";
      sprite: string;
      at: [col: number, row: number];
      /** How close a jump wakes it, in tiles (default 3). */
      wakeRadius?: number;
    }
  | {
      /** Hidden most of the time; now and then scuttles along one of its short routes, far from Nora. */
      type: "crawler";
      sprite: string;
      routes: [col: number, row: number][][];
      /** When `catchWhen` is set it hides in one of these (e.g. shelf tiles) until Nora finds it. */
      shelters?: [col: number, row: number][];
      catchWhen?: Flags;
      /** Until these flags are set it is never seen – only the toys in its shelters rustle now and then. */
      unseenUntil?: Flags;
    }
) & {
  /** What it shouts when it wakes up, jumps out or catches Nora, e.g. "FRÄÄÄS!" for a cat (default "BUUU!"). */
  cry?: string;
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
  /**
   * How much colour has drained out of the room, 0–1 (season 2: the colours are disappearing).
   * The room is drawn that much greyer until a finale `recolor` step brings the colour back.
   */
  faded?: number;
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
  | { give: string }
  /** The colour flows back into a faded room (season 2). */
  | { recolor: true };

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
  /**
   * Ester sums up after the finale: how the clues fit together, step by step,
   * including what the culprit didn't say – so it all makes sense even if the player guessed.
   */
  summary: string[];
  /** Monster cards earned by solving the case. */
  cards: MonsterCard[];
  startRoom: string;
  rooms: Record<string, Room>;
  clues: Record<string, Clue>;
  items?: Record<string, Item>;
  puzzles?: Record<string, Puzzle>;
  goals: Goal[];
}
