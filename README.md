# Crypto Simulator

Simulateur crypto qui permet de visualiser et projeter des scénarios d'investissement,
inspiré de la direction artistique « fintech premium » de
[simulateurs.sinvestir.fr](https://simulateurs.sinvestir.fr/) (voir [design.md](design.md)).

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

```bash
# 1. Variables d'environnement
cp .env.example .env   # puis renseigner les valeurs

# 2. Lancer la base de données (PostgreSQL + Supabase Studio)
docker compose up -d

# 3. Installer les dépendances
npm install

# 4. Lancer l'application
npm run dev
```

L'app tourne sur http://localhost:3000 et Supabase Studio sur http://localhost:54323.

> **Dépannage — `Cannot find module '@tailwindcss/postcss'` / erreur 500 sur `/`**
> Symptôme d'un `NODE_ENV=production` présent dans l'environnement : npm passe en mode
> production et **n'installe pas les `devDependencies`** (Tailwind, PostCSS, TypeScript).
> Sur un poste de dev, retirer cette variable globale, ou forcer l'install avec
> `npm install --include=dev`. Sans incidence sur Vercel (les devDeps y sont installées pour le build).

## Variables d'environnement

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

## Structure

- [design.md](design.md) — direction artistique de référence (palette, surfaces, lueurs)
- [app/globals.css](app/globals.css) — tokens du design system (Tailwind v4 `@theme` + thème shadcn)
- [CLAUDE.md](CLAUDE.md) — guide projet + serveurs MCP disponibles
- [docker-compose.yml](docker-compose.yml) — services PostgreSQL et Supabase

## Outillage (MCP)

Le projet déclare des serveurs MCP dans [.mcp.json](.mcp.json) (context7, shadcn, ui-kit,
playwright, remotion). Voir [CLAUDE.md](CLAUDE.md) pour savoir quand les utiliser.
