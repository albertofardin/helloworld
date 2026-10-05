"use client";

import * as React from "react";
import { IDocEntry, IDocProp, pClassName, pStyle } from "../types";
import Card from "@/components/Card";
import Field from "@/components/Field";
import FieldDate from "@/components/FieldDate";
import FieldIconPicker from "@/components/FieldIconPicker";
import FieldSelect from "@/components/FieldSelect";
import FieldText from "@/components/FieldText";
import Icon from "@/components/Icon";
import InputFile from "@/components/InputFile";
import Text from "@/components/Text";

const pLabel: IDocProp[] = [
  {
    name: "label",
    type: "React.ReactNode",
    description: "Etichetta sopra il campo.",
  },
  {
    name: "labelIcon",
    type: "string",
    description: "Icona accanto all'etichetta.",
  },
  {
    name: "labelMandatory",
    type: "boolean",
    description: "Asterisco rosso di campo obbligatorio.",
  },
];

const pFieldIcon: IDocProp = {
  name: "icon / iconClassName / iconStyle",
  type: "string / string / CSSProperties",
  description: "Icona all'inizio del campo.",
};

const pInputEvents: IDocProp[] = [
  {
    name: "value",
    type: "string",
    def: `""`,
    description: "Valore controllato.",
  },
  {
    name: "onChange",
    type: "(value: string) => void",
    description: "Chiamata dopo il debounce, non a ogni tasto.",
  },
  {
    name: "debounce",
    type: "number",
    def: "500",
    description: "Ritardo in ms prima di onChange.",
  },
  {
    name: "onBlur / onFocus",
    type: "(value: string) => void",
    description: "Uscita e ingresso nel campo.",
  },
  {
    name: "onKeyPress",
    type: "(key: string, value: string) => void",
    description: "Tasto premuto, con il valore corrente.",
  },
  {
    name: "id / inputName",
    type: "string",
    description: "Attributi id e name dell'input.",
  },
  {
    name: "error / describedById",
    type: "boolean / string",
    description: "Impostano aria-invalid e aria-describedby.",
  },
];

const FRUITS = [
  { id: "mela", label: "Mela" },
  { id: "pera", label: "Pera" },
  { id: "kiwi", label: "Kiwi" },
  { id: "uva", label: "Uva" },
];

const PEOPLE = [
  "Ada Lovelace",
  "Alan Turing",
  "Grace Hopper",
  "Linus Torvalds",
  "Margaret Hamilton",
  "Dennis Ritchie",
  "Barbara Liskov",
  "Ken Thompson",
  "Donald Knuth",
  "Tim Berners-Lee",
].map(name => ({
  id: name,
  label: name,
  avatarText: name,
  avatarCircle: true,
}));

const PICKER_ICONS = [
  "home",
  "star",
  "favorite",
  "bell",
  "bookmark",
  "camera",
  "event",
  "mail",
  "lock",
  "person",
  "settings",
  "search",
  "rocket_launch",
  "palette",
  "language",
  "work",
  "target",
  "schedule",
];

