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
    <div className={`border rounded-xl p-4 space-y-3 ${expire ? "bg-gray-50 border-gray-200 opacity-70" : "bg-white border-indigo-200"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            ⚡ Défi — {defi.matiere_slug} / {defi.chapitre_slug}
          </p>
          <p className="text-xs text-gray-500">
            Créé par {(defi.createur as ProfilPublic | undefined)?.pseudo ?? "Inconnu"} ·{" "}
            {Math.floor(defi.time_limit_sec / 60)} min
          </p>
        </div>
        {expire ? (
          <span className="text-xs text-gray-400 font-medium">Expiré</span>
        ) : monResultat ? (
          <span className="text-xs text-green-600 font-semibold">✅ {monResultat.score}%</span>
        ) : (
          <Link
            href={lien}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Relever
          </Link>
        )}
      </div>

      {resultats.length > 0 && (
        <ol className="space-y-1">
          {resultats.slice(0, 3).map((r, i) => (
            <li key={r.id} className="flex items-center gap-2 text-xs text-gray-600">
              <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
              <span className="flex-1">{(r.profil as ProfilPublic | undefined)?.pseudo ?? "Joueur"}</span>
              <span className="font-semibold">{r.score}%</span>
              <span className="text-gray-400">{r.time_sec}s</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
