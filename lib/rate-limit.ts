/**
 * Rate limiting en mémoire (fenêtre fixe par clé).
 *
 * Protège les routes API contre les abus (ex. le proxy de prix Binance) sans
 * dépendance externe. Limite : l'état vit dans le process, donc adapté à une
 * instance unique. En multi-instances / serverless multi-régions, remonter vers
 * un store partagé (Redis / Upstash) en gardant la même interface.
 */

export type RateLimitResult = {
  /** `true` si la requête est autorisée (sous la limite). */
  success: boolean;
  /** Nombre maximum de requêtes autorisées sur la fenêtre. */
  limit: number;
  /** Requêtes restantes sur la fenêtre courante. */
  remaining: number;
  /** Fin de la fenêtre courante (epoch ms) — utile pour `Retry-After`. */
  reset: number;
};

export type RateLimitOptions = {
  /** Requêtes autorisées par fenêtre (défaut : 30). */
  limit?: number;
  /** Durée de la fenêtre en millisecondes (défaut : 60 000). */
  windowMs?: number;
};

type Bucket = { count: number; resetAt: number };

const DEFAULT_LIMIT = 30;
const DEFAULT_WINDOW_MS = 60_000;
const MAX_TRACKED_KEYS = 10_000;

const buckets = new Map<string, Bucket>();

/** Purge des fenêtres expirées pour borner la taille de la map. */
function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}

/** Consomme une unité pour `key` et indique si la requête est autorisée. */
export function rateLimit(
  key: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  const bucket = buckets.get(key);

  // Nouvelle fenêtre : soit clé inconnue, soit fenêtre précédente expirée.
  if (!bucket || now >= bucket.resetAt) {
    if (buckets.size > MAX_TRACKED_KEYS) prune(now);
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, reset: resetAt };
  }

  bucket.count += 1;
  return {
    success: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    reset: bucket.resetAt,
  };
}

/** Extrait l'IP client à partir des en-têtes de proxy (best effort). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Applique le rate limit à une requête entrante, keyée par espace de noms + IP. */
export function checkRateLimit(
  request: Request,
  namespace: string,
  options?: RateLimitOptions,
): RateLimitResult {
  return rateLimit(`${namespace}:${getClientIp(request)}`, options);
}

/**
 * Lit une variable d'environnement en entier strictement positif, avec repli
 * sur `fallback` si absente ou invalide (non entier, ≤ 0, NaN…).
 */
export function parsePositiveInt(
  value: string | undefined,
  fallback: number,
): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** Réinitialise l'état interne. Réservé aux tests. */
export function resetRateLimitStore(): void {
  buckets.clear();
}
