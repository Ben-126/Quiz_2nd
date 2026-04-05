"use client";
import type { Question } from "@/types";

interface CorrectionDisplayProps {
  question: Question;
  reponseUtilisateur: string | boolean;
  correcte: boolean;
  onSuivant: () => void;
  estDerniere: boolean;
}

export default function CorrectionDisplay({
  question,
  reponseUtilisateur,
  correcte,
  onSuivant,
  estDerniere,
}: CorrectionDisplayProps) {
  const bonneReponse =
    question.type === "vrai_faux"
      ? question.reponseCorrecte
        ? "Vrai"
        : "Faux"
      : question.reponseCorrecte;

  const reponseUser =
    typeof reponseUtilisateur === "boolean"
      ? reponseUtilisateur
        ? "Vrai"
        : "Faux"
      : reponseUtilisateur;

  return (
    <div
      className={`rounded-2xl border-2 p-5 space-y-4 ${
        correcte
          ? "bg-green-50 border-green-300"
          : "bg-red-50 border-red-300"
      }`}
      data-testid="correction-display"
    >
      <div className="flex items-center gap-3">
        <span className={`text-3xl ${correcte ? "" : ""}`}>
          {correcte ? "🎉" : "😕"}
        </span>
        <div>
          <p className={`font-bold text-lg ${correcte ? "text-green-700" : "text-red-700"}`}>
            {correcte ? "Bonne réponse !" : "Mauvaise réponse"}
          </p>
          {!correcte && (
            <p className="text-sm text-gray-600 mt-0.5">
              Ta réponse : <span className="font-medium text-red-600">{String(reponseUser)}</span>
              {" · "}
              Bonne réponse : <span className="font-medium text-green-600">{String(bonneReponse)}</span>
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Explication</p>
        <p className="text-sm text-gray-700 leading-relaxed">{question.explication}</p>
      </div>

      <button
        onClick={onSuivant}
        data-testid="btn-suivant"
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
      >
        {estDerniere ? "Voir mon score" : "Question suivante →"}
      </button>
    </div>
  );
}
