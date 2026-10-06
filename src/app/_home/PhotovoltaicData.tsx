import InfoHeader from "./InfoHeader";
import KpiPanel from "./KpiPanel";
import MissingDataNotice from "./MissingDataNotice";
import SamplesPanel from "./SamplesPanel";
import { WeekContent, WeekNavigationProvider } from "./WeekNavigation";
import WeekSelector from "./WeekSelector";
import { toDay } from "./format";
import Divider from "@/components/Divider";
import { getPhotovoltaicData } from "@/lib/higeco";
import { computeDailyKpi, computeTotalKpi } from "@/lib/kpi";

export interface IPhotovoltaicData {
  /** Primo giorno della settimana scelta dall'utente, "YYYY-MM-DD". */
  weekFrom?: string;
}

export default async function PhotovoltaicData({
  weekFrom,
}: IPhotovoltaicData) {
  const { now, selected, plant, device, log, items, week, emptyLastWeek } =
    await getPhotovoltaicData(weekFrom);

  const daily = computeDailyKpi(week.samples);
  const total = computeTotalKpi(daily);

  return (
    <WeekNavigationProvider>
      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col">
        <div className="mx-auto max-w-5xl w-full flex-1 flex flex-col gap-4 p-6">
          <InfoHeader plant={plant} device={device} log={log} />
          <Divider />
          <WeekSelector
            value={toDay(week.period.from, plant.timezone)}
            max={toDay(now, plant.timezone)}
            selected={selected}
          >
            {emptyLastWeek && (
              <MissingDataNotice
                timeZone={plant.timezone}
                shown={week.samples.length ? week.period : undefined}
              />
            )}
          </WeekSelector>
          <WeekContent>
            <KpiPanel daily={daily} total={total} />
            <SamplesPanel
              timeZone={plant.timezone}
              samples={week.samples}
              energyUnit={items.energy.unit}
              radiationUnit={items.radiation.unit}
            />
          </WeekContent>
        </div>
      </div>
    </WeekNavigationProvider>
  );
}
