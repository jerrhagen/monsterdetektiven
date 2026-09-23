import type { ChoicePuzzle, CodePuzzle, OrderPuzzle, Puzzle, PuzzleOption, RevealPuzzle } from "../cases/types";
import type { CaseState } from "../engine/caseState";
import { checkCode, checkEvidence, checkOrder, explainEvidence } from "../engine/puzzleCheck";
import { shuffleOptions } from "../engine/puzzleRoll";
import { confetti } from "./confetti";
import { uiRoot } from "./layer";
import { playClick, playSuccess, playWrong } from "./sound";
import { spriteUrl } from "./spriteImage";

interface Open {
  el: HTMLDivElement;
  onKey: (e: KeyboardEvent) => void;
}

let current: Open | null = null;

export function isPuzzleOpen(): boolean {
  return current !== null;
}

export function closePuzzle(): void {
  if (!current) return;
  window.removeEventListener("keydown", current.onKey);
  current.el.remove();
  current = null;
}

/**
 * Shows a puzzle on top of the game. Wrong answers just say "try again";
 * the right answer gives confetti and calls `onSolved`.
 */
export function openPuzzle(puzzle: Puzzle, state: CaseState, onSolved: () => void): void {
  closePuzzle();
  const el = document.createElement("div");
  el.className = `puzzle puzzle-${puzzle.type}`;
  el.innerHTML = `
    <div class="card">
      <button class="close" title="Stäng (Esc)">✕</button>
      <h2></h2>
      <div class="puzzle-text"></div>
      <div class="puzzle-body"></div>
      <div class="puzzle-feedback" aria-live="polite"></div>
    </div>`;
  el.querySelector("h2")!.textContent = `🧩 ${puzzle.title}`;
  const text = el.querySelector(".puzzle-text")!;
  for (const line of puzzle.text) {
    const p = document.createElement("p");
    p.textContent = line;
    text.appendChild(p);
  }
  const body = el.querySelector<HTMLDivElement>(".puzzle-body")!;
  const feedback = el.querySelector<HTMLDivElement>(".puzzle-feedback")!;
  const card = el.querySelector<HTMLDivElement>(".card")!;

  const ui: PuzzleUi = {
    body,
    say(message, good = false) {
      feedback.textContent = message;
      feedback.classList.toggle("good", good);
      if (!good) {
        playWrong();
        card.classList.remove("shake");
        void card.offsetWidth; // restart the animation
        card.classList.add("shake");
      }
    },
    solved() {
      playSuccess();
      confetti();
      feedback.textContent = "Rätt! 🎉";
      feedback.classList.add("good");
      body.classList.add("done");
      window.setTimeout(() => {
        closePuzzle();
        onSolved();
      }, 1300);
    },
  };

  let keyHandler: (e: KeyboardEvent) => void = () => {};
  switch (puzzle.type) {
    case "code":
      keyHandler = codeLock(puzzle, ui);
      break;
    case "order":
      keyHandler = orderLock(puzzle, ui);
      break;
    case "choice":
      keyHandler = choice(puzzle, ui);
      break;
    case "reveal":
      keyHandler = reveal(puzzle, state, ui);
      break;
  }

  const onKey = (e: KeyboardEvent) => {
    if (body.classList.contains("done")) return;
    if (e.key === "Escape") closePuzzle();
    else keyHandler(e);
  };
  el.querySelector(".close")!.addEventListener("click", closePuzzle);
  window.addEventListener("keydown", onKey);
  uiRoot.appendChild(el);
  current = { el, onKey };
}

interface PuzzleUi {
  body: HTMLDivElement;
  say(message: string, good?: boolean): void;
  solved(): void;
}

function button(label: string, className = ""): HTMLButtonElement {
  const b = document.createElement("button");
  b.className = className;
  b.textContent = label;
  return b;
}

function optionButton(o: PuzzleOption, index: number): HTMLButtonElement {
  const b = document.createElement("button");
  b.className = "option";
  b.innerHTML = `<span class="key">${index + 1}</span>${o.sprite ? `<img src="${spriteUrl(o.sprite)}" alt="">` : ""}<span></span>`;
  b.querySelector("span:last-child")!.textContent = o.label;
  return b;
}

