# CLAUDE.md

Guide pour travailler sur **crypto-simulator** — un simulateur crypto front-end qui
reproduit la direction artistique de https://simulateurs.sinvestir.fr/.

- Stack : **Next.js 16** (App Router) + **shadcn/ui** + Tailwind CSS, auth **Better Auth**,
  BDD **Supabase / PostgreSQL** (voir [docker-compose.yml](docker-compose.yml)).
- DA de référence : voir [design.md](design.md) (palette, surfaces sombres, lueurs bleues, glassmorphism).
  Le site de référence est en Nuxt, mais **ce projet est en Next 16** — on ne reprend que la DA, pas le stack.

## Serveurs MCP disponibles

Ce projet déclare des serveurs MCP dans [.mcp.json](.mcp.json). Utilise-les **proactivement**
au bon moment plutôt que de répondre de mémoire.

| Serveur | À quoi il sert | Quand l'utiliser |
|---|---|---|
| **context7** | Documentation à jour des libs/frameworks | **Avant** d'écrire ou de déboguer du code Next.js 16, React, Tailwind, shadcn/ui, Better Auth ou Supabase. Récupère la syntaxe d'API, la config et les migrations — même pour des libs connues (le training peut être périmé). |
| **shadcn** | Recherche et ajout de composants depuis les registres shadcn | Quand on cherche, inspecte ou installe un composant UI (`search_items`, `view_items`, `get_add_command_for_items`). Avant de coder un composant à la main, vérifie s'il existe. |
| **ui-kit** | Exemples d'usage de `@ui-kit.ai/components` | **Avant** de générer du code d'interface : lister les exemples (`list_usage_examples`) puis récupérer celui visé (`get_usage_example`). |
| **playwright** | Pilotage de navigateur (naviguer, cliquer, screenshots, snapshots DOM) | Pour vérifier le rendu réel d'une page, comparer à la DA de référence, capturer des screenshots, tester des interactions ou déboguer le front en conditions réelles. |
| **remotion-documentation** | Documentation Remotion | Uniquement si on touche à de la vidéo/animation programmatique via Remotion. |

### Règles d'application

1. **Doc avant code** : pour toute question ou tâche sur Next.js/React/Tailwind/shadcn/Better Auth/Supabase,
   interroge **context7** d'abord. Préfère-le à une recherche web pour la doc de libs.
2. **UI avant d'écrire un composant** : consulte **ui-kit** et **shadcn** pour réutiliser
   un composant existant au lieu d'en réinventer un.
3. **Vérification visuelle** : après une modif d'interface, valide le rendu avec **playwright**
   (screenshot + snapshot) et confronte-le à [design.md](design.md) et à la référence.
4. **Remotion** : ne mobilise **remotion-documentation** que si une fonctionnalité vidéo l'exige.

## Skills locaux

Des skills de design sont disponibles dans [.claude/skills/](.claude/skills/) :
`frontend-design`, `ui-skills`, `ui-ux-designer`, `ui-ux-pro-max`. Mobilise-les pour les
décisions de DA, de typographie et de systèmes de composants.
