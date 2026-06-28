"use client";

import { useCallback, useState } from "react";

import {
  runBacktest,
  type BacktestResult,
  type PricePoint,
} from "@/lib/backtest";
import type { SimulatorInput } from "../dto/simulator.schema";

type SimulationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: BacktestResult; input: SimulatorInput }
  | { status: "error"; message: string };

/**
 * Orchestration de la simulation : récupère l'historique de prix via l'API
 * interne puis exécute le moteur de backtesting (fonction pure).
 */
export function useSimulation() {
  const [state, setState] = useState<SimulationState>({ status: "idle" });

  const simulate = useCallback(async (input: SimulatorInput) => {
    setState({ status: "loading" });
    try {
      const params = new URLSearchParams({
        coin: input.crypto,
        from: String(input.startDate.getTime()),
        to: String(input.endDate.getTime()),
      });

      const res = await fetch(`/api/prices?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Impossible de récupérer les prix.");
      }

      const { prices } = (await res.json()) as { prices: [number, number][] };
      if (!prices || prices.length === 0) {
        throw new Error("Aucune donnée de prix pour cette période.");
      }

      const pricePoints: PricePoint[] = prices.map(([ms, price]) => ({
        date: new Date(ms),
        price,
      }));

      const result = runBacktest({
        amount: input.amount,
        frequency: input.frequency,
        startDate: input.startDate,
        endDate: input.endDate,
        prices: pricePoints,
      });

      setState({ status: "success", result, input });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    }
  }, []);

  return { state, simulate };
}
