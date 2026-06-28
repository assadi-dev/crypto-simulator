"use client";

import { useSimulation } from "../_hooks/useSimulation";
import { SimulatorForm } from "./SimulatorForm";
import { SimulatorResults } from "./SimulatorResults";

/** Assemble le formulaire et l'affichage des résultats autour du hook de simulation. */
export function Simulator() {
  const { state, simulate } = useSimulation();

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <SimulatorForm onSimulate={simulate} isLoading={state.status === "loading"} />

      {state.status === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <SimulatorResults result={state.result} />
      )}
    </div>
  );
}
