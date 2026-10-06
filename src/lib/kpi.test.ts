import { describe, expect, it } from "vitest";
import type { Sample } from "./higeco";
import { computeDailyKpi, computeTotalKpi, type DailyKpi } from "./kpi";

const HOUR = 3600;
// Offset usato per costruire i campioni: ora locale = UTC + 2h
const OFFSET = 2 * HOUR;

// Campione all'ora locale indicata del giorno `day` di settembre 2026
const sample = (
  day: number,
  hour: number,
  energy: number | null,
  radiation: number | null
): Sample => {
  const local = Date.UTC(2026, 8, day, 0, 0, 0) / 1000 + hour * HOUR;
  return {
    timestamp: local - OFFSET,
    date: new Date((local - OFFSET) * 1000).toISOString(),
    localDate: new Date(local * 1000).toISOString().slice(0, 19),
    energy,
    radiation,
  };
};

// Giorno completo di 24 campioni orari; energy e radiation dipendono dall'ora
const fullDay = (
  day: number,
  energy: (hour: number) => number | null,
  radiation: (hour: number) => number | null
) =>
  Array.from({ length: 24 }, (_, hour) =>
    sample(day, hour, energy(hour), radiation(hour))
  );

const dailyKpi = (day: string, kpi: Partial<DailyKpi>): DailyKpi => ({
  day,
  eReal: null,
  eModule: null,
  pr: null,
  samples: 24,
  incomplete: false,
  ...kpi,
});

describe("computeDailyKpi", () => {
  it("calcola E_real, E_module e PR di un giorno completo", () => {
    // 23 intervalli da 1h a 500 W/m²: E_module = 4 kW · 0,5 · 23 h = 46 kWh
    const [kpi] = computeDailyKpi(
      fullDay(
        10,
        hour => 100 + hour,
        () => 500
      )
    );

    expect(kpi).toEqual({
      day: "2026-09-10",
      eReal: 23,
      eModule: 46,
      pr: 50,
      samples: 24,
      incomplete: false,
    });
  });

  it("usa come E_real la differenza tra massimo e minimo del giorno", () => {
    const energies = [205, 200, 212, 208];
    const [kpi] = computeDailyKpi(
      energies.map((energy, hour) => sample(10, hour, energy, 100))
    );

    expect(kpi.eReal).toBe(12);
  });

  it("ricava Δt dai timestamp e non assume campioni orari", () => {
    // campioni ogni 30 minuti a 1000 W/m²: 4 intervalli da 0,5 h = 8 kWh
    const samples = [0, 0.5, 1, 1.5, 2].map(hour =>
      sample(10, hour, 10 + hour, 1000)
    );

    expect(computeDailyKpi(samples)[0].eModule).toBe(8);
  });

  it("pesa ogni intervallo con l'irraggiamento del campione finale", () => {
    const samples = [
      sample(10, 10, 0, 999),
      sample(10, 11, 1, 250),
      sample(10, 12, 2, 750),
    ];

    // 4 · (0,25 · 1 + 0,75 · 1) = 4 kWh: il primo campione non ha un Δt
    expect(computeDailyKpi(samples)[0].eModule).toBe(4);
  });

  it("raggruppa per giorno locale e ordina giorni e campioni", () => {
    const samples = [
      ...fullDay(
        11,
        hour => 200 + hour,
        () => 500
      ),
      ...fullDay(
        10,
        hour => 100 + hour,
        () => 500
      ).reverse(),
    ];

    const daily = computeDailyKpi(samples);

    expect(daily.map(kpi => kpi.day)).toEqual(["2026-09-10", "2026-09-11"]);
    expect(daily.map(kpi => kpi.eModule)).toEqual([46, 46]);
  });

  it("assegna al giorno locale un campione che in UTC cade il giorno prima", () => {
    // 00:30 locali dell'11/09 sono le 22:30 UTC del 10/09
    const [kpi] = computeDailyKpi([sample(11, 0.5, 1, 0)]);

    expect(kpi.day).toBe("2026-09-11");
  });

  it("restituisce un elenco vuoto senza campioni", () => {
    expect(computeDailyKpi([])).toEqual([]);
  });

  describe("dati mancanti", () => {
    it("allarga Δt sopra un campione mancante e segnala il giorno", () => {
      const samples = fullDay(
        10,
        hour => 100 + hour,
        () => 500
      ).filter((_, hour) => hour !== 12);

      const [kpi] = computeDailyKpi(samples);

      // l'intervallo 11→13 vale 2h: la somma resta 23 h a 500 W/m²
      expect(kpi.eModule).toBe(46);
      expect(kpi.samples).toBe(23);
      expect(kpi.incomplete).toBe(true);
    });

    it("scarta un irraggiamento mancante e segnala il giorno", () => {
      const [kpi] = computeDailyKpi(
        fullDay(
          10,
          hour => 100 + hour,
          hour => (hour === 7 ? null : 500)
        )
      );

      expect(kpi.eModule).toBe(46);
      expect(kpi.pr).toBe(50);
      expect(kpi.incomplete).toBe(true);
    });

    it("ignora un'energia mancante nel massimo e nel minimo", () => {
      const [kpi] = computeDailyKpi(
        fullDay(
          10,
          hour => (hour === 0 || hour === 23 ? null : 100 + hour),
          () => 500
        )
      );

      // restano i valori da 101 a 122
      expect(kpi.eReal).toBe(21);
      expect(kpi.incomplete).toBe(true);
    });

    it("segnala come incompleto un giorno coperto solo in parte", () => {
      const samples = fullDay(
        10,
        hour => 100 + hour,
        () => 500
      ).slice(14);

      const [kpi] = computeDailyKpi(samples);

      expect(kpi.samples).toBe(10);
      expect(kpi.pr).not.toBeNull();
      expect(kpi.incomplete).toBe(true);
    });

    it("non calcola il PR se E_module è zero", () => {
      const [kpi] = computeDailyKpi(
        fullDay(
          10,
          () => 300,
          () => 0
        )
      );

      expect(kpi.eReal).toBe(0);
      expect(kpi.eModule).toBe(0);
      expect(kpi.pr).toBeNull();
    });

    it("non calcola nulla con un solo campione", () => {
      const [kpi] = computeDailyKpi([sample(10, 12, 100, 500)]);

      expect(kpi).toMatchObject({ eReal: null, eModule: null, pr: null });
      expect(kpi.incomplete).toBe(true);
    });

    it("non calcola il PR se tutti i valori di una serie mancano", () => {
      const [kpi] = computeDailyKpi(
        fullDay(
          10,
          () => null,
          () => 500
        )
      );

      expect(kpi.eReal).toBeNull();
      expect(kpi.eModule).toBe(46);
      expect(kpi.pr).toBeNull();
    });
  });
});

