import type { Case } from "../../cases/types";
import { S2 } from "../names";

// Case 12 – the season 2 finale: Färgtjuven. The exhibition opens tonight, but every painting
// in the new art museum is grey and the purple is gone.
// SPOILER: the thief is S2.scribble – Pia's old pencil sketch that woke up when the Moonstone
// shone so brightly on the festival night. Nobody sees a grey pencil drawing, so it borrows
// colours to paint itself and be seen. But paint that is taken runs off, so it collects the
// colour in jars in the cellar and tries again, night after night. See SEASON2.md.
//
// Built as a "theory ladder": every room changes what Nora believes.
//   Hall:    "Someone brings colours in every night – but the guard saw no one. Skuggan? Pia?"
//            – shiny grey smudges that rub out, the camera, the guard's log, Pia's lost sketchbook.
//   Gallery: "It's tiny and looks DRAWN… or is it the statue?" – drawn footprints, Mona's
//            testimony, big stone prints from the cellar stairs, purple drips toward the cellar.
//   Studio:  "It wants colour – it tries to paint itself!" – the wall with the empty little
//            shape, the note "JAG VILL OCKSÅ SYNAS", and a grey paint tin nobody opened.
//   Cellar:  "The colours are HERE – and the drawing is gone from Pia's sketchbook!" – the jars,
//            the empty page "färglägg sen!", and Granit's plaque (he never touches the paintings).
// The reveal asks who, why and where – each needs clues from several rooms. Only then is the
// little grey figure glimpsed among the paintings, and caught.

const HALL_CLUES = ["clue:lostBook", "clue:guardLog", "clue:camera", "clue:smudges"];
const GALLERY_CLUES = ["clue:prints", "clue:stoneDust", "clue:monaSaw", "clue:emptyPainting"];
const STUDIO_CLUES = ["clue:wallTries", "clue:scribbleNote", "clue:greyPaint"];
const CELLAR_CLUES = ["clue:jars", "clue:sketchbook", "clue:granitPlaque"];

/** Every clue that proves an answer in the reveal. */
const PROOF_CLUES = [
  "clue:smudges",
  "clue:lostBook",
  "clue:camera",
  "clue:prints",
  "clue:monaSaw",
  "clue:emptyPainting",
  "clue:wallTries",
  "clue:scribbleNote",
  "clue:sketchbook",
  "clue:jars",
];

const FADED = 0.8;

