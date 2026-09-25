# Monsterdetektiven – Säsong 2 (förberedd, inte inkopplad)

> ⚠️ **SPOILER – läs inte det här dokumentet, huvudarkitekten (eller pappa innan ni spelat)!** 🙈
> Allt nedan är hemligt: berättelsen, de skyldiga och lösningarna i fall 7–12.
> Frågorna som huvudarkitekten ska svara på finns i ett eget dokument utan spoilers: **`SEASON2-FRAGOR.md`**.

Säsong 2 är förberedd men **inte inkopplad** i spelet. Koden ligger i `src/season2/` och testas med
samma tester som säsong 1 (`tests/season2.test.ts`), men ingenting därifrån syns i spelet förrän vi
kopplar in den (se "Så kopplar vi in säsong 2" längst ner).

---

## 1. Kort om säsongen

**Titel:** *Färgtjuven i Hamnstaden* (arbetsnamn – huvudarkitekten kan döpa om stadsdelen).

Efter Monsterfesten öppnar en ny stadsdel på andra sidan bäcken: **Hamnstaden**, med hamn och fyr,
skola, växthus, akvarium, tivoli och ett nytt konstmuseum. Men varje natt **försvinner en färg** från
en ny plats: först det röda, sedan det gula, det gröna, det blå, det orange och till sist det lila.
Allt blir grått. Nora och Ester ska ta reda på vem som tar färgerna – och varför.

Säsongen är **lite svårare** än säsong 1 (se avsnitt 3), och den bygger vidare på allt Nora har lärt sig.

---

## 2. Den röda tråden (hemlig)

**Sanningen:** Konstnären **Pia Palett** (S2.painter) skulle flytta sin ateljé till det nya
konstmuseet. På vägen tappade hon sin gamla skissbok. I den fanns en blyertsskiss av ett litet
runt monster som hon aldrig hann färglägga: *"Klick – färglägg sen!"*

Natten då Månstenen lyste som starkast på Monsterfesten vaknade skissen till liv. **Klick**
(S2.scribble) är gjord av blyertslinjer: grå, lite suddig, och nästan omöjlig att se mot grå
stenar. Ingen märker Klick. Klick vill vara färgglad som alla andra, och **synas**.

Varje natt lånar Klick en färg från en plats och försöker måla sig själv. Men målarfärg fastnar inte
på blyerts: till morgonen har färgen runnit av igen. Klick samlar den avrunna färgen i **glasburkar**
i museets källare och försöker om och om igen. Det Klick inte förstår är att staden blir grå och att
monster och människor blir ledsna och rädda.

**Varför det blir grått i spelet:** varje fall har `faded` (0–1) på sina rum. Det ökar genom
säsongen (fall 7 ≈ 0,25 → fall 12 ≈ 0,8), så staden blir gråare och gråare. I säsongsfinalen
kommer alla färger tillbaka (`{ recolor: true }` i finalen).

**Spåren genom säsongen** (alla fall har minst ett, och de blir tydligare):

| Fall | Färg | Spår efter Klick |
|---|---|---|
| 7 Hamnen | Röd | Grå **ritade fotspår** på fyrens trappa, **pennspån** högst upp. Sjöodjuret såg "något litet och grått som såg *ritat* ut". |
| 8 Skolan | Gul | En **riven skisssida** i bildsalen: en blyertsteckning av ett litet runt monster, *"Klick – färglägg sen! / P.P."* |
| 9 Växthuset | Grön | Grön färg har **runnit** i små droppar från plantorna mot dörren. Fotspåren igen. |
| 10 Akvariet | Blå | Övervakningsbilden: en grå **klotterfigur** som bär en blå glöd. |
| 11 Tivolit | Orange | Clownen **pratade med den**: den heter Klick och sa att den skulle "hem till museet". En affisch: *Utställning: Pia Palett*. |
| 12 Museet | Lila | Finalen: Klick avslöjas, burkarna i källaren, skissboken. |

