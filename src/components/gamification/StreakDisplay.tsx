"use client";
import type { ProfilGamification } from "@/types";
import { GEL_PAR_MOIS } from "@/lib/gamification";

interface StreakDisplayProps {
  profil: ProfilGamification;
}

export default function StreakDisplay({ profil }: StreakDisplayProps) {
  const { streakJours, gelsRestants } = profil;

  const flammeEmoji =
    streakJours >= 100 ? "👑" :
    streakJours >= 30  ? "🏆" :
    streakJours >= 7   ? "🔥🔥" : "🔥";

  const couleurFlamme =
    streakJours >= 100 ? "from-yellow-400 to-amber-500" :
    streakJours >= 30  ? "from-orange-500 to-red-500" :
    streakJours >= 7   ? "from-orange-400 to-orange-600" :
                         "from-orange-300 to-orange-500";

  const flammeGradient =
    streakJours >= 100 ? "linear-gradient(135deg, #F5C840, #f59e0b)" :
    streakJours >= 30  ? "linear-gradient(135deg, #f97316, #ef4444)" :
    streakJours >= 7   ? "linear-gradient(135deg, #fb923c, #ea580c)" :
                         "linear-gradient(135deg, #fdba74, #f97316)";

  const messageMotivation =
    streakJours === 0   ? "Fais un quiz aujourd'hui pour commencer !" :
    streakJours >= 100  ? "Tu es une légende 👑" :
    streakJours >= 30   ? "Incroyable régularité !" :
    streakJours >= 7    ? "Continue comme ça, tu cartonnes !" :
                          "Reviens demain pour continuer !";

  // couleurFlamme kept to avoid unused var warning with a void reference
  void couleurFlamme;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "rgba(249,115,22,0.06)", borderRadius: "var(--r-lg)", border: "1px solid rgba(249,115,22,0.2)" }}>
      {/* Flamme + compteur */}
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "var(--r-md)", background: flammeGradient, flexShrink: 0, boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}
      >
        <span style={{ fontSize: 24, lineHeight: 1 }}>{flammeEmoji}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 2 }}>
          {streakJours}j
        </span>
      </div>

      {/* Infos streak */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
          {streakJours === 0
            ? "Aucune série en cours"
            : `Série de ${streakJours} jour${streakJours > 1 ? "s" : ""}`}
        </p>
        <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{messageMotivation}</p>

        {/* Gels restants */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          {Array.from({ length: GEL_PAR_MOIS }).map((_, i) => (
            <span
              key={i}
              style={{ fontSize: 14, opacity: i < gelsRestants ? 1 : 0.2 }}
              title={i < gelsRestants ? "Gel disponible" : "Gel utilisé"}
            >
              ❄️
            </span>
          ))}
          <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: 4 }}>
            {gelsRestants} gel{gelsRestants > 1 ? "s" : ""} restant{gelsRestants > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
