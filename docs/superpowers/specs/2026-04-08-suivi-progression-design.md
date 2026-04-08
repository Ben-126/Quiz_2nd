# Suivi de Progression — Design Spec
**Date :** 2026-04-08
**Statut :** Approuvé

---

## Objectif

Implémenter le suivi de progression V1 défini dans `instructions.md` (lignes 75–81) :
- Statistiques par matière
- Graphique par matière
- Historique des quiz
- Indicateur de maîtrise des chapitres

---

## Données (localStorage)

### Clé existante — `quiz-performances` (inchangée)
Structure actuelle conservée sans migration :
```
{ "[matiereSlug]/[chapitreSlug]": PerformanceChapitre }
```

### Nouvelle clé — `quiz-history`
Liste chronologique des quiz complétés, max 100 entrées (les plus récentes) :

```ts
interface EntreeHistorique {
  date: string;        // ISO 8601, ex: "2026-04-08T14:32:00"
  niveau: string;      // "seconde" | "premiere" | "terminale"
  matiereSlug: string;
  matiereName: string;
  chapitreSlug: string;
  chapitreNom: string;
  score: number;       // pourcentage 0–100
}
```

L'historique commence à partir du premier quiz complété après la mise en production. Aucune migration des données existantes.

---

## Architecture

### Nouveaux fichiers

```
src/
  lib/
    history.ts                    ← lecture/écriture quiz-history
  components/
    progression/
      IndicateurMaitrise.tsx      ← badge couleur + barre de progression
      GraphiqueEvolution.tsx      ← courbe des 5 derniers scores (Recharts LineChart)
      GraphiqueChapitres.tsx      ← barres par chapitre (Recharts BarChart)
      HistoriqueQuiz.tsx          ← liste des derniers quiz groupée par date
      StatsMatiere.tsx            ← résumé : nb quiz complétés, score moyen
  app/
    progression/
      page.tsx                    ← page /progression (client component)
```

### Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `src/lib/performance.ts` | `sauvegarderPerformance()` appelle aussi `ajouterHistorique()` |
| `src/components/navigation/ChapitreCard.tsx` | Affiche `IndicateurMaitrise` si données dispo |
| `src/components/navigation/Header.tsx` | Ajout lien "Progression 📊" |

---

## Composants détaillés

### `IndicateurMaitrise`
Props : `{ scoreMoyen: number | null, nombreQuiz: number }`

Rendu :
- Si `nombreQuiz === 0` : badge ⚪ "Pas encore fait", pas de barre
- Si `scoreMoyen < 40` : badge 🔴 rouge + barre rouge
- Si `scoreMoyen < 80` : badge 🟡 orange + barre orange
- Si `scoreMoyen >= 80` : badge 🟢 vert + barre verte

### `GraphiqueEvolution`
Props : `{ scores: { score: number, date: string }[] }`

Recharts `LineChart` responsive, affiche les 5 derniers scores du chapitre sélectionné.
Axe Y : 0–100, axe X : dates courtes.

### `GraphiqueChapitres`
Props : `{ chapitres: { nom: string, scoreMoyen: number | null }[] }`

Recharts `BarChart` horizontal, une barre par chapitre.
Chapitres non faits affichés en gris.

### `HistoriqueQuiz`
Props : `{ entrees: EntreeHistorique[], filtreMatiere?: string }`

Liste groupée par date (Aujourd'hui / Hier / dd/mm/yyyy).
Chaque entrée : emoji matière + nom matière · nom chapitre + score + badge maîtrise.

### `StatsMatiere`
Props : `{ matiereSlug: string, chapitres: Chapitre[] }`

Calcule depuis `quiz-performances` :
- Nombre total de quiz complétés dans la matière
- Score moyen global de la matière
- Nombre de chapitres maîtrisés (≥ 80%)

---

## Page `/progression`

Structure :
1. **Filtre niveau** — tabs Seconde / Première / Terminale
2. **Résumé global** — total quiz complétés + score moyen toutes matières
3. **Section par matière** — sélecteur matière + `StatsMatiere` + `GraphiqueChapitres` + `GraphiqueEvolution` (chapitre sélectionné)
4. **Historique récent** — `HistoriqueQuiz` sans filtre, 20 dernières entrées

---

## Intégration dans la page matière (`/[niveau]/[matiere]`)

- `StatsMatiere` affiché en haut de la liste des chapitres
- Chaque `ChapitreCard` enrichie avec `IndicateurMaitrise` en bas

---

## Dépendance

- **Recharts** (`recharts`) — graphiques LineChart et BarChart
- Installation : `npm install recharts`

---

## Contraintes

- Tout en localStorage (client-side), pas d'appel API
- Composants graphiques marqués `"use client"`
- Si localStorage vide (premier usage), la page `/progression` affiche un état vide encourageant
- Pas de modification du schéma `quiz-performances` existant
