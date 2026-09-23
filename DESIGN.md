# Monsterdetektiven 🔍👾

## Om spelet – läs det här först!

Du är **detektiv Nora**. Du löser mysterier i en stad där det bor monster.

Med dig har du **Ester**. Hon är din hjälpreda.

Varje bana är ett nytt **fall**. Något konstigt har hänt! Du letar ledtrådar, löser gåtor och pratar med folk – och med monster.

Fastnar du? Då ropar Ester på dig. Gå till henne så får du ett tips.

Alla monster är inte elaka. Vissa är bara missförstådda. Men akta dig för några av dem!

**Så styr du Nora:**

| Knapp | Vad händer |
|---|---|
| ⬆️ ⬇️ ⬅️ ➡️ | Gå |
| Mellanslag | Hoppa |
| Ctrl | Titta, prata, öppna |

**Du är chef över spelet!** Du bestämmer hur allt ska se ut och vad som ska hända. Längst ner finns frågor som bara du kan svara på.

---

*Allt nedanför är för vuxna och för Claude.*

---

## 1. Beskrivning av spelet

**Monsterdetektiven** är ett mysteriespel för barn i 7–9-årsåldern, med stora delar av skolans innehåll för årskurs 2 inbakat.

I den lilla staden **Mystiska staden** bor människor och monster sida vid sida, och för det mesta går det bra. Men när bullarna försvinner från bageriet, när böckerna i biblioteket flyttar sig om nätterna och när klocktornet plötsligt stannar, då ringer man detektiv Nora.

Nora och hennes medhjälpare Ester letar ledtrådar, förhör vittnen (med två ben eller åtta), knäcker kodlås och löser gåtor tills de kan peka ut vem som låg bakom. Ofta var det inte det läskiga monstret. Och om det var det, så fanns det för det mesta ett skäl.

Spelet ses uppifrån i 2D med pixelgrafik. Det är lugnt och utforskande och ska inte stressa. Man kan inte förlora ett fall. Klockan mäter bara hur lång tid det tog, och den bestämmer när Ester kommer med tips.

**Designprinciper**
1. **Inget game over.** Misstag kostar lite tid, aldrig framsteg.
2. **Kort text, stor text.** Högst två rader per pratbubbla, och uppläsning finns.
3. **Lärande som känns som detektivarbete.** Matte, läsning och natur används som verktyg för att lösa fallet, inte som prov.
4. **Monstren är ganska läskiga** (huvudarkitekten valde 4 av 5). **Blod är ok i måttliga mängder** och i tecknad pixelstil, till exempel från Grymlans arm. Det är godkänt av pappa. Inget grovt våld. Det finns ofta en twist om fördomar och empati.
5. **Barnet äger spelet.** Namn, figurer, story och pussel är hennes. Tekniken ska bara funka.

---

## 2. Spelloopen

```
Titelskärm → Stadskartan (välj fall) → FALLET → Avslöjandet → Stjärnor → tillbaka till kartan
```

**Inne i ett fall:**
1. **Uppdraget.** Någon berättar vad som hänt ("Mina bullar är borta!").
2. **Utforska.** Nora går mellan rum, pratar med personer och monster och undersöker saker med Ctrl.
3. **Ledtrådar.** Det Nora hittar hamnar i **Detektivboken** med en bild och en kort mening.
4. **Pussel.** De låser upp nya rum, föremål och ledtrådar (kodlås, gåtor, spår och så vidare).
5. **Avslöjandet.** Nora samlar alla misstänkta och väljer vem som gjorde det. Svarar man fel säger Ester snällt: "Hmm, stämmer det? Titta i detektivboken!" och man får försöka igen.
6. **Slut.** En kort avslutning, en *"Visste du att…?"*-fakta kopplad till fallet och stjärnor.

---

## 3. Figurer

| Figur | Roll |
|---|---|
| **Nora** | Detektiven som man styr. Nyfiken, modig och smart. **Utseende** (enligt huvudarkitektens teckning, `assets/bilder/teckningar/nora.jpg`): långt grönt hår med bruna hårspännen, svart öppen jacka, turkos och lila randig tröja, brunt bälte, vinröd rutig kjol med spännen (brunt och gult) och gul kant, gråa strumpbyxor och röda kängor. |
| **Ester** | En tjej, Noras kompis och medhjälpare. Hon är med i varje fall, ger tips och kommenterar ibland det som händer. |
| **Vittnen** | Stadens invånare, både människor och monster. De berättar saker (ibland fel saker). |
| **Monster** | Se avsnitt 5. |

