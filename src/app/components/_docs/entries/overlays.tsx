"use client";

import * as React from "react";
import { IDocEntry, IDocProp, pClassName, pStyle } from "../types";
import Backdrop from "@/components/Backdrop";
import Btn from "@/components/Btn";
import FieldText from "@/components/FieldText";
import Modal from "@/components/Modal";
import Popover from "@/components/Popover";
import PopoverList from "@/components/PopoverList";
import Portal from "@/components/Portal";
import Text from "@/components/Text";

const pPopover: IDocProp[] = [
  {
    name: "open",
    type: "boolean",
    required: true,
    description: "Visibilità.",
  },
  {
    name: "onClose",
    type: "() => void",
    description: "Click all'esterno o tasto Esc.",
  },
  {
    name: "anchorEl",
    type: "HTMLElement",
    description: "Elemento a cui agganciarsi.",
  },
  {
    name: "anchorReference",
    type: `"anchorEl" | "anchorPosition"`,
    def: `"anchorEl"`,
    description: "Aggancio a un elemento oppure a coordinate.",
  },
  {
    name: "anchorPosition",
    type: "{ top: number; left: number }",
    description: 'Coordinate, con anchorReference="anchorPosition".',
  },
  {
    name: "originAnchor / originTransf",
    type: "PopoverOrigin",
    def: "auto / auto",
    description:
      "Punto dell'ancora e punto del popover da far coincidere; auto sceglie in base allo spazio disponibile.",
  },
  {
    name: "positionZone",
    type: "1 | 2 | 3 | 4",
    description: "Forza il quadrante dello schermo usato dal calcolo auto.",
  },
];

