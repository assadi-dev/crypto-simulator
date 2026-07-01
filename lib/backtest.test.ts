import { describe, expect, it } from "vitest";

import {
  generateContributionDates,
  priceAtOrBefore,
  runBacktest,
  type PricePoint,
} from "@/lib/backtest";

/**
 * Jour local `n` à partir du 1er janvier 2020. On reste en heure locale pour
 * rester cohérent avec l'arithmétique de dates du moteur (addDays/addMonths
 * utilisent get/setDate et get/setMonth locaux).
 */
const day = (n: number) => new Date(2020, 0, 1 + n);

/** Construit une série de prix quotidiens à partir d'un tableau de montants. */
const series = (prices: number[]): PricePoint[] =>
  prices.map((price, i) => ({ date: day(i), price }));

describe("generateContributionDates", () => {
  it("retourne une seule date pour la fréquence « once »", () => {
    const dates = generateContributionDates(day(0), day(10), "once");
    expect(dates).toHaveLength(1);
    expect(dates[0].getTime()).toBe(day(0).getTime());
  });

  it("génère une date par jour (bornes incluses)", () => {
    const dates = generateContributionDates(day(0), day(2), "daily");
    expect(dates).toHaveLength(3);
    expect(dates.map((d) => d.getTime())).toEqual([
      day(0).getTime(),
      day(1).getTime(),
      day(2).getTime(),
    ]);
  });

  it("génère une date par semaine (pas de 7 jours)", () => {
    const dates = generateContributionDates(day(0), day(14), "weekly");
    expect(dates.map((d) => d.getTime())).toEqual([
      day(0).getTime(),
      day(7).getTime(),
      day(14).getTime(),
    ]);
  });

  it("génère une date par mois", () => {
    const dates = generateContributionDates(
      new Date(2020, 0, 1),
      new Date(2020, 3, 1),
      "monthly",
    );
    expect(dates.map((d) => [d.getFullYear(), d.getMonth()])).toEqual([
      [2020, 0],
      [2020, 1],
      [2020, 2],
      [2020, 3],
    ]);
  });

  it("n'inclut pas de date au-delà de la borne de fin", () => {
    const dates = generateContributionDates(day(0), day(5), "weekly");
    expect(dates).toHaveLength(1); // seul day(0) tient dans [0, 5]
  });
});

describe("priceAtOrBefore", () => {
  const prices = series([100, 110, 120]);

  it("retourne le prix exact quand la date correspond", () => {
    expect(priceAtOrBefore(prices, day(1))).toBe(110);
  });

  it("retourne le dernier prix connu quand la date tombe entre deux points", () => {
    const between = new Date(day(1).getTime() + 3600_000); // day1 + 1h
    expect(priceAtOrBefore(prices, between)).toBe(110);
  });

  it("retourne le dernier prix pour une date postérieure à la série", () => {
    expect(priceAtOrBefore(prices, day(99))).toBe(120);
  });

  it("retourne undefined pour une date antérieure au premier point", () => {
    expect(priceAtOrBefore(prices, day(-1))).toBeUndefined();
  });
});

describe("runBacktest — investissement unique (once)", () => {
  it("achète au prix de départ et valorise au dernier prix", () => {
    const result = runBacktest({
      amount: 1000,
      frequency: "once",
      startDate: day(0),
      endDate: day(2),
      prices: series([100, 110, 120]),
    });

    expect(result.contributions).toBe(1);
    expect(result.totalInvested).toBe(1000);
    expect(result.units).toBeCloseTo(10, 10); // 1000 / 100
    expect(result.averagePrice).toBeCloseTo(100, 10);
    expect(result.finalValue).toBeCloseTo(1200, 10); // 10 * 120
    expect(result.profit).toBeCloseTo(200, 10);
    expect(result.profitPct).toBeCloseTo(0.2, 10);
  });

  it("calcule une moins-value quand le prix final est plus bas", () => {
    const result = runBacktest({
      amount: 1000,
      frequency: "once",
      startDate: day(0),
      endDate: day(1),
      prices: series([100, 50]),
    });

    expect(result.finalValue).toBeCloseTo(500, 10);
    expect(result.profit).toBeCloseTo(-500, 10);
    expect(result.profitPct).toBeCloseTo(-0.5, 10);
  });
});

describe("runBacktest — DCA récurrent", () => {
  it("cumule les achats et calcule le prix moyen d'acquisition", () => {
    const result = runBacktest({
      amount: 100,
      frequency: "daily",
      startDate: day(0),
      endDate: day(1),
      prices: series([100, 200]),
    });

    // day0: 100/100 = 1 unité ; day1: 100/200 = 0.5 unité
    expect(result.contributions).toBe(2);
    expect(result.totalInvested).toBe(200);
    expect(result.units).toBeCloseTo(1.5, 10);
    expect(result.averagePrice).toBeCloseTo(200 / 1.5, 10);
    expect(result.finalValue).toBeCloseTo(300, 10); // 1.5 * 200
    expect(result.profit).toBeCloseTo(100, 10);
  });

  it("construit une timeline cumulative cohérente", () => {
    const result = runBacktest({
      amount: 100,
      frequency: "daily",
      startDate: day(0),
      endDate: day(1),
      prices: series([100, 200]),
    });

    expect(result.timeline).toHaveLength(2);
    expect(result.timeline[0]).toMatchObject({ invested: 100 });
    expect(result.timeline[0].units).toBeCloseTo(1, 10);
    expect(result.timeline[0].value).toBeCloseTo(100, 10);
    expect(result.timeline[1]).toMatchObject({ invested: 200 });
    expect(result.timeline[1].units).toBeCloseTo(1.5, 10);
    expect(result.timeline[1].value).toBeCloseTo(300, 10);
  });
});

describe("runBacktest — robustesse", () => {
  it("lève une erreur en l'absence de données de prix", () => {
    expect(() =>
      runBacktest({
        amount: 100,
        frequency: "once",
        startDate: day(0),
        endDate: day(2),
        prices: [],
      }),
    ).toThrow();
  });

  it("trie les prix fournis dans le désordre", () => {
    const unsorted = [...series([100, 110, 120])].reverse();
    const result = runBacktest({
      amount: 1000,
      frequency: "once",
      startDate: day(0),
      endDate: day(2),
      prices: unsorted,
    });
    expect(result.finalValue).toBeCloseTo(1200, 10);
  });

  it("échantillonne la timeline sans dépasser nettement maxPoints et garde le dernier point", () => {
    const prices = series(Array.from({ length: 100 }, (_, i) => 100 + i));
    const result = runBacktest({
      amount: 10,
      frequency: "once",
      startDate: day(0),
      endDate: day(99),
      prices,
      maxPoints: 10,
    });

    expect(result.timeline.length).toBeLessThanOrEqual(11); // maxPoints (+ dernier point)
    const lastPoint = result.timeline[result.timeline.length - 1];
    expect(lastPoint.date.getTime()).toBe(day(99).getTime());
  });

  it("ignore les échéances antérieures aux données disponibles", () => {
    // Prix disponibles à partir de day(5) seulement ; DCA démarrant à day(0).
    const prices = series([0, 0, 0, 0, 0, 100, 100]).slice(5); // day(5)=100, day(6)=100
    const result = runBacktest({
      amount: 100,
      frequency: "daily",
      startDate: day(0),
      endDate: day(6),
      prices,
    });

    // Seules les échéances >= day(5) achètent : day(5) et day(6) => 2 versements.
    expect(result.contributions).toBe(2);
    expect(result.totalInvested).toBe(200);
  });
});
