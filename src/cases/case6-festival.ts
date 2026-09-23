import type { Case } from "./types";

// Case 6 – the finale: Monsterfesten. The lanterns on the square keep going out,
// and the Moonstone can't be put together – the last piece is missing.
// SPOILER: Skuggan took the lights (and the pieces) because he is afraid of the dark –
// a shadow needs light, and in pitch darkness he disappears.
//
// Built as a "theory ladder": every room changes what Nora believes.
//   Square: "Someone steals the lights! Fladder? Smulan? Kugg-trollet? Lysa?" – big black
//           prints, blue fluff, a cog, moth dust and "something black with glowing eyes".
//   Park:   "It isn't a flyer and it isn't mean." – it sneaked along the ground, the fluff is
//           explained, the note says sorry and is signed S, and wax drops show lights came this way.
//   Cave:   "He's AFRAID of the dark!" – the candles stand lit in a ring around his little bed,
//           his drawing, and the empty hollow where the last piece lay (he has it with him).
// The reveal asks who takes the lights, and why – each needs clues from several rooms.
// Every clue that honestly points to the answer is in `proof`; clues that only look like they
// do (wax, the moonstone hollow) are worded so they don't.
// Then Skuggan is found hiding among the toy stalls on the square, and everyone celebrates.

const SQUARE_CLUES = ["clue:blackPrints", "clue:blueFluff", "clue:cog", "clue:mothDust", "clue:grymlanSaw", "clue:moonBook"];
const PARK_CLUES = ["clue:fladderGround", "clue:smulanPlayed", "clue:mirrorNote", "clue:waxTrail"];
const CAVE_CLUES = ["clue:lanternCircle", "clue:drawing", "clue:moonNest"];

/** The dark lanterns on the square – they light up again at the very end. */
const darkLantern = {
  name: "En släckt lykta",
  sprite: "festLantern",
  talk: ["Lyktan är tom!", "Ljuset är inte släckt – det är BORTA."],
  talkIf: [{ when: "caught", talk: ["Lyktan lyser igen!"] }],
  hideWhen: "moonstone",
};