describe("computeTotalKpi", () => {
  it("rapporta le somme giornaliere, non fa la media dei PR", () => {
    const total = computeTotalKpi([
      dailyKpi("2026-09-10", { eReal: 10, eModule: 10, pr: 100 }),
      dailyKpi("2026-09-11", { eReal: 10, eModule: 30, pr: 33.3 }),
    ]);

    expect(total.eReal).toBe(20);
    expect(total.eModule).toBe(40);
    // la media dei PR giornalieri darebbe 66,7
    expect(total.pr).toBe(50);
    expect(total.samples).toBe(48);
    expect(total.incomplete).toBe(false);
  });

  it("esclude dalle somme i giorni senza PR ma ne conta i campioni", () => {
    const total = computeTotalKpi([
      dailyKpi("2026-09-10", { eReal: 20, eModule: 40, pr: 50 }),
      // E_module c'è ma manca E_real: il PR del giorno non è calcolabile
      dailyKpi("2026-09-11", { eModule: 30, samples: 3 }),
      dailyKpi("2026-09-12", { eReal: 5, eModule: 0, samples: 24 }),
    ]);

    expect(total.eReal).toBe(20);
    expect(total.eModule).toBe(40);
    expect(total.pr).toBe(50);
    expect(total.samples).toBe(51);
  });

  it("è incompleto se lo è almeno un giorno", () => {
    const total = computeTotalKpi([
      dailyKpi("2026-09-10", { eReal: 20, eModule: 40, pr: 50 }),
      dailyKpi("2026-09-11", {
        eReal: 20,
        eModule: 40,
        pr: 50,
        incomplete: true,
      }),
    ]);

    expect(total.incomplete).toBe(true);
  });

  it("non calcola nulla senza giorni validi", () => {
    expect(computeTotalKpi([])).toEqual({
      eReal: null,
      eModule: null,
      pr: null,
      samples: 0,
      incomplete: false,
    });
    expect(computeTotalKpi([dailyKpi("2026-09-10", {})]).pr).toBeNull();
  });

  it("coincide con il calcolo sui campioni di più giorni", () => {
    const daily = computeDailyKpi([
      ...fullDay(
        10,
        hour => 100 + hour,
        () => 500
      ),
      ...fullDay(
        11,
        hour => 200 + 2 * hour,
        () => 1000
      ),
    ]);

    // giorno 1: 23 / 46 ; giorno 2: 46 / 92
    expect(computeTotalKpi(daily)).toMatchObject({
      eReal: 69,
      eModule: 138,
      pr: 50,
      samples: 48,
    });
  });
});
