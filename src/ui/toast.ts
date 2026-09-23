import { uiRoot } from "./layer";

/** A short message that pops up at the top of the screen and fades away. */
export function toast(html: string, ms = 2600, className = ""): void {
  const el = document.createElement("div");
  el.className = `toast ${className}`.trim();
  el.innerHTML = html;
  // Stack below any toasts already showing.
  el.style.setProperty("--slot", String(uiRoot.querySelectorAll(".toast").length));
  uiRoot.appendChild(el);
  window.setTimeout(() => el.classList.add("leaving"), ms);
  window.setTimeout(() => el.remove(), ms + 400);
}

/** The room's name on a small sign, shown every time Nora walks into a room. */
export function roomSign(name: string): void {
  uiRoot.querySelectorAll(".room-sign").forEach((el) => el.remove());
  const el = document.createElement("div");
  el.className = "room-sign";
  el.textContent = name;
  uiRoot.appendChild(el);
  window.setTimeout(() => el.classList.add("leaving"), 1800);
  window.setTimeout(() => el.remove(), 2400);
}