**Monster från huvudarkitekten** (förlagor i `assets/bilder/teckningar/`):
- **Fladder** (`monster-vingar.jpg`, Lego): svart monster med stora rosa, genomskinliga fladdermusvingar, en rosa-lila spets på huvudet och arga ljusa ögon. Namnet är hennes.
- **Viskan** (`spoke.jpg`, Lego): ett vitt spöke som lyser i mörkret och ler lite för brett. Hen viskar ens namn bakom ryggen. Namnet är Claudes förslag.
- **Grymlan** (`lila-har.jpg`, teckning): zombieliknande med taggigt lila hår, grön tröja och bruna byxor. Ena armen sitter löst och trillar av. Namnet är Claudes förslag. Det droppar lite blod där armen trillat av (måttligt och tecknat, se designprincip 4).
- **Trattis** (`trattis.jpg`, teckning, huvudarkitektens egen idé och namn): ett svampmonster inspirerat av kantareller. Hen har en spetsig trattformad svamphatt, långt stripigt hår, vampyrtänder som det droppar lite ur och en lång kjol. Färgerna är gyllene kantarellgult och orange (Claudes förslag, teckningen är i blyerts).

---

## 4. Fallen (förslag)

Fall 1 är inlärningsbanan. Därefter blir fallen svårare och tar in nya ämnen.

| # | Fall | Plats | Monster | Skolinnehåll |
|---|---|---|---|---|
| 1 | **Leksaksaffären** (arbetsnamn) ⭐ *huvudarkitektens egen idé* | Leksaksaffären | Bestäms tillsammans med huvudarkitekten | Bestäms senare |
| 2 | **Vem tog bullarna?** | Bageriet och gården | Smulan, ett litet blått snaskmonster | Subtraktion 0–20, följa spår, läsa lappar |
| 3 | **Spöket i biblioteket** | Biblioteket | Bokmalen Bläddra | Alfabetisk ordning, rim, spegelskrift, stavning |
| 4 | **Ljuden i skogen** | Skogen och bäcken | Mossjätten och hens unge | Djurspår, väderstreck och kompass, årstider |
| 5 | **Klocktornet har stannat** | Torget och klocktornet | Kugg-trollet | Klockan (hel, halv, kvart), talföljder, pengar |
| 6 | **Monsterfesten** | Hela staden (final) | Skuggan, och alla monster från tidigare fall | Blandat, ett större slutfall |

### Fall 1: Leksaksaffären

Huvudarkitektens egen idé: *I leksaksaffären har leksakerna börjat röra sig, mitt på dagen!*

Det här blir första fallet och därmed inlärningsbanan (gå, prata, hoppa, första kodlåset). Vem eller vad som ligger bakom, vilka ledtrådar som finns och vilka pussel som ingår bestäms tillsammans med huvudarkitekten.

### Exempel på ett fall i detalj: "Vem tog bullarna?"

*Det här fallet visar hur ett färdigt fall är uppbyggt. Det är nu fall 2, men delar av inlärningen kan flyttas till fall 1.*

- **Start:** Bagaren Berit är ledsen. Hon bakade 15 bullar i morse, och nu finns bara 9 kvar.
- **Inlärning:** Nora lär sig gå, prata (Ctrl) och hoppa över mjölpölar (mellanslag).
- **Ledtrådar:**
  1. Smulor på golvet som leder mot bakdörren.
  2. Ett fotspår med **tre tår**. Vem har tre tår?
  3. En tuss **blått fluff** i dörrspringan.
- **Pussel:** Bakdörren har ett kodlås. Lappen bredvid säger: *"Koden är lika många som bullarna som försvann."* Svaret är 15 − 9 = **6**.
- **På gården:** Följ smulspåret, hoppa över vattenpölar och smyg förbi en sovande gårdskatt. Om man hoppar precis bredvid den vaknar den och jagar Nora tillbaka till dörren.
- **Avslöjandet:** Vem tog bullarna: *Katten Måns / Grannen Gustav / Monstret Smulan / Bagaren själv?* Svaret är Smulan, som har tre tår och blå päls.
- **Twist:** Smulan var hungrig men hade inga pengar. Hen får hjälpa till i bageriet och får betalt i bullar.
- **Visste du att…?** *Att räkna baklänges är samma sak som att ta minus.*
- **Hemlighet:** Ett gömt monsterägg bakom mjölsäckarna.

