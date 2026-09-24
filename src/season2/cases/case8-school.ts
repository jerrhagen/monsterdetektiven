import type { Case } from "../../cases/types";
import { S2 } from "../names";

// Case 8 – Nattens klassrum (the school, YELLOW). SPOILER: see SEASON2.md, section 5.
//
// The truth: the teacher and the sponge monster are secretly preparing a surprise party for the
// janitor, who turns 60. At night the sponge pushes the desks together into a long party table
// and wipes the blackboard every morning so no one sees the plans (the chalk monster who lives in
// the board gets scrubbed away with him). The teacher borrowed the class pet for the party and
// hides him in a shoebox in the art room – and she lies about it (a kind secret, but it scares
// the janitor). The yellow vanished for a completely different reason: a little drawn creature
// came in through the art room window. Its torn sketch page is the red-thread piece.
//
// Theory ladder:
//   Yard:       "It's haunted!? And all the yellow is gone" – drawn footprints in the sunflowers.
//   Classroom:  "Something wet moves the desks – and the teacher is hiding something."
//   Corridor:   "The sponge wasn't in bed… and someone is planning something big and secret."
//   Art room:   "It's a PARTY – and the yellow is a whole other mystery: a drawing that walks."
// Reveal: who moves the desks, why, and who took the yellow – each needs clues from several rooms.

const { teacher, janitor, sponge, classPet, chalk, scribble, painter } = S2;
/** The painter's initials, as signed on the sketch page ("P.P."). */
const initials = painter
  .split(" ")
  .map((w) => `${w[0]}.`)
  .join("");
const skeleton = "Skelettet Benke";

const CLASSROOM_CLUES = [
  "clue:wetPrints",
  "clue:chalkDust",
  "clue:bootPrints",
  "clue:emptyCage",
  "clue:kritanSaw",
  "clue:solveigSays",
];
const CORRIDOR_CLUES = ["clue:soapTrail", "clue:emptyBed", "clue:calendar"];
const ART_CLUES = ["clue:hamsterBox", "clue:invitation", "clue:sketchPage", "clue:yellowDrips"];

const WHO_PROOF = ["wetPrints", "kritanSaw", "soapTrail", "emptyBed"];
const WHY_PROOF = ["boardCode", "calendar", "balloons", "invitation"];
const YELLOW_PROOF = ["sunflowerPrints", "sketchPage", "yellowDrips"];
const ALL_PROOF = [...WHO_PROOF, ...WHY_PROOF, ...YELLOW_PROOF].map((id) => `clue:${id}`);

const FADED = 0.35;

