# Conventions de code

Règles à respecter pour tout le code du projet (Next.js 16, shadcn/ui, Better Auth, Supabase).

## Composants

- **Pas de CSS inline** sur les composants. Utiliser les classes Tailwind / les composants
  shadcn/ui. (Pas d'attribut `style={{ ... }}`.)
- **La logique métier d'un composant vit toujours dans un hook custom** (`useXxx`).
  Le composant reste « présentationnel » : il consomme le hook et affiche le résultat.
- Respecter les principes **SOLID** (responsabilité unique, dépendances inversées via props/hooks,
  composants petits et composables, etc.).

## Organisation par page (colocation)

Tout ce qui est **lié à une page** est colocalisé dans le dossier de cette page, dans des
sous-dossiers préfixés par `_` (ignorés par le routing Next) :

- `_components/` — composants spécifiques à la page
- `_hooks/` — hooks custom de la page (logique métier)
- `_types/` — types TypeScript de la page
- `dto/` — schémas de validation **Zod** (DTO d'entrée/sortie)

### Exemple — page `login`

```
app/login/
├── _components/      # composants de la page login
├── _hooks/           # hooks (logique métier du login)
├── _types/           # types TS du login
├── dto/              # schémas Zod de validation (ex. loginSchema)
└── page.tsx          # assemble hooks + composants
```

## DTO / validation

- Les **DTO** contiennent les **schémas Zod** de validation.
- Valider les entrées (formulaires, params, payloads API) avec ces schémas.
- Dériver les types depuis les schémas (`z.infer<typeof schema>`) plutôt que de les dupliquer.

## Partagé vs. local

- Spécifique à une page → dans le dossier de la page (`_components`, `_hooks`, `_types`, `dto`).
- Réutilisé par plusieurs pages → remonter dans les dossiers partagés (ex. `components/`,
  `hooks/`, `lib/`, `types/` à la racine).
