import { notFound } from "next/navigation";
import Header from "@/components/navigation/Header";
import QuizRunner from "@/components/quiz/QuizRunner";
import { getChapitreBySlug, MATIERES } from "@/data/programme-seconde";

interface Props {
  params: Promise<{ matiere: string; chapitre: string }>;
}

export async function generateStaticParams() {
  return MATIERES.flatMap((m) =>
    m.chapitres.map((c) => ({ matiere: m.slug, chapitre: c.slug }))
  );
}

export default async function QuizPage({ params }: Props) {
  const { matiere: matiereSlug, chapitre: chapitreSlug } = await params;
  const result = getChapitreBySlug(matiereSlug, chapitreSlug);

  if (!result) notFound();

  const { matiere, chapitre } = result;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        titre={chapitre.titre}
        showBack
        backHref={`/${matiereSlug}`}
      />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">{matiere.emoji}</span>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{matiere.nom}</p>
            <h1 className="text-base font-bold text-gray-800 leading-tight">{chapitre.titre}</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6" data-testid="quiz-container">
          <QuizRunner
            matiereSlug={matiereSlug}
            chapitreSlug={chapitreSlug}
            titreChapitre={chapitre.titre}
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Questions générées pour la classe de Seconde
        </p>
      </main>
    </div>
  );
}
