import type { Case } from "../../cases/types";
import { S2 } from "../names";

// Case 11 – Karusellen som stannade (the fair – ORANGE). SPOILER: see SEASON2.md.
//
// The truth: the carousel can't start because the director lost the key himself. After the
// last ride he ate cotton candy on his evening round, and the key slipped through a hole in his
// coat pocket into the cotton-candy machine. He was ashamed and blamed the clown – a grown-up
// who lies. The clown hid. The "mirror ghost" Smulan saw was the clown's white face in the
// carousel mirrors. The orange was taken by S2.scribble, who talked to the clown in the night:
// its name, and that it was going "home to the museum" (sets up case 12).
//
// Built as a "theory ladder": every room changes what Nora believes.
//   Square:   "The director says the clown did it, Smulan says a ghost…" – but his time doesn't
//             fit the ride schedule, and orange drops lead out towards the road.
//   Mirrors:  "It wasn't the clown or the ghost!" – the ghost can't leave the glass, the fun
//             mirrors make ghosts, and the clown's mirror-writing note names S2.scribble and the museum.
//   Carousel: "The key was never stolen!" – it lies in the cotton-candy machine, and Fladder saw
//             the director alone there, searching his pocket. Drawn footprints lead away.
//   Wagon:    "He lost it himself." – the hole in his coat pocket.
// The reveal asks three questions: why the carousel won't start, who isn't telling the truth,
// and who takes the colours and where it is going. Each needs clues from several rooms.

const SQUARE_CLUES = ["clue:directorClaim", "clue:schedule", "clue:greyOrange", "clue:orangeDrops", "clue:poster", "clue:ghostFace"];
const MIRROR_CLUES = ["clue:clownNote", "clue:siggeMirrors", "clue:mirrorTrick"];
const CAROUSEL_CLUES = ["clue:sugarKey", "clue:fladderSaw", "clue:scribblePrints", "clue:bunCrumbs", "clue:clownNose", "clue:pinkScales"];
const WAGON_CLUES = ["clue:pocketHole", "clue:friendsPhoto"];

const FADED = 0.65;

