import * as Phaser from "phaser";
import "@fontsource/creepster";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/700.css";
import "./ui/ui.css";

// Load the spooky title font right away, so the title doesn't flash in another font.
void document.fonts.load("34px Creepster");
import { GAME_HEIGHT, GAME_WIDTH } from "./engine/config";
import { MapScene } from "./engine/scenes/MapScene";
import { RoomScene } from "./engine/scenes/RoomScene";
import { TitleScene } from "./engine/scenes/TitleScene";
import { session } from "./engine/session";
import { attachUiLayer } from "./ui/layer";
import { initTouch } from "./ui/touch";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  backgroundColor: "#07040f",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [TitleScene, MapScene, RoomScene],
});

attachUiLayer(game);
initTouch();

// Lets Claude inspect and test the game from the browser console while developing.
if (import.meta.env.DEV) Object.assign(window, { game, session });
