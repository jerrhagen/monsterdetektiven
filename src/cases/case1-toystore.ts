import type { Case } from "./types";

/** Case 1 – the architect's own idea: the toys have started moving in the daytime. */
export const case1: Case = {
  id: "toystore",
  title: "Leksaksaffären",
  startRoom: "store",
  rooms: {
    store: {
      name: "Leksaksaffären",
      layout: [
        "####################",
        "####################",
        "#HHHH..HHHH....KKK.#",
        "#...=..........K...#",
        "#.b.=..a.......K...#",
        "#...=..............#",
        "#...=.....~........D",
        "#...=.....~........D",
        "#...=..............#",
        "#...=HH......HH....#",
        "#...=HH...N..HH....#",
        "#########DD#########",
      ],
      things: {
        a: {
          name: "Skylt",
          sprite: "sign",
          talk: [
            "LEKSAKSAFFÄREN – Öppet 9 till 17.",
            "Rör inte leksakerna!",
            "…de rör sig själva.",
            "(Tips: hoppa över saker med mellanslag!)",
          ],
        },
        b: {
          name: "Nallen",
          sprite: "teddy",
          talk: ["…", "Psst! Du hoppade hit!", "Jag såg något röra sig på hyllan i natt…"],
        },
      },
      doors: {
        lockedText: "Dörren är låst. Vi har ett mysterium att lösa först!",
      },
    },
  },
};
