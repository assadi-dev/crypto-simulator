import { defineConfig } from "vitest/config";

// Cet environnement définit NODE_ENV=production globalement, ce qui pousse React
// à charger son build de production (sans l'API `act`, requise par Testing Library).
// On force l'environnement de test avant que React ne soit résolu.
process.env.NODE_ENV = "test";

/**
 * Tests unitaires de la logique métier (moteur de backtest, formatage, schémas)
 * et des hooks React (environnement jsdom déclaré par docblock dans les fichiers).
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
