"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { simulatorSchema } from "../dto/simulator.schema";
import { useLiveSimulation } from "../_hooks/useLiveSimulation";
import { useSimulatorForm } from "../_hooks/useSimulatorForm";
import { CRYPTO_OPTIONS } from "../_types/simulator";
import { KeyFigures } from "./KeyFigures";
import { GainsPertesChart, HistoriqueChart } from "./PerformanceCharts";
import { SimulatorForm } from "./SimulatorForm";

/** Assemble formulaire + résultats temps réel (chiffres clés) + graphique. */
export function Simulator() {
  const { form } = useSimulatorForm();

  // Valeurs live du formulaire ; validées avant tout calcul.
  const values = form.watch();
  const parsed = simulatorSchema.safeParse(values);
  const input = parsed.success ? parsed.data : null;

  const { result, status, error } = useLiveSimulation(input);

  const symbol =
    CRYPTO_OPTIONS.find((crypto) => crypto.id === values.crypto)?.symbol ?? "";

  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <div className="grid items-stretch gap-6 md:grid-cols-2">
        <SimulatorForm form={form} />
        <KeyFigures
          result={result}
          symbol={symbol}
          isLoading={status === "loading"}
          error={status === "error" ? error : undefined}
        />
      </div>

      {result && result.timeline.length > 0 && (
        <>
          <Card className="animate-fade-up w-full border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <HistoriqueChart timeline={result.timeline} />
            </CardContent>
          </Card>

          <Card className="animate-fade-up fade-delay-1 w-full border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">Gains / Pertes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <GainsPertesChart timeline={result.timeline} />
              <p className="text-xs text-muted-foreground">
                Simulation rétrospective basée sur des données historiques ; les
                performances passées ne préjugent pas des performances futures.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
