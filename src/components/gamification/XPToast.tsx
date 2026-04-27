"use client";
import { useEffect, useState } from "react";
import type { ResultatGamification } from "@/types";
import { NIVEAUX_GAMIFICATION, BADGES_GENERAUX, getBadgesMatiere } from "@/lib/gamification";
import { NIVEAUX } from "@/data/programmes";

interface XPToastProps {
  resultat: ResultatGamification;
}

function getBadgeNom(id: string): string {
  const general = BADGES_GENERAUX.find((b) => b.id === id);
  if (general) return general.nom;
  const toutesMatières = NIVEAUX.flatMap((n) => n.matieres);
  for (const mat of toutesMatières) {
    const badges = getBadgesMatiere(mat.slug, mat.nom);
    const found = badges.find((b) => b.id === id);
    if (found) return found.nom;
  }
  return id;
}

export default function XPToast({ resultat }: XPToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || resultat.xpGagne === 0) return null;

  const niveauInfo = NIVEAUX_GAMIFICATION.find((n) => n.numero === resultat.niveauActuel);

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 animate-bounce-once"
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-base"
        style={{ background: "var(--indigo)", color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
      >
        <span>⚡</span>
        <span>+{resultat.xpGagne} XP</span>
      </div>

      {resultat.nouveauNiveau !== null && niveauInfo && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-sm"
          style={{ background: "rgba(245,200,64,0.1)", color: "var(--amber)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
        >
          <span>{niveauInfo.emoji}</span>
          <span>Niveau {resultat.nouveauNiveau} — {niveauInfo.nom} !</span>
        </div>
      )}

      {resultat.nouveauxBadges.slice(0, 2).map((id) => (
        <div
          key={id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm"
          style={{ background: "var(--card)", border: "1px solid rgba(77,94,232,0.2)", color: "var(--indigo-l)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
        >
          <span>🏅</span>
          <span>Badge : {getBadgeNom(id)}</span>
        </div>
      ))}
    </div>
  );
}
