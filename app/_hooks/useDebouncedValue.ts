"use client";

import { useEffect, useState } from "react";

/**
 * Renvoie une version « retardée » d'une valeur : elle n'est mise à jour que
 * `delay` ms après le dernier changement. Utile pour ne pas recalculer à chaque
 * frappe clavier dans un champ.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
