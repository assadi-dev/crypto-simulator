import { describe, expect, it } from "vitest";

import { simulatorSchema } from "@/app/dto/simulator.schema";

/** Entrée valide de référence : 100 €/mois de bitcoin sur ~1 an passé. */
const validInput = () => ({
  crypto: "bitcoin" as const,
  amount: 100,
  frequency: "monthly" as const,
  startDate: new Date(2022, 0, 1),
  endDate: new Date(2023, 0, 1),
});

describe("simulatorSchema", () => {
  it("accepte une entrée valide", () => {
    expect(simulatorSchema.safeParse(validInput()).success).toBe(true);
  });

  it("rejette un montant nul ou négatif", () => {
    expect(
      simulatorSchema.safeParse({ ...validInput(), amount: 0 }).success,
    ).toBe(false);
    expect(
      simulatorSchema.safeParse({ ...validInput(), amount: -10 }).success,
    ).toBe(false);
  });

  it("rejette un montant au-dessus du plafond", () => {
    expect(
      simulatorSchema.safeParse({ ...validInput(), amount: 1_000_001 }).success,
    ).toBe(false);
  });

  it("rejette un montant non numérique (NaN issu d'un champ vide)", () => {
    expect(
      simulatorSchema.safeParse({ ...validInput(), amount: Number.NaN }).success,
    ).toBe(false);
  });

  it("rejette une crypto non supportée", () => {
    expect(
      simulatorSchema.safeParse({ ...validInput(), crypto: "dogecoin" }).success,
    ).toBe(false);
  });

  it("rejette une fréquence inconnue", () => {
    expect(
      simulatorSchema.safeParse({ ...validInput(), frequency: "yearly" })
        .success,
    ).toBe(false);
  });

  it("rejette une date de début postérieure ou égale à la date de fin", () => {
    const date = new Date(2022, 5, 1);
    const result = simulatorSchema.safeParse({
      ...validInput(),
      startDate: date,
      endDate: date,
    });
    expect(result.success).toBe(false);
  });

  it("rejette une date de fin dans le futur", () => {
    const future = new Date(Date.now() + 86_400_000);
    const result = simulatorSchema.safeParse({
      ...validInput(),
      endDate: future,
    });
    expect(result.success).toBe(false);
  });
});
