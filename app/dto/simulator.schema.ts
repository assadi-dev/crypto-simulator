import { z } from "zod";

/**
 * Valeurs autorisées pour le simulateur. Servent à la fois de source de vérité
 * pour la validation (ci-dessous) et pour dériver les types (`z.infer`).
 */
export const CRYPTO_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "cardano",
  "ripple",
] as const;

export const FREQUENCIES = ["once", "daily", "weekly", "monthly"] as const;

/** Schéma de validation des entrées du simulateur (formulaire + payloads). */
export const simulatorSchema = z
  .object({
    crypto: z.enum(CRYPTO_IDS),
    amount: z
      .number()
      .positive("Le montant doit être supérieur à 0.")
      .max(1_000_000, "Le montant ne peut pas dépasser 1 000 000 €."),
    frequency: z.enum(FREQUENCIES),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "La date de début doit précéder la date de fin.",
    path: ["endDate"],
  })
  .refine((data) => data.endDate <= new Date(), {
    message: "La date de fin ne peut pas être dans le futur.",
    path: ["endDate"],
  });

/** Type des données validées du simulateur, dérivé du schéma. */
export type SimulatorInput = z.infer<typeof simulatorSchema>;
