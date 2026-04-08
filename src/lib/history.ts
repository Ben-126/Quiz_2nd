export interface EntreeHistorique {
  date: string;        // ISO 8601
  niveau: string;
  matiereSlug: string;
  matiereName: string;
  chapitreSlug: string;
  chapitreNom: string;
  score: number;       // 0–100
}

const HISTORY_KEY = "quiz-history";
const MAX_ENTRIES = 100;

export function getHistorique(): EntreeHistorique[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as EntreeHistorique[]) : [];
  } catch {
    return [];
  }
}

export function ajouterHistorique(entree: EntreeHistorique): void {
  try {
    const history = getHistorique();
    const updated = [entree, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}
