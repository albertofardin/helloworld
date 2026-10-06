import type { Sample } from "./higeco";

// Potenza nominale dell'impianto simulato [kW]
const P_NOM = 4;
// Irraggiamento in condizioni di test standard [W/m²]
const IRR_STD = 1000;

const HOUR = 3600;
// I campioni sono orari: un intervallo più lungo indica campioni mancanti
const MAX_REGULAR_INTERVAL = 1.5 * HOUR;
// Un giorno i cui campioni coprono meno di così è considerato parziale
const MIN_FULL_DAY_SPAN = 22 * HOUR;

export type Kpi = {
  // Energia realmente prodotta [kWh]
  eReal: number | null;
  // Energia producibile dai moduli [kWh]
  eModule: number | null;
  // Performance Ratio [%], null quando non è calcolabile
  pr: number | null;
  samples: number;
  // true se nel periodo mancano campioni o valori
  incomplete: boolean;
};

export type DailyKpi = Kpi & {
  // Giorno nel fuso orario dell'impianto, "YYYY-MM-DD"
  day: string;
};

const ratio = (eReal: number | null, eModule: number | null) =>
  eReal !== null && eModule ? (eReal / eModule) * 100 : null;

// KPI di un singolo giorno. I campioni con un valore mancante vengono
// scartati dalla rispettiva serie: Δt è la differenza tra i timestamp dei
// campioni validi, quindi si allarga da solo a coprire i buchi.
function computeDayKpi(samples: Sample[]): Kpi {
  const energies = samples
    .map(sample => sample.energy)
    .filter(energy => energy !== null);
  const eReal =
    energies.length > 1 ? Math.max(...energies) - Math.min(...energies) : null;

  const radiations = samples.filter(sample => sample.radiation !== null);
  let irradiation = 0;
  let hasGap = false;
  for (let j = 1; j < radiations.length; j++) {
    const dt = radiations[j].timestamp - radiations[j - 1].timestamp;
    if (dt > MAX_REGULAR_INTERVAL) hasGap = true;
    irradiation += (radiations[j].radiation / IRR_STD) * (dt / HOUR);
  }
  const eModule = radiations.length > 1 ? P_NOM * irradiation : null;

  const span = samples.length
    ? samples[samples.length - 1].timestamp - samples[0].timestamp
    : 0;

  return {
    eReal,
    eModule,
    pr: ratio(eReal, eModule),
    samples: samples.length,
    incomplete:
      hasGap ||
      span < MIN_FULL_DAY_SPAN ||
      energies.length < samples.length ||
      radiations.length < samples.length,
  };
}

export function computeDailyKpi(samples: Sample[]): DailyKpi[] {
  const days = new Map<string, Sample[]>();
  for (const sample of samples) {
    const day = sample.localDate.slice(0, 10);
    days.set(day, [...(days.get(day) ?? []), sample]);
  }
  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, daySamples]) => ({
      day,
      ...computeDayKpi(
        [...daySamples].sort((a, b) => a.timestamp - b.timestamp)
      ),
    }));
}

// KPI dell'intero periodo: E_real resta la differenza max-min "nel giorno",
// quindi il totale è la somma dei giorni in cui il PR è calcolabile.
export function computeTotalKpi(daily: DailyKpi[]): Kpi {
  const valid = daily.filter(day => day.pr !== null);
  const eReal = valid.length
    ? valid.reduce((sum, day) => sum + day.eReal, 0)
    : null;
  const eModule = valid.length
    ? valid.reduce((sum, day) => sum + day.eModule, 0)
    : null;
  return {
    eReal,
    eModule,
    pr: ratio(eReal, eModule),
    samples: daily.reduce((sum, day) => sum + day.samples, 0),
    incomplete: daily.some(day => day.incomplete),
  };
}
