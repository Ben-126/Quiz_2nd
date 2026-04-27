# Streak System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un système de streak complet avec gels, calendrier visuel, nouvelles récompenses et notifications.

**Architecture:** Étendre `ProfilGamification` avec des champs gel, enrichir la logique de `gamification.ts` pour gérer l'auto-gel et la recharge mensuelle, créer deux nouveaux composants UI (`StreakDisplay`, `CalendrierStreak`), et intégrer le tout dans la page `/progression`.

**Tech Stack:** TypeScript, React 19, Next.js App Router, Zod, localStorage, Tailwind CSS v4

---

## Structure des fichiers

| Fichier | Action | Responsabilité |
|---|---|---|
| `src/types/index.ts` | Modifier | Ajouter champs gel + TypeNotification streak |
| `src/lib/gamification.ts` | Modifier | Logique gel auto, recharge mensuelle, badges 30j/100j, bonus XP 7j |
| `src/components/gamification/StreakDisplay.tsx` | Créer | Flamme animée + compteur + gels restants |
| `src/components/gamification/CalendrierStreak.tsx` | Créer | Calendrier mensuel avec jours joués/gelés/manqués |
| `src/app/progression/page.tsx` | Modifier | Intégrer StreakDisplay + CalendrierStreak |

---

## Task 1 : Types — champs gel + nouvelles notifications

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Ouvrir et lire le fichier actuel**

Lire `src/types/index.ts` — déjà fait en contexte.

- [ ] **Step 2: Ajouter les champs gel dans ProfilGamification**

Dans `src/types/index.ts`, remplacer l'interface `ProfilGamification` :

```typescript
export interface ProfilGamification {
  xpTotal: number;
  dernierQuizDate: string | null; // "YYYY-MM-DD"
  streakJours: number;
  badgesDebloques: BadgeDebloque[];
  xpDuJour: number;          // XP cumulés aujourd'hui (plafond 150)
  quizXpDuJour: string[];    // "matiereSlug/chapitreSlug" ayant déjà rapporté XP aujourd'hui
  gelsRestants: number;      // 0-3, gels disponibles ce mois
  gelsUtilises: number;      // gels utilisés ce mois (pour affichage historique)
  dateDerniereRechargeGels: string | null; // "YYYY-MM" (ex: "2026-04")
  joursJoues: string[];      // dates "YYYY-MM-DD" où un quiz a été fait (calendrier)
  joursGeles: string[];      // dates "YYYY-MM-DD" où un gel a été utilisé automatiquement
}
```

- [ ] **Step 3: Étendre TypeNotification avec les types streak**

Dans `src/types/index.ts`, remplacer la ligne :

```typescript
export type TypeNotification = "friend_request" | "challenge_received" | "challenge_completed";
```

Par :

```typescript
export type TypeNotification =
  | "friend_request"
  | "challenge_received"
  | "challenge_completed"
  | "streak_rappel"
  | "streak_perdu"
  | "streak_gel_utilise";
```

- [ ] **Step 4: Vérifier qu'aucune erreur TypeScript n'est introduite**

```bash
cd "C:\Users\Benpo\Desktop\Claude-code\projet-Révioria" && npx tsc --noEmit 2>&1 | head -30
```

