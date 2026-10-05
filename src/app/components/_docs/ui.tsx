"use client";

import * as React from "react";
import type { IDocEntry, IDocExample, IDocProp } from "./types";
import Accordion from "@/components/Accordion";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import Text from "@/components/Text";
import { Collapse } from "@/components/Transitions";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";

export const CodeBlock = ({
  code,
  className,
}: {
  code: string;
  className?: string;
}) => {
  const { showToast } = useToast();

  return (
    <div className={cn("relative rounded bg-[#241a12]", className)}>
      <pre className="m-0 overflow-x-auto p-3 pr-12 font-mono text-xs leading-relaxed text-[#f3e9dc]">
        <code>{code}</code>
      </pre>
      <div className="absolute right-1 top-1">
        <Btn
          small
          icon="file_copy"
          tooltip="Copia"
          color="#f3e9dc"
          iconClassName="text-[#f3e9dc]"
          copyToClipboard={code}
          onCopyToClipboard={() =>
            showToast({ variant: "info", message: "Codice copiato" })
          }
        />
      </div>
    </div>
  );
};

const Example = ({
  title,
  description,
  code,
  Demo,
  previewClassName,
}: IDocExample) => {
  const [showCode, setShowCode] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-solid border-border bg-card">
      <div className="flex items-center gap-2 border-b border-solid border-border py-1 pl-4 pr-1">
        <div className="min-w-0 flex-1 py-1">
          <Text weight="bolder" children={title} />
          {description && (
            <Text size={0} className="text-muted-fg" children={description} />
          )}
        </div>
        <Btn
          small
          icon="code"
          label={showCode ? "Nascondi codice" : "Codice"}
          selected={showCode}
          onClick={() => setShowCode(prev => !prev)}
        />
      </div>
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 p-5",
          previewClassName
        )}
      >
        <Demo />
      </div>
      <Collapse open={showCode}>
        <CodeBlock code={code} className="rounded-none" />
      </Collapse>
    </div>
  );
};

const PropsTable = ({ props }: { props: IDocProp[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[560px] border-collapse text-left text-sm text-fg">
      <thead>
        <tr className="text-xs text-muted-fg">
          <th className="px-2 py-1 font-normal">Prop</th>
          <th className="px-2 py-1 font-normal">Tipo</th>
          <th className="px-2 py-1 font-normal">Default</th>
          <th className="px-2 py-1 font-normal">Descrizione</th>
        </tr>
      </thead>
      <tbody>
        {props.map(p => (
          <tr key={p.name} className="border-t border-solid border-border">
            <td className="whitespace-nowrap px-2 py-1.5 align-top font-mono text-xs font-bold">
              {p.name}
              {p.required && <span className="ml-0.5 text-fail">*</span>}
            </td>
            <td className="px-2 py-1.5 align-top font-mono text-xs text-primary">
              {p.type}
            </td>
            <td className="whitespace-nowrap px-2 py-1.5 align-top font-mono text-xs text-muted-fg">
              {p.def ?? "—"}
            </td>
            <td className="px-2 py-1.5 align-top">{p.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DocSection = ({
  entry,
  category,
}: {
  entry: IDocEntry;
  category: string;
}) => (
  <section data-doc-section={entry.id} className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <Text size={5} weight="bolder" children={entry.name} />
      <Badge label={category} />
    </div>
    <Text size={2} className="max-w-[75ch]" children={entry.description} />
    {entry.notes?.map(note => (
      <div
        key={note}
        className="max-w-[75ch] rounded border-l-4 border-solid border-primary bg-muted-bg px-3 py-2"
      >
        <Text children={note} />
      </div>
    ))}
    <CodeBlock code={entry.importCode} />
    {entry.examples.map((example: IDocExample) => (
      <Example key={example.title} {...example} />
    ))}
    {!!entry.props.length && (
      <Accordion
        titleIcon="list"
        title={`Props (${entry.props.length})`}
        contentClassName="p-2"
      >
        <PropsTable props={entry.props} />
        {entry.props.some(p => p.required) && (
          <Text size={0} className="px-2 text-muted-fg">
            <>
              <span className="text-fail">*</span> obbligatoria
            </>
          </Text>
        )}
      </Accordion>
    )}
  </section>
);
