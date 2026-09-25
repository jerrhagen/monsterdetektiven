import type { Case } from "./types";

// Case 3 – Spöket i biblioteket: the books move around at night, and everyone says it's a ghost.
// SPOILER: Viskan is innocent. The books are borrowed by Bokmalen Bläddra, a bookworm who lives in
// the cellar and practises reading at night – with a glowing piece of the Moonstone as a reading lamp.
//
// Built as a "theory ladder": every room changes what Nora believes.
//   Library hall:  "It's a ghost – Viskan! Or Pelle? Or Bodil, who has the only key?"
//                  Whispers at night, books on the floor, "chewed" pink crumbs, Pelle "saw" the ghost.
//   Reading room:  "It's no ghost!" – Ugo saw something long and soft, with glasses (like Bodil…?)
//                  and a blue lamp, crawling off towards the cellar. The books lead down there too.
//   Cellar:        "A bookworm that is learning to read!" – a wriggly trail without feet, a practice
//                  sheet (the crumbs were from an eraser), a fort of whole ABC books opened at A, B, C,
//                  and Viskan (who can't carry anything) hears someone sound out B… O… K… at night.
// The first case with an unreliable witness: Pelle says he saw the ghost, but he only heard the rumour.
// The reveal asks who it is (reading room + cellar) and why (library hall + cellar).
// Route: hall →top door→ reading room →stairs down (left)→ cellar. From the hall, stairs up (right)
// lead to the top of the library tower – optional, with nothing but the secret egg and a view.
// Ugo only tells what it LOOKED like, Viskan only what she HEARD – so each clue shows one thing.

const HALL_CLUES = ["clue:messyBooks", "clue:eraserCrumbs", "clue:missingList", "clue:locked", "clue:pelleSaw"];
const READING_CLUES = ["clue:ugoSaw", "clue:bookLine", "clue:moonBook"];
const CELLAR_CLUES = ["clue:wormTrail", "clue:practiceSheet", "clue:bookFort", "clue:viskanSaw", "clue:skuggaNote"];
/**
 * The reveal opens when every room has been investigated (like case 1) – that covers every proof
 * clue (ugoSaw, wormTrail, missingList, practiceSheet, viskanSaw, bookFort) and keeps the goals in step.
 */
const REVEAL_NEEDS = [...HALL_CLUES, ...READING_CLUES, ...CELLAR_CLUES];

