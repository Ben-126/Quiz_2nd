# Engagement Utilisateur Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une page Paramètres, un système d'objectif quotidien avec bannière in-app, et des notifications navigateur via Service Worker.

**Architecture:** Tout est 100% côté client. Les paramètres sont stockés dans localStorage (`quiz-parametres`). L'objectif du jour est calculé à partir de l'historique existant (`quiz-history`). Un Service Worker envoie une notification à 18h00 si l'objectif n'est pas atteint.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Web Notifications API, Service Worker API

---

## Structure des fichiers

| Fichier | Action | Responsabilité |
|---|---|---|
| `src/lib/parametres.ts` | Créer | Types + lecture/écriture localStorage paramètres |
| `src/lib/objectif.ts` | Créer | Calcul de la progression de l'objectif du jour |
| `src/components/engagement/BanniereObjectif.tsx` | Créer | Bannière d'objectif sur la page d'accueil |
| `src/app/parametres/page.tsx` | Créer | Page Paramètres complète |
| `public/sw.js` | Créer | Service Worker — notification à 18h00 |
| `src/components/navigation/Header.tsx` | Modifier | Ajouter lien ⚙️ vers /parametres |
| `src/app/page.tsx` | Modifier | Ajouter `<BanniereObjectif />` |
| `src/app/layout.tsx` | Modifier | Enregistrer le Service Worker |
| `src/app/progression/page.tsx` | Modifier | Supprimer le bouton de réinitialisation |
| `src/components/quiz/QuizRunner.tsx` | Modifier | Lire `questionsParQuiz` depuis les paramètres |
| `src/app/api/quiz/generate/route.ts` | Modifier | Accepter `questionsParQuiz` en paramètre |

---

## Task 1: Lib paramètres

**Files:**
- Create: `src/lib/parametres.ts`

- [ ] **Step 1: Créer le fichier avec les types et les fonctions**

```typescript
// src/lib/parametres.ts

const PARAMETRES_KEY = "quiz-parametres";

export type ObjectifType = "minimum" | "personnalise";
export type NiveauDefaut = "seconde" | "premiere" | "terminale";
export type QuestionsParQuiz = 3 | 5 | 10;

export interface Parametres {
  objectifType: ObjectifType;
  objectifNombre: number;        // 1 à 10
  seuilReussite: number;         // 50 à 100, par pas de 5
  niveauDefaut: NiveauDefaut;
  explicationsAvanceesOuvertes: boolean;
  questionsParQuiz: QuestionsParQuiz;
  notificationsActivees: boolean;
}

export const PARAMETRES_DEFAUT: Parametres = {
  objectifType: "minimum",
  objectifNombre: 1,
  seuilReussite: 85,
  niveauDefaut: "seconde",
  explicationsAvanceesOuvertes: false,
  questionsParQuiz: 5,
  notificationsActivees: false,
};

export function getParametres(): Parametres {
  if (typeof window === "undefined") return PARAMETRES_DEFAUT;
  try {
    const raw = localStorage.getItem(PARAMETRES_KEY);
    if (!raw) return PARAMETRES_DEFAUT;
    return { ...PARAMETRES_DEFAUT, ...(JSON.parse(raw) as Partial<Parametres>) };
  } catch {
    return PARAMETRES_DEFAUT;
  }
}

export function saveParametres(parametres: Parametres): void {
  try {
    localStorage.setItem(PARAMETRES_KEY, JSON.stringify(parametres));
  } catch {}
}
```

- [ ] **Step 2: Vérifier manuellement**

Ouvrir la console navigateur sur `http://localhost:3000` et exécuter :
```javascript
localStorage.setItem("quiz-parametres", JSON.stringify({ questionsParQuiz: 10 }));
```
Recharger la page. La valeur doit être préservée.

- [ ] **Step 3: Commit**

```bash
git add src/lib/parametres.ts
git commit -m "feat: lib paramètres — types et lecture/écriture localStorage"
```

---

## Task 2: Lib objectif du jour

**Files:**
- Create: `src/lib/objectif.ts`

- [ ] **Step 1: Créer le fichier**