---

## 5. Monster

Monster är både **hinder** och **personer**. Läskighet: **4 av 5** (huvudarkitektens val). Monstren kan ha lysande ögon, vassa tänder, skuggor och spöklika ljud, och dyka upp oväntat. Lite blod är ok (tecknat och måttligt), men inget grovt våld, och många visar sig vara snällare än de ser ut.

| Typ | Beteende | Hur man klarar det |
|---|---|---|
| **Patrullerare** | Går fram och tillbaka längs en slinga | Tajma när man går förbi |
| **Sovare** | Sover. Vaknar om Nora hoppar nära. | Gå tyst förbi och hoppa inte |
| **Slemmare** | Lämnar slempölar efter sig | Hoppa över slemmet |
| **Vakter** | Står i vägen, till exempel ett brotroll | Svara på en gåta eller ge något de vill ha |
| **Vittnen** | Snälla monster man pratar med | Fråga ut dem och byt saker med dem |

**Om ett monster tar Nora** (huvudarkitektens val):
- "BUU!" Nora blir rädd, skärmen skakar lite och hon **tappar en sak** som studsar iväg och landar någonstans i rummet och glittrar.
- Nora knuffas ett par rutor bakåt och kan inte fångas igen på ett par sekunder, så att monstret inte tar henne flera gånger direkt.
- Hon tappar det föremål hon senast plockade upp. Har hon inga föremål tappar hon **förstoringsglaset**, och då kan hon inte undersöka saker förrän hon hittat det igen.
- Saken landar alltid på en plats man kan nå, en bit från monstrets väg. Ledtrådar i Detektivboken tappas aldrig.

---

## 6. Pussel och pedagogik

Pusslen bygger på centralt innehåll i Lgr22 för årskurs 1–3. Svårigheten ökar mellan fallen.

| Pusseltyp | Hur det styrs | Exempel | Ämne |
|---|---|---|---|
| **Kodlås** | Siffror (tangentbord eller mus) | "Hur många bullar försvann?" | Matte: + och − inom 0–100 |
| **Skriv svaret** | Textruta | Gåtor, anagram ("RMOETNS"), stava | Svenska |
| **Flerval** | Mus eller pilar | "Vilket djur gjorde spåret?" | NO |
| **Sortera** | Dra med musen | Böcker i ABC-ordning, händelser i rätt ordning | Svenska, logik |
| **Para ihop** | Klicka par | Rimord, djur och spår, klockslag och urtavla | Svenska, NO, matte |
| **Hemligt meddelande** | Läs och skriv | A=1, B=2 …, spegelskrift, baklänges | Svenska, matte |
| **Talföljd** | Siffror | 2, 4, 6, __ | Matte: mönster |
| **Ställ klockan** | Dra visarna | "Klockan är kvart över tre" | Matte: tid |
| **Handla** | Välj mynt | "Det kostar 17 kr. Vilka mynt?" | Matte: pengar |
| **Plattor på golvet** | Gå och trampa i rätt ordning | Följ kompassen: N, Ö, S, V | SO: väderstreck |
| **Hitta skillnaden** | Klicka | Vad har ändrats i rummet? | Iakttagelse |
| **Logikpussel** | Klicka i rutnät | 4×4-sudoku med monsterbilder, "vem bor var" | Logik |

**Regler för pussel:**
- Varje pussel har ett **svar** och **tre tips** som blir tydligare och tydligare.
- Svaren kontrolleras förlåtande. Stora och små bokstäver spelar ingen roll, inte heller mellanslag. `6` och `sex` godtas båda, utom när pusslet handlar om stavning.
- Svarar man fel blir det en vänlig reaktion ("Nästan! Försök igen."). Man straffas aldrig.
- Så lite skrivande som möjligt när det inte är just stavning som tränas.

---

## 7. Ester och tipsen

Det här är spelets hjälpsystem och det viktigaste verktyget mot att man tröttnar.

- Ester följer med in i varje rum och ställer sig vid dörren man kom in genom, eller på `E` om det tecknet finns på kartan. Hon är alltid nära.
- En **fastnat-timer** mäter tiden sedan man senast **kom vidare**. Man kommer vidare när man hittar en ledtråd, löser ett pussel, klarar ett mål eller går in i ett nytt rum för första gången.
- När timern går ut:
  - Ester får ett **"!"** över huvudet och säger *"Psst, Nora!"*.
  - En pil vid skärmkanten visar var hon står om hon inte syns.
