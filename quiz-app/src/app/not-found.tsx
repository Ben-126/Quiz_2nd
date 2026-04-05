import Link from "next/link";
import Header from "@/components/navigation/Header";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-6">Cette matière ou ce chapitre n&apos;existe pas dans le programme.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
