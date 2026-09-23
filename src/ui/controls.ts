import { uiRoot } from "./layer";

let el: HTMLDivElement | null = null;

/** Small reminder of the keys, in the top-left corner. */
export function showControls(): void {
  if (el) return;
  el = document.createElement("div");
  el.className = "controls";
  el.innerHTML = `<span><kbd>←↑↓→</kbd> gå</span><span><kbd>mellanslag</kbd> hoppa</span><span><kbd>Ctrl</kbd> titta/prata</span>`;
  uiRoot.appendChild(el);
}

export function hideControls(): void {
  el?.remove();
  el = null;
}
