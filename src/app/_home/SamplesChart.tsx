"use client";

import * as React from "react";
import { formatDateTime } from "./format";
import LineChart, { type ILineChartSeries } from "@/components/LineChart";
import type { Sample } from "@/lib/higeco";

export interface ISamplesChart {
  timeZone: string;
  samples: Sample[];
  energyUnit: string;
  radiationUnit: string;
}

const formatDayTick = (utc: number, timeZone: string) =>
  new Intl.DateTimeFormat("it-IT", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(utc * 1000));

// Mezzanotte (ora dell'impianto) di ogni giorno coperto dai campioni
const getDayTicks = (samples: Sample[]) => {
  const ticks = new Map<string, number>();
  for (const { timestamp, localDate } of samples) {
    const [hours, minutes, seconds] = localDate
      .slice(11)
      .split(":")
      .map(Number);
    const midnight = timestamp - (hours * 3600 + minutes * 60 + seconds);
    ticks.set(localDate.slice(0, 10), midnight);
  }
  const first = samples[0]?.timestamp;
  return [...ticks.values()].filter(tick => tick >= first);
};

export default function SamplesChart({
  timeZone,
  samples,
  energyUnit,
  radiationUnit,
}: ISamplesChart) {
  const series = React.useMemo<ILineChartSeries[]>(
    () => [
      {
        key: "radiation",
        label: "Irraggiamento",
        color: "var(--chart-red)",
        unit: radiationUnit,
        fromZero: true,
      },
      {
        key: "energy",
        label: "Energia",
        color: "var(--chart-blue)",
        unit: energyUnit,
        digits: 1,
      },
    ],
    [energyUnit, radiationUnit]
  );
  const data = React.useMemo(
    () =>
      samples.map(({ timestamp, energy, radiation }) => ({
        timestamp,
        energy,
        radiation,
      })),
    [samples]
  );
  const xTicks = React.useMemo(() => getDayTicks(samples), [samples]);

  return (
    <LineChart
      className="p-4"
      data={data}
      xKey="timestamp"
      series={series}
      xTicks={xTicks}
      formatXTick={x => formatDayTick(x, timeZone)}
      formatX={x => formatDateTime(x, timeZone)}
    />
  );
}
