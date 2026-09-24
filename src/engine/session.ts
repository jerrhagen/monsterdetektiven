import { cases } from "../cases";
import type { PursuerInfo } from "./monsters";
import { CaseState } from "./caseState";
import { HELP_LEVELS, HintTimer } from "./hints";
import { loadSettings } from "./save";

/** Nora always starts a case with her magnifying glass. */
export const MAGNIFIER = "magnifier";

function startCase(index: number): CaseState {
  const state = new CaseState(cases[index]);
  state.give(MAGNIFIER);
  return state;
}

/** The game in progress. Survives room changes (scene restarts). */
export const session = {
  caseIndex: 0,
  state: startCase(0),
  hintTimer: new HintTimer(HELP_LEVELS.lagom),
  /** Where the magnifying glass lies if Nora has dropped it. */
  dropped: null as { roomId: string; x: number; y: number } | null,
  /** The intro card has been shown and the clock is running. */
  started: false,
  startedAt: 0,
  /** A monster that chased Nora out through a door, and is coming after her into the next room. */
  pursuer: null as PursuerInfo | null,
};

/** Starts a case from the beginning (new random puzzles, new clock). */
export function newGame(caseIndex = 0): void {
  session.caseIndex = caseIndex;
  session.state = startCase(caseIndex);
  session.hintTimer = new HintTimer(HELP_LEVELS[loadSettings().help]);
  session.dropped = null;
  session.pursuer = null;
  session.started = false;
  session.startedAt = 0;
}
