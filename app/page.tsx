import { Button } from "@/components/ui/button";

/**
 * Page de démonstration du design system (DA S'investir).
 * Temporaire : sera remplacée par le simulateur. Sert à valider visuellement
 * que les tokens de design.md sont bien appliqués sur les composants shadcn.
 */
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-hero px-6 py-24">
      {/* Halo radial bleu derrière le contenu */}
      <div
        aria-hidden
        className="glow-radial pointer-events-none absolute top-1/4 left-1/2 size-[680px] -translate-x-1/2"
      />

      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <span className="eyebrow">Design system</span>

        <h1 className="text-balance text-5xl leading-[1.1] text-white sm:text-6xl">
          Le simulateur crypto, aux couleurs de S&apos;investir
        </h1>

        <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          Direction artistique fintech premium : fond nuit bleutée, accent bleu
          électrique, lueurs radiales et surfaces en verre. Tokens issus de{" "}
          <span className="text-brand-soft">design.md</span>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button className="rounded-full px-6">Démarrer une simulation</Button>
          <Button variant="outline" className="rounded-full px-6">
            Découvrir les simulateurs
          </Button>
        </div>

        {/* Carte glass de démonstration */}
        <div className="glass mt-6 w-full max-w-md p-6 text-left">
          <h3 className="text-lg font-semibold text-white">Carte « glass »</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Surface translucide, bordure blanche subtile et flou d&apos;arrière-plan.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="size-4 rounded-full bg-brand" title="brand #0049C6" />
            <span className="size-4 rounded-full bg-brand-bright" title="brand-bright #1098F7" />
            <span className="size-4 rounded-full bg-brand-soft" title="brand-soft #7899CE" />
            <span className="size-4 rounded-full bg-accent-gold" title="accent-gold #E9B949" />
          </div>
        </div>
      </section>
    </main>
  );
}
