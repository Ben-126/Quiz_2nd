"use client";
import { useMemo } from "react";
import type { Chapitre } from "@/types";
import type { PerformanceChapitre } from "@/lib/performance";

interface PredictionNoteProps {
  matiereSlug: string;
  chapitres: Chapitre[];
  performances: Record<string, PerformanceChapitre>;
}

interface AnalyseChapitre {
  slug: string;
  titre: string;
  scoreMoyen: number | null;
  tendance: "hausse" | "baisse" | "stable" | null;
}

function calculerTendance(scores: number[]): "hausse" | "baisse" | "stable" | null {
  if (scores.length < 2) return null;
  const recent = scores[scores.length - 1];
  const precedent = scores[scores.length - 2];
  if (recent - precedent >= 5) return "hausse";
  if (precedent - recent >= 5) return "baisse";
  return "stable";
}

function noteVersCouleurs(note: number): { bg: string; text: string; border: string; barColor: string } {
  if (note >= 16) return { bg: "rgba(61,214,191,0.08)", text: "var(--teal)", border: "rgba(61,214,191,0.3)", barColor: "var(--teal)" };
  if (note >= 14) return { bg: "rgba(61,214,191,0.06)", text: "#5ecba1", border: "rgba(94,203,161,0.3)", barColor: "#5ecba1" };
  if (note >= 12) return { bg: "rgba(245,200,64,0.08)", text: "var(--amber)", border: "rgba(245,200,64,0.3)", barColor: "var(--amber)" };
  if (note >= 10) return { bg: "rgba(245,200,64,0.06)", text: "#f0a832", border: "rgba(240,168,50,0.3)", barColor: "#f0a832" };
  return { bg: "rgba(239,110,90,0.08)", text: "var(--coral-l)", border: "rgba(239,110,90,0.3)", barColor: "var(--coral)" };
}

function noteVersEmoji(note: number): string {
  if (note >= 18) return "🏆";
  if (note >= 16) return "⭐";
  if (note >= 14) return "👍";
  if (note >= 12) return "📈";
  if (note >= 10) return "⚠️";
  return "🚨";
}

function noteVersMessage(note: number): string {
  if (note >= 18) return "Excellent niveau, continue comme ça !";
  if (note >= 16) return "Très bon niveau, quelques détails à peaufiner.";
  if (note >= 14) return "Bon niveau, consolide les chapitres faibles.";
  if (note >= 12) return "Niveau correct, un effort sur les points faibles fera la différence.";
  if (note >= 10) return "Juste la moyenne, des révisions ciblées s'imposent.";
  return "Des lacunes importantes, concentre-toi sur les bases.";
}

