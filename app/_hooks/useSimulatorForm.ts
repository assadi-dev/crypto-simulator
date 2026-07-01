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
    amount: 50,
    frequency: "monthly",
    startDate,
    endDate,
  };
}

/**
 * Initialise le formulaire de simulation (validation Zod + valeurs par défaut).
 * Le calcul est déclenché en temps réel par l'orchestrateur qui observe le form.
 */
export function useSimulatorForm() {
  const form = useForm<SimulatorInput>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  return { form };
}