export const case11: Case = {
  id: "s2-fair",
  number: 11,
  title: "Karusellen som stannade",
  startRoom: "square",
  intro: [
    `Ett brev kommer från tivolit i ${S2.district}:`,
    "\"Karusellen har stannat, och alla orange ballonger har blivit grå!\"",
    `"Clownen ${S2.clown} har gömt sig – det måste vara han! / ${S2.director}"`,
    "Nora och Ester skyndar dit…",
  ],

  rooms: {
    square: {
      name: "Tivoliplatsen",
      theme: "fair",
      faded: FADED,
      layout: [
        "##############DD####",
        "##############..####",
        "#HHH..b......s...pH#",
        "D.................H#",
        "D.........d........#",
        "#..t...............#",
        "#..........LL......#",
        "#..............mKK.D",
        "#HH................D",
        "#HH..1.......HH....#",
        "#.......N....HH....#",
        "####DD##############",
      ],
      things: {
        d: {
          name: S2.director,
          person: true,
          sprite: "s2Director",
          talk: [
            "Äntligen! Detektiven är här!",
            "Karusellen har stannat. Den går inte att starta!",
            "Och allt orange på tivolit har blivit grått.",
            `Det var clownen ${S2.clown}. Han tog karusellnyckeln!`,
            "Jag såg det själv. Tio i nio i går – mitt under ett åk!",
            "Och nu har han gömt sig. Det säger väl allt?",
          ],
          gives: "talked-to-director",
          clue: "directorClaim",
          talkIf: [
            {
              when: "caught",
              talk: ["Tack, Nora. Och förlåt – en gång till.", "Nu syr jag alltid igen mina fickor."],
            },
            {
              when: "solved",
              talk: [
                "Ja… det var jag som tappade nyckeln.",
                `Jag skämdes så. Därför skyllde jag på ${S2.clown}.`,
                "Det var fel av mig. Nu gömmer han sig – för min skull!",
                "Snälla Nora, hitta honom. Jag vill säga förlåt.",
              ],
            },
            {
              when: "visited:wagon",
              talk: ["Du… du har varit i min vagn?", "Du ser ut som om du nästan vet något.", "Du är nära… men något fattas nog. Ha… ha."],
            },
            {
              when: "clue:sugarKey",
              talk: ["Nyckeln? I sockervadden!? Hur hamnade den där?", `Det… det måste ${S2.clown} ha gjort. Ja! Visst.`],
            },
            {
              when: "clue:clownNote",
              talk: [`En lapp från ${S2.clown}? Äsch. Clowner skojar jämt.`, "Lita aldrig på en clown, Nora!"],
            },
            {
              when: "talked-to-director",
              talk: [
                `Hitta ${S2.clown}, Nora! Han gömmer sig någonstans.`,
                "Och gå INTE till karusellen. Där finns inget att se!",
              ],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: [...SQUARE_CLUES, ...MIRROR_CLUES, ...CAROUSEL_CLUES, ...WAGON_CLUES],
          puzzleIntro: ["Nå, detektiven? Du har letat överallt.", `Visst var det ${S2.clown}?`, "…Eller vad har du kommit fram till?"],
        },
        m: {
          name: "Smulan",
          person: true,
          sprite: "smulan",
          talk: [
            "Mums… hej Nora! Vill du köpa en bulle?",
            "Jag säljer bullar på tivolit nu. Bästa jobbet i världen!",
            `${S2.clown} köpte en bulle i går. Han sa HEJDÅ när han kom.`,
            "Han gör allt baklänges. Han är ju clown!",
            "Men sen såg jag något läskigt i karusellens speglar.",
            "Ett STORT vitt ansikte med en röd prick i mitten!",
            "Spegelspöket! Jag sprang hem med alla bullarna.",
          ],
          clue: "ghostFace",
          talkIf: [
            { when: "caught", talk: ["Bullar till alla! Även till direktören.", "Mums!"] },
            {
              when: "clue:bunCrumbs",
              talk: [
                "Smulor vid karusellen? Ja, de är mina!",
                "Jag sålde bullar till ALLA som åkte i går.",
                "Men nycklar äter jag inte. De smakar inte bulle.",
              ],
            },
          ],
        },
        t: {
          name: "Biljettluckan",
          sprite: "fairTicketBooth",
          talk: ["Biljettluckan. Ingen är här i dag.", "Det står: \"Spegellabyrinten. Lägg pengarna i burken!\""],
          talkIf: [{ when: "ticket", talk: ["Du har en biljett till spegellabyrinten!", "Ingången är till vänster."] }],
          puzzle: "tickets",
        },
        s: {
          name: "Åkschemat",
          sprite: "fairSchedule",
          talk: [
            "ÅKSCHEMA – KARUSELLEN",
            "Varje kväll från klockan fem till kvart i nio.",
            "Efter sista åket låser direktören karusellen.",
          ],
          clue: "schedule",
        },
        p: {
          name: "Affischen",
          sprite: "fairPoster",
          talk: [
            "En ny affisch:",
            "\"NYA KONSTMUSEET ÖPPNAR SNART!\"",
            `"Utställning: ${S2.painter}"`,
            "\"Vägen dit: gå ut genom tivolits utgång och följ vägen till slutet.\"",
          ],
          clue: "poster",
        },
        b: {
          name: "Ballongståndet",
          sprite: "fairBalloonsGrey",
          talk: [
            "Ballongerna är grå. Alla som var orange!",
            "De röda är också bleka…",
            "…men det orange är helt BORTA.",
          ],
          clue: "greyOrange",
        },
      },
      clues: { "1": "orangeDrops" },
      onEnter: {
        name: "Ester",
        talk: [
          "Tivolit! Men… det är så grått här, Nora.",
          "Förut var det fullt av orange ballonger och lampor.",
          "Hör du? Någon skriker WIIII bakom grinden!",
          "Kom, vi pratar med direktören.",
        ],
      },
      movers: [{ sprite: "fairBalloon", path: [[4, 3], [12, 3]], speed: 10, pause: 3000 }],
      monsters: [
        // The clown. First only the toys in the prize stands rustle; once Nora has read his note he is
        // glimpsed scurrying between the stands; at the end he hides in one of them.
        {
          type: "crawler",
          sprite: "s2Clown",
          routes: [
            [[4, 9], [8, 9]],
            [[16, 4], [16, 6]],
            [[3, 6], [3, 8]],
            [[11, 8], [15, 8]],
          ],
          shelters: [[2, 2], [18, 3], [1, 9], [13, 9]],
          unseenUntil: "clue:clownNote",
          catchWhen: "solved",
        },
      ],
      doors: [
        {
          at: "left",
          to: "mirrors",
          requires: "ticket",
          lockedText: "Spegellabyrinten! Men man kommer bara in med en biljett.",
        },
        {
          at: "top",
          to: "carousel",
          requires: "gate-open",
          puzzle: "gateClock",
          lockedText: "Grinden till karusellen är låst med ett klocklås.",
        },
        {
          at: "right",
          to: "wagon",
          stairs: "up",
          requires: "wagon-open",
          puzzle: "wagonLock",
          lockedText: "Trappan upp till direktörens vagn. Dörren har ett kodlås.",
        },
        { at: "bottom", lockedText: `Vi kan inte gå än! Karusellen står still, och ${S2.clown} gömmer sig.` },
      ],
    },

    mirrors: {
      name: "Spegellabyrinten",
      theme: "tower",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#g...#.....f..#...s#",
        "#.##.#.###.##.#....D",
        "#.#..#...#..#.#.##.D",
        "#.#.####.#..#...#..#",
        "#.#......#..###.#..#",
        "#.####.#n#......#.##",
        "#........####.###..#",
        "###.####....#...#..#",
        "#e..#......o#.#....#",
        "####################",
      ],
      things: {
        g: {
          name: "Den stora spegeln",
          sprite: "fairMirror",
          talk: [
            "En stor spegel i guldram.",
            "I spegeln står Nora… och Ester…",
            "…och bakom dem står någon ANNAN!?",
          ],
          gives: "touched-mirror",
          talkIf: [{ when: "clue:siggeMirrors", talk: [`${S2.mirrorGhost} vinkar inifrån spegeln.`, "Hej då, Sigge!"] }],
        },
        f: {
          name: "Den buckliga spegeln",
          sprite: "fairMirrorWavy",
          talk: [
            "En bucklig spegel! Nora blir lång och smal.",
            "Och i hörnet blir hon TRE Noror.",
            "Här inne kan spegelbilder se ut som spöken!",
          ],
          clue: "mirrorTrick",
        },
        o: {
          name: "En spegel",
          sprite: "fairMirror",
          talk: [
            "Nora vinkar med sin HÖGRA hand.",
            "Spegel-Nora vinkar med sin VÄNSTRA!",
            "En spegel byter plats på höger och vänster.",
          ],
        },
        n: {
          name: "En lapp på spegeln",
          sprite: "fairMirrorNote",
          talk: ["En lapp sitter fast på en spegel.", "Bokstäverna står åt fel håll!"],
          talkIf: [
            {
              when: "note-read",
              talk: [
                `Lappen från ${S2.clown}:`,
                "\"Det var inte jag som tog nyckeln!\"",
                "\"I natt såg jag en liten grå figur vid karusellen.\"",
                "\"Den såg RITAD ut. Den bar på något orange som lyste.\"",
                `"Den sa: Jag heter ${S2.scribble}. Nu går jag hem till museet."`,
                `"Jag gömmer mig tills någon tror på mig. / ${S2.clown}"`,
              ],
              clue: "clownNote",
            },
          ],
          puzzle: "note",
          puzzleIntro: [
            "En lapp sitter fast på en spegel.",
            "Bokstäverna står åt fel håll – det är spegelskrift!",
            "Kan du läsa den?",
          ],
        },
        s: {
          name: "Skylt",
          sprite: "sign",
          talk: ["SPEGELLABYRINTEN", "Hitta rätt väg – om du kan!", "(Akta dig för spegelspöket…)"],
        },
        e: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg – längst in i labyrinten!", "Det är varmt… och det speglar sig i allt."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      onEnter: {
        name: "Ester",
        talk: [
          "Oj! Speglar överallt, Nora.",
          "Där är tre Noror… och fyra Ester!",
          "Titta noga. Vad är på riktigt – och vad är spegelbilder?",
        ],
      },
      monsters: [
        {
          type: "sneaker",
          sprite: "s2MirrorGhost",
          home: [1, 2],
          calmWhen: "clue:siggeMirrors",
          hideUntil: { when: "touched-mirror", delay: 2 },
          thing: {
            name: S2.mirrorGhost,
            person: true,
            sprite: "s2MirrorGhost",
            talk: [
              "Ooooh… en besökare!",
              `Jag är ${S2.mirrorGhost}. Jag bor i glaset.`,
              "Alla tror att jag tog färgerna. Men jag kan inte gå ut härifrån!",
              "Utanför speglarna finns jag inte. Poff – borta.",
              "Jag har aldrig ens sett karusellen.",
              `Men ${S2.clown} var här i morse. Han skrev något på en spegel – baklänges, förstås.`,
            ],
            clue: "siggeMirrors",
          },
        },
      ],
      doors: [{ at: "right", to: "square" }],
    },

    carousel: {
      name: "Karusellen",
      theme: "fair",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#r...........KvK...#",
        "#.......3..........#",
        "#..LL..............#",
        "#..LL..hci.k....HH.#",
        "#...........2...HH.#",
        "#.....1............#",
        "#..HH.........LL...#",
        "#..HH.........LL...#",
        "#..................#",
        "#####DD#############",
      ],
      things: {
        c: {
          name: "Karusellen",
          sprite: "fairCarousel",
          talk: [
            "Karusellen står helt still.",
            "Taket hade orange ränder förut. Nu är de grå.",
            "Mitt i karusellen sitter speglar runt stången.",
          ],
        },
        h: {
          name: "En karusellhäst",
          sprite: "fairHorse",
          talk: ["En karusellhäst på en gyllene stång.", "Den var orange förut. Nu är den grå som sten."],
        },
        i: {
          name: "En karusellhäst",
          sprite: "fairHorse",
          talk: ["En till grå häst.", "På sadeln glittrar något…", "Rosa fjäll! Precis som Fladders vingar."],
          clue: "pinkScales",
        },
        k: {
          name: "Kontrollådan",
          sprite: "fairControlBox",
          talk: ["Karusellens kontrollåda.", "Nyckelhålet är tomt.", "Utan nyckel går karusellen inte att starta."],
          talkIf: [{ when: "carousel-key", talk: ["Nyckelhålet är tomt.", "Nyckeln har vi – men först ska fallet lösas!"] }],
        },
        v: {
          name: "Sockervaddsmaskinen",
          sprite: "fairCandyMachine",
          on: "K",
          talk: [
            "Sockervaddsmaskinen. Allt är klibbigt.",
            "Vänta… något blänker längst ner i sockret!",
            "Det är karusellnyckeln!",
          ],
          gives: "carousel-key",
          clue: "sugarKey",
          talkIf: [{ when: "carousel-key", talk: ["Sockervaddsmaskinen.", "Mums… men så KLIBBIGT."] }],
        },
        r: {
          name: "Berg-och-dalbanan",
          sprite: "fairCoaster",
          talk: ["Berg-och-dalbanan! Vagnarna står på rad.", "Varje vagn har två platser.", "\"WIIII!\" hörs det uppifrån."],
        },
      },
      clues: { "1": "scribblePrints", "2": "bunCrumbs", "3": "clownNose" },
      onEnter: {
        name: "Ester",
        talk: [
          "Karusellen står helt still. Och hästarna är grå.",
          "Titta – på berg-och-dalbanan! Det är ju Fladder!",
          "Hon är inte rädd för någonting. Göm dig bakom stånden när hon dyker!",
        ],
      },
      monsters: [
        {
          type: "flyer",
          sprite: "fladder",
          center: [10, 7],
          size: [6, 3],
          perch: [1, 3],
          perchSprite: "fladderHang",
          thing: {
            name: "Fladder",
            person: true,
            sprite: "fladderHang",
            talk: [
              "Wiiii! Vad vill DU? Jag åker berg-och-dalbana!",
              "Jag är inte rädd för NÅGONTING. Inte ens för loopen.",
              "I går åkte jag hela kvällen. Uppifrån ser man allt!",
              "Karusellen stannade kvart i nio. Som vanligt.",
              "Ingen ryckte i någon nyckel. Ingen alls!",
              "Sen stod direktören vid sockervadden och åt.",
              "Plötsligt klappade han på fickan… och letade och letade.",
            ],
            clue: "fladderSaw",
          },
        },
      ],
      doors: [{ at: "bottom", to: "square" }],
    },

    wagon: {
      name: "Direktörens vagn",
      theme: "shop",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#HHH.....f....KK.j.#",
        "#..................#",
        "#..................#",
        "D.......LL.........#",
        "D..................#",
        "#..................#",
        "#..w...........HH..#",
        "#..............HH..#",
        "#KK................#",
        "####################",
      ],
      things: {
        j: {
          name: "Direktörens rock",
          sprite: "fairCoat",
          talk: [
            "Direktörens fina röda rock hänger på en krok.",
            "Den är klibbig av sockervadd.",
            "Och i högra fickan… ett stort HÅL!",
          ],
          clue: "pocketHole",
        },
        f: {
          name: "Ett foto",
          sprite: "fairPhoto",
          talk: [
            "Ett foto på väggen.",
            `Direktören och ${S2.clown} skrattar tillsammans.`,
            "Under står det: \"Tivolits bästa vänner\".",
          ],
          clue: "friendsPhoto",
        },
        w: {
          name: "Lappar",
          sprite: "fairNotes",
          talk: [
            "Gula lappar överallt!",
            "\"Glöm inte koden!\" \"Var är mina glasögon?\"",
            "\"Glöm inte att sy fickan!!!\"",
            "Direktören glömmer visst allt.",
          ],
        },
      },
      onEnter: {
        name: "Ester",
        talk: [
          "Direktörens vagn. Så stökigt!",
          "Shhh… titta! Ett jättestort fluffigt monster sover på golvet.",
          "Hoppa inte nära det. Smyg!",
        ],
      },
      monsters: [{ type: "sleeper", sprite: "fairVaddis", at: [11, 6], wakeRadius: 3 }],
      doors: [{ at: "left", to: "square", stairs: "down" }],
    },
  },

  puzzles: {
    tickets: {
      type: "coins",
      title: "Biljetten",
      text: ["På luckan står det:", "\"Spegellabyrinten: {price} kr.\"", "Lägg precis rätt summa i burken."],
      price: [25, 95],
      coins: [1, 2, 5, 10, 20, 50],
      gives: "ticket",
    },
    gateClock: {
      type: "clock",
      title: "Klocklåset",
      text: [
        "Grinden har ett lås som ser ut som en klocka.",
        "Direktören har satt en lapp bredvid:",
        "\"Låset öppnas {time}. Glöm inte!\"",
        "Vilken klocka visar {time}?",
      ],
      minutes: [5, 10, 20, 25, 35, 40, 50, 55],
      gives: "gate-open",
    },
    wagonLock: {
      type: "code",
      title: "Vagnens kodlås",
      text: [
        "Direktören har skrivit en lapp på dörren:",
        "\"Koden = alla platser i berg-och-dalbanan!\"",
        "Berg-och-dalbanan har {cars} vagnar.",
        "I varje vagn finns 2 platser. Hur många platser blir det?",
      ],
      random: { cars: [3, 10] },
      answer: "{cars}*2",
      gives: "wagon-open",
    },
    note: {
      type: "choice",
      title: "Lappen i spegelskrift",
      text: [
        "Det var inte jag som tog nyckeln!",
        "I natt såg jag en liten grå figur.",
        `Den sa: Jag heter ${S2.scribble}.`,
        "Nu går jag hem till museet.",
        `/ ${S2.clown}`,
      ],
      mirror: true,
      options: [
        { id: "truth", label: `${S2.clown} såg en grå figur. Den heter ${S2.scribble} och skulle hem till museet.` },
        { id: "took", label: `${S2.clown} tog nyckeln och gömde den på museet.` },
        { id: "ghost", label: `${S2.mirrorGhost} tog det orange och flög till månen.` },
        { id: "bike", label: `${S2.clown} vill ha en ny cykel med tre hjul.` },
      ],
      answer: "truth",
      wrong: "Läs en gång till – bokstav för bokstav, från höger till vänster.",
      gives: "note-read",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu löser vi mysteriet på tivolit!"],
      questions: [
        {
          question: "Varför går karusellen inte att starta?",
          options: [
            { id: "plupp", label: `${S2.clown} gömde nyckeln`, sprite: "s2Clown" },
            { id: "sigge", label: `${S2.mirrorGhost} trollade bort den`, sprite: "s2MirrorGhost" },
            { id: "smulan", label: "Smulan åt upp nyckeln", sprite: "smulan" },
            { id: "fladder", label: "Fladder flög sönder motorn", sprite: "fladder" },
            { id: "candy", label: "Direktören tappade nyckeln i sockervadden", sprite: "fairSugarKey" },
          ],
          answer: "candy",
          // The key in the sugar, Fladder watching him search his pocket there, and the hole in his coat.
          proof: ["sugarKey", "fladderSaw", "pocketHole"],
          missing: {
            sugarKey: "Var är nyckeln nu? Något klibbigt vid karusellen gömmer den…",
            fladderSaw: "Någon såg allt uppifrån i går kväll. Vad gjorde direktören efter sista åket?",
            pocketHole: "Hur kan en nyckel ramla ur en ficka? Titta i direktörens vagn!",
          },
          whyNot: {
            plupp: `Nyckeln låg ju inte hos ${S2.clown}. Den låg i sockervaddsmaskinen!`,
            sigge: `${S2.mirrorGhost} kan inte gå ut ur speglarna. Och nyckeln är inte bortrollad – den låg i sockret!`,
            smulan: "Smulan äter bullar, inte nycklar! Nyckeln låg kvar – i sockervadden.",
            fladder: "Motorn är hel. Det är nyckeln som fattas – och den låg i sockervaddsmaskinen.",
          },
          why: {
            directorClaim: "Det här är vad direktören SÄGER. Men nyckeln låg ju inte hos clownen – den låg i sockret!",
            schedule: "Åkschemat visar när karusellen går. Men inte var nyckeln tog vägen.",
            greyOrange: "Ballongerna handlar om färgen som försvann – inte om nyckeln.",
            orangeDrops: "Dropparna handlar om färgen – inte om nyckeln. Spara dem till sista frågan!",
            poster: "Affischen handlar om museet – inte om nyckeln.",
            ghostFace: "Ett ansikte i en spegel säger inget om var nyckeln är.",
            clownNote: `${S2.clown} säger att det inte var han. Men lappen säger inte var nyckeln hamnade.`,
            siggeMirrors: `Det visar att ${S2.mirrorGhost} inte kan gå till karusellen. Men inte var nyckeln är.`,
            mirrorTrick: "Speglarna lurar ögat. Men de säger inget om nyckeln.",
            scribblePrints: "De ritade spåren handlar om färgerna. Spara dem till sista frågan!",
            bunCrumbs: "Smulan sålde bullar vid karusellen. Smulor är inga nycklar!",
            clownNose: `Näsan visar att ${S2.clown} var vid karusellen. Men nyckeln låg inte hos honom – den låg i sockret.`,
            pinkScales: "Fladder satt på en häst. Men hon har inga händer – hon kan inte ta en nyckel.",
            friendsPhoto: "Fotot visar att de är vänner. Men inte var nyckeln hamnade.",
          },
        },
        {
          question: "Vem säger inte sanningen?",
          options: [
            { id: "director", label: S2.director, sprite: "s2Director" },
            { id: "plupp", label: S2.clown, sprite: "s2Clown" },
            { id: "smulan", label: "Smulan", sprite: "smulan" },
            { id: "fladder", label: "Fladder", sprite: "fladder" },
            { id: "sigge", label: S2.mirrorGhost, sprite: "s2MirrorGhost" },
          ],
          answer: "director",
          // What he said, against the ride schedule and what Fladder saw – and the hole shows the key
          // left his own pocket.
          proof: ["directorClaim", "schedule", "fladderSaw", "pocketHole"],
          missing: {
            directorClaim: "Vad sa direktören att han såg – och när?",
            schedule: "När slutar karusellen på kvällen? Det står på en skylt vid grinden.",
            fladderSaw: "Någon åkte berg-och-dalbana hela kvällen. Såg hon någon ta nyckeln?",
            pocketHole: "Varifrån ramlade nyckeln egentligen? Titta på något som hänger i vagnen.",
          },
          whyNot: {
            plupp: `Det ${S2.clown} skrev stämmer med spåren och dropparna. Men direktörens tid stämmer inte alls!`,
            smulan: "Smulan berättade ärligt vad hon såg. Hon tog bara fel på vad det var – det är inte att ljuga!",
            fladder: "Det Fladder såg stämmer med åkschemat – och med nyckeln i sockret.",
            sigge: `Det ${S2.mirrorGhost} sa stämmer. Han bor i speglarna och har aldrig varit vid karusellen.`,
          },
          why: {
            sugarKey: "Nyckeln i sockret visar VAR den hamnade. Men inte ur vems ficka den ramlade!",
            greyOrange: "Ballongerna säger inget om vem som ljuger. De är bara grå.",
            orangeDrops: "Dropparna visar vart färgen tog vägen. Inte vem som ljuger.",
            poster: "Affischen handlar om museet. Inte om vem som ljuger.",
            ghostFace: "Smulan berättade ärligt vad hon trodde att hon såg. Hon tog fel – men hon ljög inte!",
            clownNote: `${S2.clown} säger att det inte var han. Men det skulle ju en skyldig också säga! Vi behöver bevis från någon annan.`,
            siggeMirrors: `Det visar att ${S2.mirrorGhost} inte var vid karusellen. Inte vem som ljuger.`,
            mirrorTrick: "Speglarna lurar ögat – men de säger inget om vem som ljuger.",
            scribblePrints: "Spåren handlar om den som tog färgerna. Spara dem till sista frågan!",
            bunCrumbs: "Smulorna visar bara att Smulan sålde bullar där. Det har hon ju själv berättat.",
            clownNose: `${S2.clown} var vid karusellen – det skriver han själv. Det är inte att ljuga.`,
            pinkScales: "Fladder satt på en häst. Det säger inget om vem som ljuger.",
            friendsPhoto: "Fotot visar att de är vänner. Men det visar inte vem som ljuger.",
          },
        },
        {
          question: "Vem tar färgerna – och vart är den på väg?",
          options: [
            { id: "klick", label: `${S2.scribble} – hem till museet`, sprite: "s2Scribble" },
            { id: "sigge", label: `${S2.mirrorGhost} – in i speglarna`, sprite: "s2MirrorGhost" },
            { id: "plupp", label: `${S2.clown} – bort till cirkusen`, sprite: "s2Clown" },
            { id: "fladder", label: "Fladder – upp i berg-och-dalbanan", sprite: "fladder" },
            { id: "director", label: `${S2.director} – in i sin vagn`, sprite: "s2Director" },
          ],
          answer: "klick",
          // The clown talked to it; its drawn feet and the orange drops lead out of the fair – and
          // the road from the exit goes to the museum.
          proof: ["clownNote", "scribblePrints", "orangeDrops", "poster"],
          missing: {
            clownNote: "Någon har pratat med den som tog färgen! Vad stod det på lappen i spegellabyrinten?",
            scribblePrints: "Vilka konstiga spår fanns vid karusellen? Hur såg de ut?",
            orangeDrops: "Vart tog det orange vägen? Titta på marken nära utgången.",
            poster: "Vilket museum? Och hur kommer man dit från tivolit? Läs affischen!",
          },
          whyNot: {
            sigge: `${S2.mirrorGhost} kan inte gå ut ur speglarna. Och spåren var ritade med blyerts!`,
            plupp: `${S2.clown} har stora clownskor, men spåren var små och ritade. Och han såg ju själv den som tog färgen!`,
            fladder: "Fladder flyger. Men spåren var små, grå och ritade – på marken.",
            director: "Direktören ljög om nyckeln. Men spåren var små och ritade – och dropparna går mot utgången, inte mot vagnen.",
          },
          why: {
            directorClaim: "Direktören pratade om nyckeln – inte om färgerna. Och det han sa stämde inte ens!",
            schedule: "Åkschemat handlar om karusellen – inte om färgerna.",
            sugarKey: "Nyckeln förklarar varför karusellen stannade. Inte vem som tog färgerna.",
            fladderSaw: "Fladder såg direktören vid sockervadden. Inte den som tog färgerna.",
            pocketHole: "Hålet i fickan förklarar nyckeln. Inte färgerna.",
            greyOrange: "Ballongerna visar att det orange är borta. Men inte vem som tog det – eller vart.",
            ghostFace: `Ett stort vitt ansikte med röd näsa? Det var nog ${S2.clown} i spegeln! Den som tog färgen var liten, grå och ritad.`,
            siggeMirrors: "Det visar vem det INTE var. Men vi frågar vem det var!",
            mirrorTrick: "Speglarna förklarar spöket. Men inte vem som tog färgerna.",
            bunCrumbs: "Smulorna är Smulans. De säger inget om färgerna.",
            clownNose: `Näsan visar bara att ${S2.clown} var vid karusellen. Det var där han såg den som tog färgen.`,
            pinkScales: "Fjällen är Fladders. De säger inget om färgerna.",
            friendsPhoto: `Fotot handlar om direktören och ${S2.clown}. Inte om färgerna.`,
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    directorClaim: {
      name: "Direktörens berättelse",
      sprite: "s2Director",
      text: `Direktören säger att ${S2.clown} tog karusellnyckeln tio i nio i går – mitt under ett åk. "Jag såg det själv!"`,
    },
    schedule: {
      name: "Åkschemat",
      sprite: "fairSchedule",
      text: "Karusellen går varje kväll från klockan fem till kvart i nio. Efter sista åket låser direktören.",
    },
    greyOrange: {
      name: "Grå ballonger",
      sprite: "fairBalloonsGrey",
      text: "Alla orange ballonger på tivolit har blivit grå. Det orange är helt borta!",
    },
    orangeDrops: {
      name: "Orange droppar",
      sprite: "fairOrangeDrops",
      text: "Små orange droppar i sanden. De leder mot tivolits utgång – ut mot vägen.",
    },
    poster: {
      name: "Affischen",
      sprite: "fairPoster",
      text: `"Nya konstmuseet öppnar snart! Utställning: ${S2.painter}. Vägen dit: gå ut genom tivolits utgång och följ vägen till slutet."`,
    },
    ghostFace: {
      name: "Smulans vittnesmål",
      sprite: "smulan",
      text: "Smulan såg ett STORT vitt ansikte med en röd prick i mitten, i karusellens speglar. \"Spegelspöket!\" tror hon.",
    },
    clownNote: {
      name: "Lappen i spegelskrift",
      sprite: "fairMirrorNote",
      text: `${S2.clown}: "Det var inte jag som tog nyckeln! I natt såg jag en liten grå figur vid karusellen. Den såg ritad ut och bar på något orange som lyste. Den sa: Jag heter ${S2.scribble}. Nu går jag hem till museet."`,
    },
    siggeMirrors: {
      name: "Spegelspökets vittnesmål",
      sprite: "s2MirrorGhost",
      text: `${S2.mirrorGhost} bor i glaset och kan inte gå ut ur spegellabyrinten. Utanför speglarna finns han inte. Han har aldrig sett karusellen.`,
    },
    mirrorTrick: {
      name: "Den buckliga spegeln",
      sprite: "fairMirrorWavy",
      text: "I spegellabyrinten blir Nora lång, smal och tre stycken. Här inne kan spegelbilder se ut som spöken!",
    },
    sugarKey: {
      name: "Nyckeln i sockret",
      sprite: "fairSugarKey",
      text: "Karusellnyckeln låg längst ner i sockervaddsmaskinen – alldeles klibbig av socker!",
    },
    fladderSaw: {
      name: "Fladders vittnesmål",
      sprite: "fladderHang",
      text: "Karusellen stannade kvart i nio, som vanligt. Ingen ryckte i någon nyckel! Sen stod direktören vid sockervadden och åt. Plötsligt klappade han på fickan – och letade och letade.",
    },
    scribblePrints: {
      name: "Ritade fotspår",
      sprite: "s2ScribblePrints",
      text: "Små grå fotspår som ser RITADE ut – med blyerts! De går från karusellen mot tivoliplatsen.",
    },
    bunCrumbs: {
      name: "Bullsmulor",
      sprite: "fairBunCrumbs",
      text: "Bullsmulor vid karusellens kontrollåda. Vem äter bullar på tivolit?",
    },
    clownNose: {
      name: "En clownnäsa",
      sprite: "fairClownNose",
      text: `En röd clownnäsa bakom karusellen. ${S2.clown} har varit här!`,
    },
    pinkScales: {
      name: "Rosa fjäll",
      sprite: "pinkScales",
      text: "Rosa, glittriga fjäll på en karusellhäst. Precis som Fladders vingar…",
    },
    pocketHole: {
      name: "Hålet i fickan",
      sprite: "fairCoat",
      text: "Direktörens rock är klibbig av sockervadd. I högra fickan är det ett stort hål – stort som en nyckel!",
    },
    friendsPhoto: {
      name: "Fotot",
      sprite: "fairPhoto",
      text: `Ett foto i direktörens vagn: direktören och ${S2.clown} skrattar tillsammans. "Tivolits bästa vänner."`,
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    ticket: { name: "Biljetten", sprite: "fairTicket" },
    "carousel-key": { name: "Karusellnyckeln", sprite: "fairSugarKey" },
    "drop-orange": { name: "Den orange droppen", sprite: "dropOrange" },
  },

  finale: [
    { say: "Nora", lines: [`Där är du, ${S2.clown}!`, "Du behöver inte gömma dig längre."] },
    { say: S2.clown, lines: ["Hejdå! …Jag menar: HEJ!", "Tror du på mig nu? Det var inte jag!"] },
    { say: "Nora", lines: ["Jag vet. Nyckeln låg i sockervadden.", "Den ramlade ur ett hål i direktörens ficka."] },
    {
      say: S2.director,
      lines: [
        `${S2.clown}… förlåt mig.`,
        "Jag tappade nyckeln själv. Och jag skämdes så mycket.",
        "Så jag skyllde på dig. Det var fel av mig.",
      ],
    },
    { say: S2.clown, lines: ["Alla kan tappa saker.", "Men man ska inte skylla på någon annan."] },
    {
      say: S2.director,
      lines: ["Du har rätt. Även en direktör kan ha fel.", "Nu syr jag ihop fickan. Och i kväll åker alla gratis!"],
    },
    { say: S2.clown, lines: ["Förlåtelse godkänd!", "…eller som jag säger: DNÄKDOG!"] },
    { say: "Smulan", lines: ["Då firar vi med bullar! Mums."] },
    {
      say: S2.clown,
      lines: [
        "Vänta, Nora. En sak till.",
        `Den lilla grå figuren – ${S2.scribble}. Den var inte elak.`,
        "Den var ledsen. Den sa: \"Ingen ser mig.\"",
        "Sen gick den hem. Hem till museet.",
      ],
    },
    { say: "Ester", lines: [`Museet… där ${S2.painter} ska ha sin utställning!`] },
    { reveal: "culprit", sprite: "dropOrange" },
    { say: "Ester", lines: ["Nora, titta! En orange droppe har fastnat på clownskon.", "Det är färg… som har runnit av något!"] },
    { give: "drop-orange" },
    { say: "Nora", lines: ["Nu vet vi vart vi ska.", "Till museet!"] },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    `Direktören sa att ${S2.clown} tog nyckeln tio i nio, mitt under ett åk. Men åkschemat säger att karusellen slutar kvart i nio!`,
    "Och Fladder såg att ingen tog någon nyckel. Direktören åt sockervadd – och letade i fickan.",
    "Nyckeln låg i sockervaddsmaskinen, och i hans rock fanns ett hål. Han tappade den själv – och skämdes så att han ljög.",
    `Smulans vita "spöke" med röd prick var nog ${S2.clown} i spegeln. Hon tog fel, men hon ljög inte.`,
    `Det orange tog ${S2.scribble}. De ritade spåren och dropparna gick mot utgången – och den vägen leder till museet.`,
  ],

  fact: "En spegel byter plats på höger och vänster – men inte på upp och ner! Vinkar du med höger hand, vinkar spegel-du med vänster. Därför ser spegelskrift baklänges ut.",

  cards: [
    {
      sprite: "s2MirrorGhost",
      name: S2.mirrorGhost,
      text: "Bor i glaset i spegellabyrinten. Smyger när du tittar bort – titta på honom så fryser han!",
    },
    { sprite: "s2Clown", name: S2.clown, text: "En clown som gör allt baklänges. Han säger hejdå när han kommer – och skriver i spegelskrift!" },
    { sprite: "fairVaddis", name: "Vaddis", text: "Ett jättestort monster av rosa sockervadd. Hon sover i direktörens vagn – hoppa inte nära!" },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-director",
      hints: [
        "Direktören äger tivolit. Han står mitt på platsen.",
        "Gå fram till direktören och tryck Ctrl.",
        "Direktören är mannen med hög hatt och stor mustasch.",
      ],
    },
    {
      text: "Leta efter ledtrådar på tivoliplatsen",
      doneWhen: SQUARE_CLUES,
      hints: [
        { text: "Titta på allt som har blivit grått. Och läs skyltarna!", skipWhen: ["clue:greyOrange", "clue:schedule", "clue:poster"] },
        { text: "Smulan säljer bullar till höger. Hon har sett något!", skipWhen: "clue:ghostFace" },
        { text: "Ballongståndet står längst upp till vänster.", skipWhen: "clue:greyOrange" },
        { text: "Åkschemat sitter vid grinden längst upp.", skipWhen: "clue:schedule" },
        { text: "Det sitter en affisch uppe till höger.", skipWhen: "clue:poster" },
        { text: "Titta på marken nära utgången, nere till vänster.", skipWhen: "clue:orangeDrops" },
      ],
    },
    {
      text: "Ta dig in i spegellabyrinten",
      doneWhen: "visited:mirrors",
      hints: [
        { text: "Spegellabyrinten är till vänster. Men man behöver en biljett.", skipWhen: "ticket" },
        { text: "Biljettluckan står nära ingången. Betala precis rätt!", skipWhen: "ticket" },
        { text: "Biljetten kostar {price} kr. Ta de stora pengarna först, och lägg till små tills det blir {price}.", skipWhen: "ticket" },
        { text: "Du har en biljett! Gå in till vänster.", when: "ticket" },
      ],
    },
    {
      text: "Undersök spegellabyrinten",
      doneWhen: MIRROR_CLUES,
      hints: [
        "Titta i speglarna. Vad är på riktigt?",
        { text: "Titta i den stora spegeln längst upp till vänster…", skipWhen: "touched-mirror" },
        {
          text: `${S2.mirrorGhost} fryser när du tittar på honom. Gå fram medan du tittar – och prata!`,
          when: "touched-mirror",
          skipWhen: "clue:siggeMirrors",
        },
        { text: "Det sitter en lapp på en spegel mitt i labyrinten.", skipWhen: "note-read" },
        { text: "Lappen är i spegelskrift. Läs varje ord baklänges, från höger till vänster!", skipWhen: "note-read" },
        { text: "Titta i den buckliga spegeln längst upp i mitten.", skipWhen: "clue:mirrorTrick" },
      ],
    },
    {
      text: "Undersök karusellen",
      doneWhen: CAROUSEL_CLUES,
      hints: [
        { text: "Grinden till karusellen är längst upp på tivoliplatsen. Den har ett klocklås.", skipWhen: "gate-open" },
        { text: "Direktören glömmer allt. Läs hans lapp på låset – och hitta rätt klocka!", skipWhen: "gate-open" },
        {
          text: "\"Fem i halv fyra\" är fem minuter före halv fyra. \"Tjugo i fyra\" är tjugo minuter före fyra.",
          skipWhen: "gate-open",
        },
        { text: "Titta noga på marken runt karusellen!", when: "gate-open", skipWhen: ["clue:scribblePrints", "clue:bunCrumbs", "clue:clownNose"] },
        { text: "Sockervaddsmaskinen uppe till höger är så klibbig. Titta i den!", when: "gate-open", skipWhen: "clue:sugarKey" },
        {
          text: "Fladder vilar när hon har missat dig två gånger. Göm dig bakom stånden! Sen hänger hon vid berg-och-dalbanan.",
          when: "gate-open",
          skipWhen: "clue:fladderSaw",
        },
        { text: "Titta på karusellhästarna.", when: "gate-open", skipWhen: "clue:pinkScales" },
      ],
    },
    {
      text: "Undersök direktörens vagn",
      doneWhen: WAGON_CLUES,
      hints: [
        { text: "Direktörens vagn är till höger på tivoliplatsen. Dörren har ett kodlås.", skipWhen: "wagon-open" },
        { text: "Direktören har skrivit en lapp på dörren. Hur många platser finns i berg-och-dalbanan?", skipWhen: "wagon-open" },
        { text: "{cars} vagnar med 2 platser i varje. Räkna 2, 4, 6 … eller räkna {cars} gånger 2!", skipWhen: "wagon-open" },
        { text: "Smyg förbi Vaddis. Hoppa inte!", when: "wagon-open" },
        { text: "Titta på direktörens rock och på väggen.", when: "wagon-open", skipWhen: ["clue:pocketHole", "clue:friendsPhoto"] },
      ],
    },
    {
      text: "Varför stannade karusellen – och vem tar färgerna?",
      doneWhen: "solved",
      hints: [
        "Gå till direktören och berätta vad du har kommit fram till.",
        "Jämför det direktören sa med åkschemat. Och med det Fladder såg!",
        "Var låg nyckeln? Och vad var det för fel på direktörens rock?",
        "Vem skrev lappen i spegellabyrinten? Följ de ritade spåren och de orange dropparna – och läs affischen!",
      ],
    },
    {
      text: `Hitta ${S2.clown}!`,
      doneWhen: "caught",
      hints: [
        `${S2.clown} gömmer sig på tivoliplatsen. Han vet inte att han är fri!`,
        "Titta på prisstånden. I vilket skakar leksakerna?",
        "Gå fram till ståndet där leksakerna skakar och tryck Ctrl!",
      ],
    },
  ],
};
