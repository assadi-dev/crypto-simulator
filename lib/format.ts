/** Formateurs d'affichage (locale fr-FR). */

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Formate un ratio (0.42 -> « +42 % »), avec signe explicite. */
export function formatPercent(ratio: number): string {
  const sign = ratio > 0 ? "+" : "";
  return `${sign}${percentFormatter.format(ratio)}`;
}

export function formatUnits(value: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 6 }).format(
    value,
  );
}