```typescript
// src/lib/objectif.ts
import { getHistorique } from "./history";
import { getParametres } from "./parametres";

export interface ProgressionObjectif {
  actuel: number;   // quiz réussis aujourd'hui avec score >= seuil
  cible: number;    // nombre de quiz cible
  atteint: boolean;
  restant: number;  // quiz restants pour atteindre l'objectif
}

export function getProgressionObjectif(): ProgressionObjectif {
  const params = getParametres();
  const cible = params.objectifType === "minimum" ? 1 : params.objectifNombre;
  const seuil = params.seuilReussite;

  const aujourdHui = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const historique = getHistorique();

  const actuel = historique.filter((e) => {
    return e.date.slice(0, 10) === aujourdHui && e.score >= seuil;
  }).length;

  return {
    actuel,
    cible,
    atteint: actuel >= cible,
    restant: Math.max(0, cible - actuel),
  };
}
```

- [ ] **Step 2: Vérifier manuellement**

Dans la console navigateur :
```javascript
// Ajouter une entrée d'aujourd'hui avec score 90 dans l'historique
const today = new Date().toISOString();
const h = JSON.parse(localStorage.getItem("quiz-history") || "[]");
h.unshift({ date: today, niveau: "seconde", matiereSlug: "maths", matiereName: "Maths", chapitreSlug: "ch1", chapitreNom: "Ch1", score: 90 });
localStorage.setItem("quiz-history", JSON.stringify(h));
```
Après avoir importé `getProgressionObjectif` (via la console ou une route de debug), vérifier que `actuel` vaut 1 et `atteint` vaut `true` si seuil par défaut est 85.

- [ ] **Step 3: Commit**

```bash
git add src/lib/objectif.ts
git commit -m "feat: lib objectif — calcul progression quotidienne depuis historique"
```

---

## Task 3: Composant BanniereObjectif

**Files:**
- Create: `src/components/engagement/BanniereObjectif.tsx`

- [ ] **Step 1: Créer le répertoire et le composant**

