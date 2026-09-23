import type { Case, Flags, Hint, Puzzle, Talk, Thing } from "../cases/types";
import { fillIn, rollPuzzle } from "./puzzleRoll";

export function flagList(flags?: Flags): string[] {
  if (!flags) return [];
  return Array.isArray(flags) ? flags : [flags];
}

export const clueFlag = (id: string) => `clue:${id}`;

/** Everything Nora has found and done in the current case. */
export class CaseState {
  private readonly flags = new Set<string>();
  readonly visitedRooms = new Set<string>();
  private readonly hintLevels = new Map<number, number>();
  hintsUsed = 0;
  /** Puzzles with their random parts rolled – the same for the whole case. */
  private readonly puzzles = new Map<string, Puzzle>();
  /** Values goal hints can show with {name}, e.g. the prices on a receipt. */
  private readonly vars: Record<string, string> = {};

  constructor(readonly data: Case) {
    for (const [id, p] of Object.entries(data.puzzles ?? {})) {
      const rolled = rollPuzzle(id, p);
      this.puzzles.set(id, rolled.puzzle);
      Object.assign(this.vars, rolled.vars);
    }
  }

  puzzle(id: string): Puzzle | undefined {
    return this.puzzles.get(id);
  }

  /** Fills in {name} placeholders. */
  fill(text: string): string {
    return fillIn(text, this.vars);
  }

  has(flags?: Flags): boolean {
    return flagList(flags).every((f) => this.flags.has(f));
  }

  /** Sets flags; returns the ones that were new. */
  give(flags?: Flags): string[] {
    const added = flagList(flags).filter((f) => !this.flags.has(f));
    added.forEach((f) => this.flags.add(f));
    return added;
  }

  /** Removes a flag, e.g. when Nora drops the magnifying glass. */
  take(flag: string): void {
    this.flags.delete(flag);
  }

  hasClue(id: string): boolean {
    return this.flags.has(clueFlag(id));
  }

  /** Found clues, in the order they are listed in the case. */
  foundClues(): string[] {
    return Object.keys(this.data.clues).filter((id) => this.hasClue(id));
  }

  items(): string[] {
    return Object.keys(this.data.items ?? {}).filter((id) => this.flags.has(id));
  }

  /** Index of the first goal that isn't done (= goals.length when all are done). */
  currentGoalIndex(): number {
    const i = this.data.goals.findIndex((g) => !this.has(g.doneWhen));
    return i < 0 ? this.data.goals.length : i;
  }

  /** The current goal's hints that still make sense (nothing Nora has already done). */
  private relevantHints(index: number): string[] {
    const relevant = (h: Hint) => typeof h === "string" || (this.has(h.when) && (h.skipWhen === undefined || !this.has(h.skipWhen)));
    return (this.data.goals[index]?.hints ?? []).filter(relevant).map((h) => (typeof h === "string" ? h : h.text));
  }

  nextHintAvailable(): boolean {
    return this.relevantHints(this.currentGoalIndex()).length > 0;
  }

  /** Ester's next hint for the current goal – each call gives a clearer one. */
  nextHint(): string | undefined {
    const index = this.currentGoalIndex();
    const hints = this.relevantHints(index);
    if (hints.length === 0) return undefined;
    const level = this.hintLevels.get(index) ?? 0;
    this.hintLevels.set(index, level + 1);
    this.hintsUsed++;
    return this.fill(hints[Math.min(level, hints.length - 1)]);
  }

  /**
   * Which talk a thing uses right now. The thing's own `gives` always comes along –
   * "has talked to Stina" must be true whichever of her lines Nora heard first.
   */
  talkFor(thing: Thing): Talk {
    const variant = thing.talkIf?.find((t) => this.has(t.when));
    if (!variant) return thing;
    return { ...variant, gives: [...flagList(thing.gives), ...flagList(variant.gives)] };
  }
}