- Pratar man med Ester då får man nästa tips för det **mål man jobbar på just nu**. Tipsen kommer i tre steg: liten knuff, större knuff, nästan svaret.
- Pratar man med Ester innan timern gått ut påminner hon bara om målet ("Vi ska ta reda på vart smulorna leder!").
- Efter ett tips startar timern om. Nästa tips kommer snabbare, på halva tiden.

| Hjälpnivå (inställning) | Tid tills Ester ropar |
|---|---|
| Mycket hjälp | 1 min |
| Lagom (standard) | 2 min |
| Lite hjälp | 4 min |

---

## 8. Styrning

| Tangent | Funktion |
|---|---|
| Piltangenter | Gå (fyra riktningar) |
| Mellanslag | Hoppa över låga hinder: pölar, stockar, slem, låga staket |
| Ctrl (även **E** och **Enter**) | Använd: prata, öppna, undersöka, plocka upp, bläddra i dialog |
| **B** | Öppna Detektivboken |
| **Esc** | Paus och meny |
| Mus | I pussel och menyer |
| Siffror och bokstäver | I kodlås och textrutor |

**Tekniska fallgropar:** Ctrl+W och Ctrl+R stänger respektive laddar om fliken, och det kan man inte stänga av i webbläsaren. Därför finns E och Enter också som använd-knapp. Piltangenter och mellanslag måste ha `preventDefault` så att sidan inte scrollar. När en textruta är aktiv ska spelets tangenter vara avstängda.

**Hoppet:** Nora lyfter i ungefär 0,5 s (figuren åker upp, skuggan stannar på marken) och kan då passera **en ruta** med lågt hinder. Väggar går inte att hoppa över.

---

## 9. Belöningar

Varje fall ger upp till tre stjärnor:
- ⭐ Du löste fallet.
- ⭐ Du använde högst 2 tips från Ester.
- ⭐ Du hittade det gömda **monsterägget**.

Dessutom:
- **Tiden** visas i slutet ("6 min 12 s, nytt rekord!"). Man tävlar mot sig själv, utan stress.
- **Monsterkort** (huvudarkitektens val): varje monster man mött i ett klarat fall blir ett kort med bild, namn och lite läskig fakta. Korten samlas i en **monstersamling** som man kan titta i från stadskartan.
- *Detektivmärken valdes bort.*

---

## 10. Grafik, ljud och text

- **Stil:** Pixelgrafik med rutor på 16×16 pixlar, uppskalade skarpt. Varma färger och mjuka former.
- **Grafiken från början:** Claude gör pixelgrafiken (se 11.6), eventuellt kompletterad med Kenney.nl "Tiny Town" och "Tiny Dungeon" (CC0, fria att använda).
- **Egen grafik (om hon vill):** Barnet ritar i **Piskel** (piskelapp.com, gratis i webbläsaren) och exporterar PNG. Teckningar på papper kan fotas och användas som förlaga.

### Så görs kartorna och rummen

**Claude gör alla kartor.** Barnet behöver aldrig se hur de lagras. Man ändrar dem genom att prata:
1. Claude bygger rummet och visar det i spelet (förhandsvisning eller skärmbild).
2. Barnet säger vad som ska ändras: *"Gör bageriet mysigare"*, *"Flytta katten närmare dörren"*, *"Lägg till en fontän på torget"*.
3. Claude ändrar och visar igen.

Hon kan också rita ett rum på papper och fota det. Då bygger Claude rummet utifrån teckningen.
- **Ljudeffekter:** Barnet gör dem själv i **sfxr.me** (hopp, pling, BUU!).
- **Musik:** **BeepBox** (beepbox.co), för enkel chiptune-musik i webbläsaren.
- **Text:** Ett lättläst typsnitt (till exempel *Lexend* eller *Atkinson Hyperlegible*, OFL-licens) inbäddat i spelet, minst 24 px, korta meningar och vanliga ord.
- **Uppläsning:** En 🔊-knapp på varje pratbubbla som använder webbläsarens inbyggda talsyntes på svenska (`sv-SE`). Om det inte finns någon svensk röst döljs knappen.

---

## 11. Teknisk design

### 11.1 Val av teknik

