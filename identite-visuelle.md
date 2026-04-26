# Identité Visuelle — Révioria

> Source de vérité design pour l'ensemble du site et de l'application.
> Toute décision visuelle doit être cohérente avec ce document.

---

## 1. Personnalité de marque

**Révioria** est une application de révision par quiz pour lycéens de Seconde.

| Dimension | Valeur |
|-----------|--------|
| Ton | Motivant, direct, honnête — parle comme un ami qui réussit |
| Registre | Ni infantilisant, ni corporate. Lycéen premium. |
| Émotion cible | Confiance + élan ("je peux vraiment y arriver") |
| Ce qu'on évite | Froid, trop "startup IA", condescendant, trop coloré/enfantin |

---

## 2. Palette de couleurs

### Fond (dark theme — toujours)

```css
--bg:   #090A12   /* fond principal, pages */
--bg2:  #0D0F1B   /* sections alternées, zone app */
--bg3:  #121622   /* éléments surélevés, mockups */
--card: rgba(14, 16, 26, 0.92)  /* cartes, glassmorphism */
```

### Bordures

```css
--border:  rgba(255, 255, 255, 0.07)   /* bordure discrète standard */
--border2: rgba(255, 255, 255, 0.14)   /* bordure légèrement visible (hover, nav) */
```

### Couleurs actives

| Token | Hex | Rôle |
|-------|-----|------|
| `--indigo` | `#4D5EE8` | Couleur principale — liens actifs, boutons secondaires, logo |
| `--indigo-l` | `#7A8DF5` | Variante claire — labels, états hover de l'indigo |
| `--coral` | `#EF6E5A` | Appel à l'action principal — CTA, boutons primaires, featured |
| `--coral-l` | `#F79080` | Variante claire — hover coral, accents chauds |
| `--amber` | `#F5C840` | Récompenses, streaks, nouveautés, badges |
| `--amber-l` | `#FAD96A` | Variante claire amber |
| `--teal` | `#3DD6BF` | Succès, progression, checkmarks, feedback positif |

### Glows (effets lumineux)

```css
--glow-i: rgba(77,  94,  232, 0.16)   /* halo indigo */
--glow-c: rgba(239, 110,  90, 0.14)   /* halo coral */
--glow-a: rgba(245, 200,  64, 0.12)   /* halo amber */
```

### Texte

```css
--text:  #ECEDF5   /* texte principal — titres, contenu important */
--text2: #878FA8   /* texte secondaire — descriptions, sous-titres */
--text3: #484F68   /* texte tertiaire — labels, meta, placeholders */
```

### Règles d'utilisation couleurs

- **Le coral est la couleur d'action** : tous les CTAs principaux sont en coral.
- **L'indigo est la couleur d'identité** : logo, liens actifs, états sélectionnés.
- **L'amber est réservé aux récompenses** : streaks, badges, nouveautés. Ne pas l'utiliser sur des éléments ordinaires.
- **Le teal indique la réussite** : barres de progression complètes, checkmarks, confirmations.
- **Jamais de violet pur** : le violet (`#7C5CFC` type) est exclu — il renvoie trop à l'imagerie "IA/startup tech".

---

## 3. Typographie

### Familles

| Rôle | Famille | Google Fonts |
|------|---------|-------------|
| **Display** — grands titres hero | DM Serif Display | `DM+Serif+Display:ital@0;1` |
| **Heading** — UI, sections, boutons | Nunito | `Nunito:wght@400;600;700;800;900` |
| **Body** — corps de texte, descriptions | Quicksand | `Quicksand:wght@400;500;600;700` |

```css
--f-display: 'DM Serif Display', Georgia, serif;
--f-head:    'Nunito', sans-serif;
--f-body:    'Quicksand', sans-serif;
```

### Usage typographique

#### Hero H1 — DM Serif Display
```css
font-family: var(--f-display);
font-size: clamp(2.8rem, 6.5vw, 5rem);
font-weight: 400;          /* DM Serif est fort en 400 */
line-height: 1.1;
letter-spacing: -0.02em;
```
→ Peut être en *italique* pour les mots-clés émotionnels (`<em>`).