**Samlarsaken:** i slutet av varje fall hittar Nora en **färgdroppe** i fallets färg
(`dropRed`, `dropYellow` …, item `drop-red` …), ungefär som månstensbitarna i säsong 1. I finalen
används dropparna för att måla Klick.

**Slutet (fall 12):** Klick gömmer sig i tavlorna och är livrädd. Nora förstår varför Klick tog
färgerna. Alla hjälps åt: Nora ger sina färgdroppar, Pia Palett målar Klick i alla regnbågens färger
(`s2Scribble` bild 2) – och då fastnar färgen, för den är given med glädje. Färgerna flödar tillbaka
till staden (`recolor`). Klick får bo i museet och bli museets eget konstverk. **Värdegrund:** *Alla
förtjänar att synas – och man kan be om hjälp i stället för att ta.*

**Koppling till säsong 1:** Månstenen väckte skissen (sägs först i finalen, lätt och kort).
Gamla vänner hälsar på: **Trattis** i växthuset (fall 9), **Fladder** i berg-och-dalbanan (fall 11),
**Smulan** säljer bullar på tivolit (fall 11). Skuggan kan skymta med sitt nattljus i finalen.

---

## 3. Svårare än säsong 1

| Område | Säsong 1 | Säsong 2 |
|---|---|---|
| Matte | 0–20 → 0–100 | 0–100 säkert, **hundratal upp till 1000**, **multiplikation** (2:ans, 5:ans och 10:ans tabell), pengar med sedlar, mätning (cm, kg, liter) |
| Klockan | hel, halv, kvart | **femminuterssteg**: "tio över", "fem i halv", "tjugo i" |
| Svenska | läsa lappar, gåtor, ABC, rim, spegelskrift | **skriva ord**: blandade bokstäver, baklänges, **hemlig sifferkod** (A=1 …), **stava** till bilder, längre texter |
| Logik | bevis | **bildsudoku 4×4**, bevis med **tre frågor**, och **vittnen som ljuger** (källkritik: även vuxna kan ha fel) |
| Rum | 3 rum (ett fall 4) | **3–4 rum**, gärna med nav i mitten, trappor och genvägar |
| Engelska | några ord (fall 5) | några ord på skyltar i akvariet (fall 10) |

Nya pusseltyper (finns i motorn, testade): **`word`** (anagram, reverse, cipher, spell),
**`coins`** (betala exakt, eller med så få mynt som möjligt), **`grid`** (bildsudoku 4×4).
Klockpusslet kan nu `minutes: [5, 10, 20, 25, 35, 40, 50, 55]`.

Nya miljöer (teman): **`harbor`** (brygga och hav), **`school`**, **`greenhouse`**, **`aquarium`**,
**`fair`** (tivoli), **`museum`** (där hyllor `H` ritas som tavlor).

---

## 4. Pedagogik per fall

| Fall | Matte och svenska | NO/SO | Värdegrund |
|---|---|---|---|
| 7 Hamnen | Pengar med mynt och sedlar (betala exakt), vikt i kg, klockan i femminuterssteg | Fyrar och ljus: varför fyrar har färger och blinkar | Döm inte någon för att den ser farlig ut |
| 8 Skolan | Multiplikation (5:ans och 10:ans), blandade bokstäver, hemlig sifferkod | Skolan och klassrummet; färger syns olika bra | Snälla hemligheter – men skräm ingen |
| 9 Växthuset | Mäta i cm, växtens ordning (frö → grodd → planta → blomma → frukt), bildsudoku | Växter växer mot ljuset; varför blad är gröna | Dela med dig |
| 10 Akvariet | Talen upp till 1000 (liter), betala med få mynt, sifferkod, några engelska ord | Bläckfiskar (tre hjärtan, byter färg, kryper genom små hål); havsdjur och var de bor | Säg sanningen även när det är jobbigt |
| 11 Tivolit | Klockan (femminuterssteg, åkschema), spegelskrift, 2:ans tabell | Speglar: höger blir vänster | Även vuxna kan ha fel – och kan säga förlåt |
| 12 Museet | Färgblandning (röd + gul = orange …), stava färgord, multiplikation (rader × kolumner med tavlor) | Regnbågen och ljusets färger | Alla förtjänar att synas; be om hjälp |

