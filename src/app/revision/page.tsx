import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import RevisionIntelligente from "@/components/revision/RevisionIntelligente";

export const metadata: Metadata = {
  title: "Révision intelligente · Révioria",
  description: "Système de répétition espacée — révise les questions difficiles au bon moment.",
};

export default function PageRevision() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <RevisionIntelligente />
      </main>
    </div>
  );
}
