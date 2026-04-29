/**
 * Gestion centralisée du consentement RGPD.
 * Toutes les clés localStorage non-essentielles passent par ce module.
 */

export const CONSENT_KEY = "cookie-consent";

export type ConsentValue = "accepted" | "refused" | null;

/** Retourne l'état du consentement de l'utilisateur */
export function getConsentement(): ConsentValue {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(CONSENT_KEY);
  if (val === "accepted" || val === "refused") return val;
  return null;
}

/** Retourne true si l'utilisateur a explicitement accepté */
export function aAccepte(): boolean {
  return getConsentement() === "accepted";
}

/**
 * Clés localStorage considérées comme NON-ESSENTIELLES.
 * Supprimées si l'utilisateur refuse le consentement
 * ou supprime son compte.
 */
export const CLES_NON_ESSENTIELLES = [
  "quiz-history",
  "quiz-performances",
  "gamification-profil",
  "objectifs-personnalises",
  "sync-queue",
  "quiz-notif-storage-key",
  "revision-espacee",
  "streak-notif-derniere-date",
] as const;

/**
 * Clés ESSENTIELLES (session, préférences utilisateur explicites).
 * Conservées même si l'utilisateur refuse.
 */
export const CLES_ESSENTIELLES = [
  CONSENT_KEY,
  "quiz-parametres",
] as const;

/** Supprime toutes les données non-essentielles du localStorage */
export function effacerDonneesNonEssentielles(): void {
  if (typeof window === "undefined") return;
  for (const cle of CLES_NON_ESSENTIELLES) {
    localStorage.removeItem(cle);
  }
}

/** Supprime TOUTES les données Révioria du localStorage (utilisé à la suppression de compte) */
export function effacerToutesLesDonnees(): void {
  if (typeof window === "undefined") return;
  for (const cle of CLES_NON_ESSENTIELLES) {
    localStorage.removeItem(cle);
  }
  for (const cle of CLES_ESSENTIELLES) {
    localStorage.removeItem(cle);
  }
}
