"use client";

import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { BacktestPoint } from "@/lib/backtest";

// Couleurs reprises des légendes du simulateur d'origine (Acquis or, Investi violet,
// Prix gris, Valeur bleu clair, Gains/Pertes vert) — cohérentes avec la data-viz de design.md.
const COLOR = {
  acquis: "#e9b949",
  investi: "#8b5cf6",
  prix: "#9ca3af",
  valeur: "#6db5f0",
  gains: "#22c55e",
} as const;

const compactEur = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 1,
});

const compactUnits = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

const fmtAxisDate = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

const fmtYear = (ms: number) => String(new Date(ms).getFullYear());

const fmtTooltipDate = (ms?: number) =>
  ms
    ? new Date(ms).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

type ChartData = {
  date: number;
  value: number;
  invested: number;
  price: number;
  units: number;
  profit: number;
};

function toChartData(timeline: BacktestPoint[]): ChartData[] {
  return timeline.map((point) => ({
    date: point.date.getTime(),
    value: point.value,
    invested: point.invested,
    price: point.price,
    units: point.units,
    profit: point.value - point.invested,
  }));
}

const tooltip = (
  <ChartTooltipContent
    indicator="line"
    labelFormatter={(_, payload) =>
      fmtTooltipDate(payload?.[0]?.payload?.date as number | undefined)
    }
  />
);

type LegendItem = { label: string; dot: string };

/**
 * Légende rendue en flux DOM (au-dessus du graphique) plutôt que via la légende
 * recharts : elle passe ainsi à la ligne sur petit écran au lieu de déborder.
 */
function ChartLegendRow({ items }: { items: LegendItem[] }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={cn("size-2 shrink-0 rounded-[2px]", item.dot)} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

const historiqueLegend: LegendItem[] = [
  { label: "Acquis", dot: "bg-[#e9b949]" },
  { label: "Investi", dot: "bg-[#8b5cf6]" },
  { label: "Prix", dot: "bg-[#9ca3af]" },
  { label: "Valeur", dot: "bg-[#6db5f0]" },
];

const gainsLegend: LegendItem[] = [
  { label: "Gains / Pertes", dot: "bg-[#22c55e]" },
  { label: "Valeur", dot: "bg-[#e9b949]" },
  { label: "Investi", dot: "bg-[#8b5cf6]" },
  { label: "Prix", dot: "bg-[#9ca3af]" },
];

/** Chart 1 — « Historique » : Acquis (unités, axe gauche) + Investi / Prix / Valeur (€, axe droite). */
export function HistoriqueChart({ timeline }: { timeline: BacktestPoint[] }) {
  const data = toChartData(timeline);

  const config = {
    value: { label: "Valeur", color: COLOR.valeur },
    investi: { label: "Investi", color: COLOR.investi },
    price: { label: "Prix", color: COLOR.prix },
    units: { label: "Acquis", color: COLOR.acquis },
  } satisfies ChartConfig;

  return (
    <div className="w-full min-w-0">
      <ChartLegendRow items={historiqueLegend} />
      <ChartContainer config={config} className="h-[320px] w-full">
        <ComposedChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
        <defs>
          <linearGradient id="fillValeur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeOpacity={0.1} />
        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          tickLine={false}
          axisLine={false}
          minTickGap={48}
          tickMargin={8}
          tickFormatter={fmtAxisDate}
        />
        <YAxis
          yAxisId="units"
          orientation="left"
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(v: number) => compactUnits.format(v)}
        />
        <YAxis
          yAxisId="eur"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v: number) => compactEur.format(v)}
        />
        {/* Axe dédié au Prix : évite qu'il écrase Valeur/Investi (échelles très différentes). */}
        <YAxis
          yAxisId="prix"
          orientation="right"
          hide
          domain={["dataMin", "dataMax"]}
        />
        <ChartTooltip content={tooltip} />
        <Area
          yAxisId="eur"
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={1.8}
          fill="url(#fillValeur)"
        />
        <Line
          yAxisId="eur"
          dataKey="invested"
          type="monotone"
          stroke="var(--color-investi)"
          strokeWidth={1.8}
          dot={false}
        />
        <Line
          yAxisId="prix"
          dataKey="price"
          type="monotone"
          stroke="var(--color-price)"
          strokeWidth={1}
          strokeOpacity={0.5}
          dot={false}
        />
        <Line
          yAxisId="units"
          dataKey="units"
          type="monotone"
          stroke="var(--color-units)"
          strokeWidth={2}
          dot={false}
        />
        <Brush
          dataKey="date"
          height={22}
          travellerWidth={8}
          stroke={COLOR.prix}
          fill="rgba(255,255,255,0.02)"
          tickFormatter={fmtYear}
        />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}

/** Chart 2 — « Gains / Pertes » : Gains/Pertes (aire verte) + Valeur / Investi / Prix (€). */
export function GainsPertesChart({ timeline }: { timeline: BacktestPoint[] }) {
  const data = toChartData(timeline);

  const config = {
    profit: { label: "Gains / Pertes", color: COLOR.gains },
    value: { label: "Valeur", color: COLOR.acquis },
    investi: { label: "Investi", color: COLOR.investi },
    price: { label: "Prix", color: COLOR.prix },
  } satisfies ChartConfig;

  return (
    <div className="w-full min-w-0">
      <ChartLegendRow items={gainsLegend} />
      <ChartContainer config={config} className="h-[320px] w-full">
        <ComposedChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillGains" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-profit)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-profit)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeOpacity={0.1} />
        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          tickLine={false}
          axisLine={false}
          minTickGap={48}
          tickMargin={8}
          tickFormatter={fmtAxisDate}
        />
        <YAxis
          yAxisId="eur"
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v: number) => compactEur.format(v)}
        />
        {/* Axe dédié au Prix (échelle indépendante de Valeur/Investi). */}
        <YAxis
          yAxisId="prix"
          orientation="right"
          hide
          domain={["dataMin", "dataMax"]}
        />
        <ChartTooltip content={tooltip} />
        <Area
          yAxisId="eur"
          dataKey="profit"
          type="monotone"
          stroke="var(--color-profit)"
          strokeWidth={1.8}
          fill="url(#fillGains)"
        />
        <Line
          yAxisId="eur"
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={1.8}
          dot={false}
        />
        <Line
          yAxisId="eur"
          dataKey="invested"
          type="monotone"
          stroke="var(--color-investi)"
          strokeWidth={1.8}
          dot={false}
        />
        <Line
          yAxisId="prix"
          dataKey="price"
          type="monotone"
          stroke="var(--color-price)"
          strokeWidth={1}
          strokeOpacity={0.5}
          dot={false}
        />
        <Brush
          dataKey="date"
          height={22}
          travellerWidth={8}
          stroke={COLOR.prix}
          fill="rgba(255,255,255,0.02)"
          tickFormatter={fmtYear}
        />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
