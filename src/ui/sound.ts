/** Tiny sound effects made with the Web Audio API – no sound files needed. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, length: number, type: OscillatorType = "triangle", volume = 0.18): void {
  const a = audio();
  if (!a) return;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = a.currentTime + start;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + length);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + length + 0.05);
}

/** A happy rising jingle. */
export function playSuccess(): void {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25));
  tone(1319, 0.36, 0.5, "sine", 0.12);
}

/** A friendly "bonk" – not scary, just "try again". */
export function playWrong(): void {
  tone(220, 0, 0.18, "square", 0.08);
  tone(165, 0.12, 0.25, "square", 0.08);
}

export function playClick(): void {
  tone(880, 0, 0.05, "square", 0.05);
}
