import { expect, test } from "@playwright/test";

import { mockPricesRoute } from "./utils";

test.describe("Simulateur — page /embed", () => {
  test.beforeEach(async ({ page }) => {
    await mockPricesRoute(page);
  });

  test("affiche l'outil sans hero et calcule après saisie", async ({ page }) => {
    await page.goto("/embed");

    // L'outil est présent (carte « Simulation »).
    await expect(page.getByText("Simulation", { exact: true })).toBeVisible();

    // Pas de hero marketing sur la version embarquée.
    await expect(
      page.getByRole("heading", { name: "Simulateur plus-value crypto" }),
    ).toHaveCount(0);

    // Attendre l'hydratation + premier calcul (graphiques rendus) avant de saisir.
    await expect(page.getByText("Historique", { exact: true })).toBeVisible({
      timeout: 15_000,
    });

    // Saisie du montant : 100, puis vérification du rendu des deux graphiques.
    const amount = page.locator("#amount");
    await amount.fill("100");
    await expect(amount).toHaveValue("100");

    // Les deux graphiques sont présents : « Historique » et « Gains / Pertes ».
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: "Historique" }),
    ).toBeVisible();
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: "Gains / Pertes" }),
    ).toBeVisible();
    await expect(page.locator("svg.recharts-surface")).toHaveCount(2);
  });
});
