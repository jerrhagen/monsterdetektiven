import type * as Phaser from "phaser";
import { GAME_WIDTH } from "../engine/config";

/** HTML layer on top of the canvas: dialogs, puzzles, menus – crisp text at any size. */
export const uiRoot = document.getElementById("ui") as HTMLDivElement;

/**
 * Keeps the HTML layer exactly on top of the scaled canvas. CSS can use
 * `var(--px)` as "one game pixel", so UI scales together with the game.
 */
export function attachUiLayer(game: Phaser.Game): void {
  const sync = () => {
    const canvas = game.canvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const parent = uiRoot.parentElement!.getBoundingClientRect();
    uiRoot.style.left = `${rect.left - parent.left}px`;
    uiRoot.style.top = `${rect.top - parent.top}px`;
    uiRoot.style.width = `${rect.width}px`;
    uiRoot.style.height = `${rect.height}px`;
    uiRoot.style.setProperty("--px", `${rect.width / GAME_WIDTH}px`);
  };
  game.events.once("ready", sync);
  game.scale.on("resize", sync);
  window.addEventListener("resize", () => requestAnimationFrame(sync));
}
