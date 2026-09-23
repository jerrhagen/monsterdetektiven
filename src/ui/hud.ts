import type { CaseState } from "../engine/caseState";
import { uiRoot } from "./layer";
import { isMusicOn, toggleMusic } from "./music";

let el: HTMLDivElement | null = null;
/** The clues that can be found in the room Nora is in. */
let roomClues: string[] = [];

/** Top bar: key reminder on the left, current goal and the book button on the right. */
export function showHud(onBook: () => void, onMap: () => void): void {
  if (el) return;
  el = document.createElement("div");
  el.className = "hud";
  el.innerHTML = `
    <div class="controls">
      <span><kbd>←↑↓→</kbd> gå</span>
      <span><kbd>mellanslag</kbd> hoppa/titta/prata</span>
    </div>
    <div class="goal"><span class="goal-text"></span><small class="room-clues"></small></div>
    <button class="map-button" title="Till stadskartan">🗺️</button>
    <button class="music-button" title="Musik av/på (M)"></button>
    <button class="book-button" title="Detektivboken (B)">📖 <kbd>B</kbd></button>
  `;
  el.querySelector(".book-button")!.addEventListener("click", onBook);
  el.querySelector(".map-button")!.addEventListener("click", onMap);
  el.querySelector(".music-button")!.addEventListener("click", () => {
    toggleMusic();
    updateMusicButton();
  });
  updateMusicButton();
  uiRoot.appendChild(el);
}

export function setHudRoomClues(clues: string[]): void {
  roomClues = clues;
}

export function updateHud(state: CaseState): void {
  const goalEl = el?.querySelector<HTMLSpanElement>(".goal-text");
  const countEl = el?.querySelector<HTMLElement>(".room-clues");
  if (!goalEl || !countEl) return;
  const goal = state.data.goals[state.currentGoalIndex()];
  goalEl.textContent = goal ? `🔍 ${goal.text}` : "🔍 Alla mål klara!";
  // "Have I found everything here?"
  const found = roomClues.filter((id) => state.hasClue(id)).length;
  countEl.textContent = roomClues.length ? `Ledtrådar i rummet: ${found} av ${roomClues.length}` : "";
  countEl.classList.toggle("all", roomClues.length > 0 && found === roomClues.length);
}

export function updateMusicButton(): void {
  const b = el?.querySelector<HTMLButtonElement>(".music-button");
  if (b) b.innerHTML = `${isMusicOn() ? "🎵" : "🔇"} <kbd>M</kbd>`;
}

export function hideHud(): void {
  el?.remove();
  el = null;
}
