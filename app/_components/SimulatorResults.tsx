"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BacktestResult } from "@/lib/backtest";
import { formatCurrency, formatPercent } from "@/lib/format";

import { PerformanceChart } from "./PerformanceChart";

type SimulatorResultsProps = {
  result: BacktestResult;
};

export function SimulatorResults({ result }: SimulatorResultsProps) {
  const isGain = result.profit >= 0;

  return (
    <Card className="w-full max-w-2xl border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl">Résultat de la simulation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Total investi" value={formatCurrency(result.totalInvested)} />
          <Stat label="Valeur finale" value={formatCurrency(result.finalValue)} />
          <Stat
            label="Plus/moins-value"
            value={formatCurrency(result.profit)}
            tone={isGain ? "positive" : "negative"}
          />
          <Stat
            label="Performance"
            value={formatPercent(result.profitPct)}
            tone={isGain ? "positive" : "negative"}
          />
        </div>

        <PerformanceChart timeline={result.timeline} />

        <p className="text-xs text-muted-foreground">
          {result.contributions > 1
            ? `${result.contributions} versements · prix moyen d'achat ${formatCurrency(result.averagePrice)}.`
            : "Investissement unique."}{" "}
          Simulation rétrospective basée sur des données historiques ; les
          performances passées ne préjugent pas des performances futures.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-lg font-semibold tabular-nums",
          tone === "positive" && "text-emerald-400",
          tone === "negative" && "text-destructive",
          tone === "neutral" && "text-white",
        )}
      >
        {value}
      </span>
    </div>
  );
}
