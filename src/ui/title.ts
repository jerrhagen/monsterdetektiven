import { cases } from "../cases";
import {
  addMissingCards,
  type CaseRecord,
  PLAYER_COUNT,
  type SaveData,
  clearPlayer,
  currentPlayer,
  listPlayers,
  renamePlayer,
  selectPlayer,
  setSolvedCases,
} from "../engine/save";
import { uiRoot } from "./layer";
import { playClick } from "./sound";
import { enterFullscreen, isTouch } from "./touch";

let titleEl: HTMLDivElement | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;

function escape(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * The secret grown-up panel: click the moon's craters small, middle, large – three times in a row.
 * Positions are in game pixels and match TitleScene.drawMoon (the moon is centred at 294, 50).
 */
const MOON_CRATERS = [
  { size: "small", x: 298, y: 45, r: 2.5 },
  { size: "middle", x: 290, y: 48, r: 3 },
  { size: "large", x: 297, y: 54, r: 4 },
] as const;
const CHEAT_CODE = ["small", "middle", "large", "small", "middle", "large", "small", "middle", "large"];

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
  // Cases marked as solved in the secret panel before it handed out cards get their cards now.
  addMissingCards((id) => cases.find((c) => c.id === id)?.cards.map((card) => card.name) ?? []);
  titleEl = document.createElement("div");
  titleEl.className = "title";
  uiRoot.appendChild(titleEl);

  let chosen = currentPlayer();
  let busy = false; // a question or name box is open
  let cheatStep = 0;

  const render = () => {
    const players = listPlayers();
    titleEl!.innerHTML = `
      <h1>Monsterdetektiven</h1>
      <p class="subtitle">Mysterier i Mystiska staden</p>
      <p class="start-hint">${isTouch() ? "Tryck här för att starta ▶" : "Tryck på mellanslag för att starta"}</p>
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
      ${MOON_CRATERS.map(
        (c) => `<button class="moon-spot" data-size="${c.size}" tabindex="-1" aria-hidden="true"
          style="left: calc(var(--px) * ${c.x - c.r}); top: calc(var(--px) * ${c.y - c.r});
                 width: calc(var(--px) * ${c.r * 2}); height: calc(var(--px) * ${c.r * 2})"></button>`,
      ).join("")}
    `;
    titleEl!.querySelectorAll<HTMLButtonElement>(".moon-spot").forEach((spot) => {
      spot.addEventListener("click", (e) => {
        e.stopPropagation();
        const size = spot.dataset.size;
        cheatStep = size === CHEAT_CODE[cheatStep] ? cheatStep + 1 : size === CHEAT_CODE[0] ? 1 : 0;
        if (cheatStep === CHEAT_CODE.length) {
          cheatStep = 0;
          openCheat(chosen);
        }
      });
    });
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
    enterFullscreen();
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

  /** Set which cases the chosen player has solved, with stars and best time. */
  const openCheat = (i: number) =>
    dialog((box, close) => {
      const records = listPlayers()[i].data.cases;
      box.classList.add("cheat");
      box.innerHTML = `
        <p>🌙 Hemliga panelen – <b>${escape(listPlayers()[i].name)}</b></p>
        <table>
          <tr><th>Fall</th><th>Klar</th><th>Stjärnor</th><th>Tid (min:s)</th></tr>
          ${cases
            .map((c) => {
              const r = records[c.id];
              const time = r ? `${Math.floor(r.bestTime / 60)}:${String(Math.round(r.bestTime % 60)).padStart(2, "0")}` : "";
              return `<tr data-id="${c.id}">
                <td>${c.number}. ${escape(c.title)}</td>
                <td><input type="checkbox" class="done" ${r ? "checked" : ""} /></td>
                <td><select class="stars">${[1, 2, 3]
                  .map((n) => `<option ${(r?.stars ?? 3) === n ? "selected" : ""}>${n}</option>`)
                  .join("")}</select></td>
                <td><input class="time" value="${time}" placeholder="10:00" /></td>
              </tr>`;
            })
            .join("")}
        </table>
        <div class="buttons"><button class="ok">Spara</button><button class="cancel">Avbryt</button></div>`;
      const save = () => {
        const next: Record<string, CaseRecord> = {};
        box.querySelectorAll<HTMLTableRowElement>("tr[data-id]").forEach((row) => {
          if (!row.querySelector<HTMLInputElement>(".done")!.checked) return;
          const stars = Number(row.querySelector<HTMLSelectElement>(".stars")!.value);
          const [min, sec] = row.querySelector<HTMLInputElement>(".time")!.value.split(":").map((n) => Number(n.trim()));
          const seconds = (Number.isFinite(min) ? min : 10) * 60 + (Number.isFinite(sec) ? sec : 0);
          const before = records[row.dataset.id!];
          // Three stars always include the secret egg (see starsFor).
          next[row.dataset.id!] = { stars, bestTime: Math.max(1, seconds), egg: stars === 3 || (before?.egg ?? false) };
        });
        // The monster cards follow the solved cases: every card from those cases, none from the others.
        const cards = [...new Set(cases.filter((c) => next[c.id]).flatMap((c) => c.cards.map((card) => card.name)))];
        setSolvedCases(i, next, cards);
        close();
      };
      box.querySelector(".ok")!.addEventListener("click", save);
      box.querySelector(".cancel")!.addEventListener("click", close);
      return save;
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
