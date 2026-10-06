"use client";

import * as React from "react";
import SamplesChart from "./SamplesChart";
import SamplesTable from "./SamplesTable";
import Btn from "@/components/Btn";
import Card from "@/components/Card";
import Text from "@/components/Text";
import type { Sample } from "@/lib/higeco";
import { cn } from "@/lib/utils";

type View = "chart" | "table";

const views: { value: View; label: string }[] = [
  { value: "table", label: "Tabella" },
  { value: "chart", label: "Grafico" },
];

export interface ISamplesPanel {
  timeZone: string;
  samples: Sample[];
  energyUnit: string;
  radiationUnit: string;
}

export default function SamplesPanel(props: ISamplesPanel) {
  const [view, setView] = React.useState<View>("chart");

  return (
    <Card
      className={cn(
        "flex-col items-stretch justify-start overflow-hidden",
        // la tabella occupa l'altezza rimasta e scorre al suo interno
        view === "table" && "min-h-0 flex-1"
      )}
    >
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <div className="mr-auto">
          <Text size={3} weight="bolder">
            Dati orari
          </Text>
          <Text size={0} className="text-muted-fg">
            Energia e Irraggiamento ({props.timeZone})
          </Text>
        </div>
        <div
          role="group"
          aria-label="Visualizzazione dei dati orari"
          className="flex border rounded overflow-hidden border-border"
        >
          {views.map(({ value, label }) => (
            <Btn
              key={value}
              small
              label={label}
              selected={view === value}
              onClick={() => setView(value)}
              className="border-0 rounded-none"
            />
          ))}
        </div>
      </div>
      {!props.samples.length ? (
        <div className="border-0 border-t border-solid border-border p-4">
          <Text className="text-muted-fg">Nessun dato da mostrare</Text>
        </div>
      ) : view === "chart" ? (
        <SamplesChart {...props} />
      ) : (
        <SamplesTable {...props} />
      )}
    </Card>
  );
}
