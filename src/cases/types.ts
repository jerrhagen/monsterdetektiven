/** Something in a room Nora can look at or talk to (a lowercase letter in the layout). */
export interface Thing {
  name: string;
  /** Pixel sprite key, see src/sprites. */
  sprite: string;
  /** What is said when Nora uses it – one speech bubble per line. */
  talk: string[];
}

export interface Door {
  /** Shown when Nora tries a door that doesn't lead anywhere yet. */
  lockedText?: string;
}

export interface Room {
  name: string;
  /** 12 rows × 20 characters. See TILE_CHARS in engine/room.ts. */
  layout: string[];
  things?: Record<string, Thing>;
  doors?: Door;
}

export interface Case {
  id: string;
  title: string;
  startRoom: string;
  rooms: Record<string, Room>;
}
