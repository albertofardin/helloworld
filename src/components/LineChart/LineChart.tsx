"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Text from "../Text";
import { cn } from "@/lib/utils";

export type LineChartDatum = Record<string, number | null>;

export interface ILineChartSeries {
  /** Chiave del valore dentro ogni elemento di `data`. */
  key: string;
  label: string;
  color: string;
  unit?: string;
  /** Decimali mostrati nel tooltip e sull'asse. */
  digits?: number;
  /** Se true l'asse Y parte da zero, altrimenti si adatta ai valori. */
  fromZero?: boolean;
}

export interface ILineChart {
  className?: string;
  style?: React.CSSProperties;
  data: LineChartDatum[];
  /** Chiave numerica dell'asse X (es. un timestamp). */
  xKey: string;
  series: ILineChartSeries[];
  /** Posizioni delle tacche sull'asse X; se assenti le sceglie il grafico. */
  xTicks?: number[];
  /** Etichetta di una tacca dell'asse X. */
  formatXTick?: (x: number) => string;
  /** Intestazione del tooltip. */
  formatX?: (x: number) => string;
  /** Altezza in px di ciascun pannello. */
  panelHeight?: number;
  locale?: string;
}

const Y_AXIS_WIDTH = 64;
const AXIS_COLOR = "var(--muted-fg)";
const GRID_COLOR = "var(--border)";
const tick = { fill: AXIS_COLOR, fontSize: 12 };

const formatValue = (value: number | null, locale: string, digits = 0) =>
  value === null || value === undefined
    ? "—"
    : value.toLocaleString(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });

const withUnit = ({ label, unit }: ILineChartSeries) =>
  unit ? `${label} (${unit})` : label;

// Tratto colorato che identifica la serie accanto al suo nome
const LineKey = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    className="inline-block h-0.5 w-4 shrink-0 rounded-full"
    style={{ backgroundColor: color }}
  />
);

// Grafico a linee su un asse X condiviso. Ogni serie ha il proprio pannello e
// la propria scala Y: serie con unità o ordini di grandezza diversi restano
// leggibili senza ricorrere a un doppio asse.
const LineChart = ({
  className,
  style,
  data,
  xKey,
  series,
  xTicks,
  formatXTick = String,
  formatX = String,
  panelHeight = 180,
  locale = "it-IT",
}: ILineChart) => {
  const syncId = React.useId();
  // Il cursore è sincronizzato su tutti i pannelli, il tooltip compare solo
  // in quello sotto il puntatore e riporta i valori di tutte le serie.
  const [hovered, setHovered] = React.useState<string | null>(null);

  const renderTooltip = (seriesKey: string) => {
    const TooltipContent = ({
      active,
      payload,
    }: {
      active?: boolean;
      payload?: readonly { payload?: LineChartDatum }[];
    }) => {
      const datum = payload?.[0]?.payload;
      if (!active || !datum || hovered !== seriesKey) return null;
      return (
        <div className="rounded border border-solid border-border bg-card px-3 py-2 shadow-md">
          <Text size={0} className="text-muted-fg">
            {formatX(datum[xKey])}
          </Text>
          {series.map(s => (
            <div key={s.key} className="flex items-center gap-2">
              <LineKey color={s.color} />
              <Text weight="bolder" className="tabular-nums">
                {formatValue(datum[s.key], locale, s.digits)}
                {s.unit ? ` ${s.unit}` : ""}
              </Text>
              <Text size={0} className="text-muted-fg">
                {s.label}
              </Text>
            </div>
          ))}
        </div>
      );
    };
    return TooltipContent;
  };

  return (
    <div className={cn("flex w-full flex-col gap-12", className)} style={style}>
      {series.map((s, index) => {
        const last = index === series.length - 1;
        return (
          <div key={s.key} onPointerEnter={() => setHovered(s.key)}>
            {/* il titolo del pannello fa da legenda: tratto nel colore della
                serie accanto al nome */}
            <div className="flex items-center gap-2">
              <LineKey color={s.color} />
              <Text weight="bolder">{withUnit(s)}</Text>
            </div>
            <ResponsiveContainer width="100%" height={panelHeight}>
              <RechartsLineChart
                data={data}
                syncId={syncId}
                margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} stroke={GRID_COLOR} />
                <XAxis
                  dataKey={xKey}
                  type="number"
                  scale="time"
                  domain={["dataMin", "dataMax"]}
                  ticks={xTicks}
                  tickFormatter={formatXTick}
                  tick={last ? tick : false}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                  height={last ? 28 : 1}
                />
                <YAxis
                  width={Y_AXIS_WIDTH}
                  domain={s.fromZero ? [0, "auto"] : ["auto", "auto"]}
                  tickFormatter={value => formatValue(value, locale)}
                  tick={tick}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={renderTooltip(s.key)}
                  cursor={{ stroke: AXIS_COLOR, strokeWidth: 1 }}
                  isAnimationActive={false}
                />
                <Line
                  dataKey={s.key}
                  name={s.label}
                  type="linear"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: s.color,
                    stroke: "var(--card)",
                    strokeWidth: 2,
                  }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
};

export default LineChart;
