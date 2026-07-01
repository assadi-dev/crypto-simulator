import type { Page } from "@playwright/test";

/**
 * Série de prix hebdomadaires sur ~5 ans (tendance haussière), pour couvrir la
 * période par défaut du simulateur et produire des graphiques déterministes.
 */
function buildPrices(): [number, number][] {
  const now = Date.now();
  const week = 7 * 24 * 3600 * 1000;
  const start = now - 5 * 365 * 24 * 3600 * 1000;
  const points: [number, number][] = [];
  let price = 10_000;
  for (let t = start; t <= now; t += week) {
    price += 200;
    points.push([t, price]);
  }
  return points;
}

/** Intercepte l'API de prix et renvoie une série mockée (aucun appel réseau réel). */
export async function mockPricesRoute(page: Page): Promise<void> {
  await page.route("**/api/prices*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ prices: buildPrices() }),
    });
  });
}
