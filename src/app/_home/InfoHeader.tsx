import InfoCard from "./InfoCard";
import { formatDateTime } from "./format";
import type { Device, Log, Period, Plant } from "@/lib/higeco";

export interface IInfoHeader {
  plant: Plant;
  device: Device;
  log: Log;
  period: Period;
}

export default function InfoHeader({
  plant,
  device,
  log,
  period,
}: IInfoHeader) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <InfoCard
        title="Plant"
        icon="light_mode"
        name={plant.name}
        details={[
          { label: "ID", value: plant.id },
          { label: "Fuso orario", value: plant.timezone },
        ]}
      />
      <InfoCard
        title="Device"
        icon="important_devices"
        name={device.name}
        details={[
          { label: "ID", value: device.id },
          { label: "IP", value: device.ip },
          { label: "Hardware", value: `${device.hwType} · v${device.version}` },
        ]}
      />
      <InfoCard
        title="Log"
        icon="description"
        name={log.name}
        details={[
          { label: "ID", value: log.id },
          { label: "Dal", value: formatDateTime(period.from, plant.timezone) },
          { label: "Al", value: formatDateTime(period.to, plant.timezone) },
        ]}
      />
    </div>
  );
}
