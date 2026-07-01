// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useLiveSimulation } from "@/app/_hooks/useLiveSimulation";
import type { SimulatorInput } from "@/app/dto/simulator.schema";

/** Réponse `fetch` réussie renvoyant des paires [timestampMs, prix]. */
const okResponse = (pairs: [number, number][]) =>
  ({
    ok: true,
    json: async () => ({ prices: pairs }),
  }) as unknown as Response;

/** Réponse `fetch` en erreur (message dans le corps JSON). */
const errorResponse = (message: string) =>
  ({
    ok: false,
    json: async () => ({ error: message }),
  }) as unknown as Response;

const day = (n: number) => new Date(2020, 0, 1 + n);

/** Prix quotidiens : 100 → 110 → 120 sur trois jours consécutifs. */
const PRICE_PAIRS: [number, number][] = [
  [day(0).getTime(), 100],
  [day(1).getTime(), 110],
  [day(2).getTime(), 120],
];

const baseInput = (overrides: Partial<SimulatorInput> = {}): SimulatorInput => ({
  crypto: "bitcoin",
  amount: 1000,
  frequency: "once",
  startDate: day(0),
  endDate: day(2),
  ...overrides,
});

/** Laisse passer le debounce (350 ms) puis vide la file de microtâches. */
const flushDebounce = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(350);
  });

describe("useLiveSimulation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("reste inactif et sans résultat quand l'entrée est nulle", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLiveSimulation(null));

    expect(result.current.status).toBe("idle");
    expect(result.current.result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("passe par « loading » puis « ready » et calcule le backtest", async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse(PRICE_PAIRS));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLiveSimulation(baseInput()));

    // L'effet déclenche l'état de chargement dès le premier rendu.
    expect(result.current.status).toBe("loading");

    await flushDebounce();

    expect(result.current.status).toBe("ready");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // 1000 € au prix 100 => 10 unités, valorisées à 120 => 1200 €.
    expect(result.current.result?.finalValue).toBeCloseTo(1200, 6);
  });

  it("ne refait pas d'appel réseau quand seul le montant change (cache par crypto+période)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse(PRICE_PAIRS));
    vi.stubGlobal("fetch", fetchMock);

    const { result, rerender } = renderHook(
      ({ input }) => useLiveSimulation(input),
      { initialProps: { input: baseInput({ amount: 1000 }) } },
    );

    await flushDebounce();
    expect(result.current.result?.finalValue).toBeCloseTo(1200, 6);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Même crypto + mêmes dates : recalcul local, aucun nouvel appel réseau.
    rerender({ input: baseInput({ amount: 2000 }) });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    // 2000 € au prix 100 => 20 unités, valorisées à 120 => 2400 €.
    expect(result.current.result?.finalValue).toBeCloseTo(2400, 6);
  });

  it("refait un appel réseau quand la crypto change", async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse(PRICE_PAIRS));
    vi.stubGlobal("fetch", fetchMock);

    const { rerender } = renderHook(({ input }) => useLiveSimulation(input), {
      initialProps: { input: baseInput({ crypto: "bitcoin" }) },
    });

    await flushDebounce();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    rerender({ input: baseInput({ crypto: "ethereum" }) });
    await flushDebounce();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("passe en erreur et remonte le message du serveur en cas d'échec", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(errorResponse("Service indisponible."));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLiveSimulation(baseInput()));

    await flushDebounce();

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Service indisponible.");
  });
});
