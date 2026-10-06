import KpiIncompleteBadge from "./KpiIncompleteBadge";
import { formatNumber, formatPercent } from "./format";
import Text from "@/components/Text";
import type { Kpi } from "@/lib/kpi";

export interface IKpiTotal {
  kpi: Kpi;
}

export default function KpiTotal({ kpi }: IKpiTotal) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-2 border-0 border-t border-solid border-border px-4 py-4">
      <div>
        <Text size={0} className="uppercase text-muted-fg">
          PR settimana
        </Text>
        <Text size={7} weight="bolder" className="tabular-nums">
          {formatPercent(kpi.pr)}
        </Text>
      </div>
      <div>
        <Text size={0} className="uppercase text-muted-fg">
          E_real
        </Text>
        <Text size={3} className="tabular-nums">
          {formatNumber(kpi.eReal, 1)} kWh
        </Text>
      </div>
      <div>
        <Text size={0} className="uppercase text-muted-fg">
          E_module
        </Text>
        <Text size={3} className="tabular-nums">
          {formatNumber(kpi.eModule, 1)} kWh
        </Text>
      </div>
      {kpi.incomplete && (
        <div className="pb-1">
          <KpiIncompleteBadge />
        </div>
      )}
    </div>
  );
}