#### H2 sections — Nunito
```css
font-family: var(--f-head);
font-size: clamp(1.8rem, 3.5vw, 2.6rem);
font-weight: 900;
letter-spacing: -0.025em;
line-height: 1.15;
```

#### Labels de section
```css
font-size: 0.72rem;
font-weight: 700;
letter-spacing: 0.14em;
text-transform: uppercase;
```
Couleur selon contexte : `--indigo-l`, `--coral-l`, `--amber-l`, `--teal`.

#### Corps de texte
```css
font-family: var(--f-body);
font-size: 0.98rem;    /* description sections */
font-weight: 500;
line-height: 1.65;
color: var(--text2);
```

#### Boutons
```css
font-family: var(--f-head);
font-weight: 800;      /* Nunito 800 pour les CTA */
font-size: 0.95–1rem;
```

#### Noms de cartes / titres UI
```css
font-family: var(--f-head);
font-weight: 800;
letter-spacing: -0.01em;
```

---

## 4. Espacements & Radii

### Border-radius

```css
--r-sm:   10px    /* inputs, petits éléments, nav items */
--r-md:   16px    /* cartes moyennes, boutons rectangulaires */
--r-lg:   22px    /* grandes cartes, sections */
--r-xl:   30px    /* pricing cards, grandes surfaces */
--r-pill: 999px   /* nav, badges, boutons arrondis, pills */
```

### Sections

```css
padding: 88px 0;   /* sections standard */
padding: 96px 24px; /* sections avec container interne */
max-width: 1100px; margin: 0 auto; padding: 0 24px; /* container */
```

### Grid gaps

```css
gap: 14px;   /* features grid */
gap: 10px;   /* subjects grid */
gap: 16px;   /* pricing grid */
gap: 20px;   /* steps */
```

---

## 5. Composants clés

### Nav — pill flottante

```
position: fixed, top: 14px, centré
background: rgba(9,10,18,0.88) + backdrop-filter: blur(20px)
border: 1px solid --border2
border-radius: --r-pill
shadow: 0 8px 40px rgba(0,0,0,0.4)
```

- Logo : sparkle ✦ SVG indigo + point coral + point teal (voir `logo.2.svg`)
- Font logo : Nunito 900
- Liens : Quicksand 600, couleur `--text2`, hover fond `rgba(255,255,255,0.06)`
- CTA nav : coral, pill, Nunito 800

### Bouton primaire (CTA)

```css
background: linear-gradient(135deg, #EF6E5A 0%, #E85840 100%);
color: #fff;
border-radius: var(--r-pill);
padding: 14px 28px;
font-family: var(--f-head); font-weight: 800;
box-shadow: 0 4px 20px rgba(239,110,90,0.32);
```
Hover : `translateY(-2px)`, shadow boostée.

### Bouton ghost

```css
background: transparent;
border: 1px solid var(--border2);
border-radius: var(--r-pill);
color: var(--text2);
```

### Carte feature

```css
background: var(--card);
border: 1px solid var(--border);
border-radius: var(--r-lg);
padding: 30px;
```
Hover : `translateY(-3px)`, border `rgba(77,94,232,0.28)`.
Ligne colorée top au hover : `linear-gradient(90deg, --indigo → --coral → --amber)`.

Icône feature : 46×46px, border-radius `--r-sm`.
- Contexte indigo : `rgba(77,94,232,0.12)` + border `rgba(77,94,232,0.2)`
- Contexte coral : `rgba(239,110,90,0.10)` + border `rgba(239,110,90,0.2)`
- Contexte amber : `rgba(245,200,64,0.10)` + border `rgba(245,200,64,0.2)`
- Contexte teal : `rgba(61,214,191,0.10)` + border `rgba(61,214,191,0.2)`

### Badge

```css
font-family: var(--f-head); font-weight: 800;
font-size: 0.68–0.78rem; letter-spacing: 0.05em; text-transform: uppercase;
border-radius: var(--r-pill);
padding: 3–6px 10–16px;
```

- Gratuit : teal `rgba(61,214,191,.1)` + border teal
- Premium : amber `rgba(245,200,64,.1)` + border amber
- Nouveau/badge hero : amber clair

