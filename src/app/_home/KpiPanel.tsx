"use client";

import * as React from "react";
import KpiDailyTable from "./KpiDailyTable";
import KpiTotal from "./KpiTotal";
import Btn from "@/components/Btn";
import Card from "@/components/Card";
import Text from "@/components/Text";
import type { DailyKpi, Kpi } from "@/lib/kpi";

type Mode = "day" | "week";

const modes: { value: Mode; label: string }[] = [
  { value: "day", label: "Giorno" },
  { value: "week", label: "Settimana" },
];

export interface IKpiPanel {
  daily: DailyKpi[];
  total: Kpi;
}

export default function KpiPanel({ daily, total }: IKpiPanel) {
  const [mode, setMode] = React.useState<Mode>("week");

  return (
    <Card className="flex-col items-stretch justify-start">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <div className="mr-auto">
          <Text size={3} weight="bolder">
            Performance Ratio
          </Text>
          <Text size={0} className="text-muted-fg">
            PR = E_real / E_module
          </Text>
        </div>
        <div
          role="group"
          aria-label="Periodo del KPI"
          className="flex border rounded overflow-hidden border-border"
        >
          {modes.map(({ value, label }) => (
            <Btn
              key={value}
              small
              label={label}
              selected={mode === value}
              onClick={() => setMode(value)}
              className="border-0 rounded-none"
            />
          ))}
        </div>
      </div>
      {mode === "day" ? (
        <KpiDailyTable daily={daily} />
      ) : (
        <KpiTotal kpi={total} />
      )}
    </Card>
  );
}
