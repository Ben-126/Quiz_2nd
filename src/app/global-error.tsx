"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f0f13", color: "#e2e2e8", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "0 24px" }}>
        <p style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⚠️</p>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Erreur critique
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#8b8b9e", maxWidth: 400, marginBottom: "1.5rem" }}>
          Une erreur inattendue s&apos;est produite. Tu peux réessayer ou revenir à l&apos;accueil.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={reset}
            style={{ padding: "10px 24px", background: "#4d5ee8", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
          >
            Réessayer
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders outside Next.js router context */}
          <a
            href="/"
            style={{ padding: "10px 24px", background: "rgba(255,255,255,0.07)", color: "#e2e2e8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}
          >
            Accueil
          </a>
        </div>
      </body>
    </html>
  );
}
