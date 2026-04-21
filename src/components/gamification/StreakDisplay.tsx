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

  const messageMotivation =
    streakJours === 0   ? "Fais un quiz aujourd'hui pour commencer !" :
    streakJours >= 100  ? "Tu es une légende 👑" :
    streakJours >= 30   ? "Incroyable régularité !" :
    streakJours >= 7    ? "Continue comme ça, tu cartonnes !" :
                          "Reviens demain pour continuer !";

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
        <p className="text-xs text-gray-400 mt-0.5">{messageMotivation}</p>

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
