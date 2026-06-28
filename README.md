# Crypto Simulator

Simulateur crypto qui permet de visualiser et projeter des scénarios d'investissement,
inspiré de la direction artistique « fintech premium » de
[simulateurs.sinvestir.fr](https://simulateurs.sinvestir.fr/) (voir [design.md](design.md)).

## Le simulateur

On rejoue un investissement **passé** à partir d'un historique de prix quotidiens
(« backtesting »), en une fois ou de façon récurrente (**DCA**) :

- **Entrées** : cryptomonnaie, montant, fréquence (unique / quotidien / hebdo / mensuel), période.
- **Sorties** : total investi, valeur finale, plus/moins-value, performance (%) et **graphique**
  d'évolution (valeur du portefeuille vs total investi).

Le composant est **autonome** : aucune base de données, aucune authentification et
**aucune clé API** ne sont nécessaires pour le faire tourner.

- Moteur de calcul (fonction pure, testable) : [lib/backtest.ts](lib/backtest.ts)
- Prix historiques : [app/api/prices/route.ts](app/api/prices/route.ts) (proxy Binance, sans clé)
- UI colocalisée : [app/_components/](app/_components/), [app/_hooks/](app/_hooks/),
  [app/_types/](app/_types/), [app/dto/](app/dto/)

## Stack technique

| Couche | Choix |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + React 19 |
| UI | **shadcn/ui** (Radix) + **Tailwind CSS v4** |
| Formulaires | **React Hook Form** + **Zod v4** (`@hookform/resolvers`) |
| Authentification | **Better Auth** |
| Base de données | **Supabase** (PostgreSQL) |
| Conteneurisation | **Docker Compose** (PostgreSQL + Supabase) |

## Prérequis

- [Node.js](https://nodejs.org/) **24+** et un gestionnaire de paquets (npm / pnpm / bun)
- [Docker](https://www.docker.com/) + Docker Compose

## Démarrage

Pour **lancer uniquement le simulateur**, ni Docker ni variables d'environnement ne sont requis :

```bash
npm install
npm run dev
```

L'app tourne sur http://localhost:3000.

<details>
<summary>Projet complet (Better Auth + Supabase)</summary>

```bash
cp .env.example .env   # renseigner les valeurs
docker compose up -d   # PostgreSQL + Supabase Studio (http://localhost:54323)
npm install
npm run dev
```

</details>

> **Dépannage — `Cannot find module '@tailwindcss/postcss'` / erreur 500 sur `/`**
> Symptôme d'un `NODE_ENV=production` présent dans l'environnement : npm passe en mode
> production et **n'installe pas les `devDependencies`** (Tailwind, PostCSS, TypeScript).
> Sur un poste de dev, retirer cette variable globale, ou forcer l'install avec
> `npm install --include=dev`. Sans incidence sur Vercel (les devDeps y sont installées pour le build).

## Variables d'environnement

> **Le simulateur ne requiert aucune variable d'environnement.** Les clés ci-dessous ne
> concernent que le projet complet (Better Auth + Supabase), non nécessaire à la démo.

Voir [.env.example](.env.example). Principales clés :

- `DATABASE_URL` — chaîne de connexion PostgreSQL (utilisée par Better Auth / l'ORM)
- `BETTER_AUTH_SECRET` — secret de signature des sessions Better Auth
- `BETTER_AUTH_URL` — URL publique de l'app (ex. `http://localhost:3000`)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — accès Supabase côté client
- `CONTEXT7_API_KEY` — clé du serveur MCP Context7 (outillage de dev, voir [.mcp.json](.mcp.json))

## Design system

La direction artistique de [simulateurs.sinvestir.fr](https://simulateurs.sinvestir.fr/) est
documentée dans [design.md](design.md) et intégrée dans [app/globals.css](app/globals.css) :
les tokens de marque (bleu `#0049C6`, fond nuit `#080C16`, lueurs radiales, rayons) sont mappés
sur les variables sémantiques de shadcn/ui, donc **tous les composants en héritent automatiquement**.
Polices : **Plus Jakarta Sans** (titres) + **Lexend** (corps). L'app est en **mode sombre** par défaut.

## Embedding (aperçu intégré)

Le simulateur est conçu pour être embarqué depuis un autre site (ex. `sinvestir.fr`) :

- Route dédiée **`/embed`** ([app/embed/page.tsx](app/embed/page.tsx)) : uniquement l'outil,
  sans hero ni navigation, `noindex`.
- **Auto-hauteur** : la page publie sa hauteur réelle au site hôte via `postMessage`
  ([app/embed/_components/EmbedAutoHeight.tsx](app/embed/_components/EmbedAutoHeight.tsx)),
  pour redimensionner l'`<iframe>` sans scroll interne.
- Exemple d'intégration complet (avec écoute du message) :
  [public/embed-example.html](public/embed-example.html) → accessible sur `/embed-example.html`.

```html
<iframe src="https://<votre-deploiement>/embed" title="Simulateur crypto" style="width:100%;border:0"></iframe>
<script>
  window.addEventListener("message", (e) => {
    if (e.data?.type === "sinvestir-simulator:height") {
      document.querySelector("iframe").style.height = e.data.height + "px";
    }
  });
</script>
```

> Par défaut le framing est autorisé partout (pratique pour tester). En production, on
> restreindrait les hôtes via l'en-tête `Content-Security-Policy: frame-ancestors https://sinvestir.fr`.

## Partis pris techniques

- **Next.js + Vercel** : aligné sur la stack interne S'investir → intégration directe dans
  l'infra, et le simulateur peut prendre la place de l'actuel sur `simulateurs.sinvestir.fr`.
- **Source de prix = Binance (sans clé)** : CoinGecko et CryptoCompare exigent désormais une
  clé API (réponses `401` en accès anonyme), et le tier démo de CoinGecko plafonne l'historique
  à 365 jours. Binance expose des paires EUR et un historique long **sans authentification**,
  ce qui garde la démo **« clone & run »**. La récupération passe par une **route API interne**
  ([app/api/prices/route.ts](app/api/prices/route.ts)) qui isole le fournisseur (changer de
  source ne touche pas le front), évite les soucis CORS et **met en cache 1 h**.
- **Moteur de calcul = fonction pure** ([lib/backtest.ts](lib/backtest.ts)) : sans dépendance
  réseau/UI, donc **testable** et réutilisable côté serveur. Recherche de prix par dichotomie,
  timeline échantillonnée pour le graphique.
- **Logique dans des hooks, composants présentationnels** : `useSimulatorForm` (validation) et
  `useSimulation` (fetch + calcul + états) ; les composants se contentent d'afficher.
- **Validation Zod en DTO** : un schéma unique sert de source de vérité, les types sont dérivés
  (`z.infer`) plutôt que dupliqués.
- **Design system mappé sur shadcn** : les tokens de `design.md` alimentent les variables
  sémantiques shadcn → fidélité visuelle sans surcharger chaque composant.
- **Peu de dépendances, composant embarquable** : le simulateur est un bloc autonome
  (`<Simulator />`), pensé pour l'embedding (aucune dépendance à une BDD ou à l'auth).

## Structure

- [design.md](design.md) — direction artistique de référence (palette, surfaces, lueurs)
- [app/globals.css](app/globals.css) — tokens du design system (Tailwind v4 `@theme` + thème shadcn)
- [CLAUDE.md](CLAUDE.md) — guide projet + serveurs MCP disponibles
- [docker-compose.yml](docker-compose.yml) — services PostgreSQL et Supabase

## Outillage (MCP)

Le projet déclare des serveurs MCP dans [.mcp.json](.mcp.json) (context7, shadcn, ui-kit,
playwright, remotion). Voir [CLAUDE.md](CLAUDE.md) pour savoir quand les utiliser.