---

## 5. Fallen

Alla fall följer reglerna i `CLAUDE.md` och `DESIGN.md` (teoritrappa, goda monster, avslöjande där
man markerar **alla** bevis, Esters sammanfattning, inga låsningar, `person: true` på dem man pratar
med). Namn som huvudarkitekten bestämmer skrivs som konstanter från `src/season2/names.ts` (till exempel
`${S2.keeper}`), så att hennes namn bara behöver bytas på ett ställe.

### Fall 7: Fyren som tappade färgen (Hamnen – RÖD)

- **Intro:** Fyrvakten ringer: *fyren lyste vitt i natt i stället för rött – en båt höll på att gå på
  grund. Alla säger att sjöodjuret gjorde det!*
- **Rum (4, nav):** **Kajen** (harbor, start, nav) → **Fiskboden** (storage) och **Fyrens fot**
  (tower) → trappa upp → **Fyrens topp** (tower).
- **Misstänkta:** sjöodjuret **S2.seaMonster** (ser farligt ut, anklagat), **S2.seagull** (snattar
  glänsande saker), fiskaren **S2.fisher** (sur, "någon har målat om min båt!"), fyrvakten **S2.keeper**
  (glömde hon tända?).
- **Sanningen:** Ingenting är trasigt och ingen släckte fyren – **allt rött i hamnen har blivit grått**:
  det röda glaset i lampan, fiskarens röda båt, de röda bojarna. Något litet och grått klättrade upp i
  fyren i natt (Klick). Måsen snodde fyrvaktens blanka putstrasa och **ljög** att den sett sjöodjuret i
  trappan, för att inte själv bli misstänkt. Sjöodjuret kan inte gå i trappor – det har fenor och det
  blöta spåret slutar vid vattnet.
- **Avslöjande (3 frågor):** *Varför lyste fyren vitt?* (det röda glaset har tappat färgen – bevis:
  fyrvaktens loggbok "tände som vanligt", det grå glaset högst upp, den grå båten, de grå bojarna) ·
  *Vem klättrade upp i fyren?* (något litet och grått som ser ritat ut – bevis: ritade fotspår i
  trappan, pennspån högst upp, sjöodjurets vittnesmål) · *Vem ljög?* (måsen – bevis: putstrasan i
  boet, det blöta spåret som slutar vid vattnet, måsens vittnesmål som inte stämmer med trappan).
- **Fånga:** måsen gömmer sig bland näten (krypare, `shelters` på `H`).
- **Final:** måsen lämnar tillbaka trasan och säger förlåt; sjöodjuret blir vän med fyrvakten; under
  trasan ligger en **röd droppe** (`dropRed`, `drop-red`). Ester: *"Det är ju färg … som har runnit av
  något!"*
- **Klurigheter:** betala en makrill till sjöodjuret med mynt (`coins`, 20–60 kr), fyrvaktens
  kodlås (klockan i femminuterssteg på loggboken, `clock`), väga fisk (kodlås, kg), ett blandat ord i
  loggboken (`word` anagram, t.ex. FYREN, LAMPA, SJÖ…).
- **Monster:** måsen (flygare, dyker på bryggan – göm dig bakom lådor), krabban **S2.crab**
  (patrullerare i fiskboden), sjöodjuret (vittne vid vattenkanten).
- **Fakta:** Fyrar blinkar i olika mönster så att sjömännen vet vilken fyr de ser.
- **Kort:** S2.seagull, S2.seaMonster, S2.crab.

### Fall 8: Nattens klassrum (Skolan – GUL)

