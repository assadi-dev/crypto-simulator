import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkRateLimit,
  getClientIp,
  parsePositiveInt,
  rateLimit,
  resetRateLimitStore,
} from "@/lib/rate-limit";

const request = (headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/prices", { headers });

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("autorise les requêtes sous la limite et décrémente le restant", () => {
    const first = rateLimit("k", { limit: 3, windowMs: 1000 });
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(2);

    const second = rateLimit("k", { limit: 3, windowMs: 1000 });
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(1);
  });

  it("bloque la requête au-delà de la limite", () => {
    const opts = { limit: 2, windowMs: 1000 };
    expect(rateLimit("k", opts).success).toBe(true);
    expect(rateLimit("k", opts).success).toBe(true);

    const blocked = rateLimit("k", opts);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("isole les compteurs par clé", () => {
    const opts = { limit: 1, windowMs: 1000 };
    expect(rateLimit("a", opts).success).toBe(true);
    expect(rateLimit("b", opts).success).toBe(true); // clé différente
    expect(rateLimit("a", opts).success).toBe(false);
  });

  it("réinitialise le compteur une fois la fenêtre expirée", () => {
    vi.useFakeTimers();
    try {
      const opts = { limit: 1, windowMs: 1000 };
      expect(rateLimit("k", opts).success).toBe(true);
      expect(rateLimit("k", opts).success).toBe(false);

      vi.advanceTimersByTime(1001); // au-delà de la fenêtre
      expect(rateLimit("k", opts).success).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("getClientIp", () => {
  it("prend la première IP de x-forwarded-for", () => {
    expect(getClientIp(request({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe(
      "1.2.3.4",
    );
  });

  it("retombe sur x-real-ip", () => {
    expect(getClientIp(request({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("retourne « unknown » sans en-tête d'IP", () => {
    expect(getClientIp(request())).toBe("unknown");
  });
});

describe("parsePositiveInt", () => {
  it("retourne la valeur repli quand la variable est absente", () => {
    expect(parsePositiveInt(undefined, 30)).toBe(30);
  });

  it("parse un entier positif valide", () => {
    expect(parsePositiveInt("100", 30)).toBe(100);
  });

  it("retombe sur le repli pour une valeur invalide (0, négatif, non entier, NaN)", () => {
    expect(parsePositiveInt("0", 30)).toBe(30);
    expect(parsePositiveInt("-5", 30)).toBe(30);
    expect(parsePositiveInt("12.5", 30)).toBe(30);
    expect(parsePositiveInt("abc", 30)).toBe(30);
    expect(parsePositiveInt("", 30)).toBe(30);
  });
});

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  afterEach(() => {
    resetRateLimitStore();
  });

  it("isole les IP via l'espace de noms + IP", () => {
    const opts = { limit: 1, windowMs: 1000 };
    const ipA = request({ "x-forwarded-for": "1.1.1.1" });
    const ipB = request({ "x-forwarded-for": "2.2.2.2" });

    expect(checkRateLimit(ipA, "prices", opts).success).toBe(true);
    expect(checkRateLimit(ipB, "prices", opts).success).toBe(true);
    expect(checkRateLimit(ipA, "prices", opts).success).toBe(false);
  });
});
