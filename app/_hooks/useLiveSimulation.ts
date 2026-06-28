"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  runBacktest,
  type BacktestResult,
  type PricePoint,
} from "@/lib/backtest";
import type { SimulatorInput } from "../dto/simulator.schema";

type Status = "idle" | "loading" | "ready" | "error";

/** Récupère l'historique de prix via la route interne (proxy Binance). */
async function fetchPriceHistory(
  coin: string,
  start: Date,
  end: Date,
): Promise<PricePoint[]> {
  const params = new URLSearchParams({
    coin,
    from: String(start.getTime()),
    to: String(end.getTime()),
  });
  const res = await fetch(`/api/prices?${params.toString()}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Impossible de récupérer les prix.");
  }
  const { prices } = (await res.json()) as { prices: [number, number][] };
  return prices.map(([ms, price]) => ({ date: new Date(ms), price }));
}

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Simulation en temps réel : recharge les prix uniquement quand la crypto ou la
 * période change (avec debounce + cache), et recalcule le backtest instantanément
 * pour toute modification (montant, fréquence) sans appel réseau.
 *
 * `input` doit être validé (ou `null` pendant une saisie invalide) ; le dernier
 * résultat valide reste affiché pour éviter tout clignotement.
 */
export function useLiveSimulation(input: SimulatorInput | null) {
  const [prices, setPrices] = useState<PricePoint[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const cacheRef = useRef<Map<string, PricePoint[]>>(new Map());

  // Clé de jeu de prix : dépend uniquement de la crypto et de la période.
  const priceKey = input
    ? `${input.crypto}:${dayKey(input.startDate)}:${dayKey(input.endDate)}`
    : null;

  useEffect(() => {
    if (!input || !priceKey) return;

    const cached = cacheRef.current.get(priceKey);
    if (cached) {
      setPrices(cached);
      setStatus("ready");
      setError(undefined);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const points = await fetchPriceHistory(
          input.crypto,
          input.startDate,
          input.endDate,
        );
        if (cancelled) return;
        cacheRef.current.set(priceKey, points);
        setPrices(points);
        setStatus("ready");
        setError(undefined);
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // priceKey encode crypto + dates ; les autres champs ne refetchent pas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceKey]);

  // Signature stable pour mémoïser le backtest (évite un recalcul à chaque rendu).
  const signature =
    input &&
    `${input.crypto}|${input.amount}|${input.frequency}|${+input.startDate}|${+input.endDate}`;

  const computed = useMemo(() => {
    if (!input || !prices) return null;
    try {
      return runBacktest({
        amount: input.amount,
        frequency: input.frequency,
        startDate: input.startDate,
        endDate: input.endDate,
        prices,
      });
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, prices]);

  // Conserve le dernier résultat valide pour un affichage sans clignotement.
  const lastResultRef = useRef<BacktestResult | null>(null);
  if (computed) lastResultRef.current = computed;
  const result = computed ?? lastResultRef.current;

  return { result, status, error };
}