export default function PredictionNote({ matiereSlug, chapitres, performances }: PredictionNoteProps) {
  const analyse = useMemo((): {
    notePredite: number | null;
    chapitresAnalyses: AnalyseChapitre[];
    pointsFaibles: AnalyseChapitre[];
    aConsolider: AnalyseChapitre[];
    nonTravailles: Chapitre[];
    chapitresTravailles: number;
  } => {
    const chapitresAnalyses: AnalyseChapitre[] = chapitres.map((c) => {
      const cle = `${matiereSlug}/${c.slug}`;
      const perf = performances[cle];
      if (!perf || perf.nombreQuizCompletes === 0) {
        return { slug: c.slug, titre: c.titre, scoreMoyen: null, tendance: null };
      }
      return {
        slug: c.slug,
        titre: c.titre,
        scoreMoyen: perf.scoreMoyen,
        tendance: calculerTendance(perf.derniersScores),
      };
    });

    const avecDonnees = chapitresAnalyses.filter((c) => c.scoreMoyen !== null);
    const nonTravailles = chapitres.filter((c) => {
      const cle = `${matiereSlug}/${c.slug}`;
      const perf = performances[cle];
      return !perf || perf.nombreQuizCompletes === 0;
    });

    if (avecDonnees.length === 0) {
      return {
        notePredite: null,
        chapitresAnalyses,
        pointsFaibles: [],
        aConsolider: [],
        nonTravailles,
        chapitresTravailles: 0,
      };
    }

    const scoreMoyenTravailles =
      avecDonnees.reduce((sum, c) => sum + (c.scoreMoyen ?? 0), 0) / avecDonnees.length;

    const ratioTravaille = avecDonnees.length / chapitres.length;
    const scorePondere = scoreMoyenTravailles * ratioTravaille + 50 * (1 - ratioTravaille);

    const notePredite = Math.round((scorePondere / 100) * 20 * 10) / 10;

    const pointsFaibles = avecDonnees
      .filter((c) => (c.scoreMoyen ?? 0) < 60)
      .sort((a, b) => (a.scoreMoyen ?? 0) - (b.scoreMoyen ?? 0));

    const aConsolider = avecDonnees
      .filter((c) => (c.scoreMoyen ?? 0) >= 60 && (c.scoreMoyen ?? 0) < 80)
      .sort((a, b) => (a.scoreMoyen ?? 0) - (b.scoreMoyen ?? 0));

    return {
      notePredite,
      chapitresAnalyses,
      pointsFaibles,
      aConsolider,
      nonTravailles,
      chapitresTravailles: avecDonnees.length,
    };
  }, [matiereSlug, chapitres, performances]);

  if (analyse.chapitresTravailles === 0) return null;

  const { notePredite, pointsFaibles, aConsolider, nonTravailles } = analyse;
  const aucunPointFaible = pointsFaibles.length === 0 && aConsolider.length === 0 && nonTravailles.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Carte prédiction de note */}
      {notePredite !== null && (() => {
        const couleurs = noteVersCouleurs(notePredite);
        return (
          <div style={{ borderRadius: "var(--r-lg)", border: `1px solid ${couleurs.border}`, padding: 20, background: couleurs.bg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: "var(--r-md)", background: "rgba(255,255,255,0.05)", border: `2px solid ${couleurs.border}`, flexShrink: 0 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: couleurs.text }}>{notePredite}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: couleurs.text }}>/20</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{noteVersEmoji(notePredite)}</span>
                  <p style={{ fontSize: 14, fontWeight: 700, color: couleurs.text }}>Note estimée</p>
                </div>
                <p style={{ fontSize: 12, color: couleurs.text, opacity: 0.8 }}>{noteVersMessage(notePredite)}</p>
                <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                  Basée sur {analyse.chapitresTravailles}/{chapitres.length} chapitres travaillés
                </p>
              </div>
            </div>

            {/* Jauge visuelle */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>
                <span>0</span>
                <span>10</span>
                <span>20</span>
              </div>
              <div style={{ width: "100%", height: 12, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{ height: "100%", borderRadius: 999, transition: "width 0.7s", width: `${(notePredite / 20) * 100}%`, background: couleurs.barColor }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Analyse des points faibles */}
      {!aucunPointFaible && (
        <div style={{ background: "var(--card)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)" }}>Analyse des points faibles</h3>

          {pointsFaibles.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--coral-l)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 4 }}>
                <span>🚨</span> À retravailler en priorité
              </p>
              {pointsFaibles.map((c) => (
                <ChapitreBar
                  key={c.slug}
                  titre={c.titre}
                  score={c.scoreMoyen ?? 0}
                  tendance={c.tendance}
                  couleur="red"
                />
              ))}
            </div>
          )}

          {aConsolider.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 4 }}>
                <span>⚠️</span> À consolider
              </p>
              {aConsolider.map((c) => (
                <ChapitreBar
                  key={c.slug}
                  titre={c.titre}
                  score={c.scoreMoyen ?? 0}
                  tendance={c.tendance}
                  couleur="orange"
                />
              ))}
            </div>
          )}

          {nonTravailles.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 4 }}>
                <span>📚</span> Non travaillés
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {nonTravailles.map((c) => (
                  <span
                    key={c.slug}
                    style={{ padding: "4px 8px", background: "rgba(255,255,255,0.06)", color: "var(--text2)", borderRadius: "var(--r-sm)", fontSize: 12, fontWeight: 500 }}
                  >
                    {c.titre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tout est bon */}
      {aucunPointFaible && analyse.chapitresTravailles > 0 && (
        <div style={{ background: "rgba(61,214,191,0.08)", border: "1px solid rgba(61,214,191,0.3)", borderRadius: "var(--r-lg)", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--teal)" }}>Aucun point faible détecté !</p>
            <p style={{ fontSize: 12, color: "var(--teal)", opacity: 0.8 }}>Tous tes chapitres sont maîtrisés ou en bonne voie.</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ChapitreBarProps {
  titre: string;
  score: number;
  tendance: "hausse" | "baisse" | "stable" | null;
  couleur: "red" | "orange";
}

function ChapitreBar({ titre, score, tendance, couleur }: ChapitreBarProps) {
  const barColor = couleur === "red" ? "var(--coral)" : "var(--amber)";
  const tendanceIcon = tendance === "hausse" ? "↗️" : tendance === "baisse" ? "↘️" : tendance === "stable" ? "→" : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", maxWidth: "60%" }}>{titre}</span>
        <span style={{ fontSize: 12, color: "var(--text3)", display: "flex", alignItems: "center", gap: 4 }}>
          {tendanceIcon && <span style={{ fontSize: 14, lineHeight: 1 }}>{tendanceIcon}</span>}
          <span style={{ fontWeight: 600 }}>{score}%</span>
        </span>
      </div>
      <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{ height: "100%", borderRadius: 999, transition: "width 0.5s", width: `${score}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
