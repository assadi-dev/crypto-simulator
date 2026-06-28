import { SimulatorForm } from "./_components/SimulatorForm";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-hero px-6 py-20">
      {/* Halo radial bleu derrière le contenu */}
      <div
        aria-hidden
        className="glow-radial pointer-events-none absolute top-0 left-1/2 size-[720px] -translate-x-1/2"
      />

      <section className="relative z-10 flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <span className="eyebrow">Simulateur crypto</span>

        <h1 className="text-balance text-4xl leading-[1.1] text-white sm:text-5xl">
          Combien aurait rapporté votre investissement crypto ?
        </h1>

        <p className="max-w-md text-pretty text-base text-muted-foreground">
          Choisissez une cryptomonnaie, un montant et une période : le simulateur
          rejoue la performance passée à partir de données historiques.
        </p>

        <SimulatorForm />
      </section>
    </main>
  );
}