export const case3: Case = {
  id: "library",
  number: 3,
  title: "Spöket i biblioteket",
  startRoom: "hall",
  intro: [
    "Bibliotekarien Bodil Bok ringde till detektivbyrån.",
    "\"Nora! Böckerna flyttar sig – varje natt!\"",
    "\"Alla säger att det spökar i biblioteket…\"",
    "Nora och Ester skyndar dit…",
  ],

  rooms: {
    hall: {
      name: "Biblioteket",
      theme: "library",
      layout: [
        "#####DD#############",
        "#####..#############",
        "#HHHH..HHHH...KlK..#",
        "#.............K.b..#",
        "#..v..........K....#",
        "#..................#",
        "#.HH..HH..1...HH...#",
        "#.HH..HH......HH...#",
        "#..................D",
        "#..pKK2............D",
        "#......s..N........#",
        "#########DD#########",
      ],
      things: {
        b: {
          name: "Bodil Bok",
          person: true,
          sprite: "bodil",
          talk: [
            "Nora! Så bra att du kom. Jag heter Bodil Bok.",
            "Varje natt flyttar sig böckerna! På morgonen ligger de överallt.",
            "Jag bor en trappa upp. På nätterna hör jag viskningar: \"Buuu… ooo…\"",
            "Alla säger att det spökar. Kan du ta reda på vad det är?",
            "Läsrummet har jag låst. Nyckeln ligger på bokvagnen – under alla böcker.",
          ],
          gives: "talked-to-bodil",
          clue: "whispers",
          talkIf: [
            {
              when: "caught",
              talk: ["Tack, Nora! Nu har Bläddra ett eget lånekort.", "Vi ska läsa tillsammans varje dag."],
            },
            {
              when: "solved",
              talk: [
                "En bokmal som vill lära sig läsa!? Men var är hen nu?",
                "Titta – böckerna skakar på en av hyllorna…",
                "Hen gömmer sig! Hitta hen, Nora. Men var snäll!",
              ],
            },
            {
              when: "visited:cellar",
              talk: [
                "Du har varit nere i källaren? Så modigt!",
                "Du är nära, Nora… men något fattas.",
                "Har du undersökt allt? Både där nere och här uppe?",
              ],
            },
            {
              when: "reading-key",
              talk: ["Du hittade nyckeln! Och böckerna står i ABC-ordning. Tack!", "Läsrummet är bakom dörren uppe till vänster."],
            },
            {
              when: "talked-to-bodil",
              talk: ["Har du hittat några ledtrådar?", "Titta på golvet, på min disk… och prata med Pelle."],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: REVEAL_NEEDS,
          puzzleIntro: ["Nora! Har du löst mysteriet?", "Vem är det som flyttar mina böcker på nätterna?"],
        },
        l: {
          name: "Bodils lista",
          sprite: "libraryMissingList",
          on: "K",
          talk: [
            "En lista på disken. Överst står det: SAKNAS.",
            "ABC-boken. Min första bokstavsbok.",
            "Läsa är lätt. Rim och ramsor för små.",
            "Längst ner har Bodil skrivit: \"Varför bara de LÄTTA böckerna?\"",
          ],
          clue: "missingList",
        },
        v: {
          name: "Bokvagnen",
          sprite: "bookCart",
          talk: ["En bokvagn full med djurböcker, huller om buller.", "Något blänker längst ner… men det ligger så många böcker ovanpå."],
          talkIf: [{ when: "reading-key", talk: ["Böckerna står i ABC-ordning nu. Så fint!"] }],
          puzzle: "book-cart",
          puzzleWhen: "talked-to-bodil",
          puzzleIntro: ["Bokvagnen är full med djurböcker.", "Om de står i ABC-ordning hittar du kanske nyckeln!"],
        },
        p: {
          name: "Pelle",
          person: true,
          sprite: "pelle",
          talk: [
            "Hej! Jag heter Pelle. Jag läser här varje dag.",
            "Jag läser redan TJOCKA böcker, jag!",
            "Och vet du vad? Jag SÅG spöket i natt!",
            "Det svävade genom väggen med en bok i famnen. Uuuh!",
          ],
          clue: "pelleSaw",
          talkIf: [
            {
              when: "clue:pelleAdmits",
              talk: ["Förlåt att jag hittade på.", "Nästa gång säger jag bara det jag har sett själv!"],
            },
            {
              // Nora knows two things that don't fit with his story.
              when: ["clue:pelleSaw", "clue:locked", "clue:viskanSaw"],
              talk: [
                "Nora: \"Men Pelle! Biblioteket är ju LÅST på natten.\"",
                "Nora: \"Och Viskan kan inte ens bära en bok!\"",
                "Pelle blir röd om öronen.",
                "\"Okej… jag var inte här. Min kompis sa att hans syster såg spöket.\"",
                "\"Alla säger ju att det spökar! Så jag trodde att det var sant.\"",
              ],
              clue: "pelleAdmits",
            },
          ],
        },
        s: {
          name: "Skylt",
          sprite: "sign",
          talk: [
            "BIBLIOTEKET – öppet 10 till 18.",
            "På natten är dörren LÅST. Bara bibliotekarien har nyckel.",
            "(Tips: tryck B för att läsa i detektivboken!)",
          ],
          clue: "locked",
        },
      },
      clues: { "1": "messyBooks", "2": "eraserCrumbs" },
      onEnter: {
        name: "Ester",
        talk: [
          "Brr, vad tyst det är här…",
          "Hör du? Det prasslar i hyllorna. Som om böckerna rör sig!",
          "Vi pratar med bibliotekarien.",
        ],
      },
      // Something hides in the shelves. Before the cellar only the books rustle;
      // after the trail, short glimpses; after the reveal it hides in a shelf until Nora finds it.
      monsters: [
        {
          type: "crawler",
          sprite: "bladdra",
          routes: [
            [[5, 5], [12, 5]],
            [[8, 8], [13, 8]],
            [[4, 3], [11, 3]],
            [[17, 8], [17, 5]],
          ],
          shelters: [[2, 2], [8, 2], [2, 6], [6, 7], [14, 6]],
          unseenUntil: "clue:wormTrail",
          catchWhen: "solved",
        },
      ],
      doors: [
        { at: "top", to: "reading", requires: "reading-key", lockedText: "Dörren till läsrummet är låst." },
        // Up into the library tower – optional, only the secret egg is up there.
        { at: "right", to: "tower", stairs: "up" },
        { at: "bottom", lockedText: "Vi kan inte gå än. Vi har ett mysterium att lösa!" },
      ],
    },

    // The top of the tall tower on the library's right side. Optional: no clues, nothing needed.
    tower: {
      name: "Tornet",
      theme: "library",
      layout: [
        "####################",
        "#########w##########",
        "#####HH.....HH######",
        "#####........g######",
        "#####.........######",
        "#####..Kb.....######",
        "#####.........######",
        "#####.........######",
        "D.............######",
        "D.............######",
        "#####HH.......######",
        "####################",
      ],
      things: {
        w: {
          name: "Tornfönstret",
          sprite: "towerWindow",
          on: "#",
          talk: ["Vilken utsikt! Man ser ut över hela staden.", "Alla hus ser ut som små leksakshus härifrån."],
        },
        b: {
          name: "Den dammiga boken",
          sprite: "libraryBook",
          on: "K",
          talk: ["En tjock, gammal bok. Den är full av damm. ATJO!", "Den har nog ingen läst på hundra år."],
        },
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg, högst upp i tornet!", "Det är varmt… och det luktar gammal bok."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      onEnter: {
        name: "Ester",
        talk: ["Puh, vilken lång trappa! Nu är vi högst upp i tornet.", "Här uppe är det dammigt och alldeles tyst."],
      },
      doors: [{ at: "left", to: "hall", stairs: "down" }],
    },

    reading: {
      name: "Läsrummet",
      theme: "library",
      layout: [
        "####################",
        "####################",
        "#HHHH..HHHH..HHHHKm#",
        "D.1................#",
        "D..KK....KK....KK..#",
        "#..................#",
        "#.....HH.....HH....#",
        "#.....HH.....HH....#",
        "#..................#",
        "#..KK..........KK..#",
        "#..................#",
        "#####DD#############",
      ],
      things: {
        m: {
          name: "Boken om Månstenen",
          sprite: "moonstoneBook",
          on: "K",
          talk: [
            "En bok: \"Månstenen – stadens hemlighet\".",
            "Sidorna i mitten är utrivna!",
            "Kvar står bara: \"Månstenen sitter i klocktornet. Den håller monstren…\"",
            "Resten är borta.",
          ],
          clue: "moonBook",
        },
      },
      clues: { "1": "bookLine" },
      monsters: [
        {
          type: "flyer",
          sprite: "ugo",
          center: [10, 5],
          size: [7, 3],
          perch: [12, 3],
          perchSprite: "ugoRest",
          thing: {
            name: "Uppslagsboken Ugo",
            person: true,
            sprite: "ugoRest",
            talk: ["Jag är Uppslagsboken Ugo. Jag vet nästan allt!"],
            talkIf: [
              {
                when: "ugo-helped",
                talk: [
                  "Tack! Nu är mina ord rätt igen.",
                  "I natt kröp något över mina sidor. Något LÅNGT och MJUKT.",
                  "Det hade inga fötter. Men det hade glasögon!",
                  "Det bar en liten blå lampa. Sen kröp det iväg mot källaren.",
                  "Inget spöke, alltså. Spöken lyser ju själva!",
                ],
                clue: "ugoSaw",
              },
            ],
            puzzle: "spelling",
            puzzleIntro: [
              "KRASCH! Vem stör? Jag är Uppslagsboken Ugo!",
              "I natt väckte ett blått ljus mig. Nu kan jag inte sluta flyga!",
              "Och mina ord har blivit felstavade. Hjälp mig!",
            ],
          },
        },
        // A booklouse scurries along the floor now and then. Harmless – but it IS something that crawls.
        {
          type: "crawler",
          sprite: "libraryBooklouse",
          routes: [
            [[2, 5], [8, 5]],
            [[9, 8], [16, 8]],
            [[4, 10], [12, 10]],
          ],
        },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          "Nora, akta! En bok som FLYGER!",
          "Är det den som flyttar böckerna?",
          "Göm dig bakom hyllor och bord om den dyker!",
          "Om den missar dig två gånger blir den nog trött och vilar. Då kan vi prata med den!",
        ],
      },
      doors: [
        { at: "bottom", to: "hall" },
        {
          at: "left",
          to: "cellar",
          stairs: "down",
          requires: "cellar-open",
          puzzle: "rhyme-lock",
          lockedText: "Nere i trappan sitter källardörren. Den har ett gammalt lås med ord på.",
        },
      ],
    },

    cellar: {
      name: "Källaren",
      theme: "storage",
      layout: [
        "####################",
        "#LL.x............LL#",
        "#L...............L.D",
        "#.....LL......LL...D",
        "#..c..LL......LL...#",
        "#..................#",
        "#..................#",
        "#..........~~......#",
        "#...LL..........LL.#",
        "#.2.LL...f......LL.#",
        "#.......1..........#",
        "####################",
      ],
      things: {
        c: {
          name: "Den gamla kistan",
          sprite: "libraryChest",
          talk: ["En gammal kista, full av damm.", "Locket skramlar… Är det någon där inne?"],
          gives: "opened-chest",
          talkIf: [{ when: "emerged:viskanGhost", talk: ["Kistan är tom nu.", "Det är iskallt runt den."] }],
        },
        f: {
          name: "Bokborgen",
          sprite: "bladdraFort",
          talk: [
            "En borg byggd av böcker!",
            "Alla böcker är hela. De ligger uppslagna på första sidan: A, B, C…",
            "I mitten lyser golvet svagt blått.",
            "Här har någon legat och läst – med en lampa.",
          ],
          clue: "bookFort",
        },
        x: {
          name: "Det mörka hörnet",
          sprite: "shadowEyes",
          spriteIf: [{ when: "note-read", sprite: "darkCorner" }],
          talk: ["Två glödande ögon blinkar i hörnet…", "…och så är de borta.", "På väggen sitter en lapp med konstig skrift."],
          talkIf: [
            {
              when: "note-read",
              talk: ["\"Jag behöver ljuset.\" Och så ett S.", "Vem är S? Och vilket ljus?", "Brr. Det är iskallt i hörnet."],
              clue: "skuggaNote",
            },
          ],
          puzzle: "mirror-note",
          puzzleIntro: [
            "Två glödande ögon blinkar… och är borta!",
            "På väggen sitter en lapp. Skriften är spegelvänd!",
            "Läs den baklänges. Vad står det?",
          ],
        },
      },
      clues: { "1": "wormTrail", "2": "practiceSheet" },
      monsters: [
        {
          type: "sneaker",
          sprite: "viskanGhost",
          home: [3, 4],
          calmWhen: "clue:viskanSaw",
          hideUntil: { when: "opened-chest", delay: 2.5 },
          thing: {
            name: "Viskan",
            person: true,
            sprite: "viskanGhost",
            talk: [
              "Psssst… Nooooraaaa… Vi ses igen!",
              "Alla säger att JAG tar böckerna. Det är inte sant!",
              "Titta: jag kan inte bära något. Allt ramlar rakt igenom mig.",
              "Men på nätterna hör jag någon här nere.",
              "Den läser jättelångsamt: \"B… O… K…\" Och så suckar den: \"Det är så svårt…\"",
            ],
            clue: "viskanSaw",
            talkIf: [
              {
                when: "clue:viskanSaw",
                talk: ["Hitta den som läser, Nora.", "Men var snäll. Den låter så ledsen."],
              },
            ],
          },
        },
        {
          type: "patroller",
          sprite: "dammis",
          cry: "ATJOO!",
          path: [[1, 6], [18, 6]],
          speed: 40,
        },
        // Once Nora has seen the trail, something long and green scuttles by now and then.
        {
          type: "crawler",
          sprite: "bladdra",
          routes: [
            [[12, 10], [17, 10]],
            [[11, 8], [14, 8]],
            [[1, 10], [6, 10]],
          ],
          unseenUntil: "clue:wormTrail",
        },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          "Usch, vad mörkt det är här nere…",
          "Det luktar gammalt papper här. Mmm… jag älskar böcker.",
          "Mamma kallar mig bokmal, för att jag läser så mycket. Hihi.",
          "Akta dig för den där dammtussen! Smit förbi när den vänder.",
        ],
      },
      doors: [{ at: "right", to: "reading", stairs: "up" }],
    },
  },

  puzzles: {
    "book-cart": {
      type: "order",
      title: "Bokvagnen",
      text: ["Ställ böckerna i ABC-ordning!", "Kom ihåg: Å, Ä och Ö kommer allra sist."],
      // Four random animal books each game – often with Å, Ä or Ö.
      alphabetize: {
        words: ["Apan", "Björnen", "Draken", "Grodan", "Katten", "Musen", "Ormen", "Tigern", "Åsnan", "Älgen", "Ödlan"],
        pick: 4,
        sprite: "libraryBook",
      },
      options: [],
      answer: [],
      gives: "reading-key",
    },
    spelling: {
      type: "choice",
      title: "Ugos ord",
      text: ["Böckerna står på en …", "Vilket ord är rätt stavat?"],
      options: [
        { id: "right", label: "hylla" },
        { id: "w1", label: "hyla" },
        { id: "w2", label: "hilla" },
        { id: "w3", label: "hylle" },
      ],
      answer: "right",
      wrong: "Nästan! Titta noga på varje bokstav.",
      // Ugo has lost the spelling of one of his words – a new one each game.
      variants: [
        {
          text: ["Böckerna står på en …", "Vilket ord är rätt stavat?"],
          options: [
            { id: "right", label: "hylla" },
            { id: "w1", label: "hyla" },
            { id: "w2", label: "hilla" },
            { id: "w3", label: "hylle" },
          ],
          answer: "right",
          hint: "Ordet har två L i mitten: hy-lla.",
        },
        {
          text: ["Under biblioteket finns en …", "Vilket ord är rätt stavat?"],
          options: [
            { id: "right", label: "källare" },
            { id: "w1", label: "kälare" },
            { id: "w2", label: "tjällare" },
            { id: "w3", label: "källere" },
          ],
          answer: "right",
          hint: "Det börjar på K, har två L och slutar på -are.",
        },
        {
          text: ["Det svävar och säger BUU. Det är ett …", "Vilket ord är rätt stavat?"],
          options: [
            { id: "right", label: "spöke" },
            { id: "w1", label: "spöcke" },
            { id: "w2", label: "spöge" },
            { id: "w3", label: "spökke" },
          ],
          answer: "right",
          hint: "Spö-ke. Bara ett K, och inget C!",
        },
        {
          text: ["Här lånar man böcker. Det är ett …", "Vilket ord är rätt stavat?"],
          options: [
            { id: "right", label: "bibliotek" },
            { id: "w1", label: "biblotek" },
            { id: "w2", label: "bibilotek" },
            { id: "w3", label: "bibliotäk" },
          ],
          answer: "right",
          hint: "Säg det långsamt: bi-bli-o-tek.",
        },
        {
          text: ["A, B och C är tre …", "Vilket ord är rätt stavat?"],
          options: [
            { id: "right", label: "bokstäver" },
            { id: "w1", label: "bockstäver" },
            { id: "w2", label: "bokstever" },
            { id: "w3", label: "bokstävar" },
          ],
          answer: "right",
          hint: "Det är \"bok\" och \"stäver\" ihop: bok-stäver.",
        },
      ],
      gives: "ugo-helped",
    },
    "rhyme-lock": {
      type: "match",
      title: "Rimlåset",
      text: ["På källardörren sitter ett gammalt lås.", "\"Para ihop orden som rimmar!\""],
      // Four random pairs each game. No two pairs rhyme with each other.
      pairs: [
        ["bok", "klok"],
        ["katt", "hatt"],
        ["mus", "hus"],
        ["sol", "stol"],
        ["fisk", "disk"],
        ["bil", "pil"],
        ["orm", "storm"],
        ["hund", "rund"],
        ["get", "het"],
        ["säng", "äng"],
      ],
      pick: 4,
      gives: "cellar-open",
    },
    "mirror-note": {
      type: "choice",
      title: "Lappen i spegelskrift",
      text: ["JAG BEHÖVER LJUSET.", "SNART HAR JAG ALLA.", "/ S"],
      mirror: true,
      options: [
        { id: "right", label: "Jag behöver ljuset. Snart har jag alla." },
        { id: "w1", label: "Jag behöver ljudet. Snart har jag alla." },
        { id: "w2", label: "Jag behöver ljuset. Snart tar jag alla." },
        { id: "w3", label: "Jag behöver lusen. Snart har jag alla." },
      ],
      answer: "right",
      wrong: "Nästan! Läs varje ord noga – baklänges.",
      // The second line changes every game, and one word differs in each wrong answer.
      variants: [
        {
          text: ["JAG BEHÖVER LJUSET.", "SNART HAR JAG ALLA.", "/ S"],
          options: [
            { id: "right", label: "Jag behöver ljuset. Snart har jag alla." },
            { id: "w1", label: "Jag behöver ljudet. Snart har jag alla." },
            { id: "w2", label: "Jag behöver ljuset. Snart tar jag alla." },
            { id: "w3", label: "Jag behöver lusen. Snart har jag alla." },
          ],
          answer: "right",
          hint: "Första raden: JAG BEHÖVER LJ-U-S-ET. Andra raden börjar: SNART HAR…",
        },
        {
          text: ["JAG BEHÖVER LJUSET.", "LETA INTE EFTER MIG.", "/ S"],
          options: [
            { id: "right", label: "Jag behöver ljuset. Leta inte efter mig." },
            { id: "w1", label: "Jag behöver ljuset. Leta inte efter mat." },
            { id: "w2", label: "Jag behöver huset. Leta inte efter mig." },
            { id: "w3", label: "Jag behöver ljuset. Lek inte med mig." },
          ],
          answer: "right",
          hint: "Första raden: JAG BEHÖVER LJ-U-S-ET. Andra raden slutar: …EFTER MIG.",
        },
        {
          text: ["JAG BEHÖVER LJUSET.", "BITARNA ÄR MINA.", "/ S"],
          options: [
            { id: "right", label: "Jag behöver ljuset. Bitarna är mina." },
            { id: "w1", label: "Jag behöver ljuset. Bitarna är dina." },
            { id: "w2", label: "Jag behöver ljudet. Bitarna är mina." },
            { id: "w3", label: "Jag behöver ljuset. Bullarna är mina." },
          ],
          answer: "right",
          hint: "Första raden: JAG BEHÖVER LJ-U-S-ET. Andra raden: BITARNA ÄR M…",
        },
        {
          text: ["JAG BEHÖVER LJUSET.", "DET ÄR SÅ MÖRKT HÄR.", "/ S"],
          options: [
            { id: "right", label: "Jag behöver ljuset. Det är så mörkt här." },
            { id: "w1", label: "Jag behöver ljuset. Det är så mjukt här." },
            { id: "w2", label: "Jag behöver lusen. Det är så mörkt här." },
            { id: "w3", label: "Jag behöver ljuset. Det är så varmt här." },
          ],
          answer: "right",
          hint: "Första raden: JAG BEHÖVER LJ-U-S-ET. Andra raden: DET ÄR SÅ M-Ö-R-K-T HÄR.",
        },
      ],
      gives: "note-read",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: "Vem är det som flyttar böckerna på nätterna?",
          options: [
            { id: "viskan", label: "Viskan", sprite: "viskanGhost" },
            { id: "pelle", label: "Pelle", sprite: "pelle" },
            { id: "bodil", label: "Bodil Bok", sprite: "bodil" },
            { id: "ugo", label: "Uppslagsboken Ugo", sprite: "ugo" },
            { id: "worm", label: "En bokmal", sprite: "bladdra" },
          ],
          answer: "worm",
          // What it looked like (reading room) and the trail it left (cellar).
          proof: ["ugoSaw", "wormTrail"],
          missing: {
            ugoSaw: "Någon i läsrummet såg den i natt, på riktigt nära håll. Vad sa hen?",
            wormTrail: "Vilka spår fanns i dammet i källaren? Var det fotspår?",
          },
          whyNot: {
            viskan: "Viskan kan inte bära något – allt ramlar rakt igenom henne! Och hon svävar, så hon lämnar inga spår i dammet.",
            pelle: "Den som kom hade inga fötter – spåret i källaren var inga fotspår. Och på natten är biblioteket låst!",
            bodil: "Bodil har glasögon, precis som den Ugo såg. Men Bodil har fötter! Spåret i källaren var inga fotspår.",
            ugo: "Ugo flyger – han kryper inte. Och han såg själv den som kröp över hans sidor!",
          },
          why: {
            whispers: "Viskningarna lät som ett spöke. Men Bodil hörde dem bara genom golvet. Hon såg inte vem det var.",
            messyBooks: "Böckerna på golvet visar att NÅGON har varit här. Men inte vem.",
            eraserCrumbs: "Smulorna kom från ett suddgummi. Ett suddgummi kan vem som helst ha – det visar inte vem det var.",
            missingList: "Listan visar VILKA böcker som försvann – inte vem som tog dem. Spara den till nästa fråga!",
            locked: "Skylten visar att ingen kunde komma IN på natten. Så den som flyttade böckerna fanns nog redan i huset. Men vem?",
            pelleSaw: "Kunde Pelle ens vara här i natt? Biblioteket var ju låst! Han hade bara hört det av andra.",
            pelleAdmits: "Pelle erkände att han inte såg något själv. Då vet han inte vem det var.",
            bookLine: "Raden av böcker visar VART de tog vägen – ner i källaren. Men inte vem som bar dem.",
            moonBook: "Sidorna om Månstenen… det är nog ett annat mysterium!",
            practiceSheet: "Pappret visar att någon övar på bokstäver. Men inte hur den ser ut! Spara det till nästa fråga.",
            bookFort: "Borgen visar var böckerna hamnade. Men inte vem som byggde den.",
            viskanSaw: "Viskan visar att det inte är hon – allt ramlar igenom henne. Men hon HÖRDE bara någon. Hon såg inte hur den såg ut.",
            skuggaNote: "Lappen från S… det är nog ett annat mysterium!",
          },
        },
        {
          question: "Varför tar bokmalen böckerna?",
          options: [
            { id: "eat", label: "För att äta upp dem" },
            { id: "nest", label: "För att bygga ett bo" },
            { id: "read", label: "För att lära sig läsa" },
            { id: "scare", label: "För att skrämmas" },
            { id: "tear", label: "För att riva ut sidor" },
          ],
          answer: "read",
          // Only the easy books went missing (hall), and in the cellar: B O K practised on paper,
          // ABC books opened at the first page, and Viskan heard someone sound out letters.
          proof: ["missingList", "practiceSheet", "bookFort", "viskanSaw"],
          missing: {
            missingList: "Vilka sorts böcker försvann? Titta på Bodils disk.",
            practiceSheet: "Någon har övat på något i källaren. Vad låg på golvet?",
            bookFort: "Hur låg böckerna i borgen? På vilken sida var de uppslagna?",
            viskanSaw: "Någon i källaren hör vad som sägs där nere på nätterna. Vad sa hen?",
          },
          whyNot: {
            eat: "Ingen bok var uppäten – böckerna i borgen var hela! Och smulorna kom från ett suddgummi.",
            nest: "Böckerna i borgen låg uppslagna på A, B, C – som när man läser. Inte som ett bo!",
            scare: "Det var inget spökljud. Viskan hörde någon ljuda: B… O… K… och sucka att det var svårt.",
            tear: "Böckerna i borgen var hela. Bara boken om Månstenen saknade sidor – och den tog bokmalen inte ens med sig.",
          },
          why: {
            whispers: "Ja, det var nog någon som ljudade! Men genom golvet lät det bara som \"Buuu… ooo…\". Vem hörde orden på nära håll?",
            messyBooks: "Böckerna på golvet visar att de har flyttats – men inte varför.",
            eraserCrumbs: "Smulorna kom från ett suddgummi! Men det är pappret i källaren som visar VAD någon suddade och övade på.",
            locked: "Att biblioteket är låst säger inget om VARFÖR.",
            pelleSaw: "Pelle såg inte ens något själv!",
            pelleAdmits: "Pelle erkände att han hittade på. Det säger inget om varför böckerna försvann.",
            ugoSaw: "Ugo såg HUR den såg ut. Men inte varför den tog böckerna.",
            bookLine: "Raden av böcker visar vart de tog vägen – men inte varför.",
            moonBook: "Boken om Månstenen försvann inte – den står kvar i läsrummet. Det är ett annat mysterium!",
            wormTrail: "Spåret visar VAD det är – men inte VARFÖR.",
            skuggaNote: "Lappen är från S. Det är ett annat mysterium!",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    whispers: {
      name: "Viskningar på natten",
      sprite: "bodil",
      text: "Bodil bor en trappa upp. På nätterna hör hon viskningar från biblioteket: \"Buuu… ooo…\" Som ett spöke!",
    },
    messyBooks: {
      name: "Böcker på golvet",
      sprite: "messyBooks",
      text: "Böcker ligger huller om buller på golvet. Har de flugit hit av sig själva?",
    },
    eraserCrumbs: {
      name: "Rosa smulor",
      sprite: "eraserCrumbs",
      text: "Små rosa smulor på golvet vid Pelles bord. Har någon TUGGAT på något?",
    },
    missingList: {
      name: "Bodils lista",
      sprite: "libraryMissingList",
      text: "SAKNAS: ABC-boken, Min första bokstavsbok, Läsa är lätt, Rim och ramsor för små. Bodil undrar: varför bara de LÄTTA böckerna?",
    },
    locked: {
      name: "Låst på natten",
      sprite: "key",
      text: "Skylten: biblioteket är LÅST på natten. Bara bibliotekarien Bodil har nyckel.",
    },
    pelleSaw: {
      name: "Pelles vittnesmål",
      sprite: "pelle",
      text: "Pelle säger att han SÅG spöket i natt. Det svävade genom väggen med en bok i famnen!",
    },
    pelleAdmits: {
      name: "Pelle erkänner",
      sprite: "pelle",
      text: "Pelle var inte här i natt. Han hade bara HÖRT om spöket av en kompis. Alla sa det – så han trodde det.",
    },
    ugoSaw: {
      name: "Ugos vittnesmål",
      sprite: "ugoRest",
      text: "Något långt och mjukt kröp över Ugo i natt. Inga fötter, men glasögon! Det bar en blå lampa och kröp iväg mot källaren.",
    },
    bookLine: {
      name: "Böcker i en rad",
      sprite: "bookTrail",
      text: "Böcker ligger i en rad fram till källardörren. Någon har burit ner dem i källaren!",
    },
    moonBook: {
      name: "Boken om Månstenen",
      sprite: "moonstoneBook",
      text: "En bok om Månstenen i klocktornet, som håller monstren… Sidorna i mitten är utrivna!",
    },
    wormTrail: {
      name: "Slingrigt spår",
      sprite: "bladdraTrail",
      text: "Ett långt, slingrigt spår i dammet. Inga fotspår alls! Vad kan ha gjort ett sådant spår?",
    },
    practiceSheet: {
      name: "Övningspappret",
      sprite: "bladdraPractice",
      text: "Någon har skrivit B O K om och om igen. Några bokstäver är spegelvända och bortsuddade. Bredvid ligger ett rosa suddgummi som smular!",
    },
    bookFort: {
      name: "Bokborgen",
      sprite: "bladdraFort",
      text: "En borg av böcker i källaren. Alla är hela och ligger uppslagna på första sidan: A, B, C… I mitten lyser golvet svagt blått.",
    },
    viskanSaw: {
      name: "Viskans vittnesmål",
      sprite: "viskanGhost",
      text: "Viskan kan inte bära något – allt ramlar igenom henne. På nätterna hör hon någon läsa jättelångsamt: \"B… O… K…\" och sucka: \"Det är så svårt…\"",
    },
    skuggaNote: {
      name: "Lappen i spegelskrift",
      sprite: "cellarMirrorNote",
      text: "En lapp i källarens mörkaste hörn: \"Jag behöver ljuset. / S\" Två glödande ögon blinkade – sen var de borta.",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    "reading-key": { name: "Nyckeln till läsrummet", sprite: "key" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    moonshard: { name: "Den lysande biten", sprite: "moonShard" },
  },

  finale: [
    { say: "Nora", lines: ["Hittade dig!", "En bokmal… med glasögon!"] },
    {
      say: "Bläddra",
      lines: [
        "F-förlåt! Snälla, bli inte arga…",
        "Jag heter Bläddra. Jag bor i källaren.",
        "Alla här kan läsa. Utom jag.",
        "Så på nätterna lånade jag böcker och övade. B… O… K…",
        "Men det är så SVÅRT. Jag trodde aldrig att jag skulle lära mig.",
      ],
    },
    {
      say: "Bodil Bok",
      lines: [
        "Men lilla vän! Alla kan lära sig läsa.",
        "Det tar bara lite tid. Och man får be om hjälp.",
        "Du ska få ett eget lånekort. Och vi läser tillsammans varje dag!",
      ],
    },
    // Viskan floats up from the cellar, in through the door to the reading room.
    { enter: "viskan", sprite: "viskanGhost", from: [6, 1], to: [15, 8] },
    { say: "Viskan", lines: ["Hihihi… Så det var inte jag. Det sa jag ju!", "Får jag också vara med? Jag älskar spökhistorier."] },
    {
      say: "Bläddra",
      lines: ["Tack… Och förlåt att jag lånade utan att fråga.", "Då behöver jag inte min läslampa längre. Jag hittade den i källaren."],
    },
    { reveal: "culprit", sprite: "moonShard" },
    { say: "Ester", lines: ["Nora, titta! Den lyser precis som biten från Grymlans hand!"] },
    {
      say: "Nora",
      lines: [
        "En bit till… av Månstenen?",
        "Och lappen i källaren: \"Jag behöver ljuset.\"",
        "Någon letar efter de här bitarna. Mysteriet är inte slut än…",
      ],
    },
    { give: "moonshard" },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    "Pelle hade bara hört ryktet. Och Viskan kan inte bära en bok – allt ramlar igenom henne. Det var inget spöke!",
    "Ugo såg något långt och mjukt med glasögon, men utan fötter. I källaren fanns ett slingrigt spår utan fotspår. Det var en bokmal!",
    "Biblioteket var låst på natten. Men Bläddra behövde ingen nyckel – hen bodde ju redan i källaren.",
    "Bodils lista: bara de LÄTTA böckerna försvann. Och i borgen låg de uppslagna på A, B, C.",
    "Övningspappret och Viskan visade resten: Bläddra övade på B… O… K… och tyckte att det var så svårt.",
    "Spökviskningarna Bodil hörde var Bläddra som ljudade. Och de rosa smulorna kom från hens suddgummi!",
  ],

  fact: "En \"bokmal\" är någon som älskar att läsa! Men i gamla böcker kan det bo riktiga småkryp: boklöss. De är mindre än ett riskorn och äter mögel och lim – inte orden.",

  cards: [
    { sprite: "bladdra", name: "Bokmalen Bläddra", text: "En bokmal med runda glasögon. Kryper in i hyllorna och ljudar bokstäver. Snart kan hen läsa!" },
    { sprite: "ugo", name: "Uppslagsboken Ugo", text: "En uppslagsbok som vaknade och började flyga. Dyker mot den som stör – göm dig bakom en hylla!" },
    { sprite: "dammis", name: "Dammis", text: "En jättestor dammtuss med röda ögon. Rullar fram och tillbaka i källaren. Smit förbi när den vänder!" },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-bodil",
      hints: [
        "Bodil är bibliotekarie. Hon står vid disken.",
        "Gå fram till Bodil och tryck Ctrl.",
        "Bodil har röda glasögon och lila kofta. Hon står uppe till höger.",
      ],
    },
    {
      text: "Leta efter ledtrådar i biblioteket",
      doneWhen: HALL_CLUES,
      hints: [
        { text: "Ledtrådar glöder lite. Titta noga på golvet!", skipWhen: ["clue:messyBooks", "clue:eraserCrumbs"] },
        { text: "Något ligger på Bodils disk. Vad saknas?", skipWhen: "clue:missingList" },
        { text: "Pojken vid bordet läser här varje dag. Prata med honom!", skipWhen: "clue:pelleSaw" },
        { text: "Läs skylten vid dörren längst ner.", skipWhen: "clue:locked" },
        { text: "Titta vid Pelles bord. Ligger det något på golvet?", skipWhen: "clue:eraserCrumbs" },
      ],
    },
    {
      text: "Ta dig in i läsrummet",
      doneWhen: "visited:reading",
      hints: [
        { text: "Läsrummet är bakom dörren uppe till vänster. Men den är låst…", skipWhen: "reading-key" },
        { text: "Bodil sa att nyckeln ligger på bokvagnen.", skipWhen: "reading-key" },
        {
          text: "Ställ böckerna i ABC-ordning. A kommer först – och Å, Ä, Ö kommer allra sist!",
          skipWhen: "reading-key",
        },
        { text: "Du har nyckeln! Gå in genom dörren uppe till vänster.", when: "reading-key" },
      ],
    },
    {
      text: "Undersök läsrummet",
      doneWhen: READING_CLUES,
      hints: [
        "Göm dig bakom en hylla eller ett bord när boken dyker!",
        {
          text: "Om den flygande boken missar dig två gånger blir den trött och vilar på en hylla. Då kan du prata med den!",
          skipWhen: "ugo-helped",
        },
        { text: "Hjälp Ugo med hans ord: {spelling:hint}", skipWhen: "ugo-helped" },
        { text: "Nu vill Ugo berätta något. Göm dig tills han blir trött och vilar – prata sen med honom igen!", when: "ugo-helped", skipWhen: "clue:ugoSaw" },
        { text: "Det står en bok på ett ställ uppe till höger.", skipWhen: "clue:moonBook" },
        { text: "Titta på golvet nära trappan till vänster.", skipWhen: "clue:bookLine" },
      ],
    },
    {
      text: "Ta dig ner i källaren",
      doneWhen: "visited:cellar",
      hints: [
        { text: "Trappan till källaren är till vänster. Källardörren har ett lås med ord.", skipWhen: "cellar-open" },
        { text: "Ord som rimmar slutar likadant. Bok – klok!", skipWhen: "cellar-open" },
        { text: "Säg orden högt! Katt rimmar på hatt, och sol rimmar på stol.", skipWhen: "cellar-open" },
        { text: "Låset är öppet! Gå ner för trappan till vänster.", when: "cellar-open" },
      ],
    },
    {
      text: "Undersök källaren",
      doneWhen: CELLAR_CLUES,
      hints: [
        "Akta dig för dammtussen! Vänta tills den har rullat förbi.",
        { text: "Titta noga på golvet längst ner.", skipWhen: ["clue:wormTrail", "clue:practiceSheet"] },
        { text: "Något är byggt av böcker. Undersök det!", skipWhen: "clue:bookFort" },
        { text: "Knacka på den gamla kistan… om du vågar!", skipWhen: "emerged:viskanGhost" },
        {
          text: "Viskan står still när du tittar på henne. Gå fram medan du tittar – och prata med henne!",
          when: "emerged:viskanGhost",
          skipWhen: "clue:viskanSaw",
        },
        { text: "Något blinkar i det mörka hörnet uppe till vänster.", skipWhen: "note-read" },
        { text: "Lappen är spegelvänd. Läs bokstäverna från höger till vänster! {mirror-note:hint}", skipWhen: "note-read" },
      ],
    },
    {
      text: "Vem flyttar böckerna – och varför?",
      doneWhen: "solved",
      hints: [
        {
          text: "Pelle sa att han SÅG spöket. Kan det verkligen stämma? Fråga honom igen!",
          when: ["clue:pelleSaw", "clue:locked", "clue:viskanSaw"],
          skipWhen: "clue:pelleAdmits",
        },
        "Berätta för Bodil vad du har kommit fram till.",
        "Hur såg den ut som kröp över Ugo i natt? Och vilka spår fanns i källaren?",
        "Vilka sorts böcker försvann? Och vad övade någon på i källaren? Titta i detektivboken (B)!",
      ],
    },
    {
      text: "Hitta den som gömmer sig!",
      doneWhen: "caught",
      hints: [
        "Den skyldige gömmer sig någonstans i biblioteket.",
        "Titta noga – på vilken hylla skakar böckerna?",
        "Gå fram till hyllan där böckerna skakar och tryck Ctrl!",
      ],
    },
  ],
};
