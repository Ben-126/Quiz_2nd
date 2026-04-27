"use client";

import Link from "next/link";
import type { Defi, ResultatDefi, ProfilPublic } from "@/types";

interface CarteDefiProps {
  defi: Defi;
  resultats: ResultatDefi[];
  userId: string;
}

export default function CarteDefi({ defi, resultats, userId }: CarteDefiProps) {
  const monResultat = resultats.find((r) => r.user_id === userId);
  const expire = new Date(defi.expires_at) < new Date();
  const lien = `/defi/${defi.id}`;

  return (
    <div className="rounded-xl p-4 space-y-3" style={expire
      ? { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", opacity: 0.7 }
      : { background: "var(--card)", border: "1px solid rgba(77,94,232,0.2)" }}>
      <div className="flex items-center justify-between">
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
            ⚡ Défi — {defi.matiere_slug} / {defi.chapitre_slug}
          </p>
          <p style={{ fontSize: 12, color: "var(--text3)" }}>
            Créé par {(defi.createur as ProfilPublic | undefined)?.pseudo ?? "Inconnu"} ·{" "}
            {Math.floor(defi.time_limit_sec / 60)} min
          </p>
        </div>
        {expire ? (
          <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500 }}>Expiré</span>
        ) : monResultat ? (
          <span style={{ fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>✅ {monResultat.score}%</span>
        ) : (
          <Link
            href={lien}
            className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors"
            style={{ background: "var(--indigo)", color: "#fff" }}
          >
            Relever
          </Link>
        )}
      </div>

      {resultats.length > 0 && (
        <ol className="space-y-1">
          {resultats.slice(0, 3).map((r, i) => (
            <li key={r.id} className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
              <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
              <span className="flex-1">{(r.profil as ProfilPublic | undefined)?.pseudo ?? "Joueur"}</span>
              <span style={{ fontWeight: 600 }}>{r.score}%</span>
              <span style={{ color: "var(--text3)" }}>{r.time_sec}s</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
