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
| Mellanslag | Titta, prata och öppna när man står vid något – annars hoppa |
| Ctrl (eller E/Enter) | Titta, prata, öppna |

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
2. **Kort text, stor text.** Högst två rader per pratbubbla. Ingen uppläsning: att läsa själv är en del av pedagogiken (läsförståelse).
3. **Lärande som känns som detektivarbete.** Matte, läsning och natur används som verktyg för att lösa fallet, inte som prov.
4. **Monstren är ganska läskiga** (huvudarkitekten valde 4 av 5). **Blod är ok i måttliga mängder** och i tecknad pixelstil, till exempel från Grymlans arm. Det är godkänt av pappa. Inget grovt våld. Det finns ofta en twist om fördomar och empati.
5. **Barnet äger spelet.** Namn, figurer, story och pussel är hennes. Tekniken ska bara funka.

---

## 2. Spelloopen

```
Titelskärm (välj spelare) → Stadskartan (välj fall) → Introkort → FALLET → Avslöjandet → Fånga den skyldige → Slutscen → Stjärnor och monsterkort → tillbaka till kartan
```

**Stadskartan** är ritad efter huvudarkitektens teckning (`assets/bilder/teckningar/stadskarta.jpg`): bäcken som slingrar sig runt ängen, leksaksaffären med det runda orangea taket, bageriet med regnbågstaket, det höga klocktornet med rosa spira, det orangea biblioteket, festtältet och skogen med röda bär och kantareller. Byggnaderna är pixelbilder i `src/sprites/map.ts`. På kartan finns sex platser. Nästa fall låses upp när det förra är löst. Kartan visar stjärnor per fall, hur många **månstensbitar** man har (◆), knappen **🃏 Monsterkort** (K) som visar hela samlingen (kort man inte har visas som svarta skuggor), **⚙️ Inställningar** (I) för hur snart Ester ger tips och för musiken, och **👥** för att byta spelare.

**Inne i ett fall:**
1. **Uppdraget.** Någon berättar vad som hänt ("Mina bullar är borta!").
2. **Utforska.** Nora går mellan rum, pratar med personer och monster och undersöker saker med Ctrl.
3. **Ledtrådar.** Det Nora hittar hamnar i **Detektivboken** med en bild och en kort mening. *(Påskägg: bläddrar man till nästa sida med ▶ eller högerpil finns ett foto på Nora och Ester, kind mot kind: "Jag och Ester ♥". Det ritas i `src/ui/photo.ts`.)*
4. **Pussel.** De låser upp nya rum, föremål och ledtrådar (kodlås, gåtor, spår och så vidare).
5. **Avslöjandet.** Nora samlar alla misstänkta och väljer vem som gjorde det. Svarar man fel säger Ester snällt: "Hmm, stämmer det? Titta i detektivboken!" och man får försöka igen.
6. **Slut.** En kort avslutning, en *"Visste du att…?"*-fakta kopplad till fallet och stjärnor.

---

## 3. Figurer

| Figur | Roll |
|---|---|
| **Nora** | Detektiven som man styr. Nyfiken, modig och smart. **Utseende** (enligt huvudarkitektens teckning, `assets/bilder/teckningar/nora.jpg`): långt grönt hår med bruna hårspännen, svart öppen jacka, turkos och lila randig tröja, brunt bälte, vinröd rutig kjol med spännen (brunt och gult) och gul kant, gråa strumpbyxor och röda kängor. |
| **Ester** | En tjej, Noras kompis och medhjälpare. Hon är med i varje fall, ger tips och kommenterar ibland det som händer. Kortare än Nora, som en lillasyster. **Utseende** (enligt huvudarkitektens teckning, `assets/bilder/teckningar/ester.jpg`): långt rosa hår, gul kofta med grå prickar och en grön rosett, blå tröja, randig regnbågskjol, rosa strumpbyxor och turkosa skor. |
| **Vittnen** | Stadens invånare, både människor och monster. De berättar saker (ibland fel saker). |
| **Monster** | Se avsnitt 5. |

**Monster från huvudarkitekten** (förlagor i `assets/bilder/teckningar/`):
- **Fladder** (`monster-vingar.jpg`, Lego): svart monster med stora rosa, genomskinliga fladdermusvingar, en rosa-lila spets på huvudet och arga ljusa ögon. Namnet är hennes.
- **Viskan** (`spoke.jpg`, Lego): ett vitt spöke som lyser i mörkret och ler lite för brett. Hen viskar ens namn bakom ryggen. Namnet är Claudes förslag.
- **Grymlan** (`lila-har.jpg`, teckning): zombieliknande med taggigt lila hår, grön tröja och bruna byxor. Ena armen sitter löst och trillar av. Namnet är Claudes förslag. Det droppar lite blod där armen trillat av (måttligt och tecknat, se designprincip 4).
- **Trattis** (`trattis.jpg`, teckning, huvudarkitektens egen idé och namn): ett svampmonster inspirerat av kantareller. Hen har en spetsig trattformad svamphatt, långt stripigt hår, vampyrtänder som det droppar lite ur och en lång kjol. Färgerna är gyllene kantarellgult och orange (Claudes förslag, teckningen är i blyerts).

---

## 4. Fallen

> **Obs: allt som är byggt hittills (steg 0–5) är test av byggstenarna.** Fall 1 i koden är en *testbana* där rörelse, rum, ledtrådar, Ester, pussel och monster provas. När byggstenarna är klara designas de färdiga mysterierna ordentligt, **fall 1 också och från grunden om det behövs**, efter principerna nedan och den pedagogiska planen i avsnitt 6.

### Så är ett fall uppbyggt

Varje fall är ett **komplett mysterium med en röd tråd**, inte bara en samling ledtrådar:

1. **Problemet.** Något konstigt händer, och det är kroken som gör att man vill veta mer.
2. **Utredningen, en teoritrappa.** Man hittar ledtrådar *och* löser klurigheter (pussel) som öppnar nya rum och ger nya ledtrådar.
   - **Varje rum ska ändra teorin.** Efter varje rum ska man tro något nytt eller förstå att man hade fel. Ett rum får inte bara vara en transportsträcka.
   - **Det avgörande beviset kräver flera rum.** Inget enskilt rum ska räcka för att lösa fallet. Det finns tester som kontrollerar vilka rum bevisen kommer från.
   - **Den skyldige syns inte förrän man kan förstå vad man ser.** Först syns bara spår av något, och tydliga glimtar kommer sent.
   - **Gärna två frågor: vad och vem.** "Vad är det?" löses i mitten av fallet, "vems/vem är det?" i slutet, så att man själv listar ut den som dyker upp i slutscenen.
   - Minst ett falskt spår per misstänkt gör att man måste tänka själv.
