import type { CaseState } from "../engine/caseState";
import { uiRoot } from "./layer";
import { photoUrl } from "./photo";
import { playClick } from "./sound";
import { spriteUrl } from "./spriteImage";

let el: HTMLDivElement | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;

export function isNotebookOpen(): boolean {
  return el !== null;
}

export function toggleNotebook(state: CaseState): void {
  if (el) closeNotebook();
  else openNotebook(state);
}

export function closeNotebook(): void {
  if (onKey) window.removeEventListener("keydown", onKey);
  onKey = null;
  el?.remove();
  el = null;
}

/** The detective book: goals so far, clues found and things Nora carries. */
function openNotebook(state: CaseState): void {
  const { data } = state;
  const current = state.currentGoalIndex();

  // Only show goals up to the current one – no spoilers about what comes next.
  const goals = data.goals
    .slice(0, current + 1)
    .map((g, i) => `<li class="${i < current ? "done" : "current"}">${i < current ? "✔" : "➜"} ${escape(g.text)}</li>`)
    .join("");

  const clues = state.foundClues();
  const clueCards = clues.length
    ? clues
        .map((id) => {
          const clue = data.clues[id];
          return `<div class="clue-card"><img src="${spriteUrl(clue.sprite)}" alt=""><div><b>${escape(clue.name)}</b><p>${escape(clue.text)}</p></div></div>`;
        })
        .join("")
    : `<p class="empty">Inga ledtrådar än. Leta noga!</p>`;

  const items = state.items();
  const itemList = items.length
    ? items
        .map((id) => `<span class="item"><img src="${spriteUrl(data.items![id].sprite)}" alt="">${escape(data.items![id].name)}</span>`)
        .join("")
    : `<span class="empty">Inga saker.</span>`;

  el = document.createElement("div");
  el.className = "notebook";
  el.innerHTML = `
    <div class="page">
      <button class="close" title="Stäng (B)">✕</button>
      <h2>📖 Detektivboken – ${escape(data.title)}</h2>
      <div class="columns">
        <section>
          <h3>Mål</h3>
          <ul class="goals">${goals}</ul>
          <h3>Saker</h3>
          <div class="items">${itemList}</div>
        </section>
        <section>
          <h3>Ledtrådar (${clues.length} av ${Object.keys(data.clues).length})</h3>
          <div class="clues">${clueCards}</div>
        </section>
      </div>
      <button class="turn next" title="Bläddra (→)">▶</button>
    </div>
    <div class="page photo-page" hidden>
      <button class="close" title="Stäng (B)">✕</button>
      <figure class="photo">
        <span class="tape left"></span><span class="tape right"></span>
        <img src="${photoUrl()}" alt="Nora och Ester, kind mot kind">
        <figcaption>Jag och Ester <span class="heart">♥</span></figcaption>
      </figure>
      <button class="turn back" title="Bläddra tillbaka (←)">◀</button>
    </div>
  `;
  // A secret last page: flip with the corner button or the arrow keys.
  const [first, second] = el.querySelectorAll<HTMLDivElement>(".page");
  const turn = (toPhoto: boolean) => {
    if (second.hidden !== toPhoto) return;
    first.hidden = toPhoto;
    second.hidden = !toPhoto;
    playClick();
  };
  el.querySelector(".next")!.addEventListener("click", () => turn(true));
  el.querySelector(".back")!.addEventListener("click", () => turn(false));
  onKey = (e) => {
    if (e.key === "ArrowRight") turn(true);
    else if (e.key === "ArrowLeft") turn(false);
  };
  window.addEventListener("keydown", onKey);
  el.querySelectorAll(".close").forEach((b) => b.addEventListener("click", closeNotebook));
  el.addEventListener("click", (e) => {
    if (e.target === el) closeNotebook();
  });
  uiRoot.appendChild(el);
}

function escape(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
