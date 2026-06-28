import type { SimulatorInput } from "../dto/simulator.schema";

/** Options de cryptomonnaies affichées dans le select (libellé + symbole). */
export const CRYPTO_OPTIONS = [
  { id: "bitcoin", label: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", label: "Ethereum", symbol: "ETH" },
  { id: "solana", label: "Solana", symbol: "SOL" },
  { id: "binancecoin", label: "BNB", symbol: "BNB" },
  { id: "cardano", label: "Cardano", symbol: "ADA" },
  { id: "ripple", label: "XRP", symbol: "XRP" },
] satisfies ReadonlyArray<{
  id: SimulatorInput["crypto"];
  label: string;
  symbol: string;
}>;

/** Options de fréquence d'investissement (libellés FR). */
export const FREQUENCY_OPTIONS = [
  { value: "once", label: "Une seule fois" },
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
] satisfies ReadonlyArray<{
  value: SimulatorInput["frequency"];
  label: string;
}>;
