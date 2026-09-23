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
  /** Alternative talks, checked in order – the first whose `when` flags are all set is used. */
  talkIf?: (Talk & { when: Flags })[];
}

export type Edge = "left" | "right" | "top" | "bottom";

/** A door is a group of `D` tiles on one edge of the room. */
export interface Door {
  at: Edge;
  /** Room id it leads to. Without `to` the door is always locked. */
  to?: string;
  /** Flag needed to open it. */
  requires?: string;
  lockedText?: string;
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
  goals: Goal[];
}
