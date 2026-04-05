import Link from "next/link";
import type { Matiere } from "@/types";

interface MatiereCardProps {
  matiere: Matiere;
}

export default function MatiereCard({ matiere }: MatiereCardProps) {
  return (
    <Link
      href={`/${matiere.slug}`}
      data-testid="matiere-card"
      className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white border border-gray-100"
    >
      <div className={`${matiere.couleur} p-4 flex items-center justify-center`}>
        <span className="text-4xl" role="img" aria-label={matiere.nom}>{matiere.emoji}</span>
      </div>
      <div className="p-3 text-center">
        <h2 className="font-semibold text-gray-800 text-sm leading-tight group-hover:text-indigo-700 transition-colors">
          {matiere.nom}
        </h2>
        <p className="text-xs text-gray-400 mt-1">{matiere.chapitres.length} chapitres</p>
      </div>
    </Link>
  );
}