- **Intro:** Vaktmästaren: *någon är i skolan på nätterna – saker flyttas, och i morse var allt gult
  grått: solrosorna, skolbussen, till och med min gula mössa!*
- **Rum (4):** **Skolgården** (yard, start) → **Klassrummet** (school) → **Korridoren** (school, nav)
  → **Bildsalen** (school).
- **Misstänkta:** svampmonstret **S2.sponge** (bor i städskåpet), kritmonstret **S2.chalk**,
  vaktmästaren själv, klassens **S2.classPet** (borta ur buren!), "ett spöke".
- **Sanningen:** Fröken **S2.teacher** och S2.sponge förbereder i hemlighet en **överraskningsfest** för
  vaktmästaren som fyller 60. S2.sponge flyttar bänkar på nätterna och suddar tavlan varje morgon så
  att ingen ska se planerna. Hamstern är lånad till festen och sover gott i en låda i bildsalen.
  Det gula försvann av en helt annan anledning: i bildsalen ligger **Klicks skisssida**.
- **Avslöjande (3 frågor):** *Vem är i skolan på nätterna?* (S2.sponge) · *Varför?* (en hemlig fest –
  bevis: inbjudan med blandade bokstäver, kalendern, ballongerna i skåpet) · *Vem tog det gula?* (den
  ritade figuren på skisssidan – bevis: sidan, fotspåren i solrosrabatten, gul droppe på golvet).
- **Fånga:** S2.sponge gömmer sig i elevskåpen (krypare i `H`). **Final:** "Överraskning!" för
  vaktmästaren – fröken ber om ursäkt för att de skrämde honom; gul droppe.
- **Klurigheter:** inbjudan (`word` anagram), meddelande på tavlan (`word` cipher), ballongerna (kodlås
  med multiplikation, `{påsar}*5`), festen börjar (`clock` femminuterssteg).
- **Monster:** kritmonstret (patrullerare i korridoren), S2.sponge (smygare – fryser när man tittar),
  hamstern (liten, springer omkring).
- **Fakta:** något sant och kul om färger och ögat (t.ex. varför gult syns bra i skymning).

### Fall 9: Spöket i växthuset (Växthuset – GRÖN)

- **Intro:** Trädgårdsmästaren: *plantorna rör på sig när ingen tittar, tomaterna försvinner, och i
  natt blev alla blad grå och hängiga!*
- **Rum (3 + ett litet):** **Trädgården** (yard, start) → **Växthuset** (greenhouse) →
  **Odlingsrummet** (greenhouse) + en liten **kompost** med ägget.
- **Misstänkta:** köttätande **S2.flytrap** (biter!), snigelmonstret **S2.snail**, **Trattis** (på
  besök), ett spöke, trädgårdsmästaren **S2.gardener**.
- **Sanningen:** Plantorna rör sig inte av sig själva – **de växer mot ljuset**. S2.gardener flyttade
  krukorna till fönstret på andra sidan, och nu lutar de åt det nya ljuset. Tomaterna äts av
  **S2.snail**, som var hungrig eftersom de grå bladen inte smakar något längre. Det gröna tog Klick
  (gröna droppar som runnit mot dörren, fotspåren).
- **Avslöjande (3 frågor):** *Varför rör sig plantorna?* · *Vem äter tomaterna?* · *Varför blev bladen
  grå?*
- **Fånga:** S2.snail gömmer sig bland odlingshyllorna. **Final:** S2.gardener delar med sig; grön droppe.
- **Klurigheter:** bildsudoku med fyra växter (`grid`), mäta hur mycket plantan vuxit (kodlås i cm),
  växtens ordning (ordningslås med beskrivningar), Trattis fråga om svampar (bildval).
- **Monster:** S2.flytrap (sovare – hoppa inte nära!), S2.snail (krypare, slemspår), en humla eller
  fjäril (flygare) som dyker mot det som luktar sött.
- **Fakta:** Blad är gröna för att de fångar solljus med ett grönt ämne (klorofyll).

