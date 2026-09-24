import type { Case } from "../../cases/types";
import { S2 } from "../names";

// Case 9 – "Spöket i växthuset" (season 2, GREEN). SPOILER: the whole solution is below and in SEASON2.md.
//
// The truth:
//  - The plants don't move by themselves – they GROW TOWARDS THE LIGHT. A week ago the gardener moved all
//    the pots to the sunny side of the greenhouse, and every day they lean a little more towards the glass.
//    The little plants under the grow lamp in the growing room lean towards the lamp, and nobody moved them.
//  - The snail (S2.snail) ate the tomatoes. Snails eat at night: when she woke up, the leaves in her bowl had
//    turned grey and tasted of nothing – the red tomatoes were the only thing left with colour. Her slime
//    trail goes from the tomatoes down to the growing room, and her bowl of grey leaves is untouched.
//  - The "ghost" on the glass was Trattis walking through with her lantern (her pointy hat makes a long,
//    pointy shadow). She only eats lingonberries.
//  - The bumblebee Surr says she SAW the flytrap eat the tomatoes. She is wrong – she was asleep, and she is
//    just scared of the flytrap. The flytrap eats only flies and its teeth leave zigzag marks; the holes in
//    the tomatoes are round and slimy. (källkritik)
//  - The green was taken by the little drawn figure (the red thread): green drops ran from the plants
//    towards the door, drawn footprints go out through the gate, and Trattis saw it.
//
// Theory ladder:
//   Garden:        "A ghost with a pointy hat! And Surr says the biting plant ate the tomatoes." The notebook:
//                  the pots were moved on Monday, and since then they "turn". Drawn footprints at the gate.
//   Greenhouse:    The plants all lean towards the sunny glass and keep growing. The flytrap eats only flies
//                  (zigzag teeth) – but the tomatoes have round, slimy holes and a slime trail leads downstairs.
//                  Green drops run towards the garden.
//   Growing room:  Plants under the lamp lean towards the lamp – so plants grow towards the light! The snail's
//                  bowl of grey leaves is untouched: she was hungry.
//   Compost:       The ghost was Trattis and her lantern. She saw the little drawn figure dripping green.
// The reveal asks three questions, and each needs clues from at least two rooms.

const GARDEN_CLUES = ["clue:notebook", "clue:scribblePrints", "clue:surrSaw"];
const GREENHOUSE_CLUES = [
  "clue:leaning",
  "clue:grown",
  "clue:bitten",
  "clue:pollen",
  "clue:slime",
  "clue:greenDrops",
  "clue:flytrapPot",
];
const GROW_CLUES = ["clue:lampSprouts", "clue:snailBowl"];
const COMPOST_CLUES = ["clue:lantern", "clue:trattisSaw"];

/** Every clue the three reveal questions need. */
const PROOF = [
  "clue:notebook",
  "clue:leaning",
  "clue:grown",
  "clue:lampSprouts",
  "clue:bitten",
  "clue:slime",
  "clue:snailBowl",
  "clue:greenDrops",
  "clue:scribblePrints",
  "clue:trattisSaw",
];

const FADED = 0.45;

