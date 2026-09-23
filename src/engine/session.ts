import { cases } from "../cases";
import { CaseState } from "./caseState";
import { HELP_LEVELS, HintTimer } from "./hints";

/** The game in progress. Survives room changes (scene restarts). */
export const session = {
  state: new CaseState(cases[0]),
  hintTimer: new HintTimer(HELP_LEVELS.lagom),
};
