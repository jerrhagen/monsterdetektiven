/** One room is 20 × 12 tiles of 16 px. The canvas is scaled up to fit the window. */
export const TILE = 16;
export const ROOM_COLS = 20;
export const ROOM_ROWS = 12;
export const GAME_WIDTH = TILE * ROOM_COLS; // 320
export const GAME_HEIGHT = TILE * ROOM_ROWS; // 192

/** Season 1 is the first six cases; season 2 (the new district) starts after them. */
export const SEASON1_CASES = 6;
/**
 * How many cases can be played. Season 2 opens one case at a time as the head architect has
 * answered its questions (SEASON2-FRAGOR.md) – the rest show "Kommer snart" on the map.
 */
export const PLAYABLE_CASES = 8;
