import Header from "@/components/navigation/Header";
import MatiereCard from "@/components/navigation/MatiereCard";
import { MATIERES } from "@/data/programme-seconde";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Révise avec l&apos;IA 🎓
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Choisis une matière pour commencer tes révisions
          </p>
        </div>

        <div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3 sm:gap-4"
          data-testid="liste-matieres"
        >
          {MATIERES.map((matiere) => (
            <MatiereCard key={matiere.slug} matiere={matiere} />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Programme officiel de Seconde · Contenu aligné sur{" "}
          <a
            href="https://www.schoolmouv.fr/seconde"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-indigo-500"
          >
            SchoolMouv
          </a>
        </p>
      </main>
    </div>
  );
}
