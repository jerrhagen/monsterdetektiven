import { audio } from "./sound";

/**
 * Calm, muted, slightly mysterious background music, generated with Web Audio:
 * soft chords in A minor under a sparse music-box melody with an echo.
 * No sound files needed. M turns it on and off (remembered in this browser).
 */

const VOLUME = 0.07;
const BEAT = 0.75; // seconds per beat
const BAR = BEAT * 4;
const MUTE_KEY = "monsterdetektiven-musik-av";

// Am – F – Dm – E: minor and a little eerie, resolving back home.
const CHORDS = [
  [220.0, 261.63, 329.63], // A C E
  [174.61, 220.0, 261.63], // F A C
  [146.83, 174.61, 220.0], // D F A
  [164.81, 207.65, 246.94], // E G# B
];
// A minor pentatonic, plus F for a darker colour.
const MELODY = [440, 523.25, 587.33, 659.25, 698.46, 783.99, 880];

let master: GainNode | null = null;
let echo: DelayNode | null = null;
let timer = 0;
let nextBarTime = 0;
let bar = 0;
let muted = readMuted();

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveMuted(): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // Storage may be blocked – the setting just isn't remembered.
  }
}

export function isMusicOn(): boolean {
  return !muted;
}

/** Starts the music (call after a key press or click – browsers require it). */
export function startMusic(): void {
  const a = audio();
  if (!a || master) return;
  master = a.createGain();
  master.gain.value = muted ? 0 : VOLUME;
  const lowpass = a.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1400;
  master.connect(lowpass).connect(a.destination);

  // A soft echo for the music box.
  echo = a.createDelay();
  echo.delayTime.value = BEAT * 0.75;
  const feedback = a.createGain();
  feedback.gain.value = 0.35;
  echo.connect(feedback).connect(echo);
  echo.connect(master);

  nextBarTime = a.currentTime + 0.2;
  timer = window.setInterval(schedule, 200);
  schedule();
}

export function toggleMusic(): boolean {
  muted = !muted;
  saveMuted();
  const a = audio();
  if (master && a) master.gain.setTargetAtTime(muted ? 0 : VOLUME, a.currentTime, 0.3);
  return !muted;
}

export function stopMusic(): void {
  window.clearInterval(timer);
  master?.disconnect();
  master = null;
}

/** Schedules the bars that start within the next second. */
function schedule(): void {
  const a = audio();
  if (!a || !master) return;
  while (nextBarTime < a.currentTime + 1) {
    playBar(a, nextBarTime, CHORDS[bar % CHORDS.length]);
    nextBarTime += BAR;
    bar++;
  }
}

function playBar(a: AudioContext, start: number, chord: number[]): void {
  // Pad: each note twice, slightly out of tune, fading slowly in and out.
  for (const freq of chord) {
    for (const detune of [-6, 5]) {
      voice(a, start, BAR + 0.8, freq / 2, "triangle", 0.18, 0.9, detune, master!);
    }
  }
  // Music box: a few scattered notes, sometimes silence.
  for (let beat = 0; beat < 4; beat++) {
    if (Math.random() < 0.45) {
      const note = MELODY[Math.floor(Math.random() * MELODY.length)];
      const t = start + beat * BEAT + (Math.random() < 0.3 ? BEAT / 2 : 0);
      voice(a, t, 1.6, note, "sine", 0.22, 0.01, 0, master!);
      voice(a, t, 1.6, note, "sine", 0.1, 0.01, 0, echo!);
    }
  }
}

function voice(
  a: AudioContext,
  start: number,
  length: number,
  freq: number,
  type: OscillatorType,
  volume: number,
  attack: number,
  detune: number,
  out: AudioNode,
): void {
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(start + length + 0.1);
}
