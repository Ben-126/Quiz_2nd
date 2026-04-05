import { notFound } from "next/navigation";
import Header from "@/components/navigation/Header";
import ChapitreCard from "@/components/navigation/ChapitreCard";
import { getMatiereBySlug, MATIERES } from "@/data/programme-seconde";

interface Props {
  params: Promise<{ matiere: string }>;
}

export async function generateStaticParams() {
  return MATIERES.map((m) => ({ matiere: m.slug }));
}

export default async function MatierePage({ params }: Props) {
  const { matiere: matiereSlug } = await params;
  const matiere = getMatiereBySlug(matiereSlug);

  if (!matiere) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header titre={matiere.nom} showBack backHref="/" />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`${matiere.couleur} rounded-xl p-3`}>
            <span className="text-3xl">{matiere.emoji}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{matiere.nom}</h1>
            <p className="text-sm text-gray-500">{matiere.chapitres.length} chapitres disponibles</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 font-medium mb-3">Choisir un chapitre :</p>

        <div className="space-y-3" data-testid="liste-chapitres">
          {matiere.chapitres.map((chapitre) => (
            <ChapitreCard key={chapitre.slug} matiere={matiere} chapitre={chapitre} />
          ))}
        </div>
      </main>
    </div>
  );
}
