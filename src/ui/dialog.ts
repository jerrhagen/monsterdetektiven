import { uiRoot } from "./layer";

interface OpenDialog {
  el: HTMLDivElement;
  textEl: HTMLParagraphElement;
  lines: string[];
  index: number;
  shown: number; // characters typed so far
  timer: number;
  onClose?: () => void;
}

const TYPE_SPEED_MS = 28;
let current: OpenDialog | null = null;

export function isDialogOpen(): boolean {
  return current !== null;
}

/** Shows a speech bubble at the bottom of the screen, one line at a time. */
export function openDialog(name: string, lines: string[], onClose?: () => void): void {
  closeDialog();
  const el = document.createElement("div");
  el.className = "dialog";
  el.innerHTML = `<div class="dialog-name"></div><p class="dialog-text"></p><div class="dialog-next">▼</div>`;
  el.querySelector(".dialog-name")!.textContent = name;
  el.addEventListener("click", advanceDialog);
  uiRoot.appendChild(el);
  current = { el, textEl: el.querySelector(".dialog-text")!, lines, index: 0, shown: 0, timer: 0, onClose };
  startLine();
}

/** Ctrl/click: finish typing the current line, or go to the next one. */
export function advanceDialog(): void {
  if (!current) return;
  const line = current.lines[current.index];
  if (current.shown < line.length) {
    current.shown = line.length;
    render();
    return;
  }
  current.index++;
  if (current.index >= current.lines.length) {
    closeDialog();
  } else {
    startLine();
  }
}

/** Leaving the room (e.g. to the town map): remove the dialog without running what it would do when read. */
export function dismissDialog(): void {
  if (!current) return;
  window.clearInterval(current.timer);
  current.el.remove();
  current = null;
}

function closeDialog(): void {
  if (!current) return;
  const { el, timer, onClose } = current;
  window.clearInterval(timer);
  el.remove();
  current = null;
  onClose?.();
}

function startLine(): void {
  if (!current) return;
  window.clearInterval(current.timer);
  current.shown = 0;
  render();
  current.timer = window.setInterval(() => {
    if (!current) return;
    current.shown++;
    render();
    if (current.shown >= current.lines[current.index].length) window.clearInterval(current.timer);
  }, TYPE_SPEED_MS);
}

function render(): void {
  if (!current) return;
  const line = current.lines[current.index];
  current.textEl.textContent = line.slice(0, current.shown);
  current.el.classList.toggle("done", current.shown >= line.length);
}
