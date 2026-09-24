import type { Case } from "../../cases/types";
import { S2 } from "../names";

// Case 10 – "Bläckfiskens hemlighet" (the aquarium, BLUE). SPOILER: see SEASON2.md, section 5.
//
// The truth: in the night the little grey pencil monster took the blue out of the water at the pump.
// The octopus lost the colour it hides with, got scared, squirted ink and squeezed through the
// coin-sized drain hole in its tank, down the pipe to the pump room, where it hides as a grey stone
// on the shelves of spare stones. The seal found the door open, ate the octopus's shrimp, and made
// up a shark so nobody would think he had eaten the octopus too.
//
// Theory ladder:
//   Entrance:  "Everything blue is grey. Was it a shark? The robot?" – the board lists every animal (no shark).
//   Big tank:  "The lid is locked, but there's a tiny hole!" – the empty shrimp bucket, Glim glows blue (suspect!),
//              Glim saw something small, grey and DRAWN carry a blue glow.
//   Pump room: "The octopus crawled here by itself!" – ink and sucker marks at the pipe; the camera shows the
//              drawn figure at the pump.
//   Seal pool: "The seal is lying!" – shrimp shells by his rock, and drawn footprints on the way out.
// The reveal asks three questions: where did the octopus go, who is lying, and who took the blue.

const ENTRANCE_CLUES = ["clue:animalBoard", "clue:robotBag"];
const BIGTANK_CLUES = ["clue:drainHole", "clue:emptyBucket", "clue:flipperPrints", "clue:octopusFact", "clue:glimSaw"];
const PUMP_CLUES = ["clue:suckerPrints", "clue:inkSplash", "clue:cameraImage"];
const SEAL_CLUES = ["clue:sealStory", "clue:shrimpShells", "clue:scribblePrints"];

const FADED = 0.55;

