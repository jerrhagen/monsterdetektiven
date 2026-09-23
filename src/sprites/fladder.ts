import type { PixelSprite } from "./pixelSprite";

/** Fladder – the architect's favourite monster: black, pink bat wings, magenta spike. */
export const fladder: PixelSprite = {
  palette: {
    ".": null,
    k: "#14101c", // body
    w: "#e8e8f0", // eyes
    m: "#b0226e", // spike on the head
    p: "#ff8ade", // wing
    P: "#c93aa6", // wing bones
  },
  frameRate: 8,
  frames: [
    [
      "P......mm......P",
      "Pp.....mm.....pP",
      "Ppp...kkkk...ppP",
      ".Ppp.kkkkkk.ppP.",
      ".PpppkwkkwkpppP.",
      "..PppkkkkkkppP..",
      "...PpkkkkkkpP...",
      "....PkkkkkkP....",
      ".....kkkkkk.....",
      "......kkkk......",
      "......k..k......",
      "................",
    ],
    [
      "................",
      ".......mm.......",
      "......kkkk......",
      ".....kkkkkk.....",
      ".....kwkkwk.....",
      "PppppkkkkkkppppP",
      "PpppPkkkkkkPpppP",
      ".PpP.kkkkkk.PpP.",
      "..P...kkkk...P..",
      "......kkkk......",
      "......k..k......",
      "................",
    ],
  ],
};