export const case9: Case = {
  id: "s2-greenhouse",
  number: 9,
  title: "Spöket i växthuset",
  startRoom: "garden",
  intro: [
    `${S2.gardener} ringde från växthuset i ${S2.district}:`,
    "\"Plantorna rör på sig när ingen tittar! Och det SPÖKAR!\"",
    "\"I natt blev alla blad grå – och i morse var tomaterna uppätna!\"",
    "Nora och Ester skyndar dit…",
  ],

  rooms: {
    garden: {
      name: "Trädgården",
      theme: "yard",
      faded: FADED,
      layout: [
        "#####DD#############",
        "#TT...........T..TT#",
        "#T.....T..........T#",
        "#..a.......T.......#",
        "#....SSSS......T...#",
        "#.T..SSSS..........D",
        "#....SSSS....T.....D",
        "#.........KK.......#",
        "D.1.....T.Kb...T...#",
        "D........r....N....#",
        "#TT...........T..TT#",
        "####################",
      ],
      things: {
        r: {
          name: S2.gardener,
          sprite: "s2Gardener",
          person: true,
          talk: [
            "Åh, Nora! Äntligen!",
            "Mina plantor rör på sig när ingen tittar!",
            "I natt blev alla blad grå.",
            "Och i morse var tomaterna uppätna!",
            "Och i natt såg jag ett SPÖKE på glaset…",
            "En lång, spetsig skugga. Med ett ljus som svävade!",
          ],
          gives: "talked-to-gardener",
          clue: "rutStory",
          talkIf: [
            {
              when: "caught",
              talk: ["Tack, Nora!", "Nu delar jag med mig. Till alla – på riktigt!"],
            },
            {
              when: "solved",
              talk: [
                `${S2.snail}?! Min lilla blyga snigel…`,
                "Hon gömmer sig nog i odlingsrummet.",
                "Titta efter en hylla som skakar!",
              ],
            },
            {
              when: COMPOST_CLUES,
              talk: ["Du är nära, Nora! Men något fattas…", "Har du undersökt allt, i alla rum?"],
            },
            {
              when: "clue:greenDrops",
              talk: [
                "Gröna droppar mot trädgården? Konstigt…",
                "Har du tittat i komposten? Grinden är till höger.",
                "Låset vill ha tomatens liv i rätt ordning.",
              ],
            },
            {
              when: "visited:greenhouse",
              talk: [
                "Trappan ner till odlingsrummet? Den är låst.",
                "Låset är en frölåda med fyra sorters växter.",
                "Varje växt en gång i varje rad. Det är knepigt!",
              ],
            },
            {
              when: "talked-to-gardener",
              talk: ["Har du hittat något?", "Växthuset är där uppe.", "Men titta dig omkring här ute också!"],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: PROOF,
          puzzleIntro: ["Nora! Vet du vad som händer i mitt växthus?", "Tre frågor. Tre svar. Nu kör vi!"],
        },
        b: {
          name: "Anteckningsboken",
          sprite: "greenhouseNotebook",
          on: "K",
          talk: [
            "En anteckningsbok på bordet.",
            "\"Måndag: Flyttade alla krukor till solsidan.\"",
            "\"Tisdag: Plantorna har vridit sig! Konstigt…\"",
            "\"Onsdag: Ännu mer! Är det ett SPÖKE?\"",
          ],
          clue: "notebook",
        },
        a: {
          name: "Skylten",
          sprite: "sign",
          talk: [
            `VÄXTHUSET I ${S2.district.toUpperCase()}`,
            "Tomater, blommor och gröna blad!",
            "Någon har skrivit under: \"GRÅ blad…\"",
          ],
        },
      },
      clues: { "1": "scribblePrints" },
      onEnter: {
        name: "Ester",
        talk: [
          "Titta, Nora. Buskarna här är också grå…",
          "Och något STORT surrar där borta!",
          "Om det dyker – göm dig bakom ett träd!",
        ],
      },
      // The bumblebee dives at anything that smells sweet – and at Nora.
      monsters: [
        {
          type: "flyer",
          sprite: "greenhouseBumble",
          center: [11, 5],
          size: [6, 3],
          perch: [9, 3],
          perchSprite: "greenhouseBumbleRest",
          thing: {
            name: "Humlan Surr",
            sprite: "greenhouseBumbleRest",
            person: true,
            talk: [
              "Bzzz! Vad vill DU? Jag är trött!",
              "Jag skakar tomatblommorna. BZZZ!",
              "Då blir det tomater, vet du.",
              "Jag äter pollen och nektar. Aldrig tomater!",
              `Men i natt SÅG jag ${S2.flytrap}!`,
              "Hon hoppade fram och åt upp tomaterna. Bzz!",
            ],
            clue: "surrSaw",
            talkIf: [
              {
                when: "solved",
                talk: [
                  "Bzz… förlåt.",
                  "Jag såg ingenting i natt. Humlor sover i boet på natten.",
                  `Jag är bara så rädd för ${S2.flytrap}.`,
                  "Hon försökte NAPPA mig en gång!",
                ],
              },
            ],
          },
        },
      ],
      doors: [
        {
          at: "top",
          to: "greenhouse",
          requires: "talked-to-gardener",
          lockedText: `Dörren till växthuset är stängd. Vi pratar med ${S2.gardener} först.`,
        },
        {
          at: "right",
          to: "compost",
          requires: "gate-open",
          puzzle: "life",
          lockedText: "Grinden till komposten är låst. På låset sitter fem bilder.",
        },
        { at: "left", lockedText: "Vi kan inte gå än. Vi har ett mysterium att lösa!" },
      ],
    },

    greenhouse: {
      name: "Växthuset",
      theme: "greenhouse",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#HH....p.......HHHH#",
        "#..............l...#",
        "#...............HH.#",
        "#............y.....#",
        "#................2t#",
        "D..3.....~~~.......#",
        "D..................#",
        "#.HH.......~~....m.#",
        "#.......4..........#",
        "#####DD#############",
      ],
      things: {
        t: {
          name: "Tomatplantan",
          sprite: "greenhouseTomatoPlant",
          talk: ["En tomatplanta med grå blad.", "Tomaterna har runda, släta hål!", "Runt hålen glänser det. Är det… slem?"],
          clue: "bitten",
        },
        l: {
          name: "Plantorna på solsidan",
          sprite: "greenhouseLeaning",
          talk: [
            "Alla plantor här borta lutar åt samma håll…",
            "…mot glaset, där solen lyser in.",
            "Som om någon har vridit dem!",
          ],
          clue: "leaning",
        },
        m: {
          name: "Måttstocken",
          sprite: "greenhouseRuler",
          talk: ["En måttstock bredvid en tomatplanta.", "Den mäter hur mycket plantan växer."],
          puzzle: "measure",
          puzzleIntro: ["En måttstock bredvid en tomatplanta.", "Det sitter en lapp med siffror på den."],
          talkIf: [
            {
              when: "measured",
              talk: ["Plantan har vuxit massor på en vecka!", "Och titta: toppen växer snett.", "Mot solsidan!"],
              clue: "grown",
            },
          ],
        },
        p: {
          name: "Affischen",
          sprite: "greenhousePoster",
          talk: [
            "\"VARFÖR ÄR BLADEN GRÖNA?\"",
            "\"Bladen har KLOROFYLL. Det är ett grönt ämne.\"",
            "\"Klorofyllet fångar solljuset.\"",
            "\"Med ljus, vatten och luft gör växten sin egen mat!\"",
            "Men nu är alla blad grå… Stackars plantor.",
          ],
        },
        y: {
          name: "Skylten vid krukan",
          sprite: "sign",
          talk: [
            `"${S2.flytrap.toUpperCase()} – köttätande växt."`,
            "\"Äter flugor och myggor. Aldrig frukt!\"",
            "\"Hennes tänder gör sicksackmärken.\"",
            "\"Väck henne inte! Då hoppar hon runt och NAPPAR.\"",
          ],
          clue: "flytrapPot",
        },
      },
      clues: { "2": "pollen", "3": "slime", "4": "greenDrops" },
      onEnter: {
        name: "Ester",
        talk: [
          "Oj, Nora… alla blad är grå!",
          "Och titta – en jättestor köttätande växt. Den sover!",
          "Gå tyst förbi. Hoppa inte nära den!",
        ],
      },
      monsters: [{ type: "sleeper", sprite: "s2Flytrap", at: [10, 5], wakeRadius: 3, cry: "SNAPP!" }],
      doors: [
        { at: "bottom", to: "garden" },
        {
          at: "left",
          to: "growroom",
          stairs: "down",
          requires: "grow-open",
          puzzle: "seed-grid",
          lockedText: "Trappan ner till odlingsrummet har en grind. Låset är en låda med 16 rutor!",
        },
      ],
    },

    growroom: {
      name: "Odlingsrummet",
      theme: "greenhouse",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#HHHH...HHHH...HHH.#",
        "#.............l....#",
        "#..HH.....HH.......#",
        "#..HH.....HH.......#",
        "#..............b...#",
        "#..................D",
        "#...HHH.......HH...D",
        "#...HHH.......HH...#",
        "#HH.........HHH....#",
        "####################",
      ],
      things: {
        l: {
          name: "Plantorna under lampan",
          sprite: "greenhouseLampSprouts",
          talk: [
            "Små plantor i en låda. Här nere lyser bara en lampa.",
            "Lampan hänger på ena sidan…",
            "…och ALLA plantor lutar mot lampan!",
            "Ingen har flyttat dem. De står där de alltid har stått.",
          ],
          clue: "lampSprouts",
        },
        b: {
          name: "Snigelns matskål",
          sprite: "greenhouseSnailBowl",
          talk: [
            "En skål med en lapp:",
            `"${S2.snail} – blyg snigel. Äter blad varje natt."`,
            "Skålen är full av GRÅ blad.",
            "Hon har inte ätit ett enda!",
          ],
          clue: "snailBowl",
        },
      },
      onEnter: {
        name: "Ester",
        talk: ["Här nere är det mörkt och varmt.", "Det prasslar i hyllorna…", "Är det någon här?"],
      },
      // Something shy lives among the shelves. It is only glimpsed once Nora has found its trail.
      monsters: [
        {
          type: "crawler",
          sprite: "s2Snail",
          routes: [
            [[1, 3], [7, 3]],
            [[6, 6], [12, 6]],
            [[2, 6], [2, 9]],
            [[7, 9], [12, 9]],
            [[16, 3], [16, 7]],
          ],
          shelters: [[2, 2], [9, 2], [16, 2], [3, 4], [10, 5], [5, 8], [14, 9], [13, 10]],
          unseenUntil: "clue:slime",
          catchWhen: "solved",
        },
      ],
      doors: [{ at: "right", to: "greenhouse", stairs: "up" }],
    },

    compost: {
      name: "Komposten",
      theme: "yard",
      faded: FADED,
      layout: [
        "####################",
        "#TTTTTTTTTTTTTTTTTT#",
        "#TTTTT.......TTTTTT#",
        "#TTT.....c.....TTTT#",
        "#TT..t.........TTTT#",
        "D..........k.....TT#",
        "D................gT#",
        "#TT..............TT#",
        "#TTTT.........TTTTT#",
        "#TTTTTTT....TTTTTTT#",
        "#TTTTTTTTTTTTTTTTTT#",
        "####################",
      ],
      things: {
        t: {
          name: "Trattis",
          sprite: "trattis",
          person: true,
          talk: ["Sssss… Hihi!", "Vill du ha en svampfråga, Nora?"],
          talkIf: [
            {
              when: "caught",
              talk: ["Hihi! Snart är allt grönt igen, tror jag.", "Skogen och växthuset – vi är rädda om dem!"],
            },
            {
              when: "solved",
              talk: [`${S2.snail}? Hon är inte farlig.`, "Bara hungrig! Hihi.", "Och alla trodde att JAG var ett spöke…"],
            },
            {
              when: "quiz-solved",
              talk: [
                "Rätt! Du kan mycket om svampar. Hihi!",
                "I natt gick jag genom växthuset med min lykta.",
                "Jag ville se på de fina tomaterna.",
                "Men jag äter bara lingon, vet du!",
                "Sen såg jag något litet och GRÅTT i trädgården.",
                "Det såg RITAT ut. Som med blyerts!",
                "Det droppade GRÖNT om det…",
                "…och så tassade det ut genom grinden mot gatan.",
              ],
              clue: "trattisSaw",
            },
          ],
          puzzle: "trattis-quiz",
          puzzleIntro: [
            "Sssss… STOPP DÄR!",
            "Åh, det är ju du, Nora! Hihi!",
            "Jag hälsar på mina svampkusiner i komposten.",
            "Jag såg något i natt. Men först en svampfråga!",
          ],
        },
        k: {
          name: "Trattis lykta",
          sprite: "greenhouseLantern",
          talk: [
            "Trattis lykta.",
            "\"Hihi, titta!\" Trattis håller upp den.",
            "Hennes skugga blir lång och spetsig på staketet…",
            "…precis som spöket på glaset!",
          ],
          clue: "lantern",
        },
        c: {
          name: "Komposten",
          sprite: "greenhouseCompost",
          talk: [
            "Gamla löv och skal blir till ny jord här.",
            "Små svampar växer i högen.",
            "Svampar och maskar hjälper till att göra jorden!",
          ],
        },
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg, gömt i komposten!", "Det är varmt… och luktar jord."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      onEnter: {
        name: "Ester",
        talk: ["Det luktar jord och gamla löv här.", "Och titta… en spetsig hatt!", "Det är ju Trattis!"],
      },
      doors: [{ at: "left", to: "garden" }],
    },
  },

  puzzles: {
    measure: {
      type: "code",
      title: "Måttstocken",
      text: ["Lappen på måttstocken:", "Förra måndagen: {before} cm", "I dag: {now} cm", "Hur många cm har plantan vuxit?"],
      random: { before: [21, 48], growth: [12, 29] },
      derive: { now: "{before}+{growth}" },
      answer: "{now}-{before}",
      answerRange: [12, 29],
      gives: "measured",
    },
    "seed-grid": {
      type: "grid",
      title: "Växtlåset",
      text: [
        "Låset är en frölåda med 16 rutor.",
        "Varje växt ska finnas en gång i varje rad…",
        "…en gång i varje kolumn…",
        "…och en gång i varje liten fyrkant med fyra rutor.",
      ],
      symbols: ["greenhouseSunflower", "greenhouseCactus", "greenhouseTulip", "greenhouseCarrot"],
      givens: 8,
      gives: "grow-open",
    },
    life: {
      type: "order",
      title: "Tomatens liv",
      text: ["Grinden har ett lås med fem bilder.", "\"Sätt tomatens liv i rätt ordning – från början till slut!\""],
      options: [
        { id: "seed", label: "Ett frö i jorden", sprite: "greenhouseSeed" },
        { id: "sprout", label: "En grodd med två små blad", sprite: "greenhouseSprout" },
        { id: "plant", label: "En planta med många blad", sprite: "greenhouseSeedling" },
        { id: "flower", label: "En gul blomma", sprite: "greenhouseFlower" },
        { id: "fruit", label: "En röd tomat", sprite: "greenhouseFruit" },
      ],
      answer: ["seed", "sprout", "plant", "flower", "fruit"],
      wrong: "Grinden sitter fast. Vad kommer först – fröet eller blomman?",
      gives: "gate-open",
    },
    "trattis-quiz": {
      type: "choice",
      title: "Trattis svampfråga",
      text: ["Hihi! Är en svamp en växt", "eller ett djur?"],
      options: [
        { id: "plant", label: "En växt", sprite: "greenhouseSprout" },
        { id: "animal", label: "Ett djur", sprite: "hareHilma" },
        { id: "neither", label: "Ingetdera – en egen sort", sprite: "ringMushroom" },
        { id: "stone", label: "En sten" },
      ],
      answer: "neither",
      // Trattis picks one of her questions each game.
      variants: [
        {
          text: ["Hihi! Är en svamp en växt", "eller ett djur?"],
          options: [
            { id: "plant", label: "En växt", sprite: "greenhouseSprout" },
            { id: "animal", label: "Ett djur", sprite: "hareHilma" },
            { id: "neither", label: "Ingetdera – en egen sort", sprite: "ringMushroom" },
            { id: "stone", label: "En sten" },
          ],
          answer: "neither",
          hint: "Svampar är varken växter eller djur. De är en egen sort!",
        },
        {
          text: ["Gröna växter gör mat av solljus.", "Svampar är inte gröna. Vad äter svampar?"],
          options: [
            { id: "leaves", label: "Gamla löv och döda växter", sprite: "greenhouseCompost" },
            { id: "sun", label: "Solljus", sprite: "sun" },
            { id: "tomatoes", label: "Tomater", sprite: "greenhouseFruit" },
            { id: "stones", label: "Stenar" },
          ],
          answer: "leaves",
          hint: "Titta i komposten! Där äter svamparna upp gamla löv.",
        },
        {
          text: ["Svampen vi plockar är bara en liten del.", "Var är resten av svampen?"],
          options: [
            { id: "threads", label: "Tunna trådar under marken" },
            { id: "air", label: "Uppe i luften" },
            { id: "stone", label: "Inne i en sten" },
            { id: "none", label: "Det finns ingen rest" },
          ],
          answer: "threads",
          hint: "Under marken finns massor av tunna svamptrådar!",
        },
      ],
      gives: "quiz-solved",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: "Varför rör sig plantorna?",
          options: [
            { id: "light", label: "De växer mot ljuset", sprite: "sun" },
            { id: "ghost", label: "Spöket vrider dem", sprite: "greenhouseGhost" },
            { id: "flytrap", label: `${S2.flytrap} drar i dem`, sprite: "s2Flytrap" },
            { id: "snail", label: `${S2.snail} knuffar dem`, sprite: "s2Snail" },
            { id: "gardener", label: `${S2.gardener} vrider dem`, sprite: "s2Gardener" },
          ],
          answer: "light",
          // Moved to the sunny side on Monday → they lean towards the glass and keep growing that way →
          // and in another room, plants nobody moved lean towards the lamp.
          proof: ["notebook", "leaning", "grown", "lampSprouts"],
          missing: {
            notebook: "Vad hände i måndags? Någon skriver ner allt – titta i trädgården!",
            leaning: "Åt vilket håll lutar plantorna i växthuset? Titta på solsidan!",
            grown: "Står plantorna still – eller växer de? Mät dem i växthuset!",
            lampSprouts: "Lutar plantorna i andra rum också? Titta i odlingsrummet!",
          },
          whyNot: {
            ghost: "Spöket var bara Trattis skugga från lyktan. Och plantorna i odlingsrummet lutar också – mot lampan!",
            flytrap: `Varför skulle ${S2.flytrap} få ALLA plantor att luta mot ljuset? Även de under lampan i odlingsrummet!`,
            snail: `${S2.snail} är liten. Och varför lutar ALLA plantor mot ljuset – både vid glaset och under lampan?`,
            gardener: `${S2.gardener} flyttade krukorna en gång, i måndags. Sen har plantorna lutat mer och mer – mot ljuset!`,
          },
          why: {
            rutStory: `${S2.gardener} berättar att plantorna rör sig. Men inte VARFÖR.`,
            scribblePrints: "Fotspåren handlar om det gröna som försvann. Spara dem till sista frågan!",
            surrSaw: "Surr pratar om tomaterna. Inte om varför plantorna lutar.",
            bitten: "De bitna tomaterna handlar om vem som äter. Spara dem till nästa fråga!",
            pollen: "Pollenet visar att någon har skakat blommorna. Inte att plantorna lutar.",
            slime: "Slemspåret handlar om vem som äter tomaterna. Spara det till nästa fråga!",
            greenDrops: "De gröna dropparna handlar om det gröna som försvann. Spara dem till sista frågan!",
            flytrapPot: `Skylten berättar om ${S2.flytrap}. Men vad visar att plantorna växer mot ljuset?`,
            snailBowl: "Skålen handlar om vem som är hungrig. Inte om varför plantorna lutar.",
            lantern: "Lyktan visar att spöket var Trattis. Bra! Men vad visar att plantorna växer mot ljuset?",
            trattisSaw: "Trattis såg något i trädgården. Men inte varför plantorna lutar.",
          },
        },
        {
          question: "Vem äter tomaterna?",
          options: [
            { id: "snail", label: S2.snail, sprite: "s2Snail" },
            { id: "flytrap", label: S2.flytrap, sprite: "s2Flytrap" },
            { id: "trattis", label: "Trattis", sprite: "trattis" },
            { id: "surr", label: "Humlan Surr", sprite: "greenhouseBumble" },
            { id: "gardener", label: S2.gardener, sprite: "s2Gardener" },
          ],
          answer: "snail",
          // Round, slimy holes → a slime trail from the tomatoes down to the growing room → and there, the
          // snail's bowl of grey leaves, not one eaten.
          proof: ["bitten", "slime", "snailBowl"],
          missing: {
            bitten: "Hur ser tomaterna ut? Titta på tomatplantan i växthuset!",
            slime: "Något blankt går från tomaterna. Vart leder det? Titta vid trappan i växthuset!",
            snailBowl: "Vem bor i odlingsrummet – och har inte ätit sin mat?",
          },
          whyNot: {
            flytrap: `Surr sa att hon såg ${S2.flytrap}. Men ${S2.flytrap} äter bara flugor och gör sicksackmärken. Hålen i tomaterna är runda och glänser av slem. Surr hade fel!`,
            trattis: "Trattis var i växthuset i natt – men hon äter bara lingon. Och hålen i tomaterna glänser av slem.",
            surr: "Humlor skakar tomatblommor – då blir det tomater! Surr äter pollen och nektar, inte tomater.",
            gardener: `${S2.gardener} är ju ledsen att tomaterna är borta! Och hålen glänser av slem.`,
          },
          why: {
            rutStory: `${S2.gardener} berättar att tomaterna är uppätna. Men inte av vem.`,
            notebook: "Anteckningsboken handlar om plantorna som lutar. Inte om tomaterna.",
            scribblePrints: "Fotspåren handlar om det gröna som försvann. Spara dem till sista frågan!",
            surrSaw: `Surr säger att hon såg ${S2.flytrap}. Men ${S2.flytrap} äter bara flugor och gör sicksackmärken! Surr hade fel.`,
            leaning: "Plantorna som lutar har inget med tomaterna att göra.",
            grown: "Mätningen visar att plantan växer. Inte vem som äter tomaterna.",
            pollen: "Pollenet visar att Surr har skakat blommorna. Så gör humlor – då blir det tomater! Men hon äter dem inte.",
            greenDrops: "Dropparna handlar om det gröna som försvann. Spara dem till sista frågan!",
            flytrapPot: `Skylten visar att ${S2.flytrap} INTE åt tomaterna. Bra tänkt! Men vem var det då?`,
            lampSprouts: "Plantorna under lampan har inget med tomaterna att göra.",
            lantern: "Lyktan visar att spöket var Trattis. Men vem åt tomaterna?",
            trattisSaw: "Trattis var i växthuset – men hon äter bara lingon. Hon såg inte vem som åt tomaterna.",
          },
        },
        {
          question: "Varför blev bladen grå?",
          options: [
            { id: "drawn", label: "Den lilla ritade figuren tog det gröna", sprite: "s2Scribble" },
            { id: "dark", label: "De fick för lite ljus", sprite: "sun" },
            { id: "snail", label: `${S2.snail} åt upp det gröna`, sprite: "s2Snail" },
            { id: "ghost", label: "Spöket tog det", sprite: "greenhouseGhost" },
            { id: "flytrap", label: `${S2.flytrap} åt upp det`, sprite: "s2Flytrap" },
          ],
          answer: "drawn",
          // The green ran off the plants towards the door → drawn footprints with green dots go out through
          // the gate → and Trattis saw something small, grey and drawn, dripping green.
          proof: ["greenDrops", "scribblePrints", "trattisSaw"],
          missing: {
            greenDrops: "Vart rann det gröna? Titta på golvet i växthuset, nära dörren ut!",
            scribblePrints: "Har någon gått ut ur trädgården i natt? Titta vid grinden!",
            trattisSaw: "Någon var vaken i natt och såg något. Fråga i komposten!",
          },
          whyNot: {
            dark: "Plantorna står i solen och växer mot ljuset. Ljus får de gott om!",
            snail: `${S2.snail} rörde inte ens de grå bladen i skålen. Och det gröna rann mot trädgården, inte ner till hyllorna.`,
            ghost: "Spöket var Trattis skugga. Och Trattis såg själv vem som droppade grönt!",
            flytrap: `${S2.flytrap} äter flugor, inte färg. Och Trattis såg något litet och grått – inte en stor växt!`,
          },
          why: {
            rutStory: `${S2.gardener} berättar att bladen blev grå i natt. Men inte vem som tog det gröna.`,
            notebook: "Anteckningsboken handlar om plantorna som lutar.",
            surrSaw: "Surr pratar om tomaterna – och hon hade fel.",
            leaning: "Plantorna lutar mot ljuset. Det visar inte vart det gröna tog vägen.",
            grown: "Plantan växer fast bladen är grå. Men vem tog det gröna?",
            bitten: "De bitna tomaterna visar vem som åt. Inte vem som tog det gröna.",
            pollen: "Pollenet handlar om Surr och tomatblommorna.",
            slime: "Slemspåret går ner till odlingsrummet. Men det gröna gick ut i trädgården!",
            flytrapPot: `Skylten berättar vad ${S2.flytrap} äter. Inte vart det gröna tog vägen.`,
            lampSprouts: "Plantorna under lampan är också grå. Men vem tog det gröna?",
            snailBowl: "Skålen visar att bladen var grå redan i natt. Men inte vem som tog det gröna.",
            lantern: "Lyktan visar att spöket var Trattis. Men Trattis såg själv något annat…",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    rutStory: {
      name: "Trädgårdsmästarens berättelse",
      sprite: "s2Gardener",
      text: `${S2.gardener}: plantorna rör sig när ingen tittar. I natt blev alla blad grå, och i morse var tomaterna uppätna. Och hon såg ett spöke på glaset – en lång, spetsig skugga med ett svävande ljus!`,
    },
    notebook: {
      name: "Anteckningsboken",
      sprite: "greenhouseNotebook",
      text: "\"Måndag: Flyttade alla krukor till solsidan. Tisdag: Plantorna har vridit sig! Onsdag: Ännu mer! Är det ett spöke?\"",
    },
    scribblePrints: {
      name: "Ritade fotspår",
      sprite: "s2ScribblePrints",
      text: "Små grå fotspår vid grinden ut mot gatan. De ser RITADE ut, som med blyerts. Bredvid dem: pyttesmå gröna prickar.",
    },
    surrSaw: {
      name: "Surrs vittnesmål",
      sprite: "greenhouseBumbleRest",
      text: `Surr skakar tomatblommorna så att det blir tomater. Hon äter pollen och nektar. Hon säger att hon SÅG ${S2.flytrap} hoppa fram och äta upp tomaterna i natt.`,
    },
    leaning: {
      name: "Plantorna lutar",
      sprite: "greenhouseLeaning",
      text: "Alla plantor på solsidan lutar åt samma håll: mot glaset, där solen lyser in.",
    },
    grown: {
      name: "Plantan har vuxit",
      sprite: "greenhouseRuler",
      text: "Tomatplantan har vuxit många centimeter på en vecka. Och toppen växer snett – mot solsidan.",
    },
    bitten: {
      name: "Bitna tomater",
      sprite: "greenhouseBitten",
      text: "Tomater med runda, släta hål. Runt hålen glänser det av slem.",
    },
    pollen: {
      name: "Gult pollen",
      sprite: "greenhousePollen",
      text: "Gult pollen över tomatblommorna. Någon har skakat dem!",
    },
    slime: {
      name: "Slemspåret",
      sprite: "greenhouseSlime",
      text: "Ett blankt slemspår. Det går från tomatplantan hela vägen till trappan ner till odlingsrummet.",
    },
    greenDrops: {
      name: "Gröna droppar",
      sprite: "greenhouseGreenDrips",
      text: "Små gröna droppar på golvet – som målarfärg! De har runnit från plantorna, mot dörren ut till trädgården.",
    },
    flytrapPot: {
      name: "Skylten vid krukan",
      sprite: "sign",
      text: `"${S2.flytrap} – köttätande växt. Äter flugor och myggor, aldrig frukt! Hennes tänder gör sicksackmärken."`,
    },
    lampSprouts: {
      name: "Plantorna under lampan",
      sprite: "greenhouseLampSprouts",
      text: "I odlingsrummet lutar alla småplantor mot lampan. Ingen har flyttat dem.",
    },
    snailBowl: {
      name: "Snigelns matskål",
      sprite: "greenhouseSnailBowl",
      text: `Skålen till ${S2.snail}, en blyg snigel som äter blad varje natt. Den är full av grå blad – hon har inte ätit ett enda!`,
    },
    lantern: {
      name: "Trattis lykta",
      sprite: "greenhouseLantern",
      text: "När lyktan lyser blir Trattis skugga lång och spetsig – precis som spöket på glaset!",
    },
    trattisSaw: {
      name: "Trattis vittnesmål",
      sprite: "trattis",
      text: "Trattis var i växthuset i natt, men hon äter bara lingon. Sen såg hon något litet och grått i trädgården. Det såg RITAT ut och droppade grönt. Det tassade ut genom grinden.",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    "drop-green": { name: "Den gröna droppen", sprite: "dropGreen" },
  },

  finale: [
    { say: "Nora", lines: ["Hittade dig!", `${S2.snail}… med tomat i hela ansiktet!`] },
    {
      say: S2.snail,
      lines: [
        "Förlåt, förlåt!",
        "I natt när jag vaknade var bladen i min skål grå.",
        "De smakade INGENTING. Och jag var så hungrig…",
        "Tomaterna var det enda som var kvar i färg. Så jag åt dem.",
      ],
    },
    { enter: "gardener", sprite: "s2Gardener", from: [19, 7], to: [15, 7] },
    {
      say: S2.gardener,
      lines: [`Men ${S2.snail}! Du kunde ju ha frågat.`, "Jag har massor av tomater. Vi delar!", "Du också, Nora. Och Trattis. Alla!"],
    },
    { say: "Ester", lines: ["Och plantorna rör sig inte av sig själva.", "De VÄXER mot ljuset!"] },
    {
      say: S2.gardener,
      lines: ["Så det var därför de lutade! Jag flyttade ju krukorna.", "Nu vrider jag dem lite varje dag. Då växer de raka."],
    },
    { enter: "surr", sprite: "greenhouseBumbleRest", from: [19, 8], to: [17, 8] },
    { say: "Humlan Surr", lines: ["Bzz… förlåt att jag skyllde på " + S2.flytrap + ".", "Jag såg inget. Jag var bara rädd."] },
    { say: "Nora", lines: ["Och spöket var Trattis och hennes lykta!", `Men ${S2.snail}… vad sitter på ditt skal?`] },
    { reveal: "culprit", sprite: "dropGreen" },
    { say: "Ester", lines: ["En grön droppe! Den har fastnat i slemmet.", "Det är färg… som har runnit av något!"] },
    {
      say: "Nora",
      lines: ["Den ritade figuren igen. Den tog det gröna.", "Vart är den på väg med alla färger?", "Det här mysteriet är inte slut än…"],
    },
    { give: "drop-green" },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    `${S2.gardener} flyttade krukorna till solsidan. Sen lutade de mer och mer mot glaset. Och plantorna under lampan lutade mot lampan. Plantor växer mot ljuset!`,
    `Tomaterna hade runda hål med slem runt. Slemspåret gick ner till odlingsrummet. Där stod skålen med grå blad som ${S2.snail} inte hade rört. Hon var hungrig!`,
    `${S2.flytrap} äter bara flugor och gör sicksackmärken. Surr hade fel – hon var bara rädd.`,
    "Spöket på glaset var Trattis skugga, när hon gick förbi med lyktan.",
    "Och det gröna? Gröna droppar rann mot dörren, ritade fotspår gick ut genom grinden, och Trattis såg något litet och grått som droppade grönt. Den ritade figuren tog det!",
  ],

  fact: "Blad är gröna för att de har klorofyll, ett grönt ämne som fångar solljus. Med ljuset, vatten och luft gör växten sin egen mat. Därför växer plantor mot ljuset!",

  cards: [
    {
      sprite: "s2Flytrap",
      name: S2.flytrap,
      text: "En köttätande växt som sover i sin kruka. Hoppar du nära vaknar hon – och NAPPAR!",
    },
    {
      sprite: "s2Snail",
      name: S2.snail,
      text: "En blyg snigel med ett stort skal. Kilar mellan hyllorna och lämnar blanka slemspår efter sig.",
    },
    {
      sprite: "greenhouseBumble",
      name: "Humlan Surr",
      text: "Skakar tomatblommor så att det blir tomater. Dyker mot allt som luktar sött – göm dig bakom ett träd!",
    },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-gardener",
      hints: [
        `${S2.gardener} ringde till byrån. Hon är här i trädgården.`,
        "Gå fram till henne och tryck Ctrl.",
        "Hon har stråhatt och står till vänster om dig.",
      ],
    },
    {
      text: "Leta efter ledtrådar i trädgården",
      doneWhen: GARDEN_CLUES,
      hints: [
        { text: "Ledtrådar glöder lite. Titta noga på marken!", skipWhen: "clue:scribblePrints" },
        { text: "Något ligger på bordet bredvid trädgårdsmästaren.", skipWhen: "clue:notebook" },
        { text: "Titta vid grinden till vänster, där man går ut mot gatan.", skipWhen: "clue:scribblePrints" },
        { text: "Göm dig bakom ett träd när humlan dyker!", skipWhen: "clue:surrSaw" },
        {
          text: "Om humlan missar dig två gånger blir hon trött och vilar på en blomma. Då kan du prata med henne!",
          skipWhen: "clue:surrSaw",
        },
      ],
    },
    {
      text: "Undersök växthuset",
      doneWhen: GREENHOUSE_CLUES,
      hints: [
        { text: "Växthuset är genom dörren längst upp i trädgården.", skipWhen: "visited:greenhouse" },
        "Den stora växten sover. Gå tyst – hoppa inte nära henne!",
        { text: "Titta på plantorna på solsidan, till höger.", skipWhen: ["clue:leaning", "clue:bitten"] },
        { text: "Tomatplantan står längst till höger. Titta på den – och runt den!", skipWhen: ["clue:bitten", "clue:pollen"] },
        { text: "Det sitter en skylt nära krukan mitt i rummet.", skipWhen: "clue:flytrapPot" },
        { text: "Något glänser på golvet vid trappan till vänster.", skipWhen: "clue:slime" },
        { text: "Något grönt ligger nära dörren ut till trädgården.", skipWhen: "clue:greenDrops" },
        { text: "Måttstocken står nere till höger. Hur mycket har plantan vuxit?", skipWhen: "measured" },
        { text: "Räkna från {before} upp till {now}. Hur många steg är det?", skipWhen: "measured" },
      ],
    },
    {
      text: "Ta dig ner i odlingsrummet",
      doneWhen: "visited:growroom",
      hints: [
        { text: "Trappan ner är till vänster i växthuset. Men den är låst…", skipWhen: "grow-open" },
        { text: "Varje växt får bara finnas en gång i varje rad, kolumn och liten fyrkant.", skipWhen: "grow-open" },
        { text: "Leta upp en rad där bara en ruta är tom. Vilken växt fattas där?", skipWhen: "grow-open" },
        { text: "Låset är öppet! Gå ner för trappan till vänster i växthuset.", when: "grow-open" },
      ],
    },
    {
      text: "Undersök odlingsrummet",
      doneWhen: GROW_CLUES,
      hints: [
        "Det prasslar i hyllorna… Men leta efter ledtrådar först!",
        { text: "Titta på plantorna under lampan, uppe till höger.", skipWhen: "clue:lampSprouts" },
        { text: "Någon har en matskål här. Vems är den?", skipWhen: "clue:snailBowl" },
      ],
    },
    {
      text: "Ta dig in i komposten",
      doneWhen: "visited:compost",
      hints: [
        { text: "Komposten är bakom grinden till höger i trädgården.", skipWhen: "gate-open" },
        { text: "Låset vill ha tomatens liv. Vad kommer först när en tomat växer?", skipWhen: "gate-open" },
        { text: "Först ett frö. Sen en grodd, en planta, en blomma – och sist en tomat!", skipWhen: "gate-open" },
        { text: "Grinden är öppen! Gå till höger i trädgården.", when: "gate-open" },
      ],
    },
    {
      text: "Undersök komposten",
      doneWhen: COMPOST_CLUES,
      hints: [
        { text: "Trattis är här! Prata med henne.", skipWhen: "quiz-solved" },
        { text: "Trattis fråga: {trattis-quiz:hint}", skipWhen: "quiz-solved" },
        { text: "Trattis har en lykta. Titta på den!", skipWhen: "clue:lantern" },
        { text: "Vad såg Trattis i natt? Prata med henne igen.", when: "quiz-solved", skipWhen: "clue:trattisSaw" },
      ],
    },
    {
      text: "Varför rör sig plantorna, vem äter tomaterna – och vart tog det gröna vägen?",
      doneWhen: "solved",
      hints: [
        `Berätta för ${S2.gardener} vad du har kommit fram till. Hon är i trädgården.`,
        "Plantorna på solsidan och under lampan… åt vilket håll lutar de?",
        "Vem lämnar slem efter sig? Och vem har inte ätit sin mat?",
        "Vart gick de gröna dropparna? Vad såg Trattis? Titta i detektivboken (B)!",
      ],
    },
    {
      text: "Fånga den skyldige!",
      doneWhen: "caught",
      hints: [
        "Den skyldige gömmer sig i odlingsrummet.",
        "Titta noga – vilken hylla skakar?",
        "Gå fram till hyllan som skakar och tryck Ctrl!",
      ],
    },
  ],
};
