"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text1)" }}>
        Une erreur s&apos;est produite
      </h1>
      <p className="mb-6" style={{ color: "var(--text3)", maxWidth: 400 }}>
        Quelque chose s&apos;est mal passé. Tu peux réessayer ou revenir à l&apos;accueil.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-semibold transition-colors"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text2)" }}
        >
          Accueil
        </Link>
      </div>
    </main>
  );
}
