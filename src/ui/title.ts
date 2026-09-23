import { cases } from "../cases";
import {
  PLAYER_COUNT,
  type SaveData,
  clearPlayer,
  currentPlayer,
  listPlayers,
  renamePlayer,
  selectPlayer,
} from "../engine/save";
import { uiRoot } from "./layer";
import { playClick } from "./sound";

let titleEl: HTMLDivElement | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;

function escape(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** "Fall 1 ★★☆ · 3 monsterkort" – or "Nytt spel". */
function progress(data: SaveData): string {
  const solved = cases.filter((c) => data.cases[c.id]);
  if (solved.length === 0) return "Nytt spel";
  const last = solved[solved.length - 1];
  const stars = data.cases[last.id].stars;
  return `Fall ${last.number} ${"★".repeat(stars)}${"☆".repeat(3 - stars)} · ${data.cards.length} monsterkort`;
}

/** The title with four players to choose from. Space/Enter (or clicking the hint) starts with the chosen one. */
export function showTitle(onStart: () => void): void {
  hideTitle();
  titleEl = document.createElement("div");
  titleEl.className = "title";
  uiRoot.appendChild(titleEl);

  let chosen = currentPlayer();
  let busy = false; // a question or name box is open

  const render = () => {
    const players = listPlayers();
    titleEl!.innerHTML = `
      <h1>Monsterdetektiven</h1>
      <p class="subtitle">Mysterier i Mystiska staden</p>
      <p class="start-hint">Tryck på mellanslag för att starta</p>
      <div class="players">
        ${players
          .map(
            (p, i) => `
          <div class="player ${i === chosen ? "chosen" : ""}" data-i="${i}">
            <div class="player-text">
              <b><span class="number">${i + 1}</span> ${escape(p.name)}</b>
              <small>${progress(p.data)}</small>
            </div>
            <div class="player-tools">
              <button class="rename" title="Byt namn">✏️</button>
              <button class="clear" title="Rensa">🗑️</button>
            </div>
          </div>`,
          )
          .join("")}
      </div>
    `;
    titleEl!.querySelectorAll<HTMLDivElement>(".player").forEach((card) => {
      const i = Number(card.dataset.i);
      card.addEventListener("click", () => choose(i));
      card.querySelector(".rename")!.addEventListener("click", (e) => {
        e.stopPropagation();
        askName(i);
      });
      card.querySelector(".clear")!.addEventListener("click", (e) => {
        e.stopPropagation();
        askClear(i);
      });
    });
    titleEl!.querySelector(".start-hint")!.addEventListener("click", start);
  };

  const choose = (i: number) => {
    chosen = i;
    selectPlayer(i);
    playClick();
    render();
  };

  const start = () => {
    if (busy) return;
    selectPlayer(chosen);
    hideTitle();
    onStart();
  };

  /** A small box on top of the title; `build` fills it and returns what Enter should do. */
  const dialog = (build: (box: HTMLDivElement, close: () => void) => () => void) => {
    busy = true;
    const overlay = document.createElement("div");
    overlay.className = "title-dialog";
    const box = document.createElement("div");
    box.className = "title-dialog-box";
    overlay.appendChild(box);
    const close = () => {
      busy = false;
      overlay.remove();
      render();
    };
    const onEnter = build(box, close);
    overlay.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") close();
      if (e.key === "Enter") onEnter();
    });
    titleEl!.appendChild(overlay);
    box.querySelector<HTMLElement>("input, button")?.focus();
  };

  const askName = (i: number) =>
    dialog((box, close) => {
      box.innerHTML = `
        <p>Vad heter spelare ${i + 1}?</p>
        <input maxlength="14" />
        <div class="buttons"><button class="ok">Klar</button><button class="cancel">Avbryt</button></div>`;
      const input = box.querySelector("input")!;
      input.value = listPlayers()[i].name;
      input.select();
      const save = () => {
        renamePlayer(i, input.value);
        close();
      };
      box.querySelector(".ok")!.addEventListener("click", save);
      box.querySelector(".cancel")!.addEventListener("click", close);
      return save;
    });

  const askClear = (i: number) =>
    dialog((box, close) => {
      box.innerHTML = `
        <p>Vill du verkligen rensa <b>${escape(listPlayers()[i].name)}</b>?</p>
        <p class="warning">Alla stjärnor och monsterkort försvinner. Det går inte att ångra!</p>
        <div class="buttons"><button class="cancel">Nej, behåll</button><button class="danger">Ja, rensa</button></div>`;
      const yes = () => {
        clearPlayer(i);
        close();
      };
      box.querySelector(".danger")!.addEventListener("click", yes);
      box.querySelector(".cancel")!.addEventListener("click", close);
      // Enter keeps everything – clearing must be clicked on purpose.
      return close;
    });

  onKey = (e: KeyboardEvent) => {
    if (busy) return;
    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= PLAYER_COUNT) choose(n - 1);
    else if (e.key === "ArrowLeft") choose((chosen + PLAYER_COUNT - 1) % PLAYER_COUNT);
    else if (e.key === "ArrowRight") choose((chosen + 1) % PLAYER_COUNT);
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      start();
    }
  };
  window.addEventListener("keydown", onKey);
  render();
}

export function hideTitle(): void {
  if (onKey) window.removeEventListener("keydown", onKey);
  onKey = null;
  titleEl?.remove();
  titleEl = null;
}
