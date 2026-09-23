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
        "#HHHH..HHHH....rKK.#",
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
              when: "solved",
              talk: ["Du löste det, Nora!", "Men… var är den nu?"],
            },
            {
              when: "storeroom-key",
              talk: ["Du fick upp kassan! Så klok du är.", "Lagret är bakom dörren till höger."],
            },
            {
              when: "heard-about-register",
              talk: ["Koden… vad var det nu?", "Titta på kvittot i kassaapparaten!"],
            },
            {
              when: STORE_CLUES,
              talk: [
                "Tre ledtrådar! Du är en riktig detektiv.",
                "Spåren leder mot lagret. Nyckeln ligger inlåst i kassaapparaten…",
                "…men jag har glömt koden! Kvittot sitter kvar i kassan.",
              ],
              gives: "heard-about-register",
            },
            {
              when: "talked-to-stina",
              talk: ["Har du hittat några ledtrådar?", "Titta noga på golvet och vid hyllorna."],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: YARD_CLUES,
          puzzleIntro: ["Nora! Där är du!", "Vet du vem som flyttar på leksakerna?"],
        },
        r: {
          name: "Kassaapparaten",
          sprite: "register",
          on: "K",
          talk: ["Kassaapparaten är låst med en sifferkod."],
          talkIf: [{ when: "storeroom-key", talk: ["Kassaapparaten är öppen och tom."] }],
          puzzle: "register",
          puzzleWhen: "heard-about-register",
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
        {
          at: "bottom",
          to: "yard",
          requires: "backdoor-open",
          puzzle: "shape-lock",
          lockedText: "Bakdörren har ett konstigt lås med former.",
        },
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
            "Jag såg något… men jag berättar bara om du löser min gåta!",
          ],
          talkIf: [
            {
              when: "riddle-solved",
              talk: [
                "Rätt! Hihihi…",
                "Jag såg en grön ärm krypa in i affären…",
                "…helt själv. Och den höll i något som LYSTE.",
              ],
              clue: "viskan",
            },
          ],
          puzzle: "riddle",
        },
      },
      clues: { "1": "drag" },
      doors: [{ at: "top", to: "storeroom" }],
    },
  },

  puzzles: {
    register: {
      type: "code",
      title: "Kassaapparaten",
      text: ["Kvittot i kassan:", "1 boll ........ 7 kr", "1 bil .......... 8 kr", "Koden är vad allt kostade tillsammans."],
      answer: "15",
      gives: "storeroom-key",
    },
    "shape-lock": {
      type: "order",
      title: "Formlåset",
      text: [
        "På låset sitter en lapp:",
        "Först den som rullar åt alla håll.",
        "Sedan den med sex fyrkantiga sidor.",
        "Sist den som ser ut som en burk.",
      ],
      options: [
        { id: "cone", label: "Kon", sprite: "shapeCone" },
        { id: "cylinder", label: "Cylinder", sprite: "shapeCylinder" },
        { id: "sphere", label: "Klot", sprite: "shapeSphere" },
        { id: "cube", label: "Kub", sprite: "shapeCube" },
      ],
      answer: ["sphere", "cube", "cylinder"],
      gives: "backdoor-open",
    },
    riddle: {
      type: "choice",
      title: "Viskans gåta",
      text: ["Vad blir blötare", "ju mer det torkar?"],
      options: [
        { id: "umbrella", label: "Paraply", sprite: "umbrella" },
        { id: "sun", label: "Solen", sprite: "sun" },
        { id: "towel", label: "Handduk", sprite: "towel" },
        { id: "icecream", label: "Glass", sprite: "iceCream" },
      ],
      answer: "towel",
      gives: "riddle-solved",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Vem flyttar på leksakerna?"],
      options: [
        { id: "fladder", label: "Fladder", sprite: "fladder" },
        { id: "viskan", label: "Viskan", sprite: "viskanBin" },
        { id: "stina", label: "Stina Snurr", sprite: "stina" },
        { id: "arm", label: "Grymlans arm", sprite: "arm" },
      ],
      answer: "arm",
      evidence: ["handprints", "thread", "teddy", "blood", "drag", "poster", "viskan"],
      gives: "solved",
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
    viskan: {
      name: "Viskans vittnesmål",
      sprite: "viskanBin",
      text: "Viskan såg en grön ärm krypa in i affären. Den höll i något som lyste!",
    },
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
        "Stina vet var nyckeln är. Prata med henne!",
        "Kassaapparaten! Räkna ihop det som står på kvittot. 7 + 8 = ?",
      ],
    },
    {
      text: "Undersök lagret",
      doneWhen: STOREROOM_CLUES,
      hints: [
        "Leta efter något som glöder på golvet.",
        "Titta upp! Någon hänger i taket…",
        "Prata med Fladder. Hon hänger mitt i lagret.",
      ],
    },
    {
      text: "Ta dig ut ur lagret",
      doneWhen: "visited:yard",
      hints: [
        "Dörren längst ner har ett konstigt lås.",
        "Läs lappen på låset noga. Vilken form kan rulla åt alla håll?",
        "Ett klot rullar åt alla håll. En kub har sex fyrkantiga sidor. En cylinder ser ut som en burk.",
      ],
    },
    {
      text: "Vart leder spåren?",
      doneWhen: YARD_CLUES,
      hints: [
        "Titta i sandlådan och på anslagstavlan.",
        "Någon på bakgården viskar… prata med soptunnan!",
        "Viskans gåta: vad torkar du dig med när du har duschat?",
      ],
    },
    {
      text: "Vem flyttar på leksakerna?",
      doneWhen: "solved",
      hints: [
        "Berätta för Stina vad du har kommit fram till.",
        "Läs ledtrådarna i detektivboken (B). Vem har fem fingrar men inga fötter?",
        "Titta på lappen från anslagstavlan!",
      ],
    },
  ],
};
