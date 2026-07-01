import { defineConfig } from "vitest/config";

/**
 * Tests unitaires de la logique métier (moteur de backtest, formatage, schémas)
 * et des hooks React (environnement jsdom déclaré par docblock dans les fichiers).
 *
 * NODE_ENV=test est forcé via `test.env` : cet environnement définit NODE_ENV=production
 * globalement, ce qui ferait charger le build de production de React (sans l'API `act`
 * requise par Testing Library).
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.ts"],
    globals: true,
    env: {
      NODE_ENV: "test",
    },
  },
});
