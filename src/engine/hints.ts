/** How long Nora may be stuck before Ester calls her, in seconds (the "Hjälpnivå" setting). */
export const HELP_LEVELS = { mycket: 60, lagom: 120, lite: 240 } as const;

const MIN_WAIT = 20;

/**
 * The "stuck timer": counts time since Nora last made progress.
 * When it runs out, Ester has a hint. After a hint the next one comes twice as fast.
 */
export class HintTimer {
  private elapsed = 0;
  private wait: number;

  constructor(private readonly baseSeconds: number) {
    this.wait = baseSeconds;
  }

  /** Nora found something, solved something or entered a new room. */
  progress(): void {
    this.elapsed = 0;
    this.wait = this.baseSeconds;
  }

  tick(seconds: number): void {
    this.elapsed += seconds;
  }

  get ready(): boolean {
    return this.elapsed >= this.wait;
  }

  /** A hint was given: start over, and be quicker next time. */
  hintGiven(): void {
    this.elapsed = 0;
    this.wait = Math.max(MIN_WAIT, this.wait / 2);
  }
}