export const case12: Case = {
  id: "s2-museum",
  number: 12,
  title: "Färgtjuven",
  startRoom: "hall",
  intro: [
    `${S2.painter} ringer till detektivbyrån.`,
    "\"Nora! Min utställning öppnar i kväll – men alla tavlor är grå, och det lila är BORTA!\"",
    "\"Jag tror att någon bor här i museet …\"",
    `Nora och Ester skyndar till det nya konstmuseet i ${S2.district}.`,
  ],

  rooms: {
    hall: {
      name: "Entréhallen",
      theme: "museum",
      faded: FADED,
      layout: [
        "####DD##############",
        "####..##############",
        "#HH.........KKKcb..#",
        "#...........K......#",
        "#..p....1...K....s.#",
        "#..................#",
        "#..................D",
        "#......HH..........D",
        "#......HH..........#",
        "#..................#",
        "#.........N........#",
        "############DD######",
      ],
      things: {
        p: {
          name: S2.painter,
          person: true,
          sprite: "s2Painter",
          talk: [
            "Nora! Tack för att du kom!",
            "Min utställning öppnar i kväll…",
            "…men titta! Alla tavlor är grå.",
            "Och det lila är BORTA. Helt borta!",
            "Jag tror att någon bor här i museet.",
            "Och som om inte det räckte…",
            "…så tappade jag min gamla skissbok när jag flyttade hit.",
          ],
          gives: "talked-to-painter",
          clue: "lostBook",
          talkIf: [
            { when: "caught", talk: ["Tack, Nora!", "Nu kan utställningen öppna. I ALLA färger!"] },
            {
              when: "solved",
              talk: [
                `${S2.scribble}!? Min lilla skiss har vaknat?`,
                "Men var är den nu?",
                "Den gömmer sig nog bland tavlorna i galleriet.",
                "Hitta den, Nora. Försiktigt – den är säkert jätterädd.",
              ],
            },
            {
              when: "visited:cellar",
              talk: ["Du är nära, Nora! Men något fattas…", "Har du undersökt allt? I alla fyra rummen?"],
            },
            {
              when: HALL_CLUES,
              talk: [
                "Ser du? Någon HAR varit här – fast Ville säger nej.",
                "Galleriet är bakom dörren längst upp till vänster.",
                "Jag byggde ett färglås till den, för barnen på utställningen.",
                "Skriv färgens namn, så öppnas dörren!",
              ],
            },
            {
              when: "talked-to-painter",
              talk: ["Har du hittat något?", "Titta noga här i hallen. Vakten Villes bok ligger på disken."],
            },
          ],
          puzzle: "reveal",
          puzzleWhen: PROOF_CLUES,
          puzzleIntro: ["Nora! Du har varit i källaren!", "Vet du nu vem som tar färgerna? Och varför?"],
        },
        c: {
          name: "Kameraskärmen",
          sprite: "museumCamera",
          on: "K",
          talk: [
            "Skärmen visar vad kameran vid entrén har sett.",
            "Varje natt i fem nätter, klockan tre:",
            "En färgad glöd svävar in genom entrén!",
            "Röd. Gul. Grön. Blå. Orange.",
            "Den svävar genom hallen – och ner i trappan till höger.",
            "Men bilden är grå och suddig. Man ser bara glöden.",
          ],
          clue: "camera",
          talkIf: [{ when: "caught", talk: ["Skärmen visar hallen.", "I FÄRG!"] }],
        },
        b: {
          name: "Vaktboken",
          sprite: "museumGuardLog",
          on: "K",
          talk: [
            `${S2.guard}s vaktbok. Han skriver snyggt:`,
            "\"I natt: gick runt hela natten.\"",
            "\"Allt lugnt. INGEN har varit här!\"",
            `\"/ ${S2.guard}\"`,
          ],
          clue: "guardLog",
        },
        s: {
          name: "Skylten",
          sprite: "sign",
          talk: [
            `KONSTMUSEET I ${S2.district.toUpperCase()}`,
            `Utställning: ${S2.painter.toUpperCase()} – FÄRG!`,
            "Öppnar i kväll klockan sju.",
          ],
        },
      },
      clues: { "1": "smudges" },
      onEnter: {
        name: "Ester",
        talk: [
          "Oj, Nora… allt är så GRÅTT här.",
          "Nästan som ett gammalt foto.",
          "Det är som i hela stan: färgerna försvinner, en efter en.",
          `Kom, vi pratar med ${S2.painter}!`,
        ],
      },
      doors: [
        {
          at: "top",
          to: "gallery",
          requires: "gallery-open",
          puzzle: "colour-lock",
          lockedText: "Dörren till galleriet har ett färglås.",
        },
        { at: "bottom", lockedText: "Vi kan inte gå nu! Utställningen öppnar i kväll." },
        // The staff stairs down to the cellar – a shortcut back, once Nora has been down there.
        {
          at: "right",
          to: "cellar",
          stairs: "down",
          requires: "visited:cellar",
          lockedText: "En personaltrappa ner till källaren. Men dörren är låst från andra sidan.",
        },
      ],
    },

    gallery: {
      name: "Galleriet",
      theme: "museum",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#m....HHH....t.....#",
        "#..................D",
        "#...HH.....HH......D",
        "#...HH..1..HH......#",
        "#..................#",
        "#.......HHH....HH..#",
        "D..............HH..#",
        "D..2...............#",
        "#..................#",
        "####DD##############",
      ],
      things: {
        m: {
          name: "Mona",
          person: true,
          sprite: "museumMona",
          talk: [
            "Oj! En besökare. Mina ögon följer dig, lilla vän.",
            "Jag är Mona. Jag har hängt i den här ramen i hundra år.",
            "I natt såg jag något… litet och grått.",
            "Det såg ut som en klotterteckning!",
            "Det klättrade upp på tavlorna.",
            "Och sen… var det lila borta.",
            "Vakten gick förbi med sin lampa. Han såg ingenting!",
            "Och ibland skakar tavlorna. Brr.",
          ],
          clue: "monaSaw",
          talkIf: [
            { when: "caught", talk: ["Vilka färger!", "Nu ser jag allt igen. Och jag ser jättefin ut!"] },
            { when: "solved", talk: ["Den lilla grå?", "Den kilade in bakom en tavla alldeles nyss!"] },
          ],
        },
        t: {
          name: "Den grå tavlan",
          sprite: "museumGreyPainting",
          talk: [
            `Det här var ${S2.painter}s lila tavla.`,
            "Den är inte övermålad. Penseldragen syns fortfarande…",
            "…men färgen är BORTA.",
            "Nedanför ramen: små lila droppar.",
            "De leder bort mot trappan ner, till vänster.",
          ],
          clue: "emptyPainting",
          talkIf: [{ when: "caught", talk: ["Tavlan är lila igen!", "Den lyser nästan."] }],
        },
      },
      clues: { "1": "prints", "2": "stoneDust" },
      onEnter: {
        name: "Ester",
        talk: [
          "Galleriet… alla tavlor är grå.",
          `Titta, där går ${S2.guard} med sin ficklampa!`,
          "Han tror att alla är tjuvar i kväll.",
          "Vänta tills han har gått förbi – och smit sen!",
          "Och den där tavlan uppe till vänster… tittar den på oss?",
        ],
      },
      monsters: [
        { type: "patroller", sprite: "s2Guard", path: [[2, 6], [17, 6]], speed: 30 },
        // S2.scribble. First only a painting shakes now and then; once Nora has found the
        // empty page in the cellar she glimpses it; at the end it hides behind a painting.
        {
          type: "crawler",
          sprite: "s2Scribble",
          routes: [
            [[2, 3], [6, 3]],
            [[13, 3], [17, 3]],
            [[12, 9], [17, 9]],
            [[5, 10], [10, 10]],
          ],
          shelters: [[7, 2], [4, 4], [11, 5], [9, 7], [16, 8]],
          unseenUntil: "clue:sketchbook",
          catchWhen: "solved",
        },
      ],
      doors: [
        { at: "bottom", to: "hall" },
        {
          at: "right",
          to: "studio",
          stairs: "up",
          requires: "studio-open",
          puzzle: "catalogue",
          lockedText: "Trappan upp till ateljén är låst med ett kodlås.",
        },
        {
          at: "left",
          to: "cellar",
          stairs: "down",
          requires: "cellar-key",
          lockedText: `Trappan ner till källaren är låst. En lapp: \"Nyckeln ligger i mitt färgskåp i ateljén. / P.P.\"`,
        },
      ],
    },

    studio: {
      name: "Ateljén",
      theme: "museum",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#...w.......HH..c..#",
        "#..................#",
        "#..................#",
        "D.........g........#",
        "D..................#",
        "#....HH.......2....#",
        "#....HH............#",
        "#.............HH...#",
        "#.............HH...#",
        "####################",
      ],
      things: {
        w: {
          name: "Väggen",
          sprite: "museumWallTries",
          talk: [
            "Lågt ner på väggen: fläckar av rött, gult, grönt, blått och orange.",
            "Allt har runnit ner i långa ränder.",
            "Mitt i fläckarna finns en tom, vit form.",
            "En liten rund figur, med små streckben!",
            "Som om någon stod mot väggen… och försökte måla sig själv.",
            "Om och om igen.",
            "Men golvet är torrt. Någon har samlat upp färgen.",
          ],
          clue: "wallTries",
        },
        g: {
          name: "En burk grå färg",
          sprite: "museumGreyBucket",
          talk: [
            `En stor burk grå färg. Har ${S2.painter} målat tavlorna grå?`,
            "Nora försöker öppna den…",
            "…men locket har torkat fast. Ingen har öppnat den på länge.",
          ],
          clue: "greyPaint",
        },
        c: {
          name: "Färgskåpet",
          sprite: "museumCabinet",
          talk: [
            `${S2.painter}s färgskåp. Det har ett färglås.`,
            "Man ska välja vilken färg det blir när man blandar.",
          ],
          talkIf: [
            {
              when: "cellar-key",
              talk: ["Skåpet är öppet.", "Tuberna är lika grå som allt annat.", "Men nyckeln till källaren – den har du nu!"],
            },
          ],
          puzzle: "mix",
        },
      },
      clues: { "2": "scribbleNote" },
      onEnter: {
        name: "Ester",
        talk: [
          `${S2.painter}s ateljé! Här målar hon sina tavlor.`,
          "Det luktar färg…",
          "…men allt är grått, precis som därnere.",
        ],
      },
      doors: [{ at: "left", to: "gallery", stairs: "down" }],
    },

    cellar: {
      name: "Källaren",
      theme: "storage",
      faded: FADED,
      layout: [
        "####################",
        "####################",
        "#LL...LL.....j...LL#",
        "#L.................D",
        "#......LL..........D",
        "#......LL..........#",
        "#..................#",
        "#..b.........g.....#",
        "D...LL.............#",
        "D...LL.......LL..x.#",
        "#LLL.........LL..LL#",
        "####################",
      ],
      things: {
        j: {
          name: "Hyllan med burkar",
          sprite: "museumJarShelf",
          talk: [
            "En hylla full av glasburkar!",
            "De står huller om buller.",
            "Etiketterna är vända inåt…",
            "Kanske syns de om man ställer burkarna i ordning?",
          ],
          talkIf: [
            {
              when: "jars-sorted",
              talk: [
                "Nu står burkarna i ordning. Och etiketterna syns!",
                "De är skrivna med darrig blyerts:",
                "Rött: FYREN. Gult: SKOLAN. Grönt: VÄXTHUSET.",
                "Blått: AKVARIET. Orange: TIVOLIT.",
                "Och lila: MUSEET.",
                "Alla färger som har försvunnit… finns HÄR!",
              ],
              clue: "jars",
            },
          ],
          puzzle: "jar-grid",
        },
        b: {
          name: "En gammal skissbok",
          sprite: "museumSketchbook",
          talk: [
            "En gammal skissbok, i ett hörn bakom lådorna.",
            "Det står P.P. på omslaget.",
            `Är det ${S2.painter}s bok?`,
            "Den ligger som en liten säng…",
            `På en sida står det: \"${S2.scribble} – färglägg sen! / P.P.\"`,
            "Men sidan är TOM. Bara några suddiga streck finns kvar.",
            "Som om teckningen har klivit ut ur boken!",
          ],
          clue: "sketchbook",
        },
        g: {
          name: "Skylten vid statyn",
          sprite: "sign",
          talk: [
            "En skylt vid den stora statyn:",
            "\"GRANIT. Går i sömnen varje natt.\"",
            "\"Han går upp och tittar på tavlorna.\"",
            "\"Men han har aldrig rört en enda tavla.\"",
            `\"Väck honom inte! / ${S2.guard}\"`,
          ],
          clue: "granitPlaque",
        },
        x: {
          name: "Något glittrar",
          sprite: "monsterEgg",
          talk: ["Ett hemligt monsterägg – bakom lådorna!", "Det är varmt… och det skimrar i alla färger."],
          gives: "egg",
          hideWhen: "egg",
        },
      },
      onEnter: {
        name: "Ester",
        talk: [
          "Källaren. Det är kallt och mörkt här nere.",
          "Titta – en jättestor staty! Den… snarkar?",
          "Hoppa INTE nära den, Nora. Smyg förbi!",
        ],
      },
      monsters: [{ type: "sleeper", sprite: "museumGranit", at: [15, 6] }],
      doors: [
        { at: "right", to: "gallery", stairs: "up" },
        { at: "left", to: "hall", stairs: "up" },
      ],
    },
  },

  puzzles: {
    "colour-lock": {
      type: "word",
      mode: "spell",
      title: "Färglåset",
      text: ["Dörren till galleriet har ett färglås.", "Vilken färg har klicken?", "Skriv färgens namn!"],
      words: ["RÖD", "GUL", "GRÖN", "BLÅ", "ORANGE", "LILA", "ROSA", "BRUN"],
      pictures: {
        RÖD: "museumSplashRed",
        GUL: "museumSplashYellow",
        GRÖN: "museumSplashGreen",
        BLÅ: "museumSplashBlue",
        ORANGE: "museumSplashOrange",
        LILA: "museumSplashPurple",
        ROSA: "museumSplashPink",
        BRUN: "museumSplashBrown",
      },
      gives: "gallery-open",
    },
    catalogue: {
      type: "code",
      title: "Kodlåset vid trappan",
      text: [
        "På låset sitter en lapp:",
        "\"Koden = alla tavlor i utställningen.\"",
        "I katalogen står det:",
        "{catWalls} väggar. {catPer} tavlor på varje vägg.",
        "Hur många tavlor är det?",
      ],
      random: { catWalls: [3, 9] },
      words: { catPer: ["2", "5", "10"] },
      answer: "{catWalls}*{catPer}",
      gives: "studio-open",
    },
    mix: {
      type: "choice",
      title: "Färgskåpet",
      text: ["Röd och gul blandas.", "Vilken färg blir det?"],
      options: [
        { id: "orange", label: "Orange", sprite: "museumSplashOrange" },
        { id: "green", label: "Grön", sprite: "museumSplashGreen" },
        { id: "purple", label: "Lila", sprite: "museumSplashPurple" },
        { id: "pink", label: "Rosa", sprite: "museumSplashPink" },
      ],
      answer: "orange",
      // A new mix every game.
      variants: [
        {
          text: ["Röd och gul blandas.", "Vilken färg blir det?"],
          options: [
            { id: "orange", label: "Orange", sprite: "museumSplashOrange" },
            { id: "green", label: "Grön", sprite: "museumSplashGreen" },
            { id: "purple", label: "Lila", sprite: "museumSplashPurple" },
            { id: "pink", label: "Rosa", sprite: "museumSplashPink" },
          ],
          answer: "orange",
          hint: "Röd och gul blir orange – som en apelsin, eller solen när den går ner.",
        },
        {
          text: ["Blå och gul blandas.", "Vilken färg blir det?"],
          options: [
            { id: "orange", label: "Orange", sprite: "museumSplashOrange" },
            { id: "green", label: "Grön", sprite: "museumSplashGreen" },
            { id: "purple", label: "Lila", sprite: "museumSplashPurple" },
            { id: "brown", label: "Brun", sprite: "museumSplashBrown" },
          ],
          answer: "green",
          hint: "Blå och gul blir grön – som gräs.",
        },
        {
          text: ["Röd och blå blandas.", "Vilken färg blir det?"],
          options: [
            { id: "orange", label: "Orange", sprite: "museumSplashOrange" },
            { id: "green", label: "Grön", sprite: "museumSplashGreen" },
            { id: "purple", label: "Lila", sprite: "museumSplashPurple" },
            { id: "pink", label: "Rosa", sprite: "museumSplashPink" },
          ],
          answer: "purple",
          hint: "Röd och blå blir lila – som ett plommon.",
        },
        {
          text: ["Röd och vit blandas.", "Vilken färg blir det?"],
          options: [
            { id: "orange", label: "Orange", sprite: "museumSplashOrange" },
            { id: "brown", label: "Brun", sprite: "museumSplashBrown" },
            { id: "purple", label: "Lila", sprite: "museumSplashPurple" },
            { id: "pink", label: "Rosa", sprite: "museumSplashPink" },
          ],
          answer: "pink",
          hint: "Lite vitt gör en färg ljusare. Röd och vit blir rosa!",
        },
      ],
      gives: "cellar-key",
    },
    "jar-grid": {
      type: "grid",
      title: "Burkarna på hyllan",
      text: [
        "Ställ burkarna i ordning!",
        "Varje färg ska finnas EN gång",
        "i varje rad, varje kolumn och varje fyrkant.",
      ],
      symbols: ["museumJarRed", "museumJarYellow", "museumJarBlue", "museumJarGreen"],
      givens: 7,
      gives: "jars-sorted",
    },
    reveal: {
      type: "reveal",
      title: "Avslöjandet",
      text: ["Nu löser vi säsongens största mysterium!"],
      questions: [
        {
          question: "Vem tar färgerna?",
          options: [
            { id: "guard", label: S2.guard, sprite: "s2Guard" },
            { id: "granit", label: "Granit", sprite: "museumGranit" },
            { id: "painter", label: S2.painter, sprite: "s2Painter" },
            { id: "skuggan", label: "Skuggan", sprite: "skuggan" },
            { id: "scribble", label: `${S2.scribble}, den ritade figuren`, sprite: "s2Scribble" },
          ],
          answer: "scribble",
          // Pencil smudges, drawn footprints, a scribble on the paintings, an empty drawn shape
          // on the wall – and the page in the sketchbook where the drawing is missing.
          proof: ["smudges", "prints", "monaSaw", "wallTries", "sketchbook"],
          missing: {
            smudges: "Titta på fläckarna i entréhallen. Vad hände när Nora gnuggade på dem?",
            prints: "Vilka spår fanns mellan tavlorna i galleriet? Hur såg de ut?",
            monaSaw: "Någon i galleriet har hängt där i hundra år och ser allt. Vad såg hon?",
            wallTries: "Något på väggen i ateljén visar hur tjuven ser ut. Vilken form var tom?",
            sketchbook: `${S2.painter} tappade något när hon flyttade hit. Var låg det – och vad fattades i det?`,
          },
          whyNot: {
            guard: `${S2.guard} är stor och har skor. Spåren är pyttesmå och ritade. Han såg bara inte den som var här!`,
            granit: "Granit har stora stenfötter – spåren vid tavlorna är små och ritade. Läs skylten vid honom i källaren!",
            painter: `${S2.painter} vill ju att utställningen ska bli fin! Och ingen har öppnat burken med grå färg.`,
            skuggan: "En skugga går inte att sudda bort. Men fläckarna i hallen gick att sudda – som blyerts!",
          },
          why: {
            lostBook: `${S2.painter} tappade sin skissbok. Men vad som hände med den – det visar boken själv!`,
            guardLog: `${S2.guard} skrev att ingen var här. Men spåren visar att han hade fel. Vem var det, då?`,
            camera: "Kameran visar att någon bar in färgerna. Men bilden är för suddig för att se vem.",
            stoneDust: "Stendammet kommer från Granit. Men hans fötter är stora – tjuvens spår är pyttesmå.",
            emptyPainting: "Tavlan visar att det lila är borta. Men inte vem som tog det.",
            scribbleNote: "Lappen berättar vad någon VILL. Spara den till nästa fråga!",
            greyPaint: "Ingen har öppnat den grå burken. Ingen har målat tavlorna grå!",
            jars: "Burkarna visar VAR färgerna är. Spara dem till sista frågan!",
            granitPlaque: "Skylten visar att Granit aldrig rör tavlorna. Men vem gör det, då?",
          },
        },
        {
          question: `Varför tar ${S2.scribble} färgerna?`,
          options: [
            { id: "seen", label: `${S2.scribble} vill ha färg – och synas` },
            { id: "ruin", label: `${S2.scribble} vill förstöra utställningen` },
            { id: "angry", label: `${S2.scribble} är arg på ${S2.painter}` },
            { id: "eat", label: `${S2.scribble} äter färg` },
            { id: "sell", label: `${S2.scribble} vill sälja färgerna` },
          ],
          answer: "seen",
          // Pia lost the book before she coloured it in, the page says "färglägg sen!",
          // it tried to paint itself on the wall, and it wrote that it wants to be seen.
          proof: ["lostBook", "sketchbook", "wallTries", "scribbleNote"],
          missing: {
            lostBook: `Varför hann ${S2.painter} aldrig färglägga sin skiss? Vad berättade hon i entréhallen?`,
            sketchbook: "Vad stod det på den tomma sidan i skissboken? Vad blev aldrig gjort?",
            wallTries: "Vad försökte någon göra vid väggen i ateljén?",
            scribbleNote: "Någon skrev en liten lapp i ateljén. Vad ville den?",
          },
          whyNot: {
            ruin: "Den som vill förstöra försöker inte måla sig själv. Titta på väggen i ateljén!",
            angry: "Ingen ledtråd visar att någon är arg. Läs lappen i ateljén igen!",
            eat: "Ingen har ätit upp färgen – den har samlats ihop. Vad försökte någon göra med den?",
            sell: "Ingen säljer färg som står gömd i en källare. Vad stod det i skissboken?",
          },
          why: {
            guardLog: `${S2.guard}s bok visar bara att han inte såg någon. Inte varför färgerna togs.`,
            camera: `Kameran visar att färgerna bars in. Men varför? Titta på vad ${S2.scribble} själv har gjort och skrivit!`,
            smudges: `Fläckarna visar att ${S2.scribble} är gjord av blyerts. Men inte varför färgerna togs.`,
            prints: `Spåren visar var ${S2.scribble} har gått. Inte varför.`,
            stoneDust: "Stendammet kommer från Granit. Det säger inget om varför färgerna togs.",
            monaSaw: `Mona såg vad ${S2.scribble} gjorde – men inte varför.`,
            emptyPainting: "Tavlan visar att det lila är borta. Inte varför någon tog det.",
            greyPaint: `Den grå burken är ${S2.painter}s – och ingen har öppnat den.`,
            jars: "Burkarna visar var färgerna är. Spara dem till sista frågan!",
            granitPlaque: "Skylten handlar om Granit. Det säger inget om varför färgerna togs.",
          },
        },
        {
          question: "Var är färgerna nu?",
          options: [
            { id: "jars", label: "I glasburkar i källaren", sprite: "s2PaintJar" },
            { id: "granit", label: "I Granits mage", sprite: "museumGranit" },
            { id: "cabinet", label: `I ${S2.painter}s färgskåp`, sprite: "museumCabinet" },
            { id: "floor", label: "Utspillda på golvet" },
            { id: "gone", label: "Borta för alltid" },
          ],
          answer: "jars",
          // Every colour was carried in and down the stairs, the purple dripped toward the
          // cellar stairs – and there they stand in jars with the places written on them.
          proof: ["camera", "emptyPainting", "jars"],
          missing: {
            camera: "Vad visade kameran i entréhallen? Vart tog glöden vägen?",
            emptyPainting: "Titta på den grå tavlan i galleriet. Vart ledde dropparna?",
            jars: "Vad stod på hyllan i källaren – när allt stod i ordning?",
          },
          whyNot: {
            granit: "Granit rör aldrig tavlorna – det står på skylten vid honom.",
            cabinet: `I ${S2.painter}s skåp fanns bara hennes egna tuber. Lika grå som allt annat.`,
            floor: "Golvet under väggen i ateljén var torrt. Någon hade samlat upp färgen!",
            gone: "Kameran visade att färgerna bars IN i museet. Då finns de här någonstans!",
          },
          why: {
            lostBook: "Att skissboken tappades säger inget om var färgerna är.",
            guardLog: `${S2.guard} skrev att ingen var här. Men han såg ju inte ens vart färgerna tog vägen!`,
            smudges: "Fläckarna visar vad tjuven är gjord av. Inte var färgerna är.",
            prints: "Spåren går runt bland tavlorna. De visar inte vart färgerna tog vägen.",
            stoneDust: "Stendammet visar vart Granit går i sömnen. Men han rör aldrig tavlorna!",
            monaSaw: "Mona såg att det lila försvann – men inte vart det tog vägen.",
            wallTries: "Väggen visar att någon samlade upp färgen. Men vart tog den vägen sen?",
            scribbleNote: "Lappen berättar vad någon vill. Inte var färgerna är.",
            greyPaint: "Den grå burken är full av grå färg. Inte av de färger som försvann.",
            sketchbook: `Skissboken visar vem ${S2.scribble} är. Men burkarna visar var färgerna är!`,
            granitPlaque: "Skylten handlar om Granit. Inte om färgerna.",
          },
        },
      ],
      gives: "solved",
    },
  },

  clues: {
    lostBook: {
      name: `${S2.painter}s skissbok`,
      sprite: "s2Painter",
      text: `${S2.painter} tappade sin gamla skissbok när hon flyttade till museet. Hon hann aldrig göra klart allt i den.`,
    },
    guardLog: {
      name: "Vaktboken",
      sprite: "museumGuardLog",
      text: `${S2.guard} skrev: \"I natt: gick runt hela natten. Allt lugnt. INGEN har varit här!\"`,
    },
    camera: {
      name: "Kameran",
      sprite: "museumCamera",
      text: "Fem nätter i rad, klockan tre, svävade en färgad glöd in genom entrén – röd, gul, grön, blå, orange – och ner i trappan till höger. Bilden är för suddig för att se vem som bar den.",
    },
    smudges: {
      name: "Blanka grå fläckar",
      sprite: "museumSmudges",
      text: "Grå fläckar på golvet. De glänser lite, som silver. När Nora gnuggar på en suddas den ut – som när man suddar en teckning!",
    },
    prints: {
      name: "Ritade fotspår",
      sprite: "s2ScribblePrints",
      text: "Pyttesmå fotspår på golvet – de ser RITADE ut, med blyerts! De går runt, runt, från tavla till tavla.",
    },
    stoneDust: {
      name: "Stendamm",
      sprite: "museumStonePrints",
      text: "Grått stendamm och stora, runda fotspår. De kommer från trappan ner till källaren, går fram till tavlorna – och tillbaka.",
    },
    monaSaw: {
      name: "Monas vittnesmål",
      sprite: "museumMona",
      text: "Mona såg något litet och grått i natt. Det såg ut som en klotterteckning! Det klättrade upp på tavlorna – och sen var det lila borta.",
    },
    emptyPainting: {
      name: "Den grå tavlan",
      sprite: "museumGreyPainting",
      text: "Den lila tavlan är inte övermålad – penseldragen syns, men färgen är borta. Små lila droppar leder mot trappan ner till källaren.",
    },
    wallTries: {
      name: "Väggen i ateljén",
      sprite: "museumWallTries",
      text: "Färger har runnit ner runt en tom, vit form: en liten rund figur med streckben. Någon har försökt måla sig själv – om och om igen. Golvet är torrt: färgen har samlats upp.",
    },
    scribbleNote: {
      name: "Den lilla lappen",
      sprite: "museumNote",
      text: "En liten lapp med darriga blyertsbokstäver: \"JAG VILL OCKSÅ SYNAS.\"",
    },
    greyPaint: {
      name: "Burken med grå färg",
      sprite: "museumGreyBucket",
      text: `En stor burk grå färg i ${S2.painter}s ateljé. Men locket har torkat fast – ingen har öppnat den på länge.`,
    },
    jars: {
      name: "Burkarna i källaren",
      sprite: "museumJarShelf",
      text: "Glasburkar fulla med färg, med darrig blyerts på etiketterna: rött FYREN, gult SKOLAN, grönt VÄXTHUSET, blått AKVARIET, orange TIVOLIT och lila MUSEET.",
    },
    sketchbook: {
      name: "Den tomma sidan",
      sprite: "museumSketchbook",
      text: `${S2.painter}s skissbok låg i källaren. På en sida står det \"${S2.scribble} – färglägg sen! / P.P.\" Men sidan är tom – som om teckningen har klivit ut!`,
    },
    granitPlaque: {
      name: "Skylten vid Granit",
      sprite: "sign",
      text: "\"GRANIT. Går i sömnen varje natt och tittar på tavlorna. Men han har aldrig rört en enda tavla.\"",
    },
  },

  items: {
    magnifier: { name: "Förstoringsglaset", sprite: "magnifier" },
    "cellar-key": { name: "Källarnyckeln", sprite: "key" },
    egg: { name: "Monsterägget", sprite: "monsterEgg" },
    "drop-purple": { name: "Den lila droppen", sprite: "dropPurple" },
  },

  finale: [
    { say: "Nora", lines: ["Där är du!", `Du behöver inte gömma dig, ${S2.scribble}.`] },
    { say: S2.scribble, lines: ["N-nej! Sudda inte ut mig!", "Snälla… jag är så rädd."] },
    { say: "Nora", lines: ["Ingen ska sudda ut dig.", "Vi vill bara förstå."] },
    {
      say: S2.scribble,
      lines: [
        "Jag var en teckning i en bok.",
        "Men natten då den runda stenen lyste så starkt…",
        "…då vaknade jag.",
      ],
    },
    {
      say: S2.scribble,
      lines: [
        "Alla i stan var så färgglada.",
        "Men ingen såg mig. Jag är ju bara grå streck.",
        "Så jag lånade färg och målade mig.",
        "Men den rann av. Varje gång!",
      ],
    },
    {
      say: "Nora",
      lines: ["Nu förstår jag. Du ville bara synas.", "Men när du tog färgerna blev hela stan grå.", "Och alla blev ledsna."],
    },
    { say: S2.scribble, lines: ["Det visste jag inte… förlåt!", "Här. Det sista lila."] },
    { reveal: "culprit", sprite: "dropPurple" },
    { give: "drop-purple" },
    { say: "Ester", lines: ["Nora! Nu har du ALLA sex färgdroppar!"] },
    { enter: "painter", sprite: "s2Painter", from: [4, 11], to: [5, 9] },
    {
      say: S2.painter,
      lines: [`${S2.scribble}? Min lilla skiss!`, "Jag skulle ju färglägga dig… sen.", "Men jag tappade boken. Förlåt att du fick vänta!"],
    },
    { say: "Nora", lines: [`Här, ${S2.painter}. Ta mina färgdroppar!`, "Färg som man FÅR – den kanske fastnar?"] },
    { enter: "red", sprite: "dropRed", from: [7, 10], to: [7, 10] },
    { enter: "yellow", sprite: "dropYellow", from: [8, 10], to: [8, 10] },
    { enter: "green", sprite: "dropGreen", from: [9, 10], to: [9, 10] },
    { enter: "blue", sprite: "dropBlue", from: [10, 10], to: [10, 10] },
    { enter: "orange", sprite: "dropOrange", from: [11, 10], to: [11, 10] },
    { say: S2.painter, lines: ["Och så det lila…", "Nu målar jag dig. I ALLA färger!"] },
    { hide: "red" },
    { hide: "yellow" },
    { hide: "green" },
    { hide: "blue" },
    { hide: "orange" },
    { flash: true },
    { frame: "culprit", index: 2 },
    { say: S2.scribble, lines: ["Titta! Den sitter KVAR!", "Jag är röd och gul och grön och blå…", "…och orange och LILA!"] },
    { say: S2.painter, lines: ["Färg som man tar, den rinner av.", "Men färg som man får – den fastnar."] },
    { recolor: true },
    { say: "Ester", lines: ["Nora, titta! Färgerna kommer tillbaka!", `Överallt – i hela ${S2.district}!`] },
    { say: S2.guard, lines: ["Oj oj. Jag skrev att ingen var här i natt…", "…men jag såg bara inte den lilla. Förlåt!"] },
    { enter: "trattis", sprite: "trattis", from: [4, 11], to: [12, 10] },
    { enter: "smulan", sprite: "smulan", from: [5, 11], to: [14, 10] },
    { enter: "fladder", sprite: "fladder", from: [4, 11], to: [13, 8] },
    { say: "Trattis", lines: ["Vi hörde att det var utställning!"] },
    { say: "Smulan", lines: ["Mums! Jag tog med bullar.", "REGNBÅGSbullar!"] },
    { say: "Fladder", lines: ["Det kommer folk från hela stan!"] },
    {
      say: S2.painter,
      lines: [
        `${S2.keeper} och ${S2.fisher}! ${S2.teacher} och ${S2.janitor}!`,
        `${S2.gardener}, ${S2.diver} – och ${S2.clown}!`,
        "Välkomna allihop!",
      ],
    },
    { enter: "skuggan", sprite: "skuggan", from: [5, 11], to: [16, 10] },
    { frame: "skuggan", index: 2 },
    { reveal: "skuggan", sprite: "skuggNightLight" },
    { say: "Skuggan", lines: ["Jag tog med mitt nattljus.", "Men i kväll behövs det inte. Allt lyser ju!"] },
    { say: S2.painter, lines: [`${S2.scribble}, vill du bo här i museet?`, "Då blir du museets eget konstverk!"] },
    { say: S2.scribble, lines: ["Ja! Då syns jag varje dag!"] },
    {
      say: S2.painter,
      lines: ["Och titta på väggen där borta.", "Där hänger en ny tavla.", "Den är målad av en detektiv som heter Nora!"],
    },
    {
      say: "Nora",
      lines: ["Alla förtjänar att synas.", "Och man kan be om hjälp – i stället för att ta."],
    },
    { say: "Ester", lines: ["Mysteriet med färgtjuven är löst!", "Vi är världens bästa detektiver, Nora!"] },
  ],

  summary: [
    "Så här hängde allt ihop, Nora:",
    `Blanka blyertsfläckar, ritade fotspår – och Mona såg en liten klotterfigur. Färgtjuven var gjord av blyerts!`,
    `I källaren låg ${S2.painter}s borttappade skissbok. Sidan med ${S2.scribble} var tom: teckningen hade klivit ut!`,
    `På väggen i ateljén hade ${S2.scribble} försökt måla sig själv, om och om igen. \"Jag vill också synas\", skrev ${S2.scribble}.`,
    "Kameran och de lila dropparna visade vägen ner. Där stod burkarna med alla sex färgerna.",
    `Det var ${S2.scribble} hela tiden: spåren i fyren, skisssidan i skolan, dropparna i växthuset, bilden i akvariet och clownens berättelse på tivolit.`,
    `Ingen såg ${S2.scribble} – så ${S2.scribble} tog färg. Men färg fastnar bäst när man får den. Man kan be om hjälp i stället för att ta!`,
  ],

  fact: "Regnbågen har sju färger: röd, orange, gul, grön, blå, indigo och violett. Solljuset ser vitt ut, men det är alla färgerna blandade – regndropparna delar upp ljuset så att vi ser dem!",

  cards: [
    {
      sprite: "s2Scribble",
      name: S2.scribble,
      text: "En liten skiss som vaknade till liv. Grå som blyerts och nästan osynlig – tills den fick färg i present!",
    },
    { sprite: "museumGranit", name: "Granit", text: "En stenstaty som går i sömnen. Hoppa inte nära honom – då vaknar han med ett GRRR!" },
    { sprite: "museumMona", name: "Mona", text: "Ett porträtt med ögon som följer dig överallt. Hon ser allt som händer i galleriet." },
  ],

  goals: [
    {
      text: "Ta reda på vad som har hänt",
      doneWhen: "talked-to-painter",
      hints: [
        `${S2.painter} har ringt. Hon väntar i entréhallen.`,
        `Gå fram till ${S2.painter} och tryck Ctrl.`,
        `${S2.painter} står till vänster i hallen, med en basker på huvudet.`,
      ],
    },
    {
      text: "Leta efter ledtrådar i entréhallen",
      doneWhen: HALL_CLUES,
      hints: [
        { text: "Titta noga på golvet!", skipWhen: "clue:smudges" },
        { text: "Det står saker på disken uppe till höger.", skipWhen: ["clue:guardLog", "clue:camera"] },
        { text: `${S2.painter} har mer att berätta. Prata med henne!`, skipWhen: "clue:lostBook" },
        "Titta på skärmen och boken på disken uppe till höger – och på golvet mitt i hallen.",
      ],
    },
    {
      text: "Undersök galleriet",
      doneWhen: GALLERY_CLUES,
      hints: [
        { text: "Galleriet är bakom dörren längst upp till vänster. Men den har ett färglås…", skipWhen: "gallery-open" },
        { text: "Titta på färgklicken på låset. Vilken färg är det? Skriv ordet!", skipWhen: "gallery-open" },
        { text: "Ordet börjar på {colour-lock:first} och har {colour-lock:length} bokstäver.", skipWhen: "gallery-open" },
        { text: "Akta dig för vakten! Vänta tills han har gått förbi – och smit sen.", when: "gallery-open" },
        { text: "Titta på golvet – mellan tavlorna och nere till vänster.", when: "gallery-open", skipWhen: ["clue:prints", "clue:stoneDust"] },
        { text: "Tavlan uppe till vänster har ögon som följer dig… Prata med den!", when: "gallery-open", skipWhen: "clue:monaSaw" },
        { text: "En tavla längst upp har blivit helt grå. Titta på den!", when: "gallery-open", skipWhen: "clue:emptyPainting" },
      ],
    },
    {
      text: "Undersök ateljén",
      doneWhen: STUDIO_CLUES,
      hints: [
        { text: "Ateljén är uppför trappan till höger i galleriet. Men den har ett kodlås.", skipWhen: "studio-open" },
        { text: "Läs lappen på låset: hur många väggar – och hur många tavlor på varje?", skipWhen: "studio-open" },
        { text: "Räkna {catWalls} gånger {catPer}. Hoppa {catPer} steg i taget, {catWalls} gånger!", skipWhen: "studio-open" },
        { text: "Du kan gå upp! Trappan är till höger i galleriet.", when: "studio-open", skipWhen: "visited:studio" },
        { text: "Titta på väggen längst upp till vänster i ateljén.", when: "visited:studio", skipWhen: "clue:wallTries" },
        { text: "Något litet ligger på golvet, till höger.", when: "visited:studio", skipWhen: "clue:scribbleNote" },
        { text: "Vad står mitt i rummet? En stor burk…", when: "visited:studio", skipWhen: "clue:greyPaint" },
      ],
    },
    {
      text: "Undersök källaren",
      doneWhen: CELLAR_CLUES,
      hints: [
        { text: "Trappan ner till källaren är till vänster i galleriet. Den är låst – läs lappen!", skipWhen: "cellar-key" },
        { text: "Nyckeln ligger i färgskåpet uppe till höger i ateljén.", skipWhen: "cellar-key" },
        { text: "Färgskåpet: {mix:hint}", skipWhen: "cellar-key" },
        { text: "Du har nyckeln! Gå ner för trappan till vänster i galleriet.", when: "cellar-key", skipWhen: "visited:cellar" },
        { text: "Granit sover. Hoppa inte nära honom – smyg förbi!", when: "visited:cellar" },
        { text: "Det står en hylla med burkar längst upp. Ställ dem i ordning!", when: "visited:cellar", skipWhen: "jars-sorted" },
        {
          text: "Varje färg ska finnas EN gång i varje rad, kolumn och fyrkant. Börja där det bara fattas en!",
          when: "visited:cellar",
          skipWhen: "jars-sorted",
        },
        { text: "Något ligger bakom lådorna till vänster.", when: "visited:cellar", skipWhen: "clue:sketchbook" },
        { text: "Läs skylten vid statyn.", when: "visited:cellar", skipWhen: "clue:granitPlaque" },
      ],
    },
    {
      text: "Vem tar färgerna – varför – och var är de?",
      doneWhen: "solved",
      hints: [
        `Gå tillbaka till ${S2.painter} i entréhallen. Trappan till vänster i källaren är en genväg!`,
        "Vem är gjord av blyerts? Tänk på fläckarna, spåren, Mona, väggen och skissboken.",
        "Varför? Läs vad som stod i skissboken, på lappen och vad som hände vid väggen.",
        "Var är färgerna? Kameran, de lila dropparna och burkarna visar vägen.",
      ],
    },
    {
      text: `Hitta ${S2.scribble}!`,
      doneWhen: "caught",
      hints: [
        `${S2.scribble} gömmer sig bland tavlorna i galleriet.`,
        "Titta noga – vilken tavla skakar?",
        "Gå fram till tavlan som skakar och tryck Ctrl!",
      ],
    },
  ],
};
