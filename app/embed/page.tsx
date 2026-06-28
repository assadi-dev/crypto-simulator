import type { Metadata } from "next";

import { Simulator } from "../_components/Simulator";
import { EmbedAutoHeight } from "./_components/EmbedAutoHeight";

export const metadata: Metadata = {
  title: "Simulateur crypto — aperçu intégré",
  robots: { index: false, follow: false },
};

/**
 * Version embarquable du simulateur (à charger dans une `<iframe>`).
 * Pas de hero marketing : uniquement l'outil, dans un cadre compact et autonome.
 */
export default function EmbedPage() {
  return (
    <main className="relative flex flex-col items-center overflow-hidden bg-hero px-4 py-8">
      <div className="relative z-10 w-full max-w-5xl">
        <Simulator />
      </div>
      <EmbedAutoHeight />
    </main>
  );
}
