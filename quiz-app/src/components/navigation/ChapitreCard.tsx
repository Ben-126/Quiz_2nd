import Link from "next/link";
import type { Matiere } from "@/types";

interface ChapitreCardProps {
  matiere: Matiere;
  chapitre: Matiere["chapitres"][0];
}

export default function ChapitreCard({ matiere, chapitre }: ChapitreCardProps) {
  return (
    <Link
      href={`/${matiere.slug}/${chapitre.slug}/quiz`}
      data-testid="chapitre-card"
      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
    >
      <div className={`${matiere.couleur} rounded-lg p-2 shrink-0`}>
        <span className="text-2xl" role="img" aria-label={matiere.nom}>{matiere.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors text-sm leading-tight">
          {chapitre.titre}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {chapitre.competences.length} compétences · 5 questions
        </p>
      </div>
      <svg
        className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0"
        width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="M8 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