### Fall 10: Bläckfiskens hemlighet (Akvariet – BLÅ)

- **Intro:** Dykaren: *bläckfisken **S2.octopus** är borta ur sin tank, allt blått vatten har blivit
  grått – och sälen säger att han såg en haj!*
- **Rum (4):** **Entrén** (aquarium, start – köp biljett) → **Stora tanken** (aquarium) →
  **Pumprummet** (storage, rör) → **Sälbassängen** (harbor, utomhus).
- **Misstänkta:** en haj (finns inte!), sälen **S2.seal**, maneten **S2.jellyfish**, dykaren
  **S2.diver**, städroboten.
- **Sanningen:** Bläckfiskar kan krypa genom hål stora som ett mynt. S2.octopus kröp ut genom röret
  när det blå försvann (bläckfiskar byter färg för att gömma sig – utan blått kände den sig naken och
  rädd) och gömmer sig **förklädd som en sten** i pumprummet. **Sälen ljög** om hajen, för han åt upp
  bläckfiskens räkor och ville inte bli skyldig. Det blå tog Klick (övervakningsbilden).
- **Avslöjande (3 frågor):** *Vart tog S2.octopus vägen?* · *Vem ljuger?* (sälen – skylten över alla
  djur i akvariet har ingen haj; räkskal vid sälbassängen; dykarens matlista) · *Vem tog det blå?*
- **Fånga:** hitta bläckfisken förklädd bland stenarna (krypare i `H`). **Final:** blå droppe.
- **Klurigheter:** biljetter (`coins` med få mynt, t.ex. barn 35 kr), dykarens meddelande
  (`word` cipher), liter i tankarna (kodlås till 1000), para ihop djur och engelska ord på skyltarna
  (`match`).
- **Monster:** maneten (patrullerare som svävar i en gång), sälen (sovare på klippan?), krabban kan
  hälsa på från fall 7.
- **Fakta:** En bläckfisk har tre hjärtan och blått blod.

### Fall 11: Karusellen som stannade (Tivolit – ORANGE)

- **Intro:** Direktören: *karusellen har stannat, alla orange ballonger är grå och clownen **S2.clown**
  har gömt sig – det måste vara han!*
- **Rum (4):** **Tivoliplatsen** (fair, start, nav) → **Spegellabyrinten** (museum-tema går inte –
  använd `storage`/`tower` med speglar som saker) → **Karusellen** (fair) → **Direktörens vagn** (shop).
- **Misstänkta:** clownen, spegelspöket **S2.mirrorGhost**, **Fladder** (i berg-och-dalbanan),
  **Smulan** (säljer bullar), direktören **S2.director**.
- **Sanningen:** Karusellen stannade för att **direktören tappade nyckeln** i sockervaddsmaskinen och
  skämdes – därför skyllde han på clownen (**en vuxen som ljuger**). Spegelspöket är bara spegelbilder.
  Clownen gömde sig för att han var rädd – och han **pratade med den grå figuren**: den heter
  **Klick** och sa att den skulle "hem till museet".
- **Avslöjande (3 frågor):** *Varför stannade karusellen?* · *Vem ljuger?* (direktören – hans tider
  stämmer inte med åkschemat, socker på nyckeln, hålet i fickan) · *Vem tar färgerna, och vart ska
  den?* (Klick, till museet – clownens vittnesmål, affischen om Pia Paletts utställning, orange droppar
  mot utgången).
- **Fånga:** clownen gömmer sig i ett stånd; direktören säger förlåt. **Final:** orange droppe.
- **Klurigheter:** åkschemat (`clock` femminuterssteg), spegelskrift på spegellappen (`choice mirror`),
  åkbiljetter (`coins`), 2:ans tabell (kodlås: vagnar × 2 platser).
- **Monster:** spegelspöket (smygare i labyrinten), Fladder (flygare), clownen (krypare).
- **Fakta:** En spegel byter plats på höger och vänster – men inte på upp och ner.

