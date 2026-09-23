import { uiRoot } from "./layer";

let titleEl: HTMLDivElement | null = null;

export function showTitle(): void {
  if (titleEl) return;
  titleEl = document.createElement("div");
  titleEl.className = "title";
  titleEl.innerHTML = `
    <h1>Monsterdetektiven</h1>
    <p class="subtitle">Mysterier i Mystiska staden</p>
    <p class="soon">Kommer snart: Fall 1 – Leksaksaffären</p>
  `;
  uiRoot.appendChild(titleEl);
}

export function hideTitle(): void {
  titleEl?.remove();
  titleEl = null;
}
