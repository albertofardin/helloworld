import { formatDateTime, formatNumber } from "./format";
import Text from "@/components/Text";
import type { Sample } from "@/lib/higeco";

export interface ISamplesTable {
  timeZone: string;
  samples: Sample[];
  energyUnit: string;
  radiationUnit: string;
}

const headClassName =
  "sticky top-0 border-0 border-y border-solid border-border bg-card px-4 py-2";
const cellClassName = "px-4 py-2 tabular-nums";

export default function SamplesTable({
  timeZone,
  samples,
  energyUnit,
  radiationUnit,
}: ISamplesTable) {
  return (
    <div className="min-h-[320px] flex-1 overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={`${headClassName} text-left`}>
              <Text weight="bolder">Data e ora ({timeZone})</Text>
            </th>
            <th className={`${headClassName} text-right`}>
              <Text weight="bolder">Irraggiamento ({radiationUnit})</Text>
            </th>
            <th className={`${headClassName} text-right`}>
              <Text weight="bolder">Energia ({energyUnit})</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {samples.map(sample => (
            <tr key={sample.timestamp} className="even:bg-muted-bg">
              <td className={cellClassName}>
                <Text>{formatDateTime(sample.timestamp, timeZone)}</Text>
              </td>
              <td className={`${cellClassName} text-right`}>
                <Text>{formatNumber(sample.radiation)}</Text>
              </td>
              <td className={`${cellClassName} text-right`}>
                <Text>{formatNumber(sample.energy, 1)}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
