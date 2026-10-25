import { cases, season1Cases } from "../cases";
import type { Case } from "../cases/types";
import { PLAYABLE_CASES, SEASON1_CASES } from "../engine/config";
import { type HelpLevel, type SaveData, formatTime, isUnlocked, loadSave, loadSettings, saveSettings } from "../engine/save";
import { S2 } from "../season2/names";
import { session } from "../engine/session";
import { uiRoot } from "./layer";
import { isMusicOn, toggleMusic } from "./music";
import { playClick } from "./sound";
import { isTouch } from "./touch";
import { spriteUrl } from "./spriteImage";

export interface District {
  name: string;
  /** Index of the district's first case. */
  first: number;
  /** Where each of its cases lies on the town map (game pixels), in case order. */
  spots: { x: number; y: number; place: string }[];
}

/** Season 1 in Mystiska staden, season 2 in the new district across the stream (Nora's map). */
export const DISTRICTS: District[] = [
  {
    name: "Mystiska staden",
    first: 0,
    spots: [
      { x: 60, y: 62, place: "Leksaksaffären" },
      { x: 220, y: 58, place: "Bageriet" },
      { x: 268, y: 94, place: "Biblioteket" },
      { x: 70, y: 134, place: "Skogen" },
      { x: 170, y: 116, place: "Klocktornet" },
      { x: 232, y: 158, place: "Torget" },
    ],
  },
  {
    name: S2.district,
    first: SEASON1_CASES,
    spots: [
      { x: 282, y: 148, place: "Fyren" },
      { x: 112, y: 84, place: "Skolan" },
      { x: 284, y: 56, place: "Växthuset" },
      { x: 204, y: 146, place: "Akvariet" },
      { x: 84, y: 146, place: "Tivolit" },
      { x: 228, y: 98, place: "Museet" },
    ],
  },
];

/** Which district a case belongs to. */
export const districtOf = (index: number): number => (index >= SEASON1_CASES ? 1 : 0);

let el: HTMLDivElement | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;
/** The "all cases solved" box has popped up after the last case was just solved (it only does so once). */
let celebrated = false;

/** Season 1 is solved – then the bridge to the new district is open. */
export const allSolved = (save: SaveData) => season1Cases.every((c) => save.cases[c.id]);

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
  /** Go to the other district. */
  switchDistrict(): void;
}

/**
 * Labels, stars, moonstone pieces and the buttons for monster cards, settings and players.
 * Returns `tap`, for tapping a place on the map itself (a building): choose it, or play it if chosen.
 */
