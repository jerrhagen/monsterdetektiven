import type { Case, Flags, Talk, Thing } from "../cases/types";

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

  constructor(readonly data: Case) {}

  has(flags?: Flags): boolean {
    return flagList(flags).every((f) => this.flags.has(f));
  }

  /** Sets flags; returns the ones that were new. */
  give(flags?: Flags): string[] {
    const added = flagList(flags).filter((f) => !this.flags.has(f));
    added.forEach((f) => this.flags.add(f));
    return added;
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

  nextHintAvailable(): boolean {
    return (this.data.goals[this.currentGoalIndex()]?.hints.length ?? 0) > 0;
  }

  /** Ester's next hint for the current goal – each call gives a clearer one. */
  nextHint(): string | undefined {
    const index = this.currentGoalIndex();
    const hints = this.data.goals[index]?.hints ?? [];
    if (hints.length === 0) return undefined;
    const level = this.hintLevels.get(index) ?? 0;
    this.hintLevels.set(index, level + 1);
    this.hintsUsed++;
    return hints[Math.min(level, hints.length - 1)];
  }

  /** Which talk a thing uses right now. */
  talkFor(thing: Thing): Talk {
    return thing.talkIf?.find((t) => this.has(t.when)) ?? thing;
  }
}
