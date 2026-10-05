# Bruto-netto calculator

Een eenvoudige website die een brutosalaris omrekent naar netto, op basis van de
Nederlandse belastingschijven, algemene heffingskorting en arbeidskorting van 2026.

Open `index.html` in je browser — er is geen build-stap of server nodig.

- `calculator.js` – de berekening en de tarieven (pas `TARIEVEN_2026` aan voor een ander jaar)
- `app.js` – koppeling tussen formulier en resultaat
- `style.css` – opmaak (licht en donker thema)

De uitkomst is indicatief: werknemer onder de AOW-leeftijd, zonder pensioenpremie,
bijtelling of andere inhoudingen.

## Tijdverschil tussen landen

`tijdverschil/index.html` vergelijkt de lokale tijd van twee landen: typ twee landen
en zie het tijdverschil, de klok in beide landen en een dagoverzicht met overlappende
kantooruren. Zomer- en wintertijd komen uit de tijdzonedatabase van de browser.
