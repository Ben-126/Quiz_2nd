import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import RevisionIntelligente from "@/components/revision/RevisionIntelligente";

export const metadata: Metadata = {
  title: "Révision intelligente · Révioria",
  description: "Système de répétition espacée — révise les questions difficiles au bon moment.",
};

export default function PageRevision() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <RevisionIntelligente />
      </main>
    </>
  );
}
