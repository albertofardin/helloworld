"use client";

import * as React from "react";
import { IDocEntry, pClassName, pStyle } from "../types";
import Btn from "@/components/Btn";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Text from "@/components/Text";
import Toolbar from "@/components/Toolbar";
import { Collapse, Slide, Zoom } from "@/components/Transitions";

const noop = () => null;

const layout: IDocEntry[] = [
  {
    id: "header",
    name: "Header",
    description:
      "Barra di navigazione dell'applicazione, montata una volta nel layout radice. Evidenzia da sola il link della pagina corrente.",
    importCode: `import Header from "@/components/Header";`,
    notes: [
      "Non ha props: per aggiungere una pagina al menu modifica l'array links in src/components/Header/Header.tsx.",
    ],
    examples: [
      {
        title: "Barra di navigazione",
        previewClassName: "p-0",
        code: `<Header />`,
        Demo: () => <Header />,
      },
    ],
    props: [],
  },
  {
    id: "toolbar",
    name: "Toolbar",
    description:
      "Riga orizzontale alta 50px per titoli e azioni, da mettere in cima a pannelli e schede.",
    importCode: `import Toolbar from "@/components/Toolbar";`,
    examples: [
      {
        title: "Titolo e azioni",
        previewClassName: "flex-col items-stretch",
        code: `<Card className="block">
  <Toolbar className="gap-1">
    <Text weight="bolder" className="flex-1">Documenti</Text>
    <Btn icon="search" tooltip="Cerca" onClick={onClick} />
    <Btn icon="add" tooltip="Nuovo" onClick={onClick} />
  </Toolbar>
</Card>`,
        Demo: () => (
          <Card className="block overflow-hidden">
            <Toolbar className="gap-1">
              <Text weight="bolder" className="flex-1" children="Documenti" />
              <Btn icon="search" tooltip="Cerca" onClick={noop} />
              <Btn icon="add" tooltip="Nuovo" onClick={noop} />
            </Toolbar>
          </Card>
        ),
      },
    ],
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "Contenuto, disposto in riga.",
      },
      {
        name: "onClick",
        type: "() => void",
        description: "Rende cliccabile l'intera barra.",
      },
      {
        name: "onMouseEnter / onMouseLeave",
        type: "() => void",
        description: "Eventi del mouse.",
      },
      {
        name: "color",
        type: "string",
        description: "Colore del ripple quando è cliccabile.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "transitions",
    name: "Transitions",
    description:
      "Tre animazioni di ingresso e uscita pilotate dalla prop open: Collapse (altezza), Zoom (scala) e Slide (scorrimento).",
    importCode: `import { Collapse, Zoom, Slide } from "@/components/Transitions";`,
    notes: [
      "Di default i figli vengono smontati a fine uscita (unmountOnExit): passa false per tenerli nel DOM.",
      "Slide è posizionato in assoluto ed eredita larghezza e altezza: il contenitore deve essere relative, con dimensioni esplicite e overflow nascosto.",
    ],
    examples: [
      {
        title: "Collapse",
        previewClassName: "flex-col items-start",
        code: `<Btn label="Apri / chiudi" onClick={() => setOpen(!open)} />
<Collapse open={open}>
  <Card className="p-4"><Text>Contenuto a scomparsa</Text></Card>
</Collapse>`,
        Demo: function CollapseDemo() {
          const [open, setOpen] = React.useState(true);
          return (
            <>
              <Btn
                label="Apri / chiudi"
                onClick={() => setOpen(prev => !prev)}
              />
              <Collapse open={open}>
                <Card className="p-4">
                  <Text children="Contenuto a scomparsa" />
                </Card>
              </Collapse>
            </>
          );
        },
      },
      {
        title: "Zoom",
        previewClassName: "min-h-[96px]",
        code: `<Btn label="Apri / chiudi" onClick={() => setOpen(!open)} />
<Zoom open={open} timeout={300}>
  <Card className="p-4"><Text>Zoom</Text></Card>
</Zoom>`,
        Demo: function ZoomDemo() {
          const [open, setOpen] = React.useState(true);
          return (
            <>
              <Btn
                label="Apri / chiudi"
                onClick={() => setOpen(prev => !prev)}
              />
              <Zoom open={open} timeout={300}>
                <Card className="p-4">
                  <Text children="Zoom" />
                </Card>
              </Zoom>
            </>
          );
        },
      },
      {
        title: "Slide",
        description: "direction indica il verso del movimento in ingresso.",
        code: `<div className="relative h-24 w-[260px] overflow-hidden rounded border">
  <Slide open={open} direction="right">
    <div className="flex h-full items-center justify-center bg-muted-bg">
      <Text>Slide</Text>
    </div>
  </Slide>
</div>`,
        Demo: function SlideDemo() {
          const [open, setOpen] = React.useState(true);
          const [direction, setDirection] = React.useState<
            "top" | "bottom" | "left" | "right"
          >("right");
          return (
            <>
              <Btn
                label="Apri / chiudi"
                onClick={() => setOpen(prev => !prev)}
              />
              {(["right", "left", "top", "bottom"] as const).map(d => (
                <Btn
                  key={d}
                  small
                  label={d}
                  selected={direction === d}
                  onClick={() => setDirection(d)}
                />
              ))}
              <div className="relative h-24 w-[260px] overflow-hidden rounded border border-solid border-border">
                <Slide open={open} direction={direction}>
                  <div className="flex h-full items-center justify-center bg-muted-bg">
                    <Text children={`Slide ${direction}`} />
                  </div>
                </Slide>
              </div>
            </>
          );
        },
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        required: true,
        description: "Stato visibile o nascosto.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Contenuto animato.",
      },
      {
        name: "timeout",
        type: "number",
        def: "250",
        description: "Durata dell'animazione in ms.",
      },
      {
        name: "direction",
        type: `"top" | "bottom" | "left" | "right"`,
        def: `"right"`,
        description: "Solo Slide: verso del movimento.",
      },
      {
        name: "unmountOnExit",
        type: "boolean",
        def: "true",
        description: "Smonta i figli a fine uscita.",
      },
      {
        name: "onEnter / onEntered",
        type: "() => void",
        description: "Inizio e fine dell'ingresso.",
      },
      {
        name: "onExit / onExited",
        type: "() => void",
        description: "Inizio e fine dell'uscita.",
      },
      pClassName,
      pStyle,
    ],
  },
];

export default layout;
