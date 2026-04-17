# Design — Fonctionnalités Sociales de Révioria

**Date :** 2026-04-17
**Statut :** Approuvé

---

## Contexte

Révioria est une app de révision lycée (Seconde / Première / Terminale) avec quiz IA, gamification (XP, niveaux, badges, streaks). Tout le stockage actuel est en localStorage — sans backend.

L'objectif est d'ajouter des fonctionnalités sociales : classement, défis entre amis, et mode chronométré.

---

## Architecture générale

**Pattern : Offline-first avec sync automatique**

- **localStorage** (inchangé) : quiz history, gamification (XP, badges, streaks), performance par chapitre
- **Supabase** (nouveau) : profils publics, amis, défis, classement, notifications
- **Sync queue** : les scores gagnés hors-ligne sont empilés dans localStorage (`sync-queue`), puis flushés vers Supabase dès que `navigator.onLine` redevient `true` (via `window.addEventListener('online', ...)`) ou immédiatement après chaque quiz si online

L'app reste entièrement fonctionnelle hors-ligne. Les fonctions sociales nécessitent une connexion internet.

---

## Fonctionnalités

### 1. Auth (compte utilisateur)
- Inscription par email + choix d'un pseudo unique
- Connexion / déconnexion
- L'app reste utilisable sans compte (mode solo local inchangé)
- Obligatoire pour accéder aux fonctions sociales

### 2. Classement
- Onglet **Global** : top 100 tous utilisateurs, classés par XP total
- Onglet **Amis** : classement filtré à tes amis uniquement
- Mis à jour à chaque synchronisation de score vers Supabase

### 3. Amis
- Recherche d'un ami par pseudo
- Invitation par lien partageable (WhatsApp, SMS, etc.) pour quelqu'un sans compte
- Envoi de demande d'ami in-app par pseudo pour quelqu'un avec un compte
- Acceptation / refus de demande d'ami
- Notification reçue à chaque nouvelle demande d'ami

### 4. Défis
- Créer un défi sur un chapitre précis avec un timer (durée choisie par le créateur)
- Deux modes de partage :
  - **Lien ouvert** : n'importe qui avec le lien peut relever le défi
  - **Défi ciblé** : envoyé à un ami spécifique in-app
- L'adversaire fait le même quiz avec le même timer
- Résultats comparés : score + temps mis
- Notification reçue quand un défi t'est envoyé et quand ton adversaire l'a complété

### 5. Mode chronométré (solo)
- Timer visible pendant le quiz (barre de progression)
- Le temps influe sur le score final : répondre vite = bonus de points
- Disponible sur tous les quiz existants (en plus du mode existant)

---

## Schéma de base de données (Supabase / PostgreSQL)

```sql
-- Profils publics
profiles (
  id              uuid PRIMARY KEY,  -- = auth.users.id
  pseudo          text UNIQUE NOT NULL,
  xp_total        int DEFAULT 0,
  niveau          int DEFAULT 1,
  streak_jours    int DEFAULT 0,
  dernier_quiz_date date,
  created_at      timestamp DEFAULT now()
)

-- Relations d'amitié
friendships (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES profiles(id),
  friend_id   uuid REFERENCES profiles(id),
  status      text CHECK (status IN ('pending', 'accepted')),
  created_at  timestamp DEFAULT now()
)

-- Défis créés
challenges (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        uuid REFERENCES profiles(id),
  target_friend_id  uuid REFERENCES profiles(id),  -- null = lien ouvert
  chapitre_slug     text NOT NULL,
  matiere_slug      text NOT NULL,
  niveau_scolaire   text NOT NULL,
  time_limit_sec    int NOT NULL,
  expires_at        timestamp NOT NULL,
  created_at        timestamp DEFAULT now()
)

-- Résultats d'un défi
challenge_results (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  uuid REFERENCES challenges(id),
  user_id       uuid REFERENCES profiles(id),
  score         int NOT NULL,
  time_sec      int NOT NULL,
  completed_at  timestamp DEFAULT now()
)

-- Badges débloqués
user_badges (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES profiles(id),
  badge_id        text NOT NULL,
  date_obtention  date NOT NULL,
  created_at      timestamp DEFAULT now()
)

-- Notifications
notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES profiles(id),
  type        text CHECK (type IN ('friend_request', 'challenge_received', 'challenge_completed')),
  payload     jsonb,
  lu          boolean DEFAULT false,
  created_at  timestamp DEFAULT now()
)

-- File de sync offline
sync_queue (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES profiles(id),
  xp_total        int NOT NULL,
  nouveaux_badges text[],
  updated_at      timestamp DEFAULT now()
)
```

