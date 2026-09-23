import { uiRoot } from "./layer";

const COLOURS = ["#e04848", "#4a90e2", "#f2d24b", "#5cc46a", "#ff8ade", "#9b6bd6", "#f28c38", "#ffffff"];

/** A burst of confetti falling over the whole screen. */
export function confetti(pieces = 90): void {
  const layer = document.createElement("div");
  layer.className = "confetti";
  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = COLOURS[i % COLOURS.length];
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 30}`);
    piece.style.setProperty("--spin", `${(Math.random() - 0.5) * 1440}deg`);
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
    layer.appendChild(piece);
  }
  uiRoot.appendChild(layer);
  window.setTimeout(() => layer.remove(), 4000);
}