```tsx
// src/components/engagement/BanniereObjectif.tsx
"use client";
import { useState, useEffect } from "react";
import { getProgressionObjectif, type ProgressionObjectif } from "@/lib/objectif";

export default function BanniereObjectif() {
  const [progression, setProgression] = useState<ProgressionObjectif | null>(null);

  useEffect(() => {
    setProgression(getProgressionObjectif());
  }, []);

  if (!progression) return null;

  const { actuel, cible, atteint, restant } = progression;
  const pourcentage = Math.min(100, Math.round((actuel / cible) * 100));

  const banniereClasses = atteint
    ? "bg-green-50 border-green-200"
    : pourcentage >= 50
    ? "bg-orange-50 border-orange-200"
    : "bg-red-50 border-red-200";

  const barreClasse = atteint
    ? "bg-green-500"
    : pourcentage >= 50
    ? "bg-orange-400"
    : "bg-red-400";

  const message = atteint
    ? "Objectif du jour atteint ! Bravo 🎉"
    : actuel === 0
    ? `Lance ton premier quiz du jour ! (objectif : ${cible} quiz réussi${cible > 1 ? "s" : ""})`
    : `Encore ${restant} quiz pour atteindre ton objectif !`;

  return (
    <div className={`rounded-xl border p-3 mb-4 ${banniereClasses}`} data-testid="banniere-objectif">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600">🎯 Objectif du jour</span>
        <span className="text-xs font-bold text-gray-700">
          {actuel} / {cible} quiz réussi{cible > 1 ? "s" : ""}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barreClasse}`}
          style={{ width: `${pourcentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1.5">{message}</p>
    </div>
  );
}
```

- [ ] **Step 2: Tester visuellement**

Démarrer le serveur (`npm run dev`), aller sur `http://localhost:3000`. La bannière ne s'affiche pas encore (pas encore intégrée dans page.tsx — ce sera Task 6). Vérifier qu'il n'y a pas d'erreur TypeScript dans la console.

- [ ] **Step 3: Commit**

```bash
git add src/components/engagement/BanniereObjectif.tsx
git commit -m "feat: composant BanniereObjectif — progression quotidienne avec barre colorée"
```

---

## Task 4: Page Paramètres

**Files:**
- Create: `src/app/parametres/page.tsx`

- [ ] **Step 1: Créer la page**

```tsx
// src/app/parametres/page.tsx
"use client";
import { useState, useEffect } from "react";
import Header from "@/components/navigation/Header";
import {
  getParametres,
  saveParametres,
  PARAMETRES_DEFAUT,
  type Parametres,
  type QuestionsParQuiz,
} from "@/lib/parametres";

export default function ParametresPage() {
  const [params, setParams] = useState<Parametres>(PARAMETRES_DEFAUT);
  const [mounted, setMounted] = useState(false);
  const [notifStatut, setNotifStatut] = useState<"defaut" | "accordee" | "refusee" | "non-supporte">("defaut");
  const [confirmEtape, setConfirmEtape] = useState<0 | 1 | 2>(0);
  const [sauvegarde, setSauvegarde] = useState(false);

  useEffect(() => {
    setParams(getParametres());
    setMounted(true);
    if (!("Notification" in window)) {
      setNotifStatut("non-supporte");
    } else if (Notification.permission === "granted") {
      setNotifStatut("accordee");
    } else if (Notification.permission === "denied") {
      setNotifStatut("refusee");
    }
  }, []);

  const handleChange = <K extends keyof Parametres>(key: K, value: Parametres[K]) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    saveParametres(updated);
    setSauvegarde(true);
    setTimeout(() => setSauvegarde(false), 1500);
  };

  const demanderPermissionNotifs = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setNotifStatut("accordee");
      handleChange("notificationsActivees", true);
      // Informer le Service Worker
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({ type: "NOTIFS_ACTIVEES" });
      }
    } else {
      setNotifStatut("refusee");
      handleChange("notificationsActivees", false);
    }
  };

  const reinitialiserProgression = () => {
    localStorage.removeItem("quiz-performances");
    localStorage.removeItem("quiz-history");
    setConfirmEtape(0);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header titre="Paramètres" showBack backHref="/" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header titre="Paramètres" showBack backHref="/" />
      <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">

        {sauvegarde && (
          <div className="fixed top-16 right-4 z-50 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
            ✓ Enregistré
          </div>
        )}

        {/* Objectif quotidien */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">🎯 Objectif quotidien</h2>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="objectifType"
                checked={params.objectifType === "minimum"}
                onChange={() => handleChange("objectifType", "minimum")}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700">1 quiz minimum par jour</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="objectifType"
                checked={params.objectifType === "personnalise"}
                onChange={() => handleChange("objectifType", "personnalise")}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700">Nombre personnalisé</span>
            </label>
          </div>

          {params.objectifType === "personnalise" && (
            <div className="flex items-center gap-3 pl-6">
              <span className="text-sm text-gray-600">Nombre de quiz :</span>
              <input
                type="number"
                min={1}
                max={10}
                value={params.objectifNombre}
                onChange={(e) => handleChange("objectifNombre", Math.min(10, Math.max(1, Number(e.target.value))))}
                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="text-sm text-gray-500">/ jour</span>
            </div>
          )}

          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            Seuls les quiz réussis à {params.seuilReussite}% ou plus comptent pour l&apos;objectif.
          </p>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">🔔 Notifications</h2>
          <p className="text-sm text-gray-500">
            Un rappel te sera envoyé à <strong>18h00</strong> si ton objectif du jour n&apos;est pas encore atteint.
          </p>

          {notifStatut === "non-supporte" && (
            <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
              Les notifications ne sont pas supportées par ce navigateur.
            </p>
          )}

          {notifStatut === "refusee" && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              Notifications bloquées. Autorise-les dans les paramètres de ton navigateur.
            </p>
          )}

          {notifStatut === "accordee" && (
            <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 font-semibold">
              ✓ Notifications activées
            </p>
          )}

          {notifStatut === "defaut" && (
            <button
              onClick={demanderPermissionNotifs}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Activer les notifications
            </button>
          )}
        </section>

        {/* Autres paramètres */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
          <h2 className="font-bold text-gray-800">⚙️ Préférences</h2>

          {/* Seuil de réussite */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Seuil de réussite minimum
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={100}
                step={5}
                value={params.seuilReussite}
                onChange={(e) => handleChange("seuilReussite", Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-sm font-bold text-indigo-700 w-10 text-right">
                {params.seuilReussite}%
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Un quiz est considéré réussi si ton score atteint ce seuil.
            </p>
          </div>

          {/* Nombre de questions par quiz */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nombre de questions par quiz
            </label>
            <div className="flex gap-2">
              {([3, 5, 10] as QuestionsParQuiz[]).map((n) => (
                <button
                  key={n}
                  onClick={() => handleChange("questionsParQuiz", n)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                    params.questionsParQuiz === n
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 border-indigo-300 hover:border-indigo-500"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Niveau par défaut */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Niveau par défaut</label>
            <div className="flex gap-2 flex-wrap">
              {(["seconde", "premiere", "terminale"] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => handleChange("niveauDefaut", n)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors capitalize ${
                    params.niveauDefaut === n
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 border-indigo-300 hover:border-indigo-500"
                  }`}
                >
                  {n === "premiere" ? "Première" : n.charAt(0).toUpperCase() + n.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Explications avancées ouvertes par défaut */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Explications avancées ouvertes</p>
              <p className="text-xs text-gray-400">Afficher les détails dépliés après correction</p>
            </div>
            <button
              role="switch"
              aria-checked={params.explicationsAvanceesOuvertes}
              onClick={() => handleChange("explicationsAvanceesOuvertes", !params.explicationsAvanceesOuvertes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                params.explicationsAvanceesOuvertes ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  params.explicationsAvanceesOuvertes ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-red-600">⚠️ Zone de danger</h2>
          <p className="text-sm text-gray-500">
            La réinitialisation supprime définitivement tous tes scores, ta progression et ton historique de quiz.
          </p>
          <button
            onClick={() => setConfirmEtape(1)}
            className="text-sm text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
          >
            Réinitialiser toute la progression
          </button>
        </section>

      </main>

      {/* Modal confirmation étape 1 */}
      {confirmEtape === 1 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <p className="text-2xl text-center">⚠️</p>
            <h2 className="text-base font-bold text-gray-800 text-center">
              Réinitialiser la progression ?
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Tous tes scores, badges et l&apos;historique des quiz seront supprimés définitivement.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmEtape(0)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setConfirmEtape(2)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors"
              >
                Oui, continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation étape 2 */}
      {confirmEtape === 2 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <p className="text-2xl text-center">🗑️</p>
            <h2 className="text-base font-bold text-red-600 text-center">
              Êtes-vous vraiment sûr ?
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Cette action est <span className="font-semibold text-gray-700">irréversible</span>.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmEtape(0)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={reinitialiserProgression}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white transition-colors"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Vérifier visuellement**

Aller sur `http://localhost:3000/parametres`. Vérifier :
- Tous les réglages s'affichent correctement
- Modifier le seuil de réussite → le badge "Enregistré" apparaît brièvement
- Le toggle "Explications avancées" fonctionne
- Les boutons de niveau et de nombre de questions togglent bien

- [ ] **Step 3: Commit**

```bash
git add src/app/parametres/page.tsx
git commit -m "feat: page /parametres — objectif, notifications, préférences et réinitialisation"
```

---

## Task 5: Header — icône Paramètres

**Files:**
- Modify: `src/components/navigation/Header.tsx`

- [ ] **Step 1: Ajouter le lien vers /parametres dans le `<div className="ml-auto">`**

Remplacer le contenu du `<div className="ml-auto">` existant (ligne 45-53) par :

```tsx
<div className="ml-auto flex items-center gap-1">
  <Link
    href="/progression"
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
  >
    <span>📊</span>
    <span className="hidden sm:inline">Progression</span>
  </Link>
  <Link
    href="/parametres"
    aria-label="Paramètres"
    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  </Link>
</div>
```

- [ ] **Step 2: Vérifier visuellement**

Aller sur `http://localhost:3000`. L'icône ⚙️ (engrenage SVG) doit apparaître à droite du lien Progression. Cliquer dessus → redirige vers `/parametres`.

- [ ] **Step 3: Commit**

```bash
git add src/components/navigation/Header.tsx
git commit -m "feat: header — ajout lien paramètres avec icône engrenage"
```

---

## Task 6: Page d'accueil — bannière objectif

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Ajouter les imports et lire le niveauDefaut**

En haut du fichier, ajouter les imports :
```tsx
import BanniereObjectif from "@/components/engagement/BanniereObjectif";
import { getParametres } from "@/lib/parametres";
import type { Niveau } from "@/data/programmes";
```

Modifier l'initialisation du state `niveauActif` pour utiliser le niveau par défaut configuré :
```tsx
// Avant :
const [niveauActif, setNiveauActif] = useState<Niveau>("seconde");

// Après :
const [niveauActif, setNiveauActif] = useState<Niveau>(
  () => (typeof window !== "undefined" ? getParametres().niveauDefaut : "seconde")
);
```

Dans le JSX, insérer `<BanniereObjectif />` juste avant le bloc `<div className="text-center mb-6">` :

```tsx
<main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
  <BanniereObjectif />
  <div className="text-center mb-6">
    {/* ... reste du contenu existant ... */}
  </div>
```

- [ ] **Step 2: Vérifier visuellement**

Aller sur `http://localhost:3000`. La bannière s'affiche en haut avec la progression du jour. Si aucun quiz n'a été fait aujourd'hui, le message doit dire "Lance ton premier quiz du jour ! (objectif : 1 quiz réussi)".

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: page accueil — bannière objectif quotidien"
```

---

## Task 7: Supprimer le bouton réinitialisation de la page Progression

**Files:**
- Modify: `src/app/progression/page.tsx`

- [ ] **Step 1: Supprimer l'état et les fonctions liées**

Dans `progression/page.tsx`, supprimer :
- La ligne `const [confirmEtape, setConfirmEtape] = useState<0 | 1 | 2>(0);`
- La fonction `reinitialiserProgression` (lignes 38-44)

- [ ] **Step 2: Supprimer le bouton et les modals dans le JSX**

Supprimer le bloc :
```tsx
<div className="flex justify-center pt-2 pb-4">
  <button
    onClick={() => setConfirmEtape(1)}
    className="text-xs text-red-400 hover:text-red-600 transition-colors underline underline-offset-2"
  >
    Réinitialiser toute la progression
  </button>
</div>
```

Et les deux modals de confirmation (commentaire `{/* Modal de confirmation — étape 1 */}` et `{/* Modal de confirmation — étape 2 */}` avec tout leur contenu).

- [ ] **Step 3: Ajouter un lien vers la page Paramètres à la place**

À la place du bouton supprimé, ajouter un lien discret :
```tsx
<div className="flex justify-center pt-2 pb-4">
  <Link
    href="/parametres"
    className="text-xs text-gray-400 hover:text-indigo-500 transition-colors underline underline-offset-2"
  >
    ⚙️ Paramètres et réinitialisation
  </Link>
</div>
```

Ne pas oublier d'importer `Link` si ce n'est pas déjà fait : `import Link from "next/link";`

- [ ] **Step 4: Vérifier qu'il n'y a pas d'erreur TypeScript**

```bash
npx tsc --noEmit
```

Expected : aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add src/app/progression/page.tsx
git commit -m "refactor: déplacer bouton réinitialisation vers page paramètres"
```

---

## Task 8: questionsParQuiz dynamique

**Files:**
- Modify: `src/app/api/quiz/generate/route.ts`
- Modify: `src/components/quiz/QuizRunner.tsx`

- [ ] **Step 1: Mettre à jour le schéma de validation de l'API**

Dans `route.ts`, modifier `RequestSchema` pour accepter `questionsParQuiz` :

```typescript
const RequestSchema = z.object({
  matiereSlug: z.string().min(1).max(100),
  chapitreSlug: z.string().min(1).max(100),
  niveauLycee: z.enum(["seconde", "premiere", "terminale"]).optional().default("seconde"),
  niveau: z.enum(["debutant", "intermediaire", "avance"]).optional(),
  questionsRatees: z.array(z.string().max(500)).max(10).optional(),
  questionsParQuiz: z.union([z.literal(3), z.literal(5), z.literal(10)]).optional().default(5),
});
```

- [ ] **Step 2: Utiliser `questionsParQuiz` dans le prompt**

Dans `route.ts`, extraire `questionsParQuiz` du `parsed.data` et remplacer `QUESTIONS_PAR_QUIZ` dans le prompt :

```typescript
const { matiereSlug, chapitreSlug, niveauLycee, niveau, questionsRatees, questionsParQuiz } = parsed.data;
```

Dans le prompt, remplacer :
```
Génère exactement ${QUESTIONS_PAR_QUIZ} questions de quiz
```
par :
```
Génère exactement ${questionsParQuiz} questions de quiz
```

Supprimer l'import de `QUESTIONS_PAR_QUIZ` dans la ligne d'import des constantes si `QUESTIONS_PAR_QUIZ` n'est plus utilisé ailleurs dans ce fichier :
```typescript
import { MAX_TOKENS_GENERATION } from "@/lib/constants";
```

- [ ] **Step 3: Passer questionsParQuiz depuis QuizRunner**

Dans `QuizRunner.tsx`, ajouter l'import :
```typescript
import { getParametres } from "@/lib/parametres";
```

Dans la fonction `chargerQuiz`, juste après `const performance = getPerformance(...)`, ajouter :
```typescript
const { questionsParQuiz } = getParametres();
```

Dans le `body` de la requête, ajouter `questionsParQuiz` :
```typescript
const body: Record<string, unknown> = {
  matiereSlug,
  chapitreSlug,
  niveau: niveauActuel,
  niveauLycee,
  questionsParQuiz,
};
```

- [ ] **Step 4: Vérifier**

```bash
npx tsc --noEmit
```

Expected : aucune erreur. Tester dans le navigateur en changeant le nombre de questions dans les paramètres puis en lançant un quiz → le quiz doit avoir le bon nombre de questions.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/quiz/generate/route.ts src/components/quiz/QuizRunner.tsx
git commit -m "feat: nombre de questions par quiz configurable depuis les paramètres"
```

---

## Task 9: Service Worker — notification à 18h00

**Files:**
- Create: `public/sw.js`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Créer le Service Worker**

```javascript
// public/sw.js

let etatObjectif = null; // { atteint: boolean, restant: number }

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
  planifierVerification();
});

self.addEventListener("message", (e) => {
  if (e.data?.type === "MISE_A_JOUR_OBJECTIF") {
    etatObjectif = e.data.payload; // { atteint: boolean, restant: number }
  }
  if (e.data?.type === "NOTIFS_ACTIVEES") {
    planifierVerification();
  }
});

function planifierVerification() {
  const maintenant = new Date();
  const prochaine18h = new Date();
  prochaine18h.setHours(18, 0, 0, 0);

  if (maintenant >= prochaine18h) {
    prochaine18h.setDate(prochaine18h.getDate() + 1);
  }

  const delaiMs = prochaine18h.getTime() - maintenant.getTime();

  setTimeout(async () => {
    await verifierEtNotifier();
    planifierVerification(); // Replanifier pour le lendemain
  }, delaiMs);
}

async function verifierEtNotifier() {
  if (!etatObjectif || etatObjectif.atteint) return;

  const texte = etatObjectif.restant === 1
    ? "Il te reste 1 quiz à faire pour atteindre ton objectif !"
    : `Il te reste ${etatObjectif.restant} quiz à faire pour atteindre ton objectif !`;

  self.registration.showNotification("QuizLycée — Rappel de révision 📚", {
    body: texte,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "rappel-quotidien",
    renotify: false,
  });
}
```

- [ ] **Step 2: Enregistrer le SW et envoyer l'état dans layout.tsx**

Dans `src/app/layout.tsx`, ajouter un composant client pour enregistrer le SW :

Créer `src/components/engagement/ServiceWorkerRegistrar.tsx` :

```tsx
// src/components/engagement/ServiceWorkerRegistrar.tsx
"use client";
import { useEffect } from "react";
import { getParametres } from "@/lib/parametres";
import { getProgressionObjectif } from "@/lib/objectif";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const params = getParametres();
    if (!params.notificationsActivees) return;
    if (Notification.permission !== "granted") return;

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      const envoyerEtat = () => {
        const prog = getProgressionObjectif();
        reg.active?.postMessage({
          type: "MISE_A_JOUR_OBJECTIF",
          payload: { atteint: prog.atteint, restant: prog.restant },
        });
      };

      if (reg.active) {
        envoyerEtat();
      } else {
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "activated") envoyerEtat();
          });
        });
      }
    });
  }, []);

  return null;
}
```

Dans `src/app/layout.tsx`, importer et ajouter le composant :

```tsx
import ServiceWorkerRegistrar from "@/components/engagement/ServiceWorkerRegistrar";

