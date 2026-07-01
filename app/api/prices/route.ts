import { NextResponse } from "next/server";

import { checkRateLimit, parsePositiveInt } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Proxy de prix historiques quotidiens via l'API publique Binance (sans clé).
 * Évite les soucis CORS et centralise la mise en cache. Renvoie un tableau
 * `[[timestampMs, prixEUR], ...]` exploité par le moteur de backtesting.
 */

// Mapping crypto (id CoinGecko-like) -> symbole Binance en EUR.
const BINANCE_SYMBOLS: Record<string, string> = {
  bitcoin: "BTCEUR",
  ethereum: "ETHEUR",
  solana: "SOLEUR",
  binancecoin: "BNBEUR",
  cardano: "ADAEUR",
  ripple: "XRPEUR",
};

const DAY_MS = 86_400_000;
const BINANCE_LIMIT = 1000;

// Rate limit configurable par env (lu au démarrage) : nb de requêtes par IP et
// durée de fenêtre en secondes. Valeurs par défaut : 30 requêtes / 60 s.
const RATE_LIMIT = {
  limit: parsePositiveInt(process.env.PRICES_RATE_LIMIT, 30),
  windowMs: parsePositiveInt(process.env.PRICES_RATE_WINDOW, 60) * 1000,
};

type Kline = [number, string, string, string, string, ...unknown[]];

/** Récupère les bougies journalières en paginant (limite Binance = 1000/req). */
async function fetchKlines(
  symbol: string,
  fromMs: number,
  toMs: number,
): Promise<[number, number][]> {
  const prices: [number, number][] = [];
  let start = fromMs;

  // Garde-fou : 12 pages max (~33 ans de données journalières).
  for (let page = 0; page < 12; page += 1) {
    const url =
      `https://api.binance.com/api/v3/klines?symbol=${symbol}` +
      `&interval=1d&startTime=${start}&endTime=${toMs}&limit=${BINANCE_LIMIT}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Binance ${res.status}`);

    const klines = (await res.json()) as Kline[];
    if (klines.length === 0) break;

    for (const kline of klines) {
      prices.push([kline[0], Number.parseFloat(kline[4])]); // [openTime, close]
    }

    if (klines.length < BINANCE_LIMIT) break;
    start = klines[klines.length - 1][0] + DAY_MS;
    if (start > toMs) break;
  }

  return prices;
}

export async function GET(request: Request) {
  // Garde-fou anti-abus sur ce proxy public (limite configurable par env).
  const rate = checkRateLimit(request, "prices", RATE_LIMIT);
  if (!rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans quelques instants." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "RateLimit-Limit": String(rate.limit),
          "RateLimit-Remaining": String(rate.remaining),
          "RateLimit-Reset": String(Math.ceil(rate.reset / 1000)),
        },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const coin = searchParams.get("coin");
  const from = Number(searchParams.get("from"));
  const to = Number(searchParams.get("to"));

  const symbol = coin ? BINANCE_SYMBOLS[coin] : undefined;
  if (!symbol) {
    return NextResponse.json(
      { error: "Cryptomonnaie non supportée." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to) {
    return NextResponse.json(
      { error: "Période invalide." },
      { status: 400 },
    );
  }

  try {
    const prices = await fetchKlines(symbol, from, to);
    return NextResponse.json({ prices });
  } catch {
    return NextResponse.json(
      { error: "Échec de récupération des prix historiques." },
      { status: 502 },
    );
  }
}
