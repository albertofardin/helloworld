import KpiIncompleteBadge from "./KpiIncompleteBadge";
import { formatDay, formatNumber, formatPercent } from "./format";
import Text from "@/components/Text";
import type { DailyKpi } from "@/lib/kpi";

export interface IKpiDailyTable {
  daily: DailyKpi[];
}

const headClassName =
  "border-0 border-y border-solid border-border px-4 py-2 text-right first:text-left";
const cellClassName = "px-4 py-2 text-right tabular-nums first:text-left";

export default function KpiDailyTable({ daily }: IKpiDailyTable) {
  if (!daily.length) {
    return (
      <div className="border-0 border-t border-solid border-border p-4">
        <Text className="text-muted-fg">
          Nessun dato su cui calcolare il PR
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={headClassName}>
              <Text weight="bolder">Giorno</Text>
            </th>
            <th className={headClassName}>
              <Text weight="bolder">E_real (kWh)</Text>
            </th>
            <th className={headClassName}>
              <Text weight="bolder">E_module (kWh)</Text>
            </th>
            <th className={headClassName}>
              <Text weight="bolder">PR</Text>
            </th>
            <th className={headClassName}>
              <Text weight="bolder">Campioni</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {daily.map(kpi => (
            <tr key={kpi.day} className="even:bg-muted-bg">
              <td className={cellClassName}>
                <Text>{formatDay(kpi.day)}</Text>
              </td>
              <td className={cellClassName}>
                <Text>{formatNumber(kpi.eReal, 1)}</Text>
              </td>
              <td className={cellClassName}>
                <Text>{formatNumber(kpi.eModule, 1)}</Text>
              </td>
              <td className={cellClassName}>
                <Text weight="bolder">{formatPercent(kpi.pr)}</Text>
              </td>
              <td className={cellClassName}>
                <div className="flex items-center justify-end gap-2">
                  {kpi.incomplete && <KpiIncompleteBadge />}
                  <Text>{kpi.samples}</Text>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
