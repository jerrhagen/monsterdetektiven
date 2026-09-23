/**
 * Playing on a phone or tablet: hold a finger anywhere on the game and Nora walks toward it,
 * and a small action button on the right does what the space bar does. The map, music and book
 * buttons move to the right side too. None of this shows on a computer – the page gets the class
 * `touch` only on a touch screen (or after the first touch), and all mobile styles hang on that class.
 */

let actionQueued = false;
let controls: HTMLDivElement | null = null;
let actionButton: HTMLButtonElement | null = null;

/** Where the steering finger is on the screen (client pixels), or null. */
let finger: { x: number; y: number } | null = null;
let fingerId: number | null = null;
let steerArea: HTMLElement | null = null;
let steerHandlers: [string, (e: PointerEvent) => void][] = [];

export function isTouch(): boolean {
  return document.documentElement.classList.contains("touch");
}

/** Call once at start: turns on touch mode on touch screens. */
export function initTouch(): void {
  const on = () => document.documentElement.classList.add("touch");
  if (window.matchMedia("(pointer: coarse)").matches) on();
  // A laptop with a touch screen: switch when someone actually touches it.
  window.addEventListener("touchstart", on, { once: true, passive: true });
}

/** The action button was pressed since last asked (it works like the space bar). */
export function takeAction(): boolean {
  const pressed = actionQueued;
  actionQueued = false;
  return pressed;
}

/** The steering finger, if one is held down. */
export function fingerPosition(): { x: number; y: number } | null {
  return finger;
}

/** Full screen and landscape where the phone allows it (Android; iPhone ignores it). */
export function enterFullscreen(): void {
  if (!isTouch() || document.fullscreenElement) return;
  const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
  document.documentElement
    .requestFullscreen?.()
    .then(() => orientation.lock?.("landscape"))
    .catch(() => {});
}

export type ActionIcon = "jump" | "talk" | "look" | "next";
const ICONS: Record<ActionIcon, string> = { jump: "⤒", talk: "💬", look: "🔍", next: "▶" };

/** Shows what the action button will do: jump, talk, look, or go on in a dialog. */
export function setActionIcon(icon: ActionIcon): void {
  if (actionButton && actionButton.dataset.icon !== icon) {
    actionButton.dataset.icon = icon;
    actionButton.textContent = ICONS[icon];
  }
}

export function setTouchControlsVisible(visible: boolean): void {
  controls?.classList.toggle("hidden", !visible);
  if (!visible) releaseFinger();
}

function releaseFinger(): void {
  finger = null;
  fingerId = null;
}

/**
 * Steering listens on the whole game area (also the dark strips beside it), but only to
 * touches that land on the game itself – not on buttons, dialogs or menus on top of it.
 */
function startSteering(): void {
  const game = document.getElementById("game")!;
  const ui = document.getElementById("ui");
  const onGame = (e: PointerEvent) => e.target === game || e.target === ui || e.target instanceof HTMLCanvasElement;
  steerArea = game;
  steerHandlers = [
    [
      "pointerdown",
      (e) => {
        if (fingerId !== null || !onGame(e) || controls?.classList.contains("hidden")) return;
        fingerId = e.pointerId;
        finger = { x: e.clientX, y: e.clientY };
      },
    ],
    [
      "pointermove",
      (e) => {
        if (e.pointerId === fingerId) finger = { x: e.clientX, y: e.clientY };
      },
    ],
    [
      "pointerup",
      (e) => {
        if (e.pointerId === fingerId) releaseFinger();
      },
    ],
    [
      "pointercancel",
      (e) => {
        if (e.pointerId === fingerId) releaseFinger();
      },
    ],
  ];
  for (const [type, handler] of steerHandlers) game.addEventListener(type, handler as EventListener);
}

function stopSteering(): void {
  for (const [type, handler] of steerHandlers) steerArea?.removeEventListener(type, handler as EventListener);
  steerHandlers = [];
  steerArea = null;
  releaseFinger();
}

/** Adds the steering and the action button (in a room, on touch screens). */
export function showTouchControls(): void {
  if (!isTouch() || controls) return;
  controls = document.createElement("div");
  controls.className = "touch-controls";
  controls.innerHTML = `<button class="action" data-icon="jump">${ICONS.jump}</button>`;
  document.body.appendChild(controls);

  actionButton = controls.querySelector<HTMLButtonElement>(".action")!;
  actionButton.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    actionQueued = true;
  });
  startSteering();
}

export function hideTouchControls(): void {
  stopSteering();
  controls?.remove();
  controls = null;
  actionButton = null;
  actionQueued = false;
}