const overlays: IDocEntry[] = [
  {
    id: "modal",
    name: "Modal",
    description:
      "Finestra di dialogo centrata, con titolo, contenuto scorrevole e barra delle azioni. Si chiude con Esc o cliccando fuori.",
    importCode: `import Modal from "@/components/Modal";`,
    examples: [
      {
        title: "Dialogo con azioni",
        code: `const [open, setOpen] = React.useState(false);

<Btn variant="bold" label="Apri modale" onClick={() => setOpen(true)} />
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Rinomina elemento"
  titleClose
  content={<FieldText label="Nome" value="Senza titolo" />}
  actions={
    <>
      <Btn label="ANNULLA" onClick={() => setOpen(false)} />
      <Btn variant="bold" label="SALVA" onClick={() => setOpen(false)} />
    </>
  }
/>`,
        Demo: function ModalDemo() {
          const [open, setOpen] = React.useState(false);
          const close = () => setOpen(false);
          return (
            <>
              <Btn
                variant="bold"
                label="Apri modale"
                onClick={() => setOpen(true)}
              />
              <Modal
                open={open}
                onClose={close}
                title="Rinomina elemento"
                titleClose
                content={<FieldText label="Nome" value="Senza titolo" />}
                actions={
                  <>
                    <Btn label="ANNULLA" onClick={close} />
                    <Btn variant="bold" label="SALVA" onClick={close} />
                  </>
                }
              />
            </>
          );
        },
      },
      {
        title: "Stati di caricamento",
        description:
          "loading sostituisce tutto con uno spinner; actionsLoading solo la barra delle azioni.",
        code: `<Modal open={open} onClose={onClose} loading />
<Modal open={open} onClose={onClose} title="Salvataggio" content={…} actions={…} actionsLoading />`,
        Demo: function ModalLoadingDemo() {
          const [mode, setMode] = React.useState<"" | "loading" | "actions">(
            ""
          );
          const close = () => setMode("");
          return (
            <>
              <Btn label="loading" onClick={() => setMode("loading")} />
              <Btn label="actionsLoading" onClick={() => setMode("actions")} />
              <Modal open={mode === "loading"} onClose={close} loading />
              <Modal
                open={mode === "actions"}
                onClose={close}
                title="Salvataggio"
                titleClose
                content={<Text children="Le azioni sono in attesa." />}
                actions={<Btn label="CHIUDI" onClick={close} />}
                actionsLoading
              />
            </>
          );
        },
      },
      {
        title: "Schermo intero",
        code: `<Modal open={open} onClose={onClose} fullscreen title="A tutto schermo" titleClose content={…} />`,
        Demo: function ModalFullscreenDemo() {
          const [open, setOpen] = React.useState(false);
          return (
            <>
              <Btn
                label="Apri a schermo intero"
                onClick={() => setOpen(true)}
              />
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                fullscreen
                title="A tutto schermo"
                titleClose
                content={
                  <Text children="Occupa quasi tutta la finestra; su schermi piccoli la riempie." />
                }
              />
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
        description: "Visibilità.",
      },
      {
        name: "onClose",
        type: "() => void",
        required: true,
        description: "Richiesta di chiusura (Esc, click esterno, pulsante X).",
      },
      { name: "title", type: "string", description: "Titolo in alto." },
      {
        name: "titleClose",
        type: "boolean",
        description: "Mostra la X accanto al titolo.",
      },
      {
        name: "titleChildren",
        type: "React.ReactNode",
        description: "Contenuto extra nell'intestazione.",
      },
      {
        name: "content",
        type: "React.ReactNode",
        description: "Corpo, scorrevole in verticale.",
      },
      {
        name: "actions",
        type: "React.ReactNode",
        description: "Pulsanti nella barra in basso.",
      },
      {
        name: "loading",
        type: "boolean",
        description: "Mostra solo uno spinner.",
      },
      {
        name: "actionsLoading",
        type: "boolean",
        description: 'Sostituisce le azioni con "Aggiornamento...".',
      },
      {
        name: "fullscreen",
        type: "boolean",
        description: "Occupa tutta la finestra.",
      },
      {
        name: "popover",
        type: "boolean",
        description:
          "Modalità usata da Popover: sfondo trasparente, nessun padding.",
      },
      {
        name: "contentClassName / actionsClassName",
        type: "string",
        description: "Classi per corpo e barra azioni (esistono i *Style).",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "popover",
    name: "Popover",
    description:
      "Pannello flottante agganciato a un elemento o a un punto dello schermo, con contenuto libero.",
    importCode: `import Popover from "@/components/Popover";`,
    examples: [
      {
        title: "Agganciato a un elemento",
        code: `const [anchorEl, setAnchorEl] = React.useState(null);
const [open, setOpen] = React.useState(false);

<div ref={setAnchorEl}>
  <Btn label="Apri popover" onClick={() => setOpen(true)} />
</div>
<Popover open={open} anchorEl={anchorEl} onClose={() => setOpen(false)}>
  <div className="p-3"><Text>Contenuto libero</Text></div>
</Popover>`,
        Demo: function PopoverDemo() {
          const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(
            null
          );
          const [open, setOpen] = React.useState(false);
          return (
            <>
              <div ref={setAnchorEl}>
                <Btn
                  label="Apri popover"
                  selected={open}
                  onClick={() => setOpen(true)}
                />
              </div>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setOpen(false)}
              >
                <div className="flex max-w-[240px] flex-col gap-1 p-3">
                  <Text weight="bolder" children="Contenuto libero" />
                  <Text
                    size={0}
                    className="text-muted-fg"
                    children="Clicca fuori o premi Esc per chiudere."
                  />
                </div>
              </Popover>
            </>
          );
        },
      },
    ],
    props: [
      ...pPopover,
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Contenuto del pannello.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "popover-list",
    name: "PopoverList",
    description:
      "Popover che contiene un elenco di azioni: è il menu usato da Btn (prop menu) e da FieldSelect.",
    importCode: `import PopoverList from "@/components/PopoverList";`,
    notes: [
      "Ogni voce chiude il menu al click, a meno di impostare disableClose sulla voce.",
    ],
    examples: [
      {
        title: "Menu contestuale",
        description: "Click destro nell'area per aprire il menu in quel punto.",
        code: `const [position, setPosition] = React.useState(null);

<div onContextMenu={e => { e.preventDefault(); setPosition({ top: e.clientY, left: e.clientX }); }}>
  Click destro qui
</div>
<PopoverList
  open={!!position}
  anchorReference="anchorPosition"
  anchorPosition={position}
  onClose={() => setPosition(null)}
  title="Azioni"
  actions={[
    { id: "open", label: "Apri", icon: "open_in_new", onClick },
    { id: "pin", label: "Resta aperto", icon: "lock", disableClose: true, onClick },
    { id: "del", label: "Elimina", icon: "delete", divider: true, onClick },
  ]}
/>`,
        Demo: function PopoverListDemo() {
          const [position, setPosition] = React.useState<{
            top: number;
            left: number;
          } | null>(null);
          const [last, setLast] = React.useState("—");
          const onClick = (id: string | number) => setLast(String(id));
          return (
            <>
              <div
                className="flex h-24 w-full max-w-[420px] items-center justify-center rounded border border-dashed border-border"
                onContextMenu={event => {
                  event.preventDefault();
                  setPosition({ top: event.clientY, left: event.clientX });
                }}
              >
                <Text
                  className="text-muted-fg"
                  children={`Click destro qui · ultima azione: ${last}`}
                />
              </div>
              <PopoverList
                open={!!position}
                anchorReference="anchorPosition"
                anchorPosition={position ?? undefined}
                onClose={() => setPosition(null)}
                title="Azioni"
                actions={[
                  { id: "open", label: "Apri", icon: "open_in_new", onClick },
                  {
                    id: "pin",
                    label: "Resta aperto",
                    icon: "lock",
                    disableClose: true,
                    onClick,
                  },
                  {
                    id: "del",
                    label: "Elimina",
                    icon: "delete",
                    divider: true,
                    onClick,
                  },
                ]}
              />
            </>
          );
        },
      },
    ],
    props: [
      {
        name: "actions",
        type: "IPopoverListItem[]",
        def: "[]",
        description:
          "Voci del menu: le props di ListItem più divider, hidden e disableClose.",
      },
      { name: "title", type: "string", description: "Titolo sopra le voci." },
      {
        name: "header / footer",
        type: "React.ReactNode",
        description: "Contenuto fisso sopra e sotto l'elenco.",
      },
      ...pPopover,
      pClassName,
      pStyle,
    ],
  },
  {
    id: "backdrop",
    name: "Backdrop",
    description:
      "Velo che copre la pagina e intercetta i click, per costruire overlay personalizzati.",
    importCode: `import Backdrop from "@/components/Backdrop";`,
    notes: [
      "Il velo è renderizzato nel body con position: absolute e senza z-index: se deve stare sopra ad altri elementi posizionati, passalo con className.",
    ],
    examples: [
      {
        title: "Visibile e invisibile",
        description: "Clicca il velo per chiuderlo.",
        code: `<Backdrop open={open} className="z-50" onClick={() => setOpen(false)} />
<Backdrop open={open} invisible onClick={() => setOpen(false)} />`,
        Demo: function BackdropDemo() {
          const [mode, setMode] = React.useState<"" | "dark" | "invisible">("");
          return (
            <>
              <Btn label="Apri velo scuro" onClick={() => setMode("dark")} />
              <Btn
                label="Apri velo invisibile"
                onClick={() => setMode("invisible")}
              />
              <Backdrop
                open={!!mode}
                invisible={mode === "invisible"}
                className="z-50"
                onClick={() => setMode("")}
              />
            </>
          );
        },
      },
    ],
    props: [
      { name: "open", type: "boolean", description: "Visibilità." },
      {
        name: "invisible",
        type: "boolean",
        description: "Velo trasparente: blocca i click senza scurire.",
      },
      {
        name: "onClick",
        type: "(event) => void",
        description: "Click (anche destro) sul velo.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "portal",
    name: "Portal",
    description:
      "Renderizza i figli fuori dalla gerarchia del componente, in fondo al body (o in un nodo a scelta). Utile per sfuggire a overflow e z-index dei contenitori.",
    importCode: `import Portal from "@/components/Portal";`,
    notes: [
      "Il contenuto compare solo dopo il primo render lato client, per non rompere l'hydration.",
    ],
    examples: [
      {
        title: "Fuori dal contenitore",
        description:
          "Il riquadro è dichiarato qui ma viene montato nel body, in basso a sinistra.",
        code: `{open && (
  <Portal>
    <div className="fixed bottom-6 left-6 z-50 rounded bg-fg px-3 py-2">
      <Text className="text-bg">Sono nel body</Text>
    </div>
  </Portal>
)}`,
        Demo: function PortalDemo() {
          const [open, setOpen] = React.useState(false);
          return (
            <>
              <Btn
                label={open ? "Smonta" : "Monta nel body"}
                selected={open}
                onClick={() => setOpen(prev => !prev)}
              />
              {open && (
                <Portal>
                  <div className="fixed bottom-6 left-6 z-50 rounded bg-fg px-3 py-2 shadow-lg">
                    <Text className="text-bg" children="Sono nel body" />
                  </div>
                </Portal>
              )}
            </>
          );
        },
      },
    ],
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Contenuto da spostare.",
      },
      {
        name: "node",
        type: "HTMLElement",
        def: "#app, #root o body",
        description: "Nodo di destinazione.",
      },
    ],
  },
];

export default overlays;
