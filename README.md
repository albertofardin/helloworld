# Hello World

Progetto Next.js minimale con una pagina iniziale, un header di navigazione, una libreria di componenti base e la relativa pagina di documentazione (`/components`).

## Requisiti

- Node ≥ 24
- [Bun](https://bun.sh)

## Avvio

```bash
bun install
bun dev          # http://localhost:3000
```

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
│   ├── page.tsx         # /
│   └── components/      # /components: catalogo e documentazione dei componenti
│       ├── page.tsx
│       └── _docs/       # shell della pagina + una scheda per componente (entries/)
├── components/          # componenti base (Btn, Card, Modal, Field*, Text, …) + Header
├── hooks/               # use-mobile
└── lib/utils/           # cn, emptyFn, getInitials, stringToColor
```

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