const forms: IDocEntry[] = [
  {
    id: "field-text",
    name: "FieldText",
    description:
      "Campo di testo a riga singola o multiriga, con etichetta, icona e notifica delle modifiche ritardata (debounce).",
    importCode: `import FieldText from "@/components/FieldText";`,
    notes: [
      "onChange non scatta a ogni tasto ma dopo `debounce` millisecondi di pausa (500 di default): abbassalo per ricerche in tempo reale.",
    ],
    examples: [
      {
        title: "Base",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `const [name, setName] = React.useState("");

<FieldText
  label="Nome"
  labelMandatory
  icon="person"
  placeholder="Mario Rossi"
  value={name}
  onChange={setName}
/>`,
        Demo: function FieldTextDemo() {
          const [name, setName] = React.useState("");
          return (
            <>
              <FieldText
                label="Nome"
                labelMandatory
                icon="person"
                placeholder="Mario Rossi"
                value={name}
                onChange={setName}
              />
              <Text
                size={0}
                className="text-muted-fg"
                children={`Valore (dopo il debounce): "${name}"`}
              />
            </>
          );
        },
      },
      {
        title: "Password",
        description: `Con inputType="password" compare il pulsante mostra/nascondi.`,
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `<FieldText label="Password" icon="lock" inputType="password" value="segreta" />`,
        Demo: () => (
          <FieldText
            label="Password"
            icon="lock"
            inputType="password"
            value="segreta"
          />
        ),
      },
      {
        title: "Multiriga",
        description:
          "multilineFullHeight fa crescere il campo insieme al contenuto.",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `<FieldText label="Note" multiline multilineFullHeight placeholder="Scrivi una nota..." />`,
        Demo: () => (
          <FieldText
            label="Note"
            multiline
            multilineFullHeight
            placeholder="Scrivi una nota..."
          />
        ),
      },
      {
        title: "Sola lettura e disabilitato",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `<FieldText label="Sola lettura" readOnly value="Non modificabile" />
<FieldText label="Disabilitato" disabled value="Disabilitato" />`,
        Demo: () => (
          <>
            <FieldText label="Sola lettura" readOnly value="Non modificabile" />
            <FieldText label="Disabilitato" disabled value="Disabilitato" />
          </>
        ),
      },
    ],
    props: [
      ...pLabel,
      pFieldIcon,
      {
        name: "placeholder",
        type: "string",
        def: `"Scrivi..."`,
        description: "Testo segnaposto.",
      },
      {
        name: "inputType",
        type: "string",
        def: `"text"`,
        description: `Tipo dell'input; "password" aggiunge il pulsante occhio.`,
      },
      {
        name: "multiline",
        type: "boolean",
        def: "false",
        description: "Usa una textarea.",
      },
      {
        name: "multilineFullHeight",
        type: "boolean",
        def: "false",
        description: "La textarea cresce con il contenuto.",
      },
      {
        name: "readOnly",
        type: "boolean",
        description: "Mostra il valore senza bordo né modifica.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Blocca la modifica.",
      },
      {
        name: "autoFocus / autoComplete",
        type: "boolean / string",
        description: "Attributi nativi dell'input.",
      },
      ...pInputEvents,
      {
        name: "onClick",
        type: "() => void",
        description: "Click sul campo.",
      },
      {
        name: "inputClassName",
        type: "string",
        description: "Classi dell'elemento input/textarea.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "field-date",
    name: "FieldDate",
    description:
      "Campo data basato sul selettore nativo del browser, con orario opzionale.",
    importCode: `import FieldDate from "@/components/FieldDate";`,
    examples: [
      {
        title: "Data e data con orario",
        description:
          "Il valore è una stringa YYYY-MM-DD, oppure YYYY-MM-DDTHH:mm con withTime.",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `const [date, setDate] = React.useState("2026-10-06");

<FieldDate label="Data" value={date} onChange={setDate} />
<FieldDate label="Appuntamento" withTime min="2026-01-01T00:00" />`,
        Demo: function FieldDateDemo() {
          const [date, setDate] = React.useState("2026-10-06");
          return (
            <>
              <FieldDate label="Data" value={date} onChange={setDate} />
              <FieldDate label="Appuntamento" withTime min="2026-01-01T00:00" />
              <Text
                size={0}
                className="text-muted-fg"
                children={`Valore: "${date}"`}
              />
            </>
          );
        },
      },
    ],
    props: [
      ...pLabel,
      {
        name: "withTime",
        type: "boolean",
        def: "false",
        description: "Usa datetime-local e include l'orario nel valore.",
      },
      {
        name: "min / max",
        type: "string",
        description: "Limiti, nello stesso formato del valore.",
      },
      {
        name: "icon",
        type: "string",
        def: `"event"`,
        description: "Icona iniziale; cliccandola si apre il selettore.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Blocca la modifica.",
      },
      ...pInputEvents,
      {
        name: "onClick",
        type: "() => void",
        description: "Click sul campo.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "field-select",
    name: "FieldSelect",
    description:
      "Menu a tendina a scelta singola o multipla. Con più di 8 voci compare da sola la ricerca; può anche creare voci nuove.",
    importCode: `import FieldSelect from "@/components/FieldSelect";`,
    notes: [
      "In scelta singola, cliccare la voce già selezionata la deseleziona: onChange riceve undefined.",
    ],
    examples: [
      {
        title: "Scelta singola",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `const [fruit, setFruit] = React.useState("pera");

<FieldSelect
  label="Frutto"
  items={[
    { id: "mela", label: "Mela" },
    { id: "pera", label: "Pera" },
  ]}
  value={fruit}
  onChange={setFruit}
/>`,
        Demo: function FieldSelectDemo() {
          const [fruit, setFruit] = React.useState<string | number>("pera");
          return (
            <FieldSelect
              label="Frutto"
              items={FRUITS}
              value={fruit}
              onChange={v => setFruit(v as string)}
            />
          );
        },
      },
      {
        title: "Scelta multipla",
        description: "value e onChange lavorano con un array di id.",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `const [fruits, setFruits] = React.useState(["mela", "kiwi"]);

<FieldSelect label="Frutti" multiple items={items} value={fruits} onChange={setFruits} />`,
        Demo: function FieldSelectMultiDemo() {
          const [fruits, setFruits] = React.useState<(string | number)[]>([
            "mela",
            "kiwi",
          ]);
          return (
            <FieldSelect
              label="Frutti"
              multiple
              items={FRUITS}
              value={fruits}
              onChange={v => setFruits(v as (string | number)[])}
            />
          );
        },
      },
      {
        title: "Ricerca e avatar",
        description:
          "Oltre le 8 voci compare la ricerca e l'elenco mostra solo le prime 8 corrispondenze.",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `<FieldSelect
  label="Persona"
  icon="search"
  items={people.map(name => ({ id: name, label: name, avatarText: name }))}
  value={person}
  onChange={setPerson}
/>`,
        Demo: function FieldSelectSearchDemo() {
          const [person, setPerson] = React.useState<string | number>();
          return (
            <FieldSelect
              label="Persona"
              placeholder="Scegli una persona..."
              items={PEOPLE}
              value={person}
              onChange={v => setPerson(v as string)}
            />
          );
        },
      },
      {
        title: "Creazione di nuove voci",
        description:
          'Con creatable, scrivendo un testo non presente compare "Crea nuova voce": onChange riceve il testo digitato.',
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `<FieldSelect
  label="Etichetta"
  creatable
  items={tags}
  value={tag}
  onChange={value => {
    if (!tags.some(t => t.id === value)) setTags([...tags, { id: value, label: value }]);
    setTag(value);
  }}
/>`,
        Demo: function FieldSelectCreatableDemo() {
          const [tags, setTags] = React.useState(FRUITS);
          const [tag, setTag] = React.useState<string | number>();
          return (
            <FieldSelect
              label="Etichetta"
              creatable
              items={tags}
              value={tag}
              onChange={v => {
                const value = v as string;
                if (value && !tags.some(t => t.id === value))
                  setTags(prev => [...prev, { id: value, label: value }]);
                setTag(value);
              }}
            />
          );
        },
      },
    ],
    props: [
      {
        name: "items",
        type: "IPopoverListItem[]",
        required: true,
        description: "Voci del menu: almeno id e label (vedi ListItem).",
      },
      {
        name: "value",
        type: "string | number | (string | number)[]",
        description: "Id selezionato, o array di id con multiple.",
      },
      {
        name: "onChange",
        type: "(value) => void",
        description:
          "Nuovo id, array di id, oppure undefined se deselezionato.",
      },
      {
        name: "multiple",
        type: "boolean",
        def: "false",
        description: "Scelta multipla con spunte; il menu resta aperto.",
      },
      {
        name: "creatable",
        type: "boolean",
        def: "false",
        description: "Permette di creare una voce dal testo cercato.",
      },
      {
        name: "showAllItems",
        type: "boolean",
        def: "false",
        description: "Mostra tutte le voci invece delle prime 8.",
      },
      {
        name: "placeholder",
        type: "string",
        def: `"Seleziona..."`,
        description: "Testo a campo vuoto.",
      },
      ...pLabel,
      pFieldIcon,
      {
        name: "disabled",
        type: "boolean",
        description: "Blocca l'apertura.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "field-icon-picker",
    name: "FieldIconPicker",
    description:
      "Campo che apre una finestra con una griglia di icone tra cui sceglierne una.",
    importCode: `import FieldIconPicker from "@/components/FieldIconPicker";`,
    examples: [
      {
        title: "Selettore",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `const [icon, setIcon] = React.useState("star");

<FieldIconPicker
  label="Icona"
  icons={["home", "star", "favorite", "bell"]}
  value={icon}
  onChange={setIcon}
/>`,
        Demo: function FieldIconPickerDemo() {
          const [icon, setIcon] = React.useState("star");
          return (
            <FieldIconPicker
              label="Icona"
              icons={PICKER_ICONS}
              value={icon}
              onChange={setIcon}
            />
          );
        },
      },
    ],
    props: [
      {
        name: "icons",
        type: "string[]",
        required: true,
        description: "Nomi delle icone mostrate nella griglia.",
      },
      {
        name: "value",
        type: "string",
        def: `""`,
        description: "Nome dell'icona selezionata.",
      },
      {
        name: "onChange",
        type: "(icon: string) => void",
        description: "Icona scelta; la finestra si chiude.",
      },
      {
        name: "placeholder",
        type: "string",
        def: `"Nessuna icona"`,
        description: "Testo a campo vuoto.",
      },
      {
        name: "input",
        type: "boolean",
        def: "true",
        description: "Se false mostra solo l'icona, senza il nome.",
      },
      {
        name: "label / labelMandatory",
        type: "ReactNode / boolean",
        description: "Etichetta e asterisco.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Blocca l'apertura.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "field",
    name: "Field",
    description:
      "Il guscio comune a tutti i campi: bordo, etichetta, icona e stati. Serve per costruire un campo personalizzato con lo stesso aspetto degli altri.",
    importCode: `import Field from "@/components/Field";`,
    examples: [
      {
        title: "Campo personalizzato",
        previewClassName: "flex-col items-stretch max-w-[420px]",
        code: `<Field label="Volume" labelIcon="tune" icon="campaign">
  <input type="range" className="mx-2 flex-1" />
</Field>
<Field label="In focus" inFocus>
  <Text className="px-2">Bordo evidenziato</Text>
</Field>
<Field label="Sola lettura" readOnly>
  <Text className="px-2">Nessun bordo</Text>
</Field>`,
        Demo: () => (
          <>
            <Field label="Volume" labelIcon="tune" icon="campaign">
              <input
                type="range"
                className="mx-2 flex-1 accent-[var(--primary)]"
              />
            </Field>
            <Field label="In focus" inFocus>
              <Text className="px-2" children="Bordo evidenziato" />
            </Field>
            <Field label="Sola lettura" readOnly>
              <Text className="px-2" children="Nessun bordo" />
            </Field>
          </>
        ),
      },
    ],
    props: [
      ...pLabel,
      pFieldIcon,
      {
        name: "iconOnClick",
        type: "() => void",
        description: "Rende cliccabile l'icona iniziale.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Il controllo vero e proprio.",
      },
      {
        name: "inFocus",
        type: "boolean",
        description: "Forza il bordo evidenziato (es. menu aperto).",
      },
      {
        name: "readOnly",
        type: "boolean",
        description: "Toglie bordo e sfondo.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Cursore non consentito, nessun hover.",
      },
      {
        name: "onClick",
        type: "(event) => void",
        description: "Click sul guscio.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "input-file",
    name: "InputFile",
    description:
      "Input file invisibile che riempie il contenitore: qualsiasi elemento diventa un pulsante di caricamento.",
    importCode: `import InputFile from "@/components/InputFile";`,
    notes: [
      "Il contenitore deve avere position: relative, perché l'input è assoluto e lo copre per intero.",
    ],
    examples: [
      {
        title: "Area di caricamento",
        code: `<Card className="relative flex-col gap-1 border-dashed p-6">
  <Icon size="lg">upload</Icon>
  <Text>Clicca per scegliere dei file</Text>
  <InputFile
    multiple
    acceptFiles="image/*"
    onChangeInput={event => setFiles(Array.from(event.target.files))}
  />
</Card>`,
        Demo: function InputFileDemo() {
          const [files, setFiles] = React.useState<string[]>([]);
          return (
            <Card className="relative min-w-[260px] flex-col gap-1 border-dashed p-6 hover:border-primary">
              <Icon size="lg" className="text-muted-fg" children="upload" />
              <Text
                children={
                  files.length
                    ? files.join(", ")
                    : "Clicca per scegliere delle immagini"
                }
              />
              <InputFile
                multiple
                acceptFiles="image/*"
                onChangeInput={event =>
                  setFiles(
                    Array.from(event.target.files ?? []).map(f => f.name)
                  )
                }
              />
            </Card>
          );
        },
      },
    ],
    props: [
      {
        name: "onChangeInput",
        type: "(event: ChangeEvent<HTMLInputElement>) => void",
        required: true,
        description: "File scelti, in event.target.files.",
      },
      {
        name: "acceptFiles",
        type: "string",
        def: `"*"`,
        description: "Tipi accettati (attributo accept).",
      },
      {
        name: "multiple",
        type: "boolean",
        def: "false",
        description: "Permette più file.",
      },
      {
        name: "directory",
        type: "boolean",
        def: "false",
        description: "Seleziona un'intera cartella.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Non renderizza l'input.",
      },
    ],
  },
];

export default forms;