3. **Faran.** Monster gör det svårt och spännande: de jagar, smyger och flyger iväg med Nora. Se avsnitt 5.
4. **Avslöjandet.** Nora pekar ut den skyldige och **visar bevis** ur detektivboken. Det ska kräva att man tänker:
   - **Flera misstänkta med egna falska spår.** Varje misstänkt ska ha minst en ledtråd som pekar mot sig, och vissa ledtrådar ska passa flera misstänkta (till exempel grön tråd och Stinas gröna garn).
   - **Inga ledtrådar som säger svaret rakt ut.** En lapp får antyda men inte avslöja.
   - **Markera alla bevis.** Efter svaret markerar man *alla* ledtrådar som visar det (`proof`), och spelet säger hur många. Ledtrådar som inte visar det avmarkeras och Ester förklarar varför (`why`). Saknas något ger Ester en knuff åt rätt håll (`missing`) utan att säga svaret.
   - **Inga motsägelser.** Den som resonerar rätt ska aldrig få höra att hon har fel. Varje ledtråd som ärligt visar svaret ska finnas i `proof`, och alla andra ledtrådar ska ha en övertygande förklaring. Det finns tester som kontrollerar att varje ledtråd och varje fel svar har en förklaring.
   - **Fel svar ger en förklaring, inte bara "fel".** Ester säger varför just den misstänkta (`whyNot`) eller ledtråden (`why`) inte håller. Det är här man tränar att resonera.
   - **Ester sammanfattar.** Efter slutscenen går Ester igenom hur allt hängde ihop, steg för steg (`summary`), och berättar det som den skyldige inte sa. Då förstår man även om man chansade lite.
5. **Målen avslöjar inget.** Målet uppe till höger säger *vad* man ska ta reda på ("Ta dig in i lagret"), aldrig *hur* ("Hämta nyckeln av Stina"). Hur man gör får man veta av ledtrådar, figurer och Esters tips.
6. **Fallet tål olika ordning.** Spelaren gör sällan saker i den ordning vi tänkt, till exempel hittar ledtrådar innan hon pratat med den som berättar om brottet. Varje figur ger därför sina grundflaggor vad hon än säger, och det finns tester som spelar i "fel" ordning. Man får aldrig kunna fastna.
7. **Slutet och kopplingen.** Man får en kort avslutning, en *"Visste du att…?"*, stjärnor och ett monsterkort. Dessutom hittar man en **bit av det stora mysteriet**, som gör att man vill spela nästa fall.

Fallen blir svårare efter hand: fler rum, svårare pussel (talområde 0–20 → 0–100), fler monster och fler falska spår.

### Översikt

| # | Fall | Plats | Monster | Skolinnehåll (se avsnitt 6) |
|---|---|---|---|---|
| 1 | **Leksaksaffären** ⭐ *huvudarkitektens idé* | Leksaksaffären, lagret och bakgården | **Fladder**, **Viskan**, **Grymlan** och en hemlis | Addition 0–20 med pengar (kronor), geometriska former (klot, kub, cylinder), gåtor, läsa lappar. NO: fladdermöss är nattdjur. |
| 2 | **Vem tog bullarna?** | Bageriet och gården | Smulan, gårdskatten | Subtraktion 0–20, följa spår, läsa lappar |
| 3 | **Spöket i biblioteket** | Biblioteket och källaren | Bokmalen Bläddra, Viskan igen | Alfabetisk ordning, rim, spegelskrift, stavning |
| 4 | **Ljuden i skogen** | Skogen, bäcken och svampringen | **Trattis** ⭐, Mossjätten och hens unge | Mäta med steg, tabeller, djurspår, årstider, svampar |
| 5 | **Klocktornet har stannat** | Torget och klocktornet | Kugg-trollet, Fladder | Klockan, talföljder, dubbelt och hälften, väderstreck, några engelska ord |
| 6 | **Monsterfesten** | Hela staden (final) | Skuggan, och alla monster från tidigare fall | Blandat upp till 100, ljus och skugga |

Huvudarkitektens monster (Fladder, Viskan, Grymlan, Trattis) återkommer i flera fall.

> ⚠️ **SPOILER – läs inte längre ner i det här avsnittet, Nora!** 🙈 Allt nedan är hemligt.

### Den röda tråden: Månstenen

Mitt i klocktornet i Mystiska staden sitter **Månstenen**. Den lyser svagt och har alltid hållit monstren lugna och vänliga. Men någon har brutit loss bitar av den och gömt dem runt om i staden. Sedan dess:
- blir monstren **oroliga, konstiga och farligare**, och det förklarar varför de är läskiga i spelet,
- händer det **magiska saker** där bitarna ligger, som att leksaker vaknar, degen lyser och skogen viskar.

Tjuven är **Skuggan**, ett skuggmonster med glödande ögon som syns i utkanten av varje fall: en skugga i ett fönster, svarta fotspår, en lapp i spegelskrift. I finalen visar det sig att Skuggan är **mörkrädd** och tog de lysande bitarna för att slippa vara i mörkret. Nora sätter ihop Månstenen, staden ger Skuggan ett eget nattljus, och alla firar Monsterfesten.

| # | Bit av stora mysteriet |
|---|---|
| 1 | Grymlans arm håller en **lysande månstensbit**. Det är den som får leksakerna att vakna. Grymlan tappade armen när *en skugga med glödande ögon* skrämde honom i lagret. |
| 2 | Smulan hittade en lysande bit i degen. **Svarta fotspår i mjölet** leder ut i natten. |
| 3 | En bok om Månstenen saknar sidor. Skuggan har lämnat en lapp i spegelskrift: *"Jag behöver ljuset."* |
| 4 | Mossjättens unge har hittat en bit, och därför lyser skogen på natten. Trattis vaktar svampringen där Skuggans tomma gömställe finns. |
| 5 | Månstenens plats i tornet är tom, och därför stannade klockan. Nora hittar en karta till Skuggans grotta. |
| 6 | Skuggan avslöjas. Månstenen sätts ihop och det blir fest. |

### Fall 1: Leksaksaffären

Huvudarkitektens egen idé: *I leksaksaffären har leksakerna börjat röra sig, mitt på dagen!* Det är första fallet och därmed inlärningsbanan: gå, prata, hoppa, första pusslet och första monstret.

