# Monsterdetektiven 🔍👻

Ett pixligt detektivspel i webbläsaren för barn runt 8 år, på svenska. Detektiven Nora och hennes
kompis Ester löser mysterier i Mystiska staden, där det finns monster som är lite läskiga men
aldrig elaka. Man letar ledtrådar, pratar med vittnen, löser klurigheter och pekar ut den skyldige
med bevis från detektivboken.

**Spela:** https://jerrhagen.github.io/monsterdetektiven/

Spelet fungerar på dator och mobil. På mobilen kan man lägga det på hemskärmen som en app.

## Vem har gjort spelet?

Spelets huvudarkitekt, 8 år, bestämmer över berättelser, figurer, monster och namn och har ritat
stadskartan. Hennes pappa har varit med, och koden och pixelgrafiken är gjorda med hjälp av Claude
(Anthropic).

## Styrning

| Tangent | Gör |
|---|---|
| Piltangenterna | Gå |
| Mellanslag | Titta, prata eller hoppa (beroende på var Nora står) |
| B | Detektivboken |
| M | Musik på/av |

På mobilen finns en styrspak och en åtgärdsknapp.

## ⚠️ Spoilers

`DESIGN.md` och `SEASON2.md` innehåller lösningarna på alla mysterier, och det gör även filerna i
`src/cases/` och `src/season2/`. Läs dem inte om du vill spela själv!

## För utvecklare

TypeScript, [Phaser 4](https://phaser.io) och Vite. Spelet byggs till en enda fristående HTML-fil.

```bash
npm install
npm run dev      # starta på http://localhost:5173
npm test         # kör testerna (bland annat att inget fall kan låsa sig)
npm run build    # bygger dist/index.html
```

- `src/cases/`: fallen (rum, ledtrådar, pussel, monster) som data
- `src/engine/`: spelmotorn (rum, monster, pussel, sparning)
- `src/sprites/`: all pixelgrafik, ritad som färgrutnät i koden
- `src/ui/`: dialoger, detektivboken, pussel och menyer (HTML/CSS ovanpå canvas)
- `src/season2/`: säsong 2, förberedd men inte inkopplad än

Spelet publiceras automatiskt på GitHub Pages vid varje push till `main`.