export function showCityMap(selected: number, district: number, actions: MapActions): { tap(index: number): void } {
  hideCityMap();
  el = document.createElement("div");
  el.className = "city-map";
  uiRoot.appendChild(el);

  const ids = cases.map((c) => c.id);
  let busy = false;
  let chosen = selected;

  const here = DISTRICTS[district];
  const spots = here.spots;
  const localCases = cases.slice(here.first, here.first + spots.length);
  const render = () => {
    const save = loadSave();
    const shards = cases.slice(0, 5).filter((c) => save.cases[c.id]).length;
    const done = allSolved(save);
    const other = DISTRICTS[1 - district];
    // The button over the bridge glows until the player has been to the new district.
    const fresh = district === 0 && !save.seenDistrict;
    const switcher = done
      ? `<button class="district-button ${fresh ? "new" : ""}">🌉 ${escape(other.name)}${fresh ? " <b>Ny stadsdel!</b>" : ""}</button>`
      : "";
    // Season 2: a drop of colour for every solved case, in the case's colour.
    const drops = ["#e04040", "#f2d24b", "#4aa85a", "#3a8ad8", "#f08a30", "#9a5ad0"];
    const bottomLeft =
      district === 0
        ? `<span class="shards">${done ? "🌕 Månstenen är hel!" : `Månstensbitar: ${"◆".repeat(shards)}${"◇".repeat(5 - shards)}`}</span>`
        : `<span class="shards">Färgdroppar: ${localCases
            .map((c, i) => (save.cases[c.id] ? `<span style="color: ${drops[i]}">●</span>` : "○"))
            .join("")}</span>`;
    el!.innerHTML = `
      ${done && district === 0 ? `<button class="map-done">🏆 Alla fall lösta! Bra jobbat!</button>` : ""}
      <div class="map-top">
        <h1>${escape(here.name)}</h1>
        <div class="map-buttons">
          ${switcher}
          <button class="cards-button">🃏 Monsterkort <kbd>K</kbd></button>
          <button class="settings-button">⚙️ <kbd>I</kbd></button>
          <button class="players-button">👥</button>
        </div>
      </div>
      ${spots.map((spot, local) => {
        const i = here.first + local;
        const c = i < PLAYABLE_CASES ? cases[i] : undefined;
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
        ${bottomLeft}
        <span class="eggs" title="Hemliga monsterägg">Monsterägg: ${localCases
          .map((c) => `<img src="${spriteUrl("monsterEgg")}" alt="" class="${save.cases[c.id]?.egg ? "found" : ""}">`)
          .join("")}</span>
        <span class="map-hint">${isTouch() ? "Tryck två gånger på ett fall för att spela" : "Välj ett fall med pilarna och tryck på mellanslag"}</span>
      </div>`;
    el!.querySelectorAll<HTMLButtonElement>(".map-spot").forEach((b) => {
      const i = Number(b.dataset.i);
      b.addEventListener("click", () => (i === chosen ? start() : choose(i)));
    });
    el!.querySelector(".map-done")?.addEventListener("click", showDone);
    el!.querySelector(".district-button")?.addEventListener("click", () => {
      if (!busy) actions.switchDistrict();
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
    const shown = cases.filter((_, i) => i < SEASON1_CASES || (i < PLAYABLE_CASES && allSolved(save)));
    const all = shown.flatMap((c: Case) => c.cards.map((card) => ({ card, from: c })));
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

  /** Well done! Everything the player has collected, and something new to try. */
  const showDone = () => {
    const save = loadSave();
    const records = season1Cases.map((c) => save.cases[c.id]);
    const stars = records.reduce((sum, r) => sum + (r?.stars ?? 0), 0);
    const eggs = records.filter((r) => r?.egg).length;
    const cardNames = new Set(season1Cases.flatMap((c) => c.cards.map((card) => card.name)));
    const cards = save.cards.filter((name) => cardNames.has(name)).length;
    const challenge =
      stars < season1Cases.length * 3
        ? "Kan du få tre stjärnor på alla fall?"
        : eggs < season1Cases.length
          ? "Kan du hitta alla hemliga monsterägg?"
          : "Kan du slå dina egna rekordtider?";
    overlay(
      "done-overlay",
      `<h2>🏆 Bra jobbat, detektiv!</h2>
      <p>Du har löst alla fall i Mystiska staden.<br>Månstenen är hel, och alla monster är lugna igen.</p>
      <ul class="done-stats">
        <li>⭐ ${stars} av ${season1Cases.length * 3} stjärnor</li>
        <li>🃏 ${cards} av ${cardNames.size} monsterkort</li>
        <li><img src="${spriteUrl("monsterEgg")}" alt=""> ${eggs} av ${season1Cases.length} monsterägg</li>
      </ul>
      <p>${challenge}</p>
      <p class="teaser">Psst… Ester har hört att en ny stadsdel har öppnat på andra sidan bäcken: ${escape(S2.district)}!<br>Gå över bron och se vad som är på gång där.</p>
      <div class="choices"><button class="to-district">🌉 Till ${escape(S2.district)}</button></div>`,
    );
    el!.querySelector(".to-district")?.addEventListener("click", () => {
      closeOverlay?.();
      actions.switchDistrict();
    });
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
    const local = chosen - here.first;
    if (Number.isInteger(n) && n >= 1 && n <= spots.length) choose(here.first + n - 1);
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") choose(here.first + ((local + 1) % spots.length));
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") choose(here.first + ((local + spots.length - 1) % spots.length));
    else if (e.key === "k" || e.key === "K") showCards();
    else if (e.key === "i" || e.key === "I") showSettings();
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      start();
    }
  };
  window.addEventListener("keydown", onKey);
  render();
  // Just solved the last case? Then the well-done box pops up by itself (once).
  const last = SEASON1_CASES - 1;
  if (!celebrated && district === 0 && session.caseIndex === last && session.state.has("caught") && allSolved(loadSave())) {
    celebrated = true;
    showDone();
  }
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
