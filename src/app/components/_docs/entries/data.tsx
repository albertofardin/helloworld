"use client";

import * as React from "react";
import { IDocEntry, pClassName, pStyle } from "../types";
import Accordion from "@/components/Accordion";
import Avatar from "@/components/Avatar";
import AvatarUser from "@/components/AvatarUser";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import { SelectType } from "@/components/Checkbox";
import LineChart from "@/components/LineChart";
import List from "@/components/List";
import ListItem from "@/components/ListItem";
import Pagination from "@/components/Pagination";
import Text from "@/components/Text";

const noop = () => null;

const lineChartData = Array.from({ length: 49 }, (_, hour) => {
  const sun = Math.max(0, Math.sin(((hour % 24) - 6) * (Math.PI / 12)));
  return {
    hour,
    radiation: Math.round(800 * sun),
    temperature: hour === 30 ? null : 14 + 9 * sun,
  };
});

const data: IDocEntry[] = [
  {
    id: "avatar",
    name: "Avatar",
    description:
      "Riquadro di dimensione fissa che mostra, in ordine di priorità, un'immagine, un testo oppure un'icona.",
    importCode: `import Avatar from "@/components/Avatar";`,
    notes: [
      "L'immagine passa da next/image: per un src su un dominio esterno va dichiarato il dominio in next.config.ts.",
    ],
    examples: [
      {
        title: "Contenuto e forma",
        code: `<Avatar />
<Avatar icon="rocket_launch" />
<Avatar text="AF" />
<Avatar text="AF" circle />
<Avatar text="XL" size={64} circle tooltip="Con tooltip" />`,
        Demo: () => (
          <>
            <Avatar />
            <Avatar icon="rocket_launch" />
            <Avatar text="AF" />
            <Avatar text="AF" circle />
            <Avatar text="XL" size={64} circle tooltip="Con tooltip" />
          </>
        ),
      },
    ],
    props: [
      {
        name: "src",
        type: "string",
        description: "URL dell'immagine; ha la precedenza su testo e icona.",
      },
      {
        name: "text",
        type: "string",
        description: "Testo mostrato se manca l'immagine.",
      },
      {
        name: "icon",
        type: "string",
        def: `"person"`,
        description: "Icona mostrata se mancano immagine e testo.",
      },
      {
        name: "size",
        type: "number",
        def: "42",
        description: "Lato in pixel.",
      },
      {
        name: "circle",
        type: "boolean",
        description: "Forma tonda invece che arrotondata.",
      },
      {
        name: "tooltip",
        type: "string",
        description: "Tooltip al passaggio del mouse.",
      },
      {
        name: "textClassName / iconClassName",
        type: "string",
        description: "Classi per testo e icona (esistono anche i *Style).",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "avatar-user",
    name: "AvatarUser",
    description:
      "Avatar di una persona: dal nome ricava le iniziali e un colore di sfondo stabile, sempre uguale per lo stesso nome.",
    importCode: `import AvatarUser from "@/components/AvatarUser";`,
    examples: [
      {
        title: "Iniziali e colore dal nome",
        code: `<AvatarUser text="Ada Lovelace" circle />
<AvatarUser text="Alan Turing" circle />
<AvatarUser text="Grace Hopper" circle />
<AvatarUser text="Linus Torvalds" />`,
        Demo: () => (
          <>
            <AvatarUser text="Ada Lovelace" circle tooltip="Ada Lovelace" />
            <AvatarUser text="Alan Turing" circle tooltip="Alan Turing" />
            <AvatarUser text="Grace Hopper" circle tooltip="Grace Hopper" />
            <AvatarUser text="Linus Torvalds" tooltip="Linus Torvalds" />
          </>
        ),
      },
    ],
    props: [
      {
        name: "text",
        type: "string",
        description: "Nome completo: se ne mostrano al massimo due iniziali.",
      },
      {
        name: "src",
        type: "string",
        description: "Immagine; se presente sostituisce iniziali e colore.",
      },
      {
        name: "...Avatar",
        type: "IAvatar",
        description: "Tutte le altre props di Avatar (size, circle, tooltip…).",
      },
    ],
  },
  {
    id: "badge",
    name: "Badge",
    description:
      "Etichetta compatta a pillola per stati, categorie e conteggi, con icona o avatar opzionali.",
    importCode: `import Badge from "@/components/Badge";`,
    examples: [
      {
        title: "Colori",
        code: `<Badge label="Default" />
<Badge label="Completato" color="var(--succ)" icon="check" />
<Badge label="Errore" color="var(--fail)" icon="error" />
<Badge label="Info" color="var(--info)" icon="info" />
<Badge label="Senza sfondo" background={false} />`,
        Demo: () => (
          <>
            <Badge label="Default" />
            <Badge label="Completato" color="var(--succ)" icon="check" />
            <Badge label="Errore" color="var(--fail)" icon="error" />
            <Badge label="Info" color="var(--info)" icon="info" />
            <Badge label="Senza sfondo" background={false} />
          </>
        ),
      },
      {
        title: "Avatar, posizione e click",
        code: `<Badge label="Ada Lovelace" avatarText="Ada Lovelace" />
<Badge label="Icona a destra" icon="star" labelPosition />
<Badge label="Cliccabile" icon="add" tooltip="Aggiungi" onClick={onClick} />
<Badge label="Disabilitato" icon="lock" disabled onClick={onClick} />`,
        Demo: () => (
          <>
            <Badge label="Ada Lovelace" avatarText="Ada Lovelace" />
            <Badge label="Icona a destra" icon="star" labelPosition />
            <Badge
              label="Cliccabile"
              icon="add"
              tooltip="Aggiungi"
              onClick={noop}
            />
            <Badge label="Disabilitato" icon="lock" disabled onClick={noop} />
          </>
        ),
      },
    ],
    props: [
      { name: "label", type: "string", description: "Testo del badge." },
      {
        name: "color",
        type: "string",
        def: "var(--primary)",
        description: "Colore del testo; lo sfondo ne è una tinta al 10%.",
      },
      { name: "icon", type: "string", description: "Icona accanto al testo." },
      {
        name: "avatarText / avatarSrc",
        type: "string",
        description: "Mostra un AvatarUser al posto dell'icona.",
      },
      {
        name: "labelPosition",
        type: "boolean",
        description: "Se true il testo precede icona o avatar.",
      },
      {
        name: "background",
        type: "boolean",
        def: "true",
        description: "Sfondo colorato.",
      },
      {
        name: "onClick",
        type: "(event, keyDown) => void",
        description: "Rende il badge cliccabile.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Colore grigio e nessun click.",
      },
      {
        name: "tooltip",
        type: "string | string[] | ReactElement",
        description: "Tooltip.",
      },
      {
        name: "labelClassName / iconClassName / avatarClassName",
        type: "string",
        description: "Classi per le singole parti.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "line-chart",
    name: "LineChart",
    description:
      "Grafico a linee su un asse X numerico condiviso, basato su Recharts. Ogni serie ha un pannello con la propria scala Y, il titolo di ogni pannello ne riporta nome e colore e il tooltip riporta i valori di tutte le serie nel punto indicato.",
    importCode: `import LineChart from "@/components/LineChart";`,
    notes: [
      "Le serie non condividono l'asse Y: unità e ordini di grandezza diversi restano leggibili senza un doppio asse.",
      "Un valore null interrompe la linea in quel punto.",
      "Il colore va scelto distinguibile anche per chi non percepisce bene i colori: --chart-blue e --chart-red del tema lo sono.",
    ],
    examples: [
      {
        title: "Due serie",
        code: `<LineChart
  data={data} // [{ hour: 0, radiation: 0, temperature: 14 }, …]
  xKey="hour"
  series={[
    { key: "radiation", label: "Irraggiamento", unit: "W/m²", color: "var(--chart-red)", fromZero: true },
    { key: "temperature", label: "Temperatura", unit: "°C", color: "var(--chart-blue)", digits: 1 },
  ]}
  xTicks={[0, 12, 24, 36, 48]}
  formatXTick={hour => hour + "h"}
  formatX={hour => "Ora " + hour}
  panelHeight={140}
/>`,
        previewClassName: "block",
        Demo: () => (
          <LineChart
            data={lineChartData}
            xKey="hour"
            series={[
              {
                key: "radiation",
                label: "Irraggiamento",
                unit: "W/m²",
                color: "var(--chart-red)",
                fromZero: true,
              },
              {
                key: "temperature",
                label: "Temperatura",
                unit: "°C",
                color: "var(--chart-blue)",
                digits: 1,
              },
            ]}
            xTicks={[0, 12, 24, 36, 48]}
            formatXTick={hour => `${hour}h`}
            formatX={hour => `Ora ${hour}`}
            panelHeight={140}
          />
        ),
      },
    ],
    props: [
      {
        name: "data",
        type: "Record<string, number | null>[]",
        required: true,
        description:
          "Un elemento per punto, con il valore X e quelli delle serie.",
      },
      {
        name: "xKey",
        type: "string",
        required: true,
        description: "Chiave numerica dell'asse X (es. un timestamp).",
      },
      {
        name: "series",
        type: "ILineChartSeries[]",
        required: true,
        description:
          "Serie da disegnare: key, label, color e, opzionali, unit, digits e fromZero (asse Y da zero).",
      },
      {
        name: "xTicks",
        type: "number[]",
        description:
          "Posizioni delle tacche sull'asse X; se assenti le sceglie il grafico.",
      },
      {
        name: "formatXTick",
        type: "(x: number) => string",
        description: "Etichetta di una tacca dell'asse X.",
      },
      {
        name: "formatX",
        type: "(x: number) => string",
        description: "Intestazione del tooltip.",
      },
      {
        name: "panelHeight",
        type: "number",
        def: "180",
        description: "Altezza in px di ciascun pannello.",
      },
      {
        name: "locale",
        type: "string",
        def: `"it-IT"`,
        description: "Locale usato per formattare i numeri.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "list",
    name: "List",
    description:
      "Contenitore <ul> scorrevole per una serie di ListItem. Non aggiunge altro che spaziatura e overflow.",
    importCode: `import List from "@/components/List";`,
    examples: [
      {
        title: "Elenco scorrevole",
        code: `<Card className="block w-[260px]">
  <List className="max-h-[160px]">
    {items.map(item => (
      <ListItem key={item} id={item} label={item} onClick={onClick} />
    ))}
  </List>
</Card>`,
        Demo: () => (
          <Card className="block w-[260px] overflow-hidden">
            <List className="max-h-[160px]">
              {Array.from({ length: 8 }, (_, i) => `Elemento ${i + 1}`).map(
                item => (
                  <ListItem key={item} id={item} label={item} onClick={noop} />
                )
              )}
            </List>
          </Card>
        ),
      },
    ],
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "Le righe dell'elenco.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "list-item",
    name: "ListItem",
    description:
      "Riga di un elenco o di un menu: etichetta, sottotitolo, icona, avatar e selezione con spunta o radio.",
    importCode: `import ListItem from "@/components/ListItem";`,
    examples: [
      {
        title: "Contenuti",
        code: `<ListItem id="1" label="Solo etichetta" onClick={onClick} />
<ListItem id="2" label="Con icona" icon="settings" onClick={onClick} />
<ListItem id="3" label="Ada Lovelace" subLabel="Matematica" avatarText="Ada Lovelace" avatarCircle onClick={onClick} />
<ListItem id="4" label="Disabilitata" icon="lock" disabled onClick={onClick} />`,
        Demo: () => (
          <Card className="block w-[300px] overflow-hidden">
            <List>
              <ListItem id="1" label="Solo etichetta" onClick={noop} />
              <ListItem
                id="2"
                label="Con icona"
                icon="settings"
                onClick={noop}
              />
              <ListItem
                id="3"
                label="Ada Lovelace"
                subLabel="Matematica"
                avatarText="Ada Lovelace"
                avatarCircle
                onClick={noop}
              />
              <ListItem
                id="4"
                label="Disabilitata"
                icon="lock"
                disabled
                onClick={noop}
              />
            </List>
          </Card>
        ),
      },
      {
        title: "Selezione",
        description:
          "selectType aggiunge la spunta; la riga selezionata è evidenziata e in grassetto.",
        code: `const [selected, setSelected] = React.useState(["b"]);
const toggle = id =>
  setSelected(selected.includes(id) ? selected.filter(v => v !== id) : [...selected, id]);

<ListItem id="a" label="Alfa" selectType={SelectType.CHECK} selected={selected.includes("a")} onClick={toggle} />`,
        Demo: function ListItemSelectDemo() {
          const [selected, setSelected] = React.useState<(string | number)[]>([
            "b",
          ]);
          const toggle = (id: string | number) =>
            setSelected(prev =>
              prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
            );
          return (
            <Card className="block w-[300px] overflow-hidden">
              <List>
                {[
                  { id: "a", label: "Alfa" },
                  { id: "b", label: "Beta" },
                  { id: "c", label: "Gamma" },
                ].map(item => (
                  <ListItem
                    key={item.id}
                    {...item}
                    selectType={SelectType.CHECK}
                    selected={selected.includes(item.id)}
                    onClick={toggle}
                  />
                ))}
              </List>
            </Card>
          );
        },
      },
    ],
    props: [
      {
        name: "id",
        type: "string | number",
        required: true,
        description: "Identificativo, restituito a onClick.",
      },
      {
        name: "label",
        type: "string",
        required: true,
        description: "Testo principale.",
      },
      {
        name: "subLabel",
        type: "string",
        description: "Seconda riga più piccola.",
      },
      {
        name: "onClick",
        type: "(id, event) => void",
        description: "Click sulla riga.",
      },
      {
        name: "icon / iconTooltip",
        type: "string",
        description: "Icona iniziale e relativo tooltip.",
      },
      {
        name: "avatar / avatarText / avatarIcon",
        type: "string",
        description: "Mostra un AvatarUser.",
      },
      {
        name: "avatarSize / avatarCircle",
        type: "number / boolean",
        def: "25 / —",
        description: "Dimensione e forma dell'avatar.",
      },
      {
        name: "selected",
        type: "boolean",
        description: "Riga selezionata.",
      },
      {
        name: "selectType",
        type: "SelectType",
        def: "SelectType.NONE",
        description: "Mostra una spunta (CHECK) o un radio (RADIO).",
      },
      {
        name: "labelWeight",
        type: "TextWeight",
        def: `"regular"`,
        description: "Peso dell'etichetta quando non è selezionata.",
      },
      {
        name: "color",
        type: "string",
        def: "var(--primary)",
        description: "Colore di ripple e spunta.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Riga attenuata e non cliccabile.",
      },
      {
        name: "copyToClipboard / onCopyToClipboard",
        type: "string / (text) => void",
        description: "Copia un testo al click.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Contenuto in coda alla riga.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "accordion",
    name: "Accordion",
    description:
      "Pannello richiudibile con intestazione cliccabile. Funziona da solo oppure controllato dall'esterno.",
    importCode: `import Accordion from "@/components/Accordion";`,
    examples: [
      {
        title: "Non controllato",
        previewClassName: "flex-col items-stretch max-w-[480px]",
        code: `<Accordion title="Dettagli" titleIcon="info" defaultOpen>
  <Text>Contenuto visibile all'apertura.</Text>
</Accordion>
<Accordion title="Altre opzioni" titleIcon="settings">
  <Text>Contenuto montato solo quando è aperto.</Text>
</Accordion>`,
        Demo: () => (
          <>
            <Accordion title="Dettagli" titleIcon="info" defaultOpen>
              <Text children="Contenuto visibile all'apertura." />
            </Accordion>
            <Accordion title="Altre opzioni" titleIcon="settings">
              <Text children="Contenuto montato solo quando è aperto." />
            </Accordion>
          </>
        ),
      },
      {
        title: "Controllato, uno aperto alla volta",
        description:
          "Passando open e onToggle lo stato vive nel componente genitore.",
        previewClassName: "flex-col items-stretch max-w-[480px]",
        code: `const [open, setOpen] = React.useState("a");

<Accordion title="Primo" open={open === "a"} onToggle={() => setOpen(open === "a" ? "" : "a")}>…</Accordion>
<Accordion title="Secondo" open={open === "b"} onToggle={() => setOpen(open === "b" ? "" : "b")}>…</Accordion>`,
        Demo: function AccordionControlledDemo() {
          const [open, setOpen] = React.useState("a");
          return (
            <>
              {[
                { id: "a", title: "Primo" },
                { id: "b", title: "Secondo" },
                { id: "c", title: "Terzo" },
              ].map(({ id, title }) => (
                <Accordion
                  key={id}
                  title={title}
                  open={open === id}
                  onToggle={() => setOpen(prev => (prev === id ? "" : id))}
                  buttonChildren={
                    id === "b" ? (
                      <Badge label="buttonChildren" color="var(--info)" />
                    ) : undefined
                  }
                >
                  <Text children={`Contenuto del pannello "${title}".`} />
                </Accordion>
              ))}
            </>
          );
        },
      },
    ],
    props: [
      {
        name: "title",
        type: "React.ReactNode",
        required: true,
        description: "Titolo dell'intestazione.",
      },
      {
        name: "titleIcon",
        type: "string",
        description: "Icona prima del titolo.",
      },
      {
        name: "titleSize / titleWeight",
        type: "TextSize / TextWeight",
        def: `1 / "bolder"`,
        description: "Tipografia del titolo.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        def: "false",
        description: "Stato iniziale, in modalità non controllata.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Stato controllato dall'esterno.",
      },
      {
        name: "onToggle",
        type: "() => void",
        description:
          "Click sull'intestazione. Se presente, lo stato interno non cambia.",
      },
      {
        name: "buttonChildren",
        type: "React.ReactNode",
        description: "Contenuto extra nell'intestazione, prima della freccia.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Contenuto del pannello.",
      },
      {
        name: "contentClassName / buttonClassName / titleIconClassName",
        type: "string",
        description: "Classi per le singole parti.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "pagination",
    name: "Pagination",
    description:
      'Barra "N–M di TOT" con pulsanti precedente e successivo per le liste paginate.',
    importCode: `import Pagination from "@/components/Pagination";`,
    notes: ["Con una sola pagina il componente non renderizza nulla."],
    examples: [
      {
        title: "Lista paginata",
        previewClassName: "flex-col items-stretch",
        code: `const [page, setPage] = React.useState(1);

<Pagination
  page={page}
  pageSize={10}
  totalCount={47}
  totalPages={5}
  itemLabel="elementi"
  onPageChange={setPage}
/>`,
        Demo: function PaginationDemo() {
          const [page, setPage] = React.useState(1);
          return (
            <Pagination
              page={page}
              pageSize={10}
              totalCount={47}
              totalPages={5}
              itemLabel="elementi"
              onPageChange={setPage}
            />
          );
        },
      },
    ],
    props: [
      {
        name: "page",
        type: "number",
        required: true,
        description: "Pagina corrente, a partire da 1.",
      },
      {
        name: "pageSize",
        type: "number",
        required: true,
        description: "Elementi per pagina.",
      },
      {
        name: "totalCount",
        type: "number",
        required: true,
        description: "Numero totale di elementi.",
      },
      {
        name: "totalPages",
        type: "number",
        required: true,
        description: "Numero totale di pagine.",
      },
      {
        name: "itemLabel",
        type: "string",
        required: true,
        description: `Nome plurale degli elementi, es. "missive".`,
      },
      {
        name: "onPageChange",
        type: "(page: number) => void",
        required: true,
        description: "Nuova pagina richiesta.",
      },
      pClassName,
    ],
  },
];

export default data;
