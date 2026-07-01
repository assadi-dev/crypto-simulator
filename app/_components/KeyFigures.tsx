"use client";

import { memo } from "react";
import {
  CircleDollarSign,
  Coins,
  PiggyBank,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BacktestResult } from "@/lib/backtest";
import { formatCurrency, formatPercent, formatUnits } from "@/lib/format";

type KeyFiguresProps = {
  result: BacktestResult | null;
  symbol: string;
  isLoading?: boolean;
  error?: string;
};

/** Panneau de résultats en temps réel (à droite du formulaire). */
export const KeyFigures = memo(function KeyFigures({
  result,
  symbol,
  isLoading = false,
  error,
}: KeyFiguresProps) {
  const isGain = (result?.profit ?? 0) >= 0;

  return (
    <Card className="animate-fade-up fade-delay-4 h-full w-full border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">Chiffres clés</CardTitle>
        {isLoading && (
          <span className="text-xs text-muted-foreground">Actualisation…</span>
        )}
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : !result ? (
          <p className="text-sm text-muted-foreground">
            Renseignez les paramètres pour voir le résultat.
          </p>
        ) : (
          <dl className="divide-y divide-white/8">
            <Row
              icon={PiggyBank}
              label="Investi"
              value={formatCurrency(result.totalInvested)}
              sub={`${result.contributions} versement${result.contributions > 1 ? "s" : ""}`}
            />
            <Row
              icon={Coins}
              label="Acquis"
              value={`${formatUnits(result.units)} ${symbol}`}
            />
            <Row
              icon={CircleDollarSign}
              label="Prix moyen d'acquisition"
              value={formatCurrency(result.averagePrice)}
            />
            <Row
              icon={Wallet}
              label="Capital final"
              value={formatCurrency(result.finalValue)}
            />
            <Row
              icon={TrendingUp}
              label="Performance"
              value={formatPercent(result.profitPct)}
              tone={isGain ? "positive" : "negative"}
            />
          </dl>
        )}
      </CardContent>
    </Card>
  );
});

function Row({
  icon: Icon,
  label,
  value,
  sub,
  tone = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-brand-soft">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="text-right">
          <span
            className={cn(
              "block font-semibold tabular-nums",
              tone === "positive" && "text-emerald-400",
              tone === "negative" && "text-destructive",
              tone === "neutral" && "text-white",
            )}
          >
            {value}
          </span>
          {sub && (
            <span className="block text-xs text-muted-foreground">{sub}</span>
          )}
        </div>
      </div>
    </div>
  );
}