| Del | Val | Varför |
|---|---|---|
| Språk | **TypeScript** | Fångar fel innan man spelar. Claude jobbar säkrare med typer. |
| Spelmotor | **Phaser 4** | Beprövad 2D-motor (API:t är i stort sett samma som i Phaser 3) med scener, input, ljud, animationer och kollision. Mycket dokumentation. |
| Gränssnitt (dialog, pussel, bok, menyer) | **HTML/CSS ovanpå spelet** | Skarp och stor text, riktiga textrutor (å, ä, ö fungerar direkt), enkelt att dra och släppa. Inget ramverk behövs. |
| Utvecklingsserver | **Vite** | Spelet laddas om direkt när något ändras. Barnet ser ändringen på en sekund. |
| Paketering | **vite-plugin-singlefile** | `npm run build` ger **en enda HTML-fil** med all grafik, allt ljud och typsnittet inbakat. Den kan dubbelklickas, mejlas till mormor eller läggas på ett USB-minne. |
| Tester | **Vitest** | Validerar banor och svarskontroll automatiskt. |
| Versionshantering | **git** | En "ångra-knapp" för hela projektet, vilket är viktigt när ett barn experimenterar. |

**Alternativ som valdes bort:**
- *Ren JavaScript och canvas utan ramverk* är enklast att förstå men kräver att kollision, ljud, skalning och scener byggs själv.
- *Godot eller Unity* är kraftfullare men inte "bara en webbsida" och har en tröskel som är för hög.

Node 24 och git finns redan installerat på datorn.

### 11.2 Skärm

- Ett rum är **20 × 12 rutor** à 16 px, alltså 320 × 192 pixlar. Det skalas upp för att fylla fönstret (`Scale.FIT`, `pixelArt: true`).
- **Ett rum är lika stort som skärmen**, som i gamla Zelda. Går man genom en dörr glider man över till nästa rum. Då kan varje rum ritas som en liten textkarta, och ingen kamera behövs.
- HTML-lagret ligger ovanpå canvas i samma skalade behållare.

### 11.3 Filstruktur

```
Monsterdetektiv/
├─ DESIGN.md              ← det här dokumentet
├─ CLAUDE.md              ← instruktioner till Claude
├─ index.html
├─ package.json
├─ vite.config.ts
├─ src/
│  ├─ main.ts             ← startar spelet
│  ├─ cases/              ← fallen/banorna: rum, personer, ledtrådar, pussel
│  │  ├─ index.ts         ← lista över alla fall
│  │  ├─ case1-buns.ts
│  │  └─ ...
│  ├─ engine/             ← spelmotorn
│  │  ├─ scenes/          ← Titel, Stadskarta, Rum, Avslöjande, Resultat
│  │  ├─ Player.ts        ← gå, hoppa, använda
│  │  ├─ Monster.ts       ← patrull, sov, slem, vakt
│  │  ├─ Ester.ts         ← följa med, fastnat-timer, tips
│  │  ├─ CaseState.ts     ← flaggor, mål, ledtrådar, föremål
│  │  ├─ mapParser.ts     ← textkarta → rutor och objekt
│  │  ├─ save.ts          ← sparning i localStorage
│  │  └─ audio.ts
│  ├─ ui/                 ← HTML-lagret
│  │  ├─ dialog.ts, notebook.ts, hud.ts, menus.ts, speech.ts
│  │  └─ ui.css
│  ├─ puzzles/            ← en fil per pusseltyp
│  │  ├─ codeLock.ts, textAnswer.ts, multipleChoice.ts,
│  │  ├─ sortOrder.ts, matchPairs.ts, clock.ts, ...
│  │  └─ answerCheck.ts   ← förlåtande svarskontroll
│  └─ sprites/            ← pixelgrafik som Claude gör (se 11.6)
├─ assets/
│  ├─ bilder/             ← PNG från Piskel och liknande
│  ├─ ljud/               ← WAV/MP3 från sfxr och BeepBox
│  └─ typsnitt/
└─ tests/
   ├─ fall.test.ts        ← validerar alla banor
   └─ answerCheck.test.ts
```

**Namnkonvention:** All kod och alla datanycklar skrivs på engelska. All text som visas i spelet är på svenska.

### 11.4 Bandataformat

Ett fall är en vanlig datastruktur som Claude skriver och underhåller. Rummens layout lagras som ett rutnät av tecken. Det är kompakt, lätt att ändra via chatt och lätt att validera. Spelaren ser det aldrig: renderaren gör om varje tecken till pixelgrafik och väljer automatiskt rätt bit för hörn, kanter och övergångar (autotiling). Golvet får slumpmässig variation, och dekorationer som mattor, krukväxter och fläckar läggs i ett eget lager så att rummen ser handgjorda ut.

