<p align="center">
  <img src="src/assets/higeco-more-logo.png" alt="Higeco More" width="360" />
</p>

# Higeco – Esercizio Performance Ratio

Applicazione web sviluppata per l'esercizio di programmazione del processo di selezione Higeco Group. Legge i dati di monitoraggio di un impianto fotovoltaico simulato tramite le Web API Higeco, calcola il **Performance Ratio** (PR) e mostra dati e risultato in una pagina.

## Cosa fa

1. Si autentica sul portale di test (`https://testing.higeco.com`) con il token API e ottiene un token di sessione.
2. Risale la gerarchia Plant "Impianto" → Device "Impianto" → Log "Fotovoltaico" → Items "Energia" e "Irraggiamento".
3. Scarica i campioni **orari** di una settimana.
4. Calcola il PR, per singolo giorno e sull'intera settimana.
5. Mostra il tutto nella pagina iniziale.

## Avvio

Requisiti: Node ≥ 24 e [Bun](https://bun.sh).

```bash
bun install
cp .env.example .env.local   # poi inserisci il token API in HIGECO_API_TOKEN
bun dev                      # http://localhost:3000
```

Il token API è quello indicato nel testo dell'esercizio. Viene letto dalla variabile d'ambiente `HIGECO_API_TOKEN` e non è salvato nel repository; senza, la pagina iniziale va in errore.

## Pagine

| Percorso      | Contenuto                                                        |
| ------------- | ---------------------------------------------------------------- |
| `/`           | L'esercizio: info su impianto, selettore settimana, PR e tabella |
| `/components` | Catalogo e documentazione dei componenti base dell'interfaccia   |
| `/api-docs`   | Documentazione delle Web API Higeco, incorporata in un frame     |

La pagina dell'esercizio mostra, dall'alto:

- tre card con i dati di Plant, Device e Log;
- il selettore della settimana;
- il riquadro **Performance Ratio**, con un selettore Giorno / Settimana;
- la tabella dei campioni orari di Energia (kWh) e Irraggiamento (W/m²).

## Scelta della settimana

All'apertura si mostra l'ultima settimana (i 7 giorni fino ad adesso). Se in quel periodo il datalogger non ha registrato nulla, si ripiega sulla settimana più recente con dati disponibili e un avviso lo segnala.

Dal campo data si può scegliere un'altra settimana: vengono mostrati i 7 giorni interi a partire dalla data scelta. La scelta è salvata nell'URL (`/?week=2026-09-10`).

## Calcolo del KPI

```
PR [%] = E_real / E_module

E_module [kWh] = P_nom · Σ (Irr_j / Irr_std) · Δt_j
```

| Simbolo   | Significato                                                        |
| --------- | ------------------------------------------------------------------ |
| `E_real`  | differenza tra massimo e minimo nel giorno della variabile Energia |
| `P_nom`   | potenza nominale dell'impianto simulato, 4 kW                      |
| `Irr_j`   | j-esimo campione di irraggiamento, in W/m²                         |
| `Irr_std` | irraggiamento in condizioni di test standard, 1000 W/m²            |
| `Δt_j`    | differenza tra i timestamp dei campioni, in ore                    |

Scelte fatte nell'implementazione (`src/lib/kpi.ts`):

- **Giorni**: i campioni sono raggruppati per giorno nel fuso orario dell'impianto.
- **Δt**: è calcolato dai timestamp reali di due campioni consecutivi dello stesso giorno, non assunto pari a un'ora.
- **Settimana**: il PR settimanale è il rapporto tra la somma degli `E_real` e la somma degli `E_module` giornalieri, non la media dei PR giornalieri.

### Dati mancanti

- L'API segnala i valori non validi con stringhe (per esempio `"#E2"`): diventano valori mancanti.
- Un campione senza valore è escluso dalla serie corrispondente; il `Δt` successivo si allarga a coprire il buco.
- Se `E_module` è zero o i campioni non bastano, il PR è mostrato come "n.d." e il giorno è escluso dal totale settimanale.
- I giorni con buchi, valori mancanti o meno di 22 ore coperte sono marcati "Dati incompleti".

## Note sulle API

- **CORS**: tutte le chiamate partono dal server (React Server Components), quindi il browser non contatta mai il portale Higeco e l'errore "cross origin request blocked" non si presenta.
- **Timestamp**: `getLogData` usa timestamp "comprensivi dell'offset del fuso orario", cioè l'ora locale dell'impianto espressa come epoch. `src/lib/higeco.ts` converte `from`/`to` e i timestamp restituiti da e verso UTC.

## Comandi

```bash
bun run build        # build di produzione
bun start            # avvia la build
bun run lint         # eslint
bun run format       # prettier --write
bun run type-check   # tsc --noEmit
```

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind 3, Radix.

## Struttura

```
src/
├── app/
│   ├── layout.tsx       # layout radice: font, header, <main>
│   ├── globals.css      # variabili del tema
│   ├── page.tsx         # /  (legge ?week e avvia il caricamento)
│   ├── _home/           # componenti della pagina dell'esercizio
│   ├── api-docs/        # /api-docs
│   └── components/      # /components: catalogo dei componenti
│       ├── page.tsx
│       └── _docs/       # shell della pagina + una scheda per componente (entries/)
├── assets/              # loghi Higeco More
├── components/          # componenti base (Btn, Card, Modal, Field*, Text, …) + Header
├── hooks/               # use-mobile
└── lib/
    ├── higeco.ts        # client delle Web API Higeco (solo lato server)
    ├── kpi.ts           # calcolo del Performance Ratio
    └── utils/           # cn, emptyFn, getInitials, stringToColor
```

Componenti di `src/app/_home/`:

| File                                                | Ruolo                                             |
| --------------------------------------------------- | ------------------------------------------------- |
| `PhotovoltaicData.tsx`                              | carica i dati, calcola il KPI e compone la pagina |
| `InfoHeader.tsx`, `InfoCard.tsx`                    | card di Plant, Device e Log                       |
| `WeekSelector.tsx`, `WeekNavigation.tsx`            | scelta della settimana e stato di caricamento     |
| `MissingDataNotice.tsx`                             | avviso quando l'ultima settimana non ha dati      |
| `KpiPanel.tsx`, `KpiTotal.tsx`, `KpiDailyTable.tsx` | PR settimanale e giornaliero                      |
| `SamplesTable.tsx`                                  | tabella dei campioni orari                        |
| `HomeLoading.tsx`                                   | spinner di caricamento                            |
| `format.ts`                                         | formattazione di date e numeri                    |

Alias di import: `@/*` → `src/*`.

## Aggiungere una pagina

1. Crea `src/app/<nome>/page.tsx`.
2. Aggiungi la voce all'array `links` in `src/components/Header/Header.tsx`.

## Componenti

Ogni componente vive in una cartella propria con un `index.ts`:

```tsx
import Btn from "@/components/Btn";
import Text from "@/components/Text";
```

Esempi e props di ogni componente sono su `/components`. Quando aggiungi un componente, aggiungi anche la sua scheda al file della categoria in `src/app/components/_docs/entries/`.

`Toast` richiede di avvolgere l'albero con `<ToastProvider>` prima di usare `useToast()`.

## Tema

I colori sono variabili CSS definite in `src/app/globals.css` ed esposte come utility Tailwind (`bg-card`, `text-primary`, `border-border`, …) in `tailwind.config.ts`. Per cambiare la tinta primaria basta modificare `--color`: bordi e sfondi attenuati derivano da lì.