**Sanningen:** Monstret Grymlan kom till affären för att köpa en present till sin lillebror. I lagret skrämdes han av *en skugga med glödande ögon*, fastnade i en spik och tappade armen. Handen kryper nu omkring på egen hand och letar efter honom. Den har hittat en **månstensbit**, och det är magin i biten som får leksakerna att vakna.

**Teoritrappan:** varje rum ändrar vad man tror.

| Rum | Vad man tror efteråt | Ledtrådar |
|---|---|---|
| 🏪 **Butiken** | *"Leksakerna lever!? Eller är det Fladder?"* Inget syns, det faller bara lite damm från hyllorna ibland. | Fem små prickar i dammet *(tvetydigt)*, grön tråd *(tvetydig: Stinas gröna garn)*, rosa fjäll *(falskt spår mot Fladder)*, Nallen har flyttat sig *(falskt spår mot Nallen)*, Nallens nervösa förklaring (han såg något som lyste), **Stinas kundbok** (Gunnar Gris, Gerda Groda, och Grymlan som letade present till sin lillebror) |
| 📦 **Lagret** | *"Det är inte leksakerna. Någon 'G' har varit här och skadat sig, och något med fem ben kryper omkring."* | Fladder är vaken *(NO: fladdermöss sover på dagen)*, **Fladders vittnesmål** när hon vilar i taket (inga händer, väcktes av något lysande med fem ben), **paketet** "Till lillebror, från G." (snirkligt G), **tröjbiten** på en spik med blod, blodsdroppar, ögonen i hörnet *(röd tråd)* |
| 🌳 **Bakgården** | *"Det är en HAND! Och den som saknar något grönt är samma G som lämnade paketet."* | **Handavtryck i den blöta sanden** (aha!), lappen "SAKNAS: Något grönt som är mitt. / G.", **jämför handstilen** (samma snirkliga G), **Viskans vittnesmål** efter gåtan |

**Handen syns inte förrän man kan förstå vad man ser.** Före sandlådan faller det bara lite damm från en hylla ibland. Att en hylla **skakar** händer bara på slutet, när handen gömmer sig. Efter sandlådan syns korta glimtar av handen i butiken (långt från Nora), och på slutet gömmer den sig i en hylla.

**Figurer och monster:**
- **Stina Snurr** äger affären. Hon har grått hår i knut, glasögon, rosa kofta och gult förkläde. Hon stickar med grönt garn.
- **Nallen** är misstänkt, inte vittne.
- **Fladder** *(flygare)* är vaken mitt på dagen och flyger runt i lagret. Man gömmer sig bakom lådor. **När hon har missat Nora två gånger blir hon trött och vilar upp och ner i taket, och då kan man prata med henne.** (Om man aldrig blir attackerad vilar hon ändå efter en halv minut.)
- **Viskan** *(smygare)* bor i soptunnan på bakgården och hoppar fram en stund efter att man knackat på. Man vinner hennes vittnesmål med en gåta.
- **Handen** *(krypare)*: se ovan.
- **Grymlan** kommer in först i slutscenen, men man har listat ut honom själv.

**Klurigheter:**
1. **Kassaapparaten** (butiken): addition med pengar. Kvittot slumpas: två leksaker för 2–9 kr, med en tvåsiffrig summa.
2. **Formlåset** (lagret): tre av fyra former i slumpad ordning. *(Geometri.)*
3. **Viskans gåta** (bakgården): en av fyra gåtor, med bildval. *(Språk och logik.)*
4. **Jämför handstilen** (bakgården, när man har sett paketet): vilket av fyra G är det snirkliga G:et från paketet? *(Läsförståelse och iakttagelse.)*
5. **Avslöjandet, i två frågor:**
   - *Vad flyttar på leksakerna?* Val: Fladder, Viskan, Stina, Nallen, en lös hand. **Bevis (markera alla fyra):** fem prickar, avtrycken i sanden, Fladders och Viskans vittnesmål.
   - *Vems hand är det?* Val: Grymlan, Gunnar Gris, Gerda Groda, Stina Snurr (utan bilder). **Bevis (markera alla fyra):** lappen, samma G, paketet och kundboken – en kedja från "G saknar något grönt" till "Grymlan letade present till lillebror".
   - Ester förklarar varje felval, till exempel *"Gerda Groda är grön – men hon köpte ett spel till sin mormor, inte till en lillebror."*
   - **Det avgörande kräver alla tre rummen.** Det finns ett test som kontrollerar det.
6. **Fånga den skyldige:** handen gömmer sig i en hylla där leksakerna skakar. Man undersöker rätt hylla med Ctrl. *(Iakttagelse.)*

**Mål** (säger *vad*, inte *hur*):
1. Ta reda på vad som har hänt
2. Leta efter ledtrådar i affären
3. Ta dig in i lagret
4. Undersök lagret
5. Ta dig ut ur lagret
6. Vart leder spåren?
7. Vad flyttar på leksakerna, och vems är det?
8. Fånga den skyldige!

**Intro:** Ett introkort berättar att Stina ringt och är rädd. När fallet börjar ser Ester en leksaksbil köra av sig själv.

**Slut:** Handen kommer fram. Grymlan kommer in och berättar om skuggan i lagret och spiken. Stina syr fast armen. Handen släpper en lysande **månstensbit**, och Nora säger *"Det här mysteriet är inte slut än…"*. Därefter kommer resultatskärmen med stjärnor, tid, monsterkort (Fladder, Viskan och Grymlan) och **Visste du att…?** om fladdermöss.

**Hemligt monsterägg:** bakom lådorna uppe till höger i lagret.

### Fall 2: Vem tog bullarna? (`case2-bakery.ts`)

**Rum:** Bageriet → Bakgården → Mjölkällaren. **Misstänkta:** katten Måns, grannen Gustav, Mjölspöket, Berit, Smulan.

**Sanningen:** Smulan (snäll, frågar alltid) drogs till en bulle som lyste, eftersom en månstensbit var inbakad. Hen glömde fråga och bar hem bullar till sitt bo i källaren. Svarta fotspår i mjölet går in i väggen (Skuggan).

**Teoritrappan:** katthår, Gustav i fönstret och smulor mot bakdörren (bageriet) → tretåiga spår i sanden, smulor i kattskålen, Gustavs spårpussel friar Måns (gården) → glödande smulor till ett bo av blått fluff med skylten SMULANS HEM (källaren).

**Avslöjandet (Berit), markera alla:** *Vem tog bullarna?* Blått fluff, tretåiga spår, Gustavs vittnesmål, glödande smulor och boet. *Varför, fast hen brukar fråga?* Den lysande bullen, Gustavs vittnesmål och de glödande smulorna. (Bullarna bakades tidigt i morse medan det var mörkt; de svarta spåren i källaren är Skuggans, inte Gustavs stövlar.)

