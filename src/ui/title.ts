import { uiRoot } from "./layer";

let titleEl: HTMLDivElement | null = null;

/** `progress` is a short line about what's been solved so far (or empty). */
export function showTitle(progress = ""): void {
  if (titleEl) return;
  titleEl = document.createElement("div");
  titleEl.className = "title";
  titleEl.innerHTML = `
    <h1>Monsterdetektiven</h1>
    <p class="subtitle">Mysterier i Mystiska staden</p>
    <p class="soon">Tryck på mellanslag för att börja!</p>
    <p class="progress"></p>
  `;
  titleEl.querySelector(".progress")!.textContent = progress;
  uiRoot.appendChild(titleEl);
}

export function hideTitle(): void {
  titleEl?.remove();
  titleEl = null;
}
