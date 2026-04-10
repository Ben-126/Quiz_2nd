import { getHistorique } from "./history";
import { getParametres } from "./parametres";

export interface ProgressionObjectif {
  actuel: number; // quiz réussis aujourd'hui avec score >= seuil
  cible: number; // nombre de quiz cible
  atteint: boolean;
  restant: number; // quiz restants pour atteindre l'objectif
}

export function getProgressionObjectif(): ProgressionObjectif {
  const params = getParametres();
  const cible =
    params.objectifType === "minimum" ? 1 : params.objectifNombre;
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
