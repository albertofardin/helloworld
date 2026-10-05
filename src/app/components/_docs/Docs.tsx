"use client";

import * as React from "react";
import categories from "./registry";
import { DocSection } from "./ui";
import Btn from "@/components/Btn";
import FieldSelect from "@/components/FieldSelect";
import FieldText from "@/components/FieldText";
import Icon from "@/components/Icon";
import ListItem from "@/components/ListItem";
import Text from "@/components/Text";
import ToastProvider from "@/components/Toast";

const TOTAL = categories.reduce((sum, c) => sum + c.entries.length, 0);
const ALL_ITEMS = categories.flatMap(c =>
  c.entries.map(e => ({ id: e.id, label: e.name, subLabel: c.label }))
);
// Distanza dal bordo alto entro cui una sezione è considerata "corrente".
const SPY_OFFSET = 120;

const DocsShell = () => {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const mobileNavRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState(categories[0].entries[0].id);

  const query = search.trim().toLowerCase();
  const visible = React.useMemo(
    () =>
      categories
        .map(c => ({
          ...c,
          entries: !query
            ? c.entries
            : c.entries.filter(e => e.name.toLowerCase().includes(query)),
        }))
        .filter(c => c.entries.length),
    [query]
  );
  const visibleCount = visible.reduce((sum, c) => sum + c.entries.length, 0);

  // Lo scroll è fatto a mano sull'area scorrevole: scrollIntoView (e l'ancora
  // nativa del browser, per questo le sezioni non hanno un id) sposterebbe
  // anche <body>, che ha overflow nascosto, portando l'header fuori schermo.
  const scrollToSection = React.useCallback(
    (id: string, behavior: ScrollBehavior) => {
      const scroller = scrollerRef.current;
      const target = scroller?.querySelector<HTMLElement>(
        `[data-doc-section="${id}"]`
      );
      if (!scroller || !target) return;
      const top =
        scroller.scrollTop +
        target.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top -
        (mobileNavRef.current?.offsetHeight ?? 0) -
        16;
      scroller.scrollTo({ top, behavior });
    },
    []
  );

  const goTo = React.useCallback(
    (id: string | number) => {
      scrollToSection(String(id), "smooth");
      window.history.replaceState(null, "", `#${id}`);
    },
    [scrollToSection]
  );

  // Apertura diretta di /components#btn: porta alla sezione senza animazione.
  React.useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) scrollToSection(id, "auto");
  }, [scrollToSection]);

  // Scrollspy: la sezione corrente è l'ultima il cui inizio ha superato
  // il bordo alto dell'area scorrevole.
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = scroller.getBoundingClientRect().top + SPY_OFFSET;
      const sections =
        scroller.querySelectorAll<HTMLElement>("[data-doc-section]");
      let current = sections[0]?.dataset.docSection;
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= top)
          current = section.dataset.docSection;
      });
      if (current) setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [visible]);

  return (
    <div className="flex min-h-0 w-full flex-1">
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-solid border-border bg-card md:flex">
        <div className="flex flex-col gap-2 p-3">
          <FieldText
            icon="search"
            placeholder="Cerca un componente..."
            debounce={150}
            value={search}
            onChange={setSearch}
          />
          <Text
            size={0}
            className="px-1 text-muted-fg"
            children={
              query
                ? `${visibleCount} di ${TOTAL} componenti`
                : `${TOTAL} componenti`
            }
          />
        </div>
        <nav className="min-h-0 flex-1 overflow-auto pb-4">
          {visible.map(category => (
            <div key={category.id} className="mb-2">
              <div className="flex items-center gap-2 px-3 py-1">
                <Icon
                  size="sm"
                  className="text-muted-fg"
                  children={category.icon}
                />
                <Text
                  size={0}
                  weight="bolder"
                  className="uppercase text-muted-fg"
                  children={category.label}
                />
              </div>
              {category.entries.map(entry => (
                <ListItem
                  key={entry.id}
                  id={entry.id}
                  label={entry.name}
                  selected={entry.id === activeId}
                  className="mx-2 rounded"
                  onClick={goTo}
                />
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div ref={scrollerRef} className="min-w-0 flex-1 overflow-auto">
        <div
          ref={mobileNavRef}
          className="sticky top-0 z-10 border-b border-solid border-border bg-bg p-3 md:hidden"
        >
          <FieldSelect
            icon="search"
            placeholder="Vai a un componente..."
            items={ALL_ITEMS}
            value={activeId}
            onChange={id => id && goTo(id as string)}
          />
        </div>

        <div className="mx-auto flex max-w-[920px] flex-col gap-12 px-4 py-8 md:px-8">
          <header className="flex flex-col gap-2">
            <Text size={7} weight="bolder" children="Componenti" />
            <Text size={2} className="max-w-[70ch] text-muted-fg">
              Catalogo dei {TOTAL} componenti in src/components: per ognuno
              trovi a cosa serve, esempi funzionanti con il relativo codice e
              l'elenco delle props.
            </Text>
          </header>

          {!visible.length && (
            <div className="flex flex-col items-start gap-3">
              <Text children={`Nessun componente corrisponde a "${search}".`} />
              <Btn
                icon="close"
                label="Azzera ricerca"
                onClick={() => setSearch("")}
              />
            </div>
          )}

          {visible.map(category => (
            <div key={category.id} className="flex flex-col gap-12">
              <div className="flex items-center gap-2 border-b border-solid border-border pb-2">
                <Icon className="text-primary" children={category.icon} />
                <Text
                  size={3}
                  weight="bolder"
                  className="text-primary"
                  children={category.label}
                />
              </div>
              {category.entries.map(entry => (
                <DocSection
                  key={entry.id}
                  entry={entry}
                  category={category.label}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Docs = () => (
  <ToastProvider>
    <DocsShell />
  </ToastProvider>
);

export default Docs;
