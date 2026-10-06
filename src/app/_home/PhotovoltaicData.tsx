import InfoHeader from "./InfoHeader";
import MissingDataNotice from "./MissingDataNotice";
import SamplesTable from "./SamplesTable";
import { getPhotovoltaicData } from "@/lib/higeco";

export default async function PhotovoltaicData() {
  const { plant, device, log, items, lastWeek, lastAvailable } =
    await getPhotovoltaicData();

  console.log("[higeco]", {
    plant,
    device,
    log,
    items,
    lastWeek,
    lastAvailable,
  });

  // Senza dati nell'ultima settimana si mostra l'ultima settimana disponibile
  const shown = lastAvailable ?? lastWeek;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-4 p-6">
      <InfoHeader
        plant={plant}
        device={device}
        log={log}
        period={shown.period}
      />
      {!lastWeek.samples.length && (
        <MissingDataNotice
          timeZone={plant.timezone}
          lastWeek={lastWeek.period}
          shown={lastAvailable?.period}
        />
      )}
      <SamplesTable
        timeZone={plant.timezone}
        samples={shown.samples}
        energyUnit={items.energy.unit}
        radiationUnit={items.radiation.unit}
      />
    </div>
  );
}
