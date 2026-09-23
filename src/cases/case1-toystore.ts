import type { Case } from "./types";

// Case 1 – the architect's own idea: the toys have started moving in the daytime.
// SPOILER: the solution is described in DESIGN.md.

const STORE_CLUES = ["clue:handprints", "clue:thread", "clue:teddy", "clue:scales"];
const STOREROOM_CLUES = ["clue:blood", "clue:fladder", "clue:shadow"];
const YARD_CLUES = ["clue:drag", "clue:poster", "clue:viskan"];

export const case1: Case = {
  id: "toystore",
  number: 1,
  title: "Leksaksaffären",
  startRoom: "store",
  intro: [
    "Stina Snurr ringde till detektivbyrån.",
    "Hon lät jätterädd:",
    "\"Nora! Leksakerna i min affär rör sig – mitt på dagen!\"",
    "Nora och Ester skyndar dit…",
  ],

  rooms: {
    store: {
      name: "Leksaksaffären",
      theme: "shop",
      layout: [
        "####################",
        "####################",
        "#HHHH..HHHH....rKK.#",
        "#...=...3....s.K...#",
        "#.b.=..a.......K.y.#",
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
            "I morse satt nallen på hyllan. Nu sitter han bakom klossarna!",
            "Kan du leta efter ledtrådar här i affären?",
          ],
          gives: "talked-to-stina",
          clue: "teddyMoved",
          talkIf: [
            {
              when: "caught",
              talk: ["Tack, Nora! Nu är leksakerna lugna igen."],
            },
            {
              when: "solved",
              talk: [
                "En lös hand!? Men var är den nu?",
                "Titta – leksakerna skakar på en av hyllorna…",
                "Den gömmer sig! Fånga den, Nora!",
              ],
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
                "Så många ledtrådar! Du är en riktig detektiv.",
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
        y: {
          name: "Stinas stickkorg",
          sprite: "yarnBasket",
          talk: ["Stinas stickkorg.", "Hon stickar med grönt garn…", "Samma gröna färg som tråden vid hyllan!"],
          clue: "yarn",
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
      clues: { "1": "handprints", "2": "thread", "3": "scales" },
      onEnter: {
        name: "Ester",
        talk: ["Oj! Såg du, Nora? Bilen körde alldeles själv!", "Vi måste prata med Stina."],
      },
      // Something scuttles between the shelves…
      monsters: [
        {
          type: "crawler",
          sprite: "arm",
          routes: [
            [[7, 10], [12, 10]],
            [[12, 9], [7, 9]],
            [[5, 3], [9, 3]],
            [[16, 9], [18, 9], [18, 8]],
          ],
          shelters: [[2, 2], [8, 2], [5, 9], [14, 9]],
          catchWhen: "solved",
        },
      ],
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
        "#L..............LLL#",
        "#...............L.g#",
        "#..LL.....LL.......#",
        "D..LL.....LL.......#",
        "D..........1.......#",
        "#......LL..........#",
        "#x.....LL..........#",
        "#..............LL..#",
        "#############DD#####",
      ],
      things: {
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg!", "Det är varmt… och det rör sig lite."],
          gives: "egg",
          hideWhen: "egg",
        },
        x: {
          name: "Det mörka hörnet",
          sprite: "shadowEyes",
          talk: ["Två glödande prickar blinkar i mörkret…", "…och så är de borta.", "Brr. Det är iskallt här."],
          clue: "shadow",
        },
      },
      clues: { "1": "blood" },
      monsters: [{ type: "flyer", sprite: "fladder", center: [10, 6], size: [6, 3] }],
      onEnter: {
        name: "Ester",
        talk: [
          "Nora, titta! Det är Fladder!",
          "Men fladdermöss sover ju på dagen…",
          "Varför är hon vaken? Något är fel här.",
          "Akta dig! Göm dig bakom lådorna om hon dyker mot dig!",
        ],
        clue: "fladder",
      },
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
          talk: ["Det sitter en lapp här:", "\"SAKNAS: Något grönt som är mitt.\"", "\"Det kan inte sitta still!\"", "\"/ G.\""],
          clue: "poster",
        },
        v: {
          name: "Soptunnan",
          sprite: "trashBin",
          talk: ["En gammal soptunna.", "Locket skramlar… Är det någon där inne?"],
          gives: "opened-bin",
          talkIf: [{ when: "emerged:viskanGhost", talk: ["Soptunnan är tom nu.", "Det luktar spöke."] }],
        },
      },
      clues: { "1": "drag" },
      monsters: [
        {
          type: "sneaker",
          sprite: "viskanGhost",
          home: [16, 4],
          calmWhen: "riddle-solved",
          hideUntil: { when: "opened-bin", delay: 2.5 },
          thing: {
            name: "Viskan",
            sprite: "viskanGhost",
            talk: [
              "Psssst… Nooooraaaa…",
              "Jag är Viskan. Jag bor i soptunnan.",
              "Jag såg något… men jag berättar bara om du löser min gåta!",
            ],
            talkIf: [
              {
                when: "riddle-solved",
                talk: [
                  "Rätt! Hihihi…",
                  "Jag såg något litet och grönt krypa in i affären…",
                  "…och det hade inget huvud! Det höll i något som LYSTE.",
                ],
                clue: "viskan",
              },
            ],
            puzzle: "riddle",
          },
        },
      ],
      onEnter: {
        name: "Ester",
        talk: ["Brr… Nora, känner du också?", "Det är som att någon smyger bakom oss…"],
      },
      doors: [{ at: "top", to: "storeroom" }],
    },
  },

  puzzles: {
    register: {
      type: "code",
      title: "Kassaapparaten",
      text: [
        "Kvittot i kassan:",
        "1 {toy1} …… {price1} kr",
        "1 {toy2} …… {price2} kr",
        "Koden är vad allt kostade tillsammans.",
      ],
      random: { price1: [2, 9], price2: [2, 9] },
      words: {
        toy1: ["boll", "bil", "nalle", "docka", "robot", "raket", "badanka", "dinosaurie"],
        toy2: ["boll", "bil", "nalle", "docka", "robot", "raket", "badanka", "dinosaurie"],
      },
      answer: "{price1}+{price2}",
      answerRange: [10, 18],
      gives: "storeroom-key",
    },
    "shape-lock": {
      type: "order",
      title: "Formlåset",
      text: ["På låset sitter en lapp:"],
      // Three of the shapes, in a new random order every game.
      describe: {
        sphere: "den som rullar åt alla håll",
        cube: "den med sex fyrkantiga sidor",
        cylinder: "den som ser ut som en burk",
        cone: "den med en spets och en rund botten",
      },
      pick: 3,
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
      // Viskan picks one of her riddles each game.
      variants: [
        {
          text: ["Vad blir blötare", "ju mer det torkar?"],
          options: [
            { id: "umbrella", label: "Paraply", sprite: "umbrella" },
            { id: "sun", label: "Solen", sprite: "sun" },
            { id: "towel", label: "Handduk", sprite: "towel" },
            { id: "icecream", label: "Glass", sprite: "iceCream" },
          ],
          answer: "towel",
          hint: "Vad torkar du dig med när du har duschat?",
        },
        {
          text: ["Vad har många tänder", "men kan inte bita?"],
          options: [
            { id: "comb", label: "Kam", sprite: "comb" },
            { id: "sun", label: "Solen", sprite: "sun" },
            { id: "teddy", label: "Nalle", sprite: "teddy" },
            { id: "umbrella", label: "Paraply", sprite: "umbrella" },
          ],
          answer: "comb",
          hint: "Vad använder du när du reder ut håret?",
        },
        {
          text: ["Vad har ett öga", "men kan inte se?"],
          options: [
            { id: "needle", label: "Nål", sprite: "needle" },
            { id: "magnifier", label: "Förstoringsglas", sprite: "magnifier" },
            { id: "icecream", label: "Glass", sprite: "iceCream" },
            { id: "key", label: "Nyckel", sprite: "key" },
          ],
          answer: "needle",
          hint: "Man syr med den, och tråden går genom dess öga!",
        },
        {
          text: ["Vad har fyra ben", "men kan inte gå?"],
          options: [
            { id: "chair", label: "Stol", sprite: "chair" },
            { id: "towel", label: "Handduk", sprite: "towel" },
            { id: "sun", label: "Solen", sprite: "sun" },
            { id: "umbrella", label: "Paraply", sprite: "umbrella" },
          ],
          answer: "chair",
          hint: "Du sitter på den när du äter middag.",
        },
      ],
      gives: "riddle-solved",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Vem flyttar på leksakerna?"],
      options: [
        { id: "fladder", label: "Fladder", sprite: "fladder" },
        { id: "viskan", label: "Viskan", sprite: "viskanGhost" },
        { id: "stina", label: "Stina Snurr", sprite: "stina" },
        { id: "teddy", label: "Nallen", sprite: "teddy" },
        { id: "hand", label: "En lös hand", sprite: "arm" },
      ],
      answer: "hand",
      // One clue that shows it has hands but no feet, and one that shows it has no head.
      proof: [
        ["handprints", "drag"],
        ["teddy", "viskan"],
      ],
      whyNot: {
        fladder: "Fladder har vingar, inte händer. Och hon flyger – hon lämnar inga spår i dammet.",
        viskan: "Viskan svävar… och hon såg ju själv vad det var. Läs hennes vittnesmål igen!",
        stina: "Stina har fötter – men i dammet fanns bara handavtryck.",
        teddy: "Nallen har tassar, inte fingrar. Och han har ett huvud!",
      },
      why: {
        thread: "Grön tråd? Men Stina stickar ju med grönt garn…",
        yarn: "Garnet visar bara att Stina stickar.",
        scales: "Rosa fjäll pekar på Fladder, inte på en hand!",
        teddyMoved: "Att nallen har flyttat sig visar inte VEM som flyttade den.",
        blood: "Blod kan vem som helst ha tappat.",
        fladder: "Att Fladder är vaken är konstigt – men det bevisar inte det här.",
        shadow: "Ögonen i hörnet… det är nog ett annat mysterium!",
        poster: "Lappen säger att något saknas. Men den säger inte vad!",
      },
      gives: "solved",
    },
  },

  clues: {
    handprints: { name: "Handavtryck", sprite: "handprints", text: "Små handavtryck i dammet. Men inga fotspår!" },
    thread: { name: "Grön tråd", sprite: "thread", text: "En grön ulltråd som fastnat i hyllan." },
    scales: { name: "Rosa fjäll", sprite: "pinkScales", text: "Rosa, genomskinliga fjäll vid hyllan. Precis som Fladders vingar…" },
    teddyMoved: {
      name: "Nallen har flyttat sig",
      sprite: "teddy",
      text: "Stina: \"I morse satt nallen på hyllan. Nu sitter han bakom klossarna!\"",
    },
    yarn: { name: "Stinas gröna garn", sprite: "yarnBasket", text: "Stina stickar med grönt garn – samma färg som tråden vid hyllan." },
    teddy: { name: "Nallens vittnesmål", sprite: "teddy", text: "Nallen såg något med fem ben kravla på golvet." },
    blood: { name: "Blodsdroppar", sprite: "bloodDrops", text: "Små droppar blod som leder mot bakdörren." },
    fladder: {
      name: "Fladder är vaken",
      sprite: "fladder",
      text: "Fladder flyger runt mitt på dagen, fast fladdermöss sover på dagen. Något är fel…",
    },
    shadow: {
      name: "Ögonen i hörnet",
      sprite: "shadowEyes",
      text: "Två glödande ögon i ett mörkt hörn av lagret. Sen var de borta. Iskallt!",
    },
    drag: { name: "Släpspår", sprite: "dragMarks", text: "Spår i sanden, som om något kravlat fram med händerna." },
    poster: { name: "Lappen", sprite: "noticeboard", text: "\"SAKNAS: Något grönt som är mitt. Det kan inte sitta still! / G.\"" },
    viskan: {
      name: "Viskans vittnesmål",
      sprite: "viskanGhost",
      text: "Viskan såg något litet och grönt krypa in i affären. Det hade inget huvud – och höll i något som lyste!",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    "storeroom-key": { name: "Lagernyckeln", sprite: "key" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    moonshard: { name: "Den lysande biten", sprite: "moonShard" },
  },

  finale: [
    { say: "Nora", lines: ["Hittade dig!", "Det är ju en ARM… som springer på fingrarna!"] },
    { enter: "grymlan", sprite: "grymlan", from: [10, 11], to: [10, 8] },
    {
      say: "Grymlan",
      lines: [
        "MIN ARM! Äntligen!",
        "Jag kom hit för att köpa en present till min lillebror…",
        "…men i lagret såg jag en skugga med glödande ögon.",
        "Jag blev så rädd att armen trillade av. Och så sprang den iväg!",
      ],
    },
    { say: "Stina Snurr", lines: ["Oj oj oj! Det fixar vi.", "Jag har ett syskrin för trasiga nallar."] },
    { flash: true },
    { hide: "culprit" },
    { frame: "grymlan", index: 1 },
    { say: "Grymlan", lines: ["Den sitter som gjuten! Tack!", "Förlåt att min arm busade med leksakerna."] },
    { reveal: "grymlan", sprite: "moonShard" },
    { say: "Ester", lines: ["Nora, titta! Armen tappade något…", "Det lyser! Som en bit av… månen?"] },
    {
      say: "Nora",
      lines: [
        "Det var den som fick leksakerna att vakna.",
        "Men var kommer den ifrån? Och vem var skuggan i lagret?",
        "Det här mysteriet är inte slut än…",
      ],
    },
    { give: "moonshard" },
  ],

  fact: "Fladdermöss sover upp och ner på dagen och jagar insekter på natten. I mörkret hittar de genom att lyssna på ekot av sina egna rop!",

  cards: [
    { sprite: "fladder", name: "Fladder", text: "Flyger fort och dyker mot den som kommer nära. Men bakom en låda ser hon dig inte!" },
    { sprite: "viskanGhost", name: "Viskan", text: "Bor i en soptunna och smyger när du tittar bort. Titta på henne så fryser hon." },
    { sprite: "grymlan", name: "Grymlan", text: "Ett zombiemonster med taggigt lila hår. Blir han rädd kan armen trilla av!" },
  ],

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
        { text: "Ledtrådar glöder lite. Titta noga på golvet!", skipWhen: ["clue:handprints", "clue:thread"] },
        { text: "Leta vid hyllorna längst ner till höger.", skipWhen: "clue:thread" },
        { text: "Något rosa glimmar på golvet nära hyllorna uppe till vänster.", skipWhen: "clue:scales" },
        { text: "Prata med alla i affären – även leksakerna!", skipWhen: "clue:teddy" },
        { text: "Nallen bakom klossarna vet något. Hoppa över klossarna med mellanslag!", skipWhen: "clue:teddy" },
      ],
    },
    {
      text: "Ta dig in i lagret",
      doneWhen: "visited:storeroom",
      hints: [
        { text: "Lagret är bakom dörren till höger. Men den är låst…", skipWhen: "storeroom-key" },
        { text: "Stina vet var nyckeln är. Prata med henne!", skipWhen: ["heard-about-register"] },
        { text: "Nyckeln ligger i kassaapparaten. Titta på kvittot!", when: "heard-about-register", skipWhen: "storeroom-key" },
        {
          text: "Räkna ihop det som står på kvittot: {price1} + {price2} = ?",
          when: "heard-about-register",
          skipWhen: "storeroom-key",
        },
        { text: "Du har nyckeln! Gå in genom dörren till höger.", when: "storeroom-key" },
      ],
    },
    {
      text: "Undersök lagret",
      doneWhen: STOREROOM_CLUES,
      hints: [
        { text: "Leta efter något som glöder på golvet. Och akta dig för Fladder!", skipWhen: "clue:blood" },
        "Göm dig bakom en låda när Fladder kommer – då ser hon dig inte!",
        { text: "Något blinkar i det mörka hörnet längst ner till vänster…", skipWhen: "clue:shadow" },
      ],
    },
    {
      text: "Ta dig ut ur lagret",
      doneWhen: "visited:yard",
      hints: [
        { text: "Dörren längst ner har ett konstigt lås.", skipWhen: "backdoor-open" },
        { text: "Läs lappen på låset noga. Vilken form kan rulla åt alla håll?", skipWhen: "backdoor-open" },
        {
          text: "Ett klot rullar åt alla håll. En kub har sex fyrkantiga sidor. En cylinder ser ut som en burk. En kon har en spets.",
          skipWhen: "backdoor-open",
        },
        { text: "Låset är öppet! Gå ut genom dörren längst ner.", when: "backdoor-open" },
      ],
    },
    {
      text: "Vart leder spåren?",
      doneWhen: YARD_CLUES,
      hints: [
        { text: "Titta noga i sandlådan!", skipWhen: "clue:drag" },
        { text: "Det sitter en lapp på anslagstavlan.", skipWhen: "clue:poster" },
        { text: "Knacka på soptunnan… om du vågar!", skipWhen: "emerged:viskanGhost" },
        {
          text: "Viskan står still när du tittar på henne. Gå fram medan du tittar på henne – och prata med henne!",
          when: "emerged:viskanGhost",
          skipWhen: "riddle-solved",
        },
        { text: "Viskans gåta: {riddle:hint}", when: "emerged:viskanGhost", skipWhen: "riddle-solved" },
      ],
    },
    {
      text: "Vem flyttar på leksakerna?",
      doneWhen: "solved",
      hints: [
        "Berätta för Stina vad du har kommit fram till.",
        "Läs ledtrådarna i detektivboken (B). Vem – eller vad – har fingrar men inga fötter?",
        "Handavtryck men inga fotspår. Fem ben men inget huvud. Vad kan det vara?",
      ],
    },
    {
      text: "Fånga den skyldige!",
      doneWhen: "caught",
      hints: [
        "Den skyldige gömmer sig någonstans i affären.",
        "Titta noga – på vilken hylla skakar leksakerna?",
        "Gå fram till hyllan där leksakerna skakar och tryck Ctrl!",
      ],
    },
  ],
};