Expected: Erreurs dans `gamification.ts` uniquement (champs non encore initialisés dans `PROFIL_DEFAULT`) — normal, sera corrigé en Task 2.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(streak): étendre ProfilGamification avec champs gel et nouveaux types notif"
```

---

## Task 2 : Logique gamification — gel auto, recharge mensuelle, badges, bonus XP

**Files:**
- Modify: `src/lib/gamification.ts`

- [ ] **Step 1: Mettre à jour PROFIL_DEFAULT avec les nouveaux champs**

Dans `src/lib/gamification.ts`, remplacer `PROFIL_DEFAULT` :

```typescript
const PROFIL_DEFAULT: ProfilGamification = {
  xpTotal: 0,
  dernierQuizDate: null,
  streakJours: 0,
  badgesDebloques: [],
  xpDuJour: 0,
  quizXpDuJour: [],
  gelsRestants: 3,
  gelsUtilises: 0,
  dateDerniereRechargeGels: null,
  joursJoues: [],
  joursGeles: [],
};
```

- [ ] **Step 2: Mettre à jour le schéma Zod**

Dans `src/lib/gamification.ts`, remplacer `ProfilGamificationSchema` :

```typescript
const ProfilGamificationSchema = z.object({
  xpTotal:                    z.number().int().min(0),
  dernierQuizDate:            z.string().nullable(),
  streakJours:                z.number().int().min(0),
  badgesDebloques:            z.array(BadgeDebloqueSchema),
  xpDuJour:                   z.number().int().min(0),
  quizXpDuJour:               z.array(z.string()),
  gelsRestants:               z.number().int().min(0).max(3).default(3),
  gelsUtilises:               z.number().int().min(0).default(0),
  dateDerniereRechargeGels:   z.string().nullable().default(null),
  joursJoues:                 z.array(z.string()).default([]),
  joursGeles:                 z.array(z.string()).default([]),
});
```

- [ ] **Step 3: Ajouter les nouveaux badges généraux (100 jours)**

Dans `src/lib/gamification.ts`, remplacer `BADGES_GENERAUX` :

```typescript
export const BADGES_GENERAUX: BadgeInfo[] = [
  { id: "premier-pas",      nom: "Premier Pas",        description: "Terminer son 1er quiz",           emoji: "🎯"  },
  { id: "dizaine",          nom: "Décuplé",             description: "Compléter 10 quiz",               emoji: "🔟"  },
  { id: "cinquantaine",     nom: "Cinquantaine",        description: "Compléter 50 quiz",               emoji: "🏅"  },
  { id: "score-parfait",    nom: "Score Parfait",       description: "Obtenir 100% une fois",           emoji: "⭐"  },
  { id: "perfectionniste",  nom: "Perfectionniste",     description: "Obtenir 3 scores parfaits",       emoji: "💎"  },
  { id: "serie-3",          nom: "Série ×3",            description: "Jouer 3 jours de suite",          emoji: "🔥"  },
  { id: "serie-7",          nom: "Série ×7",            description: "Jouer 7 jours de suite",          emoji: "🔥🔥"},
  { id: "assidu",           nom: "Assidu",              description: "Jouer 30 jours de suite",         emoji: "🏆"  },
  { id: "legende",          nom: "Légende",             description: "Jouer 100 jours de suite",        emoji: "👑"  },
  { id: "niveau-5",         nom: "Studieux Confirmé",   description: "Atteindre le niveau Studieux",    emoji: "🌟"  },
];
```

- [ ] **Step 4: Ajouter la fonction helper pour la recharge mensuelle des gels**

Après la fonction `hierISO`, ajouter :

```typescript
function getMoisISO(date: string): string {
  return date.slice(0, 7); // "YYYY-MM"
}

