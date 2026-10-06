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