/** Number keys 1–9 pick an option. */
function optionIndex(e: KeyboardEvent, count: number): number {
  const n = Number(e.key);
  return Number.isInteger(n) && n >= 1 && n <= count ? n - 1 : -1;
}

// ---------- Code lock ----------

function codeLock(p: CodePuzzle, ui: PuzzleUi): (e: KeyboardEvent) => void {
  let typed = "";
  const slots = document.createElement("div");
  slots.className = "code-slots";
  const boxes = [...p.answer].map(() => slots.appendChild(document.createElement("span")));
  const pad = document.createElement("div");
  pad.className = "keypad";

  const render = () => boxes.forEach((b, i) => (b.textContent = typed[i] ?? ""));
  const press = (key: string) => {
    playClick();
    if (key === "⌫") typed = typed.slice(0, -1);
    else if (key === "OK") return submit();
    else if (typed.length < p.answer.length) typed += key;
    render();
    if (typed.length === p.answer.length) window.setTimeout(submit, 250);
  };
  const submit = () => {
    if (typed.length === 0) return;
    if (checkCode(p, typed)) {
      ui.solved();
    } else {
      ui.say("Nej, det stämmer inte. Räkna en gång till!");
      typed = "";
      render();
    }
  };

  for (const key of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"]) {
    const b = button(key, key === "OK" ? "ok" : "");
    b.addEventListener("click", () => press(key));
    pad.appendChild(b);
  }
  ui.body.append(slots, pad);

  return (e) => {
    if (/^\d$/.test(e.key)) press(e.key);
    else if (e.key === "Backspace") press("⌫");
    else if (e.key === "Enter") press("OK");
  };
}

// ---------- Pick in the right order ----------

function orderLock(p: OrderPuzzle, ui: PuzzleUi): (e: KeyboardEvent) => void {
  const picked: string[] = [];
  const slots = document.createElement("div");
  slots.className = "order-slots";
  const slotEls = p.answer.map((_, i) => {
    const s = slots.appendChild(document.createElement("button"));
    s.className = "slot";
    s.title = "Ta bort";
    s.addEventListener("click", () => {
      picked.splice(i);
      render();
    });
    return s;
  });
  const options = document.createElement("div");
  options.className = "options";

  const render = () =>
    slotEls.forEach((s, i) => {
      const o = p.options.find((opt) => opt.id === picked[i]);
      s.innerHTML = o ? `<img src="${spriteUrl(o.sprite ?? "")}" alt=""><span>${i + 1}. ${o.label}</span>` : `<span>${i + 1}.</span>`;
      s.classList.toggle("filled", !!o);
    });
  const pick = (o: PuzzleOption) => {
    if (picked.length >= p.answer.length) return;
    playClick();
    picked.push(o.id);
    render();
    if (picked.length === p.answer.length) {
      window.setTimeout(() => {
        if (checkOrder(p, picked)) ui.solved();
        else {
          ui.say("Låset rör sig inte. Läs lappen igen och försök en gång till!");
          picked.length = 0;
          render();
        }
      }, 350);
    }
  };

  const shown = shuffleOptions(p.options);
  shown.forEach((o, i) => {
    const b = optionButton(o, i);
    b.addEventListener("click", () => pick(o));
    options.appendChild(b);
  });
  render();
  ui.body.append(slots, options);

  return (e) => {
    const i = optionIndex(e, shown.length);
    if (i >= 0) pick(shown[i]);
    else if (e.key === "Backspace") {
      picked.pop();
      render();
    }
  };
}

// ---------- Pick the right one ----------