**Klurigheter:** bullräkning (subtraktion till 20, bakdörren), djurspår (para ihop), receptet (ordning med beskrivningar, slutet). **Monster:** Smulan (krypare), Måns (sovare), Mjölspöket (patrullerare). **Fakta:** jäst. **Kort:** Smulan, Måns, Mjölspöket.

### Fall 3: Spöket i biblioteket (`case3-library.ts`)

**Rum:** Biblioteket → Läsrummet → (trappa ner) Källaren, och ett frivilligt rum högst upp i Tornet (trappa upp från biblioteket) där monsterägget ligger. **Misstänkta:** Viskan, Pelle, bibliotekarien Bodil, Ugo (flygande uppslagsbok).

**Sanningen:** Bokmalen Bläddra lånar lätta böcker på nätterna för att öva läsning ("B… O… K…" lät som ett spöke). Den blå lampan är en månstensbit. Pelle är ett opålitligt vittne som bara hört ryktet. Skuggans lapp i källarhörnet: "Jag behöver ljuset."

**Avslöjandet (Bodil), markera alla:** *Vem flyttar böckerna?* Ugos vittnesmål (långt, mjukt, glasögon, inga fötter) och kryp-spåret. *Varför?* Bodils lista (bara lätta böcker), övningsbladet, bokborgen och Viskans vittnesmål (B… O… K…).

**Klurigheter:** bokvagnen (ABC-ordning med Å Ä Ö), Ugos ord (stavning), rimlåset (para ihop), lappen i spegelskrift. **Monster:** Ugo (flygare), Viskan (smygare), Dammis (patrullerare), Bläddra (krypare, gömmer sig i en hylla). **Fakta:** boklöss. **Kort:** Bläddra, Ugo, Dammis.

### Fall 4: Ljuden i skogen (`case4-forest.ts`)

**Rum:** Skogsbrynet → Bäcken → Svampringen. **Misstänkta:** Trattis, vargen, Mossjätten, lysflugorna, ungen.

**Sanningen:** Mossjättens unge hittade en månstensbit i Skuggans tomma gömställe, följde glittret och gick vilse. Hen gömmer sig under mossan och gråter. Mullret är föräldern som letar varje natt. De röda dropparna är lingon ur Trattis korg.

**Avslöjandet (Trattis), markera alla:** *Vem är det som gråter?* Det tomma boet, de små spåren, Trattis vittnesmål och tårarna. *Varför gråter ungen?* Boet, cirkelspåren, de små spåren, Brunos vittnesmål (blått glitter på stenarna) och glittret. (Skuggan lämnade ett glitterspår från bäcken till sitt gömställe; ungen följde det, hittade stenen och gick vilse.)

**Klurigheter:** spårtavlan (para ihop djurspår), Brunos mätning (kodlås, mäta i tassar), Trattis fråga (svampar, årstider, allemansrätt), vägen hem (väderstreck, ger fångsten). **Monster:** vargen (patrullerare), Mossjätten (sovare som **följer efter** genom dörrarna, tills Bruno har nynnat den till sömns efter mätningen), lysflugorna (flygare). **Fakta:** svampar är varken växter eller djur. **Kort:** Trattis, Mossjätten, Mossungen.

### Fall 5: Klocktornet har stannat (`case5-clocktower.ts`)

**Rum:** Torget → Trappan i tornet → Urverket. **Misstänkta:** Kugg-trollet, turisten Mister Fluff, tornvakten Knut, Fladder, en skugga med gula ögon.

**Sanningen (med en vändning):** Det är **tornvakten Knut**, han som ringde efter Nora, som ligger bakom att klockan stannade. Han satte sig vid kiosken med en kopp kaffe, somnade och drog aldrig upp klockan. Han skäms och skyller på Kugg-trollet, och trollets små oljiga spår pekar först åt det hållet. Samma natt kom Skuggan in genom fönstret och tog Månstenen norrut (den lyser över staden och gör monstren snälla, men driver inte klockan). Kugg-trollet smorde bara kugghjulen och försökte laga klockan. Nora hittar en karta till Skuggans grotta.

**Avslöjandet (Knut), markera alla:** *Varför stannade klockan?* Knut drog aldrig upp den: vikterna ligger på golvet, loggboken är tom för i går, Fladder hörde honom aldrig, veven låg vid kiosken och trollets lapp. *Vem tog Månstenen?* De stora svarta spåren, Fladders och Mister Fluffs vittnesmål, ögonen i fönstret och kartan. I slutet ber Knut Kugg-trollet om förlåtelse.

**Klurigheter:** Mister Fluffs ordbok (engelska ord, para ihop), klocklåset (hel, halv, kvart), luckans talföljd, kugghjulslåset (hälften). **Monster:** Fladder (flygare), Urverksbaggen (patrullerare), Kugg-trollet (krypare, oskyldig, fångas i en kugghylla så att Knut kan be om förlåtelse). **Fakta:** en meter lång pendel slår en sekund. **Kort:** Kugg-trollet, Mister Fluff, Urverksbaggen.

### Fall 6: Monsterfesten (`case6-festival.ts`)

**Rum:** Torget → Stadsparken → Skuggans grotta. **Misstänkta:** Fladder, Smulan, Kugg-trollet, malen Lysa Lyktmal.

**Sanningen:** Skuggan tar ljusen för att han är mörkrädd: en skugga behöver ljus, annars försvinner han. Lappen "Förlåt… jag lämnar tillbaka dem när solen kommer upp. / S". I grottan står ljusen i en ring runt hans lilla mossbädd.

**Avslöjandet (Stina), markera alla:** *Vem tar ljusen?* De svarta spåren, Grymlans och Fladders vittnesmål, lappen i spegelskrift och ljusringen. *Varför?* Sidan i Månstensboken, lappen, ljusringen och teckningen. (Skuggan tog Månstenen ur tornet, tappade den och den sprack – bitarna hamnade i fall 1–5.)

**Klurigheter:** lyktorna (minus upp till 100), Bläddras skuggfråga (ljus och skugga), lappen i spegelskrift, Trattis svampar (talföljd till 100). **Slut:** Skuggan gömmer sig i ett stånd på torget. Månstenen sätts ihop, lyktorna tänds, Kugg-trollet ger honom ett nattljus: *alla är rädda för något, alla får vara med.* **Kort:** Skuggan, Lysa Lyktmal, Skuggkrypen.

