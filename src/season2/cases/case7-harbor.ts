import type { Case } from "../../cases/types";
import { S2 } from "../names";

// Case 7 – the first case of season 2: the lighthouse shone WHITE instead of red, and everyone
// blames the sea monster.
// SPOILER (see SEASON2.md): nothing is broken and nobody put the light out – everything RED in the
// harbour has turned grey: the lamp's red glass, the fisherman's boat and buoys, even his tin of red
// paint. Something small and grey that looks DRAWN climbed the lighthouse in the night (the first
// glimpse of the season's pencil monster – never named here). The seagull snatched the keeper's shiny
// polishing rag from the window at the top, and to keep suspicion off herself she LIED that she saw
// the sea monster in the lighthouse stairs. The sea monster only came up for fish scraps and swam
// home – it has flippers and can't climb stairs. Under the rag: a red drop of paint.
//
// Theory ladder (the quay is a hub: the fish shed and the lighthouse can be done in either order):
//   Quay:        "The sea monster did it? Someone repainted the boat grey? Did the keeper forget?"
//                But the wet flipper prints only go to the fish shed and back into the water.
//   Fish shed:   "Nobody painted anything – the red paint is grey INSIDE a full tin! And the seagull
//                is a thief: feathers by the fish, the keeper's rag in her nest." Mackerel → the sea
//                monster tells what it saw: something small and grey that looked DRAWN.
//   Lighthouse:  "The keeper DID light it, and it was red. Tiny DRAWN footprints in the stairs –
//                not wet ones. The keeper's rag is gone."
//   Top:         "The glass is whole, it has just lost its red. Pencil shavings…"
// The reveal asks three questions – why white, who climbed, who lied – each with clues from several rooms.

/** Why did the lighthouse shine white? It was lit as usual, but the red glass – and all red – went grey. */
const WHITE_PROOF = ["logbook", "greyGlass", "greyBoat", "greyPaint"];
/** Who climbed the lighthouse? Tiny drawn prints, pencil shavings at the top, and an eyewitness. */
const CLIMBER_PROOF = ["drawnPrints", "shavings", "bubbelSaw"];
/** Who lied? The seagull's story, the wet trail and the stairs that don't match it, and her motive. */
const LIAR_PROOF = ["gullSays", "wetTrail", "drawnPrints", "nestRag"];
const REVEAL_NEEDS = [...new Set([...WHITE_PROOF, ...CLIMBER_PROOF, ...LIAR_PROOF])].map((c) => `clue:${c}`);

const QUAY_CLUES = ["clue:fisherSays", "clue:greyBoat", "clue:wetTrail", "clue:scraps"];
const SHED_CLUES = ["clue:greyPaint", "clue:nestRag", "clue:feathers"];
const LIGHTHOUSE_CLUES = ["clue:logbook", "clue:drawnPrints", "clue:greyGlass", "clue:shavings"];

const FADED = 0.25;

