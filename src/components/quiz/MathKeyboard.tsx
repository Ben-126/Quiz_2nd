"use client";
import { useState } from "react";

type TabId = "operations" | "inequations" | "geometrie" | "ensembles" | "unites" | "suites" | "physique";

interface Symbole {
  label: string;
  value: string;
}

interface MathKeyboardProps {
  onInsert: (texte: string) => void;
}

const ONGLETS: { id: TabId; label: string }[] = [
  { id: "operations", label: "OPÉRATIONS" },
  { id: "inequations", label: "INÉQUATIONS" },
  { id: "geometrie", label: "GÉOMÉTRIE" },
  { id: "ensembles", label: "ENSEMBLES" },
  { id: "unites", label: "UNITÉS" },
  { id: "suites", label: "SUITES ET FONCTIONS" },
  { id: "physique", label: "PHYSIQUE-CHIMIE" },
];

const SYMBOLES: Record<TabId, Symbole[][]> = {
  operations: [
    [
      { label: "0", value: "0" },
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6", value: "6" },
      { label: "7", value: "7" },
      { label: "8", value: "8" },
      { label: "9", value: "9" },
    ],
    [
      { label: ",", value: "," },
      { label: "=", value: "=" },
      { label: "+", value: "+" },
      { label: "−", value: "−" },
      { label: "×", value: "×" },
      { label: "÷", value: "÷" },
      { label: "()", value: "()" },
      { label: "xₙ", value: "x_n" },
      { label: "xⁿ", value: "x^n" },
      { label: "√", value: "√" },
    ],
    [
      { label: "π", value: "π" },
      { label: "∫", value: "∫" },
      { label: "⃗XY", value: "\\overrightarrow{XY}" },
      { label: "x̄", value: "x̄" },
      { label: "%", value: "%" },
      { label: "()!", value: "()!" },
    ],
  ],
  inequations: [
    [
      { label: "≤", value: "≤" },
      { label: "≥", value: "≥" },
      { label: "<", value: "<" },
      { label: ">", value: ">" },
      { label: "≈", value: "≈" },
    ],
  ],
  geometrie: [
    [
      { label: "𝒮", value: "𝒮" },
      { label: "𝒞", value: "𝒞" },
      { label: "𝒜", value: "𝒜" },
      { label: "𝒱", value: "𝒱" },
    ],
    [
      { label: "|  |", value: "|  |" },
      { label: "‖  ‖", value: "‖  ‖" },
      { label: "⌊  ⌋", value: "⌊  ⌋" },
    ],
  ],
  ensembles: [
    [
      { label: "ℕ", value: "ℕ" },
      { label: "ℤ", value: "ℤ" },
      { label: "𝔻", value: "𝔻" },
      { label: "ℚ", value: "ℚ" },
      { label: "ℝ", value: "ℝ" },
      { label: "ℝ*", value: "ℝ*" },
    ],
    [
      { label: "∞", value: "∞" },
      { label: "∅", value: "∅" },
      { label: "∪", value: "∪" },
      { label: "∩", value: "∩" },
      { label: "\\", value: "\\" },
      { label: "∈", value: "∈" },
      { label: "∉", value: "∉" },
    ],
    [
      { label: "[| |]", value: "[| |]" },
      { label: "]| |[", value: "]| |[" },
      { label: "]| |]", value: "]| |]" },
      { label: "[| |[", value: "[| |[" },
      { label: "{ }", value: "{ }" },
    ],
  ],
  unites: [
    [
      { label: "€", value: "€" },
      { label: "$", value: "$" },
      { label: "°", value: "°" },
      { label: "Ω", value: "Ω" },
      { label: "m²", value: "m²" },
      { label: "m³", value: "m³" },
    ],
    [
      { label: "/", value: "/" },
      { label: "km/h", value: "km/h" },
      { label: "m/s", value: "m/s" },
    ],
    [
      { label: "·", value: "·" },
      { label: "m·s⁻¹", value: "m·s⁻¹" },
    ],
  ],
  suites: [
    [
      { label: "x", value: "x" },
      { label: "y", value: "y" },
      { label: "α", value: "α" },
      { label: "β", value: "β" },
      { label: "γ", value: "γ" },
      { label: "θ", value: "θ" },
      { label: "λ", value: "λ" },
      { label: "σ", value: "σ" },
      { label: "μ", value: "μ" },
    ],
    [
      { label: "Uₙ", value: "Uₙ" },
      { label: "Vₙ", value: "Vₙ" },
      { label: "uₙ", value: "uₙ" },
      { label: "vₙ", value: "vₙ" },
      { label: "↦", value: "↦" },
    ],
  ],
  physique: [
    [
      { label: "→", value: "→" },
      { label: "ρ", value: "ρ" },
      { label: "⇌", value: "⇌" },
      { label: "Δ", value: "Δ" },
    ],
  ],
};

export default function MathKeyboard({ onInsert }: MathKeyboardProps) {
  const [ongletActif, setOngletActif] = useState<TabId>("operations");

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      {/* Barre des onglets */}
      <div className="flex overflow-x-auto scrollbar-hide" style={{ background: "var(--indigo)" }}>
        {ONGLETS.map((onglet) => (
          <button
            key={onglet.id}
            type="button"
            onClick={() => setOngletActif(onglet.id)}
            className="flex-shrink-0 px-3 py-2 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap"
            style={ongletActif === onglet.id
              ? { background: "rgba(255,255,255,0.15)", color: "#fff" }
              : { background: "transparent", color: "rgba(255,255,255,0.65)" }}
          >
            {onglet.label}
          </button>
        ))}
      </div>

      {/* Grille de symboles */}
      <div className="p-2 space-y-1" style={{ background: "var(--bg2)" }}>
        {SYMBOLES[ongletActif].map((rangee, ri) => (
          <div key={ri} className="flex flex-wrap gap-1">
            {rangee.map((symbole, si) => (
              <button
                key={si}
                type="button"
                onClick={() => onInsert(symbole.value)}
                className="min-w-[2.5rem] h-10 px-2 rounded-lg text-sm font-medium transition-all duration-100 active:scale-95"
                style={{ border: "1px solid var(--border2)", background: "var(--card)", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
              >
                {symbole.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