---

## 5. Monster

Monster är både **faror**, **vittnen** och **delar av mysteriet**. Läskighet: **4 av 5** (huvudarkitektens val). De ska kännas oförutsägbara och lite farliga, med lysande ögon, vassa tänder, skuggor, spöklika ljud och överraskningar. Lite blod är ok (tecknat och måttligt), men det är inget grovt våld, och många visar sig vara snällare än de ser ut.

| Typ | Beteende | Hur man klarar det | Exempel |
|---|---|---|---|
| **Flygare** | Flyger i slingor. När Nora kommer nära tvekar hon en kort stund (darrar) och dyker sedan. | **Göm dig bakom en låda, hylla eller ett träd.** Då anfaller hon inte, och hinner man gömma sig under anfallet avbryter hon och blir förvirrad ("?"). Om hon fångar Nora **bär hon iväg henne** till rummets dörr. | Fladder |
| **Smygare** | Gömmer sig först i sitt hem och hoppar fram en stund efter att Nora petat på gömstället. Glider sedan närmare när Nora tittar bort och fryser med stängda ögon när hon tittar. | Titta på monstret medan du går förbi eller fram till det. | Viskan |
| **Krypare** | Kilar snabbt mellan gömställen och syns bara i korta glimtar. | Går inte att fånga förrän man vet hur. Det är en del av mysteriet. | Grymlans arm |
| **Patrullerare** | Går fram och tillbaka längs en väg och stannar en kort stund i varje ände. | Tajma när man går förbi. Efter en skrämsel står den still en stund. | (`patroller`) |
| **Sovare** | Sover med "zzz". Vaknar om Nora **hoppar** nära: först står den still ett ögonblick (varningen), sedan springer den efter henne en stund och somnar om. Om sprite:n har animationen `run` springer den med benen. | Gå tyst förbi och hoppa inte. **Hinner Nora fram till en person** (någon man kan prata med) ger den upp och lägger sig igen. | Mossjätten, gårdskatten Måns (`sleeper`) |
| **Vakter** | Står i vägen, till exempel ett brotroll. | Svara på en gåta eller ge något de vill ha. | Trattis vid svampringen |
| **Vittnen** | Berättar vad de sett, men ibland först när man hjälpt dem. | Fråga ut dem och lös deras problem. | Nallen, Viskan |

Två saker gör att monstren inte blir förutsägbara:
- **Ett monster kan följa efter** (`follows: true` på en sovare). Springer Nora ut genom en dörr medan den jagar henne kommer den efter en sekund senare genom samma dörr, jagar en stund till och går sedan tillbaka.
- **Någon kan hjälpa till** (`calmWhen`). När flaggan finns lugnar monstret ner sig för gott: en patrullerare står still, en sovare sover vidare, en flygare vilar på sin plats och en smygare stannar hemma. Det kan vara ett annat monster som hjälper Nora, till exempel en unge som viskar till sin förälder att Nora är snäll.

**Variera upplägget mellan fallen.** Den skyldige ska inte alltid vara "det lilla okända som smyger i slutet". Därför finns det ofarliga småkryp som pilar förbi (en mus, en boklus, en eremitkräfta) och är villospår, rum helt utan monster, och minst ett fall per säsong där den skyldige är en **person man träffar redan i början**, medan spåren först pekar mot ett misstänkt monster.

Varje monster kan ha ett eget **rop** (`cry`) som syns när det vaknar, hoppar fram eller fångar Nora, till exempel "FRÄÄÄS!" för katten och "GRRRR!" för vargen. Utan rop blir det "BUUU!" (och "IIIIIK!" när en flygare bär iväg Nora).

### Vad som lyser och vem som vill prata

- **Saker** man inte har undersökt, eller som har något nytt (en ledtråd, ett pussel som är redo, eller en ny replik som ger något), har en tunn glödande kant. En ny replik som inte ger något ("Kassaapparaten är öppen och tom.") syns om man går fram och tittar, men gör inte att saken glöder igen. Annars lockas man tillbaka i onödan.
- **Personer, djur och monster** man pratar med (`person: true`) glöder aldrig. De får i stället en **pratbubbla** när de har något nytt att säga, till exempel när en ny replik blir aktuell eller när avslöjandet är redo.
- När Nora står vid något hon kan använda syns ett **förstoringsglas** (ledtrådar och saker att undersöka) eller en **pratbubbla** (någon att prata med). Medan någon pratar syns inga andra bubblor.
- Uppe till höger står **"Ledtrådar i rummet: 2 av 5"**, så att man vet om det finns mer att hitta. Ledtrådar som Ester ger när man kommer in räknas inte där. I detektivboken står hur många man har av alla.
- Saker som står på en disk ritas uppe på diskens skiva, inte framför den.

### Regler för bra monster (lärdomar från speltesterna)

De här reglerna kommer från hur Fladder och Viskan förfinades efter huvudarkitektens speltester. De gäller alla monster i alla fall.

1. **Varje fara ska gå att undvika med något man kan lära sig.** Det ska finnas ett motdrag, som att gömma sig bakom lådor för Fladder eller titta på Viskan så att hon fryser. Ett anfall som inte går att undvika känns orättvist, inte spännande.
2. **Varna innan anfallet.** Monstret visar vad som är på väg att hända: Fladder darrar en kort stund innan hon dyker, och Viskans ögon är öppna när hon rör sig. Varningen ger tid att reagera.
3. **Monstret reagerar på vad spelaren gör.** Gömmer man sig avbryter Fladder anfallet, och tittar man bort smyger Viskan. Det gör monstren levande och spelet mer dynamiskt än fasta mönster.
4. **Visa vad monstret "tänker".** Små signaler berättar vilket läge monstret är i: "?" när det tappat bort Nora, stängda ögon när det fryser, skakningar före anfall.
5. **Bygg upp spänning i stället för att visa allt direkt.** Viskan gömmer sig i tunnan och hoppar fram efter några sekunder, eller när man petar på tunnan. Armen syns bara i korta glimtar. Överraskningen är läskigare än ett monster som redan flyger runt.
6. **Världen ska stämma med texten.** Om något sägs ("locket skramlar, någon bor här") ska spelvärlden visa samma sak. Motsägelser bryter illusionen direkt.
7. **Mystiska saker ska se ut som något.** En glimt ska vara läskig och gå att tolka, som en hand som springer på fingrarna, men inte avslöja lösningen. "En grön korv" väcker bara frågan "vad är det där?" på fel sätt.
8. **Milda och återställbara följder.** Man tappar förstoringsglaset eller blir buren till dörren, men förlorar aldrig framsteg och kan aldrig fastna. Efter en skrämsel får man några sekunders andrum.