function rechargerGelsSiNouveauMois(
  profil: ProfilGamification,
  aujourd: string,
): Pick<ProfilGamification, "gelsRestants" | "gelsUtilises" | "dateDerniereRechargeGels"> {
  const moisActuel = getMoisISO(aujourd);
  if (profil.dateDerniereRechargeGels === moisActuel) {
    return {
      gelsRestants: profil.gelsRestants,
      gelsUtilises: profil.gelsUtilises,
      dateDerniereRechargeGels: profil.dateDerniereRechargeGels,
    };
  }
  // Nouveau mois → recharger à 3
  return {
    gelsRestants: 3,
    gelsUtilises: 0,
    dateDerniereRechargeGels: moisActuel,
  };
}
```

- [ ] **Step 5: Ajouter la logique de gel automatique dans mettreAJourStreak**

Remplacer la fonction `mettreAJourStreak` par :

```typescript
function mettreAJourStreak(
  profil: ProfilGamification,
  aujourd: string,
): {
  streakJours: number;
  gelsRestants: number;
  gelsUtilises: number;
  joursGeles: string[];
} {
  if (!profil.dernierQuizDate) {
    return {
      streakJours: 1,
      gelsRestants: profil.gelsRestants,
      gelsUtilises: profil.gelsUtilises,
      joursGeles: profil.joursGeles,
    };
  }
  if (profil.dernierQuizDate === aujourd) {
    // Même jour, pas de changement streak
    return {
      streakJours: profil.streakJours,
      gelsRestants: profil.gelsRestants,
      gelsUtilises: profil.gelsUtilises,
      joursGeles: profil.joursGeles,
    };
  }
  if (profil.dernierQuizDate === hierISO(aujourd)) {
    // Lendemain consécutif
    return {
      streakJours: profil.streakJours + 1,
      gelsRestants: profil.gelsRestants,
      gelsUtilises: profil.gelsUtilises,
      joursGeles: profil.joursGeles,
    };
  }

  // Jour manqué — vérifier si on peut utiliser un gel
  if (profil.gelsRestants > 0) {
    // Un gel couvre exactement 1 jour manqué (avant-hier ou plus loin → streak cassé quand même)
    const avantHier = hierISO(hierISO(aujourd));
    if (profil.dernierQuizDate === avantHier) {
      // Exactement 1 jour manqué → gel automatique
      return {
        streakJours: profil.streakJours + 1,
        gelsRestants: profil.gelsRestants - 1,
        gelsUtilises: profil.gelsUtilises + 1,
        joursGeles: [...profil.joursGeles, hierISO(aujourd)],
      };
    }
  }

  // Streak cassé
  return {
    streakJours: 1,
    gelsRestants: profil.gelsRestants,
    gelsUtilises: profil.gelsUtilises,
    joursGeles: profil.joursGeles,
  };
}
```

- [ ] **Step 6: Ajouter la vérification du badge 100 jours + bonus XP 7 jours dans verifierNouveauxBadges et calculerXPBrut**

Dans `calculerXPBrut`, remplacer le bonus streak :

```typescript
function calculerXPBrut(
  scorePourcentage: number,
  modeControle: boolean,
  streakJours: number,
): number {
  const base = 10;
  const bonusScore   = Math.floor(scorePourcentage / 10);       // 0–10
  const bonusParfait = scorePourcentage === 100 ? 15 : 0;
  // Bonus streak progressif : +5 si streak>1, +10 bonus supplémentaire si streak≥7
  const bonusStreak  = streakJours > 1 ? 5 : 0;
  const bonusStreak7 = streakJours >= 7 ? 10 : 0;
  const brut = base + bonusScore + bonusParfait + bonusStreak + bonusStreak7;
  return modeControle ? Math.floor(brut * 1.5) : brut;
}
```

Dans `verifierNouveauxBadges`, ajouter le badge `legende` :

```typescript
check("serie-3",  profilCourant.streakJours >= 3);
check("serie-7",  profilCourant.streakJours >= 7);
check("assidu",   profilCourant.streakJours >= 30);
check("legende",  profilCourant.streakJours >= 100);
```

- [ ] **Step 7: Mettre à jour la fonction enregistrerQuizGamification pour utiliser les nouveaux retours**

Remplacer la section streak dans `enregistrerQuizGamification` :

```typescript
// Recharge mensuelle des gels si nouveau mois
const gelsRecharges = rechargerGelsSiNouveauMois(profil, aujourd);
const profilAvecGels: ProfilGamification = { ...profil, ...gelsRecharges };

// Streak + gel automatique
const streakResult = mettreAJourStreak(profilAvecGels, aujourd);
const streakActif  = streakResult.streakJours > 1;

// Reset quotidien si nouveau jour
const estNouveauJour  = profil.dernierQuizDate !== aujourd;
const quizXpDuJour    = estNouveauJour ? [] : profil.quizXpDuJour;
const xpDuJour        = estNouveauJour ? 0  : profil.xpDuJour;

// Déduplication et plafond
const dejaGagneXP    = quizXpDuJour.includes(cleQuiz);
const plafondAtteint = xpDuJour >= PLAFOND_XP_JOUR;

