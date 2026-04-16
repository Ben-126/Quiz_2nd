import type { BadgeDebloque } from "@/types";
import type { BadgeInfo } from "@/lib/gamification";

interface BadgeGridProps {
  allBadges: BadgeInfo[];
  debloques: BadgeDebloque[];
}

export default function BadgeGrid({ allBadges, debloques }: BadgeGridProps) {
  const debloquesSet = new Set(debloques.map((b) => b.id));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {allBadges.map((badge) => {
        const debloque = debloquesSet.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
              debloque
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "bg-gray-50 border-gray-100 opacity-40 grayscale"
            }`}
            title={debloque ? badge.description : `🔒 ${badge.description}`}
          >
            <span className="text-2xl">{debloque ? badge.emoji : "🔒"}</span>
            <span className={`text-xs font-medium leading-tight ${debloque ? "text-indigo-800" : "text-gray-500"}`}>
              {badge.nom}
            </span>
          </div>
        );
      })}
    </div>
  );
}
