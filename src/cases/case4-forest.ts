import type { Case } from "./types";

// Case 4 – "Ljuden i skogen". Every night something rumbles and something cries in the forest,
// and the forest glows. SPOILER: the solution is described below and in DESIGN.md.
//
// The truth: Skuggan passed through the forest with its glowing shards and left a trail of blue
// glitter from the stream to its hideout under a root by the mushroom ring. Mossjättens unge saw
// the glitter shine on the stepping stones one night, followed it all the way to the ring, found a
// moonstone shard left in the empty hideout – and then couldn't find its way home. Now it hides under
// the moss and cries, and the shard glows so brightly that it can't sleep (that's why the forest
// glows). The rumbling is the parent, who searches and calls every night around the stream and
// sleeps there in the daytime.
//
// Built as a "theory ladder": every room changes what Nora believes.
//   Forest edge:   "There's a MONSTER!" – huge prints no animal has, red drops (blood?!), wolf fur,
//                  a warning sign about Trattis and her vampire teeth.
//   Stream:        "The monster is a giant – but it's searching. Its little one is missing!" – the
//                  sleeping giant, prints in circles, an empty little moss bed, tiny prints over the
//                  stones, and Bruno saw blue glitter on the same stones (and the wolf slept).
//   Mushroom ring: "The little one cries here – it followed the glitter and got lost." – tears,
//                  Trattis heard a small voice (and the red drops were lingonberry juice), the
//                  glitter trail continues here. The hideout with glowing eyes is the red thread.
// The reveal asks two questions – who cries, and why – and the proof needs clues from several rooms.
// Every clue has one job: Hilma only states the problem, the hideout is only about Skuggan.

const EDGE_CLUES = ["clue:hilma", "clue:bigPrints", "clue:redDrops", "clue:wolfFur"];
const STREAM_CLUES = ["clue:circlePrints", "clue:emptyNest", "clue:smallPrints", "clue:brunoSaw"];
const RING_CLUES = ["clue:trattisSaw", "clue:lingon", "clue:tears", "clue:hideout", "clue:glowDust"];

