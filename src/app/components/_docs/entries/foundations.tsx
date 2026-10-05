"use client";

import * as React from "react";
import { IDocEntry, pClassName, pStyle } from "../types";
import Background from "@/components/Background";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import FieldText from "@/components/FieldText";
import Icon from "@/components/Icon";
import { ICON_MAP } from "@/components/Icon/icon-map";
import Text, { TextSize } from "@/components/Text";
import { useToast } from "@/components/Toast";

const TEXT_SIZES: TextSize[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const ICON_NAMES = Object.keys(ICON_MAP).sort();

const IconGallery = () => {
  const { showToast } = useToast();
  const [search, setSearch] = React.useState("");
  const query = search.trim().toLowerCase();
  const names = query
    ? ICON_NAMES.filter(name => name.includes(query))
    : ICON_NAMES;

  return (
    <div className="flex w-full flex-col gap-3">
      <FieldText
        className="max-w-[320px]"
        icon="search"
        placeholder={`Cerca tra ${ICON_NAMES.length} icone...`}
        debounce={150}
        value={search}
        onChange={setSearch}
      />
      <div className="grid max-h-[320px] grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 overflow-auto">
        {names.map(name => (
          <Card
            key={name}
            className="flex-col gap-1 px-1 py-2 hover:border-primary"
            tooltip="Clicca per copiare il nome"
            copyToClipboard={name}
            onCopyToClipboard={() =>
              showToast({ variant: "info", message: `"${name}" copiato` })
            }
            onClick={() => null}
          >
            <Icon children={name} />
            <Text
              size={0}
              ellipsis
              className="max-w-full text-muted-fg"
              children={name}
            />
          </Card>
        ))}
        {!names.length && (
          <Text className="text-muted-fg" children="Nessuna icona trovata" />
        )}
      </div>
    </div>
  );
};

const foundations: IDocEntry[] = [
  {
    id: "text",
    name: "Text",
    description:
      "Paragrafo tipografico di base. Tutto il testo dell'interfaccia passa da qui, così scala, peso e colore restano coerenti.",
    importCode: `import Text from "@/components/Text";`,
    examples: [
      {
        title: "Scala tipografica",
        description: "size va da 0 (text-xs) a 10 (text-7xl).",
        previewClassName: "flex-col items-start",
        code: `<Text size={0}>size 0</Text>
<Text size={1}>size 1 (default)</Text>
<Text size={2}>size 2</Text>
<Text size={5}>size 5</Text>
<Text size={8}>size 8</Text>`,
        Demo: () => (
          <>
            {TEXT_SIZES.map(size => (
              <Text key={size} size={size} children={`size ${size}`} />
            ))}
          </>
        ),
      },
      {
        title: "Peso",
        previewClassName: "gap-6",
        code: `<Text size={3} weight="lighter">Lighter</Text>
<Text size={3} weight="regular">Regular</Text>
<Text size={3} weight="bolder">Bolder</Text>`,
        Demo: () => (
          <>
            <Text size={3} weight="lighter" children="Lighter" />
            <Text size={3} weight="regular" children="Regular" />
            <Text size={3} weight="bolder" children="Bolder" />
          </>
        ),
      },
      {
        title: "Ellissi e colore",
        description:
          "ellipsis tronca su una riga; il colore si cambia con className.",
        previewClassName: "flex-col items-start",
        code: `<Text ellipsis className="max-w-[220px]">
  Un testo molto lungo che non entra nel contenitore
</Text>
<Text className="text-primary">Testo primario</Text>
<Text className="text-muted-fg">Testo attenuato</Text>`,
        Demo: () => (
          <>
            <Text
              ellipsis
              className="max-w-[220px]"
              children="Un testo molto lungo che non entra nel contenitore"
            />
            <Text className="text-primary" children="Testo primario" />
            <Text className="text-muted-fg" children="Testo attenuato" />
          </>
        ),
      },
    ],
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Contenuto del paragrafo.",
      },
      {
        name: "size",
        type: "0 | 1 | … | 10",
        def: "1",
        description: "Dimensione sulla scala tipografica.",
      },
      {
        name: "weight",
        type: `"regular" | "lighter" | "bolder"`,
        def: `"regular"`,
        description: "Peso del carattere.",
      },
      {
        name: "ellipsis",
        type: "boolean",
        description: "Tronca il testo su una riga con i puntini.",
      },
      {
        name: "onClick",
        type: "(event) => void",
        description: "Click sul paragrafo.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "icon",
    name: "Icon",
    description:
      "Icona SVG di Radix Icons, scelta per nome. I nomi sono chiavi storiche definite in icon-map.ts: un nome sconosciuto mostra l'icona di ripiego.",
    importCode: `import Icon from "@/components/Icon";`,
    notes: [
      "L'icona eredita colore e dimensione dal testo: usa className (es. text-primary, text-[40px]) per cambiarli.",
    ],
    examples: [
      {
        title: "Dimensioni e colore",
        code: `<Icon size="sm">star</Icon>
<Icon size="md">star</Icon>
<Icon size="lg">star</Icon>
<Icon size="lg" className="text-primary">favorite</Icon>
<Icon className="text-[40px] text-succ">check_circle</Icon>`,
        Demo: () => (
          <>
            <Icon size="sm" children="star" />
            <Icon size="md" children="star" />
            <Icon size="lg" children="star" />
            <Icon size="lg" className="text-primary" children="favorite" />
            <Icon className="text-[40px] text-succ" children="check_circle" />
          </>
        ),
      },
      {
        title: "Catalogo",
        description: "Tutti i nomi disponibili. Clicca un'icona per copiarlo.",
        code: `<Icon>search</Icon>`,
        Demo: IconGallery,
      },
    ],
    props: [
      {
        name: "children",
        type: "string",
        required: true,
        description: "Nome dell'icona (chiave di ICON_MAP).",
      },
      {
        name: "size",
        type: `"sm" | "md" | "lg"`,
        def: `"md"`,
        description: "Dimensione predefinita.",
      },
      pClassName,
      pStyle,
      {
        name: "...other",
        type: "HTMLAttributes<HTMLSpanElement>",
        description: "Ogni altro attributo viene passato allo <span> radice.",
      },
    ],
  },
  {
    id: "divider",
    name: "Divider",
    description: "Linea orizzontale di un pixel per separare blocchi.",
    importCode: `import Divider from "@/components/Divider";`,
    examples: [
      {
        title: "Base e colorato",
        previewClassName: "flex-col items-stretch",
        code: `<Text>Sopra</Text>
<Divider />
<Text>In mezzo</Text>
<Divider color="var(--primary)" />
<Text>Sotto</Text>`,
        Demo: () => (
          <>
            <Text children="Sopra" />
            <Divider />
            <Text children="In mezzo" />
            <Divider color="var(--primary)" />
            <Text children="Sotto" />
          </>
        ),
      },
    ],
    props: [
      {
        name: "color",
        type: "string",
        def: "var(--border)",
        description: "Colore della linea.",
      },
      pClassName,
      pStyle,
    ],
  },
  {
    id: "card",
    name: "Card",
    description:
      "Superficie con bordo arrotondato e ombra opzionale. Estende BtnBase: con onClick diventa cliccabile, con effetto ripple.",
    importCode: `import Card from "@/components/Card";`,
    examples: [
      {
        title: "Elevazione",
        description: "Da 0 (nessun bordo) a 7 (ombra massima).",
        previewClassName: "gap-5",
        code: `<Card elevation={0} className="h-16 w-16">0</Card>
<Card elevation={1} className="h-16 w-16">1</Card>
<Card elevation={4} className="h-16 w-16">4</Card>
<Card elevation={7} className="h-16 w-16">7</Card>`,
        Demo: () => (
          <>
            {([0, 1, 2, 3, 4, 5, 6, 7] as const).map(elevation => (
              <Card key={elevation} elevation={elevation} className="h-16 w-16">
                <Text children={String(elevation)} />
              </Card>
            ))}
          </>
        ),
      },
      {
        title: "Cliccabile",
        code: `<Card className="p-4" onClick={() => setCount(count + 1)}>
  <Text>Cliccata {count} volte</Text>
</Card>`,
        Demo: function CardClickDemo() {
          const [count, setCount] = React.useState(0);
          return (
            <Card
              className="p-4 hover:border-primary"
              onClick={() => setCount(prev => prev + 1)}
            >
              <Text children={`Cliccata ${count} volte`} />
            </Card>
          );
        },
      },
    ],
    props: [
      {
        name: "elevation",
        type: "0 | 1 | … | 7",
        def: "1",
        description: "Intensità dell'ombra; 0 toglie anche il bordo.",
      },
      {
        name: "...BtnBase",
        type: "IBtnBase",
        description:
          "Tutte le props di BtnBase: onClick, tooltip, disabled, copyToClipboard…",
      },
    ],
  },
  {
    id: "background",
    name: "Background",
    description:
      "Contenitore con sfondo a gradiente orizzontale tra due colori.",
    importCode: `import Background from "@/components/Background";`,
    examples: [
      {
        title: "Gradiente",
        previewClassName: "flex-col items-stretch",
        code: `<Background className="h-24 justify-center rounded-xl">
  <Text weight="bolder">Default</Text>
</Background>
<Background
  color1="var(--info)"
  color2="var(--succ)"
  className="h-24 justify-center rounded-xl"
/>`,
        Demo: () => (
          <>
            <Background className="h-24 justify-center rounded-xl">
              <Text weight="bolder" children="Default" />
            </Background>
            <Background
              color1="var(--info)"
              color2="var(--succ)"
              className="h-24 justify-center rounded-xl"
            >
              <Text
                weight="bolder"
                className="text-white"
                children="Colori personalizzati"
              />
            </Background>
          </>
        ),
      },
    ],
    props: [
      {
        name: "color1",
        type: "string",
        def: "var(--primary)",
        description: "Colore di arrivo (a destra).",
      },
      {
        name: "color2",
        type: "string",
        def: "var(--bg)",
        description: "Colore di partenza (a sinistra).",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Contenuto, centrato orizzontalmente.",
      },
      pClassName,
      pStyle,
    ],
  },
];

export default foundations;
