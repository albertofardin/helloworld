import InfoCard from "./InfoCard";
import type { Device, Log, Plant } from "@/lib/higeco";

export interface IInfoHeader {
  plant: Plant;
  device: Device;
  log: Log;
}

export default function InfoHeader({ plant, device, log }: IInfoHeader) {
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
          { label: "Hardware", value: `${device.hwType} · v${device.version}` },
        ]}
      />
      <InfoCard
        title="Log"
        icon="description"
        name={log.name}
        details={[{ label: "ID", value: log.id }]}
      />
    </div>
  );
}
