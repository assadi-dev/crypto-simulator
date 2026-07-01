import type { MetadataRoute } from "next";

// Manifest PWA — généré par Next.js à /manifest.webmanifest
// Couleurs alignées sur la DA (voir design.md) : fond near-black bleuté, accent bleu.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Simulateur Crypto-monnaie | S'investir",
    short_name: "Crypto Simulator",
    description:
      "Simulez la performance d'un investissement en cryptomonnaie (one-shot ou DCA) à partir de données historiques.",
    lang: "fr",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#080C16",
    theme_color: "#0049C6",
    categories: ["finance", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