**Om ett monster fångar Nora** (huvudarkitektens val):
- "BUU!" Nora blir rädd, skärmen skakar och hon **tappar en sak** som studsar iväg, landar någonstans i rummet och glimmar.
- En flygare **bär iväg** Nora till rummets dörr innan hon släpps.
- Efteråt kan Nora inte fångas igen på ett par sekunder.
- Hon tappar alltid **förstoringsglaset**, som hon har med sig från början av varje fall. Utan det kan hon inte undersöka ledtrådar förrän hon hittat det igen. Ester visar var det landade. Det är alltid förstoringsglaset och aldrig en nyckel eller liknande, så att man aldrig kan fastna.
- Saken landar alltid på en plats man kan nå, en bit från monstrets väg. Ledtrådar i Detektivboken tappas aldrig.

---

## 6. Pedagogisk plan

### 6.1 Grundidé

Pedagogiken ska kännas som **detektivarbete, inte som ett prov**. Man räknar för att öppna ett lås, läser för att förstå en ledtråd och tänker logiskt för att peka ut den skyldige. Innehållet bygger på Lgr22, centralt innehåll för årskurs 1–3, och svårigheten ökar mellan fallen.

### 6.2 Fyra spår genom hela spelet

| Spår | Innehåll | Progression genom fallen |
|---|---|---|
| **Matte** | Tal, mönster, geometri, mätning, tid, pengar, tabeller | Addition 0–20 → subtraktion 0–20 → mätning och tabeller → klockan, talföljder, dubbelt och hälften → blandat upp till 100 |
| **Svenska** | Läsa korta texter, gåtor, rim, alfabetisk ordning, stavning, spegelskrift | Läsa lappar och kvitton → gåtor → ordning och rim → skriva egna korta svar |
| **NO/SO** | Djur och natur, ljus och skugga, tid, kartor och väderstreck | Ett tema per fall (se 6.3) |
| **Detektivtänkande** | Iaktta → jämföra → ordna → dra slutsatser → **argumentera med bevis** → granska vittnen | I fall 1–2 är alla ledtrådar sanna. Från fall 3 kan vittnen ta fel eller ljuga, en första form av källkritik. |

Detektivtänkandet knyter ihop allt: i varje avslöjande väljer man **två bevis** som stöder svaret. Det tränar det som Lgr22 kallar att *resonera och argumentera*.

Lite **engelska** (också centralt innehåll i åk 1–3) kommer in i fall 5, där ett turistmonster bara kan några ord svenska och Nora måste förstå enkla engelska ord.

### 6.3 Tema per fall

| Fall | Matte och svenska | NO/SO | Värdegrund |
|---|---|---|---|
| 1 Leksaksaffären | Addition 0–20 med pengar, 3D-former (klot, kub, cylinder), gåta, läsa lappar | Fladdermöss är nattdjur | Döm inte någon efter utseendet |
| 2 Bullarna | Subtraktion 0–20, följa spår, läsa recept | Mat och bakning | Fråga i stället för att ta, dela med sig |
| 3 Biblioteket | Alfabetisk ordning, rim, spegelskrift, stavning | Böcker och bibliotek | Alla kan lära sig |
| 4 Skogen | Mäta med steg, enkla tabeller (räkna djur) | Djurspår, årstider, svampar: **ät aldrig okända svampar** | Var rädd om naturen |
| 5 Klocktornet | Klockan (hel, halv, kvart), talföljder, dubbelt och hälften, några engelska ord | Tid, kartor och väderstreck | Samarbete och tålamod |
| 6 Monsterfesten | Blandat upp till 100 | Ljus och skugga: hur skuggor uppstår | Alla är rädda för något, och alla får vara med |

Varje fall slutar med en **"Visste du att…?"**-fakta kopplad till temat.

### 6.4 Pusseltyper

✅ = finns byggd.

| Pusseltyp | Hur det styrs | Exempel | Ämne |
|---|---|---|---|
| **Kodlås** ✅ | Siffror (tangentbord eller knappsats) | "Vad kostade allt tillsammans?" | Matte: + och − |
| **Talföljd, dubbelt/hälften** ✅ | Kodlås med uträknade tal (`derive`) | 3, 5, 7, __ | Matte: mönster |
| **Ordningslås** ✅ | Välj bilder i rätt ordning | Former, väderstreck, händelser | Matte, logik, SO |
| **ABC-ordning** ✅ | Ordningslås med slumpade ord (`alphabetize`) | Böcker i bokstavsordning (å ä ö sist) | Svenska |
| **Bildval** ✅ | Klicka på svaret (inga siffror på knapparna) | Gåtor, "Vilket djur gjorde spåret?" | Svenska, NO |
| **Spegelskrift** ✅ | Bildval med spegelvänd text (`mirror`) | Vad står det på lappen? | Svenska |
| **Para ihop** ✅ | Klicka vänster, sedan höger (`match`) | Rimord, djur och spår | Svenska, NO |
| **Vilken klocka?** ✅ | Välj bland fyra ritade klockor (`clock`) | "Klockan är halv fyra" | Matte: tid |
| **Avslöjande** ✅ | Två frågor, var och en med bevisgrupper | "Vad …?" och "Vems …?" | Detektivtänkande |
| **Skriv svaret** | Textruta | Anagram ("RMOETNS"), stava | Svenska |
| **Hemligt meddelande** | Läs och skriv | A=1, B=2 …, baklänges | Svenska, matte |
| **Handla** | Välj mynt | "Det kostar 17 kr. Vilka mynt?" | Matte: pengar |
| **Plattor på golvet** | Gå och trampa i rätt ordning | Följ kompassen: N, Ö, S, V | SO: väderstreck |
| **Hitta skillnaden** | Klicka | Vad har ändrats i rummet? | Iakttagelse |
| **Logikpussel** | Klicka i rutnät | 4×4-sudoku med monsterbilder, "vem bor var" | Logik |

### 6.5 Regler för pussel

