import type { Case } from "./types";

// Case 5 – the clock tower has stopped, and the whole town is late for everything.
// SPOILER: two things happened in the night. (1) Tornvakten Knut – who calls Nora in – never wound
// the clock. He sat down at the kiosk with a coffee, fell asleep, and when he woke the clock had run
// down. Ashamed, he says he wound it "as always" and blames Kugg-trollet. The weights lie on the
// floor, his logbook is empty for last night, his crank lies by the kiosk next to a cold coffee, and
// Fladder never heard him come up. (2) The Moonstone is gone from the clockwork: a big shadow with
// yellow eyes came in through the window, took it and slipped away north. Fladder was hanging up
// there and fled down to the stairs. Kugg-trollet (tiny, oily prints everywhere – the false lead)
// ran after it to the square and dropped a spare gear, then locked himself in and tried to fix the
// clock, finding one last shard in the empty slot. Nora finds a map to the shadow's cave (→ case 6).
//
// Theory ladder:
//   Square:     "Knut wound the clock, he says. Did a gear fall out? The tourist has something glowing!
//                His crank is by the kiosk, next to a cold coffee… Something with yellow eyes in the tower."
//   Stairs:     "The weights are on the FLOOR – nobody wound it! The logbook is empty for last night,
//                and Fladder never heard Knut. Knut blames the troll – tiny oily prints lead to its hatch."
//   Clockwork:  "The troll only tried to fix it. And the Moonstone's place is EMPTY – big black prints
//                from the window."
// The reveal asks two questions – why did it stop, and who took the Moonstone.

const SQUARE_CLUES = ["clue:crank", "clue:tinyGear", "clue:souvenir", "clue:touristSaw"];
const STAIRS_CLUES = ["clue:weights", "clue:plaque", "clue:logbook", "clue:oilPrints", "clue:fladderSaw", "clue:shadow"];
const TOP_CLUES = ["clue:emptySlot", "clue:blackPrints", "clue:trollNote", "clue:pendulum", "clue:caveMap"];
/** Why did the clock stop? Nobody wound it – everything that shows it, from all three rooms. */
const STOPPED_PROOF = ["weights", "logbook", "fladderSaw", "crank", "trollNote"];
/** Who took it? Big prints from the window, three sightings of yellow eyes, and the map it left. */
const TAKER_PROOF = ["blackPrints", "fladderSaw", "touristSaw", "shadow", "caveMap"];
/** Exactly what the reveal's proof needs. */
const REVEAL_NEEDS = [...new Set([...STOPPED_PROOF, ...TAKER_PROOF])].map((c) => `clue:${c}`);

