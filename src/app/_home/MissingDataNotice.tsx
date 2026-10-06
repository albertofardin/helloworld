import { formatDateTime } from "./format";
import Icon from "@/components/Icon";
import Text from "@/components/Text";
import type { Period } from "@/lib/higeco";

export interface IMissingDataNotice {
  timeZone: string;
  shown?: Period;
}

export default function MissingDataNotice({
  timeZone,
  shown,
}: IMissingDataNotice) {
  return (
    <div
      role="status"
      className="flex min-w-[260px] flex-1 items-center gap-3 rounded-lg bg-[color-mix(in_srgb,var(--warn)_18%,var(--card))] px-4 py-3"
    >
      <Icon className="shrink-0">warning</Icon>
      <div>
        <Text weight="bolder">
          Nessun dato registrato nell&apos;ultima settimana
        </Text>
        <Text>
          {shown
            ? `La tabella mostra l'ultima settimana disponibile: ${formatDateTime(shown.from, timeZone)} - ${formatDateTime(shown.to, timeZone)}.`
            : "Non risultano dati precedenti per questo log."}
        </Text>
      </div>
    </div>
  );
}