export const case4: Case = {
  id: "forest",
  number: 4,
  title: "Ljuden i skogen",
  startRoom: "edge",
  intro: [
    "Haren Hilma skickade ett brev till detektivbyrån:",
    "\"Hjälp! Varje natt låter det hemskt i skogen!\"",
    "\"Något BRUMMAR och något GRÅTER. Och skogen LYSER!\"",
    "Nora och Ester går till skogen i skymningen…",
  ],

  rooms: {
    edge: {
      name: "Skogsbrynet",
      theme: "forest",
      layout: [
        "####################",
        "#TT....T.......TT###",
        "#T..h.......s....T##",
        "#.......1.....T....#",
        "D..N..........T....#",
        "D....~~.......2....#",
        "#....~~............#",
        "#.T.........b......#",
        "#......3..T........#",
        "#TT.....T....RT..TT#",
        "#TTT........TTT..TT#",
        "###############DD###",
      ],
      things: {
        h: {
          name: "Haren Hilma",
          person: true,
          sprite: "hareHilma",
          talk: [
            "Åh, en detektiv! Tack för att du kom!",
            "Varje natt låter det hemskt i skogen.",
            "Först BRUMMAR något så att marken skakar…",
            "…sen GRÅTER något: UHUUU!",
            "Och skogen LYSER blått. Ingen av oss djur kan sova!",
          ],
          gives: "talked-to-hilma",
          clue: "hilma",
          talkIf: [
            {
              when: "caught",
              talk: ["Tack, Nora! Nu kan alla djur sova igen."],
            },
            {
              when: "solved",
              talk: ["Var det en liten unge som grät? Stackars liten!", "Och vi trodde att det var ett farligt monster…"],
            },
            {
              when: ["talked-to-hilma", "tracks-learned"],
              talk: ["Du kan spåren! Nu går du inte vilse.", "Stigen till bäcken är nere till höger.", "Akta dig för vargen!"],
            },
            {
              when: EDGE_CLUES,
              talk: [
                "Så många ledtrådar! Du är en riktig detektiv.",
                "Nu måste du in i skogen. Men där går man lätt vilse…",
                "Lär dig spåren på skogsvaktarens tavla först!",
              ],
            },
            {
              when: "talked-to-hilma",
              talk: [
                "Har du hittat några ledtrådar?",
                "Titta noga på marken.",
                "Och akta dig för vargen! Han går fram och tillbaka vid stigen.",
              ],
            },
          ],
        },
        s: {
          name: "Skylten",
          sprite: "sign",
          talk: [
            "Djuren har satt upp en skylt:",
            "\"AKTA ER FÖR TRATTIS!\"",
            "\"Hon har VAMPYRTÄNDER och bor vid svampringen.\"",
          ],
          clue: "warning",
        },
        b: {
          name: "Spårtavlan",
          sprite: "trackBoard",
          talk: ["Skogsvaktarens spårtavla."],
          talkIf: [
            {
              when: "tracks-learned",
              talk: [
                "Nu kan du spåren!",
                "Men vänta… de jättestora fotspåren finns inte på tavlan.",
                "Inget vanligt djur har så stora fötter!",
              ],
              clue: "noAnimal",
            },
          ],
          puzzle: "tracks",
          puzzleIntro: ["Skogsvaktarens spårtavla:", "\"Den som kan läsa spår går aldrig vilse i skogen!\""],
        },
      },
      clues: { "1": "bigPrints", "2": "redDrops", "3": "wolfFur" },
      onEnter: {
        name: "Ester",
        talk: [
          "Lyssna, Nora… Det är alldeles tyst.",
          "Inga fåglar sjunger. Djuren är rädda.",
          "Där är Haren Hilma! Vi pratar med henne.",
        ],
      },
      monsters: [{ type: "patroller", sprite: "forestWolf", path: [[13, 8], [18, 8]], speed: 30, cry: "GRRRR!" }],
      doors: [
        {
          at: "bottom",
          to: "stream",
          requires: "tracks-learned",
          puzzle: "tracks",
          lockedText: "Stigen delar sig i massor av spår. Vilka ska vi följa? Vi måste kunna spåren först!",
        },
        { at: "left", lockedText: "Vi kan inte gå hem än. Djuren behöver oss!" },
      ],
    },

    stream: {
      name: "Bäcken",
      theme: "forest",
      layout: [
        "###############DD###",
        "#TT...............T#",
        "#..T.......T..T..RR#",
        "#................Rg#",
        "#..............R...#",
        "#...b.R..........RR#",
        "WWWWWWWWWWWW~~WWWWWW",
        "WWWWWWWWWWWW~~WWWWWW",
        "D..R..n.......2..RR#",
        "D...1.............T#",
        "#Tt..............TT#",
        "####################",
      ],
      things: {
        t: {
          name: "Trattis",
          person: true,
          sprite: "trattis",
          talk: [
            "Sssss… STOPP DÄR!",
            "Jag är Trattis. Jag vaktar vägen till svampringen.",
            "(Det droppar något rött från hennes vassa tänder…)",
            "Svara rätt på min fråga, så får du gå förbi!",
          ],
          talkIf: [
            {
              when: "ring-open",
              talk: ["Rätt svar! Du är en klok liten detektiv.", "Gå du till svampringen. Jag tar min egen väg…", "Hihihi!"],
            },
          ],
          puzzle: "trattis-question",
          // She walks ahead to the mushroom ring once Nora may pass.
          hideWhen: "ring-open",
        },
        n: {
          name: "Det lilla boet",
          sprite: "mossNest",
          talk: [
            "Ett litet bo av mossa, precis bredvid jätten.",
            "Det är tomt. Och alldeles kallt.",
            "Här har någon liten sovit… men inte på flera nätter.",
          ],
          clue: "emptyNest",
        },
        b: {
          name: "Bävern Bruno",
          person: true,
          sprite: "beaverBruno",
          talk: [
            "Hej! Jag är Bruno. Jag mäter allt i skogen!",
            "Man kan mäta med steg, med pinnar… eller med tassar!",
            "Jag har mätt fotspåren vid bäcken. Ett STORT och ett LITET.",
            "Kan du räkna ut skillnaden?",
          ],
          talkIf: [
            {
              when: "measured",
              talk: [
                "Rätt! Det stora spåret är mycket längre.",
                "Samma sorts fot… en stor och en liten.",
                "Vargen? Nej, han snarkar i sin lya hela nätterna. Jag hör honom!",
                "Men om nätterna glittrar något BLÅTT på stenarna i bäcken.",
                "En lång rad av glitter. Den går mot svampringen.",
                "Och jätten? Jag nynnar en bäversång för den. Nu sover den som en stock!",
              ],
              clue: "brunoSaw",
            },
          ],
          puzzle: "bruno-measure",
        },
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg, gömt bakom stenarna!", "Det är varmt… och det luktar mossa."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      clues: { "1": "circlePrints", "2": "smallPrints" },
      onEnter: {
        name: "Ester",
        talk: [
          "Sch, Nora! Titta där borta…",
          "Något STORT sover vid bäcken!",
          "Gå tyst förbi. Hoppa inte nära den – vaknar den kan den följa efter oss!",
        ],
      },
      // If it wakes it comes after Nora through the doors – until Bruno has hummed it back to sleep.
      monsters: [
        { type: "sleeper", sprite: "mossjatte", at: [7, 9], wakeRadius: 3, cry: "VRÅÅÅL!", follows: true, calmWhen: "measured" },
      ],
      doors: [
        { at: "top", to: "edge" },
        {
          at: "left",
          to: "ring",
          requires: "ring-open",
          lockedText: "Trattis står vid stigen och blänger. Ingen går förbi utan att prata med henne!",
        },
      ],
    },

    ring: {
      name: "Svampringen",
      theme: "forest",
      layout: [
        "####################",
        "#TT....T....TT...TT#",
        "#T..h.2..o.o...Tc..#",
        "#......o.....o.....#",
        "#..T..o...1...o..T.#",
        "#.....o...m...o....#",
        "#...T..o.....o..T..#",
        "#.T.....o...o...tk.#",
        "#..................D",
        "#TT......T.......T.D",
        "#TTT............TTT#",
        "####################",
      ],
      things: {
        t: {
          name: "Trattis",
          person: true,
          sprite: "trattis",
          talk: [
            "Hihi, där är du ju! Jag tog genvägen.",
            "Var inte rädd för mina tänder. Jag äter bara lingon!",
            "Men lyssna: varje natt gråter någon här vid ringen.",
            "En liten, ljus röst. När jag kommer med lyktan blir det tyst.",
          ],
          clue: "trattisSaw",
          talkIf: [
            {
              when: "caught",
              talk: ["Tack, Nora! Nu blir det lugnt i min skog igen."],
            },
            {
              when: "solved",
              talk: [
                "Mossjättens unge! Men var är den nu?",
                "Hör du? Det snyftar… mitt i svampringen!",
                "Hjälp den hem, Nora!",
              ],
            },
            {
              when: RING_CLUES,
              talk: ["Du är nära, Nora! Men något fattas…", "Har du undersökt allt vid bäcken?"],
            },
            {
              when: "clue:trattisSaw",
              talk: ["Har du tittat dig omkring vid ringen?", "Titta i mossan… och under rötterna."],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: [...STREAM_CLUES, ...RING_CLUES],
          puzzleIntro: ["Nå, lilla detektiven?", "Vem är det som gråter i min skog? Och varför?"],
        },
        k: {
          name: "Trattis korg",
          sprite: "lingonBasket",
          talk: [
            "Trattis korg är full av lingon.",
            "Den läcker röd saft. Droppe… droppe… droppe.",
            "Samma röda droppar som på stigen!",
          ],
          clue: "lingon",
        },
        h: {
          name: "Hålan under roten",
          sprite: "shadowEyes",
          talk: [
            "En mörk håla under en gammal rot.",
            "Två glödande ögon blinkar i mörkret…",
            "…och är borta. Brr, det är iskallt!",
            "Hålan är tom. Men här har något legat gömt.",
          ],
          clue: "hideout",
          talkIf: [
            {
              when: "clue:hideout",
              talk: ["Hålan är tom nu.", "Någon har gömt sig här. Någon med glödande ögon…"],
            },
          ],
        },
        o: {
          name: "Kantarellen",
          sprite: "ringMushroom",
          talk: [
            "En stor gul svamp. Ringen är gjord av sådana.",
            "Trattis säger: \"Ät aldrig en svamp du inte känner igen!\"",
            "Vissa svampar är giftiga. Fråga alltid en vuxen.",
          ],
        },
        c: {
          name: "Kompasstenen",
          sprite: "compassStone",
          talk: [
            "Någon har ristat en kompass i stenen:",
            "N är norr. Dit pekar kompassnålen.",
            "Ö är öster. Där går solen upp.",
            "S är söder. Där står solen mitt på dagen.",
            "V är väster. Där går solen ner.",
          ],
        },
        m: {
          name: "Den mossiga kullen",
          sprite: "mossMound",
          talk: ["En mjuk kulle av mossa.", "Den… andas? Nej. Det var nog vinden."],
          talkIf: [{ when: "caught", talk: ["Kom, lilla vän. Vi går hem!"] }],
          puzzle: "way-home",
          puzzleWhen: "solved",
          puzzleIntro: [
            "Mossan rör sig… och snyftar!",
            "Två små blanka ögon tittar fram. Det är UNGEN!",
            "\"Snyft… Jag hittar inte hem till bäcken…\"",
          ],
          hideWhen: "caught",
        },
      },
      clues: { "1": "tears", "2": "glowDust" },
      onEnter: {
        name: "Ester",
        talk: [
          "Svampringen… Här känns det magiskt.",
          "Titta, lysflugor! Göm dig bakom träden om de kommer.",
        ],
      },
      monsters: [{ type: "flyer", sprite: "forestFireflies", center: [10, 5], size: [6, 3] }],
      doors: [{ at: "right", to: "stream" }],
    },
  },

  puzzles: {
    tracks: {
      type: "match",
      title: "Spårtavlan",
      text: [
        "Vem har gått här? Para ihop djuret med spåret!",
        "Haren skuttar: två långa och två små.",
        "Älgen har klövar. Fågeln har tre tår framåt.",
        "Räven har fyra tår. Björnen har fem, med klor.",
      ],
      pairs: [
        ["Hare", "forestTrackHare"],
        ["Räv", "forestTrackFox"],
        ["Älg", "forestTrackMoose"],
        ["Fågel", "forestTrackBird"],
        ["Björn", "forestTrackBear"],
      ],
      pick: 4,
      rightSprites: true,
      gives: "tracks-learned",
    },
    "bruno-measure": {
      type: "code",
      title: "Brunos mätning",
      text: [
        "Bruno har mätt fotspåren med sina tassar:",
        "Stora spåret …… {big} tassar",
        "Lilla spåret …… {small} tassar",
        "Hur många tassar längre är det stora spåret?",
      ],
      random: { big: [11, 19], small: [3, 7] },
      answer: "{big}-{small}",
      answerRange: [6, 15],
      gives: "measured",
    },
    "trattis-question": {
      type: "choice",
      title: "Trattis fråga",
      text: ["Jag har hatt men inget huvud.", "Jag har en fot men inga skor. Vad är jag?"],
      options: [
        { id: "mushroom", label: "Svamp", sprite: "ringMushroom" },
        { id: "umbrella", label: "Paraply", sprite: "umbrella" },
        { id: "chair", label: "Stol", sprite: "chair" },
        { id: "teddy", label: "Nalle", sprite: "teddy" },
      ],
      answer: "mushroom",
      // Trattis picks one of her questions each game.
      variants: [
        {
          text: ["Jag har hatt men inget huvud.", "Jag har en fot men inga skor. Vad är jag?"],
          options: [
            { id: "mushroom", label: "Svamp", sprite: "ringMushroom" },
            { id: "umbrella", label: "Paraply", sprite: "umbrella" },
            { id: "chair", label: "Stol", sprite: "chair" },
            { id: "teddy", label: "Nalle", sprite: "teddy" },
          ],
          answer: "mushroom",
          hint: "Trattis har en likadan hatt! Den växer i skogen.",
        },
        {
          text: ["När på året växer det", "mest svamp i skogen?"],
          options: [
            { id: "winter", label: "Vintern", sprite: "forestSeasonWinter" },
            { id: "spring", label: "Våren", sprite: "forestSeasonSpring" },
            { id: "summer", label: "Sommaren", sprite: "sun" },
            { id: "autumn", label: "Hösten", sprite: "forestSeasonAutumn" },
          ],
          answer: "autumn",
          hint: "När löven blir gula och röda och det regnar mycket…",
        },
        {
          text: ["Du hittar en svamp", "som du inte känner igen. Vad gör du?"],
          options: [
            { id: "taste", label: "Smakar lite på den" },
            { id: "soup", label: "Kokar soppa på den" },
            { id: "leave", label: "Låter den stå och frågar en vuxen" },
            { id: "friend", label: "Ger den till en kompis" },
          ],
          answer: "leave",
          hint: "Ät ALDRIG en svamp som du inte känner igen!",
        },
        {
          text: ["Du har ätit en smörgås i skogen.", "Vad gör du med pappret?"],
          options: [
            { id: "stream", label: "Slänger det i bäcken" },
            { id: "moss", label: "Gömmer det under mossan" },
            { id: "home", label: "Tar med det hem" },
            { id: "wind", label: "Låter vinden ta det" },
          ],
          answer: "home",
          hint: "Var rädd om naturen. Skräp ska inte ligga kvar i skogen!",
        },
      ],
      gives: "ring-open",
    },
    "way-home": {
      type: "order",
      title: "Vägen hem",
      text: ["Ungen ska hem till bäcken.", "Trattis viskar vägen genom skogen:"],
      // Three of the four directions, in a new random order every game.
      describe: {
        north: "åt det håll som kompassnålen pekar",
        east: "åt det håll där solen går upp",
        south: "åt det håll där solen står mitt på dagen",
        west: "åt det håll där solen går ner",
      },
      pick: 3,
      options: [
        { id: "north", label: "Norr", sprite: "forestCompassN" },
        { id: "east", label: "Öster", sprite: "forestCompassE" },
        { id: "south", label: "Söder", sprite: "forestCompassS" },
        { id: "west", label: "Väster", sprite: "forestCompassW" },
      ],
      answer: ["north", "east", "south"],
      gives: "caught",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: "Vem är det som gråter i skogen om nätterna?",
          options: [
            { id: "trattis", label: "Trattis", sprite: "trattis" },
            { id: "wolf", label: "Vargen", sprite: "forestWolf" },
            { id: "giant", label: "Mossjätten", sprite: "mossjatte" },
            { id: "child", label: "Mossjättens unge", sprite: "mossunge" },
            { id: "fireflies", label: "Lysflugorna", sprite: "forestFireflies" },
          ],
          answer: "child",
          // A little one is missing from its moss bed, small mossy prints (the giant's shape) go to the
          // ring – and at the ring someone small cries and leaves small tears with moss around them.
          proof: ["emptyNest", "smallPrints", "trattisSaw", "tears"],
          missing: {
            emptyNest: "Saknas det någon vid bäcken? Titta nära den som sover!",
            smallPrints: "Har någon liten gått vid bäcken? Titta på marken bredvid stenarna!",
            trattisSaw: "Någon vid svampringen har hört gråten. Hur lät rösten?",
            tears: "Var har någon gråtit? Titta mitt i svampringen!",
          },
          whyNot: {
            trattis: "Trattis hörde själv gråten! Och de röda dropparna var bara lingonsaft.",
            wolf: "Bruno hör vargen snarka i sin lya hela nätterna!",
            giant: "Mossjätten är stor och BRUMMAR. Men Trattis hörde en liten, ljus röst. Och jätten letar ju efter någon!",
            fireflies: "Lysflugor kan lysa – men de kan inte gråta! Och tårarna låg i mossan.",
          },
          why: {
            hilma: "Hilma har bara hört ljuden. Hon vet inte vem som gråter.",
            bigPrints: "De stora fotspåren är jättens. Men vem är det som gråter?",
            noAnimal: "Spårtavlan visar att de stora spåren är ett monsters. Men inte vem som gråter.",
            redDrops: "De röda dropparna var lingonsaft från Trattis korg. Inte tårar!",
            lingon: "Lingonen förklarar de röda dropparna. Inte gråten.",
            wolfFur: "Pälsen visar att vargen har gått här. Inte att han gråter.",
            warning: "Skylten visar bara att djuren är rädda för Trattis.",
            circlePrints: "Spåren i cirklar visar att den stora har letat efter något. Men de visar inte vem som gråter.",
            brunoSaw: "Bruno visar att vargen sov och att något glittrade. Men inte vem som gråter.",
            glowDust: "Glittret visar att något lyste här. Men glitter kan inte gråta!",
            hideout: "Ögonen i hålan försvann direkt, och hålan är tom. De visar inte vem som gråter i ringen.",
          },
        },
        {
          question: "Varför gråter ungen?",
          options: [
            { id: "lost", label: "Den följde glittret och gick vilse", sprite: "forestGlowDust" },
            { id: "trattis", label: "Trattis skrämde den", sprite: "trattis" },
            { id: "wolf", label: "Vargen jagade den", sprite: "forestWolf" },
            { id: "mushroom", label: "Den åt en giftig svamp", sprite: "ringMushroom" },
            { id: "fireflies", label: "Lysflugorna retade den", sprite: "forestFireflies" },
          ],
          answer: "lost",
          // It has been away from home for nights and its parent searches in circles (lost). Its prints go
          // over the stones where Bruno saw the glitter, and the glitter goes on to the ring (followed it).
          proof: ["emptyNest", "circlePrints", "smallPrints", "brunoSaw", "glowDust"],
          missing: {
            emptyNest: "Är ungen hemma i sin säng? Titta vid bäcken!",
            circlePrints: "Vad gör den stora om nätterna? Titta på de stora spåren vid bäcken!",
            smallPrints: "Vart gick ungen? Titta på marken bredvid stenarna i bäcken!",
            brunoSaw: "Någon vid bäcken har sett något om nätterna. Vad sa han?",
            glowDust: "Vart går glittret? Titta i mossan vid svampringen!",
          },
          whyNot: {
            trattis: "Ungen grät redan innan Trattis kom med lyktan. Och den har varit borta från sitt bo i flera nätter!",
            wolf: "Vargen snarkar i sin lya hela nätterna. Det sa Bruno!",
            mushroom: "En svamp förklarar inte varför ungen är så långt från sitt bo.",
            fireflies: "Lysflugorna flyger bara runt vid ringen. De förklarar inte varför ungen gick så långt från sitt bo.",
          },
          why: {
            hilma: "Hilma har bara hört ljuden. Hon vet inte varför någon gråter.",
            trattisSaw: "Trattis hörde att någon gråter. Men inte varför.",
            tears: "Tårarna visar att någon har gråtit. Men inte varför.",
            bigPrints: "De stora fotspåren visar bara att jätten har gått här. Vad gör den? Titta vid bäcken!",
            noAnimal: "Att det är ett monster vet vi redan. Men varför gråter ungen?",
            redDrops: "Det var bara lingonsaft!",
            lingon: "Lingonen förklarar de röda dropparna. Inte gråten.",
            wolfFur: "Pälsen visar bara att vargen har gått här.",
            warning: "Skylten visar bara att djuren är rädda för Trattis.",
            hideout: "Ögonen i hålan är ett annat mysterium. De visar inte varför ungen gråter.",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    hilma: {
      name: "Hilmas berättelse",
      sprite: "hareHilma",
      text: "Varje natt brummar något så att marken skakar. Sen gråter något: UHUUU! Och skogen lyser blått!",
    },
    bigPrints: { name: "Jättestora fotspår", sprite: "giantFootprint", text: "Jättestora fotspår med mossa mellan tårna. Vem har så stora fötter?" },
    redDrops: { name: "Röda droppar", sprite: "bloodDrops", text: "Röda droppar på stigen in mot skogen. Är det… blod?" },
    wolfFur: { name: "Grå päls", sprite: "wolfFur", text: "En tuss grå päls på en buske. Har vargen varit här?" },
    warning: {
      name: "Djurens skylt",
      sprite: "sign",
      text: "\"AKTA ER FÖR TRATTIS! Hon har vampyrtänder och bor vid svampringen.\"",
    },
    noAnimal: {
      name: "Inget djur",
      sprite: "trackBoard",
      text: "Inget djur på spårtavlan har så stora fötter. Det måste vara ett MONSTER!",
    },
    circlePrints: {
      name: "Spår i cirklar",
      sprite: "giantCirclePrints",
      text: "De stora fotspåren går runt, runt, runt. Som om någon har letat efter något hela natten.",
    },
    emptyNest: {
      name: "Det tomma boet",
      sprite: "mossNest",
      text: "Bredvid jätten finns ett litet bo av mossa. Det är tomt och kallt. Här har någon liten sovit – men inte på flera nätter.",
    },
    smallPrints: {
      name: "Små fotspår",
      sprite: "mossungeFootprints",
      text: "Små mossiga fotspår – samma form som de stora, fast pyttesmå! De kommer från stenarna i bäcken och går mot stigen till svampringen.",
    },
    brunoSaw: {
      name: "Brunos vittnesmål",
      sprite: "beaverBruno",
      text: "Vargen snarkar i sin lya hela nätterna. Men om nätterna glittrar något BLÅTT på stenarna i bäcken. En lång rad, mot svampringen.",
    },
    trattisSaw: {
      name: "Trattis vittnesmål",
      sprite: "trattis",
      text: "Varje natt gråter någon vid svampringen, med en liten, ljus röst. När Trattis kommer med lyktan blir det tyst.",
    },
    lingon: {
      name: "Lingonkorgen",
      sprite: "lingonBasket",
      text: "Trattis äter lingon hela tiden. Korgen läcker röd lingonsaft – samma röda droppar som på stigen!",
    },
    tears: { name: "Tårar", sprite: "mossTears", text: "Små blöta fläckar mitt i svampringen, med tussar av mossa runt omkring. Som tårar… Någon har gråtit här." },
    hideout: {
      name: "Det tomma gömstället",
      sprite: "shadowEyes",
      text: "En tom håla under en rot. Två glödande ögon blinkade – och försvann. Iskallt! Här har något legat gömt.",
    },
    glowDust: {
      name: "Blått glitter",
      sprite: "forestGlowDust",
      text: "Blått glitter i mossan. Det lyser kallt, som en bit av månen. Glittret går i en lång rad – från stigen vid bäcken ända hit.",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    moonshard: { name: "Den lysande biten", sprite: "moonShard" },
  },

  finale: [
    { say: "Nora", lines: ["Kom, lilla vän. Vi hjälper dig hem!"] },
    { enter: "unge", sprite: "mossunge", from: [10, 5], to: [10, 6] },
    {
      say: "Ungen",
      lines: [
        "Snyft… Jag såg blått glitter på stenarna i bäcken.",
        "Det lyste så fint! Jag följde glittret, hela vägen hit.",
        "I en håla hittade jag en sten som lyste…",
        "…men sen hittade jag inte hem. Och stenen lyser så starkt att jag inte kan sova!",
      ],
    },
    { say: "Ester", lines: ["Lyssna! Det brummar…"] },
    { enter: "jatte", sprite: "mossjatte", from: [19, 8], to: [14, 8] },
    { frame: "jatte", index: 1 },
    {
      say: "Mossjätten",
      lines: [
        "BRUMMM! MIN LILLA!",
        "Jag har letat varje natt och ropat efter dig.",
        "Förlåt, alla djur. Vi ville inte skrämma någon.",
      ],
    },
    { flash: true },
    {
      say: "Trattis",
      lines: ["Och alla trodde att JAG var farlig. Hihi!", "Skogen är allas hem. Vi är rädda om den – och om varandra."],
    },
    { reveal: "unge", sprite: "moonShard" },
    { say: "Ester", lines: ["Nora, titta! Stenen från hålan…", "Den lyser precis som biten från leksaksaffären!"] },
    {
      say: "Nora",
      lines: [
        "Någon med glödande ögon gömde sig i hålan.",
        "Skuggan har varit här. Men vart tog den vägen?",
        "Det här mysteriet är inte slut än…",
      ],
    },
    { give: "moonshard" },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    "De jättestora spåren var Mossjättens. De gick runt, runt vid bäcken. Jätten letade – och brummade.",
    "Bredvid jätten låg ett tomt litet bo. Och små mossiga spår, likadana som jättens, gick mot svampringen.",
    "Vid ringen grät någon med en liten, ljus röst. Där låg små tårar i mossan. Det var jättens unge!",
    "Bruno har sett blått glitter på stenarna, och glittret gick ända till ringen. Ungen följde det – och kom för långt hemifrån.",
    "Skogen som lyste om nätterna? Det var stenen som ungen hittade i hålan.",
    "Och de röda dropparna var lingonsaft från Trattis korg. Vargen sov i sin lya hela nätterna.",
  ],

  fact: "Svampar är varken växter eller djur! Det vi plockar är bara svampens frukt. Resten är tunna trådar under marken, och de kan bli större än ett hus. Ät aldrig en svamp du inte känner igen!",

  cards: [
    {
      sprite: "trattis",
      name: "Trattis",
      text: "Har en hatt som en trattkantarell och vassa vampyrtänder. Men hon äter bara lingon och vaktar svampringen!",
    },
    { sprite: "mossjatte", name: "Mossjätten", text: "Stor som ett hus och täckt av mossa. Sover på dagen. Hoppa inte nära – då vaknar hen!" },
    { sprite: "mossunge", name: "Mossungen", text: "Liten, mjuk och mossig. Gömmer sig under mossan när den är rädd." },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-hilma",
      hints: [
        "Haren Hilma skrev brevet. Hon bor här i skogsbrynet.",
        "Gå fram till Hilma och tryck Ctrl.",
        "Hilma är haren uppe till vänster.",
      ],
    },
    {
      text: "Leta efter ledtrådar i skogsbrynet",
      doneWhen: EDGE_CLUES,
      hints: [
        { text: "Ledtrådar glöder lite. Titta noga på marken!", skipWhen: ["clue:bigPrints", "clue:redDrops"] },
        { text: "Något stort har gått här. Leta mitt på ängen!", skipWhen: "clue:bigPrints" },
        { text: "Något rött ligger vid stigen till höger. Akta dig för vargen!", skipWhen: "clue:redDrops" },
        { text: "Något grått har fastnat nere till vänster.", skipWhen: "clue:wolfFur" },
        { text: "Har du pratat med Hilma?", skipWhen: "clue:hilma" },
      ],
    },
    {
      text: "Ta dig in i skogen",
      doneWhen: "visited:stream",
      hints: [
        { text: "Stigen in i skogen är nere till höger. Men Hilma sa något om spår…", skipWhen: "tracks-learned" },
        { text: "Titta på skogsvaktarens spårtavla.", skipWhen: "tracks-learned" },
        "Vargen går fram och tillbaka. Vänta tills han har vänt – och spring förbi!",
        {
          text: "Haren skuttar: två långa och två små. Fågeln har tre tår. Älgen har klövar, två halvor. Räven har fyra tår. Björnen har fem tår och klor.",
          skipWhen: "tracks-learned",
        },
        { text: "Du kan spåren! Gå in på stigen nere till höger.", when: "tracks-learned" },
      ],
    },
    {
      text: "Undersök bäcken",
      doneWhen: STREAM_CLUES,
      hints: [
        "Något stort sover vid bäcken. Gå tyst – hoppa inte nära den!",
        { text: "Titta noga runt den som sover.", skipWhen: ["clue:circlePrints", "clue:emptyNest"] },
        { text: "Vem har gått vid stenarna i bäcken? Titta på marken bredvid dem.", skipWhen: "clue:smallPrints" },
        { text: "Bävern Bruno mäter saker. Prata med honom!", skipWhen: "measured" },
        { text: "Brunos mätning: {big} minus {small} = ?", skipWhen: "measured" },
        { text: "Hoppa över stenarna i bäcken med mellanslag – långt från jätten!", skipWhen: "clue:circlePrints" },
      ],
    },
    {
      text: "Ta dig till svampringen",
      doneWhen: "visited:ring",
      hints: [
        { text: "Stigen till svampringen är till vänster, på andra sidan bäcken. Men någon vaktar den…", skipWhen: "ring-open" },
        { text: "Prata med Trattis. Hon ser läskig ut – men våga!", skipWhen: "ring-open" },
        { text: "Trattis fråga: {trattis-question:hint}", skipWhen: "ring-open" },
        { text: "Trattis släppte förbi dig! Gå till vänster mot svampringen – tyst förbi jätten.", when: "ring-open" },
      ],
    },
    {
      text: "Vad har hänt vid svampringen?",
      doneWhen: RING_CLUES,
      hints: [
        "Göm dig bakom träden när lysflugorna kommer!",
        { text: "Trattis är här också. Vad har hon hört?", skipWhen: "clue:trattisSaw" },
        { text: "Titta mitt i svampringen.", skipWhen: "clue:tears" },
        { text: "Något lyser i mossan uppe till vänster. Titta noga!", skipWhen: "clue:glowDust" },
        { text: "Under roten uppe till vänster finns en mörk håla…", skipWhen: "clue:hideout" },
        { text: "Trattis har en korg. Vad finns i den?", skipWhen: "clue:lingon" },
      ],
    },
    {
      text: "Vem gråter i skogen – och varför?",
      doneWhen: "solved",
      hints: [
        "Berätta för Trattis vad du har kommit fram till.",
        "Små fotspår och ett tomt bo… Vem är liten och mossig?",
        "Tänk steg för steg: vem fattas vid bäcken? Och vem gråter med liten röst vid ringen?",
        "Varför kom ungen inte hem? Följ spåren och glittret i detektivboken (B)!",
      ],
    },
    {
      text: "Hjälp ungen hem!",
      doneWhen: "caught",
      hints: [
        "Ungen gömmer sig nära. Lyssna efter snyftningar!",
        "Mitt i svampringen finns en mossig kulle…",
        "Läs på kompasstenen: solen går upp i öster, står i söder mitt på dagen och går ner i väster.",
        "Nålen pekar mot norr. Välj väderstrecken i samma ordning som Trattis säger dem.",
      ],
    },
  ],
};
