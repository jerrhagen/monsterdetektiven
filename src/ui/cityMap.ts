import { cases } from "../cases";
import type { Case } from "../cases/types";
import { type HelpLevel, formatTime, isUnlocked, loadSave, loadSettings, saveSettings } from "../engine/save";
import { uiRoot } from "./layer";
import { isMusicOn, toggleMusic } from "./music";
import { playClick } from "./sound";
import { isTouch } from "./touch";
import { spriteUrl } from "./spriteImage";

/** Where each case lies on the town map (game pixels), in case order. */
export const MAP_SPOTS: { x: number; y: number; place: string }[] = [
  { x: 60, y: 62, place: "Leksaksaffären" },
  { x: 220, y: 58, place: "Bageriet" },
  { x: 268, y: 94, place: "Biblioteket" },
  { x: 70, y: 134, place: "Skogen" },
  { x: 170, y: 116, place: "Klocktornet" },
  { x: 232, y: 158, place: "Torget" },
];

let el: HTMLDivElement | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;

function escape(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export interface MapActions {
  /** A case was chosen (its index). */
  play(index: number): void;
  /** Nora's marker should move to a spot. */
  select(index: number): void;
  players(): void;
}

/**
 * Labels, stars, moonstone pieces and the buttons for monster cards, settings and players.
 * Returns `tap`, for tapping a place on the map itself (a building): choose it, or play it if chosen.
 */
export function showCityMap(selected: number, actions: MapActions): { tap(index: number): void } {
  hideCityMap();
  el = document.createElement("div");
  el.className = "city-map";
  uiRoot.appendChild(el);

  const ids = cases.map((c) => c.id);
  let busy = false;
  let chosen = selected;

  const render = () => {
    const save = loadSave();
    const shards = cases.slice(0, 5).filter((c) => save.cases[c.id]).length;
    el!.innerHTML = `
      <div class="map-top">
        <h1>Mystiska staden</h1>
        <div class="map-buttons">
          <button class="cards-button">🃏 Monsterkort <kbd>K</kbd></button>
          <button class="settings-button">⚙️ <kbd>I</kbd></button>
          <button class="players-button">👥</button>
        </div>
      </div>
      ${MAP_SPOTS.map((spot, i) => {
        const c = cases[i];
        const open = !!c && isUnlocked(ids, i, save);
        const record = c ? save.cases[c.id] : undefined;
        // Stars and the best time to beat, e.g. "★★★ · ⏱️ 6 min 12 s".
        const stars = record
          ? `${"★".repeat(record.stars)}${"☆".repeat(3 - record.stars)} · ⏱️ ${formatTime(record.bestTime)}`
          : "";
        return `<button class="map-spot ${i === chosen ? "chosen" : ""} ${open ? "" : "locked"}" data-i="${i}"
            style="left: calc(var(--px) * ${spot.x}); top: calc(var(--px) * ${spot.y + 6})">
          <b>${i + 1}. ${escape(c?.title ?? spot.place)}</b>
          <small>${!c ? "Kommer snart" : open ? stars || "Nytt fall!" : "🔒 Lös fallet innan"}</small>
        </button>`;
      }).join("")}
      <div class="map-bottom">
        <span class="shards">Månstensbitar: ${"◆".repeat(shards)}${"◇".repeat(5 - shards)}</span>
        <span class="eggs" title="Hemliga monsterägg">Monsterägg: ${cases
          .map((c) => `<img src="${spriteUrl("monsterEgg")}" alt="" class="${save.cases[c.id]?.egg ? "found" : ""}">`)
          .join("")}</span>
        <span class="map-hint">${isTouch() ? "Tryck två gånger på ett fall för att spela" : "Välj ett fall med pilarna och tryck på mellanslag"}</span>
      </div>`;
    el!.querySelectorAll<HTMLButtonElement>(".map-spot").forEach((b) => {
      const i = Number(b.dataset.i);
      b.addEventListener("click", () => (i === chosen ? start() : choose(i)));
    });
    el!.querySelector(".cards-button")!.addEventListener("click", showCards);
    el!.querySelector(".settings-button")!.addEventListener("click", showSettings);
    el!.querySelector(".players-button")!.addEventListener("click", () => {
      if (!busy) actions.players();
    });
  };

  const choose = (i: number) => {
    chosen = i;
    playClick();
    actions.select(i);
    render();
  };

  const start = () => {
    if (busy) return;
    const c = cases[chosen];
    if (!c || !isUnlocked(ids, chosen)) return;
    actions.play(chosen);
  };

  /** An overlay box; returns a function that closes it. */
  const overlay = (className: string, html: string): (() => void) => {
    busy = true;
    const box = document.createElement("div");
    box.className = `map-overlay ${className}`;
    box.innerHTML = `<div class="map-overlay-box"><button class="close" title="Stäng (Esc)">✕</button>${html}</div>`;
    const close = () => {
      busy = false;
      box.remove();
      render();
    };
    box.querySelector(".close")!.addEventListener("click", close);
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    el!.appendChild(box);
    closeOverlay = close;
    return close;
  };
  let closeOverlay: (() => void) | null = null;

  /** Every monster card in the game – the ones you haven't got yet are shadows with a "?". */
  const showCards = () => {
    const save = loadSave();
    const all = cases.flatMap((c: Case) => c.cards.map((card) => ({ card, from: c })));
    const seen = new Set<string>();
    const unique = all.filter(({ card }) => (seen.has(card.name) ? false : (seen.add(card.name), true)));
    const got = unique.filter(({ card }) => save.cards.includes(card.name)).length;
    overlay(
      "cards-overlay",
      `<h2>🃏 Monsterkort (${got} av ${unique.length})</h2>
      <div class="cards">${unique
        .map(({ card, from }) =>
          save.cards.includes(card.name)
            ? `<div class="monster-card"><img src="${spriteUrl(card.sprite)}" alt=""><b>${escape(card.name)}</b><p>${escape(card.text)}</p></div>`
            : `<div class="monster-card unknown"><img src="${spriteUrl(card.sprite)}" alt=""><b>?</b><p>Lös fall ${from.number} för att få kortet.</p></div>`,
        )
        .join("")}</div>`,
    );
  };

  const showSettings = () => {
    const settings = loadSettings();
    const help: [HelpLevel, string][] = [
      ["mycket", "Mycket hjälp (1 min)"],
      ["lagom", "Lagom (2 min)"],
      ["lite", "Lite hjälp (4 min)"],
    ];
    overlay(
      "settings-overlay",
      `<h2>⚙️ Inställningar</h2>
      <h3>Hur snart ska Ester ge tips?</h3>
      <div class="choices">${help
        .map(([level, label]) => `<button data-help="${level}" class="${settings.help === level ? "on" : ""}">${label}</button>`)
        .join("")}</div>
      <h3>Musik</h3>
      <div class="choices"><button class="music ${isMusicOn() ? "on" : ""}">${isMusicOn() ? "🎵 På" : "🔇 Av"}</button></div>`,
    );
    const box = el!.querySelector(".settings-overlay")!;
    box.querySelectorAll<HTMLButtonElement>("[data-help]").forEach((b) =>
      b.addEventListener("click", () => {
        saveSettings({ ...loadSettings(), help: b.dataset.help as HelpLevel });
        box.querySelectorAll("[data-help]").forEach((o) => o.classList.toggle("on", o === b));
        playClick();
      }),
    );
    const music = box.querySelector<HTMLButtonElement>(".music")!;
    music.addEventListener("click", () => {
      const on = toggleMusic();
      music.textContent = on ? "🎵 På" : "🔇 Av";
      music.classList.toggle("on", on);
    });
  };

  onKey = (e: KeyboardEvent) => {
    if (busy) {
      if (e.key === "Escape") closeOverlay?.();
      return;
    }
    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= MAP_SPOTS.length) choose(n - 1);
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") choose((chosen + 1) % MAP_SPOTS.length);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") choose((chosen + MAP_SPOTS.length - 1) % MAP_SPOTS.length);
    else if (e.key === "k" || e.key === "K") showCards();
    else if (e.key === "i" || e.key === "I") showSettings();
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      start();
    }
  };
  window.addEventListener("keydown", onKey);
  render();
  return {
    tap: (i) => {
      if (busy) return;
      if (i === chosen) start();
      else choose(i);
    },
  };
}

export function hideCityMap(): void {
  if (onKey) window.removeEventListener("keydown", onKey);
  onKey = null;
  el?.remove();
  el = null;
}