// Dans le body :
<body className="min-h-screen bg-gray-50 flex flex-col">
  <ServiceWorkerRegistrar />
  {children}
</body>
```

- [ ] **Step 3: Vérifier**

```bash
npx tsc --noEmit
```

Tester dans le navigateur :
1. Aller dans `/parametres` → activer les notifications → accorder la permission
2. Ouvrir les DevTools → Application → Service Workers → vérifier que `sw.js` est enregistré et actif

- [ ] **Step 4: Commit**

```bash
git add public/sw.js src/components/engagement/ServiceWorkerRegistrar.tsx src/app/layout.tsx
git commit -m "feat: service worker — notification quotidienne à 18h00 si objectif non atteint"
```

---

## Task 10: Utiliser le paramètre `explicationsAvanceesOuvertes`

**Files:**
- Modify: `src/components/quiz/CorrectionDisplay.tsx`

- [ ] **Step 1: Lire le paramètre et le passer au composant ExplicationAvancee**

Dans `CorrectionDisplay.tsx`, ajouter l'import et utiliser le paramètre :

```tsx
import { getParametres } from "@/lib/parametres";
```

Dans la fonction `CorrectionDisplay`, avant le return :
```tsx
const { explicationsAvanceesOuvertes } = getParametres();
```

Modifier le composant `ExplicationAvancee` pour utiliser ce paramètre à la place de `!correcte` :

```tsx
<ExplicationAvancee
  explicationAvancee={question.explicationAvancee}
  defaultExpanded={!correcte || explicationsAvanceesOuvertes}