---

## Organisation des fichiers

### Nouveaux fichiers
```
src/
├── lib/
│   ├── supabase.ts       ✅ créé — client Supabase
│   ├── auth.ts           inscription, connexion, déconnexion
│   ├── social.ts         amis, classement, défis (CRUD Supabase)
│   └── sync.ts           queue offline + flush au retour online
│
├── components/
│   ├── auth/
│   │   └── AuthModal.tsx       modal connexion / inscription
│   ├── social/
│   │   ├── Classement.tsx      onglets global + amis
│   │   ├── ListeAmis.tsx       recherche + demandes d'ami
│   │   ├── CarteDefi.tsx       affichage défi reçu / envoyé
│   │   └── ClochNotif.tsx      icône notifications dans le header
│   └── quiz/
│       └── TimerBar.tsx        barre de timer (mode chronométré)
│
└── app/
    ├── social/
    │   └── page.tsx            page hub social
    └── defi/
        └── [id]/
            └── page.tsx        page pour relever un défi via lien
```

### Fichiers existants modifiés
- `src/components/navigation/Header.tsx` — icône notif + bouton compte
- `src/components/quiz/QuizRunner.tsx` — intégration du timer
- `src/lib/gamification.ts` — appel sync après chaque quiz

---

## Contraintes techniques

- Supabase plan gratuit (500 MB, 50 000 utilisateurs actifs/mois) — largement suffisant
- **100 % client-side** : toute l'app utilise `"use client"`, aucun Server Component ni middleware Next.js
- Auth Supabase via `@supabase/supabase-js` (client JS pur) — le token de session est stocké dans `localStorage` par Supabase, pas dans des cookies httpOnly serveur
- Protection des pages sociales : vérification de session côté client dans chaque composant (redirect si non connecté)
- Pas de temps réel (pas de websocket) — les notifications sont lues au chargement de la page
- Le mode hors-ligne reste fonctionnel, les données sociales s'affichent avec les dernières valeurs connues

---

## Sécurité & Confidentialité (RGPD)

### Row Level Security (RLS) — Supabase
Toutes les tables Supabase auront RLS activé. Règles clés :
- Un utilisateur ne peut lire/modifier que ses propres données (`auth.uid() = user_id`)
- Les profils et classements sont lisibles publiquement (pseudo, XP, niveau uniquement)
- Les notifications, sync_queue et badges ne sont accessibles qu'à leur propriétaire

### Données collectées & finalité
| Donnée | Finalité | Durée de conservation |
|--------|----------|----------------------|
| Email | Authentification | Jusqu'à suppression du compte |
| Pseudo | Affichage social | Jusqu'à suppression du compte |
| XP / niveau / badges | Classement et défis | Jusqu'à suppression du compte |
| Historique quiz | Statistiques personnelles | localStorage uniquement (pas envoyé à Supabase) |

### Droits des utilisateurs (RGPD)
- **Droit d'accès** : l'utilisateur peut voir toutes ses données depuis son profil
- **Droit à l'effacement** : bouton "Supprimer mon compte" qui efface toutes les entrées Supabase liées à l'utilisateur (cascade sur toutes les tables) et purge le localStorage
- **Droit de rectification** : modification du pseudo possible depuis les paramètres

### Cookies & consentement
L'app étant 100 % client-side, Supabase Auth stocke le token de session dans `localStorage` (pas de cookie serveur). L'app n'utilise pas de cookies tiers ni publicitaires.

Un bandeau de consentement sera affiché au premier accès, conforme au RGPD (directive ePrivacy) :
- **Stockage nécessaire** (session auth en localStorage) : toujours actif, pas de consentement requis
- **Cookies analytiques** : désactivés par défaut, opt-in explicite
- Le choix de l'utilisateur est stocké en localStorage (`cookie-consent`)
- Tous les composants du bandeau sont `"use client"`

Nouveaux fichiers associés :
```
src/
├── components/
│   └── legal/
│       ├── BandeauCookies.tsx   bandeau RGPD au premier accès
│       └── PolitiqueConfidentialite.tsx
└── app/
    ├── confidentialite/
    │   └── page.tsx             page politique de confidentialité
    └── mentions-legales/
        └── page.tsx             page mentions légales
```

### Sécurité des mots de passe
Gérée entièrement par Supabase Auth (bcrypt, pas de mot de passe stocké côté app).

### Public cible mineur
Révioria s'adresse à des lycéens (15-18 ans). Aucune donnée sensible n'est collectée. Le pseudo est le seul identifiant public visible.
