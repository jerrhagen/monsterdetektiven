import type { Case } from "../cases/types";
import { type Result, formatTime } from "../engine/save";
import { confetti } from "./confetti";
import { uiRoot } from "./layer";
import { playSuccess } from "./sound";
import { spriteUrl } from "./spriteImage";

let open: HTMLDivElement | null = null;

export function isCaseScreenOpen(): boolean {
  return open !== null;
}

function close(): void {
  open?.remove();
  open = null;
}

function escape(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** The title card before a case starts: number, name and the hook. Space, Enter or a click starts. */
export function showCaseIntro(c: Case, onStart: () => void): void {
  close();
  const el = document.createElement("div");
  el.className = "case-screen case-intro";
  el.innerHTML = `
    <div class="case-number">Fall ${c.number}</div>
    <h1>${escape(c.title)}</h1>
    <div class="case-text">${c.intro.map((l) => `<p>${escape(l)}</p>`).join("")}</div>
    <button class="start">Börja! <kbd>mellanslag</kbd></button>`;
  const start = () => {
    window.removeEventListener("keydown", onKey);
    close();
    onStart();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      start();
    }
  };
  el.querySelector(".start")!.addEventListener("click", start);
  // Wait a moment so the key that opened the case doesn't skip the card.
  window.setTimeout(() => window.addEventListener("keydown", onKey), 400);
  uiRoot.appendChild(el);
  open = el;
}

/** "Leave the case?" – going to the map means starting the case over next time. */
export function showLeaveCase(onLeave: () => void): void {
  close();
  const el = document.createElement("div");
  el.className = "case-screen leave-case";
  el.innerHTML = `
    <div class="title-dialog-box">
      <p>Vill du gå till stadskartan?</p>
      <p class="warning">Fallet börjar om från början nästa gång.</p>
      <div class="buttons"><button class="cancel">Nej, spela vidare</button><button class="danger">Ja, till kartan</button></div>
    </div>`;
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter") stay();
  };
  const stay = () => {
    window.removeEventListener("keydown", onKey);
    close();
  };
  el.querySelector(".cancel")!.addEventListener("click", stay);
  el.querySelector(".danger")!.addEventListener("click", () => {
    stay();
    onLeave();
  });
  window.addEventListener("keydown", onKey);
  uiRoot.appendChild(el);
  open = el;
}

/** "Fallet är löst!" – stars, time, new monster cards and a fact. */
export function showCaseResult(
  c: Case,
  result: Result,
  details: { hintsUsed: number },
  actions: { again: () => void; map: () => void },
): void {
  close();
  const star = (on: boolean) => `<span class="star ${on ? "on" : ""}">★</span>`;
  const hintStar = details.hintsUsed <= 2;
  const eggStar = result.egg;
  const cards = c.cards
    .map((card) => {
      const isNew = result.newCards.includes(card.name);
      return `<div class="monster-card ${isNew ? "new" : ""}">
        ${isNew ? '<span class="badge">NYTT!</span>' : ""}
        <img src="${spriteUrl(card.sprite)}" alt="">
        <b>${escape(card.name)}</b>
        <p>${escape(card.text)}</p>
      </div>`;
    })
    .join("");

  const el = document.createElement("div");
  el.className = "case-screen case-result";
  el.innerHTML = `
    <div class="result-page">
      <h1>Fallet är löst!</h1>
      <div class="stars">${star(true)}${star(hintStar)}${star(eggStar)}</div>
      <ul class="star-reasons">
        <li class="on">★ Du löste fallet</li>
        <li class="${hintStar ? "on" : ""}">★ Högst 2 tips från Ester <small>(du tog ${details.hintsUsed})</small></li>
        <li class="${eggStar ? "on" : ""}">★ ${eggStar ? "Du hittade det hemliga monsterägget!" : "Det finns ett hemligt monsterägg någonstans…"}</li>
      </ul>
      <p class="time">⏱️ ${formatTime(result.seconds)}${result.newRecord ? " – <b>nytt rekord!</b>" : ""}</p>
      <h2>Monsterkort</h2>
      <div class="cards">${cards}</div>
      <div class="fact"><b>Visste du att…?</b> <span>${escape(c.fact)}</span></div>
      <div class="buttons">
        <button class="again">Spela igen</button>
        <button class="to-map">Till stadskartan</button>
      </div>
    </div>`;
  el.querySelector(".again")!.addEventListener("click", () => {
    close();
    actions.again();
  });
  el.querySelector(".to-map")!.addEventListener("click", () => {
    close();
    actions.map();
  });
  uiRoot.appendChild(el);
  open = el;
  playSuccess();
  confetti(140);
}
