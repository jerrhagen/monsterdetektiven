import { cases } from "../cases";
import type { CaseState } from "../engine/caseState";
import { loadSave } from "../engine/save";
import { casePhoto } from "./casePhotos";
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
    ${photoPages()}
  `;
  // Secret last pages: flip with the corner buttons or the arrow keys.
  const pages = [...el.querySelectorAll<HTMLDivElement>(".page")];
  let shown = 0;
  const turn = (to: number) => {
    if (to < 0 || to >= pages.length || to === shown) return;
    pages[shown].hidden = true;
    pages[to].hidden = false;
    shown = to;
    playClick();
  };
  el.querySelectorAll(".next").forEach((b) => b.addEventListener("click", () => turn(shown + 1)));
  el.querySelectorAll(".back").forEach((b) => b.addEventListener("click", () => turn(shown - 1)));
  onKey = (e) => {
    if (e.key === "ArrowRight") turn(shown + 1);
    else if (e.key === "ArrowLeft") turn(shown - 1);
  };
  window.addEventListener("keydown", onKey);
  el.querySelectorAll(".close").forEach((b) => b.addEventListener("click", closeNotebook));
  el.addEventListener("click", (e) => {
    if (e.target === el) closeNotebook();
  });
  uiRoot.appendChild(el);
}

/**
 * The photo pages after the notebook: Nora and Ester cheek to cheek, then one snapshot for every
 * case the player has solved (worked out from the save, so it always matches it).
 */
function photoPages(): string {
  const solved = loadSave().cases;
  const photos = [
    { url: photoUrl(), alt: "Nora och Ester, kind mot kind", caption: 'Jag och Ester <span class="heart">♥</span>' },
    ...cases.flatMap((c) => {
      const photo = solved[c.id] ? casePhoto(c.id) : undefined;
      return photo ? [{ url: photo.url, alt: photo.alt, caption: escape(photo.caption) }] : [];
    }),
  ];
  return photos
    .map(
      (photo, i) => `
    <div class="page photo-page" hidden>
      <button class="close" title="Stäng (B)">✕</button>
      <figure class="photo ${i % 2 ? "tilt-right" : ""}">
        <span class="tape left"></span><span class="tape right"></span>
        <img src="${photo.url}" alt="${escape(photo.alt)}">
        <figcaption>${photo.caption}</figcaption>
      </figure>
      <button class="turn back" title="Bläddra tillbaka (←)">◀</button>
      ${i < photos.length - 1 ? '<button class="turn next" title="Bläddra (→)">▶</button>' : ""}
    </div>`,
    )
    .join("");
}

function escape(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
