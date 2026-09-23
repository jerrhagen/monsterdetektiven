import type { CaseState } from "../engine/caseState";
import { uiRoot } from "./layer";
import { isMusicOn, toggleMusic } from "./music";

let el: HTMLDivElement | null = null;

/** Top bar: key reminder on the left, current goal and the book button on the right. */
export function showHud(onBook: () => void): void {
  if (el) return;
  el = document.createElement("div");
  el.className = "hud";
  el.innerHTML = `
    <div class="controls">
      <span><kbd>←↑↓→</kbd> gå</span>
      <span><kbd>mellanslag</kbd> hoppa</span>
      <span><kbd>Ctrl</kbd> titta/prata</span>
    </div>
    <div class="goal"></div>
    <button class="music-button" title="Musik av/på (M)"></button>
    <button class="book-button" title="Detektivboken (B)">📖 <kbd>B</kbd></button>
  `;
  el.querySelector(".book-button")!.addEventListener("click", onBook);
  el.querySelector(".music-button")!.addEventListener("click", () => {
    toggleMusic();
    updateMusicButton();
  });
  updateMusicButton();
  uiRoot.appendChild(el);
}

export function updateHud(state: CaseState): void {
  const goalEl = el?.querySelector<HTMLDivElement>(".goal");
  if (!goalEl) return;
  const goal = state.data.goals[state.currentGoalIndex()];
  goalEl.textContent = goal ? `🔍 ${goal.text}` : "🔍 Alla mål klara!";
}

export function updateMusicButton(): void {
  const b = el?.querySelector<HTMLButtonElement>(".music-button");
  if (b) b.innerHTML = `${isMusicOn() ? "🎵" : "🔇"} <kbd>M</kbd>`;
}

export function hideHud(): void {
  el?.remove();
  el = null;
}
