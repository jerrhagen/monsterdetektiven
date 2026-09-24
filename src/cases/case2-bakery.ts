import type { Case } from "./types";

// Case 2 – "Vem tog bullarna?": Berit's buns are gone, and one of them glowed.
// SPOILER: the solution and how the clues fit together are described in DESIGN.md.
//
// Built as a "theory ladder": every room changes what Nora believes.
//   Bakery: "Måns? Gustav? Berit herself?" – cat hairs, Gustav at the window, a half-eaten bun,
//           and a strange tuft of blue fluff in the cat flap. Smulan is only a name on the board ("always asks nicely").
//   Yard:   "Not a person, not the cat" – three-toed prints; Gustav's tracks show a cat has FOUR toes;
//           Gustav saw something small carrying a glowing bun down into the cellar (early morning, still dark).
//   Cellar: "The ghost? Gustav's black boots?" – then glowing crumbs lead to a nest of blue fluff: SMULANS HEM.
//           The black prints walk into the wall: not Gustav's boots, but the red thread (Skuggan).
// The reveal asks who (everything that ties the thief to Smulan: fluff, prints, Gustav, glowing crumbs, nest)
// and why (everything about the glowing bun: Berit, Gustav, the glowing crumbs).
// Truth not said in the finale: the thief got out through the cat flap (the door was locked), the crumbs in
// Måns's bowl fell when Smulan ran past, the cat hairs are from Måns's daily cream, Berit's bun was her own fika.
// Ending: Nora bakes fresh buns from Berit's recipe, and the smell lures Smulan out of the bread shelves.

const BAKERY_CLUES = ["clue:crumbs", "clue:catHair", "clue:blueFluff", "clue:regulars", "clue:beritBun"];
const YARD_CLUES = ["clue:mudPrints", "clue:catBowl", "clue:gustavBoots", "clue:gustavSaw"];
const CELLAR_CLUES = ["clue:flourGhost", "clue:blackPrints", "clue:glowCrumbs", "clue:nest"];
/** Every clue of the case (so every proof clue too) – the reveal opens when the book is full. */
const ALL_CLUES = [...BAKERY_CLUES, "clue:glowBun", "clue:gustavWindow", ...YARD_CLUES, ...CELLAR_CLUES];

