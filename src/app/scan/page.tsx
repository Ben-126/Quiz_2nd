import Header from "@/components/navigation/Header";
import ScanCorrection from "@/components/scan/ScanCorrection";

export const metadata = {
  title: "Scan & Correction — Révioria",
  description: "Prends en photo ton exercice et obtiens une correction détaillée avec explications.",
};

export default function ScanPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Scan & Correction</h1>
          <p className="text-gray-500 text-sm">
            Prends en photo un exercice et l&apos;IA te le corrige avec des explications détaillées.
          </p>
        </div>
        <ScanCorrection />
      </main>
    </div>
  );
}