export const case8: Case = {
  id: "s2-school",
  number: 8,
  title: "Nattens klassrum",
  startRoom: "yard",
  intro: [
    `${janitor} ringer till detektivbyrån. Han viskar:`,
    "\"Nora! Någon är i skolan på nätterna. Bänkarna flyttar sig, och tavlan blir suddad!\"",
    "\"Och i morse var allt gult GRÅTT. Solrosorna, skolbussen – till och med min gula mössa!\"",
    "Nora och Ester smyger dit när det mörknar…",
  ],

  rooms: {
    yard: {
      name: "Skolgården",
      theme: "yard",
      faded: FADED,
      layout: [
        "####DD##############",
        "#T.......SSSSS...eT#",
        "#T.....vfSS1SS....T#",
        "#........SSSSS.....#",
        "#..................#",
        "#...~~........b....#",
        "#...~~.............#",
        "#..........T.......#",
        "#..T...............#",
        "#.........N.....TT.#",
        "#TT................#",
        "#############DD#####",
      ],
      things: {
        v: {
          name: janitor,
          sprite: "s2Janitor",
          person: true,
          talk: [
            "Nora! Vad bra att du kom. Det är så spöklikt här på kvällen…",
            "Varje morgon står bänkarna på nya ställen. Och tavlan är suddad!",
            "I går kväll såg jag en blek skugga i klassrumsfönstret.",
            "Det SPÖKAR, säger jag!",
            "Och i morse var allt gult grått. Solrosorna, bussen – och min mössa!",
            `Här på kvällarna finns bara jag, ${teacher} och ${chalk} i tavlan…`,
            `…skelettet Benke i korridoren, ${classPet} i buren…`,
            `…och svampmonstret ${sponge}, som sover i städskåpet.`,
            "Jag låser upp klassrummet åt dig. Var försiktig!",
          ],
          gives: "talked-viggo",
          clue: "viggoStory",
          talkIf: [
            {
              when: "talked-viggo",
              talk: [
                "Dörren in till klassrummet är öppen nu. Där uppe till vänster!",
                "Jag går runt till stora ingången. Vi ses därinne.",
              ],
            },
          ],
          // He walks round to the main entrance – from then on he's in the corridor.
          hideWhen: "visited:corridor",
        },
        f: {
          name: "Solrosorna",
          sprite: "schoolSunflowers",
          talk: ["Solrosorna hänger med huvudet.", "I går var de knallgula. Nu är de grå som aska."],
        },
        b: {
          name: "Skolbussen",
          sprite: "schoolBus",
          talk: [
            "Skolbussen var gul i går. Nu är den grå – till och med lamporna.",
            "Men ingen har målat den. Det är som om färgen bara… försvunnit.",
          ],
        },
        e: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg, bakom trädet!", "Det är varmt… och det luktar lite krita."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      clues: { "1": "sunflowerPrints" },
      onEnter: {
        name: "Ester",
        talk: ["Brr, vad mörkt det är. Och titta – solrosorna är alldeles grå!", "Vi pratar med vaktmästaren."],
      },
      doors: [
        { at: "top", to: "classroom", requires: "talked-viggo", lockedText: "Dörren är låst. Vaktmästaren har nyckeln." },
        { at: "bottom", lockedText: "Vi kan inte gå hem än. Vi har ett mysterium att lösa!" },
      ],
    },

    classroom: {
      name: "Klassrummet",
      theme: "school",
      faded: FADED,
      layout: [
        "####################",
        "#HHH...b.....HHHHHH#",
        "#......2...t.......#",
        "#..................D",
        "#..KKKKKKKKK.......D",
        "#..........1.......#",
        "#..KKKKKKKKK....c..#",
        "#..................#",
        "#.HH...........HH..#",
        "#..................#",
        "#......3...........#",
        "####DD##############",
      ],
      things: {
        b: {
          name: "Tavlan",
          sprite: "schoolBoard",
          talk: [
            "Tavlan är nästan helt suddad. Den är fortfarande lite blöt.",
            "Men i ett hörn står det: \"Koden till dörren:\" – och sedan siffror!",
            "Vänta… något rör sig i kritkoppen!",
          ],
          gives: "poked-board",
          talkIf: [
            {
              when: "corridor-open",
              talk: [
                "Siffrorna i hörnet – nu vet du vad de betyder!",
                "Koden till dörren var ett kalasord. Vem planerar ett kalas i hemlighet?",
              ],
              clue: "boardCode",
            },
            {
              when: "emerged:s2Chalk",
              talk: ["Tavlan är nästan helt suddad.", "I ett hörn står koden till dörren – i hemlig sifferkod."],
            },
          ],
        },
        t: {
          name: teacher,
          sprite: "s2Teacher",
          person: true,
          talk: [
            "Åh! Nora… vad gör du här så sent?",
            "Jag? Jag rättar bara prov. Jag ska precis gå hem.",
            "Bänkarna? Ingen aning! De står väl som vanligt.",
            `${classPet}? Han har nog rymt. Jag vet ingenting! Ingenting alls!`,
          ],
          clue: "solveigSays",
          talkIf: [
            { when: "caught", talk: ["Grattis igen, vaktmästaren!", "Och tack, Nora. Nästa gång håller jag en snällare hemlis."] },
            {
              when: "solved",
              talk: [
                "Åh… du har listat ut alltihop. Förlåt att jag inte sa sanningen.",
                `Men var är ${sponge}? Han blir så rädd när någon ser honom!`,
              ],
            },
            {
              when: "clue:hamsterBox",
              talk: [`L-lådan i bildsalen? ${classPet} behövde bara vila lite…`, "Mer säger jag inte! Det är… privat."],
            },
          ],
        },
        c: {
          name: `${classPet}s bur`,
          sprite: "schoolCage",
          on: "K",
          talk: [
            "Buren är tom! Hjulet står stilla.",
            "Men haken på luckan är stängd.",
            "Ingen hamster kan stänga en hake bakom sig…",
          ],
          clue: "emptyCage",
        },
      },
      clues: { "1": "wetPrints", "2": "chalkDust", "3": "bootPrints" },
      monsters: [
        {
          // Lives in the chalk tray. Creeps up when Nora looks away, freezes (eyes shut) when she looks.
          type: "sneaker",
          sprite: "s2Chalk",
          home: [5, 2],
          hideUntil: { when: "poked-board", delay: 2 },
          calmWhen: "clue:kritanSaw",
          thing: {
            name: chalk,
            sprite: "s2Chalk",
            person: true,
            talk: [
              "GNIIISCH! Titta inte på mig! …Äh. Nu kan jag inte röra mig.",
              `Jag är ${chalk}. Jag bor i kritkoppen vid tavlan.`,
              "På nätterna ritar jag fina saker på tavlan. Men varje morgon…",
              "…kommer något BLÖTT och mjukt och SKRUBBAR bort allt!",
              "Det luktar såpa. Och jag blir alldeles blöt. Usch!",
              "Bänkarna? Jag har ju bara pinnarmar. Jag orkar inte ens lyfta en sudd.",
            ],
            clue: "kritanSaw",
            talkIf: [{ when: "clue:kritanSaw", talk: ["Hmpf. Hitta den som skrubbar, Nora!", "Och säg åt den att sluta."] }],
          },
        },
      ],
      onEnter: {
        name: "Ester",
        talk: ["Oj! Bänkarna står ihopskjutna i långa rader.", "Och det luktar… såpa?"],
      },
      doors: [
        { at: "bottom", to: "yard" },
        {
          at: "right",
          to: "corridor",
          requires: "corridor-open",
          puzzle: "boardCode",
          lockedText: "Dörren till korridoren har ett bokstavslås.",
        },
      ],
    },

    corridor: {
      name: "Korridoren",
      theme: "school",
      faded: FADED,
      layout: [
        "##############DD####",
        "#HHHH.HHHH.k.....s.#",
        "#..................#",
        "D..........1.......#",
        "D..................#",
        "#..................#",
        "#..................#",
        "#.v................D",
        "#..................D",
        "#..................#",
        "#HHHHH.HHHfHHH.HHH.#",
        "####################",
      ],
      things: {
        v: {
          name: janitor,
          sprite: "s2Janitor",
          person: true,
          talk: [
            "Nora! Jag gick in genom stora ingången.",
            `Akta dig för skelettet Benke! Han går vakt här på nätterna – och han skräms.`,
            "Bildsalen där uppe är låst. Fröken lånade nyckeln…",
            "Hon lägger allt i förrådsskåpet. Men koden vet bara hon.",
          ],
          talkIf: [
            { when: "caught", talk: ["Ett kalas… för mig! Jag vet inte vad jag ska säga.", "Tack, Nora!"] },
            {
              when: "solved",
              talk: [
                `${sponge}!? Och ett KALAS? Men var är han nu?`,
                "Hör du? Det skramlar i ett av elevskåpen. Hitta honom, Nora!",
              ],
            },
            {
              when: "visited:artroom",
              talk: ["Du är nära, Nora! Men något fattas…", "Har du undersökt allt? Även ute på skolgården?"],
            },
            {
              when: "artroom-key",
              talk: ["Du fick upp förrådsskåpet! Så klok du är.", "Trappan upp till bildsalen är längst upp till höger."],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: ALL_PROOF,
          puzzleIntro: ["Nora! Där är du!", "Har du listat ut vem som smyger här på nätterna?"],
        },
        k: {
          name: "Kalendern",
          sprite: "schoolCalendar",
          talk: ["Skolans kalender. Runt lördag är det en stor röd ring.", "Där står en tid – men skriven med bokstäver."],
          puzzle: "calendar",
          talkIf: [
            {
              when: "calendar-read",
              talk: ["Lördag: \"★ 60 ÅR ★ PSST! INGEN FÅR VETA!\"", "Någon fyller 60 år… och det är hemligt!"],
              clue: "calendar",
            },
          ],
        },
        s: {
          name: "Städskåpet",
          sprite: "schoolCupboard",
          talk: [
            `Städskåpet. Här bor svampmonstret ${sponge}.`,
            "En hink, en mopp och en liten säng av disktrasor.",
            "Sängen är orörd. Ingen har sovit här i natt!",
            `Men var är ${sponge} då? …Det prasslar i elevskåpen!`,
          ],
          clue: "emptyBed",
        },
        f: {
          name: "Förrådsskåpet",
          sprite: "schoolStoreCupboard",
          talk: ["Förrådsskåpet. Det har ett kodlås.", "Det sitter en lapp på dörren."],
          puzzle: "balloons",
          talkIf: [
            {
              when: "artroom-key",
              talk: [
                "Skåpet är fullt av ballonger och serpentiner!",
                "Några ballonger var gula. Nu är de grå.",
                "Nyckeln till bildsalen hängde längst in. Nu har du den!",
              ],
              clue: "balloons",
            },
          ],
        },
      },
      clues: { "1": "soapTrail" },
      monsters: [
        {
          // Rattles up and down the corridor. Slip past when he turns.
          type: "patroller",
          sprite: "schoolSkeleton",
          path: [
            [4, 6],
            [16, 6],
          ],
          speed: 30,
        },
        {
          // The one who sneaks about at night. First only a rustle in the lockers, then quick glimpses.
          type: "crawler",
          sprite: "s2Sponge",
          routes: [
            [
              [5, 2],
              [9, 2],
            ],
            [
              [1, 9],
              [5, 9],
            ],
            [
              [11, 9],
              [17, 9],
            ],
            [
              [15, 2],
              [11, 2],
            ],
          ],
          shelters: [
            [2, 1],
            [8, 1],
            [3, 10],
            [8, 10],
            [16, 10],
          ],
          unseenUntil: "clue:emptyBed",
          catchWhen: "solved",
        },
      ],
      onEnter: {
        name: "Ester",
        talk: [
          "Nora… hör du? Det skramlar! Är det ett SKELETT som går där?!",
          "Vänta tills han vänder. Och titta – vaktmästaren står där nere till vänster.",
        ],
      },
      doors: [
        { at: "left", to: "classroom" },
        {
          at: "top",
          to: "artroom",
          stairs: "up",
          requires: "artroom-key",
          lockedText: "Grinden till trappan upp till bildsalen är låst.",
        },
        { at: "right", lockedText: "Stora ingången. Vaktmästaren har låst den efter sig." },
      ],
    },

    artroom: {
      name: "Bildsalen",
      theme: "school",
      faded: FADED,
      layout: [
        "####################",
        "#HHH......1.....HHH#",
        "#......p...........#",
        "#..KKK.......KKK...#",
        "#..KiK.......KnK...#",
        "#..................#",
        "#..................#",
        "#.HH...............#",
        "#.HH...............#",
        "#..................#",
        "#..................#",
        "##############DD####",
      ],
      things: {
        n: {
          name: classPet,
          sprite: "schoolShoebox",
          person: true,
          on: "K",
          talk: [
            "En skokartong med lufthål. Det snarkar därinne…",
            `Det är ${classPet}! Han sover gott på en bädd av sågspån.`,
            `På locket står det: "Stör ej! / ${teacher}"`,
          ],
          clue: "hamsterBox",
          talkIf: [{ when: "caught", talk: ["Lådan är tom. Bara sågspån kvar.", `${classPet} har sprungit iväg till kalaset!`] }],
        },
        i: {
          name: "Ett kort",
          sprite: "schoolLetters",
          on: "K",
          talk: ["Ett halvfärdigt kort med glitter.", "Stora utklippta bokstäver ligger huller om buller."],
          puzzle: "invitation",
          talkIf: [
            {
              when: "invitation-done",
              talk: ["Nu står rubriken rätt! Under den står det:", "\"Vaktmästaren fyller 60! Psst – det är en HEMLIS!\""],
              clue: "invitation",
            },
          ],
        },
        p: {
          name: "Ett papper",
          sprite: "s2SketchPage",
          talk: [
            "Ett papper på golvet. Det är en sida som rivits ur en skissbok.",
            "En blyertsteckning av ett litet, runt monster med snirkliga ben.",
            `Under står det: "${scribble} – färglägg sen!"`,
            `Och i hörnet: "${initials}"`,
            "Någon har försökt måla teckningen gul. Men färgen har runnit av…",
          ],
          clue: "sketchPage",
        },
      },
      clues: { "1": "yellowDrips" },
      onEnter: {
        name: "Ester",
        talk: ["Bildsalen! Här borde allt vara färgglatt…", "…men det gula är borta här också. Och fönstret står på glänt."],
      },
      doors: [{ at: "bottom", to: "corridor", stairs: "down" }],
    },
  },

  puzzles: {
    boardCode: {
      type: "word",
      mode: "cipher",
      title: "Bokstavslåset",
      text: ["Låset vill ha ett ord.", "I tavlans hörn stod koden – i hemlig sifferkod.", "Byt varje siffra mot en bokstav!"],
      words: ["KALAS", "TÅRTA", "GRATTIS", "PRESENT", "BALLONG"],
      gives: "corridor-open",
    },
    calendar: {
      type: "clock",
      title: "Kalendern",
      text: ["I kalendern står det med bokstäver:", "\"Lördag, klockan {time}.\"", "Vilken klocka visar samma tid?"],
      minutes: [5, 10, 20, 25, 35, 40, 50, 55],
      gives: "calendar-read",
    },
    balloons: {
      type: "code",
      title: "Förrådsskåpets kodlås",
      text: [
        "På lappen står det:",
        "\"Koden = alla ballongerna. Så jag inte glömmer!\"",
        "\"{bags} påsar ballonger, {per} i varje påse.\"",
        "Hur många ballonger är det?",
      ],
      random: { bags: [2, 9] },
      words: { per: ["5", "10"] },
      answer: "{bags}*{per}",
      answerRange: [10, 90],
      gives: "artroom-key",
    },
    invitation: {
      type: "word",
      mode: "anagram",
      title: "Det hemliga kortet",
      text: ["Bokstäverna till kortets rubrik har blandats ihop.", "Lägg dem i rätt ordning!"],
      words: ["KALAS", "FEST", "TÅRTA", "FIKA"],
      gives: "invitation-done",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu ska vi lösa mysteriet!"],
      questions: [
        {
          question: "Vem flyttar bänkarna på nätterna?",
          options: [
            { id: "sponge", label: sponge, sprite: "s2Sponge" },
            { id: "chalk", label: chalk, sprite: "s2Chalk" },
            { id: "janitor", label: janitor, sprite: "s2Janitor" },
            { id: "pet", label: classPet, sprite: "s2ClassPet" },
            { id: "ghost", label: "Ett spöke" },
          ],
          answer: "sponge",
          // Wet square prints with holes, a scrubbing that smells of soap, a soap trail – and an empty bed.
          proof: WHO_PROOF,
          missing: {
            wetPrints: "Titta på golvet vid bänkarna i klassrummet. Har något lämnat avtryck?",
            kritanSaw: "Någon i klassrummet blir bortskrubbad varje morgon. Vad sa han?",
            soapTrail: "Titta på golvet i korridoren. Vad leder från städskåpet?",
            emptyBed: "Vem borde sova i korridoren på nätterna? Titta där han bor!",
          },
          whyNot: {
            chalk: `${chalk} har bara pinnarmar – och han blir själv bortskrubbad varje morgon!`,
            janitor: "Vaktmästaren går hem på kvällen. Och stövlar gör inga blöta, fyrkantiga avtryck med hål i.",
            pet: `${classPet} sover i en låda i bildsalen. Han är alldeles för liten för att flytta bänkar!`,
            ghost: "Spöken lämnar inga blöta avtryck – och de luktar inte såpa!",
          },
          why: {
            viggoStory: "Vaktmästaren berättar VAD som händer. Men han vet inte vem som gör det.",
            sunflowerPrints: "Fotspåren i solrosorna är ritade med blyerts. De handlar om det gula – spara dem!",
            chalkDust: `Kritdamm finns överallt i ett klassrum. Och ${chalk} orkar inte flytta bänkar med sina pinnarmar.`,
            bootPrints: "Stövelspåren är vaktmästarens från i morse. Han gick bara in och tittade.",
            emptyCage: `Buren visar att någon lyfte ut ${classPet} – men inte vem som flyttar bänkarna.`,
            solveigSays: "Fröken säger att hon inget vet. Hon döljer något – men hon flyttar inte bänkarna på natten.",
            boardCode: "Koden visar att någon planerar något hemligt – men inte vem som flyttar bänkarna. Spara den!",
            calendar: "Kalendern säger att någon fyller 60. Men inte vem som är här på nätterna.",
            balloons: "Ballongerna visar att det ska bli kalas – men inte vem som flyttar bänkarna.",
            hamsterBox: `Lådan visar var ${classPet} är – men inte vem som flyttar bänkarna.`,
            invitation: "Kortet säger VARFÖR – men nu frågar vi VEM. Spara det till nästa fråga!",
            sketchPage: "Skissen handlar om det gula. Spara den till sista frågan!",
            yellowDrips: "De gula dropparna handlar om det gula. Spara dem till sista frågan!",
          },
        },
        {
          question: `Varför smyger ${sponge} omkring på nätterna?`,
          options: [
            { id: "party", label: "Ett hemligt kalas", sprite: "schoolBalloons" },
            { id: "scare", label: "Skrämma vaktmästaren" },
            { id: "clean", label: "Städa skolan", sprite: "schoolCupboard" },
            { id: "yellow", label: "Ta det gula" },
          ],
          answer: "party",
          // A party word as the door code, "60 år – PSST" on Saturday, a cupboard full of balloons, a secret card.
          proof: WHY_PROOF,
          missing: {
            boardCode: "Vad stod det i tavlans hörn – och vad blev siffrorna till?",
            calendar: "Vad händer på lördag? Läs kalendern i korridoren.",
            balloons: "Vad fanns i det låsta skåpet i korridoren?",
            invitation: "Någon gör ett kort i bildsalen. Vad står det på det?",
          },
          whyNot: {
            scare: "Ingen ville skrämma honom. Kortet säger att det är en hemlis – en överraskning!",
            clean: "Man städar inte genom att skjuta ihop alla bänkar och gömma ballonger!",
            yellow: "Det gula är ett helt annat mysterium. Det kommer i nästa fråga!",
          },
          why: {
            viggoStory: "Vaktmästaren tror att det spökar. Men han vet inte varför någon är här.",
            sunflowerPrints: "Fotspåren i solrosorna handlar om det gula. Spara dem till sista frågan!",
            wetPrints: `Avtrycken visar VEM – att det är ${sponge}. Men inte varför.`,
            chalkDust: "Kritdammet säger inget om varför någon är här på nätterna.",
            bootPrints: "Stövelspåren är vaktmästarens egna, från i morse.",
            emptyCage: `Buren är tom – men varför? Det säger den inte.`,
            kritanSaw: `${chalk} berättar vad som händer med tavlan. Men inte varför!`,
            solveigSays: "Fröken säger att hon inget vet. Hon döljer något – men hennes ord säger inte vad.",
            soapTrail: `Såpbubblorna visar vart ${sponge} gick – men inte varför.`,
            emptyBed: `Den orörda sängen visar att ${sponge} var uppe i natt – men inte varför.`,
            hamsterBox: `Lappen visar att fröken bar dit ${classPet}. Men den säger inte varför.`,
            sketchPage: "Skissen handlar om det gula. Spara den till sista frågan!",
            yellowDrips: "De gula dropparna handlar om det gula. Spara dem till sista frågan!",
          },
        },
        {
          question: "Vem tog det gula?",
          options: [
            { id: "scribble", label: `Figuren på skissen (${scribble})`, sprite: "s2SketchPage" },
            { id: "sponge", label: sponge, sprite: "s2Sponge" },
            { id: "chalk", label: chalk, sprite: "s2Chalk" },
            { id: "janitor", label: janitor, sprite: "s2Janitor" },
            { id: "pet", label: classPet, sprite: "s2ClassPet" },
          ],
          answer: "scribble",
          // Drawn footprints among the grey sunflowers, drawn footprints by the yellow drips – and the drawing itself.
          proof: YELLOW_PROOF,
          missing: {
            sunflowerPrints: "Var försvann det gula först? Titta noga bland solrosorna på skolgården!",
            sketchPage: "Något ligger på golvet i bildsalen. Vad är det för teckning?",
            yellowDrips: "Finns det något gult kvar någonstans? Titta på golvet i bildsalen!",
          },
          whyNot: {
            sponge: `${sponge} lämnar blöta, fyrkantiga avtryck. Fotspåren i solrosorna är små och ritade!`,
            chalk: `${chalk} bor i tavlan och ritar med vit krita. Fotspåren är ritade med grå blyerts.`,
            janitor: "Vaktmästarens egen gula mössa blev grå! Och han har stora stövlar, inte små ritade fötter.",
            pet: `${classPet} sov i sin låda hela natten. Och hamstrar har inga ritade fötter!`,
          },
          why: {
            viggoStory: "Vaktmästaren berättar att det gula försvann – men inte vem som tog det.",
            wetPrints: `De blöta avtrycken kommer från ${sponge} och bänkarna – inte från det gula.`,
            chalkDust: "Kritdammet kommer från tavlan. Det har inget med det gula att göra.",
            bootPrints: "Stövelspåren är vaktmästarens, från i morse.",
            emptyCage: `Den tomma buren handlar om ${classPet}, inte om det gula.`,
            kritanSaw: `${chalk} berättar om tavlan och såpan – inte om det gula.`,
            solveigSays: "Fröken döljer ett kalas – inte det gula.",
            boardCode: "Koden handlar om kalaset – inte om det gula.",
            soapTrail: `Såpbubblorna visar vart ${sponge} gick. Det har inget med det gula att göra.`,
            emptyBed: `Sängen visar att ${sponge} var uppe i natt. Men han har inga ritade fötter.`,
            calendar: "Kalendern handlar om kalaset – inte om det gula.",
            balloons: "Ballongerna blev grå – men de visar inte vem som tog det gula.",
            hamsterBox: `${classPet} sov gott i sin låda. Lådan säger inget om det gula.`,
            invitation: "Kortet handlar om kalaset – inte om det gula.",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    viggoStory: {
      name: "Vaktmästarens berättelse",
      sprite: "s2Janitor",
      text: "Bänkarna flyttas på nätterna och tavlan blir suddad. Han såg en blek skugga i fönstret och tror att det spökar. Och i morse var allt gult grått!",
    },
    sunflowerPrints: {
      name: "Ritade fotspår",
      sprite: "s2ScribblePrints",
      text: "Små grå fotspår mellan de grå solrosorna. De ser RITADE ut, som med blyerts! De går mot skolans stuprör.",
    },
    wetPrints: {
      name: "Blöta avtryck",
      sprite: "schoolWetPrints",
      text: "Blöta, fyrkantiga avtryck med små hål i, vid bänkarna som flyttats. Som om något mjukt och blött har tryckt på dem.",
    },
    chalkDust: { name: "Kritdamm", sprite: "schoolChalkDust", text: `Vitt kritdamm på golvet vid tavlan och bänkarna. Har ${chalk} varit framme?` },
    bootPrints: {
      name: "Stövelspår",
      sprite: "schoolBootPrints",
      text: "Stora, leriga stövelspår från dörren fram till bänkarna – och tillbaka. Precis vaktmästarens storlek.",
    },
    emptyCage: {
      name: "Den tomma buren",
      sprite: "schoolCage",
      text: `${classPet}s bur är tom! Men haken på luckan är stängd. Någon har lyft ut honom – han har inte rymt själv.`,
    },
    kritanSaw: {
      name: `${chalk}s vittnesmål`,
      sprite: "s2Chalk",
      text: `${chalk} bor i tavlan. Varje morgon skrubbar något blött och mjukt bort allt han ritat. Det luktar såpa! Och han har bara pinnarmar.`,
    },
    solveigSays: {
      name: "Vad fröken säger",
      sprite: "s2Teacher",
      text: `${teacher} säger att hon inget vet om bänkarna. Och att ${classPet} nog har rymt. Hon verkar nervös…`,
    },
    boardCode: {
      name: "Koden på tavlan",
      sprite: "schoolBoard",
      text: "I tavlans hörn stod koden till korridordörren i hemlig sifferkod. Nora knäckte den – det var ett kalasord! Någon planerar något i hemlighet.",
    },
    soapTrail: {
      name: "Såpbubblor",
      sprite: "schoolSoapTrail",
      text: "Små såpbubblor och blöta fläckar på golvet – från städskåpet fram till dörren in till klassrummet.",
    },
    emptyBed: {
      name: "Den orörda sängen",
      sprite: "schoolCupboard",
      text: `${sponge}s lilla säng i städskåpet är orörd – ingen har sovit där i natt. Men det prasslar i elevskåpen…`,
    },
    calendar: {
      name: "Kalendern",
      sprite: "schoolCalendar",
      text: "Runt lördag en röd ring: \"★ 60 år ★ PSST! Ingen får veta!\" Nora läste tiden på klockan. Någon fyller 60 – i hemlighet!",
    },
    balloons: {
      name: "Ballongerna",
      sprite: "schoolBalloons",
      text: "Förrådsskåpet är fullt av ballonger och serpentiner. Så många! Någon ska ha ett stort kalas.",
    },
    hamsterBox: {
      name: "Lådan i bildsalen",
      sprite: "schoolShoebox",
      text: `${classPet} sover i en skokartong i bildsalen. På locket: "Stör ej! / ${teacher}". Han rymde inte – fröken bar dit honom!`,
    },
    invitation: {
      name: "Det hemliga kortet",
      sprite: "schoolLetters",
      text: "Ett kort i bildsalen. Nora la bokstäverna i rubriken rätt. Under står det: \"Vaktmästaren fyller 60! Psst – det är en HEMLIS!\"",
    },
    sketchPage: {
      name: "Skisssidan",
      sprite: "s2SketchPage",
      text: `En sida ur en skissbok: en blyertsteckning av ett litet, runt monster. "${scribble} – färglägg sen! / ${initials}" Någon har försökt måla den gul, men färgen har runnit av.`,
    },
    yellowDrips: {
      name: "Gula droppar",
      sprite: "schoolYellowDrips",
      text: "Gula droppar på golvet under fönstret – det enda gula i hela skolan! Bredvid dem: små grå, RITADE fotspår.",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    "drop-yellow": { name: "Den gula droppen", sprite: "dropYellow" },
  },

  finale: [
    { say: "Nora", lines: [`Hittade dig, ${sponge}!`] },
    {
      say: sponge,
      lines: [
        "F-förlåt! Snälla, bli inte arg!",
        "Det var jag som flyttade bänkarna. Till ett långt kalasbord!",
        "Och jag suddade tavlan varje morgon, så att ingen skulle se planerna.",
        "Men i natt såg jag något grått i bildsalen. Jag blev så rädd…",
        "…att jag glömde sudda ett hörn av tavlan.",
      ],
    },
    { enter: "teacher", sprite: "s2Teacher", from: [0, 4], to: [4, 6] },
    {
      say: teacher,
      lines: [`Nu får vi nog säga det, ${sponge}…`, "ÖVERRASKNING! Grattis på 60-årsdagen, vaktmästaren!"],
    },
    { say: janitor, lines: ["Ett kalas… för MIG?", "Och jag som trodde att det spökade!"] },
    {
      say: teacher,
      lines: [
        "Förlåt att vi skrämde dig. Det var inte meningen.",
        "Och förlåt, Nora, att jag sa att jag inget visste.",
        "En hemlis ska vara snäll. Den får inte göra någon rädd.",
      ],
    },
    { enter: "pet", sprite: "s2ClassPet", from: [14, 0], to: [8, 6] },
    { say: "Ester", lines: [`Titta! ${classPet} har vaknat.`, "Han har något i munnen…"] },
    { reveal: "pet", sprite: "dropYellow" },
    {
      say: "Ester",
      lines: ["En gul droppe! Den låg nog i bildsalen.", "Det är färg som har runnit av något… precis som i hamnen!"],
    },
    {
      say: "Nora",
      lines: [`Figuren på skissen… ${scribble}. Men vem är ${initials}?`, "Och vart tog den vägen? Det här mysteriet är inte slut än…"],
    },
    { give: "drop-yellow" },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    `Blöta, fyrkantiga avtryck vid bänkarna, såpbubblor från städskåpet och en orörd säng. Och ${chalk} blev bortskrubbad med såpa. Det var ${sponge}!`,
    "Varför? Kalasordet på tavlan, \"60 år – PSST\" i kalendern, ballongerna och kortet: ett hemligt kalas för vaktmästaren!",
    `${teacher} sa att hon inget visste. Men lappen på ${classPet}s låda var hennes – han skulle vara med på kalaset.`,
    `${sponge} sköt ihop bänkarna till ett kalasbord och suddade tavlan varje morgon. Den bleka skuggan i fönstret var han.`,
    `Men det gula var något helt annat: ritade fotspår i solrosorna, gula droppar i bildsalen – och skissen av ${scribble}.`,
  ],

  fact: "Ögat ser gult och gulgrönt lättare än andra färger – även i skymningen. Därför är skolbussar i många länder gula, och reflexvästar ofta gulgröna!",

  cards: [
    { sprite: "s2Sponge", name: sponge, text: "Ett svampmonster som bor i städskåpet. Suddar, skrubbar – och kan hålla en hemlis." },
    { sprite: "s2Chalk", name: chalk, text: "Bor i tavlan och ritar på nätterna. Smyger när du tittar bort – titta på honom så fryser han!" },
    { sprite: "schoolSkeleton", name: skeleton, text: "Skolans skelett går vakt i korridoren på nätterna. Vänta tills han vänder – och smit förbi!" },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-viggo",
      hints: [
        "Vaktmästaren väntar på skolgården.",
        "Gå fram till vaktmästaren och tryck Ctrl.",
        "Han står nära solrosorna, uppe till vänster.",
      ],
    },
    {
      text: "Undersök klassrummet",
      doneWhen: CLASSROOM_CLUES,
      hints: [
        { text: "Dörren in till skolan är uppe till vänster på skolgården.", skipWhen: "visited:classroom" },
        { text: "Titta noga på golvet – vid bänkarna och vid tavlan.", skipWhen: ["clue:wetPrints", "clue:chalkDust"] },
        { text: "Har någon gått in genom dörren? Titta på golvet nära den.", skipWhen: "clue:bootPrints" },
        { text: "Prata med fröken. Och titta i buren!", skipWhen: ["clue:solveigSays", "clue:emptyCage"] },
        { text: "Något bor i tavlan. Titta på tavlan – om du vågar!", skipWhen: "emerged:s2Chalk" },
        {
          text: `${chalk} står stilla när du tittar på honom. Gå fram medan du tittar – och prata med honom!`,
          when: "emerged:s2Chalk",
          skipWhen: "clue:kritanSaw",
        },
      ],
    },
    {
      text: "Ta dig ut i korridoren",
      doneWhen: "visited:corridor",
      hints: [
        { text: "Dörren till korridoren är till höger i klassrummet. Den har ett bokstavslås.", skipWhen: "corridor-open" },
        { text: "Titta på tavlan. I ett hörn har någon glömt att sudda!", skipWhen: "corridor-open" },
        { text: "Byt varje siffra mot en bokstav: 1 är A, 2 är B, 3 är C … Ordet börjar på {boardCode:first}.", skipWhen: "corridor-open" },
        { text: "Dörren är öppen! Gå ut till höger.", when: "corridor-open" },
      ],
    },
    {
      text: "Vad händer i korridoren?",
      doneWhen: CORRIDOR_CLUES,
      hints: [
        "Skelettet går fram och tillbaka. Vänta tills han vänder – och smit förbi!",
        { text: "Titta på golvet. Vart leder de blöta fläckarna?", skipWhen: "clue:soapTrail" },
        { text: "Vem bor i städskåpet uppe till höger? Titta där!", skipWhen: "clue:emptyBed" },
        { text: "Läs kalendern på väggen.", skipWhen: "clue:calendar" },
        {
          text: "\"Över\" betyder efter hela timmen, \"i\" betyder före. \"Halv fyra\" är 3:30!",
          skipWhen: "clue:calendar",
        },
      ],
    },
    {
      text: "Ta dig upp till bildsalen",
      doneWhen: "visited:artroom",
      hints: [
        { text: "Trappan upp till bildsalen är låst.", skipWhen: "artroom-key" },
        { text: "Vaktmästaren vet var nyckeln kan vara. Prata med honom!", skipWhen: "artroom-key" },
        { text: "Förrådsskåpet har ett kodlås. Läs lappen: {bags} påsar med {per} ballonger i varje.", skipWhen: "artroom-key" },
        { text: "Räkna {per} i taget, {bags} gånger. Eller: {bags} gånger {per}.", skipWhen: "artroom-key" },
        { text: "Du har nyckeln! Trappan upp är längst upp till höger i korridoren.", when: "artroom-key" },
      ],
    },
    {
      text: "Undersök bildsalen",
      doneWhen: ART_CLUES,
      hints: [
        { text: "Titta på golvet vid fönstret.", skipWhen: "clue:yellowDrips" },
        { text: "Det ligger ett papper på golvet. Vad är det för teckning?", skipWhen: "clue:sketchPage" },
        { text: "Något snarkar på bordet till höger. Vem?", skipWhen: "clue:hamsterBox" },
        { text: "Bokstäverna på bordet till vänster är huller om buller. Lägg dem rätt!", skipWhen: "clue:invitation" },
        { text: "Ordet har {invitation:length} bokstäver och börjar på {invitation:first}.", skipWhen: "clue:invitation" },
      ],
    },
    {
      text: "Vem, varför – och vem tog det gula?",
      doneWhen: "solved",
      hints: [
        { text: "Har du tittat noga i solrosrabatten på skolgården?", skipWhen: "clue:sunflowerPrints" },
        { text: "Titta på tavlan i klassrummet igen. Nu vet du vad siffrorna betyder!", skipWhen: "clue:boardCode" },
        "Berätta för vaktmästaren i korridoren vad du har kommit fram till.",
        "Tänk steg för steg: vem lämnar blöta, fyrkantiga avtryck? Och vad planerar någon i hemlighet?",
        "Och det gula: vem har små, ritade fötter? Titta i detektivboken (B)!",
      ],
    },
    {
      text: `Hitta ${sponge}!`,
      doneWhen: "caught",
      hints: [
        `${sponge} gömmer sig någonstans i korridoren.`,
        "Titta noga på elevskåpen. Vilket av dem skakar?",
        "Gå fram till skåpet som skakar och tryck Ctrl!",
      ],
    },
  ],
};