*Alternativ:* Om det någon gång behövs en visuell kartredigerare kan man byta till Tiled (mapeditor.org), som Phaser läser direkt. Det är inte med i planen nu.

Tecknen i rutnätet:

| Tecken | Betyder |
|---|---|
| `#` | Vägg |
| `.` | Golv |
| `~` | Pöl eller slem (hoppa över) |
| `=` | Lågt hinder, till exempel byggklossar (hoppa över) |
| `D` | Dörr (vart den leder anges i `doors`) |
| `H` | Hylla med leksaker (fast) |
| `K` | Disk med kassaapparat (fast) |
| `N` | Noras startplats (bara i första rummet) |
| `E` | Esters plats (valfritt) |
| `1`–`9` | Ledtrådar |
| `a`–`z` | Personer, monster och saker som definieras i rummet |

```ts
export const case1: Case = {
  id: "buns",
  title: "Vem tog bullarna?",
  startRoom: "bakery",

  rooms: {
    bakery: {
      name: "Bageriet",
      theme: "bakery",            // styr vilka pixelbilder rummet använder
      layout: [
        "####################",
        "#BBBB..........k...#",
        "#..................#",
        "#..b.......1.......#",
        "#..................#",
        "#.N.......~~~......D",
        "#.........~~~......D",
        "#..................#",
        "#..E...........====#",
        "#...............2..#",
        "#..................#",
        "####################",
      ],
      // Dörren är låst med ett pussel. När pusslet är löst går den att öppna.
      doors: { D: { to: "yard", puzzle: "backdoor-lock" } },
      things: {
        b: { name: "Bagaren Berit", sprite: "baker",
             talk: ["Hjälp, Nora!", "Någon har tagit mina bullar!"],
             gives: "talked-to-berit" },
        k: { name: "Lapp", sprite: "note",
             talk: ["Koden till bakdörren:", "Lika många som bullarna som försvann."] },
      },
      clues: {
        1: { name: "Smulor", sprite: "crumbs", text: "Smulor som leder mot bakdörren." },
        2: { name: "Fotspår", sprite: "footprint", text: "Ett fotspår med TRE tår!" },
      },
    },
    // yard: { ... }
  },

  puzzles: {
    "backdoor-lock": {
      type: "codeLock",
      text: "Berit bakade 15 bullar. Nu finns 9 kvar. Hur många försvann?",
      answers: ["6", "sex"],
      hints: [
        "Hur många bullar var det från början?",
        "Räkna baklänges från 15 tills du kommer till 9.",
        "15 minus 9 …",
      ],
      gives: "backdoor-open",
    },
  },

  goals: [
    { text: "Prata med bagaren", doneWhen: "talked-to-berit",
      hints: ["Bagaren står vid disken.", "Gå fram till Berit och tryck Ctrl."] },
    { text: "Öppna bakdörren", doneWhen: "backdoor-open", hints: ["Läs lappen på väggen."] },
    // ...
  ],

  reveal: {
    question: "Vem tog bullarna?",
    options: ["Katten Måns", "Grannen Gustav", "Monstret Smulan", "Bagaren Berit"],
    correct: "Monstret Smulan",
  },
};
```

**Hur spellogiken hänger ihop:** Allt drivs av **flaggor**, alltså enkla namn som `"backdoor-open"`. Saker, pussel och ledtrådar kan ge en flagga (`gives`) och kräva en (`requires`). Ett mål är klart när dess flagga finns. Det räcker för 95 % av alla fall. Behövs något specialbeteende för ett visst fall kan det få en egen liten funktion.

### 11.5 Validering, viktig när banor ändras ofta

Ett test (`npm test`), och en kontroll när spelet startar i utvecklingsläge, går igenom alla fall:
- Varje kartrad är exakt 20 tecken och varje karta har 12 rader.
- Varje tecken på kartan är känt eller definierat i rummet.
- Varje dörr leder till ett rum som finns.
- Varje pussel har ett svar och tre tips. Varje mål har minst ett tips.
- Varje flagga som krävs kan ges av något.
- Avslöjandets rätta svar finns bland valen.

