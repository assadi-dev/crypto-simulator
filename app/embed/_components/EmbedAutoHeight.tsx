"use client";

import { useEffect } from "react";

/** Canal de communication avec le site hôte (préfixe des messages postMessage). */
export const EMBED_MESSAGE_TYPE = "sinvestir-simulator:height";

/**
 * Publie la hauteur du document vers la fenêtre parente afin que le site hôte
 * puisse redimensionner l'`<iframe>` sans scroll interne. Sans effet hors iframe.
 */
export function EmbedAutoHeight() {
  useEffect(() => {
    if (window.parent === window) return;

    const postHeight = () => {
      // scrollHeight reflète la hauteur réelle du contenu (le body hérite d'un
      // min-height pleine page qui fausserait une mesure via getBoundingClientRect).
      const height = Math.ceil(document.body.scrollHeight);
      window.parent.postMessage({ type: EMBED_MESSAGE_TYPE, height }, "*");
    };

    postHeight();
    const observer = new ResizeObserver(postHeight);
    observer.observe(document.body);
    window.addEventListener("load", postHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", postHeight);
    };
  }, []);

  return null;
}
