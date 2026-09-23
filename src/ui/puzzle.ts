import type {
  ChoicePuzzle,
  ClockPuzzle,
  CodePuzzle,
  MatchPuzzle,
  OrderPuzzle,
  Puzzle,
  PuzzleOption,
  RevealPuzzle,
} from "../cases/types";
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
  if (puzzle.type === "choice" && puzzle.mirror) text.classList.add("mirror");
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
    case "match":
      keyHandler = match(puzzle, ui);
      break;
    case "clock":
      keyHandler = clocks(puzzle, ui);
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

/** An answer to click on: a picture (if any) and the label. */
function optionButton(o: PuzzleOption): HTMLButtonElement {
  const b = document.createElement("button");
  b.className = "option";
  b.lang = "sv";
  b.innerHTML = `${o.sprite ? `<img src="${spriteUrl(o.sprite)}" alt="">` : ""}<span></span>`;
  b.querySelector("span:last-child")!.textContent = o.label;
  return b;
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
      ui.say(p.wrong ?? "Nej, det stämmer inte. Räkna en gång till!");
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
      const img = o?.sprite ? `<img src="${spriteUrl(o.sprite)}" alt="">` : "";
      s.innerHTML = o ? `${img}<span>${i + 1}. ${o.label}</span>` : `<span>${i + 1}.</span>`;
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
          ui.say(p.wrong ?? "Låset rör sig inte. Läs lappen igen och försök en gång till!");
          picked.length = 0;
          render();
        }
      }, 350);
    }
  };

  const shown = shuffleOptions(p.options);
  shown.forEach((o) => {
    const b = optionButton(o);
    b.addEventListener("click", () => pick(o));
    options.appendChild(b);
  });
  render();
  ui.body.append(slots, options);

  return (e) => {
    if (e.key === "Backspace") {
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
    else ui.say(p.wrong ?? `${o.label}? Nej… tänk en gång till!`);
  };
  for (const o of shuffleOptions(p.options)) {
    const b = optionButton(o);
    b.addEventListener("click", () => pick(o));
    options.appendChild(b);
  }
  ui.body.append(options);
  return () => {};
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
    for (const o of shuffleOptions(q.options)) {
      const b = optionButton(o);
      b.addEventListener("click", () => pick(o));
      options.appendChild(b);
    }
    ui.body.append(options);
    keys = () => {};
  };

  const showEvidence = (culprit: PuzzleOption) => {
    const q = p.questions[step];
    const need = q.proof.length;
    playClick();
    ui.say("", true);
    ui.body.innerHTML = "";
    const intro = document.createElement("p");
    intro.className = "evidence-intro";
    intro.textContent = `${culprit.label}! Markera de ${need} ledtrådar som visar det.`;
    const grid = document.createElement("div");
    grid.className = "evidence";
    const chosen = new Set<string>();
    const clueIds = state.foundClues();
    const cards = new Map<string, HTMLButtonElement>();
    const submit = button("", "ok");

    const refresh = () => {
      cards.forEach((card, id) => card.classList.toggle("chosen", chosen.has(id)));
      submit.textContent = `Visa bevisen! (${chosen.size} av ${need})`;
      submit.disabled = chosen.size !== need;
    };
    const toggle = (id: string) => {
      playClick();
      if (chosen.has(id)) chosen.delete(id);
      else if (chosen.size < need) chosen.add(id);
      refresh();
    };
    clueIds.forEach((id) => {
      const clue = state.data.clues[id];
      const card = document.createElement("button");
      card.className = "evidence-card";
      card.title = clue.text;
      card.innerHTML = `<img src="${spriteUrl(clue.sprite)}" alt=""><b></b>`;
      card.querySelector("b")!.textContent = clue.name;
      card.addEventListener("click", () => toggle(id));
      cards.set(id, card);
      grid.appendChild(card);
    });
    submit.addEventListener("click", () => {
      const picked = [...chosen];
      if (!checkEvidence(q, picked)) {
        // Name the clue Ester talks about, so it's clear which one she means.
        const wrong = picked.filter((id) => !q.proof.includes(id));
        // …unless her explanation already says it.
        const text = explainEvidence(q, picked);
        const name = wrong[0] ? state.data.clues[wrong[0]].name : "";
        const about = name && !text.toLowerCase().includes(name.toLowerCase()) ? `${name}: ` : "";
        ui.say(`Ester: "${about}${text}"`);
        // The ones that don't show it are unmarked (with a short red flash) – the good ones stay.
        for (const id of wrong) {
          chosen.delete(id);
          const card = cards.get(id)!;
          card.classList.add("rejected");
          window.setTimeout(() => card.classList.remove("rejected"), 1200);
        }
        refresh();
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
    refresh();
    ui.body.append(intro, grid, submit);

    keys = (e) => {
      if (e.key === "Enter" && !submit.disabled) submit.click();
    };
  };

  showWho();
  return (e) => keys(e);
}

// ---------- Match the pairs ----------

function match(p: MatchPuzzle, ui: PuzzleUi): (e: KeyboardEvent) => void {
  const grid = document.createElement("div");
  grid.className = "match";
  const left = document.createElement("div");
  const right = document.createElement("div");
  grid.append(left, right);
  let chosen: number | null = null;
  let done = 0;

  const leftItems = shuffleOptions(p.pairs.map((pair, i) => ({ i, label: pair[0] })));
  const rightItems = shuffleOptions(p.pairs.map((pair, i) => ({ i, label: pair[1] })));
  const leftButtons = new Map<number, HTMLButtonElement>();

  for (const item of leftItems) {
    const b = button(item.label, "match-item");
    b.addEventListener("click", () => {
      if (b.classList.contains("matched")) return;
      playClick();
      leftButtons.forEach((other) => other.classList.remove("chosen"));
      b.classList.add("chosen");
      chosen = item.i;
    });
    leftButtons.set(item.i, b);
    left.appendChild(b);
  }
  for (const item of rightItems) {
    const b = document.createElement("button");
    b.className = "match-item";
    if (p.rightSprites) b.innerHTML = `<img src="${spriteUrl(item.label)}" alt="">`;
    else b.textContent = item.label;
    b.addEventListener("click", () => {
      if (b.classList.contains("matched")) return;
      if (chosen === null) {
        ui.say("Välj något i vänstra kolumnen först!");
        return;
      }
      if (chosen === item.i) {
        playClick();
        b.classList.add("matched");
        leftButtons.get(item.i)!.classList.remove("chosen");
        leftButtons.get(item.i)!.classList.add("matched");
        chosen = null;
        done++;
        if (done === p.pairs.length) ui.solved();
      } else {
        ui.say("De där två hör inte ihop. Försök igen!");
      }
    });
    right.appendChild(b);
  }
  ui.body.append(grid);
  return () => {};
}

// ---------- Which clock shows the time? ----------

function drawClock(hour: number, minute: number): HTMLCanvasElement {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  ctx.fillStyle = "#1a1024";
  ctx.beginPath();
  ctx.arc(c, c, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4ecd8";
  ctx.beginPath();
  ctx.arc(c, c, 27, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1024";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r = i % 3 === 0 ? 3 : 2;
    ctx.fillRect(Math.round(c + Math.sin(a) * 22 - r / 2), Math.round(c - Math.cos(a) * 22 - r / 2), r, r);
  }
  const hand = (angle: number, length: number, width: number, colour: string) => {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.sin(angle) * length, c - Math.cos(angle) * length);
    ctx.stroke();
  };
  hand((((hour % 12) + minute / 60) / 12) * Math.PI * 2, 13, 4, "#1a1024");
  hand((minute / 60) * Math.PI * 2, 21, 2.5, "#c0182c");
  ctx.fillStyle = "#1a1024";
  ctx.beginPath();
  ctx.arc(c, c, 3, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

function clocks(p: ClockPuzzle, ui: PuzzleUi): (e: KeyboardEvent) => void {
  const options = document.createElement("div");
  options.className = "options";
  const times = p.times ?? [];
  const pick = (id: string) => {
    if (id === p.answer) ui.solved();
    else ui.say("Titta på visarna igen! Den korta visar timmen, den långa minuterna.");
  };
  for (const t of times) {
    const b = document.createElement("button");
    b.className = "option";
    b.appendChild(drawClock(t.hour, t.minute));
    b.addEventListener("click", () => pick(t.id));
    options.appendChild(b);
  }
  ui.body.append(options);
  return () => {};
}