### Fall 12: Färgtjuven (Museet – LILA, säsongsfinal)

- **Intro:** Pia Palett: *min utställning öppnar i kväll, men alla tavlor är grå och det lila är
  borta! Jag tror att någon bor här i museet …*
- **Rum (4):** **Entréhallen** (museum, start) → **Galleriet** (museum, tavlor) → trappa upp →
  **Ateljén** (museum) och trappa ner → **Källaren** (storage) med burkarna.
- **Sanningen:** se avsnitt 2.
- **Avslöjande (3 frågor):** *Vem tar färgerna?* (Klick – skisssidan från skolan, fotspåren, clownens
  vittnesmål, övervakningsbilden, burkarna) · *Varför?* (vill ha färger och synas – skissboken
  "färglägg sen!", försöken på ateljéväggen där färgen runnit av) · *Var är färgerna nu?* (i burkarna
  i källaren).
- **Fånga:** Klick gömmer sig i tavlorna (krypare i `H` = tavlor). **Final:** Nora ger sina färgdroppar,
  Pia målar Klick i alla färger (`frame` → bild 2), `recolor`, alla vänner kommer in. Huvudarkitektens egen tavla
  hänger på utställningen.
- **Klurigheter:** blanda färger (bildval: röd + gul = ?), bildsudoku med fyra färgburkar (`grid`),
  stava färgord (`word` spell), tavlor i rader och kolumner (kodlås, multiplikation).
- **Monster:** museivakten **S2.guard** (inte monster – men patrullerar på natten!), ett
  skulpturmonster (sovare), Klick (krypare).
- **Fakta:** Regnbågen har sju färger: röd, orange, gul, grön, blå, indigo och violett.
- **Summering (Ester):** hela säsongens kedja, kort.

---

## 6. Rollista – det huvudarkitekten bestämmer

Allt i `src/season2/names.ts` (namn) och figurerna i `src/season2/sprites/` (utseende) är
**platshållare**. Frågorna i `SEASON2-FRAGOR.md` ger svaren. Viktigt: frågorna avslöjar aldrig vem
som är skyldig – de handlar om utseende, namn, färger och miljöer.

Varje figur huvudarkitekten ritar ligger i **en** sprite-nyckel, så en ny teckning byter bara den nyckeln:

| Fall | Figur (namn i `S2`) | Sprite-nyckel | Fråga |
|---|---|---|---|
| 7 | fyrvaktaren `keeper` | `s2Keeper` | 5 |
| 7 | fiskaren `fisher` | `s2Fisher` | 6 |
| 7 | sjöodjuret `seaMonster` | `s2SeaMonster` (24×20) | 7 |
| 7 | måsen `seagull` | `s2Seagull` (ruta 0 sitter, 1–2 flyger) | 8 |
| 7 | krabbmonstret `crab` | `s2Crab` | 9 |
| 8 | fröken `teacher` | `s2Teacher` | 11 |
| 8 | vaktmästaren `janitor` | `s2Janitor` | 12 |
| 8 | tvättsvampen `sponge` | `s2Sponge` | 13 |
| 8 | klassens djur `classPet` | `s2ClassPet` | 14 |
| 8 | kritmonstret `chalk` | `s2Chalk` | 15 |
| 9 | trädgårdsmästaren `gardener` | `s2Gardener` | 17 |
| 9 | köttätande växten `flytrap` | `s2Flytrap` (ruta 0 sover, 1 vaken) | 18 |
| 9 | snigeln `snail` | `s2Snail` | 19 |
| 10 | dykaren `diver` | `s2Diver` | 23 |
| 10 | bläckfisken `octopus` | `s2Octopus` (0–1 grå sten, 2 glad i färg) | 24 |
| 10 | sälen `seal` | `s2Seal` | 25 |
| 10 | maneten `jellyfish` | `s2Jellyfish` | 26 |
| 11 | direktören `director` | `s2Director` | 29 |
| 11 | clownen `clown` | `s2Clown` | 30 |
| 11 | spegelspöket `mirrorGhost` | `s2MirrorGhost` (0 öppna ögon, 1 stängda) | 31 |
| 12 | konstnären `painter` | `s2Painter` | 33 |
| 12 | vakten `guard` | `s2Guard` | 34 |
| 7–12 | den lilla grå `scribble` | `s2Scribble` (delad; 0–1 grå, 2 regnbåge) | 36 |

