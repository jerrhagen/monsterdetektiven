import * as Phaser from "phaser";
import "@fontsource/creepster";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/700.css";
import "./ui/ui.css";
import { GAME_HEIGHT, GAME_WIDTH } from "./engine/config";
import { RoomScene } from "./engine/scenes/RoomScene";
import { TitleScene } from "./engine/scenes/TitleScene";
import { attachUiLayer } from "./ui/layer";

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
  scene: [TitleScene, RoomScene],
});

attachUiLayer(game);
