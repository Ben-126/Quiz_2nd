"use client";
import type { ProfilGamification } from "@/types";

interface CalendrierStreakProps {
  profil: ProfilGamification;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // Transformer dimanche=0 en lundi=0
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

type EtatJour = "joue" | "gele" | "manque" | "futur" | "aujourd";

const MOIS_NOMS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];

const JOURS_SEMAINE = ["L", "M", "M", "J", "V", "S", "D"];

const STYLE_PAR_ETAT: Record<EtatJour, React.CSSProperties> = {
  joue:    { background: "#f97316", color: "#fff", fontWeight: 700 },
  gele:    { background: "rgba(96,165,250,0.2)", color: "#93c5fd", fontWeight: 500 },
  manque:  { background: "rgba(255,255,255,0.04)", color: "var(--text3)" },
  futur:   { background: "transparent", color: "var(--text3)", opacity: 0.3 },
  aujourd: { background: "var(--indigo)", color: "#fff", fontWeight: 700, boxShadow: "0 0 0 2px rgba(122,141,245,0.4)" },
};

const TITRE_PAR_ETAT: Record<EtatJour, string> = {
  joue:    "Quiz fait ✅",
  gele:    "Gel utilisé ❄️",
  manque:  "Jour manqué",
  futur:   "",
  aujourd: "Aujourd'hui",
};

export default function CalendrierStreak({ profil }: CalendrierStreakProps) {
  const today    = new Date();
  const year     = today.getFullYear();
  const month    = today.getMonth();
  const todayStr = today.toISOString().slice(0, 10);

  const joursJouesSet = new Set(profil.joursJoues);
  const joursGelesSet = new Set(profil.joursGeles);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);

  const cellules: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function getEtat(day: number): EtatJour {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (dateStr === todayStr)          return "aujourd";
    if (dateStr > todayStr)            return "futur";
    if (joursJouesSet.has(dateStr))    return "joue";
    if (joursGelesSet.has(dateStr))    return "gele";
    return "manque";
  }

  return (
    <div
      style={{ background: "var(--card)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", padding: 16 }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text2)" }}>
        📅 {MOIS_NOMS[month]} {year}
      </h3>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {JOURS_SEMAINE.map((j, i) => (
          <div key={i} className="text-center text-xs font-semibold py-1" style={{ color: "var(--text3)" }}>
            {j}
          </div>
        ))}
      </div>

      {/* Cases */}
      <div className="grid grid-cols-7 gap-1">
        {cellules.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const etat = getEtat(day);
          return (
            <div
              key={day}
              className="aspect-square flex items-center justify-center rounded-lg text-xs transition-all"
              style={STYLE_PAR_ETAT[etat]}
              title={TITRE_PAR_ETAT[etat]}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex gap-3 mt-3 flex-wrap">
        <LegendItem bgStyle={{ background: "#f97316" }} label="Quiz fait" />
        <LegendItem bgStyle={{ background: "rgba(96,165,250,0.2)" }} label="Gel utilisé" />
        <LegendItem bgStyle={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }} label="Manqué" />
        <LegendItem bgStyle={{ background: "var(--indigo)" }} label="Aujourd'hui" />
      </div>
    </div>
  );
}

function LegendItem({ bgStyle, label }: { bgStyle: React.CSSProperties; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ width: 12, height: 12, borderRadius: 3, ...bgStyle }} />
      <span className="text-xs" style={{ color: "var(--text3)" }}>{label}</span>
    </div>
  );
}