export const case5: Case = {
  id: "clocktower",
  number: 5,
  title: "Klocktornet har stannat",
  startRoom: "square",
  intro: [
    "Klocktornet i Mystiska staden har stannat!",
    "Ingen vet vad klockan är. Bussen går fel och skolan börjar för sent.",
    "Tornvakten Knut ringer till detektivbyrån: \"Kom FORT!\"",
    "Nora och Ester springer till torget…",
  ],

  rooms: {
    square: {
      name: "Torget",
      theme: "square",
      layout: [
        "######DD############",
        "#TT.....k.........T#",
        "#T..........c.....T#",
        "#.......UUUU.......#",
        "#..KK...UUUU.......#",
        "#..KK..sf......LL..#",
        "#....1.........LL..#",
        "#.......2..........#",
        "#T.................#",
        "#TT..............TT#",
        "#TTT.....N......TTT#",
        "#########DD#########",
      ],
      things: {
        k: {
          name: "Tornvakten Knut",
          person: true,
          sprite: "clockKeeper",
          talk: [
            "Hmpf! Ännu en som ska fråga vad klockan är?",
            "Tornklockan har STANNAT. I natt!",
            "Jag drog upp den i går kväll, som jag alltid gör. Det kan du skriva upp!",
            "Nu kommer hela stan för sent. Bagaren, bussen, skolan… alla!",
          ],
          gives: "talked-to-keeper",
          clue: "keeperSays",
          talkIf: [
            {
              when: "tower-open",
              talk: ["Så du fick upp klocklåset. Hmpf. Inte illa.", "Jag följer med in i tornet. Gå du först!"],
              clue: "keeperSays",
            },
            {
              when: "clue:crank",
              talk: [
                "Min vev! Den… eh… tappade jag nog när jag gick hem i går.",
                "EFTER att jag hade dragit upp klockan, förstås. Det lovar jag!",
              ],
              clue: "keeperSays",
            },
            {
              when: "talked-to-keeper",
              talk: [
                "Tornets dörr har ett klocklås. Man måste kunna klockan för att komma in.",
                "Det är det där Kugg-trollet som har mixtrat, tro mig. Det pilar runt överallt!",
              ],
              clue: "keeperSays",
            },
          ],
          // He goes up into the tower with Nora – and waits in the stairs.
          hideWhen: "visited:stairs",
        },
        f: {
          name: "Mister Fluff",
          person: true,
          sprite: "touristFluff",
          talk: [
            "Hello! Oh… sorry! Jag… little svenska.",
            "Last NIGHT… the TOWER… two YELLOW EYES!",
            "Then… something DARK… went NORTH!",
            "You don't understand? My dictionary! Look!",
          ],
          talkIf: [
            {
              when: "english-done",
              talk: [
                "Thank you! Tack! Nu kan jag säga det… lite på svenska.",
                "I natt tog jag kort på tornet. Så fint!",
                "Då såg jag två GULA ÖGON högt uppe i tornet.",
                "Sen kröp något MÖRKT ut genom ett fönster. Det gled iväg… mot NORR.",
                "Och det som lyser i min väska? My souvenir! En måne av plast!",
              ],
              clue: "touristSaw",
            },
          ],
          puzzle: "english",
        },
        s: {
          name: "Resväskan",
          sprite: "touristSuitcase",
          talk: [
            "Turistens resväska, full av klistermärken.",
            "Den står lite öppen… och något LYSER blått där inne!",
            "Har han tagit något från tornet?",
          ],
          clue: "souvenir",
          talkIf: [
            {
              when: "english-done",
              talk: ["Det som lyser är en måne av plast.", "Det står SOUVENIR på den. Den lyser i mörkret!"],
              clue: "souvenir",
            },
          ],
        },
        c: {
          name: "Kompassrosen",
          sprite: "squareCompass",
          talk: [
            "En kompassros i stenarna på torget.",
            "N betyder norr. Det är åt tornet till.",
            "S är söder, Ö är öster och V är väster.",
          ],
        },
      },
      clues: { "1": "crank", "2": "tinyGear" },
      onEnter: {
        name: "Ester",
        talk: [
          "Titta, Nora! Tornklockan står alldeles still.",
          "Alla springer omkring. Ingen vet vad klockan är!",
          "Vi måste prata med tornvakten.",
        ],
      },
      movers: [
        { sprite: "clockPigeon", path: [[13, 7], [16, 8], [14, 9], [12, 8]], speed: 14, pause: 2500 },
        { sprite: "clockPigeon", path: [[3, 8], [6, 9], [4, 7]], speed: 12, pause: 3500 },
      ],
      doors: [
        {
          at: "top",
          to: "stairs",
          requires: "tower-open",
          puzzle: "tower-lock",
          lockedText: "Tornets dörr har ett lås som ser ut som en klocka.",
        },
        { at: "bottom", lockedText: "Vi kan inte gå än. Vi har ett mysterium att lösa!" },
      ],
    },

    stairs: {
      name: "Trappan i tornet",
      theme: "tower",
      layout: [
        "####################",
        "#x......#..#.HH....D",
        "#.......#..#.......D",
        "#..LL..........LL..#",
        "#..LL.....1....LL..#",
        "#w.................#",
        "#.....GG.....HH..p.#",
        "#.....GG.....HH....#",
        "##.HH..............#",
        "##.HH.......LL...lk#",
        "###.........LL....##",
        "######DD############",
      ],
      things: {
        k: {
          name: "Tornvakten Knut",
          person: true,
          sprite: "clockKeeper",
          talk: [
            "Puh! Så många trappsteg…",
            "Jag drog upp klockan i går kväll, som alltid. Ändå står den still!",
            "Luckan upp till urverket är Kugg-trollets. Han har låst den!",
            "Vad gömmer han där uppe, tro? Jag väntar här.",
          ],
          gives: "talked-to-keeper",
          clue: "keeperSays",
          talkIf: [
            { when: "caught", talk: ["Klockan går igen! Tack, Nora."] },
            {
              when: "solved",
              talk: [
                "Ja… det är sant. Jag satte mig vid kiosken med en kopp kaffe i går kväll.",
                "Och så somnade jag. När jag vaknade hade klockan redan stannat.",
                "Jag skämdes så att jag skyllde på Kugg-trollet. Nu gömmer han sig i urverket…",
                "Hitta honom, Nora. Jag måste be om förlåtelse.",
              ],
            },
            {
              when: "visited:clockwork",
              talk: [
                "Du är nära, Nora! Men något fattas…",
                "Har du undersökt allt, både i tornet och på torget?",
                "Och pratat med Fladder och Mister Fluff?",
              ],
              clue: "keeperSays",
            },
            {
              when: "clue:logbook",
              talk: [
                "Min loggbok? Eh… jag glömde nog bara att skriva i den.",
                "Jag DROG upp klockan. Det var Kugg-trollet som mixtrade! Gå upp och titta, du!",
              ],
              clue: "keeperSays",
            },
            {
              when: "hatch-open",
              talk: ["Du fick upp luckan! Gå upp och titta.", "Mina knän klarar inte fler trappor."],
              clue: "keeperSays",
            },
            {
              when: "talked-to-keeper",
              talk: [
                "Luckan högst upp har ett kodlås.",
                "Det står tal på trappstegen. Kugg-trollet har säkert valt dem!",
              ],
              clue: "keeperSays",
            },
          ],
          puzzle: "reveal",
          puzzleWhen: REVEAL_NEEDS,
          puzzleIntro: ["Nora! Vad hittade du där uppe?", "Det var väl Kugg-trollet som stoppade klockan? Säg att det var han!"],
        },
        w: {
          name: "Klockvikterna",
          sprite: "clockWeights",
          talk: [
            "Klockans tunga vikter hänger i långa kedjor.",
            "Men vikterna ligger ända nere på golvet!",
            "En lapp på väggen: \"När vikterna når golvet stannar klockan. Dra upp den VARJE kväll!\"",
          ],
          clue: "weights",
        },
        p: {
          name: "En gammal skylt",
          sprite: "towerPlaque",
          talk: [
            "En gammal skylt av mässing:",
            "\"Högst upp i tornet bor MÅNSTENEN.\"",
            "\"Den lyser över staden – och gör monstren snälla.\"",
          ],
          clue: "plaque",
        },
        l: {
          name: "Knuts loggbok",
          sprite: "towerLogbook",
          talk: [
            "Tornvaktens loggbok. Här skriver Knut varje gång han drar upp klockan.",
            "\"Söndag kväll: dragit upp. /Knut\" \"Måndag kväll: dragit upp. /Knut\"",
            "\"Tisdag kväll:\" …ingenting. Raden är tom! Och i går var det tisdag.",
          ],
          clue: "logbook",
        },
        x: {
          name: "Det smala fönstret",
          sprite: "shadowEyes",
          talk: ["Ett smalt fönster. Därute är det mörkt…", "Två gula ögon blinkar!", "…och så är de borta. Brr, iskallt!"],
          clue: "shadow",
        },
      },
      clues: { "1": "oilPrints" },
      monsters: [
        {
          type: "flyer",
          sprite: "fladder",
          center: [9, 5],
          size: [6, 3],
          perch: [9, 2],
          perchSprite: "fladderHang",
          thing: {
            name: "Fladder",
            person: true,
            sprite: "fladderHang",
            talk: [
              "Vad vill DU? Jag bor här i tornet. Det var inte jag!",
              "I natt hängde jag uppe i urverket. Då smög något KALLT och MÖRKT förbi mig.",
              "Det var stort. Och det hade gula ögon.",
              "Jag blev så rädd att jag tappade fjäll och flög ner hit. Jag vågar inte gå upp igen!",
              "Och Knut? Han kom aldrig upp i går kväll. Han brukar vissla när han vevar – men det var tyst.",
            ],
            clue: "fladderSaw",
          },
        },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          "Oj, så mörkt det är i tornet…",
          "Nora, där är Fladder! Hon bor visst här.",
          "Göm dig bakom lådorna när hon dyker!",
          "Missar hon dig två gånger blir hon trött och vilar. Då kan vi prata med henne.",
        ],
      },
      doors: [
        { at: "bottom", to: "square" },
        {
          at: "right",
          to: "clockwork",
          stairs: "up",
          requires: "hatch-open",
          puzzle: "hatch-code",
          lockedText: "Luckan upp till urverket är låst med ett kodlås.",
        },
      ],
    },

    clockwork: {
      name: "Urverket",
      theme: "tower",
      layout: [
        "####################",
        "#HH......m.......HH#",
        "#.......2..........#",
        "#GG......1......GG.#",
        "#GG....HH..HH...GG.#",
        "#......HH..HH......#",
        "#..................#",
        "#..p.............c.#",
        "#.GG...........HH..#",
        "D.GG.b.........HH.g#",
        "D..................#",
        "####################",
      ],
      things: {
        m: {
          name: "Den runda luckan",
          sprite: "moonSlotHatch",
          talk: [
            "En rund lucka av mässing, högst upp i urverket.",
            "Det sitter en måne på den.",
            "Den är låst med två kugghjul.",
          ],
          talkIf: [
            {
              when: "slot-open",
              talk: [
                "Luckan är öppen… Här ska Månstenen sitta.",
                "Men platsen är TOM!",
                "Bara lite blått glitter är kvar.",
              ],
              clue: "emptySlot",
            },
          ],
          puzzle: "gear-lock",
        },
        b: {
          name: "En pytteliten säng",
          sprite: "kuggtrollBed",
          talk: [
            "En pytteliten säng i en låda med kugghjul.",
            "Det glittrar blått på kudden, som damm från något som lyser.",
            "En lapp: \"Klockan går INTE! Vikterna ligger på golvet. Ingen har dragit upp dem!\"",
            "\"Jag är för liten för att veva, och veven är borta. Jag smörjer hjulen så länge. /K\"",
          ],
          clue: "trollNote",
        },
        p: {
          name: "Pendeln",
          sprite: "clockPendulum",
          talk: [
            "Klockans pendel hänger alldeles stilla.",
            "Den är hel. Inget sitter fast i den.",
            "Alla kugghjul runt den sitter på sin plats. Inget hjul fattas.",
            "Tick… tack… Nej. Den tickar inte.",
          ],
          clue: "pendulum",
        },
        c: {
          name: "Ett papper vid fönstret",
          sprite: "shadowCaveMap",
          talk: [
            "Ett papper har fastnat vid fönstret. Det är en karta!",
            "\"Från tornet: gå NORR till skogen.\"",
            "\"Sedan VÄSTER längs bäcken. X = GROTTAN.\"",
            "Bredvid krysset: två gula prickar. Som ögon…",
          ],
          clue: "caveMap",
        },
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg, bakom hyllan!", "Det tickar nästan… som en liten klocka."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      clues: { "1": "blackPrints", "2": "scalesTop" },
      monsters: [
        // A clockwork beetle that marches back and forth like a pendulum – wait for it to pass.
        { type: "patroller", sprite: "clockBeetle", path: [[1, 6], [18, 6]], speed: 30, cry: "KNIPS!" },
        // Something small scuttles between the shelves, holding something that glows…
        {
          type: "crawler",
          sprite: "kuggtroll",
          routes: [
            [[1, 2], [6, 2]],
            [[13, 2], [18, 2]],
            [[4, 5], [4, 9]],
            [[13, 10], [18, 10]],
            [[18, 3], [18, 5]],
          ],
          shelters: [[1, 1], [7, 4], [11, 4], [15, 8], [17, 1]],
          catchWhen: "solved",
        },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          "Kugghjul överallt! Men det tickar inte ens.",
          "Akta dig för baggen. Den går fram och tillbaka.",
          "Ha tålamod: vänta tills den har gått förbi!",
          "Och… sprang något litet förbi där borta? Något som LYSTE?",
        ],
      },
      doors: [{ at: "left", to: "stairs", stairs: "down" }],
    },
  },

  puzzles: {
    english: {
      type: "match",
      title: "Mister Fluffs ordbok",
      text: ["Mister Fluff pekar i sin ordbok.", "Para ihop de engelska orden med de svenska!"],
      pairs: [
        ["night", "natt"],
        ["eyes", "ögon"],
        ["tower", "torn"],
        ["dark", "mörk"],
        ["north", "norr"],
        ["yellow", "gul"],
      ],
      pick: 4,
      gives: "english-done",
    },
    "tower-lock": {
      type: "clock",
      title: "Klocklåset",
      text: ["Tornets dörr har ett lås som ser ut som en klocka.", "På låset står det: \"Öppnas {time}.\"", "Vilken klocka visar {time}?"],
      minutes: [0, 15, 30, 45],
      gives: "tower-open",
    },
    "hatch-code": {
      type: "code",
      title: "Luckans kodlås",
      text: [
        "På luckan sitter en lapp: \"Koden är nästa tal i trappan. /K\"",
        "På trappstegen står det:",
        "{seqA}   {seqB}   {seqC}   {seqD}   ?",
      ],
      random: { seqA: [1, 12], seqStep: [2, 5] },
      derive: { seqB: "{seqA}+{seqStep}", seqC: "{seqB}+{seqStep}", seqD: "{seqC}+{seqStep}" },
      answer: "{seqD}+{seqStep}",
      gives: "hatch-open",
    },
    "gear-lock": {
      type: "code",
      title: "Kugghjulslåset",
      text: [
        "Luckan har ett lås med två kugghjul.",
        "Det stora hjulet har {gearBig} kuggar.",
        "Det lilla ska ha HÄLFTEN så många.",
        "Hur många kuggar ska det lilla hjulet ha?",
      ],
      random: { gearHalf: [6, 15] },
      derive: { gearBig: "{gearHalf}*2" },
      answer: "{gearHalf}",
      gives: "slot-open",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: "Varför stannade klockan?",
          options: [
            { id: "notWound", label: "Knut drog aldrig upp den", sprite: "clockKeeper" },
            { id: "troll", label: "Kugg-trollet mixtrade med den", sprite: "kuggtroll" },
            { id: "gear", label: "Ett kugghjul fattas", sprite: "clockTinyGear" },
            { id: "stone", label: "Månstenen är borta", sprite: "moonSlotEmpty" },
          ],
          answer: "notWound",
          // The weights on the floor, the empty line in the logbook, the silence Fladder heard, the crank
          // left by the kiosk and the troll's own note all say the same: nobody wound it.
          proof: STOPPED_PROOF,
          missing: {
            weights: "Vad driver klockan? Titta på det som hänger i kedjorna i trappan – var är det nu?",
            logbook: "Knut skriver upp varje gång han drar upp klockan. Har du läst var?",
            fladderSaw: "Någon bor i tornet och hör allt som händer där på kvällen. Vad sa hon om Knut?",
            crank: "Man behöver något för att dra upp klockan. Var låg det i morse?",
            trollNote: "Någon i urverket märkte också att klockan inte gick. Vad skrev han?",
          },
          whyNot: {
            troll:
              "Kugg-trollet smorde bara hjulen och ville laga klockan. Och klockan stannar när vikterna når golvet – ingen hade dragit upp dem!",
            gear: "Titta vid pendeln i urverket: alla kugghjul sitter på sin plats. Inget hjul fattas!",
            stone:
              "Månstenen ÄR borta – men skylten säger att den lyser över staden och gör monstren snälla. Det är vikterna som driver klockan, och de låg på golvet!",
          },
          why: {
            keeperSays: "Knut SÄGER att han drog upp klockan. Men stämmer det med vikterna och loggboken?",
            tinyGear: "Kugghjulet låg på torget. Men i urverket sitter alla kugghjul på sin plats!",
            souvenir: "Det som lyser i väskan är en måne av plast. Den har inget med klockan att göra.",
            touristSaw: "Mister Fluff såg något i tornet i natt. Spara det till nästa fråga: vem tog Månstenen?",
            plaque: "Skylten berättar om Månstenen: den lyser och gör monstren snälla. Den driver inte klockan.",
            oilPrints: "De små spåren visar att Kugg-trollet går i trappan – han bor ju här. Men varför stannade klockan?",
            pendulum: "Pendeln visar att allt i urverket är helt. Det är inget som gått sönder.",
            scalesTop: "Fjällen visar att Fladder har varit där uppe. Men varför stannade klockan?",
            emptySlot: "Den tomma platsen visar att Månstenen är borta. Men klockan drivs av vikterna!",
            blackPrints: "Fotspåren visar att NÅGON har varit vid Månstenens plats. Spara dem till nästa fråga!",
            shadow: "Ögonen i fönstret… det hör till nästa fråga: vem tog Månstenen?",
            caveMap: "Kartan visar vart någon gick. Spara den till nästa fråga!",
          },
        },
        {
          question: "Vem tog Månstenen?",
          options: [
            { id: "troll", label: "Kugg-trollet", sprite: "kuggtroll" },
            { id: "tourist", label: "Mister Fluff", sprite: "touristFluff" },
            { id: "knut", label: "Tornvakten Knut", sprite: "clockKeeper" },
            { id: "fladder", label: "Fladder", sprite: "fladder" },
            { id: "shadow", label: "En skugga med gula ögon", sprite: "shadowEyes" },
          ],
          answer: "shadow",
          // Big black prints from the window to the empty place, three sightings of something big and
          // dark with yellow eyes (one of them Nora's own), and the map it left with two yellow dots.
          proof: TAKER_PROOF,
          missing: {
            blackPrints: "Vem har gått fram till Månstenens plats? Titta på golvet i urverket!",
            fladderSaw: "Någon i tornet var med i natt och såg vad som kom. Vad sa hon?",
            touristSaw: "Någon på torget tittade upp mot tornet i natt. Vad såg han?",
            shadow: "Har du själv sett något i tornet? Titta ut i mörkret!",
            caveMap: "Något har fastnat vid fönstret där spåren börjar. Vad är ritat bredvid krysset?",
          },
          whyNot: {
            troll:
              "Kugg-trollet har också gula ögon – men han är pyttelitet. Det Fladder såg var STORT, och spåren vid Månstenen var stora.",
            tourist:
              "Mister Fluff har TRE ögon, och de är inte gula. Han är kvar på torget – det mörka gled iväg mot norr.",
            knut: "Knut har inte gula ögon. Och han var inte ens uppe i tornet i går kväll – han somnade vid kiosken.",
            fladder: "Fladder är liten och har vita ögon. Hon var där och blev så rädd att hon tappade fjäll!",
          },
          why: {
            emptySlot: "Den tomma platsen visar att stenen är borta. Men inte VEM som tog den.",
            plaque: "Skylten berättar om Månstenen. Men inte vem som tog den.",
            keeperSays: "Det Knut säger handlar om klockan. Men vem tog stenen?",
            weights: "Vikterna visar bara varför klockan stannade.",
            logbook: "Loggboken handlar om Knut och klockan – inte om vem som tog stenen.",
            crank: "Veven vid kiosken handlar om Knut och klockan – inte om Månstenen.",
            tinyGear: "Kugghjulet visar att någon från urverket har varit på torget. Men det säger inget om gula ögon.",
            oilPrints: "De små oljiga spåren är Kugg-trollets – han bor ju här. Spåren vid Månstenen var stora!",
            souvenir: "Det som lyser i väskan är en måne av plast!",
            scalesTop: "Fjällen visar bara att Fladder var där uppe. Hon tappar fjäll när hon blir rädd.",
            trollNote: "Kugg-trollet ville LAGA klockan. Lappen säger inget om vem som tog stenen.",
            pendulum: "Pendeln säger inget om vem det var.",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    keeperSays: {
      name: "Knut säger att han drog upp klockan",
      sprite: "clockKeeper",
      text: "Tornvakten Knut säger att han drog upp klockan i går kväll, som han alltid gör. Han tror att Kugg-trollet har mixtrat.",
    },
    crank: {
      name: "Veven vid kiosken",
      sprite: "clockCrank",
      text: "Veven som man drar upp tornklockan med. Den ligger vid kiosken på torget, bredvid en kall kopp kaffe. Den har inte varit uppe i tornet!",
    },
    tinyGear: {
      name: "Ett litet kugghjul",
      sprite: "clockTinyGear",
      text: "Ett litet blankt kugghjul med olja på. Har någon från urverket varit här ute i natt?",
    },
    souvenir: {
      name: "Något lyser i väskan",
      sprite: "touristSuitcase",
      text: "Något lyser blått i turistens resväska. Vad kan det vara?",
    },
    touristSaw: {
      name: "Mister Fluffs vittnesmål",
      sprite: "touristFluff",
      text: "I natt såg Mister Fluff två GULA ÖGON högt uppe i tornet. Sen kröp något mörkt ut genom ett fönster och gled iväg mot norr. (Det som lyser i hans väska är en måne av plast.)",
    },
    weights: {
      name: "Vikterna ligger på golvet",
      sprite: "clockWeights",
      text: "Klockans tunga vikter ligger ända nere på golvet. Lappen: \"När vikterna når golvet stannar klockan. Dra upp den VARJE kväll!\"",
    },
    plaque: {
      name: "Skylten om Månstenen",
      sprite: "towerPlaque",
      text: "\"Högst upp i tornet bor MÅNSTENEN. Den lyser över staden – och gör monstren snälla.\"",
    },
    logbook: {
      name: "Knuts loggbok",
      sprite: "towerLogbook",
      text: "Knut skriver upp varje gång han drar upp klockan. Söndag och måndag står det \"dragit upp\". Men raden för tisdag – i går kväll – är tom!",
    },
    oilPrints: {
      name: "Små oljiga fotspår",
      sprite: "clockOilPrints",
      text: "Små oljiga fotspår med tre tår. De går upp och ner i trappan, många gånger.",
    },
    fladderSaw: {
      name: "Fladders vittnesmål",
      sprite: "fladderHang",
      text: "I natt hängde Fladder uppe i urverket. Då smög något KALLT och MÖRKT förbi henne. Det var stort och hade gula ögon. Hon blev så rädd att hon tappade fjäll. Och Knut kom aldrig upp i går kväll – det var tyst, ingen visslade.",
    },
    shadow: {
      name: "Ögonen i fönstret",
      sprite: "shadowEyes",
      text: "Två gula ögon i det mörka fönstret i trappan. Sen var de borta. Iskallt!",
    },
    emptySlot: {
      name: "Den tomma platsen",
      sprite: "moonSlotEmpty",
      text: "Bakom den runda luckan ska Månstenen sitta. Men platsen är TOM! Bara lite blått glitter är kvar.",
    },
    blackPrints: {
      name: "Svarta fotspår",
      sprite: "towerBlackPrints",
      text: "Stora svarta fotspår med långa spetsiga tår, utan skosulor. De går från fönstret till Månstenens plats – och tillbaka.",
    },
    scalesTop: {
      name: "Rosa fjäll",
      sprite: "pinkScales",
      text: "Rosa, genomskinliga fjäll nära Månstenens plats. Har Fladder varit här uppe?",
    },
    pendulum: {
      name: "Pendeln och kugghjulen",
      sprite: "clockPendulum",
      text: "Klockans pendel hänger alldeles stilla. Den är hel, och inget sitter fast i den. Alla kugghjul sitter på sin plats.",
    },
    trollNote: {
      name: "Kugg-trollets lapp",
      sprite: "kuggtrollBed",
      text: "En pytteliten säng med blått glitter på kudden. Lappen: \"Klockan går INTE! Vikterna ligger på golvet. Ingen har dragit upp dem! Jag är för liten för att veva, och veven är borta. /K\"",
    },
    caveMap: {
      name: "Kartan",
      sprite: "shadowCaveMap",
      text: "En karta: \"Från tornet: gå NORR till skogen. Sedan VÄSTER längs bäcken. X = GROTTAN.\" Bredvid krysset: två gula prickar.",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    moonshard: { name: "Den lysande biten", sprite: "moonShard" },
  },

  finale: [
    { say: "Nora", lines: ["Där är du, Kugg-trollet!", "Du behöver inte gömma dig."] },
    {
      say: "Kugg-trollet",
      lines: [
        "Pip! Snälla, bli inte arg!",
        "Knut säger att jag stoppade klockan. Men det var inte jag!",
        "I natt kom en skugga in genom fönstret. Den hade gula ögon.",
        "Den tog Månstenen och försvann mot norr.",
        "Jag sprang efter den ända ner till torget. Men den var för snabb…",
      ],
    },
    {
      say: "Kugg-trollet",
      lines: [
        "Sen låste jag in mig. Jag smorde alla hjul, men vikterna var för tunga för mig…",
        "…men där Månstenen satt hittade jag bara den här.",
      ],
    },
    { reveal: "culprit", sprite: "moonShard" },
    { say: "Ester", lines: ["En bit av Månstenen!", "Den lyser precis som de andra bitarna."] },
    { say: "Kugg-trollet", lines: ["Ta den, Nora. Du samlar ju på dem."] },
    { give: "moonshard" },
    { enter: "knut", sprite: "clockKeeper", from: [0, 10], to: [4, 10] },
    {
      say: "Tornvakten Knut",
      lines: [
        "Kugg-trollet… förlåt. Det var jag som glömde att dra upp klockan.",
        "Jag somnade vid kiosken. Och sen skyllde jag på dig, fast du bara ville hjälpa till.",
      ],
    },
    { say: "Ester", lines: ["Det är modigt att säga förlåt, Knut."] },
    {
      say: "Kugg-trollet",
      lines: ["Kan vi få igång klockan tillsammans?", "Du vevar upp vikterna, och jag knuffar på pendeln!"],
    },
    { flash: true },
    { say: "Ester", lines: ["Tick… tack… BONG! BONG! BONG!", "Klockan går igen! Nu kommer ingen för sent."] },
    {
      say: "Nora",
      lines: [
        "Men Månstenen är fortfarande borta.",
        "Och vi har en karta till skuggans grotta…",
        "Snart ska vi ta reda på vem skuggan är.",
      ],
    },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    "Klockan drivs av tunga vikter. När de når golvet stannar den – och i trappan låg vikterna på golvet. Ingen hade dragit upp den!",
    "Knut sa att han hade gjort det. Men loggboken var tom för i går, veven låg vid kiosken bredvid en kall kaffe, och Fladder hörde honom aldrig komma. Knut hade somnat!",
    "Han skyllde på Kugg-trollet. Men trollet hade bara smort hjulen och skrev själv att vikterna var för tunga för honom.",
    "Och Månstenen? Vid den tomma platsen fanns stora svarta spår från fönstret. Kugg-trollet är alldeles för litet för så stora fötter.",
    "Fladder och Mister Fluff såg något stort och mörkt med gula ögon, och du såg själv ögonen i fönstret. Kartan vid fönstret leder till en grotta.",
    "Kugghjulet på torget tappade Kugg-trollet när han sprang efter skuggan.",
  ],

  fact: "En pendel som är ungefär en meter lång svänger från ena sidan till den andra på precis en sekund. Därför har många gamla tornklockor en lång pendel som säger tick… tack… varje sekund!",

  cards: [
    { sprite: "kuggtroll", name: "Kugg-trollet", text: "Pyttelitet och blankt som koppar. Bor bland kugghjulen och smörjer dem varje dag. Hör du ett pip i tornet är det han!" },
    { sprite: "touristFluff", name: "Mister Fluff", text: "Ett turistmonster med tre ögon och kamera. Säger \"Hello!\" och tar kort på allt – även på dig!" },
    { sprite: "clockBeetle", name: "Urverksbaggen", text: "En bagge av mässing med röda ögon. Den går fram och tillbaka som en pendel. Vänta tills den gått förbi!" },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-keeper",
      hints: [
        { text: "Tornvakten Knut står nära tornets dörr. Prata med honom!", skipWhen: "visited:stairs" },
        { text: "Knut har gått in i tornet. Han väntar i trappan!", when: "visited:stairs" },
        "Knut är gubben med blå mössa och grått skägg. Gå fram till honom och tryck Ctrl.",
      ],
    },
    {
      text: "Leta efter ledtrådar på torget",
      doneWhen: SQUARE_CLUES,
      hints: [
        { text: "Ledtrådar glöder lite. Titta noga på marken!", skipWhen: ["clue:crank", "clue:tinyGear"] },
        { text: "Turisten vid fontänen har en resväska. Vad är det som lyser?", skipWhen: "clue:souvenir" },
        { text: "Prata med turisten vid fontänen!", skipWhen: "english-done" },
        { text: "Mister Fluff pratar engelska. Para ihop orden i hans ordbok!", skipWhen: "english-done" },
        {
          text: "night = natt, eyes = ögon, tower = torn, dark = mörk, north = norr, yellow = gul.",
          skipWhen: "english-done",
        },
        { text: "Nu förstår du Mister Fluff. Prata med honom igen!", when: "english-done", skipWhen: "clue:touristSaw" },
      ],
    },
    {
      text: "Ta dig in i tornet",
      doneWhen: "visited:stairs",
      hints: [
        { text: "Tornets dörr är låst med ett klocklås.", skipWhen: "tower-open" },
        { text: "Den korta visaren visar timmen. Den långa visar minuterna.", skipWhen: "tower-open" },
        {
          text: "Hel: långa visaren pekar rakt upp. Halv: rakt ner. Kvart över: åt höger. Kvart i: åt vänster.",
          skipWhen: "tower-open",
        },
        {
          text: "Halv fyra betyder halvvägs till fyra. Då står den korta visaren mellan tre och fyra!",
          skipWhen: "tower-open",
        },
        { text: "Dörren är öppen! Gå in i tornet.", when: "tower-open" },
      ],
    },
    {
      text: "Undersök trappan i tornet",
      doneWhen: STAIRS_CLUES,
      hints: [
        { text: "Leta efter något som glöder på golvet. Och akta dig för Fladder!", skipWhen: "clue:oilPrints" },
        "Göm dig bakom en låda eller hylla när Fladder dyker!",
        {
          text: "Om Fladder missar dig två gånger blir hon trött och vilar i taket. Då kan du prata med henne!",
          skipWhen: "clue:fladderSaw",
        },
        { text: "Titta på de tunga vikterna vid väggen.", skipWhen: "clue:weights" },
        { text: "Knut har en loggbok vid sin plats i trappan. Läs den!", skipWhen: "clue:logbook" },
        { text: "Det står en gammal skylt i trappan. Läs den!", skipWhen: "clue:plaque" },
        { text: "Uppe till vänster finns ett smalt fönster. Vad syns därute?", skipWhen: "clue:shadow" },
      ],
    },
    {
      text: "Ta dig upp till urverket",
      doneWhen: "visited:clockwork",
      hints: [
        { text: "Trappan uppe till höger leder till en lucka. Den är låst med en kod.", skipWhen: "hatch-open" },
        { text: "Titta på talen i trappan. Hur mycket större blir talet varje gång?", skipWhen: "hatch-open" },
        { text: "Talen ökar med {seqStep} varje gång. Vad kommer efter {seqD}?", skipWhen: "hatch-open" },
        { text: "Luckan är öppen! Klättra upp.", when: "hatch-open" },
      ],
    },
    {
      text: "Undersök urverket",
      doneWhen: TOP_CLUES,
      hints: [
        { text: "Leta efter spår på golvet. Och vänta tills baggen har gått förbi!", skipWhen: "clue:blackPrints" },
        { text: "Någon har en liten säng här uppe. Hitta den!", skipWhen: "clue:trollNote" },
        { text: "Något har fastnat vid fönstret till höger.", skipWhen: "clue:caveMap" },
        { text: "Titta på klockans pendel. Är något trasigt?", skipWhen: "clue:pendulum" },
        { text: "Den runda luckan högst upp – vad finns bakom den?", skipWhen: "clue:emptySlot" },
        { text: "Luckan har ett kugghjulslås. Vad är hälften av {gearBig}?", skipWhen: "slot-open" },
        { text: "Hälften av {gearBig} är det tal som blir {gearBig} när man tar det dubbelt.", skipWhen: "slot-open" },
        { text: "Luckan är öppen! Titta in i den.", when: "slot-open", skipWhen: "clue:emptySlot" },
      ],
    },
    {
      text: "Varför stannade klockan – och vem ligger bakom?",
      doneWhen: "solved",
      hints: [
        "Berätta för Knut vad du har kommit fram till. Han väntar i trappan.",
        "Vad driver klockan – och stämmer det Knut säger? Titta på vikterna, loggboken och vad Fladder hörde.",
        "Vem var STOR och MÖRK och hade gula ögon? Leta i boken efter allt som passar.",
      ],
    },
    {
      text: "Hitta Kugg-trollet!",
      doneWhen: "caught",
      hints: [
        "Kugg-trollet gömmer sig i urverket, högst upp i tornet.",
        "Titta noga – i vilken hylla skakar kugghjulen?",
        "Gå fram till hyllan som skakar och tryck Ctrl!",
      ],
    },
  ],
};
