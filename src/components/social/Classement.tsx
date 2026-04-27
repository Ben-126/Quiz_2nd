"use client";

import { useState, useEffect } from "react";
import { getClassementGlobal, getClassementAmis } from "@/lib/social";
import type { EntreeClassement } from "@/types";
import { getNiveauFromXP } from "@/lib/gamification";

interface ClassementProps {
  userId: string;
}

type OngletClassement = "global" | "amis";

export default function Classement({ userId }: ClassementProps) {
  const [onglet, setOnglet] = useState<OngletClassement>("global");
  const [entrees, setEntrees] = useState<EntreeClassement[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      const data =
        onglet === "global"
          ? await getClassementGlobal(100)
          : await getClassementAmis(userId);
      setEntrees(data);
      setChargement(false);
    };
    charger();
  }, [onglet, userId]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["global", "amis"] as OngletClassement[]).map((o) => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={onglet === o
              ? { background: "var(--indigo)", color: "#fff", border: "none", cursor: "pointer" }
              : { background: "transparent", color: "var(--indigo-l)", border: "1px solid rgba(77,94,232,0.4)", cursor: "pointer" }}
          >
            {o === "global" ? "🌍 Global" : "👥 Amis"}
          </button>
        ))}
      </div>

      {chargement ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "rgba(77,94,232,0.3)", borderTopColor: "var(--indigo)" }} />
        </div>
      ) : entrees.length === 0 ? (
        <p className="text-center py-8 text-sm" style={{ color: "var(--text3)" }}>
          {onglet === "amis" ? "Ajoute des amis pour voir leur classement !" : "Aucun joueur pour l'instant."}
        </p>
      ) : (
        <ol className="space-y-2">
          {entrees.map((e) => {
            const niveau = getNiveauFromXP(e.xp_total);
            const estMoi = e.id === userId;
            return (
              <li
                key={e.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={estMoi
                  ? { background: "rgba(77,94,232,0.1)", border: "1px solid rgba(77,94,232,0.3)", fontWeight: 600 }
                  : { background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <span className="w-7 text-center font-bold text-sm" style={{ color: "var(--text3)" }}>
                  {e.rang === 1 ? "🥇" : e.rang === 2 ? "🥈" : e.rang === 3 ? "🥉" : `#${e.rang}`}
                </span>
                <span className="text-lg">{niveau.emoji}</span>
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)" }}>{e.pseudo}{estMoi ? " (moi)" : ""}</span>
                <span style={{ color: "var(--indigo-l)", fontWeight: 700, fontSize: 14 }}>{e.xp_total} XP</span>
                {e.streak_jours >= 3 && (
                  <span title={`Série de ${e.streak_jours} jours`} className="text-sm">🔥</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
