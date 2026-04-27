import type { EntreeHistorique } from "@/lib/history";

interface HistoriqueQuizProps {
  entrees: EntreeHistorique[];
}

function labelDate(isoDate: string): string {
  const entreeDate = new Date(isoDate).toDateString();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (entreeDate === today) return "Aujourd'hui";
  if (entreeDate === yesterday) return "Hier";
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function badgeScore(score: number): string {
  if (score >= 80) return "🟢";
  if (score >= 40) return "🟡";
  return "🔴";
}

export default function HistoriqueQuiz({ entrees }: HistoriqueQuizProps) {
  if (entrees.length === 0) {
    return (
      <p style={{ fontSize: 14, color: "var(--text3)", textAlign: "center", padding: "16px 0" }}>
        Aucun quiz complété pour l&apos;instant.
      </p>
    );
  }

  const groups: { label: string; entrees: EntreeHistorique[] }[] = [];
  for (const entree of entrees) {
    const label = labelDate(entree.date);
    const existing = groups.find((g) => g.label === label);
    if (existing) {
      existing.entrees.push(entree);
    } else {
      groups.push({ label, entrees: [entree] });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {groups.map((group) => (
        <div key={group.label}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            {group.label}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {group.entrees.map((e, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < group.entrees.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {e.matiereName} · {e.chapitreNom}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text3)", textTransform: "capitalize" }}>{e.niveau}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)" }}>{e.score}%</span>
                  <span>{badgeScore(e.score)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
