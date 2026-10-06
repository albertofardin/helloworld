import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPhotovoltaicData } from "./higeco";

const API_URL = "https://testing.higeco.com/api/v2";
const HOUR = 3600;
const WEEK = 7 * 24 * HOUR;
// Europe/Rome: UTC+2 con l'ora legale, UTC+1 con l'ora solare
const CEST = 2 * HOUR;

const utc = (iso: string) => Date.parse(iso) / 1000;
// getLogData esprime l'ora locale dell'impianto come epoch
const local = (iso: string) => Date.parse(`${iso}Z`) / 1000;

const NOW = utc("2026-10-06T12:00:00Z");

const plant = {
  id: 365,
  nodeId: 164,
  name: "Impianto",
  timezone: "Europe/Rome",
};
const device = {
  id: "DEV1",
  name: "Impianto",
  ip: "10.0.0.1",
  hwType: "GWC_V3",
  version: "1.0.0",
};
const log = { id: 42, name: "Fotovoltaico", samplingTime: 120 };
const energy = { id: 4200, name: "Energia", unit: "kWh" };
const radiation = { id: 4209, name: "Irraggiamento", unit: "W/m²" };

type Rows = unknown[][];
type FakeApi = {
  /** Righe [timestamp, energia, potenza, irraggiamento] per l'intervallo. */
  rows?: (from: number, to: number) => Rows;
  /** utc dell'ultimo valore registrato, restituito da getLastValue. */
  lastUtc?: number;
  /** Risposte che sostituiscono quelle predefinite, per percorso. */
  overrides?: Record<string, { status?: number; body?: unknown }>;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

// Finto portale Higeco: risponde agli endpoint usati da getPhotovoltaicData
function mockApi({ rows = () => [], lastUtc, overrides = {} }: FakeApi = {}) {
  const fetchMock = vi.fn(async (input: string, _init?: RequestInit) => {
    const url = new URL(input);
    const path = url.pathname.replace("/api/v2", "");

    const override = overrides[path];
    if (override) return json(override.body ?? {}, override.status);

    switch (path) {
      case "/authenticate":
        return json({ token: "session-token" });
      case "/plants":
        return json([{ ...plant, id: 1, name: "Altro impianto" }, plant]);
      case "/plants/365/devices":
        return json([device]);
      case "/plants/365/devices/DEV1/logs":
        return json([{ id: 7, name: "Meteo", samplingTime: 600 }, log]);
      case "/plants/365/devices/DEV1/logs/42/items":
        return json([energy, { id: 4201, name: "Potenza" }, radiation]);
      case "/getLogData/365/DEV1/42/":
        return json({
          log,
          items: [
            { ...energy, index: 1 },
            { id: 4201, name: "Potenza", index: 2 },
            { ...radiation, index: 3 },
          ],
          data: rows(
            Number(url.searchParams.get("from")),
            Number(url.searchParams.get("to"))
          ),
        });
      case "/getLastValue/365/DEV1/42/4200":
        return json({ items: lastUtc ? [{ ...energy, utc: lastUtc }] : [] });
      default:
        return json({ error: "notFound" }, 404);
    }
  });
  vi.stubGlobal("fetch", fetchMock);

  const calls = () =>
    fetchMock.mock.calls.map(([input, init]) => ({
      url: new URL(input),
      path: new URL(input).pathname.replace("/api/v2", ""),
      init,
    }));
  const logDataCalls = () =>
    calls()
      .filter(call => call.path.startsWith("/getLogData/"))
      .map(call => Object.fromEntries(call.url.searchParams));

  return { fetchMock, calls, logDataCalls };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW * 1000);
  vi.stubEnv("HIGECO_API_TOKEN", "api-token");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("autenticazione", () => {
  it("fallisce senza HIGECO_API_TOKEN, prima di chiamare l'API", async () => {
    vi.stubEnv("HIGECO_API_TOKEN", "");
    const { fetchMock } = mockApi();

    await expect(getPhotovoltaicData()).rejects.toThrow(
      "HIGECO_API_TOKEN non impostato"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("scambia il token API con un token di sessione e lo usa nelle richieste", async () => {
    const { calls } = mockApi();

    await getPhotovoltaicData();

    const [auth, ...others] = calls();
    expect(auth.url.href).toBe(`${API_URL}/authenticate`);
    expect(auth.init.method).toBe("POST");
    expect(JSON.parse(auth.init.body as string)).toEqual({
      apiToken: "api-token",
    });
    expect(others.length).toBeGreaterThan(0);
    for (const { init } of others) {
      expect(init.headers).toMatchObject({ authorization: "session-token" });
    }
  });

  it("segnala un token API rifiutato", async () => {
    mockApi({ overrides: { "/authenticate": { status: 401 } } });

    await expect(getPhotovoltaicData()).rejects.toThrow(
      "Higeco authenticate: HTTP 401"
    );
  });
});

describe("gerarchia plant → device → log → items", () => {
  it("trova per nome gli elementi richiesti dall'esercizio", async () => {
    mockApi();

    const data = await getPhotovoltaicData();

    expect(data.plant).toEqual(plant);
    expect(data.device).toEqual(device);
    expect(data.log).toEqual(log);
    expect(data.items).toEqual({ energy, radiation });
    expect(data.now).toBe(NOW);
  });

  it("segnala un elemento non trovato", async () => {
    mockApi({
      overrides: {
        "/plants/365/devices/DEV1/logs": {
          body: [{ id: 7, name: "Meteo", samplingTime: 600 }],
        },
      },
    });

    await expect(getPhotovoltaicData()).rejects.toThrow(
      'Higeco: log "Fotovoltaico" non trovato'
    );
  });

  it("segnala un errore HTTP indicando il percorso", async () => {
    mockApi({ overrides: { "/plants/365/devices": { status: 500 } } });

    await expect(getPhotovoltaicData()).rejects.toThrow(
      "Higeco GET /plants/365/devices: HTTP 500"
    );
  });
});

describe("ultima settimana", () => {
  it("chiede i campioni orari degli ultimi 7 giorni, in ora locale", async () => {
    const { logDataCalls } = mockApi({
      rows: () => [[local("2026-10-06T10:00:00"), 100, 1, 500]],
    });

    const data = await getPhotovoltaicData();

    expect(logDataCalls()).toEqual([
      {
        from: String(NOW - WEEK + CEST),
        to: String(NOW + CEST),
        samplingTime: "3600",
      },
    ]);
    expect(data.selected).toBe(false);
    expect(data.emptyLastWeek).toBeNull();
    expect(data.week.period).toEqual({ from: NOW - WEEK, to: NOW });
  });

  it("converte i timestamp in UTC e legge le colonne dall'indice dell'item", async () => {
    mockApi({
      rows: () => [
        [local("2026-10-06T10:00:00"), 100.5, 3.2, 640],
        [local("2026-10-06T11:00:00"), 102, 3.9, 700],
      ],
    });

    const { week } = await getPhotovoltaicData();

    expect(week.samples).toEqual([
      {
        timestamp: utc("2026-10-06T08:00:00Z"),
        date: "2026-10-06T08:00:00.000Z",
        localDate: "2026-10-06T10:00:00",
        energy: 100.5,
        radiation: 640,
      },
      {
        timestamp: utc("2026-10-06T09:00:00Z"),
        date: "2026-10-06T09:00:00.000Z",
        localDate: "2026-10-06T11:00:00",
        energy: 102,
        radiation: 700,
      },
    ]);
  });

  it("trasforma in null i valori non numerici", async () => {
    mockApi({
      rows: () => [
        [local("2026-10-06T10:00:00"), "#E2", 0, 640],
        [local("2026-10-06T11:00:00"), 102, 0, null],
        [local("2026-10-06T12:00:00"), 103],
      ],
    });

    const { week } = await getPhotovoltaicData();

    expect(
      week.samples.map(({ energy, radiation }) => [energy, radiation])
    ).toEqual([
      [null, 640],
      [102, null],
      [103, null],
    ]);
  });
});

describe("ultima settimana senza dati", () => {
  it("ripiega sulla settimana che termina con l'ultimo valore registrato", async () => {
    const lastUtc = utc("2026-09-25T12:50:00Z");
    const { logDataCalls } = mockApi({
      lastUtc,
      // ci sono dati solo fino all'ultimo valore registrato
      rows: (_from, to) =>
        to <= lastUtc + CEST ? [[lastUtc + CEST, 200, 0, 300]] : [],
    });

    const data = await getPhotovoltaicData();

    expect(data.selected).toBe(false);
    expect(data.emptyLastWeek).toEqual({ from: NOW - WEEK, to: NOW });
    expect(data.week.period).toEqual({ from: lastUtc - WEEK, to: lastUtc });
    expect(data.week.samples).toHaveLength(1);
    expect(data.week.samples[0].timestamp).toBe(lastUtc);
    expect(logDataCalls()[1]).toMatchObject({
      from: String(lastUtc - WEEK + CEST),
      to: String(lastUtc + CEST),
    });
  });

  it("resta sull'ultima settimana, vuota, se non esiste un ultimo valore", async () => {
    const { logDataCalls } = mockApi();

    const data = await getPhotovoltaicData();

    expect(data.emptyLastWeek).toEqual({ from: NOW - WEEK, to: NOW });
    expect(data.week).toEqual({
      period: { from: NOW - WEEK, to: NOW },
      samples: [],
    });
    expect(logDataCalls()).toHaveLength(1);
  });
});

describe("settimana scelta", () => {
  it("mostra i 7 giorni interi dalla mezzanotte locale della data", async () => {
    const { logDataCalls, calls } = mockApi();

    const data = await getPhotovoltaicData("2026-09-10");

    // mezzanotte a Roma con l'ora legale = 22:00 UTC del giorno prima
    expect(data.week.period).toEqual({
      from: utc("2026-09-09T22:00:00Z"),
      to: utc("2026-09-16T21:59:59Z"),
    });
    expect(logDataCalls()).toEqual([
      {
        from: String(local("2026-09-10T00:00:00")),
        to: String(local("2026-09-16T23:59:59")),
        samplingTime: "3600",
      },
    ]);
    expect(data.selected).toBe(true);
    // una settimana scelta vuota non fa scattare il ripiego
    expect(data.emptyLastWeek).toBeNull();
    expect(calls().some(call => call.path.startsWith("/getLastValue/"))).toBe(
      false
    );
  });

  it("usa l'offset dell'ora solare in inverno", async () => {
    mockApi();

    const { week } = await getPhotovoltaicData("2026-01-10");

    expect(week.period).toEqual({
      from: utc("2026-01-09T23:00:00Z"),
      to: utc("2026-01-16T22:59:59Z"),
    });
  });

  it("gestisce una settimana a cavallo del cambio dell'ora", async () => {
    mockApi();

    // l'ora legale termina domenica 25/10/2026: la settimana dura 169 ore
    const { week } = await getPhotovoltaicData("2026-10-20");

    expect(week.period).toEqual({
      from: utc("2026-10-19T22:00:00Z"),
      to: utc("2026-10-26T22:59:59Z"),
    });
  });

  it("converte in UTC i campioni delle ore attorno al cambio dell'ora", async () => {
    mockApi({
      rows: () => [
        // ancora ora legale (UTC+2): il cambio avviene all'01:00 UTC
        [local("2026-10-25T01:30:00"), 10, 0, 0],
        // già ora solare (UTC+1)
        [local("2026-10-25T03:30:00"), 10, 0, 0],
      ],
    });

    const { week } = await getPhotovoltaicData("2026-10-20");

    expect(week.samples.map(sample => sample.date)).toEqual([
      "2026-10-24T23:30:00.000Z",
      "2026-10-25T02:30:00.000Z",
    ]);
  });

  it.each(["boh", "2026-9-1", "2026-13-40", ""])(
    "ignora la data non valida %j e mostra l'ultima settimana",
    async weekFrom => {
      mockApi({ rows: () => [[local("2026-10-06T10:00:00"), 100, 1, 500]] });

      const data = await getPhotovoltaicData(weekFrom);

      expect(data.selected).toBe(false);
      expect(data.week.period).toEqual({ from: NOW - WEEK, to: NOW });
    }
  );
});