- Varje pussel hör till ett mål, och Ester har **tre tips** för målet som blir tydligare och tydligare.
- Svaren kontrolleras förlåtande. Stora och små bokstäver och mellanslag spelar ingen roll, och `6` och `sex` godtas båda, utom när pusslet handlar om stavning.
- Svarar man fel blir det en vänlig reaktion ("Nästan! Försök igen."). Man straffas aldrig.
- Så lite skrivande som möjligt när det inte är just stavning som tränas.
- **Slump mot muskelminne.** Pussel ska inte gå att klicka sig igenom på minnet:
  - **Tal slumpas** inom en ram, till exempel priserna på kvittot, med tvåsiffrigt svar som i talområdet för åk 2.
  - **Ordningen slumpas** där det går, till exempel vilka former formlåset vill ha och i vilken ordning.
  - **Gåtor väljs** ur en samling.
  - **Svarsalternativen blandas** varje gång pusslet öppnas.
  - Slumpen görs en gång per fall, så att Esters tips (`{namn}` i tipsen) alltid stämmer med pusslet.

### 6.6 Stöd för en 8-åring

- **Kort text och stor text:** högst två rader per pratbubbla.
- **Ingen uppläsning.** Den provades i steg 6 men togs bort: webbläsarens röst var ofta engelsk, och att läsa själv tränar läsförståelsen. Texterna hålls i stället korta och enkla.
- **Esters tips** i tre nivåer och en inställbar hjälpnivå.
- **Mus och tangentbord** fungerar i alla pussel.

---

## 7. Ester och tipsen

Det här är spelets hjälpsystem och det viktigaste verktyget mot att man tröttnar.

- Ester följer med genom alla rum men **håller sig lite för sig själv**. Hon står och tittar, kikar runt och promenerar en bit på egen hand. Först när Nora kommer för långt bort (ungefär 4 rutor) går hon ikapp, längs Noras egen väg så att hon aldrig går genom väggar. Hon hoppar över slem och klossar precis som Nora.
- En **fastnat-timer** mäter tiden sedan man senast **kom vidare**. Man kommer vidare när man hittar en ledtråd, löser ett pussel, klarar ett mål eller går in i ett nytt rum för första gången.
- När timern går ut:
  - Ester får ett **"!"** över huvudet, studsar och säger *"Psst, Nora!"*.
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
| Mellanslag | **Står Nora vid något** (förstoringsglas eller pratbubbla syns): använd det. **Annars:** hoppa över låga hinder som pölar, stockar och låga staket. Bläddrar också i dialog. |
| Ctrl (även **E** och **Enter**) | Använd: prata, öppna, undersöka, plocka upp, bläddra i dialog |
| **B** | Öppna Detektivboken |
| **Esc** | Paus och meny |
| Mus | I pussel och menyer |
| Siffror och bokstäver | I kodlås och textrutor |

**På mobil och surfplatta** (bara när spelet märker en pekskärm; på dator är allt som vanligt):
- En **styrspak** nere till vänster, i den mörka kanten bredvid spelet när det finns plats. *(Vi testade att styra genom att hålla fingret var som helst på skärmen, men då skymde fingret för mycket.)*
- En liten **åtgärdsknapp** nere till höger gör samma sak som mellanslag och visar vad den gör: ⤒ hoppa, 💬 prata, 🔍 undersöka, ▶ nästa i dialog.
- **Boken, kartan och musiken** ligger i en kolumn till höger på mobil (i den mörka kanten bredvid spelet), och i en rad upptill på surfplattor där kanten är ovanför spelet.
- Man trycker på pratbubblan, svaren och menyerna. Tangentbordstips döljs, och små texter och knappar blir större.
- Håller man mobilen upprätt visas "Vänd mobilen så spelar vi!". På Android går spelet till helskärm i liggande läge när man startar.
- **Hemlig panel för vuxna:** på titelskärmen klickar man på månens prickar i ordningen liten, mellan, stor, tre gånger i rad. Då öppnas en panel där man för den valda spelaren kan ställa in vilka fall som är klara, med stjärnor och bästa tid (`src/ui/title.ts`). Tre stjärnor räknas som att monsterägget är hittat.
- Spelet kan läggas till på hemskärmen (manifest och ikon med Nora i `public/`, ikonerna görs med `node scripts/make-icons.ts`).

**Tekniska fallgropar:** Ctrl+W och Ctrl+R stänger respektive laddar om fliken, och det kan man inte stänga av i webbläsaren. Därför finns E och Enter också som använd-knapp. Piltangenter och mellanslag måste ha `preventDefault` så att sidan inte scrollar. När en textruta är aktiv ska spelets tangenter vara avstängda.

**Hoppet:** Nora lyfter i ungefär 0,5 s (figuren åker upp, skuggan stannar på marken) och kan då passera **en ruta** med lågt hinder. Väggar går inte att hoppa över.

---

## 9. Belöningar

**Tid är ett rekord att slå, inte en stjärna** (så att man inte stressar förbi texten första gången). Första gången står det "din tid att slå nästa gång". Spelar man om och slår sin tid kommer "🏆 Nytt rekord!" med extra konfetti. Bästa tiden syns på stadskartan under stjärnorna.

Varje fall ger upp till tre stjärnor:
- ⭐ Du löste fallet.
- ⭐ Du använde högst 2 tips från Ester.
- ⭐ Du hittade det gömda **monsterägget**.

Dessutom (huvudarkitekten tyckte särskilt mycket om monsterkorten och faktan, så de ska finnas i **varje** fall):
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
- **Musik:** lugn, dämpad och lite mystisk bakgrundsmusik (huvudarkitektens önskan). Den genereras i koden med Web Audio, med mjuka ackord i a-moll (Am, F, Dm, E) och en gles speldosemelodi med eko, så inga ljudfiler behövs. **M** eller 🎵-knappen stänger av och sätter på, och valet sparas i webbläsaren. Senare kan varje miljö få sin egen stämning. Egen musik kan också göras i **BeepBox** (beepbox.co).
- **Text:** Ett lättläst typsnitt (till exempel *Lexend* eller *Atkinson Hyperlegible*, OFL-licens) inbäddat i spelet, minst 24 px, korta meningar och vanliga ord.
- **Ingen uppläsning.** Spelaren läser själv. Det är en del av lästräningen, och webbläsarens talsyntes lät ofta engelsk.

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
| `~` | Pöl eller slem (hoppa över). Utomhus är det grunt, ljusare vatten, så ett vadställe i en bäck syns. |
| `W` | Djupt vatten (går inte att hoppa över) |
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

**Början och slutet** av ett fall: `intro` (rader på introkortet), `finale` (steg som spelas upp när den skyldige fångats: `say`, `enter`, `frame`, `flash`, `hide`, `reveal`, `give`), `fact` ("Visste du att…?") och `cards` (monsterkort). Saker kan försvinna med `hideWhen`, som det hemliga ägget.

