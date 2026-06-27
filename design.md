# Direction Artistique — S'investir Simulateurs

> Référence : https://simulateurs.sinvestir.fr/
> Document de design extrait du site de référence pour reproduire fidèlement sa direction artistique (DA).
> Stack observée : **Nuxt + Vue + Tailwind CSS v4 + Nuxt UI**. Typo : **titres = Plus Jakarta Sans · corps/UI = Lexend** (vérifié live, viewport 1920px).

---

## 1. Philosophie / Ambiance

Une DA **« fintech premium, sombre et confiante »**. L'écran est une nuit bleutée profonde dans laquelle
flottent des halos de lumière bleu électrique. Le contenu est **centré, aéré, pédagogique**. Le ton visuel
inspire le sérieux (finance) sans austérité grâce aux lueurs, aux dégradés doux et aux formes pilules.

Mots-clés : **sombre · bleu nuit · lueurs radiales · glassmorphism · centré · généreux · arrondi · épuré**.

Principes directeurs :
- **Fond sombre dominant** (near-black bleuté) ⇒ le contenu blanc « brille ».
- **Un seul accent fort** : le bleu `#0049C6`, renforcé d'un bleu lumineux `#1098F7` pour les lueurs.
- **Hiérarchie par la taille et l'opacité du blanc**, pas par la couleur.
- **Titres larges en graisse normale (400)** avec un **interlettrage négatif serré** (look éditorial moderne).
- **Espacements très généreux** entre sections (120–180px).
- **Surfaces translucides + bordures blanches très subtiles** (1px @ 5–10% d'opacité).

---

## 2. Palette de couleurs

### Couleurs de marque (accent)
| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--brand` (primaire) | `#0049C6` | `0 73 198` | Boutons pleins, bordures actives, liens d'accent |
| `--brand-bright` (lueur/ring) | `#1098F7` | `16 152 247` | Halos radiaux, focus ring, reflets |
| `--brand-deep` | `#04265F` | `4 38 95` | Fin de dégradé bouton/bandeau |
| `--brand-soft` | `#7899CE` | `120 153 206` | Texte/icône bleu désaturé secondaire |

### Surfaces (fonds sombres)
| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--surface` (page) | `#080C16` | `8 12 22` | Fond global de la page |
| `--surface-shell` (live) | `rgba(3,12,36,.95)` ≈ `#030C24` | `3 12 36` | **Fond réel** peint par un wrapper `.homepage-screen-shell` (le `body` lui-même est transparent/blanc — appliquer le fond sombre sur un conteneur, pas sur `body`) |
| `--surface-soft` | `#0F172A` | `15 23 42` | Variante (slate-900) |
| `--surface-elevated` | `#00173F` | `0 23 63` | Cartes/zones surélevées teintées bleu |
| `--hero-1` | `#000519` | `0 5 25` | Début du dégradé hero |
| `--hero-2` | `#000000` | `0 0 0` | Fin du dégradé hero |
| Cartes verre | `rgba(4,8,21,.22)` / `rgba(0,0,0,.22)` | — | Cartes « glass » translucides |
| Voile carte | `rgba(3,8,25,.92)` | `3 8 25` | Voile sombre sur visuels |

### Texte (sur fond sombre)
| Token | Valeur | Usage |
|---|---|---|
| `--text` | `#FFFFFF` | Titres, chiffres clés |
| `--text-body` | `rgba(255,255,255,.82)` | Paragraphes courants |
| `--text-muted` | `rgba(255,255,255,.72)` | Texte secondaire |
| `--text-dim` | `rgba(255,255,255,.46)` | Légendes, désactivé |
| `--text-muted-gray` | `#9CA3AF` (`156 163 175`) | Légendes neutres (token Nuxt UI) |

### Bordures
| Token | Valeur | Usage |
|---|---|---|
| `--border` | `rgba(255,255,255,.05)` | Bordure de carte par défaut (très subtile) |
| `--border-strong` | `rgba(255,255,255,.10)` | Cartes secondaires / hover |
| `--border-active` | `#0049C6` | Carte/élément actif (ex. étape sélectionnée) |
| `--ring` | `rgba(255,255,255,.34)` | Anneau de boutons ronds (carrousel) |

### Accent secondaire (imagerie / data-viz)
Le **logo « S » et les graphiques** des maquettes utilisent un **doré / ambre** (≈ `#E9B949` / `oklch(85.2% .199 91.936)` ~ `yellow-400`).
Il n'est pas exposé en CSS mais reste l'accent chaud de la marque ⇒ à réserver aux **data-viz et au logo**, jamais au texte courant.

> **Note Nuxt UI** : le thème déclare une primaire *verte* par défaut (`--ui-primary: oklch(72.3% .219 149.579)`),
> mais la marque la **surcharge en bleu `#0049C6`**. Pour reproduire la DA, ignorer le vert : l'accent réel est bleu.

---

## 3. Typographie

**Deux polices (Google Fonts), avec un rôle distinct — vérifié sur le site live :**
- **Titres (`h1`–`h3`, eyebrows) : `Plus Jakarta Sans`** — c'est elle qui porte le caractère éditorial.
- **Corps de texte, boutons, UI : `Lexend`** — c'est la police appliquée sur `body`.

```css
/* Titres */
--font-display: "Plus Jakarta Sans", "Lexend", ui-sans-serif, system-ui, sans-serif;
/* Corps / UI (body) */
--font-sans:    "Lexend", ui-sans-serif, system-ui, -apple-system,
                "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Échelle typographique (desktop)
| Rôle | Élément | Taille | Graisse | Interligne | Interlettrage |
|---|---|---|---|---|---|
| Display / Titre 1 | `h1` | **60px** (3.75rem) | **400** | 72px (1.2) | **-1.8px** (≈ -0.03em) |
| Titre de section | `h2` | **42px** (≈2.6rem) | **400** | 50.4px (1.2) | **-1.26px** (≈ -0.03em) |
| Titre de carte | `h3` | **18px** (1.125rem) | **600** | 21.6px (1.2) | -0.54px |
| Corps | `p` | **16px** (1rem) | 400 | 24px (1.5) | normal |
| Eyebrow / sur-titre | label | **14px** | 400 | — | -0.28px |
| Légende / petit | small | 13–14px | 300 | — | — |
| Chiffres clés (stats) | `+40k`, `8` | très grand | 600–700 | serré | -0.03em |

**Règles clés de la DA typographique :**
- Les **gros titres sont en graisse 400** (pas bold) — l'impact vient de la **taille + du tracking négatif serré**.
- Les **titres de cartes** passent en **600** pour la lisibilité à petite taille.
- Le **texte d'interface/boutons** est souvent **léger (300)**.
- Toujours **interlettrage négatif** sur les titres ≥ 18px (`tracking-tight` ≈ -0.03em).
- Couleur des titres : **blanc pur** ; corps : **blanc 82%**.

Responsive : réduire `h1` ≈ 36–40px et `h2` ≈ 28–32px sur mobile, conserver le tracking serré.

---

## 4. Mise en page & espacements

- **Conteneur max** : `80rem` (1280px), centré, avec gouttières latérales.
- **Base d'espacement** : `0.25rem` (échelle Tailwind 4/8px).
- **Rythme vertical entre sections** : **120px à 180px** de padding-top (hero 160px). Très aéré.
- **Grille simulateurs / comparateurs** : **4 colonnes**, **gap 24px** (cartes ≈ 321px) en desktop.
  - Dégradé responsive attendu : 4 → 2 → 1 colonne.
- **Grille « Comment ça marche »** : 2 zones (liste d'étapes à gauche, visuel à droite), gap ~20px.
- **Alignement** : la plupart des en-têtes de section sont **centrés** (eyebrow + titre), le contenu suit en grille.

---

## 5. Rayons, bordures & formes

| Élément | Rayon |
|---|---|
| Boutons (CTA, nav) | **pilule** — `9999px` (radius 200px) |
| Boutons ronds (carrousel, play) | cercle `999px` |
| Eyebrow / badges | `100px` (pilule) |
| Cartes simulateur/comparateur | **20px** |
| Cartes étapes / panneaux | **15px** |
| Tuiles compteur / petits blocs | 12–15px |

Bordures : **1px solide**, blanc à **5–10% d'opacité** par défaut ; **`#0049C6`** pour l'état actif/sélectionné.
Les cartes sont en `overflow: hidden` (image en haut détourée par le rayon).

---

## 6. Lueurs, dégradés & effets (cœur de la DA)

L'identité visuelle repose sur des **halos radiaux bleus** et des **dégradés sombres**. Valeurs exactes relevées :

### Dégradé de fond / hero
```css
/* Fond hero : nuit bleutée vers noir */
background: linear-gradient(126.82deg, #000519 28.59%, #000000 85.18%);
```

### Halo radial bleu (lueur centrale derrière le hero / CTA)
```css
background: radial-gradient(
  rgba(16,152,247,.18) 0%,
  rgba(8,111,227,.12) 24%,
  rgba(0,73,198,.07) 40%,
  rgba(0,0,49,.02) 56%,
  rgba(0,0,0,0) 74%
);
```

### Lueur haute centrée (au-dessus d'un visuel)
```css
background:
  linear-gradient(rgba(4,8,20,.02), rgba(4,8,20,.08) 40%, rgba(4,8,20,.9)),
  radial-gradient(circle at 50% -5%, rgba(16,152,247,.2), rgba(0,0,0,0));
```

### Voile sombre sur visuels (lisibilité du texte par-dessus)
```css
background: linear-gradient(rgba(6,18,48,.72), rgba(2,10,28,.92));
```

### Dégradé d'accent (bandeau / bouton spécial)
```css
background: linear-gradient(to right, #0049C6, #04265F);
```

### Effets transverses
- **Glassmorphism** : fonds `rgba(...,.22)` + bordure blanche 5–10% (option `backdrop-filter: blur()`).
- **Ombre interne subtile** sur boutons ronds : `inset 0 0 0 1px rgba(255,255,255,.05)`.
- **Pas d'ombres portées dures** : la profondeur vient des **lueurs** et de la translucidité, pas des `box-shadow` noires.
- Les visuels produits (dashboards) « flottent » sur un **halo bleu** plutôt que sur une ombre.

---

## 7. Composants

### Bouton primaire (CTA)
```
fond: #0049C6 · texte: #FFFFFF · rayon: 9999px (pilule)
padding: 18px 24px · taille: 14px · graisse: 300 · sans ombre
hover (suggéré): léger éclaircissement / lueur bleue
```

### Bouton secondaire (outline)
```
fond: transparent · bordure: 1px solid #0049C6 · texte: #FFFFFF
rayon: pilule · padding: 12px 16px · taille: 13px
```

### Lien-bouton « ghost » (texte + chevron)
```
fond: transparent · texte: rgba(255,255,255,.92) · 14px
icône chevron à droite · soulignement discret au survol
```

### Eyebrow / sur-titre (badge au-dessus des titres)
```
pilule rayon 100px · bordure 1px très subtile · padding 9px 20px
texte 14px blanc · centré · ex. « Nos simulateurs », « FAQ »
```

### Carte simulateur / comparateur
```
rayon 20px · bordure 1px rgba(255,255,255,.05) · overflow hidden · fond translucide
structure: [image/illustration en haut] + [h3 600 18px] + [p blanc ~72% 14–16px]
badge « Bientôt disponible » pour les items à venir (pilule, coin)
état hover (suggéré): bordure → #0049C6 + légère élévation/lueur
```

### Carte « étape » (Comment ça marche)
```
rayon 15px · padding 24px · numéro encerclé à gauche + titre + description
état actif: bordure 1px #0049C6 ; inactif: fond rgba(0,0,0,.22) + bordure blanc 10%
```

### Compteur / odomètre (« 25 255 utilisateurs »)
```
chiffres dans des tuiles sombres séparées · fond rgba(255,255,255,.05)
bordure subtile · animation de défilement (rolling digits) · label en MAJUSCULES dessous
```

### Statistiques clés
```
grand nombre blanc (ex. « +40k », « 8 ») graisse 600–700 · label gris dessous en petit
disposition en 3 colonnes centrées
```

### Accordéon FAQ
```
items empilés · fond sombre translucide · rayon ~12–15px · bordure subtile
en-tête: question (gauche) + icône +/chevron (droite) · ouverture: réponse blanc ~72%
```

### En-tête (header)
```
transparent au-dessus du fond sombre · hauteur ~54px
gauche: logo « S'investir » (S doré) · droite: « Se connecter » (outline) + « Créer un compte » (plein bleu)
allure « pilule flottante » · pas de bordure basse marquée
```

### Pied de page (footer)
```
fond sombre · logo + icônes sociales (X, Facebook, LinkedIn, YouTube)
bloc de disclaimer légal en gris désaturé (petit) · liens légaux + copyright
```

### Carrousel
```
flèches rondes (cercle) · état désactivé atténué · bordure/anneau blanc ~34%
```

---

## 8. Iconographie & imagerie

- **Icônes** : style linéaire fin, monochrome blanc, taille modérée (check, partage, cadenas, flèches).
- **Logo** : monogramme **« S » doré/ambre** + wordmark blanc.
- **Illustrations produit** : captures de dashboards sombres avec **graphiques à barres dorés/bleus**,
  présentées sur un **halo bleu** (jamais d'ombre dure).
- **Coins arrondis** systématiques sur tous les visuels intégrés (20px).

---

## 9. Animations & interactions

- **Compteurs animés** (rolling digits) sur les chiffres de communauté.
- **Transitions douces** : durée ≈ `0.15s`, easing `cubic-bezier(.4,0,.2,1)` (ease-in-out).
- **Hover cartes** : transition bordure/lueur (suggéré, cohérent avec la DA).
- **Lueurs** statiques mais peuvent « respirer » légèrement (pulse lent optionnel).
- Sobriété : pas d'animations tape-à-l'œil ; mouvements subtils et fonctionnels.

---

## 10. Tokens prêts à l'emploi

### CSS custom properties (`:root`)
```css
:root {
  /* Marque */
  --brand:          #0049C6;
  --brand-bright:   #1098F7;
  --brand-deep:     #04265F;
  --brand-soft:     #7899CE;

  /* Surfaces */
  --surface:          #080C16;
  --surface-soft:     #0F172A;
  --surface-elevated: #00173F;
  --hero-1:           #000519;
  --hero-2:           #000000;

  /* Texte */
  --text:        #FFFFFF;
  --text-body:   rgba(255,255,255,.82);
  --text-muted:  rgba(255,255,255,.72);
  --text-dim:    rgba(255,255,255,.46);

  /* Bordures */
  --border:        rgba(255,255,255,.05);
  --border-strong: rgba(255,255,255,.10);
  --border-active: #0049C6;
  --ring:          rgba(255,255,255,.34);

  /* Rayons */
  --radius-pill: 9999px;
  --radius-card: 20px;
  --radius-panel: 15px;

  /* Type — titres en Plus Jakarta Sans, corps/UI en Lexend */
  --font-display: "Plus Jakarta Sans", "Lexend", ui-sans-serif, system-ui, sans-serif;
  --font-sans:    "Lexend", ui-sans-serif, system-ui, sans-serif;

  /* Layout */
  --container: 80rem;     /* 1280px */
  --section-gap: 160px;   /* 120–180px selon section */

  /* Motion */
  --ease: cubic-bezier(.4,0,.2,1);
  --duration: .15s;
}

body {
  background: var(--surface);   /* ou un wrapper en rgba(3,12,36,.95) comme sur le site live */
  color: var(--text-body);
  font-family: var(--font-sans); /* Lexend */
}

h1, h2, h3, .eyebrow {
  font-family: var(--font-display); /* Plus Jakarta Sans */
  letter-spacing: var(--tracking-tightest, -0.03em);
}
```

### Tailwind CSS v4 (`@theme`)
```css
@import "tailwindcss";

@theme {
  --color-brand:        #0049C6;
  --color-brand-bright: #1098F7;
  --color-brand-deep:   #04265F;
  --color-surface:      #080C16;
  --color-surface-soft: #0F172A;
  --color-surface-elevated: #00173F;

  --font-display: "Plus Jakarta Sans", "Lexend", ui-sans-serif, system-ui, sans-serif;
  --font-sans:    "Lexend", ui-sans-serif, system-ui, sans-serif;

  --radius-pill: 9999px;
  --radius-card: 20px;

  --tracking-tightest: -0.03em; /* titres */
}
```

### Import de la police
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lexend:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 11. Anatomie de la page (sections, dans l'ordre)

1. **Header** transparent — logo + « Se connecter » (outline) / « Créer un compte » (plein bleu).
2. **Hero centré** — eyebrow pilule, `h1` 60px, paragraphe, 2 CTA (plein + ghost-chevron), puis **maquette dashboard** sur halo bleu, suivie d'une rangée de 4 atouts à puces (check).
3. **Communauté** — eyebrow « Rejoignez-nous », `h2` sur 2 lignes, **compteur odomètre** + label MAJUSCULES.
4. **Comment ça marche** — 3 **cartes étapes** numérotées (active = bordure bleue) + **visuel produit** à halo.
5. **Chiffres clés** — « +40k / 8 / 8 » en 3 colonnes.
6. **Boîte à outils** — logo + titre + texte + CTA bleu + **maquette mobile** avec bouton **play** rond.
7. **Nos simulateurs** — grille **4×2** de cartes (image + titre + desc) + CTA « Lancez votre première simulation ».
8. **Nos comparateurs** — grille de cartes (dont badge « Bientôt disponible ») + CTA + **flèches carrousel**.
9. **FAQ** — accordéon de questions.
10. **Footer** — logo, réseaux sociaux, disclaimer légal, liens légaux + copyright.

---

## 12. Accessibilité & responsive

- **Contraste** : blanc pur sur surfaces très sombres ⇒ ratios élevés. Éviter le texte sous 72% d'opacité pour les longues lectures.
- **Focus** : utiliser `--brand-bright` (`#1098F7`) comme anneau de focus visible.
- **Cibles tactiles** : boutons ≥ 44px de hauteur effective (padding pilule généreux).
- **Responsive** : grilles 4 → 2 → 1 ; titres réduits ; conserver le tracking serré et les lueurs (réduire leur taille).
- **Mouvement** : respecter `prefers-reduced-motion` pour le compteur et les pulses.

---

## 13. À faire / éviter

**À faire**
- Fonds sombres + lueurs radiales bleues pour la profondeur.
- Titres larges en graisse 400, tracking négatif.
- Un seul accent bleu fort ; le reste en nuances de blanc.
- Formes pilules pour boutons/badges, cartes à coins 20px.
- Beaucoup d'air entre les sections.

**À éviter**
- Ombres portées noires marquées (préférer les lueurs).
- Multiplier les couleurs d'accent (le doré reste cantonné au logo/graphiques).
- Titres en gras lourd (700) à grande taille — casse le caractère éditorial.
- Bordures blanches trop visibles (rester à 5–10%).
- Fonds clairs sur de grandes surfaces (la DA est résolument dark).
```
