import { describe, expect, it } from "vitest";
import {
  formatDateTime,
  formatDay,
  formatNumber,
  formatPercent,
  toDay,
} from "./format";

const utc = (iso: string) => Date.parse(iso) / 1000;

describe("formatDateTime", () => {
  it("mostra data e ora nel fuso orario indicato", () => {
    const instant = utc("2026-09-18T12:50:00Z");

    expect(formatDateTime(instant, "Europe/Rome")).toBe("18/09/2026, 14:50");
    expect(formatDateTime(instant, "UTC")).toBe("18/09/2026, 12:50");
  });

  it("tiene conto dell'ora solare", () => {
    expect(formatDateTime(utc("2026-01-10T12:00:00Z"), "Europe/Rome")).toBe(
      "10/01/2026, 13:00"
    );
  });

  it("cambia giorno quando l'ora locale supera la mezzanotte", () => {
    expect(formatDateTime(utc("2026-09-18T22:30:00Z"), "Europe/Rome")).toBe(
      "19/09/2026, 00:30"
    );
  });
});

describe("formatNumber", () => {
  it("usa i separatori italiani", () => {
    expect(formatNumber(33380.8, 1)).toBe("33.380,8");
  });

  it("arrotonda ai decimali richiesti, zero se non indicati", () => {
    expect(formatNumber(654.6)).toBe("655");
    expect(formatNumber(12, 2)).toBe("12,00");
    expect(formatNumber(0)).toBe("0");
  });

  it("mostra un trattino per un valore mancante", () => {
    expect(formatNumber(null)).toBe("—");
    expect(formatNumber(null, 1)).toBe("—");
  });
});

describe("formatPercent", () => {
  it("mostra una cifra decimale e il simbolo", () => {
    expect(formatPercent(73.462)).toBe("73,5 %");
    expect(formatPercent(100)).toBe("100,0 %");
  });

  it("mostra n.d. quando il valore non è calcolabile", () => {
    expect(formatPercent(null)).toBe("n.d.");
  });
});

describe("formatDay", () => {
  it("converte YYYY-MM-DD in DD/MM/YYYY", () => {
    expect(formatDay("2026-09-18")).toBe("18/09/2026");
  });
});

describe("toDay", () => {
  it("restituisce il giorno YYYY-MM-DD nel fuso orario indicato", () => {
    const instant = utc("2026-09-18T22:30:00Z");

    expect(toDay(instant, "Europe/Rome")).toBe("2026-09-19");
    expect(toDay(instant, "UTC")).toBe("2026-09-18");
  });

  it("è l'inverso di formatDay per la stessa data", () => {
    const day = toDay(utc("2026-10-06T12:00:00Z"), "Europe/Rome");

    expect(day).toBe("2026-10-06");
    expect(formatDay(day)).toBe("06/10/2026");
  });
});