**Pussel** definieras i `puzzles` med typerna `code`, `order`, `choice` och `reveal`. En sak startar ett pussel med `puzzle` (och eventuellt `puzzleWhen` och `puzzleIntro`), och en dörr med `puzzle`. När pusslet är löst ges flaggan i `gives`, och saken säger sedan det den säger efter lösningen (via `talkIf`).

**Hur spellogiken hänger ihop:** Allt drivs av **flaggor**, alltså enkla namn som `"backdoor-open"`. Saker, pussel och ledtrådar kan ge en flagga (`gives`) och kräva en (`requires`). Ett mål är klart när dess flagga finns. Det räcker för 95 % av alla fall. Behövs något specialbeteende för ett visst fall kan det få en egen liten funktion.

### 11.4b Rummens form

Alla fall har tre rum som man går igenom i ordning (fall 3 har ett frivilligt fjärde), men dörrarna sitter på olika ställen i varje fall så att det inte blir upprepande. Rummen ska stämma med hur byggnaden ser ut på stadskartan: bageriet är smalt med bakgården på baksidan, klocktornet och bibliotekstornet har trappor uppåt, källare och grottor nås med trappor nedåt. En dörr kan ritas som **trappa** (`stairs: "up" | "down"`), och i skogen är öppningarna grusstigar. Ett fall har en **genväg** som öppnas först när man har förstått något.

**Vatten och slem** ritas efter alla rutor med mjuka, lite ojämna kanter (inga skarpa hörn där två pölar möts), och djupt vatten får en lerig strand. Formen följer rutorna, så det man ser stämmer med var Nora kan gå. Bakgården i fall 2 är en **slingrande bäck**: det snabba sättet är att hoppa över vattnet, men det väcker Måns. Det säkra sättet är att gå runt längs bäcken, och det finns ett test som ser till att den vägen alltid finns.

### 11.5 Validering, viktig när banor ändras ofta

Ett test (`npm test`), och en kontroll när spelet startar i utvecklingsläge, går igenom alla fall:
- Varje kartrad är exakt 20 tecken och varje karta har 12 rader.
- Varje tecken på kartan är känt eller definierat i rummet.
- Varje dörr leder till ett rum som finns.
- Varje pussel har ett svar och tre tips. Varje mål har minst ett tips.
- Varje flagga som krävs kan ges av något.
- Avslöjandets rätta svar finns bland valen.

Fel visas **på svenska i spelet**, till exempel: *"Rad 4 i rummet 'Bageriet' har 19 tecken, den ska ha 20."*


`tests/caseChecks.ts` kontrollerar (för båda säsongerna) att Nora kan gå eller hoppa från varje ingång till varje sak, ledtråd och dörr i varje rum – viktigt när dörrar flyttas.
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

Framstegen sparas i `localStorage` under nyckeln `monsterdetektiven-v2`. Det finns **fyra spelare**, och för varje spelare sparas namn, vilka fall som är klara, stjärnor, bästa tid, hittade ägg och monsterkort. På **titelskärmen** väljer man spelare (klicka, 1–4 eller pilarna, sedan mellanslag), byter namn (✏️) eller **rensar** en spelare (🗑️). Rensningen kräver att man klickar på "Ja, rensa" i en bekräftelseruta; Enter och Esc avbryter. Äldre framsteg (`-v1`) flyttas till spelare 1. Musikvalet sparas separat. Allt fungerar även när den färdiga HTML-filen öppnas direkt från disk. Ett fall sparas inte mitt i. Fallen är korta, 5–15 minuter.

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
| 2 ✅ | Tre rum i fall 1 (butiken, lagret, bakgården) med dörrar, flaggor, mål, ledtrådar som glittrar, en nyckel och Detektivboken (B). Målet visas uppe till höger. |
| 3 ✅ | Ester (efter huvudarkitektens teckning) håller sig i närheten, går ikapp när Nora är för långt bort, studsar med ett "!" och ropar när man fastnat. Hon ger tre nivåer av tips per mål, annars peppar hon. Rummets namn visas varje gång man går in. |
| 4 ✅ | Pussel: kodlås med knappsats (kassaapparaten), ordningslås med former (bakdörren), gåta med bildval (Viskan) och avslöjande där man väljer skyldig och två bevis (Stina). Rätt svar ger konfetti och en glad jingel. Fel svar skakar lite och säger "försök igen". Allt går med både mus och tangentbord (siffror, Enter, Esc). |
| 5 ✅ | Monster: flygare (Fladder darrar, dyker och bär iväg Nora, och man gömmer sig bakom lådor), smygare (Viskan gömmer sig i tunnan, hoppar fram och smyger när man tittar bort), krypare (armen syns i korta glimtar långt från Nora), tappat förstoringsglas och bakgrundsmusik. |
| 6 ✅ | **Fall 1 är ett komplett mysterium:** introkort, tre rum, nio ledtrådar varav två leder mot den röda tråden, fyra slumpade klurigheter, tre monster, avslöjande med bevis, jakt på den skyldige bland hyllorna, slutscen med månstensbiten, resultatskärm (stjärnor, tid, monsterkort, "Visste du att…?"), hemligt monsterägg och sparade framsteg (titelskärmen visar dem). **Nästa: det första riktiga speltestet med huvudarkitekten!** |
| 7 | *(Sparas till senare, kanske som en återkommande loop: egen grafik och egna ljud om huvudarkitekten vill.)* |
| 8 ✅ | Fall 2–6 med nya miljöer (bageri, bibliotek, skog, klocktorn, torg), nya monstertyper (patrullerare och sovare) och nya pusseltyper (talföljd, ABC-ordning, spegelskrift, para ihop, klockan). |
| 9 ✅ | Stadskarta där man väljer fall (nästa fall låses upp när det förra är löst), månstensbitar, monstersamling med alla kort (de man inte har är skuggor), inställningar (hjälpnivå och musik) och byte av spelare. |

**Tips för speltest:** Titta utan att hjälpa till. Där man fastnar behöver ett tips bli bättre eller ett pussel bli lättare. Låt gärna kompisar testa.

---

## 13. Framtida idéer (att göra)

Sådant som är bra men inte ingår i byggordningen än:

- **Svårighetsgrad för matten:** en inställning för talområdet (till exempel 0–10, 0–20 eller 0–100), så att samma fall passar både nu och om ett år. Pusslen genererar då sina tal utifrån inställningen i stället för att ha fasta svar.
- **Fler pusseltyper** ur tabellen i 6.4, när fallen behöver dem.
- **Pekskärm och surfplatta.**

---

## 14. Frågor till huvudarkitekten 🕵️‍♀️

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