function choice(p: ChoicePuzzle, ui: PuzzleUi): (e: KeyboardEvent) => void {
  const options = document.createElement("div");
  options.className = "options";
  const pick = (o: PuzzleOption) => {
    if (o.id === p.answer) ui.solved();
    else ui.say(`${o.label}? Nej… tänk en gång till!`);
  };
  const shown = shuffleOptions(p.options);
  shown.forEach((o, i) => {
    const b = optionButton(o, i);
    b.addEventListener("click", () => pick(o));
    options.appendChild(b);
  });
  ui.body.append(options);
  return (e) => {
    const i = optionIndex(e, shown.length);
    if (i >= 0) pick(shown[i]);
  };
}

// ---------- The reveal: who did it, and what proves it? ----------

function reveal(p: RevealPuzzle, state: CaseState, ui: PuzzleUi): (e: KeyboardEvent) => void {
  let keys: (e: KeyboardEvent) => void = () => {};
  let step = 0;
  const heading = document.createElement("p");
  heading.className = "evidence-intro";

  const showWho = () => {
    const q = p.questions[step];
    ui.body.innerHTML = "";
    heading.textContent = `${p.questions.length > 1 ? `Fråga ${step + 1} av ${p.questions.length}: ` : ""}${q.question}`;
    ui.body.append(heading);
    const options = document.createElement("div");
    options.className = "options";
    const pick = (o: PuzzleOption) => {
      if (o.id === q.answer) showEvidence(o);
      else ui.say(`Ester: "${q.whyNot?.[o.id] ?? `Hmm… var det verkligen ${o.label}? Titta i detektivboken!`}"`);
    };
    const shown = shuffleOptions(q.options);
    shown.forEach((o, i) => {
      const b = optionButton(o, i);
      b.addEventListener("click", () => pick(o));
      options.appendChild(b);
    });
    ui.body.append(options);
    keys = (e) => {
      const i = optionIndex(e, shown.length);
      if (i >= 0) pick(shown[i]);
    };
  };

  const showEvidence = (culprit: PuzzleOption) => {
    const q = p.questions[step];
    playClick();
    ui.say("", true);
    ui.body.innerHTML = "";
    const intro = document.createElement("p");
    intro.className = "evidence-intro";
    intro.textContent = `${culprit.label}! Visa ${q.proof.length === 2 ? "två" : q.proof.length} ledtrådar som bevisar det.`;
    const grid = document.createElement("div");
    grid.className = "evidence";
    const chosen = new Set<string>();
    const clueIds = state.foundClues();
    const submit = button("Visa bevisen!", "ok");
    submit.disabled = true;

    const toggle = (id: string, card: HTMLButtonElement) => {
      playClick();
      if (chosen.has(id)) chosen.delete(id);
      else if (chosen.size < q.proof.length) chosen.add(id);
      card.classList.toggle("chosen", chosen.has(id));
      submit.disabled = chosen.size !== q.proof.length;
    };
    clueIds.forEach((id, i) => {
      const clue = state.data.clues[id];
      const card = document.createElement("button");
      card.className = "evidence-card";
      card.innerHTML = `<span class="key">${i + 1}</span><img src="${spriteUrl(clue.sprite)}" alt=""><b></b>`;
      card.querySelector("b")!.textContent = clue.name;
      card.addEventListener("click", () => toggle(id, card));
      grid.appendChild(card);
    });
    submit.addEventListener("click", () => {
      if (!checkEvidence(q, [...chosen])) {
        ui.say(`Ester: "${explainEvidence(q, [...chosen])}"`);
        // Start over with nothing chosen.
        chosen.clear();
        grid.querySelectorAll(".chosen").forEach((c) => c.classList.remove("chosen"));
        submit.disabled = true;
      } else if (step < p.questions.length - 1) {
        // On to the next question.
        step++;
        playSuccess();
        showWho();
        ui.say("Rätt! Nästa fråga…", true);
      } else {
        ui.solved();
      }
    });
    ui.body.append(intro, grid, submit);

    keys = (e) => {
      const i = optionIndex(e, clueIds.length);
      if (i >= 0) toggle(clueIds[i], grid.children[i] as HTMLButtonElement);
      else if (e.key === "Enter" && !submit.disabled) submit.click();
    };
  };

  showWho();
  return (e) => keys(e);
}
