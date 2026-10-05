"use client";

import * as React from "react";
import { IDocEntry, pClassName, pStyle } from "../types";
import Btn from "@/components/Btn";
import BtnBase from "@/components/BtnBase";
import BtnCheckbox from "@/components/BtnCheckbox";
import BtnLink from "@/components/BtnLink";
import Checkbox, { SelectType } from "@/components/Checkbox";
import Text from "@/components/Text";
import { useToast } from "@/components/Toast";

const noop = () => null;

const buttons: IDocEntry[] = [
  {
    id: "btn",
    name: "Btn",
    description:
      "Il pulsante standard: etichetta, icona, avatar, menu a tendina, badge di notifica e copia negli appunti in un unico componente.",
    importCode: `import Btn from "@/components/Btn";`,
    notes: [
      "Senza onClick, menu o copyToClipboard il pulsante è inerte e viene mostrato in grigio: è così che appare anche quando è disabled.",
    ],
    examples: [
      {
        title: "Varianti",
        description: `"light" è trasparente con bordo all'hover, "bold" è pieno.`,
        code: `<Btn label="Light" onClick={onClick} />
<Btn variant="bold" label="Bold" onClick={onClick} />
<Btn variant="bold" color="var(--primary)" label="Primario" onClick={onClick} />
<Btn color="var(--succ)" label="Colore" onClick={onClick} />`,
        Demo: () => (
          <>
            <Btn label="Light" onClick={noop} />
            <Btn variant="bold" label="Bold" onClick={noop} />
            <Btn
              variant="bold"
              color="var(--primary)"
              label="Primario"
              onClick={noop}
            />
            <Btn color="var(--succ)" label="Colore" onClick={noop} />
          </>
        ),
      },
      {
        title: "Icona ed etichetta",
        description: "labelPosition sposta l'etichetta prima dell'icona.",
        code: `<Btn icon="add" label="Aggiungi" onClick={onClick} />
<Btn icon="arrow_forward" label="Avanti" labelPosition onClick={onClick} />
<Btn icon="edit" tooltip="Modifica" onClick={onClick} />
<Btn variant="bold" icon="delete" color="var(--fail)" onClick={onClick} />`,
        Demo: () => (
          <>
            <Btn icon="add" label="Aggiungi" onClick={noop} />
            <Btn
              icon="arrow_forward"
              label="Avanti"
              labelPosition
              onClick={noop}
            />
            <Btn icon="edit" tooltip="Modifica" onClick={noop} />
            <Btn
              variant="bold"
              icon="delete"
              color="var(--fail)"
              tooltip="Elimina"
              onClick={noop}
            />
          </>
        ),
      },
      {
        title: "Dimensione e stati",
        code: `<Btn small icon="edit" label="Small" onClick={onClick} />
<Btn label="Selezionato" selected onClick={onClick} />
<Btn label="Disabilitato" disabled onClick={onClick} />
<Btn icon="bell" badge tooltip="Notifiche" onClick={onClick} />
<Btn label="Campo" labelRequired onClick={onClick} />`,
        Demo: () => (
          <>
            <Btn small icon="edit" label="Small" onClick={noop} />
            <Btn label="Selezionato" selected onClick={noop} />
            <Btn label="Disabilitato" disabled onClick={noop} />
            <Btn icon="bell" badge tooltip="Notifiche" onClick={noop} />
            <Btn label="Campo" labelRequired onClick={noop} />
          </>
        ),
      },
      {
        title: "Avatar",
        code: `<Btn avatarText="AF" label="Alberto" onClick={onClick} />
<Btn avatarIcon="person" tooltip="Profilo" onClick={onClick} />`,
        Demo: () => (
          <>
            <Btn avatarText="AF" label="Alberto" onClick={noop} />
            <Btn avatarIcon="person" tooltip="Profilo" onClick={noop} />
          </>
        ),
      },
      {
        title: "Menu",
        description:
          "menu apre un PopoverList ancorato al pulsante; ogni voce è un ListItem.",
        code: `<Btn
  label="Azioni"
  menu={{
    icon: true,
    title: "Documento",
    items: [
      { id: "edit", label: "Modifica", icon: "edit", onClick },
      { id: "copy", label: "Duplica", icon: "file_copy", onClick },
      { id: "del", label: "Elimina", icon: "delete", divider: true, onClick },
    ],
  }}
/>`,
        Demo: function BtnMenuDemo() {
          const { showToast } = useToast();
          const onClick = (id: string | number) =>
            showToast({ variant: "info", message: `Voce scelta: ${id}` });
          return (
            <Btn
              label="Azioni"
              menu={{
                icon: true,
                title: "Documento",
                items: [
                  { id: "edit", label: "Modifica", icon: "edit", onClick },
                  { id: "copy", label: "Duplica", icon: "file_copy", onClick },
                  {
                    id: "del",
                    label: "Elimina",
                    icon: "delete",
                    divider: true,
                    onClick,
                  },
                ],
              }}
            />
          );
        },
      },
      {
        title: "Copia negli appunti",
        code: `<Btn
  icon="file_copy"
  label="Copia codice"
  copyToClipboard="ABC-123"
  onCopyToClipboard={text => showToast({ message: \`Copiato \${text}\` })}
/>`,
        Demo: function BtnCopyDemo() {
          const { showToast } = useToast();
          return (
            <Btn
              icon="file_copy"
              label="Copia codice"
              copyToClipboard="ABC-123"
              onCopyToClipboard={text =>
                showToast({ message: `Copiato ${text}` })
              }
            />
          );
        },
      },
    ],
    props: [
      {
        name: "variant",
        type: `"light" | "bold"`,
        def: `"light"`,
        description: "Stile trasparente o pieno.",
      },
      {
        name: "color",
        type: "string",
        def: "var(--button)",
        description: "Colore di bordo, riempimento e ripple.",
      },
      {
        name: "label",
        type: "string | ReactElement",
        description: "Etichetta del pulsante.",
      },
      {
        name: "labelSize",
        type: "TextSize",
        def: "1",
        description: "Dimensione dell'etichetta.",
      },
      {
        name: "labelPosition",
        type: "boolean",
        description: "Se true l'etichetta precede icona e avatar.",
      },
      {
        name: "labelRequired",
        type: "boolean",
        description: "Aggiunge l'asterisco rosso all'etichetta.",
      },
      {
        name: "icon",
        type: "string",
        description: "Nome dell'icona (vedi Icon).",
      },
      {
        name: "avatar / avatarText / avatarIcon",
        type: "string",
        description: "Mostra un Avatar tondo: immagine, testo o icona.",
      },
      {
        name: "onClick",
        type: "(event) => void",
        description: "Click; rende il pulsante attivo.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disattiva il click e ingrigisce il contenuto.",
      },
      {
        name: "selected",
        type: "boolean",
        description: "Stato selezionato (bordo e sfondo tenue).",
      },
      {
        name: "small",
        type: "boolean",
        description: "Altezza 28px invece di 40px.",
      },
      {
        name: "badge / badgeColor",
        type: "boolean / string",
        def: "— / var(--fail)",
        description: "Pallino di notifica in alto a destra.",
      },
      {
        name: "menu",
        type: "{ items, icon?, title?, onClose?, originAnchor?, originTransf? }",
        description:
          "Apre un menu al click. icon mostra la freccia, items sono IPopoverListItem.",
      },
      {
        name: "copyToClipboard",
        type: "string",
        description: "Testo copiato negli appunti al click.",
      },
      {
        name: "onCopyToClipboard",
        type: "(text: string) => void",
        description: "Chiamata dopo la copia.",
      },
      {
        name: "tooltip / tooltipPlace / tooltipOpen",
        type: "string | string[] / side / boolean",
        description: "Tooltip, posizione e apertura forzata.",
      },
      {
        name: "onMouseEnter / onMouseLeave",
        type: "(event) => void",
        description: "Ignorati su mobile.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Contenuto extra in coda al pulsante.",
      },
      {
        name: "iconClassName / labelClassName / avatarClassName",
        type: "string",
        description: "Classi per le singole parti (esistono anche i *Style).",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "btn-link",
    name: "BtnLink",
    description:
      "Link di navigazione (next/link) con l'aspetto di Btn. È quello usato nell'Header.",
    importCode: `import BtnLink from "@/components/BtnLink";`,
    examples: [
      {
        title: "Link",
        code: `<BtnLink href="/" label="Home" icon="home" />
<BtnLink href="/components" label="Selezionato" selected />
<BtnLink href="/" variant="bold" label="Bold" />
<BtnLink href="/" small label="Small" />`,
        Demo: () => (
          <>
            <BtnLink href="/" label="Home" icon="home" />
            <BtnLink href="/components" label="Selezionato" selected />
            <BtnLink href="/" variant="bold" label="Bold" />
            <BtnLink href="/" small label="Small" />
          </>
        ),
      },
    ],
    props: [
      {
        name: "href",
        type: "string",
        required: true,
        description: "Destinazione del link.",
      },
      {
        name: "variant",
        type: `"light" | "bold"`,
        def: `"light"`,
        description: "Come in Btn.",
      },
      {
        name: "color",
        type: "string",
        def: "var(--button)",
        description: "Colore di bordo e riempimento.",
      },
      {
        name: "label / labelSize / labelPosition",
        type: "come Btn",
        description: "Etichetta, dimensione e posizione.",
      },
      { name: "icon", type: "string", description: "Nome dell'icona." },
      {
        name: "selected",
        type: "boolean",
        description: "Evidenzia il link della pagina corrente.",
      },
      { name: "small", type: "boolean", description: "Altezza 28px." },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "btn-checkbox",
    name: "BtnCheckbox",
    description:
      "Riga cliccabile con Checkbox ed etichetta. È il modo normale di mostrare una spunta o un radio in un form.",
    importCode: `import BtnCheckbox from "@/components/BtnCheckbox";
import { SelectType } from "@/components/Checkbox";`,
    examples: [
      {
        title: "Spunta",
        description:
          "Il componente è controllato: onClick riceve il nuovo valore.",
        code: `const [checked, setChecked] = React.useState(true);

<BtnCheckbox label="Ricevi notifiche" selected={checked} onClick={setChecked} />
<BtnCheckbox label="Disabilitato" selected disabled />`,
        Demo: function BtnCheckboxDemo() {
          const [checked, setChecked] = React.useState(true);
          return (
            <>
              <BtnCheckbox
                label="Ricevi notifiche"
                selected={checked}
                onClick={setChecked}
              />
              <BtnCheckbox label="Disabilitato" selected disabled />
            </>
          );
        },
      },
      {
        title: "Gruppo radio",
        code: `const [plan, setPlan] = React.useState("base");

{["base", "pro", "team"].map(id => (
  <BtnCheckbox
    key={id}
    label={id}
    checkboxType={SelectType.RADIO}
    selected={plan === id}
    onClick={() => setPlan(id)}
  />
))}`,
        Demo: function BtnRadioDemo() {
          const [plan, setPlan] = React.useState("base");
          return (
            <>
              {["base", "pro", "team"].map(id => (
                <BtnCheckbox
                  key={id}
                  label={id}
                  checkboxType={SelectType.RADIO}
                  selected={plan === id}
                  onClick={() => setPlan(id)}
                />
              ))}
            </>
          );
        },
      },
      {
        title: "Contenuto condizionale",
        description: "I children compaiono solo quando la voce è selezionata.",
        code: `<BtnCheckbox label="Opzioni avanzate" selected={open} onClick={setOpen}>
  <Text size={0} className="ml-2 text-muted-fg">attive</Text>
</BtnCheckbox>`,
        Demo: function BtnCheckboxChildrenDemo() {
          const [open, setOpen] = React.useState(false);
          return (
            <BtnCheckbox
              label="Opzioni avanzate"
              color="var(--info)"
              selected={open}
              onClick={setOpen}
            >
              <Text size={0} className="ml-2 text-muted-fg" children="attive" />
            </BtnCheckbox>
          );
        },
      },
    ],
    props: [
      {
        name: "label",
        type: "string | ReactElement",
        required: true,
        description: "Etichetta accanto alla spunta.",
      },
      {
        name: "selected",
        type: "boolean",
        description: "Stato della spunta.",
      },
      {
        name: "onClick",
        type: "(newCheck: boolean) => void",
        description: "Riceve il valore invertito.",
      },
      {
        name: "checkboxType",
        type: "SelectType",
        def: "SelectType.CHECK",
        description: "CHECK, RADIO oppure NONE.",
      },
      {
        name: "color",
        type: "string",
        def: "var(--primary)",
        description: "Colore di spunta, testo e bordo all'hover.",
      },
      { name: "disabled", type: "boolean", description: "Blocca il click." },
      {
        name: "tooltip",
        type: "string | string[]",
        description: "Tooltip sulla riga.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Mostrati solo se selected è true.",
      },
      {
        name: "checkboxClassName / labelClassName",
        type: "string",
        description: "Classi per le singole parti (esistono anche i *Style).",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description:
      "Solo l'indicatore visivo di spunta o radio, senza gestione del click. Per un controllo interattivo usa BtnCheckbox.",
    importCode: `import Checkbox, { SelectType } from "@/components/Checkbox";`,
    examples: [
      {
        title: "Tipi e stati",
        previewClassName: "gap-5",
        code: `<Checkbox type={SelectType.CHECK} />
<Checkbox type={SelectType.CHECK} selected />
<Checkbox type={SelectType.RADIO} />
<Checkbox type={SelectType.RADIO} selected />
<Checkbox type={SelectType.CHECK} selected disabled />
<Checkbox type={SelectType.CHECK} selected color="var(--succ)" size={24} />`,
        Demo: () => (
          <>
            <Checkbox type={SelectType.CHECK} />
            <Checkbox type={SelectType.CHECK} selected />
            <Checkbox type={SelectType.RADIO} />
            <Checkbox type={SelectType.RADIO} selected />
            <Checkbox type={SelectType.CHECK} selected disabled />
            <Checkbox
              type={SelectType.CHECK}
              selected
              color="var(--succ)"
              size={24}
            />
          </>
        ),
      },
    ],
    props: [
      {
        name: "type",
        type: "SelectType",
        required: true,
        description: "CHECK, RADIO oppure NONE (non renderizza nulla).",
      },
      { name: "selected", type: "boolean", description: "Stato attivo." },
      {
        name: "size",
        type: "number",
        def: "16",
        description: "Lato in pixel.",
      },
      {
        name: "color",
        type: "string",
        def: "var(--primary)",
        description: "Colore quando selezionato.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Aspetto attenuato.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "btn-base",
    name: "BtnBase",
    description:
      "La primitiva cliccabile su cui sono costruiti Btn, Card, Badge, ListItem e Toolbar. Aggiunge ripple, tooltip, doppio click, pressione prolungata e copia negli appunti a un <div>.",
    importCode: `import BtnBase from "@/components/BtnBase";`,
    notes: [
      'Senza onClick né onDoubleClick l\'elemento è considerato disabilitato: niente ripple e role="presentation".',
      "Il click non si propaga ai genitori, a meno di passare clickPropagation.",
    ],
    examples: [
      {
        title: "Click, doppio click e modificatori",
        description:
          "Il secondo argomento di onClick dice se erano premuti Ctrl/Cmd o Shift.",
        code: `<BtnBase
  className="rounded border border-border p-4"
  clickExclusive
  onClick={(event, keyDown) => setLast(keyDown.keyDownCtrl ? "Ctrl+click" : "Click")}
  onDoubleClick={() => setLast("Doppio click")}
>
  <Text>{last}</Text>
</BtnBase>`,
        Demo: function BtnBaseDemo() {
          const [last, setLast] = React.useState("Clicca qui");
          return (
            <BtnBase
              className="rounded border border-solid border-border p-4"
              clickExclusive
              onClick={(_event, keyDown) =>
                setLast(
                  keyDown.keyDownCtrl
                    ? "Ctrl+click"
                    : keyDown.keyDownMeta
                      ? "Shift+click"
                      : "Click"
                )
              }
              onDoubleClick={() => setLast("Doppio click")}
            >
              <Text children={last} />
            </BtnBase>
          );
        },
      },
      {
        title: "Colore del ripple e tooltip",
        code: `<BtnBase
  color="var(--info)"
  tooltip={["Prima riga", "Seconda riga"]}
  tooltipPlace="bottom"
  className="rounded border border-border p-4"
  onClick={onClick}
>
  <Text>Ripple blu</Text>
</BtnBase>`,
        Demo: () => (
          <BtnBase
            color="var(--info)"
            tooltip={["Prima riga", "Seconda riga"]}
            tooltipPlace="bottom"
            className="rounded border border-solid border-border p-4"
            onClick={noop}
          >
            <Text children="Ripple blu" />
          </BtnBase>
        ),
      },
    ],
    props: [
      {
        name: "onClick",
        type: "(event, keyDown: IKeyDown) => void",
        description:
          "Click singolo. keyDown contiene isMobile, keyDownCtrl e keyDownMeta.",
      },
      {
        name: "onDoubleClick",
        type: "(event, keyDown: IKeyDown) => void",
        description: "Doppio click.",
      },
      {
        name: "clickExclusive",
        type: "boolean",
        def: "false",
        description:
          "Ritarda il click singolo per non farlo scattare insieme al doppio click.",
      },
      {
        name: "clickElapsed",
        type: "number",
        def: "350",
        description: "Attesa in ms usata da clickExclusive.",
      },
      {
        name: "clickPropagation",
        type: "boolean",
        def: "false",
        description: "Lascia propagare il click ai genitori.",
      },
      {
        name: "onContextMenu",
        type: "(event) => void",
        description: "Click destro (ignorato su mobile).",
      },
      {
        name: "onLongPress",
        type: "(event: TouchEvent) => void",
        description: "Tocco tenuto per 500ms.",
      },
      {
        name: "onMouseEnter / onMouseLeave / onMouseMove",
        type: "(event) => void",
        description: "Eventi del mouse.",
      },
      {
        name: "color",
        type: "string",
        def: "var(--primary)",
        description: "Colore del ripple.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disattiva click e ripple.",
      },
      {
        name: "disabledRipple",
        type: "boolean",
        description: "Toglie solo l'effetto ripple.",
      },
      {
        name: "tooltip",
        type: "string | string[] | ReactElement",
        description: "Contenuto del tooltip; un array va a capo a ogni voce.",
      },
      {
        name: "tooltipPlace",
        type: `"top" | "bottom" | "left" | "right"`,
        def: `"top"`,
        description: "Lato del tooltip.",
      },
      {
        name: "tooltipOpen",
        type: "boolean",
        description: "Forza il tooltip aperto o chiuso.",
      },
      {
        name: "copyToClipboard / onCopyToClipboard",
        type: "string / (text) => void",
        description: "Copia un testo negli appunti al click.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Contenuto.",
      },
      pClassName,
      pStyle,
    ],
  },
];

export default buttons;