let xpGagne           = 0;
let quizXpDuJourFinal = quizXpDuJour;
let xpDuJourFinal     = xpDuJour;

if (!dejaGagneXP && !plafondAtteint) {
  const xpCalcule   = calculerXPBrut(scorePourcentage, modeControle, streakResult.streakJours);
  xpGagne           = Math.min(xpCalcule, PLAFOND_XP_JOUR - xpDuJour);
  quizXpDuJourFinal = [...quizXpDuJour, cleQuiz];
  xpDuJourFinal     = xpDuJour + xpGagne;
}

const ancienNiveau   = getNiveauFromXP(profil.xpTotal).numero;
const nouveauXPTotal = profil.xpTotal + xpGagne;
const niveauApres    = getNiveauFromXP(nouveauXPTotal);
const levelUp        = niveauApres.numero > ancienNiveau ? niveauApres.numero : null;

// Profil intermédiaire (streak + gels à jour) pour la vérification des badges
const joursJouesFinal = profil.joursJoues.includes(aujourd)
  ? profil.joursJoues
  : [...profil.joursJoues, aujourd];

const profilInter: ProfilGamification = {
  ...profilAvecGels,
  xpTotal:              nouveauXPTotal,
  dernierQuizDate:      aujourd,
  streakJours:          streakResult.streakJours,
  xpDuJour:             xpDuJourFinal,
  quizXpDuJour:         quizXpDuJourFinal,
  gelsRestants:         streakResult.gelsRestants,
  gelsUtilises:         streakResult.gelsUtilises,
  joursJoues:           joursJouesFinal,
  joursGeles:           streakResult.joursGeles,
};
```

Et remplacer l'appel à `calculerXPBrut` — l'ancien avait `streakActif: boolean`, le nouveau a `streakJours: number`. La signature est déjà corrigée en Step 6.

- [ ] **Step 8: Exporter la constante GEL_PAR_MOIS et une fonction utilitaire pour l'UI**

À la fin de `src/lib/gamification.ts`, ajouter :

```typescript
export const GEL_PAR_MOIS = 3;

export function getInfosGel(profil: ProfilGamification): {
  gelsRestants: number;
  gelsUtilises: number;
  pourcentageUtilise: number;
} {
  return {
    gelsRestants: profil.gelsRestants,
    gelsUtilises: profil.gelsUtilises,
    pourcentageUtilise: Math.round((profil.gelsUtilises / GEL_PAR_MOIS) * 100),
  };
}
```

- [ ] **Step 9: Vérifier TypeScript**

```bash
cd "C:\Users\Benpo\Desktop\Claude-code\projet-Révioria" && npx tsc --noEmit 2>&1 | head -40
```

Expected: 0 erreurs.

- [ ] **Step 10: Commit**

```bash
git add src/lib/gamification.ts
git commit -m "feat(streak): gel auto, recharge mensuelle, badge 100j, bonus XP ×7"
```

---

## Task 3 : Composant StreakDisplay

**Files:**
- Create: `src/components/gamification/StreakDisplay.tsx`

- [ ] **Step 1: Créer le composant**

Créer `src/components/gamification/StreakDisplay.tsx` :

```typescript
"use client";
import type { ProfilGamification } from "@/types";
import { GEL_PAR_MOIS } from "@/lib/gamification";

interface StreakDisplayProps {
  profil: ProfilGamification;
}

