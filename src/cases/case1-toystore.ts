import type { Case } from "./types";

// Case 1 – the architect's own idea: the toys have started moving in the daytime.
// SPOILER: the solution is described in DESIGN.md.

const STORE_CLUES = ["clue:handprints", "clue:thread", "clue:teddy"];
const STOREROOM_CLUES = ["clue:blood", "clue:fladder"];
const YARD_CLUES = ["clue:drag", "clue:poster", "clue:viskan"];

export const case1: Case = {
  id: "toystore",
  title: "Leksaksaffären",
  startRoom: "store",

  rooms: {
    store: {
      name: "Leksaksaffären",
      theme: "shop",
      layout: [
        "####################",
        "####################",
        "#HHHH..HHHH....KKK.#",
        "#...=........s.K...#",
        "#.b.=..a.......K...#",
        "#...=..............#",
        "#...=.....~j.......D",
        "#...=.....~.1......D",
        "#...=..............#",
        "#...=HH......HH2...#",
        "#...=HH...N..HH....#",
        "#########DD#########",
      ],
      things: {
        s: {
          name: "Stina Snurr",
          sprite: "stina",
          talk: [
            "Åh, Nora! Tack och lov att du kom!",
            "Leksakerna rör sig. Mitt på dagen!",
            "Nallen flyttar sig och bilarna kör själva…",
            "Kan du leta efter ledtrådar här i affären?",
          ],
          gives: "talked-to-stina",
          talkIf: [
            {
              when: "storeroom-key",
              talk: ["Har du varit i lagret än?", "Dörren är till höger."],
            },
            {
              when: STORE_CLUES,
              talk: [
                "Tre ledtrådar! Du är en riktig detektiv.",
                "Spåren leder mot lagret.",
                "Här är nyckeln till lagret. Var försiktig!",
              ],
              gives: "storeroom-key",
            },
            {
              when: "talked-to-stina",
              talk: ["Har du hittat några ledtrådar?", "Titta noga på golvet och vid hyllorna."],
            },
          ],
        },
        a: {
          name: "Skylt",
          sprite: "sign",
          talk: ["LEKSAKSAFFÄREN – Öppet 9 till 17.", "Rör inte leksakerna!", "(Tips: hoppa över saker med mellanslag!)"],
        },
        j: {
          name: "Slemburken",
          sprite: "slimeJar",
          talk: ["En burk med leksaksslem har vält.", "Någon har knuffat ner den från hyllan…", "…men ingen var här!"],
        },
        b: {
          name: "Nallen",
          sprite: "teddy",
          talk: [
            "…",
            "Psst! Du hoppade hit!",
            "Jag såg något kravla förbi på golvet.",
            "Det hade FEM ben! Och inget huvud!",
          ],
          clue: "teddy",
        },
      },
      clues: { "1": "handprints", "2": "thread" },
      // The toys move by themselves…
      movers: [
        { sprite: "toyCarRed", path: [[6, 8], [9, 8]], speed: 30, pause: 3000 },
        { sprite: "toyCarBlue", path: [[16, 5], [12, 5], [12, 8], [16, 8]], speed: 22, pause: 4000 },
      ],
      doors: [
        { at: "right", to: "storeroom", requires: "storeroom-key", lockedText: "Dörren till lagret är låst." },
        { at: "bottom", lockedText: "Vi kan inte gå än. Vi har ett mysterium att lösa!" },
      ],
    },

    storeroom: {
      name: "Lagret",
      theme: "storage",
      layout: [
        "####################",
        "####################",
        "#LL..LLL....LL..LLL#",
        "#L........f.....LLL#",
        "#...............L..#",
        "#..LL.....LL.......#",
        "D..LL.....LL.......#",
        "D..........1.......#",
        "#......LL..........#",
        "#......LL..........#",
        "#..............LL..#",
        "#############DD#####",
      ],
      things: {
        f: {
          name: "Fladder",
          sprite: "fladderSleep",
          talk: ["Zzz…", "Va? Leksaker? Det var inte jag…", "Jag sover ju på dagen… zzz…"],
          clue: "fladder",
        },
      },
      clues: { "1": "blood" },
      doors: [
        { at: "left", to: "store" },
        { at: "bottom", to: "yard" },
      ],
    },

    yard: {
      name: "Bakgården",
      theme: "yard",
      layout: [
        "#############DD#####",
        "#TT.......~........#",
        "#T.....SSSS~....p..#",
        "#......SSSS........#",
        "#......SS1S.....v..#",
        "#......SSSS........#",
        "#..T...............#",
        "#.............TT...#",
        "#.............TT...#",
        "#..................#",
        "#TT................#",
        "####################",
      ],
      things: {
        p: {
          name: "Anslagstavlan",
          sprite: "noticeboard",
          talk: ["Det sitter en lapp här:", "\"SAKNAS: Min arm!\"", "\"Grön tröjärm. Kan krypa själv.\"", "\"/ Grymlan\""],
          clue: "poster",
        },
        v: {
          name: "Soptunnan",
          sprite: "viskanBin",
          talk: [
            "Psssst… Nooooraaaa…",
            "Jag är Viskan. Jag bor här i tunnan.",
            "Jag såg en grön ärm krypa in i affären…",
            "…helt själv. Hihihi…",
          ],
          clue: "viskan",
        },
      },
      clues: { "1": "drag" },
      doors: [{ at: "top", to: "storeroom" }],
    },
  },

  clues: {
    handprints: { name: "Handavtryck", sprite: "handprints", text: "Små handavtryck i dammet. Men inga fotspår!" },
    thread: { name: "Grön tråd", sprite: "thread", text: "En grön ulltråd som fastnat i hyllan." },
    teddy: { name: "Nallens vittnesmål", sprite: "teddy", text: "Nallen såg något med fem ben kravla på golvet." },
    blood: { name: "Blodsdroppar", sprite: "bloodDrops", text: "Små droppar blod som leder mot bakdörren." },
    fladder: { name: "Fladder sover", sprite: "fladderSleep", text: "Fladder sover på dagen. Kan hon ha flyttat leksakerna?" },
    drag: { name: "Släpspår", sprite: "dragMarks", text: "Spår i sanden, som om något kravlat fram med händerna." },
    poster: { name: "Lappen", sprite: "noticeboard", text: "\"SAKNAS: Min arm! Grön tröjärm. Kan krypa själv. / Grymlan\"" },
    viskan: { name: "Viskans vittnesmål", sprite: "viskanBin", text: "Viskan såg en grön ärm krypa in i affären." },
  },

  items: {
    "storeroom-key": { name: "Lagernyckeln", sprite: "key" },
  },

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-stina",
      hints: [
        "Stina äger affären. Hon står nära kassan.",
        "Gå fram till Stina och tryck Ctrl.",
        "Stina är tanten med grått hår och glasögon, uppe till höger.",
      ],
    },
    {
      text: "Leta efter ledtrådar i affären",
      doneWhen: STORE_CLUES,
      hints: [
        "Ledtrådar glöder lite. Titta noga på golvet!",
        "Leta vid hyllorna. Och prata med alla i affären, även leksakerna.",
        "Nallen bakom klossarna vet något. Hoppa över klossarna med mellanslag!",
      ],
    },
    {
      text: "Ta dig in i lagret",
      doneWhen: "visited:storeroom",
      hints: [
        "Lagret är bakom dörren till höger. Men den är låst…",
        "Stina vill nog höra vad du har hittat.",
        "Gå tillbaka till Stina och prata med henne. Hon har nyckeln!",
      ],
    },
    {
      text: "Undersök lagret",
      doneWhen: STOREROOM_CLUES,
      hints: [
        "Lagret är bakom dörren till höger i affären.",
        "Leta efter något som glöder på golvet i lagret.",
        "Någon hänger i taket i lagret… prata med henne!",
      ],
    },
    {
      text: "Vart leder spåren?",
      doneWhen: YARD_CLUES,
      hints: [
        "Spåren i lagret leder mot en dörr…",
        "Gå ut genom dörren längst ner i lagret. Titta i sandlådan och på anslagstavlan.",
        "Prata med soptunnan. Ja, verkligen!",
      ],
    },
    {
      text: "Vem flyttar på leksakerna?",
      doneWhen: "solved",
      hints: ["Läs alla ledtrådar i detektivboken. Tryck B!", "Snart kan vi avslöja vem det är…"],
    },
  ],
};