Fel visas **på svenska i spelet**, till exempel: *"Rad 4 i rummet 'Bageriet' har 19 tecken, den ska ha 20."*

### 11.6 Hur pixelgrafiken skapas

Claude gör pixelgrafiken som färgrutnät i koden (`src/sprites/`). De görs om till vanliga bilder när spelet startar. Det gör att Claude kan rita, ändra färger och justera figurer direkt när barnet ber om det ("gör Smulan rundare", "ge Nora en röd hatt").

```ts
export const smulan = {
  palette: { ".": null, "k": "#1b1b3a", "b": "#4aa3ff", "v": "#ffffff" },
  pixels: [
    "....kkkk....",
    "..kkbbbbkk..",
    ".kbbvkbvkbk.",
    ".kbbbbbbbbk.",
    // ...
  ],
};
```

PNG från Piskel och liknande fungerar parallellt. Om barnet ritar en egen figur lägger man filen i `assets/bilder/` och då ersätter den Claudes version.

### 11.7 Sparning

Framstegen sparas i `localStorage` under nyckeln `monsterdetektiven-v1`: vilka fall som är klara, stjärnor, bästa tid, hittade ägg och inställningar (hjälpnivå, ljud, uppläsning). Det fungerar även när den färdiga HTML-filen öppnas direkt från disk. Ett fall sparas inte mitt i. Fallen är korta, 5–15 minuter.

### 11.8 Kommandon

| Kommando | Vad det gör |
|---|---|
| `npm run dev` | Startar spelet med direkt omladdning (http://localhost:5173) |
| `npm test` | Kontrollerar banor och svar |
| `npm run build` | Skapar `dist/index.html`, hela spelet i en fil |

### 11.9 Plattform

Datorer med tangentbord, i Chrome, Edge eller Firefox. Surfplatta och mobil ingår inte till en början, eftersom pekstyrning skulle kräva en egen design.

---

## 12. Byggordning

Varje steg ska ge något som går att **spela och visa upp**.

| Steg | Resultat |
|---|---|
| 0 ✅ | Projektet startar och visar "Monsterdetektiven" (titelskärm med staden på natten och Fladder som flyger förbi). Bygget till en fil fungerar. git är igång. |
| 1 ✅ | Nora går runt i leksaksaffären, krockar med väggar, hoppar över klossar och slem och läser en skylt och pratar med en nalle med Ctrl (eller E/Enter). En liten pratbubbla visar vad man kan använda. |
| 2 | Flera rum och dörrar, flaggor, mål, ledtrådar och Detektivboken. |
| 3 | Ester följer med och har fastnat-timer och tips. |
| 4 | Pussel: kodlås, skriv svaret och flerval. |
| 5 | **Fall 1 (Leksaksaffären) går att spela från början till slut** med tillfällig grafik. Första speltestet med huvudarkitekten! |
| 6 | Monster (patrull, sov), avslöjande, stjärnor och sparning. |
| 7 | Barnets egen grafik och egna ljud. |
| 8 | Fall 2–6 och fler pusseltyper. |
| 9 | Titelskärm, stadskarta, inställningar, uppläsning och finputs. |

**Tips för speltest:** Titta utan att hjälpa till. Där man fastnar behöver ett tips bli bättre eller ett pussel bli lättare. Låt gärna kompisar testa.

---

## 13. Frågor till huvudarkitekten 🕵️‍♀️

*De här bestämmer du!*

1. Vad ska spelet heta? ✅ **Monsterdetektiven**
2. Vad heter staden? ✅ **Mystiska staden**
3. Vem är Ester? ✅ **En tjej, Noras kompis och medhjälpare**
4. Hur ser Nora ut? ✅ **Se teckningen** (`assets/bilder/teckningar/nora.jpg`)
5. Hur läskiga ska monstren vara? ✅ **4 av 5, ganska läskiga**
6. Vad ska hända om ett monster fångar Nora? ✅ **Nora blir rädd och tappar en sak som hon måste leta upp igen**
7. Vilket fall vill du göra först? ✅ **Ett eget: leksakerna i leksaksaffären börjar röra sig på dagen**
8. Vill du rita figurerna själv? ✅ **Lite av varje.** Hon ger förlagor (teckningar och Lego) och Claude gör resten.
9. Vad får man när man klarar ett fall? ✅ **Stjärnor och monsterkort**
10. Vilket är ditt favoritmonster? ✅ **Fladder!** Hon hittade också på ett nytt monster: **Trattis**.
