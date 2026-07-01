import { describe, expect, it } from "vitest";

import { formatCurrency, formatPercent, formatUnits } from "@/lib/format";

// Neutralise les espaces insécables (U+00A0 / U+202F) insérés par Intl fr-FR.
const normalize = (s: string) => s.replace(/[  ]/g, " ");

describe("formatPercent", () => {
  it("préfixe un « + » pour une performance positive", () => {
    expect(formatPercent(0.42).startsWith("+")).toBe(true);
    expect(normalize(formatPercent(0.42))).toContain("42");
  });

  it("laisse le signe « - » natif pour une performance négative", () => {
    const out = formatPercent(-0.5);
    expect(out.startsWith("+")).toBe(false);
    expect(out.startsWith("-")).toBe(true);
  });

  it("n'ajoute pas de signe pour zéro", () => {
    expect(formatPercent(0).startsWith("+")).toBe(false);
  });
});

describe("formatCurrency", () => {
  it("formate un montant en euros", () => {
    const out = normalize(formatCurrency(1234.5));
    expect(out).toContain("€");
    expect(out).toContain("1");
    expect(out).toContain("234");
  });
});

describe("formatUnits", () => {
  it("limite à 6 décimales", () => {
    const out = normalize(formatUnits(0.123456789));
    expect(out).toBe("0,123457");
  });
});