export const case6: Case = {
  id: "festival",
  number: 6,
  title: "Monsterfesten",
  startRoom: "square",
  intro: [
    "I kväll är det Monsterfest på torget!",
    "Hela staden ska sätta ihop Månstenen – med bitarna som Nora har hittat.",
    "Men då ringer Stina: \"Nora! Lyktorna slocknar – en efter en!\"",
    "Nora och Ester springer dit…",
  ],

  rooms: {
    square: {
      name: "Torget",
      theme: "square",
      layout: [
        "####################",
        "####################",
        "#HHH.l..t.p...j.HH.#",
        "#.....3............#",
        "#...2....UU.....4.H#",
        "D...q....oUs..x...H#",
        "D........UU........#",
        "#.1.....g.....T....#",
        "#..KKb........k....#",
        "#..KKm.........HH..#",
        "#HH.......N....HH..#",
        "#########DD#########",
      ],
      things: {
        s: {
          name: "Stina Snurr",
          person: true,
          sprite: "stina",
          talk: [
            "Nora! Tack och lov att du kom!",
            "Vi skulle sätta ihop Månstenen i kväll…",
            "…men lyktorna slocknar, en efter en!",
            "Och ljusen är inte släckta. De är BORTA!",
            "Kan du leta efter ledtrådar här på torget?",
          ],
          gives: "talked-to-stina",
          talkIf: [
            { when: "caught", talk: ["Vilken fest, Nora! Tack för allt."] },
            {
              when: "solved",
              talk: [
                "Skuggan!? Men var är han nu?",
                "Titta – det skakar i ett av leksaksstånden…",
                "Han har smugit hit till festen! Hitta honom, Nora!",
              ],
            },
            {
              when: "visited:cave",
              talk: ["Du är nära, Nora! Men något fattas…", "Har du undersökt allt – på torget, i parken och i grottan?"],
            },
            {
              when: ["park-open", ...SQUARE_CLUES],
              talk: ["Du har nyckeln till parken!", "Spåren på torget leder ditåt. Grinden är till vänster."],
            },
            {
              when: SQUARE_CLUES,
              talk: [
                "Så många ledtrådar! Du är en riktig detektiv.",
                "Spåren leder mot parken. Men grinden är låst på kvällen…",
                "Kugg-trollet har nyckeln. Han tänder lyktorna i kväll.",
              ],
            },
            {
              when: "talked-to-stina",
              talk: ["Har du hittat något?", "Titta vid de släckta lyktorna. Och prata med gästerna!"],
            },
          ],
          puzzle: "reveal",
          // Every proof clue is in these lists (the square gives the prints, Grymlan and the book page).
          puzzleWhen: [...SQUARE_CLUES, ...PARK_CLUES, ...CAVE_CLUES],
          puzzleIntro: ["Nora! Du har varit i grottan!", "Vet du vem som tar ljusen – och varför?"],
        },
        o: {
          name: "Månstenen",
          sprite: "festMoonStand",
          on: "U",
          talk: [
            "Månstenen står på fontänen.",
            "Nora lägger dit sina lysande bitar. Klick, klick, klick…",
            "Men mitt i stenen är det ett hål. Den största biten fattas!",
            "Utan den lyser inte Månstenen.",
          ],
          clue: "moonGap",
          talkIf: [{ when: "caught", talk: ["Månstenen är hel igen.", "Den lyser över hela staden!"] }],
        },
        k: {
          name: "Kugg-trollet",
          person: true,
          sprite: "kuggtroll",
          talk: [
            "Kugg, kugg! Jag är lykttändare i kväll.",
            "Men någon tar ljusen lika fort som jag tänder dem!",
            "Hjälp mig räkna, så får du nyckeln till parken.",
          ],
          talkIf: [
            { when: "caught", talk: ["Kugg, kugg! Alla lyktor lyser!", "Och Skuggan har ett eget nattljus."] },
            {
              when: ["park-open", "clue:cog"],
              talk: [
                "En kugge vid lyktan? Hmm… jag tappar kuggar ibland.",
                "Men jag TÄNDER ju lyktorna! Varför skulle jag ta ljusen?",
              ],
            },
            {
              when: "park-open",
              talk: ["Tack för hjälpen!", "Grinden till parken är öppen nu. Den är till vänster."],
            },
          ],
          puzzle: "lanterns",
        },
        b: {
          name: "Bagaren Berit",
          person: true,
          sprite: "berit",
          talk: [
            "Välkommen till bullståndet, Nora!",
            "Smulan hjälper mig i kväll.",
            "Hon älskar allt som lyser… minns du bullen med den lysande biten?",
            "Fast i kväll försvann hon en stund. Var var hon då? Hmm.",
          ],
          clue: "smulanLoves",
          talkIf: [{ when: "caught", talk: ["Bullar till alla!", "Även till Skuggan. Mest till Skuggan!"] }],
        },
        m: {
          name: "Smulan",
          person: true,
          sprite: "smulan",
          talk: [
            "Mums… hej Nora!",
            "Jag har INTE tagit några ljus! Jag lovar!",
            "…fast de är ju SÅ fina när de lyser.",
          ],
          talkIf: [{ when: "caught", talk: ["Fest! Mums!"] }],
        },
        g: {
          name: "Grymlan",
          person: true,
          sprite: "festGrymlan",
          talk: [
            "Nora! Jag såg den igen!",
            "Något SVART med glödande ögon – vid lyktorna!",
            "Precis som i lagret, när jag tappade armen…",
            "Var det Fladder? Hon är ju svart med lysande ögon…",
          ],
          clue: "grymlanSaw",
          talkIf: [{ when: "caught", talk: ["Armen sitter kvar i kväll!", "Och jag är inte rädd längre."] }],
        },
        t: {
          name: "Bläddra",
          person: true,
          sprite: "bladdra",
          talk: [
            "Välkommen till Bläddras skuggteater!",
            "Här gör vi figurer av ljus och skugga.",
            "Kan du svara på min skuggfråga?",
          ],
          talkIf: [
            { when: "caught", talk: ["Vilken fest!", "Nu kan jag skriva klart boken om Månstenen."] },
            {
              when: "shadow-lesson",
              talk: [
                "Rätt! En skugga blir till när något står i vägen för ljuset.",
                "Utan ljus – ingen skugga alls.",
                "Minns du boken om Månstenen, den som saknade sidor?",
                "Jag hittade en sida! Där står det:",
                "\"Stenen lyser så att ingen ska behöva vara rädd för mörkret.\"",
              ],
              clue: "moonBook",
            },
          ],
          puzzle: "shadows",
        },
        p: {
          name: "Skuggteatern",
          sprite: "skuggTheatre",
          talk: [
            "En liten teater med en vit duk.",
            "En lampa lyser bakom duken…",
            "…och på duken hoppar en svart skuggkanin!",
          ],
        },
        j: {
          name: "Lyktan som lyser",
          sprite: "festLanternLit",
          talk: ["Den enda lyktan på torget som lyser.", "Runt den fladdrar Lysa, lyktmalen."],
        },
        l: darkLantern,
        q: darkLantern,
        x: darkLantern,
      },
      clues: { "1": "blackPrints", "2": "blueFluff", "3": "cog", "4": "mothDust" },
      onEnter: {
        name: "Ester",
        talk: [
          "Oj, Nora… det är nästan kolsvart på torget!",
          "Nästan alla lyktor har slocknat.",
          "Akta dig för Lysa, lyktmalen! Hon dyker mot allt som glänser.",
          "Göm dig bakom stånden om hon kommer. Kom, vi pratar med Stina!",
        ],
      },
      monsters: [
        {
          type: "flyer",
          sprite: "lysaMoth",
          center: [16, 4],
          size: [2, 1],
          perch: [15, 3],
          thing: {
            name: "Lysa Lyktmal",
            person: true,
            sprite: "lysaMoth",
            talk: [
              "Ljus, ljus, LJUS! Jag älskar ljus!",
              "Varje gång en lykta slocknar blir jag så ledsen.",
              "Nej, jag har inte tagit dem! Jag vill ju att allt ska LYSA.",
            ],
            clue: "lysaLight",
          },
        },
        // Skuggan himself. First only the toys in the stalls rustle; after the cave he is
        // glimpsed darting across the square; at the end he hides in one of the stalls.
        {
          type: "crawler",
          sprite: "skuggan",
          routes: [
            [[1, 3], [4, 3]],
            [[17, 6], [17, 8]],
            [[3, 10], [7, 10]],
            [[11, 7], [13, 7]],
          ],
          shelters: [[2, 2], [16, 2], [18, 4], [1, 10], [15, 9]],
          unseenUntil: "clue:lanternCircle",
          catchWhen: "solved",
        },
      ],
      doors: [
        { at: "left", to: "park", requires: "park-open", lockedText: "Grinden till parken är låst." },
        { at: "bottom", lockedText: "Vi kan inte gå hem nu! Det är ju fest – och ett mysterium." },
      ],
    },

    park: {
      name: "Stadsparken",
      theme: "forest",
      layout: [
        "########DD##########",
        "#TT....t....RR....T#",
        "#T..........R..a...#",
        "#...~~.............#",
        "#...~~..TT.........#",
        "#.......TT..3......D",
        "#..u...............D",
        "#............TT....#",
        "#..~~..............#",
        "#TT........~.......#",
        "#TTT.............TT#",
        "####################",
      ],
      things: {
        t: {
          name: "Trattis",
          person: true,
          sprite: "trattis",
          talk: [
            "Stopp! Det är jag, Trattis. Jag vaktar grottan.",
            "Här inne bor Skuggan. Han är skygg – inte elak.",
            "Bara den som kan räkna mina svampar får gå in!",
          ],
          talkIf: [
            { when: "caught", talk: ["Fest! Men ät inga okända svampar, va?"] },
            {
              when: "cave-open",
              talk: [
                "Rätt räknat! Du får gå in.",
                "Gå försiktigt. Det är mörkt där inne…",
                "…och skuggkrypen gillar inte besök.",
              ],
            },
          ],
          puzzle: "mushrooms",
        },
        u: {
          name: "Mossungen",
          person: true,
          sprite: "mossunge",
          talk: [
            "Shhh! Väck inte Mossjätten!",
            "Jag lekte kurragömma med Smulan på torget i kväll.",
            "Hon gömde sig under lyktorna. Hon tappar blått fluff överallt, hihi!",
            "Sen smög något svart förbi. Då sprang jag hem.",
          ],
          clue: "smulanPlayed",
        },
        a: {
          name: "En lapp",
          sprite: "festNote",
          talk: ["En lapp har fastnat i busken.", "Det är en svart fläck på den."],
          talkIf: [
            {
              when: "note-read",
              talk: ["På lappen står det:", "\"Förlåt för ljusen. Jag lämnar tillbaka dem när solen kommer upp. / S\""],
              clue: "mirrorNote",
            },
          ],
          puzzle: "note",
          puzzleIntro: [
            "En lapp har fastnat i busken.",
            "Bokstäverna står åt fel håll – det är spegelskrift!",
            "Kan du läsa den?",
          ],
        },
      },
      clues: { "3": "waxTrail" },
      onEnter: {
        name: "Ester",
        talk: [
          "Stadsparken. Här är det ännu mörkare…",
          "Kartan från klocktornet visar att Skuggans grotta ligger här någonstans.",
          "Titta, Mossjätten sover! Hoppa INTE nära den.",
          "Och Fladder är vaken – det är ju natt. Göm dig bakom träden om hon dyker!",
        ],
      },
      monsters: [
        {
          type: "flyer",
          sprite: "fladder",
          center: [13, 5],
          size: [4, 2],
          perch: [14, 7],
          perchSprite: "fladderHang",
          thing: {
            name: "Fladder",
            person: true,
            sprite: "fladderHang",
            talk: [
              "Vad vill DU? Jag har inte tagit några ljus!",
              "Jag gillar mörker, visst. Men jag har ju inga händer.",
              "Jag såg den som tog dem. Den flög INTE – den smög längs marken.",
              "Svart som bläck, med glödande ögon. Mer såg jag inte!",
            ],
            clue: "fladderGround",
          },
        },
        { type: "sleeper", sprite: "mossjatte", at: [6, 6] },
      ],
      doors: [
        { at: "right", to: "square" },
        { at: "top", to: "cave", requires: "cave-open", lockedText: "Grottan! Men Trattis vaktar ingången." },
      ],
    },

    cave: {
      name: "Skuggans grotta",
      theme: "storage",
      layout: [
        "####################",
        "####################",
        "#RR....d....RRR..Le#",
        "#R.................#",
        "#...RR.............#",
        "#.1.RR.......LL....#",
        "#.........b........#",
        "#..LL..........RR..#",
        "#..LL..........RR..#",
        "#R.................#",
        "#RR..............RR#",
        "#########DD#########",
      ],
      things: {
        b: {
          name: "En liten säng",
          sprite: "skuggBed",
          talk: [
            "En liten säng av mossa, med en gammal filt.",
            "Runt sängen står ljusen från lyktorna – i en ring!",
            "Alla är tända. Det är det enda ljusa stället i hela grottan.",
          ],
          clue: "lanternCircle",
        },
        d: {
          name: "En teckning",
          sprite: "skuggDrawing",
          talk: [
            "En teckning sitter på väggen.",
            "Ena halvan är kolsvart. Där syns bara två ögon… och en tår.",
            "På andra halvan lyser en rund sten.",
            "Under stenen står en liten svart figur. Den ler!",
          ],
          clue: "drawing",
        },
        e: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg – bakom lådorna!", "Det är varmt… och det lyser lite."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      clues: { "1": "moonNest" },
      onEnter: {
        name: "Ester",
        talk: [
          "Skuggans grotta… jag ser nästan ingenting.",
          "Titta! Små skuggkryp med glödande ögon!",
          "De går fram och tillbaka. Vänta tills de vänder – och smit förbi!",
          "Men de håller sig borta från ljuset i mitten.",
        ],
      },
      monsters: [
        { type: "patroller", sprite: "skuggkryp", path: [[6, 3], [16, 3]], speed: 28 },
        { type: "patroller", sprite: "skuggkryp", path: [[5, 8], [14, 8]], speed: 24 },
      ],
      doors: [{ at: "bottom", to: "park" }],
    },
  },

  puzzles: {
    lanterns: {
      type: "code",
      title: "Lyktorna",
      text: [
        "Kugg-trollet har hängt upp {total} lyktor i hela staden.",
        "Nu lyser bara {lit} av dem.",
        "Hur många lyktor har slocknat?",
      ],
      // Two-digit subtraction without borrowing: {total} − {lit}.
      random: { litTens: [1, 3], litOnes: [0, 4], outTens: [2, 5], outOnes: [1, 5] },
      derive: {
        lit: "{litTens}*10+{litOnes}",
        out: "{outTens}*10+{outOnes}",
        total: "{lit}+{out}",
      },
      answer: "{total}-{lit}",
      gives: "park-open",
    },
    shadows: {
      type: "choice",
      title: "Bläddras skuggfråga",
      text: ["Lampan lyser från VÄNSTER.", "Var hamnar skuggan?"],
      options: [
        { id: "right", label: "Åt höger", sprite: "festShadowRight" },
        { id: "left", label: "Åt vänster", sprite: "festShadowLeft" },
        { id: "short", label: "Liten, rakt under", sprite: "festShadowShort" },
        { id: "none", label: "Ingen skugga", sprite: "festShadowNone" },
      ],
      answer: "right",
      // Bläddra asks one of her questions each game.
      variants: [
        {
          text: ["Lampan lyser från VÄNSTER.", "Var hamnar skuggan?"],
          options: [
            { id: "right", label: "Åt höger", sprite: "festShadowRight" },
            { id: "left", label: "Åt vänster", sprite: "festShadowLeft" },
            { id: "short", label: "Liten, rakt under", sprite: "festShadowShort" },
            { id: "none", label: "Ingen skugga", sprite: "festShadowNone" },
          ],
          answer: "right",
          hint: "Skuggan hamnar alltid på andra sidan – bort från lampan.",
        },
        {
          text: ["Lampan lyser från HÖGER.", "Var hamnar skuggan?"],
          options: [
            { id: "right", label: "Åt höger", sprite: "festShadowRight" },
            { id: "left", label: "Åt vänster", sprite: "festShadowLeft" },
            { id: "short", label: "Liten, rakt under", sprite: "festShadowShort" },
            { id: "none", label: "Ingen skugga", sprite: "festShadowNone" },
          ],
          answer: "left",
          hint: "Skuggan hamnar alltid på andra sidan – bort från lampan.",
        },
        {
          text: ["Mitt på dagen står solen", "rakt ovanför oss. Hur blir skuggan?"],
          options: [
            { id: "right", label: "Lång, åt höger", sprite: "festShadowRight" },
            { id: "left", label: "Lång, åt vänster", sprite: "festShadowLeft" },
            { id: "short", label: "Liten, rakt under", sprite: "festShadowShort" },
            { id: "none", label: "Ingen skugga", sprite: "festShadowNone" },
          ],
          answer: "short",
          hint: "När ljuset kommer rakt uppifrån blir skuggan liten – precis under fötterna.",
        },
        {
          text: ["Nu släcker vi ALLA lampor.", "Det blir kolsvart. Hur blir skuggan?"],
          options: [
            { id: "right", label: "Åt höger", sprite: "festShadowRight" },
            { id: "left", label: "Åt vänster", sprite: "festShadowLeft" },
            { id: "short", label: "Liten, rakt under", sprite: "festShadowShort" },
            { id: "none", label: "Ingen skugga", sprite: "festShadowNone" },
          ],
          answer: "none",
          hint: "En skugga behöver ljus. Utan ljus blir det ingen skugga alls!",
        },
      ],
      gives: "shadow-lesson",
    },
    note: {
      type: "choice",
      title: "Lappen i spegelskrift",
      text: ["Förlåt för ljusen.", "Jag lämnar tillbaka dem", "när solen kommer upp.", "/ S"],
      mirror: true,
      options: [
        { id: "sorry", label: "Förlåt! Jag lämnar tillbaka ljusen när solen kommer upp." },
        { id: "never", label: "Ha ha! Nu blir det aldrig ljust igen!" },
        { id: "mine", label: "Ljusen är mina. Ni får dem aldrig tillbaka!" },
        { id: "party", label: "Festen är tråkig. Gå hem allihop!" },
      ],
      answer: "sorry",
      wrong: "Läs en gång till – bokstav för bokstav, från höger till vänster.",
      gives: "note-read",
    },
    mushrooms: {
      type: "code",
      title: "Trattis svampar",
      text: ["Trattis räknar svamparna i sin svampring.", "Hon räknar med hopp:", "{m1}, {m2}, {m3}, {m4} …", "Vilket tal kommer sen?"],
      random: { m1: [3, 50] },
      words: { mstep: ["2", "5", "10"] },
      derive: { m2: "{m1}+{mstep}", m3: "{m2}+{mstep}", m4: "{m3}+{mstep}" },
      answer: "{m4}+{mstep}",
      answerRange: [11, 100],
      gives: "cave-open",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu löser vi det allra sista mysteriet!"],
      questions: [
        {
          question: "Vem tar ljusen från lyktorna?",
          options: [
            { id: "fladder", label: "Fladder", sprite: "fladder" },
            { id: "smulan", label: "Smulan", sprite: "smulan" },
            { id: "kuggtroll", label: "Kugg-trollet", sprite: "kuggtroll" },
            { id: "lysa", label: "Lysa Lyktmal", sprite: "lysaMoth" },
            { id: "skuggan", label: "Skuggan", sprite: "skuggan" },
          ],
          answer: "skuggan",
          // Something big and black with glowing eyes that walks on the ground, a sorry note
          // signed S – and the lights ended up in Skuggan's own cave.
          proof: ["blackPrints", "grymlanSaw", "fladderGround", "mirrorNote", "lanternCircle"],
          missing: {
            blackPrints: "Titta på marken på torget. Vilka spår fanns där – och vilken färg hade de?",
            grymlanSaw: "Någon på torget såg tjuven vid lyktorna. Vad såg han?",
            fladderGround: "Någon i parken såg tjuven. Flög den – eller gick den?",
            mirrorNote: "Tjuven skrev något i parken. Hur var det underskrivet?",
            lanternCircle: "Var hamnade ljusen till slut? Och vem bor där?",
          },
          whyNot: {
            fladder: "Fladder flyger – men tjuven smög längs marken. Och Fladder har inga händer!",
            smulan: "Smulan är blå – men tjuven var svart som bläck. Och Mossungen berättade varför fluffet låg där.",
            kuggtroll: "Kugg-trollet är pyttelitet – men spåren var stora. Och han vill ju TÄNDA lyktorna!",
            lysa: "Lysa flyger – men tjuven smög längs marken. Och ljusen står inte hos henne!",
          },
          why: {
            blueFluff: "Fluffet pekar på Smulan… men Mossungen berättade varför det låg där.",
            smulanPlayed: "Mossungen förklarar fluffet. Men den säger inte vem som tog ljusen.",
            smulanLoves: "Att Smulan gillar ljus betyder inte att hon tog dem.",
            cog: "Kuggen visar bara att Kugg-trollet har varit vid lyktan. Han är ju lykttändare!",
            mothDust: "Dammet visar bara att Lysa har fladdrat vid lyktorna. Det gör hon ju jämt!",
            lysaLight: "Lysa älskar ljus – men det visar inte vem som tog det.",
            moonBook: "Boken berättar om Månstenen – inte om vem som tog ljusen.",
            moonGap: "Hålet i Månstenen handlar om stenen – inte om ljusen från lyktorna.",
            waxTrail: "Stearinet visar att någon har burit ljus genom parken. Men inte vem!",
            drawing: "Teckningen visar hur någon känner sig. Spara den till nästa fråga!",
            moonNest: "Något runt och lysande låg gömt här. Men ljusen från lyktorna står ju i ringen – det här är något annat!",
          },
        },
        {
          question: "Varför tog Skuggan ljusen?",
          options: [
            { id: "ruin", label: "Han ville förstöra festen" },
            { id: "afraid", label: "Han är rädd för mörkret" },
            { id: "sell", label: "Han ville sälja dem" },
            { id: "king", label: "Han ville bli kung över staden" },
            { id: "angry", label: "Han är arg på alla" },
          ],
          answer: "afraid",
          // He only needs them until the sun comes up, keeps them lit around his bed, cries in
          // the dark and smiles in the light – and the stone's light is there so no one is afraid.
          proof: ["moonBook", "mirrorNote", "lanternCircle", "drawing"],
          missing: {
            moonBook: "Bläddra hittade en sida om Månstenen. Vad står det att stenen är till för?",
            mirrorNote: "Läs lappen från parken igen. När ska ljusen lämnas tillbaka?",
            lanternCircle: "Hur stod ljusen i grottan? Och vad stod mitt i ringen?",
            drawing: "Något på grottans vägg visar hur Skuggan känner sig. I mörkret – och i ljuset.",
          },
          whyNot: {
            ruin: "Den som vill förstöra en fest skriver inte förlåt. Läs lappen igen!",
            sell: "Ljusen står inte i en affär. De står tända runt en liten säng!",
            king: "Ingen ledtråd handlar om att bestämma. Titta på teckningen i grottan!",
            angry: "Den som är arg skriver inte förlåt – och lovar att lämna tillbaka.",
          },
          why: {
            blackPrints: "Spåren visar vem det var. Men vi frågar varför!",
            blueFluff: "Fluffet kom från Smulan. Det säger inget om Skuggan.",
            cog: "Kuggen kom från Kugg-trollet. Det säger inget om Skuggan.",
            mothDust: "Dammet kom från Lysa. Det säger inget om Skuggan.",
            smulanLoves: "Det är Smulan som älskar ljus. Men vi frågar om Skuggan!",
            lysaLight: "Det är Lysa som älskar ljus. Men vi frågar om Skuggan!",
            smulanPlayed: "Mossungen förklarar fluffet. Det säger inget om varför Skuggan tog ljusen.",
            grymlanSaw: "Grymlan blev rädd för det han såg. Men vad är Skuggan själv rädd för?",
            fladderGround: "Fladder såg hur tjuven såg ut. Men inte varför han tog ljusen.",
            waxTrail: "Stearinet visar att ljusen bars genom parken – inte varför.",
            moonGap: "Att en bit fattas säger inte varför någon tog den.",
            moonNest: "Avtrycket visar bara var något lysande låg gömt. Inte varför Skuggan tog ljusen.",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    blackPrints: {
      name: "Svarta fotspår",
      sprite: "festInkPrints",
      text: "Stora svarta fotspår på stenarna, svarta som bläck. Långa, spetsiga tår och inga skosulor. De leder mot grinden till parken.",
    },
    blueFluff: { name: "Blått fluff", sprite: "festFluff", text: "En tuss blått fluff under en släckt lykta. Vem har blå päls?" },
    cog: { name: "En liten kugge", sprite: "festCog", text: "En liten kugge av mässing under en släckt lykta. Vem har kuggar?" },
    mothDust: {
      name: "Glittrigt damm",
      sprite: "festMothDust",
      text: "Grått, glittrigt damm under en släckt lykta – som från en fjärils vingar.",
    },
    grymlanSaw: {
      name: "Grymlans vittnesmål",
      sprite: "festGrymlan",
      text: "Grymlan såg något SVART med glödande ögon vid lyktorna. Precis som i lagret. Var det Fladder?",
    },
    moonBook: {
      name: "Sidan ur boken",
      sprite: "skuggTheatre",
      text: "Bläddra hittade en sida om Månstenen: \"Stenen lyser så att ingen ska behöva vara rädd för mörkret.\"",
    },
    moonGap: {
      name: "Den sista biten",
      sprite: "festMoonStand",
      text: "Månstenen har ett hål i mitten. Den största biten fattas – utan den lyser inte stenen.",
    },
    smulanLoves: {
      name: "Smulan älskar ljus",
      sprite: "smulan",
      text: "Berit: \"Smulan älskar allt som lyser.\" Och i kväll försvann Smulan en stund. Var var hon då?",
    },
    lysaLight: { name: "Lysa älskar ljus", sprite: "lysaMoth", text: "Lysa blir ledsen när lyktorna slocknar. Hon vill att allt ska lysa." },
    fladderGround: {
      name: "Fladders vittnesmål",
      sprite: "fladderHang",
      text: "Fladder har inga händer. Den som tog ljusen flög inte – den smög längs marken. Svart som bläck, med glödande ögon.",
    },
    smulanPlayed: {
      name: "Mossungens vittnesmål",
      sprite: "mossunge",
      text: "Mossungen lekte kurragömma med Smulan under lyktorna. Smulan tappar blått fluff överallt!",
    },
    mirrorNote: {
      name: "Lappen i spegelskrift",
      sprite: "festNote",
      text: "\"Förlåt för ljusen. Jag lämnar tillbaka dem när solen kommer upp. / S\"",
    },
    waxTrail: { name: "Stearindroppar", sprite: "festWax", text: "Droppar av stearin i gräset. Här har någon burit tända ljus." },
    lanternCircle: {
      name: "Ringen av ljus",
      sprite: "skuggBed",
      text: "I Skuggans grotta står ljusen från lyktorna i en ring runt en liten säng av mossa. Alla är tända.",
    },
    drawing: {
      name: "Skuggans teckning",
      sprite: "skuggDrawing",
      text: "Ena halvan är kolsvart, med två ögon och en tår. På andra halvan lyser en rund sten – och där ler en liten svart figur.",
    },
    moonNest: {
      name: "Ett runt avtryck",
      sprite: "skuggNest",
      text: "Ett runt, glittrande avtryck i en grop bakom stenarna. Något stort, runt och lysande har legat gömt här. Nu är det borta!",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    "park-open": { name: "Nyckeln till parken", sprite: "key" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    moonstone: { name: "Månstenen", sprite: "moonStone" },
  },

  finale: [
    { say: "Nora", lines: ["Där är du, Skuggan!", "Du behöver inte gömma dig."] },
    {
      say: "Skuggan",
      lines: [
        "F-förlåt! Snälla, bli inte arga.",
        "Jag är ju en skugga. Och en skugga behöver ljus.",
        "När det blir kolsvart… försvinner jag. Då finns jag inte.",
        "Jag är så rädd för mörkret!",
      ],
    },
    {
      say: "Skuggan",
      lines: [
        "När Månstenen lyste i tornet var jag aldrig rädd.",
        "Så jag tog den. Men den var så tung att jag tappade den – och den sprack!",
        "Bitarna rullade iväg överallt i staden. Och allt blev så konstigt. Förlåt!",
      ],
    },
    { say: "Grymlan", lines: ["Du skrämde mig i lagret…", "…men du var ju ännu räddare än jag!"] },
    { say: "Ester", lines: ["Alla är rädda för något.", "Jag är rädd för åska. Och spindlar. Lite."] },
    { reveal: "nora", sprite: "moonShard" },
    { say: "Skuggan", lines: ["Här är den sista biten.", "Den är din, Nora."] },
    { say: "Nora", lines: ["Tack, Skuggan!", "Nu sätter vi ihop Månstenen – tillsammans."] },
    { flash: true },
    { reveal: "nora", sprite: "moonStone" },
    { give: "moonstone" },
    { enter: "lantern1", sprite: "festLanternLit", from: [5, 2], to: [5, 2] },
    { enter: "lantern2", sprite: "festLanternLit", from: [4, 5], to: [4, 5] },
    { enter: "lantern3", sprite: "festLanternLit", from: [14, 5], to: [14, 5] },
    { say: "Stina Snurr", lines: ["Månstenen är hel!", "Och titta – alla lyktor lyser igen!"] },
    { say: "Stina Snurr", lines: ["Men Skuggan… du behöver ju ljus på natten."] },
    { say: "Kugg-trollet", lines: ["Kugg, kugg! Jag har byggt något.", "Bara till dig!"] },
    { reveal: "culprit", sprite: "skuggNightLight" },
    { frame: "culprit", index: 2 },
    { say: "Skuggan", lines: ["Ett eget… nattljus?", "Nu behöver jag aldrig försvinna i mörkret igen!"] },
    { enter: "trattis", sprite: "trattis", from: [0, 5], to: [3, 6] },
    { enter: "viskan", sprite: "viskanGhost", from: [0, 6], to: [2, 4] },
    { enter: "fladder", sprite: "fladder", from: [0, 5], to: [6, 6] },
    { say: "Trattis", lines: ["Vi hörde att det var fest!"] },
    { say: "Viskan", lines: ["Psssst… välkommen, Skuggan…", "Hihi. Jag lyser, så jag kan vara din kompis i mörkret."] },
    { say: "Fladder", lines: ["Jag tar mörkret. Du tar ljuset.", "Okej?"] },
    { say: "Stina Snurr", lines: ["Välkommen till Monsterfesten, Skuggan!", "Här får ALLA vara med."] },
    {
      say: "Nora",
      lines: ["Alla är rädda för något.", "Och alla får vara med.", "Mysteriet med Månstenen är löst!"],
    },
    { say: "Ester", lines: ["Vi är världens bästa detektiver, Nora!", "Nu blir det FEST!"] },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    "Fluffet, kuggen och dammet var falska spår. Smulan lekte kurragömma, Kugg-trollet tände lyktorna och Lysa fladdrar alltid runt ljus.",
    "Spåren, Grymlan och Fladder visade samma sak: något stort och svart med glödande ögon, som smög på marken.",
    "Lappen var underskriven med S, och ljusen stod i Skuggans grotta. Då visste vi att det var Skuggan!",
    "Han ville bara ha ljusen tills solen kom upp. Och på teckningen grät han i mörkret men log i ljuset.",
    "Bläddras skuggfråga visade varför: utan ljus blir det ingen skugga. \"Jag behöver ljuset\", skrev han ju i biblioteket!",
    "Därför tog han Månstenen ur tornet. Den sprack, och där bitarna hamnade vaknade leksakerna och bullen lyste!",
  ],

  fact: "En skugga blir till när något står i vägen för ljuset. Lyser lampan från vänster hamnar skuggan till höger. Och i kolsvart mörker finns inga skuggor alls – därför var Skuggan mörkrädd!",

  cards: [
    { sprite: "skuggan", name: "Skuggan", text: "En skugga med glödande ögon. Han är mörkrädd – för i kolsvart mörker försvinner han!" },
    { sprite: "lysaMoth", name: "Lysa Lyktmal", text: "En stor, luden mal som älskar ljus. Hon dyker mot allt som glänser – göm dig bakom ett stånd!" },
    { sprite: "skuggkryp", name: "Skuggkrypen", text: "Små kryp av mörker i Skuggans grotta. De går fram och tillbaka, men vågar aldrig nära ljuset." },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-stina",
      hints: [
        "Stina ordnar festen. Hon står vid Månstenen.",
        "Gå fram till Stina och tryck Ctrl.",
        "Stina är tanten med grått hår, till höger om fontänen.",
      ],
    },
    {
      text: "Leta efter ledtrådar på torget",
      doneWhen: SQUARE_CLUES,
      hints: [
        { text: "Titta noga på marken vid de släckta lyktorna!", skipWhen: ["clue:blackPrints", "clue:blueFluff", "clue:cog"] },
        { text: "Grymlan har sett något. Prata med honom!", skipWhen: "clue:grymlanSaw" },
        { text: "Bläddra har en skuggteater. Kan du svara på hennes fråga?", skipWhen: "shadow-lesson" },
        { text: "Något glittrar vid lyktan uppe till höger. Göm dig bakom stånden när Lysa dyker!", skipWhen: "clue:mothDust" },
        { text: "Bläddras fråga: {shadows:hint}", skipWhen: "shadow-lesson" },
        { text: "Prata med Bläddra igen – hon vet något om Månstenen.", when: "shadow-lesson", skipWhen: "clue:moonBook" },
        {
          text: "Ledtrådarna på marken ligger vid lyktorna: till vänster, uppe till vänster och uppe till höger. Och nära grinden!",
          skipWhen: ["clue:blackPrints", "clue:blueFluff", "clue:cog", "clue:mothDust"],
        },
      ],
    },
    {
      text: "Ta dig in i parken",
      doneWhen: "visited:park",
      hints: [
        { text: "Parken är bakom grinden till vänster. Men den är låst…", skipWhen: "park-open" },
        { text: "Kugg-trollet har nyckeln. Prata med honom!", skipWhen: "park-open" },
        { text: "Räkna: {total} minus {lit}. Ta tiotalen först, sen entalen!", skipWhen: "park-open" },
        { text: "Du har nyckeln! Gå genom grinden till vänster.", when: "park-open" },
      ],
    },
    {
      text: "Undersök parken",
      doneWhen: PARK_CLUES,
      hints: [
        { text: "Prata med alla i parken. Men hoppa inte nära Mossjätten!", skipWhen: ["clue:smulanPlayed", "clue:fladderGround"] },
        { text: "Mossungen står till vänster. Smyg dit utan att hoppa!", skipWhen: "clue:smulanPlayed" },
        { text: "Fladder blir trött när hon har missat dig två gånger. Göm dig bakom träden! Sen vilar hon i ett träd – då kan du prata med henne.", skipWhen: "clue:fladderGround" },
        { text: "Det sitter en lapp i en buske uppe till höger.", skipWhen: "note-read" },
        { text: "Lappen är i spegelskrift. Läs bokstäverna baklänges, från höger till vänster!", skipWhen: "note-read" },
        { text: "Titta på marken mitt i parken. Något har droppat där.", skipWhen: "clue:waxTrail" },
      ],
    },
    {
      text: "Ta dig in i grottan",
      doneWhen: "visited:cave",
      hints: [
        { text: "Grottan är längst upp i parken. Men Trattis vaktar den.", skipWhen: "cave-open" },
        { text: "Prata med Trattis och räkna hennes svampar!", skipWhen: "cave-open" },
        { text: "Talen ökar med {mstep} varje gång: {m1}, {m2}, {m3}, {m4} … lägg till {mstep} en gång till!", skipWhen: "cave-open" },
        { text: "Trattis släpper förbi dig! Gå in i grottan längst upp.", when: "cave-open" },
      ],
    },
    {
      text: "Undersök grottan",
      doneWhen: CAVE_CLUES,
      hints: [
        "Skuggkrypen går fram och tillbaka. Vänta tills de vänder – och smit förbi!",
        { text: "Något lyser mitt i grottan. Gå dit!", skipWhen: "clue:lanternCircle" },
        { text: "Något glittrar bakom stenarna till vänster.", skipWhen: "clue:moonNest" },
        { text: "Det sitter något på väggen längst upp.", skipWhen: "clue:drawing" },
      ],
    },
    {
      text: "Vem tar ljusen – och varför?",
      doneWhen: "solved",
      hints: [
        "Gå tillbaka till Stina på torget och berätta vad du vet.",
        "Vem smög längs marken, svart som bläck? Och var hamnade ljusen?",
        "Läs lappen från parken igen: när ska ljusen lämnas tillbaka? Och tänk på teckningen: hur kändes det i mörkret?",
        "Spåren, vittnena, lappen och ringen av ljus visar VEM. Lappen, boksidan, ljusringen och teckningen visar VARFÖR.",
      ],
    },
    {
      text: "Hitta den skyldige!",
      doneWhen: "caught",
      hints: [
        "Skuggan har smugit hit till festen. Han gömmer sig!",
        "Titta på leksaksstånden. I vilket skakar det?",
        "Gå fram till ståndet där leksakerna skakar och tryck Ctrl!",
      ],
    },
  ],
};