Fråga 35 (huvudarkitektens egen tavla) ska bli en ny sak på väggen i museets galleri (fall 12). Fråga 16, 21, 27 och
32 (byggnaderna) blir stadskartan. Fråga 22 (favoritdjur i havet) får ett eget litet inslag i akvariet.

Figurer som fallen har hittat på själva (inte i `names.ts`): Humlan Surr (fall 9), Skelettet Benke
(fall 8), valrossen Betan (fall 10), sockervaddsmonstret Vaddis (fall 11), statyn Granit och Mona (fall 12).

### Avvikelser från skisserna ovan (så som fallen blev skrivna)

- **Fall 7:** måsen fångas genom att man tröttar ut henne och pratar med henne på pollaren (inte en
  krypare i näten).
- **Fall 8:** Kritan är smygaren man kan prata med, och Suddis är kryparen i skåpen som fångas.
  Skelettet Benke patrullerar korridoren.
- **Fall 10:** Glim är en flygare (vittne när hon vilar), städroboten patrullerar och valrossen Betan
  sover vid sälbassängen.
- **Fall 11:** clownens vittnesmål är en lapp med spegelskrift, och karusellen är tre saker i rad.
- **Fall 12:** vakten patrullerar och "pratar" genom sin loggbok. Vännerna från fall 7–11 nämns bara
  i repliker tills deras figurer finns i registret.
- **Variation (tillagt efter speltest av säsong 1):** i fall 8 hjälper Kritan till – när Nora har mött
  Benke i korridoren kan hon be Kritan rita en ruta åt honom, och då står han still (`calmWhen`). Vaddis
  (fall 11) och statyn Granit (fall 12) **följer efter** Nora genom dörrarna om de vaknar (`follows`). I
  stora tanken (fall 10) pilar en ofarlig eremitkräfta förbi som villospår. Fall 11 är säsongens fall där
  den skyldige är en person man träffar direkt.
- **Motorn:** klockpusslets slumpade tid kan inte användas i ledtrådstexter (`rollClock` ger inga
  `vars`). Det vore en liten förbättring att lägga till.

---

## 7. Så kopplar vi in säsong 2

1. Ställ frågorna i `SEASON2-FRAGOR.md` till huvudarkitekten, **en i taget** (barnläge). Spara svaren längst ner i
   det dokumentet.
2. Byt namnen i `src/season2/names.ts`.
3. Rita om figurerna efter hennes teckningar (fota → pixelbilder), i `src/season2/sprites/`.
4. Rita stadskartan för Hamnstaden efter hennes teckning (som i säsong 1).
5. Koppla in: `season2Cases` och `season2Sprites` från `src/season2/index.ts` (testas redan i
   `tests/season2.test.ts`) – fall 7–12 i spelets fallista (efter fall 6), deras figurer i figurregistret,
   stadskartan med en knapp för att byta mellan Mystiska staden och Hamnstaden. Säsong 2 låses upp
   när fall 6 är löst.
6. Kör testerna, provspela varje fall i en bakgrundsflik, uppdatera `DESIGN.md`.
7. **Monsteräggen får en större roll.** I säsong 1 samlar man bara äggen (de syns längst ner på
   stadskartan). I säsong 2 ska de betyda något, till exempel att de kläcks till en liten monsterbebis
   som följer med (fråga 39 i `SEASON2-FRAGOR.md`). Fundera på om säsong 2 ska ha egna ägg, och vad som
   händer när man har alla.
