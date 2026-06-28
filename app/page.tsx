import { Simulator } from "./_components/Simulator";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-hero px-6 py-20">
      {/* Halo radial bleu derrière le contenu */}
      <div
        aria-hidden
        className="glow-radial pointer-events-none absolute top-0 left-1/2 size-[720px] -translate-x-1/2"
      />

      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <span className="eyebrow animate-fade-up">Simulateur crypto</span>

        <h1 className="animate-fade-up fade-delay-1 text-balance text-4xl leading-[1.1] text-white sm:text-5xl">
          Simulateur plus-value crypto
        </h1>
        <p className="animate-fade-up fade-delay-2 max-w-md text-pretty text-base text-primary">
          Le simulateur de calcul de plus-value crypto
        </p>

        <p className="animate-fade-up fade-delay-2 max-w-md text-pretty text-base text-muted-foreground">
          Choisissez une cryptomonnaie, un montant et une période : le simulateur
          rejoue la performance passée à partir de données historiques.
        </p>

        <Simulator />
      </section>
    </main>
  );
}
