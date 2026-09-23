/**
 * Playing on a phone or tablet: a joystick on the left and one action button on the right.
 * None of this shows on a computer – the page gets the class `touch` only on a touch screen
 * (or after the first touch), and all mobile styles hang on that class.
 */

/** What the fingers ask for right now. RoomScene adds it to the keyboard. */
export const touchInput = { dx: 0, dy: 0 };

let actionQueued = false;
let controls: HTMLDivElement | null = null;
let actionButton: HTMLButtonElement | null = null;

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
  if (!visible) resetStick();
}

let knob: HTMLDivElement | null = null;

function resetStick(): void {
  touchInput.dx = 0;
  touchInput.dy = 0;
  if (knob) knob.style.transform = "";
}

/** Adds the joystick and the action button (in a room, on touch screens). */
export function showTouchControls(): void {
  if (!isTouch() || controls) return;
  controls = document.createElement("div");
  controls.className = "touch-controls";
  controls.innerHTML = `
    <div class="stick"><div class="stick-knob"></div></div>
    <button class="action" data-icon="jump">${ICONS.jump}</button>`;
  document.body.appendChild(controls);

  const stick = controls.querySelector<HTMLDivElement>(".stick")!;
  knob = controls.querySelector<HTMLDivElement>(".stick-knob")!;
  let pointer: number | null = null;
  const move = (e: PointerEvent) => {
    const r = stick.getBoundingClientRect();
    const radius = r.width / 2;
    let x = (e.clientX - (r.left + radius)) / radius;
    let y = (e.clientY - (r.top + radius)) / radius;
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    knob!.style.transform = `translate(${x * radius * 0.55}px, ${y * radius * 0.55}px)`;
    // Eight directions, with a small dead zone in the middle.
    const dead = 0.35;
    touchInput.dx = x > dead ? 1 : x < -dead ? -1 : 0;
    touchInput.dy = y > dead ? 1 : y < -dead ? -1 : 0;
  };
  stick.addEventListener("pointerdown", (e) => {
    pointer = e.pointerId;
    // Keep following the finger even if it slides off the stick.
    try {
      stick.setPointerCapture(e.pointerId);
    } catch {
      // Not a real pointer (e.g. in a test) – fine without capture.
    }
    move(e);
  });
  stick.addEventListener("pointermove", (e) => {
    if (e.pointerId === pointer) move(e);
  });
  const release = (e: PointerEvent) => {
    if (e.pointerId !== pointer) return;
    pointer = null;
    resetStick();
  };
  stick.addEventListener("pointerup", release);
  stick.addEventListener("pointercancel", release);

  actionButton = controls.querySelector<HTMLButtonElement>(".action")!;
  actionButton.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    actionQueued = true;
  });
}

export function hideTouchControls(): void {
  controls?.remove();
  controls = null;
  actionButton = null;
  knob = null;
  actionQueued = false;
  resetStick();
}
