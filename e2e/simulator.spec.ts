import { expect, test } from "@playwright/test";

import { mockPricesRoute } from "./utils";

test.describe("Simulateur — page d'accueil", () => {
  test.beforeEach(async ({ page }) => {
    await mockPricesRoute(page);
  });

  test("saisie d'un montant de 100 puis défilement jusqu'en bas de page", async ({
    page,
  }) => {
    await page.goto("/");

    // Le hero est présent (page d'accueil complète).
    await expect(
      page.getByRole("heading", { name: "Simulateur plus-value crypto" }),
    ).toBeVisible();

    // Attendre que le client soit hydraté et le premier calcul rendu : les
    // graphiques n'apparaissent qu'après le fetch (mocké) + le backtest. Cela
    // évite d'interagir avec l'input avant l'hydratation.
    await expect(page.getByText("Historique", { exact: true })).toBeVisible({
      timeout: 15_000,
    });

    // Saisie du montant investi : 100.
    const amount = page.locator("#amount");
    await amount.fill("100");
    await expect(amount).toHaveValue("100");

    // Le panneau de résultats est présent.
    await expect(page.getByText("Chiffres clés", { exact: true })).toBeVisible();

    // Les deux graphiques sont présents : « Historique » et « Gains / Pertes ».
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: "Historique" }),
    ).toBeVisible();
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: "Gains / Pertes" }),
    ).toBeVisible();
    await expect(page.locator("svg.recharts-surface")).toHaveCount(2);

    // Défilement jusqu'en bas de page : le disclaimer final doit être visible.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(
      page.getByText(/performances passées ne préjugent/i),
    ).toBeInViewport();
  });
});