### Carte pricing (featured)

```css
border-color: var(--coral);
background: linear-gradient(145deg, rgba(239,110,90,0.1) 0%, var(--card) 60%);
box-shadow: 0 0 0 1px rgba(239,110,90,0.25), 0 24px 48px rgba(239,110,90,0.08);
```

### Check list pricing

- ✓ en teal (`var(--teal)`) pour les items inclus
- `–` en `var(--text3)` pour les items exclus

### Barre de progression

```css
background: rgba(255,255,255,0.07); /* piste */
height: 3px; border-radius: 2px;
/* fill */
background: linear-gradient(90deg, var(--indigo) 0%, var(--coral) 100%);
/* ou amber pour en-cours, teal pour complet */
```

### Section label (chapeau de section)

```css
font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em;
text-transform: uppercase;
```
Couleurs : indigo-l / coral-l / amber-l / teal selon le contexte émotionnel de la section.

---

## 6. Logo

**Fichier source** : `logos/logo_2.png` / `logo.2.svg`

- Icône : étoile 4 branches ✦ en indigo `#4D5EE8`
- Point accent coral `#EF6E5A` (en haut à droite)
- Point accent teal `#3DD6BF` (en bas à gauche)
- Typographie : Palatino / Georgia serif pour "Révioria", lettre-spacing `-1`
- Sous-titre : "ACADEMY" espacé, en indigo atténué

**Usage dans l'UI** :
- Nav / App header : SVG inline, étoile seule ou avec texte "Révioria"
- Taille min : 20px (icône seule)

---

## 7. Effets & Atmosphère

### Grain de fond

```css
body::before {
  background-image: url("data:image/svg+xml, [fractalNoise opacity=0.025]");
  background-size: 256px;
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
}
```
→ Ajoute de la texture sans surcharger. Obligatoire sur toutes les pages.

### Glows hero

3 halos atmosphériques dans le hero :
- **Indigo** centré haut : `rgba(77,94,232,0.16)`, blur 90px, 560×400px
- **Coral** bas-droite : `rgba(239,110,90,0.14)`, blur 90px, 380×380px
- **Amber** haut-gauche : `rgba(245,200,64,0.12)`, blur 90px, 260×260px

### Animations

```css
/* Fade-up au scroll — standard pour tous les blocs */
.fade-up { opacity: 0; transform: translateY(22px); transition: opacity .5s ease, transform .5s ease; }
.fade-up.visible { opacity: 1; transform: translateY(0); }
/* Décalages : transition-delay: .05s, .1s, .15s... */
```

### Hover cards

```css
transform: translateY(-3px);   /* standard cards */
transform: translateY(-2px);   /* petits éléments, pills */
transition: transform .2s, border-color .2s;
```

---

## 8. Structure de page type

```
Nav pill flottante (fixed)
↓
Hero — DM Serif Display, glows, badge amber, CTA coral, stats, mockup
↓
[divider full-width]
↓
Section features — label indigo, 6 cards en grid
↓
[divider]
↓
Section "Comment ça marche" — label coral, 4 steps
↓
Section matières — bg bg2, label teal, grid pills
↓
[divider]
↓
Témoignages — label coral, 3 cards
↓
[divider]
↓
Pricing — label amber, 2 plans (free + featured coral)
↓
CTA final — DM Serif Display italic pour l'emphase
↓
Séparateur "Zone Application"
↓
App Zone — bg bg2, header sticky, sélecteur niveau, grid matières
↓
Footer — minimal, dark
```

---

## 9. Ce qu'on n'utilise jamais

| Interdit | Raison |
|----------|--------|
| Violet pur `#7C5CFC` | Renvoie à "startup IA" (Claude, Gemini…) |
| Fond blanc ou gris clair | Pas cohérent avec le dark theme |
| Inter, Roboto, Arial | Trop génériques, sans identité |
| Purple gradients | Cliché AI-design |
| Cerveau comme icône | Imagerie "IA" évitée |
| Vert vif `#00FF00` style néon | Trop gaming, hors-ton |
| Animations lourdes en boucle | Distrait, nuit à la concentration |
