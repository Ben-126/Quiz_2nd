import Link from "next/link";
import type { Matiere } from "@/types";
import IndicateurMaitrise from "@/components/progression/IndicateurMaitrise";

interface ChapitreCardProps {
  matiere: Matiere;
  chapitre: Matiere["chapitres"][0];
  niveau: string;
  progression?: { scoreMoyen: number; nombreQuiz: number } | null;
}

const MAX_COMPETENCES_VISIBLES = 3;

export default function ChapitreCard({ matiere, chapitre, niveau, progression }: ChapitreCardProps) {
  const competencesVisibles = chapitre.competences.slice(0, MAX_COMPETENCES_VISIBLES);
  const surplus = chapitre.competences.length - MAX_COMPETENCES_VISIBLES;

  return (
    <Link
      href={`/${niveau}/${matiere.slug}/${chapitre.slug}`}
      data-testid="chapitre-card"
      className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
    >
      <div className={`${matiere.couleur} rounded-lg p-2 shrink-0 mt-0.5`}>
        <span className="text-2xl" role="img" aria-label={matiere.nom}>{matiere.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors text-sm leading-tight">
          {chapitre.titre}
        </h3>
        <IndicateurMaitrise
          scoreMoyen={progression?.scoreMoyen ?? null}
          nombreQuiz={progression?.nombreQuiz ?? 0}
        />
        {/* Tags des compétences */}
        <div className="flex flex-wrap gap-1 mt-2" aria-label="Compétences du chapitre">
          {competencesVisibles.map((comp) => (
            <span
              key={comp.id}
              className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 leading-tight"
            >
              {comp.titre}
            </span>
          ))}
          {surplus > 0 && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500 leading-tight">
              +{surplus}
            </span>
          )}
        </div>
      </div>
      <svg
        className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0 mt-1"
        width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="M8 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