export const case7: Case = {
  id: "s2-harbor",
  number: 7,
  title: "Fyren som tappade färgen",
  startRoom: "quay",
  intro: [
    `Det ringer från ${S2.district}, den nya stadsdelen vid hamnen.`,
    `Det är ${S2.keeper}: "Fyren lyste VITT i natt i stället för rött!"`,
    "\"En båt höll på att gå på grund – och alla säger att sjöodjuret gjorde det!\"",
    "Nora och Ester springer över bron till hamnen…",
  ],

  rooms: {
    quay: {
      name: "Kajen",
      theme: "harbor",
      faded: FADED,
      layout: [
        "####################",
        "#WWWWWWWW....WWWWWW#",
        "#WWoWWWbW.t..WWWWW.D",
        "#.............k..L.D",
        "#..L...1...........#",
        "#.......HH....HH...#",
        "#..f....HH..L.HH.p.#",
        "D..................#",
        "D.....L......HH....#",
        "#.2HH........HH..L.#",
        "#..HH.....N........#",
        "#########DD#########",
      ],
      things: {
        t: {
          name: S2.keeper,
          sprite: "s2Keeper",
          person: true,
          talk: [
            "Nora! Tack för att du kom så fort!",
            "I natt lyste fyren VITT i stället för rött.",
            "En båt höll på att gå på grund på klipporna!",
            "Alla säger att sjöodjuret gjorde det. Det är så stort och läskigt…",
          ],
          gives: "talked-to-keeper",
          clue: "keeperSays",
          talkIf: [
            {
              when: "talked-to-keeper",
              talk: [
                "Min loggbok ligger inne i fyren. Dörren är till höger.",
                "Den har ett ordlås. Jag blandar alltid bokstäverna på lappen…",
                "…så kan ingen tjuv läsa den! Jag går in och väntar.",
              ],
            },
          ],
          // She goes into the lighthouse and waits there.
          hideWhen: "visited:tower",
        },
        f: {
          name: S2.fisher,
          sprite: "s2Fisher",
          person: true,
          talk: [
            "Grrr! Någon har målat om min båt!",
            "Den var RÖD. Nu är den GRÅ!",
            "Det var säkert sjöodjuret. Det smyger vid min fiskbod varje natt.",
            "Och fyrvakten? Hon glömde nog att tända. Hon är så glömsk!",
          ],
          gives: "talked-to-fisher",
          clue: "fisherSays",
          talkIf: [
            { when: "caught", talk: ["Ingen hade målat min båt. Färgen bara… försvann?", "Hmpf. Konstigt värre."] },
            { when: "solved", talk: ["Så sjöodjuret gjorde ingenting? Hmpf…", "Då hade jag fel. Det händer den bäste."] },
            {
              when: "shed-open",
              talk: [`Du fick upp min bod! Akta dig för ${S2.crab}, krabban. Han nyper!`, "Och vill du köpa fisk ligger den på disken."],
            },
            {
              when: "talked-to-fisher",
              talk: ["Min fiskbod är till vänster. Den är låst.", "Koden är vad dagens fångst väger. Lappen sitter på dörren."],
            },
          ],
        },
        b: {
          name: S2.seaMonster,
          sprite: "s2SeaMonster",
          person: true,
          on: "W",
          talk: [
            "GRRRRMMMBL…",
            "Sjöodjuret stirrar på dig med gula ögon. Vilka tänder!",
            "Magen kurrar så att vattnet skvätter.",
            "Det ser hungrigt ut…",
          ],
          gives: "met-sea-monster",
          talkIf: [
            { when: "caught", talk: ["Blubb! Nu har jag en kompis i fyren.", "Och makrill. Blubb-blubb!"] },
            {
              when: "bought-mackerel",
              talk: [
                "*SMASK!* Makrill! Blubb, tack!",
                "Alla tror att jag klättrade upp i fyren. Men jag kan inte gå i trappor – jag har fenor!",
                "I natt kröp jag bara upp och åt fiskrens vid boden. Sen simmade jag hem.",
                "Men då såg jag något… något litet och grått som klättrade på fyren.",
                "Det såg inte ut som ett djur. Det såg RITAT ut. Blubb…",
              ],
              clue: "bubbelSaw",
            },
          ],
        },
        o: {
          name: "Fiskebåten",
          sprite: "harborBoat",
          on: "W",
          talk: [
            "Fiskebåten RÖDA RAN.",
            "Men den är inte röd. Den är grå – ända in i springorna!",
            "Inga penseldrag syns. Bojarna bredvid är också grå.",
          ],
          clue: "greyBoat",
        },
        k: {
          name: "Skylt",
          sprite: "sign",
          talk: [`Välkommen till ${S2.district}!`, "Hamnen · Fyren · Fiskboden", "(Tips: göm dig bakom lådor och nät när måsen dyker!)"],
        },
        p: {
          name: "Pollaren",
          sprite: "harborBollard",
          talk: ["En tjock pollare av järn. Här binder man fast båtar.", "Den har vita fläckar. Här brukar måsen vila!"],
        },
      },
      clues: { "1": "wetTrail", "2": "scraps" },
      monsters: [
        // Dives at Nora on the pier – hide behind the crates and the nets. After two misses she rests
        // on the bollard, and then she can be talked to.
        {
          type: "flyer",
          sprite: "s2Seagull",
          center: [10, 6],
          size: [6, 3],
          perch: [17, 6],
          perchSprite: "s2Seagull",
          thing: {
            name: S2.seagull,
            sprite: "s2Seagull",
            person: true,
            talk: [
              "KRAA! Vad glor du på?",
              "Jag vet vem som gjorde det! Jag såg sjöodjuret i fyrens trappa i natt!",
              "Det kröp uppåt, blött och slemmigt. KRAA!",
              "Och jag har INTE tagit något blankt. Aldrig. Kraa.",
            ],
            clue: "gullSays",
            talkIf: [
              {
                when: "solved",
                talk: [
                  "Kraa… du vet, va?",
                  "Okej, okej! Jag ljög. Sjöodjuret var aldrig i trappan.",
                  "Jag snodde den blanka trasan från fyrens fönster. Den glänste så fint!",
                  "Sen blev jag rädd att alla skulle skylla på mig…",
                ],
                gives: "caught",
              },
            ],
          },
        },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          `Oj, Nora! Det här är ${S2.district}. Här har vi aldrig varit!`,
          "Men… är det inte lite grått här? Som om någon har suddat i färgerna.",
          "Titta, en mås! Den dyker mot folk. Göm dig bakom lådorna eller näten!",
          "Blir den trött och vilar kanske vi kan prata med den.",
        ],
      },
      doors: [
        {
          at: "left",
          to: "shed",
          requires: "shed-open",
          puzzle: "shed-code",
          lockedText: "Fiskboden är låst med ett kodlås. Det sitter en lapp på dörren.",
        },
        {
          at: "right",
          to: "tower",
          requires: "tower-open",
          puzzle: "door-word",
          lockedText: "Fyrens dörr har ett ordlås. På lappen är bokstäverna blandade.",
        },
        { at: "bottom", lockedText: "Vi kan inte gå än. Vi har ett mysterium att lösa!" },
      ],
    },

    shed: {
      name: "Fiskboden",
      theme: "storage",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#LLn..KKcK....LL.p.#",
        "#LL...........LL...#",
        "#.....LL.1.........#",
        "#.....LL.....LL....#",
        "#..................#",
        "#..L......LL.......D",
        "#..L......LL.......D",
        "#......LL..........#",
        "#LL....LL.......LLL#",
        "####################",
      ],
      things: {
        c: {
          name: "Fiskdisken",
          sprite: "harborFishCounter",
          on: "K",
          talk: ["Färsk makrill på is!", "En skylt: \"Betala i burken. /F\""],
          talkIf: [{ when: "bought-mackerel", talk: ["Du har redan köpt en makrill.", "Sjöodjuret på kajen ser hungrigt ut…"] }],
          puzzle: "mackerel",
        },
        p: {
          name: "Färgburken",
          sprite: "harborPaintCan",
          talk: ["En burk båtfärg. Det står RÖD på burken.", "Den är full – ingen har målat med den.", "Men färgen inuti är GRÅ!"],
          clue: "greyPaint",
        },
        n: {
          name: "Måsens bo",
          sprite: "harborNest",
          on: "L",
          talk: [
            "Ett bo av tång och snören, högst upp på lådorna.",
            "Vita fjädrar… och en blank putstrasa!",
            "Det står FYREN på trasan.",
          ],
          clue: "nestRag",
        },
      },
      clues: { "1": "feathers" },
      monsters: [
        // Scuttles back and forth across the shed and pinches – wait until it has passed.
        { type: "patroller", sprite: "s2Crab", path: [[1, 6], [18, 6]], speed: 34, cry: "KNIP!" },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          "Usch, vad det luktar fisk!",
          `Akta dig för ${S2.crab}! Han går fram och tillbaka och nyper.`,
          "Vänta tills han har gått förbi.",
        ],
      },
      doors: [{ at: "right", to: "quay" }],
    },

    tower: {
      name: "Fyrens fot",
      theme: "tower",
      faded: FADED,
      layout: [
        "##############DD####",
        "#HH.........1.....H#",
        "#..................#",
        "D.....LL......LL...#",
        "D..t..LL......LL...#",
        "#..................#",
        "#......KlK.........#",
        "#......KKK....HH...#",
        "#..LL.........HH...#",
        "#..LL..............#",
        "#HH.............LLL#",
        "####################",
      ],
      things: {
        t: {
          name: S2.keeper,
          sprite: "s2Keeper",
          person: true,
          talk: [
            "Här inne är det tryggt. Tror jag…",
            "Min blanka putstrasa är borta! Jag putsar lampans glas med den varje kväll.",
            "I går kväll lade jag den i fönstret högst upp. Nu är den borta!",
            "Loggboken ligger på bordet. Läs den gärna!",
          ],
          gives: "talked-to-keeper",
          clue: ["keeperSays", "ragMissing"],
          talkIf: [
            { when: "caught", talk: ["I natt lyser fyren rött igen – med min reservlampa!", "Tack, Nora."] },
            {
              when: "solved",
              talk: [
                `Så det var ${S2.seagull} som ljög!`,
                "Hon flyger över kajen. Hon måste säga förlåt – till sjöodjuret också!",
              ],
            },
            {
              when: "visited:top",
              talk: [
                "Du är nära, Nora! Men något fattas…",
                "Har du undersökt allt – på kajen, i fiskboden och här i fyren?",
                "Och pratat med alla som var ute i natt?",
              ],
            },
            { when: "top-open", talk: ["Du fick upp klocklåset! Gå upp och titta på lampan."] },
            {
              when: "talked-to-keeper",
              talk: ["Trappan upp till toppen har ett klocklås.", "Det öppnas när jag tänder lampan varje kväll."],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: REVEAL_NEEDS,
          puzzleIntro: ["Nora! Vad har du kommit fram till?", "Varför lyste fyren vitt – och vem ljög?"],
        },
        l: {
          name: "Loggboken",
          sprite: "harborLogbook",
          on: "K",
          talk: [
            "Fyrvaktens loggbok. I går:",
            "\"Kl. 20: Tände lampan som vanligt. Den lyste RÖTT.\"",
            "\"Kl. 2 i natt: En båt tutade! Lampan lyste VITT!\"",
            "\"Dörren var låst hela natten.\"",
          ],
          clue: "logbook",
        },
      },
      clues: { "1": "drawnPrints" },
      onEnter: {
        name: "Ester",
        talk: ["Fyrens trappa. Den är smal och brant…", "Det snurrar i huvudet när man tittar upp!"],
      },
      doors: [
        { at: "left", to: "quay" },
        {
          at: "top",
          to: "top",
          stairs: "up",
          requires: "top-open",
          puzzle: "top-clock",
          lockedText: "Luckan upp till toppen har ett lås som ser ut som en klocka.",
        },
      ],
    },

    top: {
      name: "Fyrens topp",
      theme: "tower",
      faded: FADED,
      layout: [
        "####################",
        "#HH......s.......HH#",
        "#..................#",
        "#..LL..........LL..#",
        "#..LL....m.....LL.g#",
        "#..................#",
        "#.......1..........#",
        "#..................#",
        "#..HH..........HH..#",
        "#..HH..........HH..#",
        "#..................#",
        "####DD##############",
      ],
      things: {
        m: {
          name: "Den stora lampan",
          sprite: "harborLampGrey",
          talk: [
            "Fyrens stora lampa. Den lyser starkt.",
            "Glaset runt den ska vara RÖTT – så att fyren lyser rött.",
            "Men nu är glaset GRÅTT! Det är helt, inte en enda spricka.",
          ],
          clue: "greyGlass",
        },
        s: {
          name: "Kikaren",
          sprite: "harborTelescope",
          talk: [
            "Genom kikaren ser du hela hamnen.",
            "Havet är blått. Gräset är grönt.",
            "Men båten, bojarna och taket på fiskboden… grå. Där var det rött förut!",
          ],
        },
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg, bakom lådorna!", "Det luktar hav… och det guppar lite."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      clues: { "1": "shavings" },
      onEnter: {
        name: "Ester",
        talk: [
          "Vilken utsikt! Hela hamnen syns härifrån.",
          "Nora… såg du? Något grått smet förbi vid fönstret.",
          "…Nej. Det var nog bara en skugga.",
        ],
      },
      doors: [{ at: "bottom", to: "tower", stairs: "down" }],
    },
  },

  puzzles: {
    "shed-code": {
      type: "code",
      title: "Fiskbodens kodlås",
      text: [
        "Lappen på dörren: \"Koden är vad dagens fångst väger. /F\"",
        "Lådan med torsk väger {cod} kg.",
        "Lådan med sill väger {herring} kg.",
        "Hur många kg väger de tillsammans?",
      ],
      random: { cod: [15, 45], herring: [12, 38] },
      answer: "{cod}+{herring}",
      answerRange: [40, 80],
      gives: "shed-open",
    },
    "door-word": {
      type: "word",
      mode: "anagram",
      title: "Fyrens ordlås",
      text: ["Fyrvakten har blandat bokstäverna i ordet.", "Vilket ord är det?"],
      words: ["FYREN", "LAMPA", "HAVET", "BÅTEN", "KAJEN", "ANKAR", "MÅSEN", "BOJEN"],
      gives: "tower-open",
    },
    mackerel: {
      type: "coins",
      title: "Köp en makrill",
      text: ["En makrill kostar {price} kr.", "Betala exakt – med mynt och sedlar!"],
      price: [20, 60],
      coins: [1, 2, 5, 10, 20, 50],
      gives: "bought-mackerel",
    },
    "top-clock": {
      type: "clock",
      title: "Klocklåset",
      text: [
        "Luckan upp till toppen har ett lås som ser ut som en klocka.",
        "På låset står det: \"Tänd lampan {time}.\"",
        "Vilken klocka visar {time}?",
      ],
      minutes: [5, 10, 20, 25, 35, 40, 50, 55],
      gives: "top-open",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: "Varför lyste fyren vitt?",
          options: [
            { id: "forgot", label: "Fyrvakten glömde tända" },
            { id: "broken", label: "Lampan gick sönder" },
            { id: "painted", label: "Någon målade glaset" },
            { id: "monster", label: "Sjöodjuret släckte fyren" },
            { id: "faded", label: "Det röda glaset tappade färgen" },
          ],
          answer: "faded",
          // Lit as usual and red at first – then the glass went grey, just like everything else that was red.
          proof: WHITE_PROOF,
          missing: {
            logbook: "Glömde fyrvakten att tända? Något i fyren berättar vad som hände i natt.",
            greyGlass: "Vad gör att fyren lyser rött? Titta högst upp!",
            greyBoat: "Är det bara fyren som har tappat det röda? Titta ute på kajen!",
            greyPaint: "Har någon målat? Titta i fiskboden – vad finns i färgburken?",
          },
          whyNot: {
            forgot: "Loggboken säger att hon tände lampan som vanligt – och att den lyste rött först.",
            broken: "Lampan lyser ju! Och glaset är helt, utan en enda spricka.",
            painted: "Färgburken var full – ingen hade målat. Och båten var grå ända in i springorna, dit ingen pensel når.",
            monster: "Fyren var inte släckt – den lyste VITT. Och sjöodjuret kan inte gå i trappor.",
          },
          why: {
            keeperSays: "Fyrvakten berättar VAD som hände. Men inte varför.",
            fisherSays: "Fiskaren tror att någon har MÅLAT båten. Men färgburken var full!",
            wetTrail: "De blöta spåren visar var sjöodjuret gick. De säger inget om lampan.",
            scraps: "Fiskrenset visar att något stort har ätit vid boden. Inte varför fyren lyste vitt.",
            bubbelSaw: "Sjöodjuret såg något klättra. Spara det till frågan om VEM!",
            gullSays: "Måsen pratar om vem som var i trappan. Spara det till frågan om VEM!",
            feathers: "Fjädrarna visar att måsen snattar fisk. De säger inget om lampan.",
            nestRag: "Trasan i boet är fyrvaktens. Men en trasa gör inte glaset grått!",
            drawnPrints: "Spåren visar att någon var i trappan. Spara dem till frågan om VEM!",
            ragMissing: "Trasan är borta – men glaset blir inte grått av det.",
            shavings: "Pennspånen visar att någon var där uppe. Spara dem till frågan om VEM!",
          },
        },
        {
          question: "Vem klättrade upp i fyren i natt?",
          options: [
            { id: "monster", label: S2.seaMonster, sprite: "s2SeaMonster" },
            { id: "gull", label: S2.seagull, sprite: "s2Seagull" },
            { id: "fisher", label: S2.fisher, sprite: "s2Fisher" },
            { id: "keeper", label: S2.keeper, sprite: "s2Keeper" },
            { id: "drawn", label: "Något litet och grått som ser ritat ut", sprite: "s2ScribblePrints" },
          ],
          answer: "drawn",
          // Tiny drawn footprints in the stairs, pencil shavings at the top, and an eyewitness.
          proof: CLIMBER_PROOF,
          missing: {
            drawnPrints: "Vad finns på golvet vid trappan i fyren? Titta noga!",
            shavings: "Har någon lämnat något efter sig högst upp i fyren?",
            bubbelSaw: "Någon på kajen såg något klättra på fyren i natt. Kanske vill den ha något att äta först…",
          },
          whyNot: {
            monster: "Sjöodjuret har fenor och kan inte gå i trappor. Och de blöta spåren slutade vid vattnet.",
            gull: "Måsen har stora fötter med tre tår. Spåren i trappan var pyttesmå och såg RITADE ut.",
            fisher: "Fiskaren har jättestora stövlar. Spåren i trappan var pyttesmå – och inte alls stövelspår.",
            keeper: "Fyrvakten tände lampan och gick hem. Hennes skor gör inga små ritade spår – och hon vässar inga pennor där uppe.",
          },
          why: {
            keeperSays: "Fyrvakten berättar vad som hände. Men inte vem som var i fyren.",
            fisherSays: "Fiskaren gissar på sjöodjuret – men han såg ingenting själv.",
            greyBoat: "Den grå båten visar att det röda försvann. Men inte vem som klättrade.",
            greyPaint: "Färgburken visar att det röda försvann. Men inte vem som klättrade.",
            greyGlass: "Glaset visar VAD som hände. Men vem var där uppe?",
            logbook: "Loggboken säger att dörren var låst. Så vem kom in ändå? Den säger inte vem.",
            wetTrail: "De blöta spåren går till boden och tillbaka ner i vattnet – inte till fyren. De visar vem som INTE var där.",
            scraps: "Fiskrenset visar var sjöodjuret åt. Inte vem som var i fyren.",
            gullSays: "Måsen säger att det var sjöodjuret. Men stämmer det med spåren i trappan?",
            feathers: "Fjädrarna låg i fiskboden, inte i fyren.",
            nestRag: "Trasan i boet säger inget om vem som klättrade i trappan.",
            ragMissing: "Att trasan är borta säger inte vem som klättrade i trappan.",
          },
        },
        {
          question: "Vem ljög?",
          options: [
            { id: "gull", label: S2.seagull, sprite: "s2Seagull" },
            { id: "fisher", label: S2.fisher, sprite: "s2Fisher" },
            { id: "keeper", label: S2.keeper, sprite: "s2Keeper" },
            { id: "monster", label: S2.seaMonster, sprite: "s2SeaMonster" },
          ],
          answer: "gull",
          // What she said, the prints that don't match it, and why she wanted someone else to be blamed.
          proof: LIAR_PROOF,
          missing: {
            gullSays: "Vem sa att hen såg sjöodjuret i trappan? Någon som vilar på kajen…",
            wetTrail: "Vart gick sjöodjuret egentligen i natt? Titta på bryggan!",
            drawnPrints: "Vilka spår fanns i fyrens trappa? Var de blöta?",
            nestRag: "Varför skulle någon ljuga? Kanske har den något att gömma… i fiskboden.",
          },
          whyNot: {
            fisher: "Fiskaren hade fel om båten och sjöodjuret – men han sa det han trodde. Att ha fel är inte att ljuga.",
            keeper: "Fyrvakten sa sanningen. Loggboken visar att hon tände lampan som vanligt.",
            monster: "Sjöodjurets blöta spår slutar vid vattnet, precis som det sa. Det sa sanningen!",
          },
          why: {
            keeperSays: "Fyrvakten berättar vad som hände – och det stämmer.",
            fisherSays: "Fiskaren hade fel – men han ljög inte. Han sa det han trodde.",
            greyBoat: "Båten visar vad som hände med färgen. Men inte vem som ljög.",
            greyPaint: "Färgburken visar vad som hände med färgen. Men inte vem som ljög.",
            greyGlass: "Glaset visar vad som hände med färgen. Men inte vem som ljög.",
            logbook: "Loggboken visar att fyrvakten sa sanningen. Men vem ljög?",
            bubbelSaw: "Sjöodjuret säger att det inte var i trappan. Men så säger ju alla som blir anklagade! Vi behöver spår och saker som bevis.",
            scraps: "Fiskrenset visar att sjöodjuret åt vid boden – precis som det sa.",
            feathers: "Fjädrarna visar att måsen snattar fisk. Men att snatta är inte samma sak som att ljuga!",
            ragMissing: "Att trasan är borta visar att någon tog den. Men VEM som har den ser man någon annanstans.",
            shavings: "Pennspånen säger inget om vem som ljög.",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    keeperSays: {
      name: "Fyrvakten berättar",
      sprite: "s2Keeper",
      text: "I natt lyste fyren VITT i stället för rött. En båt höll på att gå på grund! Alla säger att sjöodjuret gjorde det.",
    },
    fisherSays: {
      name: "Fiskaren är arg",
      sprite: "s2Fisher",
      text: "\"Någon har målat om min båt grå! Det var säkert sjöodjuret. Och fyrvakten glömde nog att tända.\"",
    },
    greyBoat: {
      name: "Den grå båten",
      sprite: "harborBoat",
      text: "Fiskebåten RÖDA RAN är grå – ända in i springorna. Inga penseldrag. Bojarna bredvid är också grå.",
    },
    wetTrail: {
      name: "Blöta spår",
      sprite: "harborWetPrints",
      text: "Stora blöta spår efter simfötter. De går från vattnet till fiskboden – och tillbaka ner i vattnet. Inga spår går mot fyren.",
    },
    scraps: {
      name: "Fiskrens",
      sprite: "harborFishScraps",
      text: "Fiskrens utanför fiskboden, med stora tandmärken. Något stort har ätit här i natt.",
    },
    bubbelSaw: {
      name: "Sjöodjurets vittnesmål",
      sprite: "s2SeaMonster",
      text: "Sjöodjuret kan inte gå i trappor – det har fenor. I natt åt det fiskrens vid boden och simmade hem. Då såg det något litet och grått klättra på fyren. Det såg RITAT ut!",
    },
    gullSays: {
      name: "Måsens vittnesmål",
      sprite: "s2Seagull",
      text: "\"Jag såg sjöodjuret i fyrens trappa i natt! Det kröp uppåt, blött och slemmigt. Och jag har INTE tagit något blankt!\"",
    },
    greyPaint: {
      name: "Färgburken",
      sprite: "harborPaintCan",
      text: "En full burk båtfärg. Det står RÖD på den – men färgen inuti är GRÅ. Ingen har målat med den.",
    },
    feathers: {
      name: "Vita fjädrar",
      sprite: "harborFeathers",
      text: "Vita fjädrar på golvet vid fiskdisken. Någon med vingar har snattat fisk här!",
    },
    nestRag: {
      name: "Måsens bo",
      sprite: "harborNest",
      text: "Högst upp på lådorna i fiskboden: ett bo med vita fjädrar – och fyrvaktens blanka putstrasa! Det står FYREN på den.",
    },
    logbook: {
      name: "Loggboken",
      sprite: "harborLogbook",
      text: "\"Kl. 20: Tände lampan som vanligt. Den lyste RÖTT. Kl. 2: En båt tutade! Lampan lyste VITT! Dörren var låst hela natten.\"",
    },
    drawnPrints: {
      name: "Ritade fotspår",
      sprite: "s2ScribblePrints",
      text: "Pyttesmå grå fotspår vid trappan i fyren. De är inte blöta. De ser RITADE ut – som med blyerts!",
    },
    ragMissing: {
      name: "Putstrasan är borta",
      sprite: "s2Keeper",
      text: "Fyrvakten putsar lampans glas med en blank trasa varje kväll. I går lade hon den i fönstret högst upp. Nu är den borta!",
    },
    greyGlass: {
      name: "Det grå glaset",
      sprite: "harborLampGrey",
      text: "Glaset runt lampan ska vara RÖTT. Nu är det GRÅTT – men helt, utan en enda spricka. Lampan fungerar.",
    },
    shavings: {
      name: "Pennspån",
      sprite: "s2PencilShavings",
      text: "Små lockiga träspån med grå spetsar, högst upp i fyren. Som när man vässar en blyertspenna!",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    "drop-red": { name: "Den röda droppen", sprite: "dropRed" },
  },

  finale: [
    { say: "Nora", lines: ["Tack för att du säger sanningen.", "Men nu måste du säga förlåt – till två stycken."] },
    { enter: "keeper", sprite: "s2Keeper", from: [19, 3], to: [15, 4] },
    { say: S2.keeper, lines: ["Min putstrasa! Var är den?"] },
    {
      say: S2.seagull,
      lines: [
        "Kraa… här. Jag hämtade den från boet.",
        "Förlåt att jag snodde den.",
        "Och förlåt, sjöodjuret. Jag skyllde på dig för att du ser så farlig ut.",
      ],
    },
    { say: S2.seaMonster, lines: ["Blubb. Alla tror att jag är farlig.", "Men jag vill bara ha makrill… och en kompis."] },
    {
      say: S2.keeper,
      lines: [
        "Då kan väl du och jag vara kompisar!",
        "Du kan simma runt fyren på nätterna och vakta båtarna.",
        "Och i kväll sätter jag i min reservlampa. Då lyser fyren rött igen.",
      ],
    },
    { say: "Ester", lines: ["Nora, titta! Det ligger något i trasan…"] },
    { reveal: "nora", sprite: "dropRed" },
    { say: "Ester", lines: ["En röd droppe!", "Det är ju färg… som har runnit av något!"] },
    {
      say: "Nora",
      lines: [
        "Allt som var rött i hamnen har blivit grått.",
        "Och något litet och grått klättrade upp i fyren i natt…",
        "Vem vill ha det röda – och varför? Det här mysteriet är inte slut än…",
      ],
    },
    { give: "drop-red" },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    "Loggboken visade att fyrvakten tände lampan som vanligt – och att den lyste rött. Sen blev glaset grått, och då lyste fyren vitt.",
    "Båten var grå ända in i springorna, och färgburken var full men grå. Ingen hade målat! Det röda hade bara försvunnit.",
    "I trappan fanns pyttesmå ritade fotspår, och högst upp låg pennspån. Sjöodjuret såg något litet och grått som såg ritat ut klättra på fyren.",
    `Sjöodjuret kan inte gå i trappor, och de blöta spåren slutade vid vattnet. Så ${S2.seagull} ljög om trappan.`,
    `Varför? Fyrvaktens trasa låg i hennes bo. ${S2.seagull} var rädd att bli påkommen – och skyllde på den som såg farligast ut.`,
  ],

  fact: "Fyrar blinkar i olika mönster, till exempel två snabba blink och sedan mörker. Då vet sjömännen vilken fyr de ser – även mitt i natten!",

  cards: [
    {
      sprite: "s2Seagull",
      name: S2.seagull,
      text: "Snor allt som glänser och dyker mot den som kommer nära. Men bakom en låda eller ett nät ser hon dig inte!",
    },
    {
      sprite: "s2SeaMonster",
      name: S2.seaMonster,
      text: "Ett sjöodjur med gula ögon och alldeles för många tänder. Ser farligt ut – men vill mest ha makrill och en kompis.",
    },
    {
      sprite: "s2Crab",
      name: S2.crab,
      text: "En sur krabba som går fram och tillbaka i fiskboden och nyper. Vänta tills han har gått förbi!",
    },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-keeper",
      hints: [
        { text: `${S2.keeper} står på bryggan uppe vid vattnet. Prata med henne!`, skipWhen: "visited:tower" },
        { text: `${S2.keeper} har gått in i fyren. Hon väntar där!`, when: "visited:tower" },
        "Fyrvakten har gul regnrock och blå mössa. Gå fram till henne och tryck Ctrl.",
      ],
    },
    {
      text: "Undersök kajen",
      doneWhen: QUAY_CLUES,
      hints: [
        { text: "Fiskaren till vänster ser arg ut. Vad har hänt honom?", skipWhen: "clue:fisherSays" },
        { text: "Titta på båten i vattnet uppe till vänster.", skipWhen: "clue:greyBoat" },
        { text: "Något blött glänser på bryggan, nedanför sjöodjuret.", skipWhen: "clue:wetTrail" },
        { text: "Titta på marken nere till vänster, nära fiskboden.", skipWhen: "clue:scraps" },
      ],
    },
    {
      text: "Ta dig in i fiskboden",
      doneWhen: "visited:shed",
      hints: [
        { text: "Fiskboden är dörren till vänster. Den är låst med ett kodlås.", skipWhen: "shed-open" },
        { text: "Läs lappen på dörren. Hur mycket väger lådorna tillsammans?", skipWhen: "shed-open" },
        { text: "Lägg ihop {cod} och {herring}. Börja med tiotalen, sedan entalen!", skipWhen: "shed-open" },
        { text: "Dörren är öppen! Gå in i fiskboden.", when: "shed-open" },
      ],
    },
    {
      text: "Undersök fiskboden",
      doneWhen: SHED_CLUES,
      hints: [
        "Vänta tills krabban har gått förbi. Sen springer du!",
        { text: "Uppe till höger står en färgburk. Vad finns i den?", skipWhen: "clue:greyPaint" },
        { text: "Uppe på lådorna till vänster ligger något… ett bo?", skipWhen: "clue:nestRag" },
        { text: "Titta på golvet nära fiskdisken.", skipWhen: "clue:feathers" },
      ],
    },
    {
      text: "Vad har sjöodjuret och måsen sett?",
      doneWhen: ["clue:bubbelSaw", "clue:gullSays"],
      hints: [
        { text: "Sjöodjuret är jättehungrigt. Vad äter ett sjöodjur?", skipWhen: ["bought-mackerel"] },
        { text: "I fiskboden finns makrill på disken. Köp en!", skipWhen: "bought-mackerel" },
        { text: "Makrillen kostar {price} kr. Börja med den största pengen som får plats!", skipWhen: "bought-mackerel" },
        { text: "Ge makrillen till sjöodjuret – prata med det igen!", when: "bought-mackerel", skipWhen: "clue:bubbelSaw" },
        { text: "Göm dig när måsen dyker. Missar hon två gånger blir hon trött!", skipWhen: "clue:gullSays" },
        { text: "Den trötta måsen vilar på pollaren till höger. Då kan du prata med henne.", skipWhen: "clue:gullSays" },
      ],
    },
    {
      text: "Ta dig in i fyren",
      doneWhen: "visited:tower",
      hints: [
        { text: "Fyrens dörr är uppe till höger på kajen. Den har ett ordlås.", skipWhen: "tower-open" },
        { text: "Bokstäverna är blandade. Vilket ord om hamnen kan det bli?", skipWhen: "tower-open" },
        { text: "Ordet börjar på {door-word:first} och har {door-word:length} bokstäver.", skipWhen: "tower-open" },
        { text: "Dörren är öppen! Gå in i fyren.", when: "tower-open" },
      ],
    },
    {
      text: "Undersök fyren, ända upp till toppen",
      doneWhen: LIGHTHOUSE_CLUES,
      hints: [
        { text: "Fyrvaktens loggbok ligger på bordet. Läs den!", skipWhen: "clue:logbook" },
        { text: "Titta på golvet vid trappan uppe till höger.", skipWhen: "clue:drawnPrints" },
        { text: "Trappan upp har ett klocklås. Titta noga på den långa visaren!", skipWhen: "top-open" },
        {
          text: "Den långa visaren på 1 är fem över, på 2 tio över, på 4 tjugo över, på 5 fem i halv.",
          skipWhen: "top-open",
        },
        {
          text: "På 7 är det fem över halv, på 8 tjugo i, på 10 tio i och på 11 fem i. Den korta visaren visar timmen!",
          skipWhen: "top-open",
        },
        { text: "Titta på den stora lampan högst upp – och på golvet runt den!", when: "top-open", skipWhen: ["clue:greyGlass", "clue:shavings"] },
      ],
    },
    {
      text: "Varför lyste fyren vitt – och vem ljög?",
      doneWhen: "solved",
      hints: [
        "Berätta för fyrvakten vad du har kommit fram till. Hon väntar i fyren.",
        "Är det bara fyren som har tappat det röda? Tänk på båten och färgburken.",
        "Vem sa något som inte stämmer med spåren? Titta i detektivboken (B)!",
      ],
    },
    {
      text: `Få ${S2.seagull} att säga förlåt!`,
      doneWhen: "caught",
      hints: [
        "Måsen flyger över kajen.",
        "Göm dig bakom lådor och nät när hon dyker. Då blir hon trött.",
        "När hon vilar på pollaren – gå fram och prata med henne!",
      ],
    },
  ],
};
