export const formatDateTime = (utc: number, timeZone: string) =>
  new Intl.DateTimeFormat("it-IT", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(utc * 1000));

export const formatNumber = (value: number | null, digits = 0) =>
  value === null
    ? "—"
    : value.toLocaleString("it-IT", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });

export const formatPercent = (value: number | null) =>
  value === null ? "n.d." : `${formatNumber(value, 1)} %`;

// day è "YYYY-MM-DD" → "DD/MM/YYYY"
export const formatDay = (day: string) => day.split("-").reverse().join("/");

// Giorno "YYYY-MM-DD" dell'istante indicato, nel fuso orario dato
export const toDay = (utc: number, timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(utc * 1000));
