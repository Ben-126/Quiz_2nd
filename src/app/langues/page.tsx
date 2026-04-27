"use client";
import { useState } from "react";
import Header from "@/components/navigation/Header";
import ReconnaissanceVocale from "@/components/langues/ReconnaissanceVocale";
import CorrectionPrononciation from "@/components/langues/CorrectionPrononciation";
import DialogueLangue from "@/components/langues/DialogueLangue";

type Onglet = "reconnaissance" | "prononciation" | "dialogue";

const ONGLETS: { id: Onglet; label: string; emoji: string; description: string }[] = [
  {
    id: "reconnaissance",
    label: "Reconnaissance vocale",
    emoji: "🎙️",
    description: "Parlez et voyez la transcription en temps réel",
  },
  {
    id: "prononciation",
    label: "Prononciation",
    emoji: "🗣️",
    description: "Lisez une phrase et obtenez un feedback sur votre prononciation",
  },
  {
    id: "dialogue",
    label: "Dialogue IA",
    emoji: "💬",
    description: "Conversez avec l'IA dans la langue de votre choix",
  },
];

export default function LanguesPage() {
  const [onglet, setOnglet] = useState<Onglet>("reconnaissance");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: 720, margin: "0 auto", width: "100%", padding: "24px 24px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            🌍 Langues
          </h1>
          <p style={{ color: "var(--text3)", fontSize: 14 }}>
            Pratiquez l&apos;oral en langues étrangères avec l&apos;IA
          </p>
        </div>

        {/* Onglets */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "12px",
                borderRadius: "var(--r-md)",
                border: "2px solid",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                ...(onglet === o.id
                  ? { background: "var(--indigo)", color: "#fff", borderColor: "var(--indigo)" }
                  : { background: "transparent", color: "var(--text2)", borderColor: "var(--border2)" })
              }}
            >
              <span style={{ fontSize: 20 }}>{o.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{o.label}</span>
            </button>
          ))}
        </div>

        {/* Description de l'onglet */}
        <p style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginBottom: 24 }}>
          {ONGLETS.find((o) => o.id === onglet)?.description}
        </p>

        {/* Contenu */}
        <div style={{ background: "var(--card)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 24 }}>
          {onglet === "reconnaissance" && <ReconnaissanceVocale />}
          {onglet === "prononciation" && <CorrectionPrononciation />}
          {onglet === "dialogue" && <DialogueLangue />}
        </div>
      </main>
    </div>
  );
}