export const case10: Case = {
  id: "s2-aquarium",
  number: 10,
  title: "Bläckfiskens hemlighet",
  startRoom: "entrance",
  intro: [
    `${S2.diver} på akvariet ringde. Hon lät andfådd:`,
    `"Nora! Bläckfisken ${S2.octopus} är borta ur sin tank!"`,
    `"Allt blått vatten har blivit grått – och sälen ${S2.seal} säger att han såg en HAJ!"`,
    `Nora och Ester skyndar till akvariet i ${S2.district}…`,
  ],

  rooms: {
    entrance: {
      name: "Entrén",
      theme: "aquarium",
      faded: FADED,
      layout: [
        "#############DD#####",
        "#HHH..a.....t....HH#",
        "#................HH#",
        "#..KKK.............#",
        "#..................#",
        "#.......HH.........#",
        "#.......HH.........D",
        "#..................D",
        "#.r............HH..#",
        "#..............HH..#",
        "#...N..............#",
        "###DD###############",
      ],
      things: {
        a: {
          name: "Skylten Våra djur",
          sprite: "aqAnimalBoard",
          talk: [
            "VÅRA DJUR – OUR ANIMALS",
            "Fiskar – fish. Bläckfisk – octopus.",
            "Säl – seal. Manet – jellyfish.",
            "Krabba – crab. Sjöstjärna – starfish.",
            "\"Här är alla djur som bor i akvariet!\"",
          ],
          clue: "animalBoard",
        },
        t: {
          name: "Biljettautomaten",
          sprite: "aqTicketMachine",
          talk: ["En biljettautomat.", "BILJETTER – TICKETS", "Utan biljett öppnas inte spärren."],
          talkIf: [{ when: "ticket", talk: ["Du har redan en biljett.", "\"Välkommen! – Welcome!\""] }],
          puzzle: "ticket",
        },
        r: {
          name: "Städrobotens laddplats",
          sprite: "aqRobotDock",
          talk: [
            "Här laddar städroboten.",
            "En lapp: \"Roboten städar hela akvariet varje natt.\"",
            "I robotens påse: sand, en knapp och ett godispapper.",
            "Ingen bläckfisk. Puh!",
          ],
          clue: "robotBag",
        },
      },
      onEnter: {
        name: "Ester",
        talk: [
          "Oj, Nora… allt är så grått här inne.",
          "Vattnet i tankarna, skyltarna – till och med fiskarna!",
          "Förut var allt blått här. Nu är det blå borta.",
          "Akta dig för städroboten. Den kör på allt i sin väg!",
        ],
        clue: "blueGone",
      },
      monsters: [{ type: "patroller", sprite: "aqRobot", path: [[1, 4], [18, 4]], speed: 34 }],
      doors: [
        { at: "top", to: "bigtank", requires: "ticket", lockedText: "Spärren är stängd. Den vill ha en biljett." },
        {
          at: "right",
          to: "sealpool",
          requires: "visited:sealpool",
          lockedText: "En dörr ut till sälbassängen. Den är låst – den öppnas bara från andra sidan.",
        },
        { at: "bottom", lockedText: `Vi kan inte gå än. ${S2.octopus} är fortfarande borta!` },
      ],
    },

    bigtank: {
      name: "Stora tanken",
      theme: "aquarium",
      faded: FADED,
      layout: [
        "####DD##############",
        "#HH.......o......HH#",
        "#...2......1.......#",
        "D.....HH.....HH....#",
        "D.....HH.....HH....#",
        "#..................#",
        "#........s.........#",
        "#..............HH..#",
        "#.....HH.......HH..#",
        "#.....HH...........#",
        "#.d................#",
        "#############DD#####",
      ],
      things: {
        d: {
          name: S2.diver,
          sprite: "s2Diver",
          person: true,
          talk: [
            "Nora! Tack för att du kom!",
            `${S2.octopus}, vår bläckfisk, är borta ur sin tank!`,
            "Och allt blått vatten har blivit grått…",
            `${S2.seal} säger att han såg en HAJ i natt!`,
            `Eller har städroboten sugit upp ${S2.octopus}? Den suger upp allt!`,
          ],
          gives: "talked-to-dina",
          talkIf: [
            { when: "caught", talk: [`${S2.octopus} är hemma igen! Tack, Nora!`] },
            {
              when: "solved",
              talk: [
                `Men var är ${S2.octopus} nu?`,
                "En bläckfisk som gömmer sig kan se ut som en sten…",
                "Leta i pumprummet, Nora! Skakar det någonstans?",
              ],
            },
            {
              when: ["clue:sealStory", "clue:suckerPrints"],
              talk: ["Du är nära, Nora! Men något fattas…", "Har du undersökt allt – här, i pumprummet och vid sälbassängen?"],
            },
            {
              when: "clue:flipperPrints",
              talk: [
                "Simfotsspåren? De är mina.",
                "I morse stod dörren till sälbassängen öppen.",
                `Jag sprang ut och tittade. Men där låg bara ${S2.seal}.`,
              ],
            },
            {
              when: "talked-to-dina",
              talk: [
                "Leta överallt, Nora!",
                "Trappan ner till pumprummet har ett kodlås.",
                "Dörren till sälbassängen har ett bokstavslås.",
                "Lösenordet står på min dykartavla – i hemlig kod!",
              ],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: [
            "clue:drainHole",
            "clue:octopusFact",
            "clue:suckerPrints",
            "clue:inkSplash",
            "clue:sealStory",
            "clue:animalBoard",
            "clue:emptyBucket",
            "clue:shrimpShells",
            "clue:cameraImage",
            "clue:glimSaw",
            "clue:scribblePrints",
          ],
          puzzleIntro: ["Nora! Där är du!", `Vet du nu vad som har hänt med ${S2.octopus}?`],
        },
        o: {
          name: `${S2.octopus}s tank`,
          sprite: "aqOctoTank",
          talk: [
            `${S2.octopus}s tank. Den är tom.`,
            "Locket är fortfarande låst. Ingen har öppnat det.",
            "Men längst ner i botten finns ett litet runt hål.",
            "Det är inte större än ett mynt! Ett rör går ner genom golvet.",
          ],
          clue: "drainHole",
        },
        s: {
          name: "Skyltstället",
          sprite: "aqSignStand",
          talk: ["Ett skyltställ med skyltar till tankarna.", "Alla engelska skyltar har ramlat ner!"],
          talkIf: [
            {
              when: "signs-fixed",
              talk: [
                "Nu sitter alla skyltar rätt!",
                "Under OCTOPUS sitter ett faktakort:",
                "\"Bläckfiskar kan byta färg för att gömma sig.\"",
                "\"De kan krypa genom ett hål som är stort som ett mynt!\"",
              ],
              clue: "octopusFact",
            },
          ],
          puzzle: "signs",
        },
      },
      clues: { "1": "emptyBucket", "2": "flipperPrints" },
      onEnter: {
        name: "Ester",
        talk: [
          "Vilken stor tank! Men vattnet är grått här också.",
          "Titta, en manet som svävar! Och hon lyser BLÅTT…",
          "Allt annat blått är ju borta. Konstigt!",
          "Göm dig bakom de små tankarna om hon kommer mot dig.",
        ],
        clue: "glimGlow",
      },
      // Glim floats in a figure-eight and carries Nora off in her long arms. Behind the small tanks she can't see her.
      monsters: [
        {
          type: "flyer",
          sprite: "s2Jellyfish",
          center: [10, 5],
          size: [7, 3],
          perch: [16, 2],
          perchSprite: "s2Jellyfish",
          thing: {
            name: S2.jellyfish,
            sprite: "s2Jellyfish",
            person: true,
            talk: [
              "Blubb… du är snabb, du.",
              `Jag är ${S2.jellyfish}. Jag har ingen hjärna, så jag minns inte så mycket.`,
              "Men jag LYSER i mörkret. Så i natt såg jag något…",
              "Något litet och grått. Det såg ut som en teckning!",
              "Det bar på ett blått sken – ut mot sälbassängen.",
              `Och ${S2.octopus} blev alldeles grå. Sen var ${S2.octopus} borta. Blubb.`,
            ],
            clue: "glimSaw",
          },
        },
      ],
      doors: [
        { at: "bottom", to: "entrance" },
        {
          at: "left",
          to: "pumproom",
          stairs: "down",
          requires: "pump-open",
          puzzle: "pump-lock",
          lockedText: "Trappan ner till pumprummet. Grinden har ett kodlås.",
        },
        {
          at: "top",
          to: "sealpool",
          requires: "sealdoor-open",
          puzzle: "seal-door",
          lockedText: "Dörren till sälbassängen har ett bokstavslås.",
        },
      ],
    },

    pumproom: {
      name: "Pumprummet",
      theme: "storage",
      faded: FADED,
      layout: [
        "####################",
        "#p...HH....HH..KcK.#",
        "#..................#",
        "#.1................D",
        "#......LL....u.....D",
        "#......LL....HH....#",
        "#.HHr........HH....#",
        "#.HH...............#",
        "#.......~~.........#",
        "#.......~~...LL....#",
        "#............LL....#",
        "####################",
      ],
      things: {
        p: {
          name: "Röret",
          sprite: "aqPipe",
          talk: [
            "Ett stort rör kommer ner genom taket.",
            "Det kommer från stora tanken där uppe.",
            "Runt öppningen är det blött… och en svart fläck.",
            "Det är BLÄCK! Bläckfiskar sprutar bläck när de blir rädda.",
          ],
          clue: "inkSplash",
        },
        c: {
          name: "Kameraskärmen",
          sprite: "aqCameraScreen",
          on: "K",
          talk: [
            "En skärm som visar vad kameran här nere såg i natt.",
            "Klockan 03:00. Vid pumpen står något litet och grått…",
            "Det ser ut som en blyertsteckning! Det bär på ett blått sken.",
            "Nästa bild: vattnet i pumpen har blivit grått.",
          ],
          clue: "cameraImage",
        },
        u: {
          name: "Pumpen",
          sprite: "aqPump",
          talk: ["Den stora pumpen. Den pumpar runt vattnet till alla tankar.", "Vattnet i glasröret är grått."],
        },
        r: {
          name: "Lappen på hyllan",
          sprite: "sign",
          talk: ["\"RESERVSTENAR TILL TANKARNA\"", "Grå stenar, runda stenar, stora och små…"],
        },
      },
      clues: { "1": "suckerPrints" },
      onEnter: {
        name: "Ester",
        talk: ["Brr, vad mörkt och blött det är här nere.", "Det droppar från rören… och det låter som om något kryper."],
      },
      // The octopus, disguised as a grey stone: only a stone rolling off a shelf now and then, until Nora
      // finds the sucker marks – then short glimpses of a stone with arms.
      monsters: [
        {
          type: "crawler",
          sprite: "s2Octopus",
          routes: [
            [[3, 2], [9, 2]],
            [[10, 2], [14, 2]],
            [[4, 8], [4, 10], [7, 10]],
            [[15, 6], [17, 6]],
            [[11, 7], [16, 7]],
          ],
          shelters: [[5, 1], [11, 1], [2, 6], [13, 5]],
          unseenUntil: "clue:suckerPrints",
          catchWhen: "solved",
        },
      ],
      doors: [{ at: "right", to: "bigtank", stairs: "up" }],
    },

    sealpool: {
      name: "Sälbassängen",
      theme: "harbor",
      faded: FADED,
      layout: [
        "####################",
        "#RR.....WWWWW....LL#",
        "#......WWWWWWW....L#",
        "#..g...WWWWWWW.....#",
        "#......WWWRWWW.....#",
        "#.......WWWWW..s...#",
        "#............1.....#",
        "D.............RR...#",
        "D.2...........R..a.#",
        "#..LL..............#",
        "#..LL..............#",
        "####DD##############",
      ],
      things: {
        s: {
          name: S2.seal,
          sprite: "s2Seal",
          person: true,
          talk: [
            "Arf! En HAJ! En jättestor haj!",
            "Den simmade ut ur stora tanken i natt.",
            `Den hade vassa tänder… och den åt upp ${S2.octopus}! Arf!`,
            "Jag såg det med mina egna ögon.",
          ],
          clue: "sealStory",
          talkIf: [
            { when: "caught", talk: [`Förlåt igen, ${S2.octopus}.`, "Jag ska aldrig mer hitta på. Arf."] },
            { when: "solved", talk: ["Eh… har ni hittat hajen? Arf…"] },
            {
              when: "clue:shrimpShells",
              talk: ["Räkskal? Vilka räkskal?", "Eh… det var HAJEN! Hajen åt räkor. På min klippa. Arf!"],
            },
            {
              when: "clue:animalBoard",
              talk: ["Ingen haj på skylten? Eh…", "Den kom från havet! Den… hoppade in. Arf!"],
            },
          ],
        },
        a: {
          name: "Skylten",
          sprite: "sign",
          talk: ["SÄL – SEAL", "\"Mata inte sälen! – Don't feed the seal!\"", `${S2.seal} får sill två gånger om dagen.`],
        },
        g: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg – bland snäckorna!", "Det är svalt och blankt… och det gungar lite."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      clues: { "1": "shrimpShells", "2": "scribblePrints" },
      onEnter: {
        name: "Ester",
        talk: [
          "Här är sälbassängen! Det luktar fisk.",
          "Sch… där borta sover valrossen Betan.",
          "Hoppa inte nära henne – då vaknar hon!",
        ],
      },
      monsters: [{ type: "sleeper", sprite: "aqWalrus", at: [9, 8], wakeRadius: 3 }],
      doors: [
        { at: "bottom", to: "bigtank" },
        { at: "left", to: "entrance" },
      ],
    },
  },

  puzzles: {
    ticket: {
      type: "coins",
      title: "Biljettautomaten",
      text: ["BILJETTER – TICKETS", "Barn: {price} kr", "Automaten är sträng: betala med så FÅ mynt och sedlar som möjligt!"],
      price: [25, 75],
      coins: [1, 2, 5, 10, 20, 50],
      fewest: true,
      wrong: "Det räcker inte. Lägg dit lite till!",
      gives: "ticket",
    },
    signs: {
      type: "match",
      title: "Skyltstället",
      text: ["Städroboten har krockat med skyltstället!", "De engelska skyltarna har ramlat ner.", "Vilket ord hör till vilket djur?"],
      pairs: [
        ["fish", "aqPicFish"],
        ["octopus", "aqPicOctopus"],
        ["seal", "aqPicSeal"],
        ["jellyfish", "aqPicJellyfish"],
        ["crab", "aqPicCrab"],
        ["starfish", "aqPicStarfish"],
      ],
      pick: 4,
      rightSprites: true,
      gives: "signs-fixed",
    },
    "pump-lock": {
      type: "code",
      title: "Kodlåset till pumprummet",
      text: [
        "\"KODEN: alla liter vatten i de två tankarna!\"",
        "Stora tanken: {bigL} liter.",
        `${S2.octopus}s tank: {smallL} liter.`,
        "Hur många liter är det tillsammans?",
      ],
      random: { h1: [3, 7], h2: [1, 2], t2: [1, 9] },
      derive: { bigL: "{h1}*100", smallL: "{h2}*100+{t2}*10" },
      answer: "{bigL}+{smallL}",
      answerRange: [400, 990],
      gives: "pump-open",
    },
    "seal-door": {
      type: "word",
      mode: "cipher",
      title: "Dinas dykartavla",
      text: [
        "Bredvid dörren hänger Dinas dykartavla.",
        "Lösenordet står där – i hemlig sifferkod!",
        "Varje siffra är en bokstav: A = 1, B = 2 …",
      ],
      words: ["SÄL", "FISK", "KRABBA", "MANET", "RÄKA", "TÅNG", "SNÄCKA", "HAV"],
      gives: "sealdoor-open",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: `Vart tog ${S2.octopus} vägen?`,
          options: [
            { id: "shark", label: `En haj åt upp ${S2.octopus}` },
            { id: "seal", label: `${S2.seal} åt upp ${S2.octopus}`, sprite: "s2Seal" },
            { id: "robot", label: `Städroboten sög upp ${S2.octopus}`, sprite: "aqRobot" },
            { id: "diver", label: `${S2.diver} bar ut ${S2.octopus}`, sprite: "s2Diver" },
            { id: "pipe", label: `${S2.octopus} kröp genom röret`, sprite: "aqPipe" },
          ],
          answer: "pipe",
          // A locked lid but a coin-sized hole, octopuses fit through coin-sized holes, and at the other
          // end of the pipe: ink and sucker marks.
          proof: ["drainHole", "octopusFact", "suckerPrints", "inkSplash"],
          missing: {
            drainHole: "Hur kommer man ut ur en tank med låst lock? Titta på tanken igen!",
            octopusFact: "Hur små hål kan en bläckfisk krypa igenom? Något sitter på skyltstället.",
            suckerPrints: "Vem har sugkoppar i stället för fötter? Titta på golvet i pumprummet!",
            inkSplash: "Vad sprutar en rädd bläckfisk? Titta vid röret i pumprummet.",
          },
          whyNot: {
            shark: "Titta på skylten i entrén. Finns det några hajar i akvariet?",
            seal: `${S2.seal} åt räkor – skalen visar det. Men ${S2.octopus}s spår går in i röret!`,
            robot: "Titta i robotens påse: sand, en knapp och ett godispapper. Ingen bläckfisk!",
            diver: `${S2.diver} letar ju själv! Och locket på tanken var fortfarande låst.`,
          },
          why: {
            animalBoard: `Skylten visar vilka djur som bor här – men inte vart ${S2.octopus} tog vägen.`,
            robotBag: `Påsen visar att roboten INTE sög upp ${S2.octopus}. Men vart tog ${S2.octopus} vägen då?`,
            blueGone: `Det blå är borta – men det säger inte vart ${S2.octopus} tog vägen.`,
            emptyBucket: "Räkorna är borta – men de visar inte vart bläckfisken tog vägen. Spara hinken!",
            flipperPrints: `Simfotsspåren är ${S2.diver}s. En bläckfisk har inga fötter – bara sugkoppar!`,
            glimGlow: `Att ${S2.jellyfish} lyser blått säger inget om vart ${S2.octopus} tog vägen.`,
            glimSaw: `${S2.jellyfish} såg att ${S2.octopus} försvann – men inte vart.`,
            cameraImage: `Kameran visar den grå figuren, inte ${S2.octopus}. Spara den till en annan fråga!`,
            sealStory: `${S2.seal} säger att en haj åt upp ${S2.octopus}. Men stämmer det? Spara det till nästa fråga!`,
            shrimpShells: `Räkskalen visar vad ${S2.seal} åt – men inte vart ${S2.octopus} tog vägen.`,
            scribblePrints: "De ritade fotspåren är någon annans. Spara dem till en annan fråga!",
          },
        },
        {
          question: "Vem är det som ljuger?",
          options: [
            { id: "seal", label: S2.seal, sprite: "s2Seal" },
            { id: "jelly", label: S2.jellyfish, sprite: "s2Jellyfish" },
            { id: "diver", label: S2.diver, sprite: "s2Diver" },
            { id: "nobody", label: "Ingen – det fanns en haj!" },
          ],
          answer: "seal",
          // He says a shark – there are no sharks here – and he had a reason: the octopus's shrimp are gone,
          // and the shells lie by his rock.
          proof: ["sealStory", "animalBoard", "emptyBucket", "shrimpShells"],
          missing: {
            sealStory: "Vem har sagt något som inte stämmer? Vad sa sälen vid bassängen?",
            animalBoard: "Finns det ens hajar i akvariet? En skylt visar alla djur som bor här…",
            emptyBucket: `Någon hade en anledning att ljuga. Vad saknades vid ${S2.octopus}s tank?`,
            shrimpShells: "Vart tog räkorna vägen? Titta noga vid sälbassängen.",
          },
          whyNot: {
            jelly: `${S2.jellyfish} minns dåligt – men det hon såg stämmer med kamerabilden.`,
            diver: `Allt ${S2.diver} har sagt stämmer. Hon ringde ju själv efter hjälp!`,
            nobody: "Titta på skylten i entrén. Står det någon haj där?",
          },
          why: {
            drainHole: `Ja, ${S2.octopus} kröp iväg själv – ingen haj åt upp någon! Men ${S2.seal} kunde ju ha sett fel. Vad visar att han ljög med flit?`,
            octopusFact: `Faktakortet visar hur ${S2.octopus} kom ut. Men vad visar att någon ljög med flit – och varför?`,
            suckerPrints: `Sugkoppsmärkena visar vart ${S2.octopus} tog vägen. Men varför skulle någon hitta på en haj?`,
            inkSplash: `Bläcket visar att ${S2.octopus} blev rädd och kröp iväg. Men vad visar att någon ljög med flit?`,
            robotBag: "Roboten pratar inte – den kan inte ljuga!",
            blueGone: "Att det blå är borta säger inget om vem som ljuger.",
            flipperPrints: `${S2.diver} sprang ut till sälbassängen i morse. Spåren stämmer med det hon sa!`,
            glimGlow: `${S2.jellyfish} lyser blått – men det betyder inte att hon ljuger.`,
            glimSaw: `Det ${S2.jellyfish} såg stämmer med kamerabilden. Hon talar sanning!`,
            cameraImage: "Kameran sitter i pumprummet. Den kan inte se stora tanken.",
            scribblePrints: "Fotspåren visar vem som tog det blå – spara dem till nästa fråga!",
          },
        },
        {
          question: "Vem tog det blå?",
          options: [
            { id: "drawn", label: "Den lilla grå, ritade figuren", sprite: "s2Scribble" },
            { id: "jelly", label: S2.jellyfish, sprite: "s2Jellyfish" },
            { id: "octopus", label: S2.octopus, sprite: "aqPicOctopus" },
            { id: "seal", label: S2.seal, sprite: "s2Seal" },
            { id: "robot", label: "Städroboten", sprite: "aqRobot" },
          ],
          answer: "drawn",
          // The camera saw it at the pump, Glim saw it carry the blue out, and its drawn footprints lead away.
          proof: ["cameraImage", "glimSaw", "scribblePrints"],
          missing: {
            cameraImage: "Någon har filmat natten. Titta på skärmen i pumprummet!",
            glimSaw: `Någon som lyser i mörkret såg något i natt. Vad sa ${S2.jellyfish}?`,
            scribblePrints: "Vart gick den som bar det blå? Titta på bryggan vid sälbassängen.",
          },
          whyNot: {
            jelly: `${S2.jellyfish} lyser blått av sig själv – det gör vissa maneter. Men hon har inga händer att bära med!`,
            octopus: `En bläckfisk byter färg på sin egen hud. ${S2.octopus} kan inte ta färg ur vattnet – och blev själv grå!`,
            seal: `${S2.seal} åt räkor. Men på kamerabilden syns något litet och grått – inte en säl.`,
            robot: "Roboten suger upp skräp, inte färg. Titta i robotens påse!",
          },
          why: {
            drainHole: `Hålet visar hur ${S2.octopus} kom ut – inte vem som tog det blå.`,
            octopusFact: "Bläckfiskar byter färg på sin egen hud. De tar ingen färg från vattnet.",
            suckerPrints: `Sugkoppsmärkena är ${S2.octopus}s. Men det var inte ${S2.octopus} som tog det blå.`,
            inkSplash: "Bläcket är svart, inte blått. Det kommer från den rädda bläckfisken.",
            animalBoard: "Skylten visar djuren i akvariet – men inte vem som tog det blå.",
            robotBag: "I påsen finns sand och en knapp – ingen blå färg.",
            blueGone: "Ja, det blå är borta! Men VEM tog det?",
            emptyBucket: "Räkorna har inget med det blå att göra.",
            flipperPrints: `Simfotsspåren är ${S2.diver}s. Hon letade efter ${S2.octopus}.`,
            glimGlow: `${S2.jellyfish} lyser blått av sig själv. Men vem BAR det blå skenet?`,
            sealStory: `${S2.seal}s haj fanns ju inte!`,
            shrimpShells: `Räkskalen visar vad ${S2.seal} åt – inte vem som tog det blå.`,
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    blueGone: {
      name: "Det blå är borta",
      sprite: "aqGreyTank",
      text: "Allt blått i akvariet har blivit grått i natt: vattnet, skyltarna, till och med fiskarna.",
    },
    animalBoard: {
      name: "Skylten Våra djur",
      sprite: "aqAnimalBoard",
      text: "Skylten i entrén visar ALLA djur i akvariet: fiskar, bläckfisken, sälen, maneter, krabbor och sjöstjärnor.",
    },
    robotBag: {
      name: "Robotens påse",
      sprite: "aqRobotDock",
      text: "Städroboten städar hela akvariet varje natt. I dess påse: sand, en knapp och ett godispapper. Ingen bläckfisk.",
    },
    drainHole: {
      name: "Hålet i tanken",
      sprite: "aqOctoTank",
      text: `Locket på ${S2.octopus}s tank är fortfarande låst. Men i botten finns ett runt hål, stort som ett mynt, till ett rör.`,
    },
    emptyBucket: {
      name: "Den tomma räkhinken",
      sprite: "aqShrimpBucket",
      text: `${S2.octopus}s räkhink är tom! På hinken står det: "Räkor – bara till ${S2.octopus}!"`,
    },
    flipperPrints: {
      name: "Simfotsspår",
      sprite: "aqFlipperPrints",
      text: "Blöta spår av stora simfötter. De går från tanken till dörren till sälbassängen.",
    },
    octopusFact: {
      name: "Faktakortet",
      sprite: "aqPicOctopus",
      text: "Bläckfiskar kan byta färg för att gömma sig. De kan krypa genom ett hål som är stort som ett mynt!",
    },
    glimGlow: {
      name: `${S2.jellyfish} lyser blått`,
      sprite: "s2Jellyfish",
      text: `Allt blått i akvariet har blivit grått – men maneten ${S2.jellyfish} lyser fortfarande blått!`,
    },
    glimSaw: {
      name: `${S2.jellyfish}s vittnesmål`,
      sprite: "s2Jellyfish",
      text: `${S2.jellyfish} såg något litet och grått som såg ut som en teckning. Det bar ett blått sken ut mot sälbassängen. Sen blev ${S2.octopus} grå och var borta.`,
    },
    suckerPrints: {
      name: "Runda märken",
      sprite: "aqSuckerPrints",
      text: "Små runda, blöta märken på golvet i pumprummet – som från sugkoppar. De kommer från röret.",
    },
    inkSplash: {
      name: "Bläck vid röret",
      sprite: "aqInk",
      text: "En svart bläckfläck vid röret i pumprummet. Röret kommer från stora tanken. Bläckfiskar sprutar bläck när de blir rädda.",
    },
    cameraImage: {
      name: "Kamerabilden",
      sprite: "aqCameraScreen",
      text: "Kameran i pumprummet, klockan 03:00: något litet och grått som ser RITAT ut står vid pumpen. Det bär på ett blått sken. Sedan är vattnet grått.",
    },
    sealStory: {
      name: `${S2.seal}s vittnesmål`,
      sprite: "s2Seal",
      text: `${S2.seal} säger att en stor haj med vassa tänder simmade ut ur stora tanken i natt och åt upp ${S2.octopus}.`,
    },
    shrimpShells: {
      name: "Räkskal",
      sprite: "aqShrimpShells",
      text: `Massor av räkskal vid sälbassängen, där ${S2.seal} bor. Men ${S2.seal} ska ju bara äta sill…`,
    },
    scribblePrints: {
      name: "Ritade fotspår",
      sprite: "s2ScribblePrints",
      text: "Små grå fotspår på bryggan. De ser RITADE ut, som med blyerts. De går mot utgången.",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    ticket: { name: "Biljetten", sprite: "aqTicket" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    "drop-blue": { name: "Den blå droppen", sprite: "dropBlue" },
  },

  finale: [
    { say: "Nora", lines: ["Hittade dig!", "En sten… med ÅTTA armar!"] },
    { say: S2.octopus, lines: ["Blubb! Snälla, ät inte upp mig!", "Jag är bara en sten. En väldigt rädd sten."] },
    { say: "Ester", lines: ["Ingen ska äta upp dig.", "Vi har letat efter dig hela dagen!"] },
    {
      say: S2.octopus,
      lines: [
        "I natt kom något litet och grått.",
        "Det tog allt blått ur vattnet!",
        "Jag försökte byta färg och gömma mig…",
        "…men utan blått blev jag bara grå och rädd.",
        "Så jag sprutade bläck och kröp genom hålet.",
      ],
    },
    { enter: "diver", sprite: "s2Diver", from: [19, 3], to: [16, 4] },
    { say: S2.diver, lines: [`${S2.octopus}! Du är inte uppäten!`, "Ingen haj i världen ska få röra dig."] },
    { enter: "seal", sprite: "s2Seal", from: [19, 4], to: [17, 6] },
    {
      say: S2.seal,
      lines: [
        "Eh… om hajen…",
        "Det fanns ingen haj. Jag hittade på.",
        `Jag åt ${S2.octopus}s räkor.`,
        `Jag var rädd att ni skulle tro att jag åt ${S2.octopus} också.`,
        "Förlåt. Arf.",
      ],
    },
    { say: S2.diver, lines: [`Tack för att du säger sanningen, ${S2.seal}.`, "Det är modigt – även när det är jobbigt."] },
    { flash: true },
    { frame: "culprit", index: 2 },
    {
      say: S2.octopus,
      lines: ["Titta! När jag är glad får jag färg igen!", "Och jag hittade en sak i natt.", "Den grå figuren tappade den vid pumpen."],
    },
    { reveal: "culprit", sprite: "dropBlue" },
    { say: "Ester", lines: ["En blå droppe! Precis som de andra.", "Färgen rinner av den grå figuren…"] },
    {
      say: "Nora",
      lines: ["Den ritade figuren tar en färg i taget.", "Vart är den på väg? Vi måste hitta den!"],
    },
    { give: "drop-blue" },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    `Locket på ${S2.octopus}s tank var låst. Men i botten fanns ett hål stort som ett mynt – och bläckfiskar kan krypa genom så små hål!`,
    `I pumprummet fanns bläck och sugkoppsmärken vid röret. ${S2.octopus} kröp dit själv och gömde sig som en sten.`,
    `${S2.seal} sa att han såg en haj. Men skylten i entrén visar att det inte finns några hajar här!`,
    `${S2.octopus}s räkor var borta, och skalen låg vid sälbassängen. ${S2.seal} åt dem och hittade på hajen för att inte bli skyldig.`,
    `Och det blå? Kameran och ${S2.jellyfish} såg en liten grå, ritad figur med ett blått sken. Den lämnade dörren till sälbassängen öppen – och ritade fotspår efter sig.`,
  ],

  fact: "En bläckfisk har tre hjärtan och blått blod! Två av hjärtana pumpar blod till gälarna, och det tredje till resten av kroppen.",

  cards: [
    {
      sprite: "s2Jellyfish",
      name: S2.jellyfish,
      text: "En manet som svävar och lyser i mörkret. Hon har ingen hjärna – men hon ser allt! Göm dig bakom en tank när hon kommer.",
    },
    {
      sprite: "s2Octopus",
      name: S2.octopus,
      text: "Tre hjärtan, blått blod och åtta armar. Kan krypa genom ett hål stort som ett mynt – och se ut som en sten!",
    },
    {
      sprite: "s2Seal",
      name: S2.seal,
      text: "En säl som älskar räkor lite för mycket. Han hittade på en haj – men sa förlåt till slut.",
    },
  ],

  goals: [
    {
      text: "Leta efter ledtrådar i entrén",
      doneWhen: ENTRANCE_CLUES,
      hints: [
        { text: "Läs den stora skylten uppe till vänster.", skipWhen: "clue:animalBoard" },
        { text: "Städroboten har en laddplats nere till vänster. Vad finns i dess påse?", skipWhen: "clue:robotBag" },
        "Akta dig för städroboten! Gå förbi när den har kört åt andra hållet.",
      ],
    },
    {
      text: "Ta dig in i akvariet",
      doneWhen: "visited:bigtank",
      hints: [
        { text: "Spärren vill ha en biljett. Biljettautomaten står vid dörren uppe till höger.", skipWhen: "ticket" },
        { text: "En barnbiljett kostar {price} kr. Betala med så få mynt och sedlar som möjligt!", skipWhen: "ticket" },
        { text: "Börja med den största sedeln som inte blir för mycket. Det går med {fewest} mynt och sedlar.", skipWhen: "ticket" },
        { text: "Du har en biljett! Gå in genom dörren längst upp.", when: "ticket" },
      ],
    },
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-dina",
      hints: [`${S2.diver} väntar inne vid stora tanken.`, `${S2.diver} står nere till vänster i stora tanken. Gå fram och tryck Ctrl.`],
    },
    {
      text: "Undersök stora tanken",
      doneWhen: BIGTANK_CLUES,
      hints: [
        { text: `Titta på ${S2.octopus}s tank uppe vid väggen.`, skipWhen: "clue:drainHole" },
        { text: "Titta noga på golvet!", skipWhen: ["clue:emptyBucket", "clue:flipperPrints"] },
        { text: "Skyltarna har ramlat ner från skyltstället i mitten. Kan du sätta tillbaka dem?", skipWhen: "signs-fixed" },
        {
          text: "Skylten i entrén säger vad djuren heter på engelska. Starfish = stjärn-fisk!",
          skipWhen: "signs-fixed",
        },
        { text: "Läs på skyltstället igen – nu när skyltarna sitter rätt!", when: "signs-fixed", skipWhen: "clue:octopusFact" },
        { text: `Göm dig bakom de små tankarna när ${S2.jellyfish} dyker.`, skipWhen: "clue:glimSaw" },
        {
          text: `Missar ${S2.jellyfish} dig två gånger blir hon trött och vilar uppe till höger. Då kan ni prata!`,
          skipWhen: "clue:glimSaw",
        },
      ],
    },
    {
      text: "Undersök pumprummet",
      doneWhen: PUMP_CLUES,
      hints: [
        { text: "Trappan ner till pumprummet är till vänster i stora tanken. Den har ett kodlås.", skipWhen: "pump-open" },
        { text: "Koden är alla liter i de två tankarna: {bigL} och {smallL}.", skipWhen: "pump-open" },
        { text: "Lägg ihop hundratalen först, sedan tiotalen. {bigL} + {smallL} = ?", skipWhen: "pump-open" },
        { text: "Titta vid röret uppe till vänster.", when: "visited:pumproom", skipWhen: ["clue:inkSplash", "clue:suckerPrints"] },
        { text: "Kameraskärmen på bänken visar vad som hände i natt.", when: "visited:pumproom", skipWhen: "clue:cameraImage" },
      ],
    },
    {
      text: "Vad hände vid sälbassängen?",
      doneWhen: SEAL_CLUES,
      hints: [
        { text: "Dörren till sälbassängen är högst upp i stora tanken. Den har ett bokstavslås.", skipWhen: "sealdoor-open" },
        { text: "Lösenordet står i sifferkod: A = 1, B = 2 … Tabellen står under koden.", skipWhen: "sealdoor-open" },
        { text: "Lösenordet börjar på {seal-door:first} och har {seal-door:length} bokstäver.", skipWhen: "sealdoor-open" },
        { text: `Prata med ${S2.seal} vid bassängen. Men väck inte valrossen!`, when: "sealdoor-open", skipWhen: "clue:sealStory" },
        {
          text: "Titta noga på bryggan runt bassängen.",
          when: "sealdoor-open",
          skipWhen: ["clue:shrimpShells", "clue:scribblePrints"],
        },
      ],
    },
    {
      text: `Vart tog ${S2.octopus} vägen – och vem tog det blå?`,
      doneWhen: "solved",
      hints: [
        `Berätta för ${S2.diver} vad du har kommit fram till.`,
        "Tänk: Hur kommer man ut ur en låst tank? Finns det hajar här? Vem syns på kamerabilden?",
        "Titta i detektivboken (B). Vad kan en bläckfisk krypa igenom? Vem hade ätit räkorna?",
      ],
    },
    {
      text: `Hitta ${S2.octopus}!`,
      doneWhen: "caught",
      hints: [
        `${S2.octopus} gömmer sig fortfarande. En bläckfisk kan se ut som en sten!`,
        "Gå ner till pumprummet. På vilken hylla skakar stenarna?",
        "Gå fram till hyllan där stenarna skakar och tryck Ctrl!",
      ],
    },
  ],
};