/>
```

- [ ] **Step 2: Vérifier**

```bash
npx tsc --noEmit
```

Tester : activer "Explications avancées ouvertes" dans Paramètres → faire un quiz → vérifier que les explications sont dépliées même après une bonne réponse.

- [ ] **Step 3: Commit**

```bash
git add src/components/quiz/CorrectionDisplay.tsx
git commit -m "feat: explications avancées ouvertes par défaut selon les paramètres"
```

---

## Task 11: Push GitHub

- [ ] **Step 1: Vérifier l'état final**

```bash
npx tsc --noEmit
npm run build
```

Expected : build réussi sans erreur.

- [ ] **Step 2: Push**

```bash
git push
```

---

## Récapitulatif des commits attendus

1. `feat: lib paramètres — types et lecture/écriture localStorage`
2. `feat: lib objectif — calcul progression quotidienne depuis historique`
3. `feat: composant BanniereObjectif — progression quotidienne avec barre colorée`
4. `feat: page /parametres — objectif, notifications, préférences et réinitialisation`
5. `feat: header — ajout lien paramètres avec icône engrenage`
6. `feat: page accueil — bannière objectif quotidien`
7. `refactor: déplacer bouton réinitialisation vers page paramètres`
8. `feat: nombre de questions par quiz configurable depuis les paramètres`
9. `feat: service worker — notification quotidienne à 18h00 si objectif non atteint`
10. `feat: explications avancées ouvertes par défaut selon les paramètres`