export const case2: Case = {
  id: "bakery",
  number: 2,
  title: "Vem tog bullarna?",
  startRoom: "bakery",
  intro: [
    "Bagaren Berit ringde till detektivbyrån.",
    "\"Nora! Mina bullar är borta!\"",
    "\"Och en av dem… den LYSTE!\"",
    "Nora och Ester skyndar till bageriet…",
  ],

  rooms: {
    bakery: {
      name: "Bageriet",
      theme: "bakery",
      layout: [
        "##############DD####",
        "##############..####",
        "##OOtHHHH.HHHH.3r###",
        "##OO....2........###",
        "##..........b..1.###",
        "##.........KKKc..###",
        "##...............###",
        "##...............###",
        "##.HH............###",
        "##.HH.........HH.###",
        "##........N...HH.###",
        "#########DD#########",
      ],
      things: {
        b: {
          name: "Bagaren Berit",
          sprite: "berit",
          person: true,
          talk: [
            "Nora! Tack och lov att du kom!",
            "Jag bakade en hel plåt bullar tidigt i morse.",
            "En av dem LYSTE när den kom ut ur ugnen. Som en liten lampa!",
            "Nu är den borta. Och många andra också!",
            "Grannen Gustav tittade in genom fönstret i morse… Han ÄLSKAR bullar.",
            "Kan du leta efter ledtrådar här i bageriet?",
          ],
          gives: "talked-to-berit",
          clue: ["glowBun", "gustavWindow"],
          talkIf: [
            {
              when: "caught",
              talk: ["Tack, Nora! Och välkommen, Smulan!", "Nu har jag den bästa bagarhjälpen i hela stan."],
            },
            {
              when: "solved",
              talk: [
                "Smulan!? Lilla Smulan som alltid frågar så snällt…",
                "Hen är nog jättehungrig. Och rädd.",
                "Jag vet! Vi bakar nya bullar. Doften lockar fram hen!",
                "Receptet ligger på bakbordet vid ugnen.",
              ],
            },
            {
              when: ["talked-to-berit", "clue:nest"],
              talk: [
                "Nora! Något blått kilade just förbi bröden!",
                "Du är nära, tror jag. Men något fattas…",
                "Har du undersökt allt? Här, på gården och i källaren?",
              ],
            },
            {
              when: ["talked-to-berit", "visited:yard"],
              talk: ["Vad hittade du på gården?", "Akta dig för Måns. Han blir sur om man väcker honom!"],
            },
            {
              when: ["talked-to-berit", "backdoor-open"],
              talk: ["Du fick upp dörren! Så klok du är.", "Gården är på andra sidan."],
            },
            {
              when: "talked-to-berit",
              talk: [
                "Har du hittat några ledtrådar?",
                "Dörren till gården är låst. Koden… den har jag glömt!",
                "Men jag skrev en lapp vid låset.",
              ],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: ALL_CLUES,
          puzzleIntro: ["Nora! Där är du!", "Vet du vem som tog mina bullar?"],
        },
        r: {
          name: "Stamkundstavlan",
          sprite: "bakeryBoard",
          talk: [
            "BERITS STAMKUNDER:",
            "Gustav – tre kanelbullar varje morgon.",
            "Måns – en skvätt grädde. (Han är ju en katt.)",
            "Smulan – ett litet monster. Frågar alltid snällt efter smulor.",
          ],
          clue: "regulars",
        },
        c: {
          name: "Berits kaffekopp",
          sprite: "bakeryCoffee",
          on: "K",
          talk: ["Berits kaffekopp… och en halvuppäten bulle!", "Har Berit ätit av bullarna själv?"],
          clue: "beritBun",
        },
        t: {
          name: "Bakbordet",
          sprite: "bakeryDough",
          talk: ["Berits bakbord. Här gör hon degen.", "Degskålen är tom. Bara lite mjöl kvar."],
          talkIf: [
            { when: "caught", talk: ["Det luktar fortfarande nybakat. Mmm!"] },
            {
              when: "fresh-buns",
              talk: [
                "Plåten åker in i den varma ugnen…",
                "PLING! Nybakade bullar!",
                "Mmm… doften sprider sig i hela bageriet.",
              ],
              gives: "caught",
            },
          ],
          puzzle: "recipe",
          puzzleWhen: "solved",
          puzzleIntro: ["Berits bullrecept ligger på bordet.", "Nu bakar vi! Doften lockar nog fram Smulan."],
        },
      },
      clues: { "1": "crumbs", "2": "catHair", "3": "blueFluff" },
      onEnter: {
        name: "Ester",
        talk: [
          "Mmm, det luktar bullar!",
          "Men… hörde du? Det prasslade bland bröden.",
          "Vi måste prata med Berit.",
        ],
      },
      // Something hides among the bread. Only rustling at first – after the nest, quick blue glimpses.
      monsters: [
        {
          type: "crawler",
          sprite: "smulan",
          routes: [
            [[4, 3], [9, 3]],
            [[10, 3], [16, 3]],
            [[2, 5], [2, 7], [5, 7]],
            [[13, 8], [16, 8], [16, 10]],
          ],
          shelters: [[5, 2], [11, 2], [3, 8], [14, 9]],
          unseenUntil: "clue:nest",
        },
      ],
      doors: [
        {
          at: "top",
          to: "yard",
          requires: "backdoor-open",
          puzzle: "bun-count",
          lockedText: "Dörren till gården har ett kodlås. Längst ner finns en liten kattlucka.",
        },
        { at: "bottom", lockedText: "Vi kan inte gå än. Vi har ett mysterium att lösa!" },
      ],
    },

    yard: {
      name: "Bakgården",
      theme: "yard",
      layout: [
        "####################",
        "#TT......T.......g.#",
        "#T..SSSS.T~~~~~~...#",
        "#...SS1S.T.........#",
        "#...SSSS.T....~~~~~#",
        "#........T.........#",
        "#T.......T...k.....#",
        "#.........~~~~~~~..#",
        "#..................#",
        "D..................#",
        "D.........TT...T.TT#",
        "######DD############",
      ],
      things: {
        g: {
          name: "Grannen Gustav",
          sprite: "gustav",
          person: true,
          talk: [
            "Hej! Jag är Gustav. Jag bor bredvid.",
            "Bullar? Mmm, jag ÄLSKAR Berits bullar!",
            "Men jag tar aldrig utan att fråga. Jag väntar tills hon öppnar.",
            "Titta, mina nya svarta stövlar! Fina, va?",
            "Jag såg något konstigt i morse… Men först: är du en riktig detektiv?",
          ],
          gives: "talked-to-gustav",
          clue: "gustavBoots",
          talkIf: [
            { when: "caught", talk: ["Jag hörde att Smulan ska hjälpa Berit nu!", "Då blir det ännu fler bullar. Hurra!"] },
            { when: "solved", talk: ["Så det var Smulan! Stackarn var nog bara hungrig."] },
            {
              when: "tracks-solved",
              talk: [
                "Du ÄR en riktig detektiv!",
                "Tidigt i morse, när det fortfarande var mörkt, såg jag något litet och runt springa över gården.",
                "Det var för mörkt för att se färgen…",
                "…men det bar på en bulle som LYSTE!",
                "Det kröp ner i Berits källare, genom en springa i luckan.",
                "Här, ta nyckeln till källarluckan. Jag hjälper Berit att bära mjöl ibland.",
              ],
              gives: "cellar-key",
              clue: "gustavSaw",
            },
          ],
          puzzle: "tracks",
          puzzleWhen: "talked-to-gustav",
          puzzleIntro: ["Jag samlar på spår från min trädgård.", "Kan du säga vilket djur som gjorde vilket spår?"],
        },
        k: {
          name: "Måns matskål",
          sprite: "bakeryCatBowl",
          talk: ["Måns matskål.", "Det ligger bullsmulor i den! Har Måns ätit bullar?", "Shh… han sover alldeles bredvid."],
          clue: "catBowl",
        },
      },
      clues: { "1": "mudPrints" },
      monsters: [{ type: "sleeper", sprite: "gardskatt", at: [14, 6], wakeRadius: 3, cry: "FRÄÄÄS!" }],
      onEnter: {
        name: "Ester",
        talk: [
          "Shh, Nora! Där sover gårdskatten Måns.",
          "Om du hoppar nära honom vaknar han. Och då blir han ARG!",
          "Bäcken slingrar sig hela vägen fram till Gustav. Man kan gå runt…",
          "…och vaknar Måns ändå: spring till Gustav! Då ger Måns upp.",
        ],
      },
      doors: [
        { at: "bottom", to: "bakery" },
        {
          at: "left",
          to: "cellar",
          stairs: "down",
          requires: "cellar-key",
          lockedText: "Källarluckan är låst. Någon måste ha en nyckel…",
        },
      ],
    },

    cellar: {
      name: "Mjölkällaren",
      theme: "storage",
      layout: [
        "####################",
        "#LL..........L.....D",
        "#L.....2.....L.....D",
        "#............LL..L.#",
        "#..LL..............#",
        "#..................#",
        "#..................#",
        "#.......LL.....LL..#",
        "#LL.....LL.........#",
        "#Ln..1.............#",
        "#LLL...........LLgL#",
        "####################",
      ],
      things: {
        n: {
          name: "Ett litet bo",
          sprite: "smulanNest",
          talk: [
            "Ett litet bo av BLÅTT fluff, gömt bakom säckarna.",
            "På en skylt står det: \"SMULANS HEM\".",
            "Boet är tomt… Små spår med TRE tår går ut ur det.",
          ],
          clue: "nest",
        },
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg!", "Det är varmt… och det luktar kanel?"],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      clues: { "1": "glowCrumbs", "2": "blackPrints" },
      monsters: [
        {
          type: "patroller",
          sprite: "bakeryFlourGhost",
          path: [[1, 5], [8, 5], [8, 6], [18, 6]],
          speed: 40,
        },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          "Brr, vad kallt och mörkt det är här nere…",
          "NORA! Ett spöke av mjöl! Var det det som tog bullarna?",
          "Akta dig! Smit förbi när det svävar åt andra hållet.",
        ],
        clue: "flourGhost",
      },
      doors: [{ at: "right", to: "yard", stairs: "up" }],
    },
  },

  puzzles: {
    "bun-count": {
      type: "code",
      title: "Kodlåset",
      text: [
        "Berits lapp vid låset:",
        "\"Koden = hur många bullar som fattas.\"",
        "I morse bakade Berit {baked} bullar.",
        "Nu ligger det bara {left} kvar på hyllan.",
      ],
      random: { baked: [12, 20], left: [3, 9] },
      answer: "{baked}-{left}",
      answerRange: [5, 14],
      gives: "backdoor-open",
    },
    tracks: {
      type: "match",
      title: "Gustavs spårsamling",
      text: ["Vilket djur gjorde vilket spår?", "Para ihop dem!"],
      pairs: [
        ["Katt", "bakeryTrackCat"],
        ["Hund", "bakeryTrackDog"],
        ["Anka", "bakeryTrackDuck"],
        ["Häst", "bakeryTrackHorse"],
        ["Människa", "bakeryTrackShoe"],
      ],
      // All five pairs (shuffled), so the cat's FOUR toes are always shown – the reveal relies on it.
      rightSprites: true,
      gives: "tracks-solved",
    },
    recipe: {
      type: "order",
      title: "Berits bullrecept",
      text: ["Lägg i sakerna i rätt ordning:"],
      // Three of the ingredients, in a new random order every game.
      describe: {
        flour: "det vita pulvret från den stora säcken",
        milk: "det vita som man dricker",
        butter: "det gula och mjuka som man breder på mackan",
        sugar: "det söta som gör bullen god",
        yeast: "det lilla paketet som får degen att växa",
        cinnamon: "den bruna kryddan som ser ut som små rullar",
      },
      pick: 3,
      options: [
        { id: "flour", label: "Mjöl", sprite: "bakeryFlour" },
        { id: "milk", label: "Mjölk", sprite: "bakeryMilk" },
        { id: "butter", label: "Smör", sprite: "bakeryButter" },
        { id: "sugar", label: "Socker", sprite: "bakerySugar" },
        { id: "yeast", label: "Jäst", sprite: "bakeryYeast" },
        { id: "cinnamon", label: "Kanel", sprite: "bakeryCinnamon" },
      ],
      answer: ["flour", "yeast", "sugar"],
      gives: "fresh-buns",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: "Vem tog bullarna?",
          options: [
            { id: "mans", label: "Katten Måns", sprite: "gardskatt" },
            { id: "gustav", label: "Grannen Gustav", sprite: "gustav" },
            { id: "ghost", label: "Mjölspöket", sprite: "bakeryFlourGhost" },
            { id: "berit", label: "Bagaren Berit", sprite: "berit" },
            { id: "smulan", label: "Monstret Smulan", sprite: "smulan" },
          ],
          answer: "smulan",
          // Everything that ties the thief to Smulan: blue fluff in the cat flap, three toes in the sand,
          // Gustav saw it go into the cellar, glowing crumbs lead to the nest – and the nest (blue, three toes, SMULANS HEM).
          proof: ["blueFluff", "mudPrints", "gustavSaw", "glowCrumbs", "nest"],
          missing: {
            blueFluff: "Hur kom tjuven ut ur bageriet? Dörren var ju låst. Fastnade något där?",
            mudPrints: "Tjuven sprang över gården. Lämnade hen några spår?",
            gustavSaw: "Någon på gården såg tjuven i morse. Vad sa han?",
            glowCrumbs: "Något lyste på golvet i källaren. Vart ledde det?",
            nest: "Vem bor bakom säckarna i källaren?",
          },
          whyNot: {
            mans: "Katter har FYRA tår – det såg du i Gustavs spårsamling. Tjuvens spår har bara TRE. Och Måns är grå, inte blå!",
            gustav: "Gustav har stövlar, inte tre tår. Och han är alldeles för stor för kattluckan!",
            ghost: "Mjölspöket svävar – det har inga fötter alls! Och det är vitt, inte blått.",
            berit: "Berit har inte tre tår, och hon får inte plats i kattluckan. Kaffebullen? Den får man äta i sitt eget bageri!",
          },
          why: {
            crumbs: "Smulorna visar att tjuven gick mot gården. Men vem som helst kan tappa smulor – de säger inte VEM.",
            catHair: "Måns får grädde i bageriet varje dag – det står på tavlan. Därför finns det kattstrån här.",
            glowBun: "Att en bulle lyste var ju därför Berit ringde oss. Men det säger inte VEM som tog den.",
            gustavWindow: "Att titta in genom fönstret är inte att ta bullar! Gustav älskar ju att titta på Berits bullar.",
            regulars: "Tavlan säger vilka som brukar komma hit: Gustav, Måns och Smulan. Men inte vem som var här i morse.",
            beritBun: "En bulle till kaffet i sitt eget bageri – det är inte att ta bullar!",
            catBowl: "Smulor i skålen… men tjuven hade TRE tår, och katter har fyra. Smulorna kan ha trillat ner när tjuven sprang förbi.",
            gustavBoots: "Gustav har svarta stövlar. Men tjuven hade små fötter med tre tår!",
            flourGhost: "Mjölspöket bor i källaren. Men det svävar – och tjuven lämnade fotspår.",
            blackPrints: "De svarta spåren är långa och smala, och de går rakt in i väggen. Tjuven hade små runda fötter med tre tår. Det är ett annat mysterium…",
          },
        },
        {
          question: "Smulan brukar ju fråga snällt. Varför tog hen bullarna?",
          options: [
            { id: "glow", label: "En bulle lyste och lockade hen" },
            { id: "tease", label: "Hen ville reta Berit" },
            { id: "mans", label: "Katten Måns lurade hen" },
            { id: "gustav", label: "Gustav skickade hen" },
            { id: "flour", label: "Hen ville ha mjöl" },
          ],
          answer: "glow",
          // Everything about the glowing bun: it glowed, the thief carried THAT one, and its crumbs lead to the nest.
          proof: ["glowBun", "gustavSaw", "glowCrumbs"],
          missing: {
            glowBun: "Vad var det som var konstigt med en av Berits bullar?",
            gustavSaw: "Någon såg vad tjuven bar på. Vem var det?",
            glowCrumbs: "Vart tog den lysande bullen vägen? Titta i källaren!",
          },
          whyNot: {
            tease: "Smulan brukar fråga snällt – det står på Berits tavla. Hen ville inte reta någon. Något lockade hen!",
            mans: "Måns sover ju nästan jämt! Titta i stället på vad tjuven bar på.",
            gustav: "Gustav tar aldrig utan att fråga – och det var HAN som hjälpte dig att hitta tjuven!",
            flour: "Mjölet ligger kvar i säckarna. Det var bullar som försvann!",
          },
          why: {
            crumbs: "Smulorna visar vart tjuven gick – men inte varför.",
            catHair: "Kattstrån säger inget om varför Smulan tog bullarna.",
            blueFluff: "Fluffet visar VEM det var. Men varför?",
            gustavWindow: "Gustav vid fönstret säger inget om varför.",
            regulars: "Tavlan visar att Smulan brukar fråga snällt. Så något var annorlunda i morse. Men vad?",
            beritBun: "Berits kaffebulle säger inget om varför.",
            mudPrints: "Spåren visar VEM det var. Men varför?",
            catBowl: "Smulorna i Måns skål säger inget om varför.",
            gustavBoots: "Gustavs stövlar säger inget om varför.",
            flourGhost: "Mjölspöket säger inget om varför.",
            blackPrints: "De svarta spåren är ett annat mysterium. De säger inget om Smulan.",
            nest: "Boet visar VEM det var. Men varför tog hen bullarna?",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    crumbs: { name: "Smulor mot gården", sprite: "bakeryCrumbs", text: "Vanliga bullsmulor på golvet. De leder mot dörren till gården." },
    catHair: { name: "Kattstrån", sprite: "bakeryCatHair", text: "Grå kattstrån vid brödhyllan. Har en katt varit här?" },
    blueFluff: {
      name: "Blått fluff",
      sprite: "bakeryBlueFluff",
      text: "En liten tuss mjukt BLÅTT fluff. Den satt fast i kattluckan i dörren!",
    },
    glowBun: {
      name: "Bullen som lyste",
      sprite: "bakeryGlowBun",
      text: "Berit: \"En bulle LYSTE när den kom ut ur ugnen. Som en liten lampa! Nu är den borta.\"",
    },
    gustavWindow: {
      name: "Gustav vid fönstret",
      sprite: "gustav",
      text: "Berit: \"Grannen Gustav tittade in genom fönstret i morse. Han ÄLSKAR bullar…\"",
    },
    regulars: {
      name: "Stamkundstavlan",
      sprite: "bakeryBoard",
      text: "Berits stamkunder: Gustav (tre kanelbullar varje morgon), Måns (grädde) och Smulan – ett litet monster som alltid frågar snällt efter smulor.",
    },
    beritBun: {
      name: "Berits kaffebulle",
      sprite: "bakeryCoffee",
      text: "En halvuppäten bulle bredvid Berits kaffekopp. Har Berit ätit av bullarna själv?",
    },
    mudPrints: {
      name: "Spår i sanden",
      sprite: "bakeryToePrints",
      text: "Små runda fotspår i den blöta sanden. Varje fot har bara TRE tår!",
    },
    catBowl: { name: "Måns matskål", sprite: "bakeryCatBowl", text: "Det ligger bullsmulor i Måns matskål!" },
    gustavBoots: {
      name: "Gustavs stövlar",
      sprite: "gustav",
      text: "Gustav har nya svarta stövlar. Och han älskar bullar… men han säger att han alltid frågar först.",
    },
    gustavSaw: {
      name: "Gustavs vittnesmål",
      sprite: "gustav",
      text: "Tidigt i morse, när det var mörkt, såg Gustav något litet och runt springa över gården. Det bar på en bulle som LYSTE – och kröp ner i källaren.",
    },
    flourGhost: {
      name: "Mjölspöket",
      sprite: "bakeryFlourGhost",
      text: "Ett spöke av mjöl svävar fram och tillbaka i källaren. Tar spöken bullar?",
    },
    blackPrints: {
      name: "Svarta fotspår",
      sprite: "bakeryBlackPrints",
      text: "Svarta fotspår i mjölet. Långa och smala… De går rakt in i väggen och tar slut. Vems är de?",
    },
    glowCrumbs: {
      name: "Lysande smulor",
      sprite: "bakeryGlowCrumbs",
      text: "Smulor som LYSER svagt, som små stjärnor. De leder in i hörnet bakom säckarna.",
    },
    nest: {
      name: "Smulans bo",
      sprite: "smulanNest",
      text: "Ett bo av BLÅTT fluff i källaren. På skylten står det \"SMULANS HEM\". Små spår med TRE tår går ut ur boet.",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    "cellar-key": { name: "Källarnyckeln", sprite: "key" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    moonshard: { name: "Den lysande biten", sprite: "moonShard" },
  },

  finale: [
    { say: "Ester", lines: ["Nora, titta!", "Något kryper fram ur brödhyllan…"] },
    { enter: "smulan", sprite: "smulan", from: [7, 3], to: [5, 3] },
    {
      say: "Smulan",
      lines: [
        "Mmm… nybakat…",
        "F-förlåt! Det var jag som tog bullarna.",
        "En bulle LYSTE så fint. Jag bara MÅSTE ha den!",
        "Och sen var jag så hungrig… Jag glömde att fråga.",
      ],
    },
    { say: "Berit", lines: ["Åh, lilla Smulan.", "Nästa gång frågar du. Då delar vi!"] },
    { frame: "smulan", index: 2 },
    { say: "Smulan", lines: ["Jag lovar! Kan jag hjälpa till att baka?"] },
    { say: "Berit", lines: ["Gärna! Du får betalt i bullar. Blir det bra?"] },
    { reveal: "smulan", sprite: "moonShard" },
    { say: "Smulan", lines: ["Den här satt inne i den lysande bullen.", "Den var för hård att äta. Och iskall!"] },
    { say: "Ester", lines: ["En bit av månen… igen!", "Precis som den som Grymlans hand hade."] },
    {
      say: "Nora",
      lines: [
        "Hur hamnade den i degen?",
        "Och vems var de svarta fotspåren i källaren?",
        "Någon samlar på de här bitarna. Mysteriet fortsätter…",
      ],
    },
    { give: "moonshard" },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    "Dörren var låst. Så Smulan kröp ut genom kattluckan – och där fastnade lite av hens BLÅA fluff.",
    "På gården fanns Smulans spår med TRE tår. Katter har fyra, så det var inte Måns. Smulorna i hans skål trillade ner när Smulan sprang förbi.",
    "Gustav såg något litet springa ner i källaren med bullen som lyste. De lysande smulorna ledde ända fram till Smulans bo: SMULANS HEM.",
    "Smulan brukar fråga snällt. Men bullen lyste så fint att hen glömde bort det. Det var biten av månen inne i bullen som lyste!",
    "Och de svarta spåren i källaren? Det var inte Gustavs stövlar – spåren gick rakt in i väggen. Någon annan har varit där…",
  ],

  fact: "Jäst är pyttesmå svampar! De äter socker och pruttar ut små gasbubblor. Det är bubblorna som får degen att växa.",

  cards: [
    { sprite: "smulan", name: "Smulan", text: "Ett litet, runt snaskmonster med tre tår. Känner doften av en nybakad bulle på långt håll!" },
    { sprite: "gardskatt", name: "Måns", text: "Gårdskatten som sover i solen. Hoppa inte nära honom – då vaknar han och jagar dig! Hinner du fram till en vuxen ger han upp." },
    { sprite: "bakeryFlourGhost", name: "Mjölspöket", text: "Svävar fram och tillbaka i mjölkällaren. När det nyser blir det mjölmoln överallt!" },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-berit",
      hints: [
        "Berit äger bageriet. Hon står bakom disken.",
        "Gå fram till Berit och tryck Ctrl.",
        "Berit har en hög vit bagarmössa. Hon står mitt i rummet.",
      ],
    },
    {
      text: "Leta efter ledtrådar i bageriet",
      doneWhen: BAKERY_CLUES,
      hints: [
        { text: "Ledtrådar glöder lite. Titta noga på golvet!", skipWhen: ["clue:crumbs", "clue:catHair"] },
        { text: "Titta vid brödhyllorna längst upp.", skipWhen: "clue:catHair" },
        { text: "Titta noga vid dörren till gården, längst upp. Har något fastnat där?", skipWhen: "clue:blueFluff" },
        { text: "Tavlan uppe till höger visar vilka som brukar komma hit.", skipWhen: "clue:regulars" },
        { text: "Vad står på disken bredvid Berit?", skipWhen: "clue:beritBun" },
      ],
    },
    {
      text: "Ta dig ut på gården",
      doneWhen: "visited:yard",
      hints: [
        { text: "Dörren till gården är längst upp till höger. Men den är låst…", skipWhen: "backdoor-open" },
        { text: "Läs lappen vid låset. Hur många bullar fattas?", skipWhen: "backdoor-open" },
        { text: "Räkna baklänges från {baked} tills du kommer till {left}. Hur många steg blev det?", skipWhen: "backdoor-open" },
        { text: "Koden är {baked} minus {left} …", skipWhen: "backdoor-open" },
        { text: "Dörren är öppen! Gå ut genom dörren längst upp.", when: "backdoor-open" },
      ],
    },
    {
      text: "Vart leder spåren?",
      doneWhen: YARD_CLUES,
      hints: [
        { text: "Titta noga i sanden!", skipWhen: "clue:mudPrints" },
        "Måns vaknar om du hoppar nära honom. Gå runt längs bäcken – eller hoppa långt ifrån honom. Vaknar han: spring till Gustav!",
        { text: "Vad står bredvid Måns?", skipWhen: "clue:catBowl" },
        { text: "Grannen Gustav står uppe till höger. Prata med honom!", skipWhen: "talked-to-gustav" },
        {
          text: "Gustav vill se om du är en riktig detektiv. Prata med honom igen!",
          when: "talked-to-gustav",
          skipWhen: "tracks-solved",
        },
        {
          text: "En katt har fyra runda tår. En hund har klor. En anka har simhud. En häst har hov. En människa har skor!",
          when: "talked-to-gustav",
          skipWhen: "tracks-solved",
        },
        { text: "Prata med Gustav igen – nu litar han på dig!", when: "tracks-solved", skipWhen: "clue:gustavSaw" },
      ],
    },
    {
      text: "Ta dig ner i källaren",
      doneWhen: "visited:cellar",
      hints: [
        { text: "Källarluckan är längst ner till vänster på gården. Men den är låst…", skipWhen: "cellar-key" },
        { text: "Vem hjälper Berit att bära mjöl? Kanske har den en nyckel.", skipWhen: "cellar-key" },
        { text: "Gustav har en nyckel. Men först vill han se att du är en riktig detektiv.", skipWhen: "cellar-key" },
        { text: "Du har nyckeln! Gå ner för trappan längst ner till vänster.", when: "cellar-key" },
      ],
    },
    {
      text: "Undersök källaren",
      doneWhen: CELLAR_CLUES,
      hints: [
        "Mjölspöket svävar fram och tillbaka. Smit förbi när det är på väg åt andra hållet!",
        { text: "Något lyser på golvet…", skipWhen: "clue:glowCrumbs" },
        { text: "Titta på mjölet uppe vid väggen. Vems spår är det?", skipWhen: "clue:blackPrints" },
        { text: "Vart leder de lysande smulorna?", skipWhen: "clue:nest" },
        { text: "Titta i hörnet längst ner till vänster, bakom säckarna.", skipWhen: "clue:nest" },
      ],
    },
    {
      text: "Vem tog bullarna – och varför?",
      doneWhen: "solved",
      hints: [
        "Berätta för Berit vad du har kommit fram till.",
        "Tre tår och blått fluff… vem bor i boet i källaren?",
        "Smulan brukar fråga snällt. Men en bulle LYSTE… Titta i detektivboken (B)!",
        "VEM: följ tjuvens väg från kattluckan, över gården och ner till boet. VARFÖR: allt som handlar om bullen som lyste.",
      ],
    },
    {
      text: "Få tjuven att komma fram!",
      doneWhen: "caught",
      hints: [
        { text: "Berit har en idé. Prata med henne!", skipWhen: "fresh-buns" },
        { text: "Vad älskar tjuven mest av allt? Något nybakat…", skipWhen: "fresh-buns" },
        { text: "Läs receptet på bakbordet vid ugnen noga.", skipWhen: "fresh-buns" },
        {
          text: "Mjöl är ett vitt pulver. Mjölk dricker man. Smör är gult. Socker är sött. Jäst får degen att växa. Kanel är brun.",
          skipWhen: "fresh-buns",
        },
        { text: "Gå till bakbordet igen och ta ut bullarna ur ugnen!", when: "fresh-buns" },
      ],
    },
  ],
};
