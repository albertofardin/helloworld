import { formatDateTime } from "./format";
import Text from "@/components/Text";
import type { Period } from "@/lib/higeco";

export interface IMissingDataNotice {
  timeZone: string;
  lastWeek: Period;
  shown?: Period;
}

export default function MissingDataNotice({
  timeZone,
  lastWeek,
  shown,
}: IMissingDataNotice) {
  return (
    <div
      role="status"
      className="rounded-xl border border-solid border-warn bg-[color-mix(in_srgb,var(--warn)_15%,var(--card))] px-4 py-3"
    >
      <Text weight="bolder">
        Nessun dato registrato nell&apos;ultima settimana (
        {formatDateTime(lastWeek.from, timeZone)} –{" "}
        {formatDateTime(lastWeek.to, timeZone)})
      </Text>
      <Text>
        {shown
          ? `La tabella mostra l'ultima settimana disponibile, fino al ${formatDateTime(shown.to, timeZone)}.`
          : "Non risultano dati precedenti per questo log."}
      </Text>
    </div>
  );
}
