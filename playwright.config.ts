import { defineConfig, devices } from "@playwright/test";

/**
 * Tests end-to-end (navigateur réel). Le serveur de dev est démarré
 * automatiquement ; les appels à `/api/prices` sont interceptés dans les tests
 * pour un rendu déterministe (indépendant de la disponibilité de Binance).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
