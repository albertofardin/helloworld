"use client";

import * as React from "react";
import { IDocEntry, pClassName, pStyle } from "../types";
import Btn from "@/components/Btn";
import CircularProgress from "@/components/CircularProgress";
import Skeleton from "@/components/Skeleton";
import Text from "@/components/Text";
import { useToast } from "@/components/Toast";
import Tooltip from "@/components/Tooltip";

const feedback: IDocEntry[] = [
  {
    id: "circular-progress",
    name: "CircularProgress",
    description:
      "Indicatore circolare: rotante quando la durata è ignota, a percentuale quando il progresso è noto.",
    importCode: `import CircularProgress from "@/components/CircularProgress";`,
    examples: [
      {
        title: "Indeterminato",
        previewClassName: "gap-5",
        code: `<CircularProgress />
<CircularProgress size={24} thickness={10} />
<CircularProgress color="var(--info)" />`,
        Demo: () => (
          <>
            <CircularProgress />
            <CircularProgress size={24} thickness={10} />
            <CircularProgress color="var(--info)" />
          </>
        ),
      },
      {
        title: "Determinato",
        description: "value va da 0 a 100; il cambio è animato.",
        previewClassName: "gap-5",
        code: `const [value, setValue] = React.useState(40);

<CircularProgress variant="determinate" value={value} />
<Btn icon="remove" onClick={() => setValue(Math.max(0, value - 20))} />
<Btn icon="add" onClick={() => setValue(Math.min(100, value + 20))} />`,
        Demo: function ProgressDemo() {
          const [value, setValue] = React.useState(40);
          return (
            <>
              <CircularProgress variant="determinate" value={value} />
              <Btn
                icon="remove"
                onClick={() => setValue(prev => Math.max(0, prev - 20))}
              />
              <Text weight="bolder" children={`${value}%`} />
              <Btn
                icon="add"
                onClick={() => setValue(prev => Math.min(100, prev + 20))}
              />
            </>
          );
        },
      },
    ],
    props: [
      {
        name: "variant",
        type: `"determinate" | "indeterminate"`,
        def: `"indeterminate"`,
        description: "Rotazione continua oppure percentuale.",
      },
      {
        name: "value",
        type: "number",
        def: "0",
        description: "Percentuale 0–100, solo per determinate.",
      },
      {
        name: "size",
        type: "number",
        def: "50",
        description: "Diametro in pixel.",
      },
      {
        name: "thickness",
        type: "number",
        def: "6",
        description: "Spessore del tratto.",
      },
      {
        name: "color",
        type: "string",
        def: "var(--primary)",
        description: "Colore del tratto.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    description:
      "Segnaposto pulsante da mostrare al posto del contenuto mentre si carica. Forma e dimensione si danno con className.",
    importCode: `import Skeleton from "@/components/Skeleton";`,
    examples: [
      {
        title: "Scheda in caricamento",
        code: `<Skeleton className="h-12 w-12 rounded-full" />
<div className="flex flex-col gap-2">
  <Skeleton className="h-4 w-[200px]" />
  <Skeleton className="h-4 w-[140px]" />
</div>`,
        Demo: () => (
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[140px]" />
            </div>
          </>
        ),
      },
    ],
    props: [pClassName, pStyle],
  },
  {
    id: "toast",
    name: "Toast",
    description:
      "Notifiche temporanee in basso a destra, che spariscono da sole. Si mostrano da qualsiasi componente con l'hook useToast.",
    importCode: `import ToastProvider, { useToast } from "@/components/Toast";`,
    notes: [
      "useToast funziona solo sotto un <ToastProvider>: avvolgi una volta l'albero (di solito nel layout) e poi chiama showToast dove serve.",
    ],
    examples: [
      {
        title: "Varianti",
        code: `// una volta, in alto nell'albero
<ToastProvider>{children}</ToastProvider>

// in un componente
const { showToast } = useToast();

showToast({ message: "Modifiche salvate" });
showToast({ variant: "error", message: "Salvataggio fallito" });
showToast({ variant: "info", message: "Aggiornamento disponibile", duration: 8000 });`,
        Demo: function ToastDemo() {
          const { showToast } = useToast();
          return (
            <>
              <Btn
                label="Success"
                color="var(--succ)"
                onClick={() => showToast({ message: "Modifiche salvate" })}
              />
              <Btn
                label="Error"
                color="var(--fail)"
                onClick={() =>
                  showToast({
                    variant: "error",
                    message: "Salvataggio fallito",
                  })
                }
              />
              <Btn
                label="Info"
                color="var(--info)"
                onClick={() =>
                  showToast({
                    variant: "info",
                    message: "Aggiornamento disponibile",
                  })
                }
              />
              <Btn
                label="Warning"
                onClick={() =>
                  showToast({
                    variant: "warning",
                    message: "Spazio quasi esaurito",
                  })
                }
              />
            </>
          );
        },
      },
    ],
    props: [
      {
        name: "message",
        type: "string",
        required: true,
        description: "Testo della notifica (opzione di showToast).",
      },
      {
        name: "variant",
        type: `"success" | "error" | "info" | "warning"`,
        def: `"success"`,
        description: "Colore e icona.",
      },
      {
        name: "duration",
        type: "number",
        def: "4000",
        description: "Millisecondi prima della chiusura automatica.",
      },
    ],
  },
  {
    id: "tooltip",
    name: "Tooltip",
    description:
      "Etichetta che compare al passaggio del mouse. Btn, BtnBase, Badge e Avatar la espongono già con la prop tooltip.",
    importCode: `import Tooltip from "@/components/Tooltip";`,
    notes: [
      "Su mobile il tooltip non viene mostrato. Il figlio deve essere un singolo elemento in grado di ricevere un ref.",
    ],
    examples: [
      {
        title: "Posizione e contenuto",
        previewClassName: "gap-6",
        code: `<Tooltip title="In alto"><span>top</span></Tooltip>
<Tooltip title="A destra" place="right"><span>right</span></Tooltip>
<Tooltip title={["Prima riga", "Seconda riga"]} place="bottom"><span>più righe</span></Tooltip>
<Tooltip title="Sempre visibile" open><span>open</span></Tooltip>`,
        Demo: () => (
          <>
            {(["top", "right", "bottom", "left"] as const).map(place => (
              <Tooltip key={place} title={`Tooltip ${place}`} place={place}>
                <span className="cursor-default rounded border border-solid border-border px-3 py-2 text-sm text-fg">
                  {place}
                </span>
              </Tooltip>
            ))}
            <Tooltip title={["Prima riga", "Seconda riga"]} place="bottom">
              <span className="cursor-default rounded border border-solid border-border px-3 py-2 text-sm text-fg">
                più righe
              </span>
            </Tooltip>
          </>
        ),
      },
    ],
    props: [
      {
        name: "title",
        type: "string | string[] | ReactElement",
        description:
          "Contenuto; un array va a capo a ogni voce. Senza title si renderizza solo il figlio.",
      },
      {
        name: "place",
        type: `"top" | "bottom" | "left" | "right"`,
        def: `"top"`,
        description: "Lato su cui compare.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Forza il tooltip aperto o chiuso.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Elemento a cui il tooltip è agganciato.",
      },
    ],
  },
];

export default feedback;