export default function StreakDisplay({ profil }: StreakDisplayProps) {
  const { streakJours, gelsRestants } = profil;

  const flammeEmoji = streakJours >= 100 ? "👑" : streakJours >= 30 ? "🏆" : streakJours >= 7 ? "🔥🔥" : "🔥";
  const couleurFlamme =
    streakJours >= 100
      ? "from-yellow-400 to-amber-500"
      : streakJours >= 30
      ? "from-orange-500 to-red-500"
      : streakJours >= 7
      ? "from-orange-400 to-orange-600"
      : "from-orange-300 to-orange-500";

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
      {/* Flamme + compteur */}
      <div
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${couleurFlamme} shrink-0 shadow`}
      >
        <span className="text-2xl leading-none">{flammeEmoji}</span>
        <span className="text-xs font-bold text-white mt-0.5">
          {streakJours}j
        </span>
      </div>

      {/* Infos streak */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">
          {streakJours === 0
            ? "Aucune série en cours"
            : `Série de ${streakJours} jour${streakJours > 1 ? "s" : ""}`}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {streakJours === 0
            ? "Fais un quiz aujourd'hui pour commencer !"
            : streakJours >= 100
            ? "Tu es une légende 👑"
            : streakJours >= 30
            ? "Incroyable régularité !"
            : streakJours >= 7
            ? "Continue comme ça, tu cartonnes !"
            : "Reviens demain pour continuer !"}
        </p>

        {/* Gels restants */}
        <div className="flex items-center gap-1.5 mt-2">
          {Array.from({ length: GEL_PAR_MOIS }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < gelsRestants ? "opacity-100" : "opacity-20"}`}
              title={i < gelsRestants ? "Gel disponible" : "Gel utilisé"}
            >
              ❄️
            </span>
          ))}
          <span className="text-xs text-gray-400 ml-1">
            {gelsRestants} gel{gelsRestants > 1 ? "s" : ""} restant{gelsRestants > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd "C:\Users\Benpo\Desktop\Claude-code\projet-Révioria" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 erreurs.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/StreakDisplay.tsx
git commit -m "feat(streak): composant StreakDisplay avec flamme et gels"
```

---

## Task 4 : Composant CalendrierStreak

**Files:**
- Create: `src/components/gamification/CalendrierStreak.tsx`

- [ ] **Step 1: Créer le composant**

Créer `src/components/gamification/CalendrierStreak.tsx` :

```typescript
"use client";
import type { ProfilGamification } from "@/types";

interface CalendrierStreakProps {
  profil: ProfilGamification;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // 0=dimanche → transformer en lundi=0
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

type EtatJour = "joue" | "gele" | "manque" | "futur" | "aujourd";

export default function CalendrierStreak({ profil }: CalendrierStreakProps) {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth();

  const joursJouesSet = new Set(profil.joursJoues);
  const joursGelesSet = new Set(profil.joursGeles);

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDay     = getFirstDayOfMonth(year, month);
  const todayStr     = today.toISOString().slice(0, 10);

  const JOURS_SEMAINE = ["L", "M", "M", "J", "V", "S", "D"];

  const moisNoms = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
  ];

  const cellules: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function getEtat(day: number): EtatJour {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (dateStr === todayStr) return "aujourd";
    if (dateStr > todayStr)   return "futur";
    if (joursJouesSet.has(dateStr)) return "joue";
    if (joursGelesSet.has(dateStr)) return "gele";
    return "manque";
  }

  const classeParEtat: Record<EtatJour, string> = {
    joue:     "bg-orange-400 text-white font-bold",
    gele:     "bg-blue-200 text-blue-700 font-medium",
    manque:   "bg-gray-100 text-gray-400",
    futur:    "bg-transparent text-gray-300",
    aujourd:  "bg-indigo-600 text-white font-bold ring-2 ring-indigo-300",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        📅 {moisNoms[month]} {year}
      </h3>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {JOURS_SEMAINE.map((j, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400 py-1">
            {j}
          </div>
        ))}
      </div>

      {/* Cases */}
      <div className="grid grid-cols-7 gap-1">
        {cellules.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const etat = getEtat(day);
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-all ${classeParEtat[etat]}`}
              title={
                etat === "joue"   ? "Quiz fait ✅" :
                etat === "gele"   ? "Gel utilisé ❄️" :
                etat === "manque" ? "Jour manqué" :
                etat === "aujourd"? "Aujourd'hui" : ""
              }
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex gap-3 mt-3 flex-wrap">
        <LegendItem color="bg-orange-400" label="Quiz fait" />
        <LegendItem color="bg-blue-200"   label="Gel utilisé" />
        <LegendItem color="bg-gray-100"   label="Manqué" />
        <LegendItem color="bg-indigo-600" label="Aujourd'hui" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded ${color}`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd "C:\Users\Benpo\Desktop\Claude-code\projet-Révioria" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 erreurs.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/CalendrierStreak.tsx
git commit -m "feat(streak): composant CalendrierStreak mensuel"
```

---

## Task 5 : Notifications streak locales

**Files:**
- Create: `src/lib/streak-notifications.ts`

- [ ] **Step 1: Créer le module de notifications streak**

Créer `src/lib/streak-notifications.ts` :

```typescript
import type { ProfilGamification } from "@/types";

const NOTIF_STORAGE_KEY = "streak-notif-derniere-date";

function getDateAujourdhuiISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function hierISO(aujourd: string): string {
  const d = new Date(aujourd + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export type TypeNotifStreak =
  | "streak_rappel"
  | "streak_perdu"
  | "streak_gel_utilise";

export interface NotifStreak {
  type: TypeNotifStreak;
  message: string;
  detail: string;
}

/**
 * Calcule les notifications streak à afficher à l'utilisateur selon l'état
 * actuel de son profil. À appeler au montage de la page progression.
 */
export function getNotificationsStreak(
  profil: ProfilGamification,
): NotifStreak[] {
  if (typeof window === "undefined") return [];

  const aujourd = getDateAujourdhuiISO();
  const hier    = hierISO(aujourd);
  const notifs: NotifStreak[] = [];

  // Gel utilisé automatiquement aujourd'hui (joursGeles contient hier)
  if (profil.joursGeles.includes(hier) && profil.dernierQuizDate === aujourd) {
    notifs.push({
      type:    "streak_gel_utilise",
      message: "❄️ Gel utilisé automatiquement !",
      detail:  `Tu avais manqué hier. Un gel a protégé ta série de ${profil.streakJours} jours. Il te reste ${profil.gelsRestants} gel${profil.gelsRestants > 1 ? "s" : ""}.`,
    });
  }

  // Rappel quotidien — n'a pas encore joué aujourd'hui
  if (profil.dernierQuizDate !== aujourd) {
    if (profil.streakJours > 0 && profil.dernierQuizDate === hier) {
      notifs.push({
        type:    "streak_rappel",
        message: `🔥 Maintiens ta série de ${profil.streakJours} jours !`,
        detail:  "Tu n'as pas encore fait de quiz aujourd'hui. Joue avant minuit pour ne pas perdre ta série.",
      });
    } else if (profil.streakJours > 0 && profil.dernierQuizDate !== hier) {
      // Streak potentiellement perdu (pas joué hier non plus)
      notifs.push({
        type:    "streak_perdu",
        message: "💔 Ta série est en danger !",
        detail:  `Tu n'as pas joué hier ni aujourd'hui. ${profil.gelsRestants > 0 ? `Il te reste ${profil.gelsRestants} gel${profil.gelsRestants > 1 ? "s" : ""} pour la prochaine fois.` : "Tu n'as plus de gels ce mois-ci."}`,
      });
    }
  }

  return notifs;
}

/**
 * Marque les notifications streak comme lues pour aujourd'hui.
 * Évite de réafficher les mêmes notifications à chaque rechargement.
 */
export function marquerNotifsStreakLues(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIF_STORAGE_KEY, getDateAujourdhuiISO());
}

/**
 * Retourne true si les notifications ont déjà été affichées aujourd'hui.
 */
export function notifsStreakDejaMontrees(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(NOTIF_STORAGE_KEY) === getDateAujourdhuiISO();
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd "C:\Users\Benpo\Desktop\Claude-code\projet-Révioria" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 erreurs.

- [ ] **Step 3: Commit**

```bash
git add src/lib/streak-notifications.ts
git commit -m "feat(streak): module notifications streak (rappel, gel, perte)"
```

---

## Task 6 : Intégration dans la page progression

**Files:**
- Modify: `src/app/progression/page.tsx`

- [ ] **Step 1: Ajouter les imports**

Dans `src/app/progression/page.tsx`, ajouter après les imports existants :

```typescript
import StreakDisplay from "@/components/gamification/StreakDisplay";
import CalendrierStreak from "@/components/gamification/CalendrierStreak";
import {
  getNotificationsStreak,
  marquerNotifsStreakLues,
  notifsStreakDejaMontrees,
  type NotifStreak,
} from "@/lib/streak-notifications";
```

- [ ] **Step 2: Ajouter l'état pour les notifications streak**

Dans le composant `ProgressionPage`, après la déclaration des states existants, ajouter :

```typescript
const [notifsStreak, setNotifsStreak] = useState<NotifStreak[]>([]);
```

- [ ] **Step 3: Calculer les notifs dans le useEffect existant**

Dans le premier `useEffect`, après `setProfilGami(getProfilGamification())`, ajouter :

```typescript
const profil = getProfilGamification();
setProfilGami(profil);
if (!notifsStreakDejaMontrees()) {
  const notifs = getNotificationsStreak(profil);
  setNotifsStreak(notifs);
  if (notifs.length > 0) marquerNotifsStreakLues();
}
```

(Supprimer l'ancien `setProfilGami(getProfilGamification())` remplacé par les lignes ci-dessus.)

- [ ] **Step 4: Remplacer le bloc streak existant par StreakDisplay + CalendrierStreak + notifications**

Dans la page, remplacer le bloc streak actuel (lignes ~181-186 dans la page actuelle, dans le rendu conditionnel `profilGami && profilGami.xpTotal > 0`) :

Supprimer :
```tsx
{/* Streak */}
{profilGami.streakJours > 0 && (
  <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
    <span>🔥</span>
    <span>Série de {profilGami.streakJours} jour{profilGami.streakJours > 1 ? "s" : ""} consécutif{profilGami.streakJours > 1 ? "s" : ""}</span>
  </div>
)}
```

Remplacer par :
```tsx
{/* Notifications streak */}
{notifsStreak.map((notif, i) => (
  <div
    key={i}
    className={`flex gap-3 p-3 rounded-xl text-sm border ${
      notif.type === "streak_rappel"
        ? "bg-orange-50 border-orange-200 text-orange-800"
        : notif.type === "streak_gel_utilise"
        ? "bg-blue-50 border-blue-200 text-blue-800"
        : "bg-red-50 border-red-200 text-red-800"
    }`}
  >
    <div>
      <p className="font-semibold">{notif.message}</p>
      <p className="text-xs mt-0.5 opacity-80">{notif.detail}</p>
    </div>
  </div>
))}

{/* StreakDisplay */}
<StreakDisplay profil={profilGami} />
```

- [ ] **Step 5: Ajouter CalendrierStreak après le bloc badges**

Après la fermeture du bloc badges (`</div>` final du block BadgeGrid), ajouter avant la fermeture de la card principale :

```tsx
{/* Calendrier streak */}
<CalendrierStreak profil={profilGami} />
```

- [ ] **Step 6: Vérifier TypeScript + Build**

```bash
cd "C:\Users\Benpo\Desktop\Claude-code\projet-Révioria" && npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 erreurs.

- [ ] **Step 7: Commit final**

```bash
git add src/app/progression/page.tsx
git commit -m "feat(streak): intégration StreakDisplay, CalendrierStreak et notifs dans progression"
```

---

## Récapitulatif des commits

1. `feat(streak): étendre ProfilGamification avec champs gel et nouveaux types notif`
2. `feat(streak): gel auto, recharge mensuelle, badge 100j, bonus XP ×7`
3. `feat(streak): composant StreakDisplay avec flamme et gels`
4. `feat(streak): composant CalendrierStreak mensuel`
5. `feat(streak): module notifications streak (rappel, gel, perte)`
6. `feat(streak): intégration StreakDisplay, CalendrierStreak et notifs dans progression`
