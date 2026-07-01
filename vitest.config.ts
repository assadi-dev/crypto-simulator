import { defineConfig } from "vitest/config";

/**
 * Tests unitaires de la logique métier (moteur de backtest, formatage, schémas).
 * Environnement Node : ces modules sont purs, sans dépendance DOM/React.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.ts"],
    globals: true,
  },
});
