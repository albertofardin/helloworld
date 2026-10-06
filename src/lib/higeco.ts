// Chiamate fatte lato server: il browser non contatta mai testing.higeco.com,
// quindi niente "cross origin request blocked".
const API_URL = "https://testing.higeco.com/api/v2";

const PLANT_NAME = "Impianto";
const DEVICE_NAME = "Impianto";
const LOG_NAME = "Fotovoltaico";
const ENERGY_NAME = "Energia";
const RADIATION_NAME = "Irraggiamento";

const HOUR = 3600;
const WEEK = 7 * 24 * HOUR;

export type Plant = {
  id: number;
  nodeId: number;
  name: string;
  timezone: string;
};
export type Device = {
  id: string;
  name: string;
  ip: string;
  hwType: string;
  version: string;
};
export type Log = { id: number; name: string; samplingTime: number };
export type Item = { id: number; name: string; unit: string };
export type Sample = {
  timestamp: number;
  date: string;
  localDate: string;
  energy: number | null;
  radiation: number | null;
};
export type Period = { from: number; to: number };

async function authenticate(): Promise<string> {
  const apiToken = process.env.HIGECO_API_TOKEN;
  if (!apiToken) throw new Error("Higeco: HIGECO_API_TOKEN non impostato");
  const res = await fetch(`${API_URL}/authenticate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ apiToken }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Higeco authenticate: HTTP ${res.status}`);
  const { token } = await res.json();
  return token;
}

async function get<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { accept: "application/json", authorization: token },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Higeco GET ${path}: HTTP ${res.status}`);
  return res.json();
}

function findByName<T extends { name: string }>(
  list: T[],
  name: string,
  kind: string
): T {
  const found = list.find(el => name.includes(el.name));
  if (!found) throw new Error(`Higeco: ${kind} "${name}" non trovato`);
  return found;
}

// Offset in secondi del fuso orario rispetto a UTC, nell'istante indicato
function timezoneOffset(timeZone: string, utc: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(utc * 1000));
  const part = (type: string) =>
    Number(parts.find(el => el.type === type).value);
  const local = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour"),
    part("minute"),
    part("second")
  );
  return local / 1000 - utc;
}

// L'API segnala i valori non validi con stringhe tipo "#E2"
const toNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

export async function getPhotovoltaicData() {
  const token = await authenticate();

  const plants = await get<Plant[]>(token, "/plants");
  const plant = findByName(plants, PLANT_NAME, "plant");

  const devices = await get<Device[]>(token, `/plants/${plant.id}/devices`);
  const device = findByName(devices, DEVICE_NAME, "device");

  const logsPath = `/plants/${plant.id}/devices/${device.id}/logs`;
  const logs = await get<Log[]>(token, logsPath);
  const log = findByName(logs, LOG_NAME, "log");

  const items = await get<Item[]>(token, `${logsPath}/${log.id}/items`);
  const energy = findByName(items, ENERGY_NAME, "item");
  const radiation = findByName(items, RADIATION_NAME, "item");

  // getLogData lavora con timestamp "comprensivi dell'offset del fuso orario",
  // cioè l'ora locale dell'impianto espressa come epoch: from/to e i timestamp
  // restituiti vanno convertiti da/verso UTC.
  const toLocal = (utc: number) => utc + timezoneOffset(plant.timezone, utc);
  const toUtc = (local: number) => {
    const offset = timezoneOffset(plant.timezone, local);
    return local - timezoneOffset(plant.timezone, local - offset);
  };

  const dataPath = `/getLogData/${plant.id}/${device.id}/${log.id}/`;
  const getSamples = async (period: Period): Promise<Sample[]> => {
    const from = toLocal(period.from);
    const to = toLocal(period.to);
    const res = await get<{
      items: { id: number; index: number }[];
      data: unknown[][];
    }>(token, `${dataPath}?from=${from}&to=${to}&samplingTime=${HOUR}`);
    // data[i][0] è il timestamp, data[i][index] il valore dell'item
    const column = (id: number) => res.items.find(el => el.id === id)?.index;
    const energyColumn = column(energy.id);
    const radiationColumn = column(radiation.id);
    return (res.data ?? []).map(row => {
      const local = row[0] as number;
      const timestamp = toUtc(local);
      return {
        timestamp,
        date: new Date(timestamp * 1000).toISOString(),
        localDate: new Date(local * 1000).toISOString().slice(0, 19),
        energy: toNumber(row[energyColumn]),
        radiation: toNumber(row[radiationColumn]),
      };
    });
  };

  const now = Math.floor(Date.now() / 1000);
  const lastWeek: Period = { from: now - WEEK, to: now };
  const samples = await getSamples(lastWeek);

  // Se nell'ultima settimana il datalogger non ha registrato nulla, recupera
  // anche l'ultima settimana in cui i dati sono disponibili.
  let lastAvailable: { period: Period; samples: Sample[] } | null = null;
  if (!samples.length) {
    const last = await get<{ items: { utc: number }[] }>(
      token,
      `/getLastValue/${plant.id}/${device.id}/${log.id}/${energy.id}`
    );
    const lastUtc = last.items?.[0]?.utc;
    if (lastUtc) {
      const period = { from: lastUtc - WEEK, to: lastUtc };
      lastAvailable = { period, samples: await getSamples(period) };
    }
  }

  return {
    plant,
    device,
    log,
    items: { energy, radiation },
    lastWeek: { period: lastWeek, samples },
    lastAvailable,
  };
}
