import Header from "@/components/navigation/Header";
import ScanCorrection from "@/components/scan/ScanCorrection";

export const metadata = {
  title: "Scan & Correction — Révioria",
  description: "Prends en photo ton exercice et obtiens une correction détaillée avec explications.",
};

export default function ScanPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: 720, margin: "0 auto", width: "100%", padding: "24px 24px 48px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Scan & Correction</h1>
          <p style={{ color: "var(--text3)", fontSize: 14 }}>
            Prends en photo un exercice et l&apos;IA te le corrige avec des explications détaillées.
          </p>
        </div>
        <ScanCorrection />
      </main>
    </div>
  );
}
