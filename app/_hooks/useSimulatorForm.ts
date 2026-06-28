"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { simulatorSchema, type SimulatorInput } from "../dto/simulator.schema";

/** Valeurs par défaut : 100 €/mois en Bitcoin sur les 5 dernières années. */
function getDefaultValues(): SimulatorInput {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 5);

  return {
    crypto: "bitcoin",
    amount: 100,
    frequency: "monthly",
    startDate,
    endDate,
  };
}

/**
 * Encapsule la logique du formulaire de simulation (validation Zod + soumission).
 * Le composant reste présentationnel : il consomme `form` et `onSubmit`.
 */
export function useSimulatorForm(
  onValidSubmit?: (values: SimulatorInput) => void,
) {
  const form = useForm<SimulatorInput>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: getDefaultValues(),
    mode: "onTouched",
  });

  const onSubmit = form.handleSubmit((values) => {
    // Le moteur de calcul (backtesting one-shot / DCA) sera branché ici à l'étape suivante.
    onValidSubmit?.(values);
  });

  return { form, onSubmit };
}
