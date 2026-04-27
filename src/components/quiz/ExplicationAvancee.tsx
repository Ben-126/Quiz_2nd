"use client";
import { useState } from "react";
import type { ExplicationAvancee as ExplicationAvanceeType } from "@/types";

interface ExplicationAvanceeProps {
  explicationAvancee?: ExplicationAvanceeType;
  defaultExpanded?: boolean;
}

export default function ExplicationAvancee({
  explicationAvancee,
  defaultExpanded = false,
}: ExplicationAvanceeProps) {
  const [ouvert, setOuvert] = useState(defaultExpanded);

  if (!explicationAvancee) return null;

  const { etapes, methode, erreurs_frequentes } = explicationAvancee;
  const aContenu =
    (etapes && etapes.length > 0) ||
    methode ||
    (erreurs_frequentes && erreurs_frequentes.length > 0);

  if (!aContenu) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(77,94,232,0.2)" }}>
      <button
        onClick={() => setOuvert((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left"
        style={{ background: "rgba(77,94,232,0.08)" }}
        aria-expanded={ouvert}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--indigo-l)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Explication détaillée
        </span>
        <span style={{ color: "var(--indigo-l)", fontSize: 14 }}>{ouvert ? "▲" : "▼"}</span>
      </button>

      {ouvert && (
        <div className="px-4 py-3 space-y-4" style={{ background: "rgba(255,255,255,0.02)" }}>
          {methode && (
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
                Méthode
              </span>
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(77,94,232,0.1)", color: "var(--indigo-l)" }}>
                {methode}
              </span>
            </div>
          )}

          {etapes && etapes.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Étapes de résolution
              </p>
              <ol className="space-y-2">
                {etapes.map((etape, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5" style={{ background: "var(--indigo)" }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{etape}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {erreurs_frequentes && erreurs_frequentes.length > 0 && (
            <div className="rounded-lg p-3" style={{ background: "rgba(245,200,64,0.08)", border: "1px solid rgba(245,200,64,0.25)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Erreurs fréquentes
              </p>
              <ul className="space-y-1.5">
                {erreurs_frequentes.map((erreur, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ fontSize: 14, color: "var(--text2)" }}>
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>{erreur}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
