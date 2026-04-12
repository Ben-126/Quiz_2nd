"use client";
import { useEffect, useState } from "react";
import { getPerformance } from "@/lib/performance";
import IndicateurMaitrise from "./IndicateurMaitrise";

interface Props {
  matiereSlug: string;
  chapitreSlug: string;
}

export default function ChapitreProgressionResume({ matiereSlug, chapitreSlug }: Props) {
  const [perf, setPerf] = useState<{ scoreMoyen: number; nombreQuiz: number } | null>(null);

  useEffect(() => {
    const p = getPerformance(matiereSlug, chapitreSlug);
    if (p && p.nombreQuizCompletes > 0) {
      setPerf({ scoreMoyen: p.scoreMoyen, nombreQuiz: p.nombreQuizCompletes });
    }
  }, [matiereSlug, chapitreSlug]);

  if (!perf) return null;

  return (
    <div className="mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500 font-medium mb-2">Ta progression sur ce chapitre</p>
      <IndicateurMaitrise scoreMoyen={perf.scoreMoyen} nombreQuiz={perf.nombreQuiz} />
    </div>
  );
}
