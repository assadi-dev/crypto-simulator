/**
 * Moteur de backtesting crypto — fonctions pures, sans dépendance réseau/UI.
 *
 * Principe : on rejoue un investissement passé (en une fois ou récurrent « DCA »)
 * à partir d'un historique de prix quotidiens, et on reconstruit l'évolution de la
 * valeur du portefeuille dans le temps.
 */

export type Frequency = "once" | "daily" | "weekly" | "monthly";

/** Un prix quotidien (date = jour, price = prix de la crypto ce jour-là). */
export interface PricePoint {
  date: Date;
  price: number;
}

export interface BacktestParams {
  /** Montant investi à chaque échéance (ou en une fois). */
  amount: number;
  frequency: Frequency;
  startDate: Date;
  endDate: Date;
  /** Historique de prix couvrant la période (ordre quelconque, trié en interne). */
  prices: PricePoint[];
  /** Nombre maximum de points dans la timeline renvoyée (échantillonnage). */
  maxPoints?: number;
}

/** Un point de la courbe d'évolution (pour le graphique). */
export interface BacktestPoint {
  date: Date;
  /** Total investi cumulé jusqu'à cette date. */
  invested: number;
  /** Valeur du portefeuille à cette date. */
  value: number;
  /** Quantité de crypto détenue à cette date. */
  units: number;
  /** Prix de la crypto à cette date. */
  price: number;
}

export interface BacktestResult {
  totalInvested: number;
  finalValue: number;
  /** Plus/moins-value = finalValue - totalInvested. */
  profit: number;
  /** Performance relative (profit / totalInvested), ex. 0.42 = +42 %. */
  profitPct: number;
  /** Quantité totale de crypto accumulée. */
  units: number;
  /** Nombre d'achats effectués. */
  contributions: number;
  /** Prix moyen d'achat (totalInvested / units). */
  averagePrice: number;
  timeline: BacktestPoint[];
}

function addDays(date: Date, n: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + n);
  return result;
}

function addMonths(date: Date, n: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + n);
  return result;
}

/** Génère les dates d'achat selon la fréquence, dans l'intervalle [start, end]. */
export function generateContributionDates(
  start: Date,
  end: Date,
  frequency: Frequency,
): Date[] {
  if (frequency === "once") return [new Date(start)];

  const step =
    frequency === "daily"
      ? (d: Date) => addDays(d, 1)
      : frequency === "weekly"
        ? (d: Date) => addDays(d, 7)
        : (d: Date) => addMonths(d, 1);

  const dates: Date[] = [];
  let current = new Date(start);
  while (current.getTime() <= end.getTime()) {
    dates.push(new Date(current));
    current = step(current);
  }
  return dates;
}

/**
 * Prix le plus récent à une date donnée (recherche dichotomique).
 * `prices` doit être trié par date croissante.
 */
export function priceAtOrBefore(
  prices: PricePoint[],
  date: Date,
): number | undefined {
  const target = date.getTime();
  let lo = 0;
  let hi = prices.length - 1;
  let answer: number | undefined;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (prices[mid].date.getTime() <= target) {
      answer = prices[mid].price;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return answer;
}

/** Réduit la timeline à au plus `maxPoints` points (en conservant le dernier). */
function sampleTimeline(
  timeline: BacktestPoint[],
  maxPoints: number,
): BacktestPoint[] {
  if (timeline.length <= maxPoints) return timeline;
  const stride = Math.ceil(timeline.length / maxPoints);
  const sampled = timeline.filter((_, index) => index % stride === 0);
  const last = timeline[timeline.length - 1];
  if (sampled[sampled.length - 1] !== last) sampled.push(last);
  return sampled;
}

/** Exécute le backtest et renvoie le résultat agrégé + la courbe d'évolution. */
export function runBacktest(params: BacktestParams): BacktestResult {
  const { amount, frequency, startDate, endDate, prices, maxPoints = 500 } =
    params;

  const sorted = [...prices].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  if (sorted.length === 0) {
    throw new Error("Aucune donnée de prix disponible pour cette période.");
  }

  const firstDataDate = sorted[0].date;

  // Achats : chaque échéance achète `amount` au prix du jour correspondant.
  const buys = generateContributionDates(startDate, endDate, frequency)
    .filter((date) => date.getTime() >= firstDataDate.getTime())
    .map((date) => {
      const price = priceAtOrBefore(sorted, date) ?? sorted[0].price;
      return { date, price, units: amount / price };
    });

  // Fenêtre de prix à afficher : [startDate, endDate].
  const window = sorted.filter(
    (point) =>
      point.date.getTime() >= startDate.getTime() &&
      point.date.getTime() <= endDate.getTime(),
  );

  const timeline: BacktestPoint[] = [];
  let cumUnits = 0;
  let cumInvested = 0;
  let buyIndex = 0;

  for (const point of window) {
    while (
      buyIndex < buys.length &&
      buys[buyIndex].date.getTime() <= point.date.getTime()
    ) {
      cumUnits += buys[buyIndex].units;
      cumInvested += amount;
      buyIndex += 1;
    }
    timeline.push({
      date: point.date,
      invested: cumInvested,
      units: cumUnits,
      value: cumUnits * point.price,
      price: point.price,
    });
  }

  // Sécurité : si tous les achats tombent après la fenêtre, on les intègre quand même.
  while (buyIndex < buys.length) {
    cumUnits += buys[buyIndex].units;
    cumInvested += amount;
    buyIndex += 1;
  }

  const totalInvested = cumInvested;
  const lastPrice = window.length > 0 ? window[window.length - 1].price : sorted[sorted.length - 1].price;
  const finalValue = cumUnits * lastPrice;
  const profit = finalValue - totalInvested;

  return {
    totalInvested,
    finalValue,
    profit,
    profitPct: totalInvested > 0 ? profit / totalInvested : 0,
    units: cumUnits,
    contributions: buys.length,
    averagePrice: cumUnits > 0 ? totalInvested / cumUnits : 0,
    timeline: sampleTimeline(timeline, maxPoints),
  };
}
