"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { BacktestPoint } from "@/lib/backtest";

const chartConfig = {
  value: { label: "Valeur du portefeuille", color: "var(--brand-bright)" },
  invested: { label: "Total investi", color: "var(--brand-soft)" },
} satisfies ChartConfig;

const compactEur = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 1,
});

type PerformanceChartProps = {
  timeline: BacktestPoint[];
};

export function PerformanceChart({ timeline }: PerformanceChartProps) {
  const data = timeline.map((point) => ({
    date: point.date.getTime(),
    value: point.value,
    invested: point.invested,
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-bright)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--brand-bright)" stopOpacity={0} />
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
          tickFormatter={(ms: number) =>
            new Date(ms).toLocaleDateString("fr-FR", {
              month: "short",
              year: "2-digit",
            })
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(value: number) => compactEur.format(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.date
                  ? new Date(payload[0].payload.date).toLocaleDateString(
                      "fr-FR",
                      { day: "numeric", month: "long", year: "numeric" },
                    )
                  : ""
              }
            />
          }
        />
        <Area
          dataKey="invested"
          type="monotone"
          stroke="var(--brand-soft)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          fill="none"
        />
        <Area
          dataKey="value"
          type="monotone"
          stroke="var(--brand-bright)"
          strokeWidth={2}
          fill="url(#fillValue)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
