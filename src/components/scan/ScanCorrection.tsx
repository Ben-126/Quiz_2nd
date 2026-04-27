"use client";

import { useRef, useState } from "react";
import type { ScanResultat } from "@/app/api/scan/route";

type Etat = "idle" | "preview" | "chargement" | "resultat" | "erreur";

export default function ScanCorrection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [etat, setEtat] = useState<Etat>("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [resultat, setResultat] = useState<ScanResultat | null>(null);
  const [erreur, setErreur] = useState<string>("");

  function handleFichier(file: File) {
    if (!file.type.startsWith("image/")) {
      setErreur("Veuillez sélectionner une image.");
      setEtat("erreur");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErreur("L'image est trop grande (5 Mo maximum).");
      setEtat("erreur");
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      // Extraire la partie base64 après "data:image/...;base64,"
      const base64 = dataUrl.split(",")[1] ?? "";
      setImageBase64(base64);
      setEtat("preview");
    };
    reader.readAsDataURL(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFichier(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFichier(file);
  }

  function reinitialiser() {
    setEtat("idle");
    setImagePreview(null);
    setImageBase64("");
    setResultat(null);
    setErreur("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analyser() {
    if (!imageBase64) return;
    setEtat("chargement");
    setErreur("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? "Erreur lors de l'analyse.");
      }

      const data = await res.json() as ScanResultat;
      setResultat(data);
      setEtat("resultat");
    } catch (err: unknown) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
      setEtat("erreur");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Zone de capture */}
      {(etat === "idle" || etat === "erreur") && (
        <div
          className="rounded-2xl p-8 text-center transition-colors cursor-pointer"
          style={{ border: "2px dashed rgba(77,94,232,0.4)", background: "rgba(77,94,232,0.06)" }}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Zone de dépôt ou clic pour choisir une image"
        >
          <div className="text-5xl mb-4">📷</div>
          <p style={{ color: "var(--indigo-l)", fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
            Prends en photo ton exercice
          </p>
          <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 16 }}>
            Appuie pour ouvrir l&apos;appareil photo ou glisse une image ici
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: "var(--indigo)", color: "#fff", border: "none", cursor: "pointer" }}
            >
              📷 Appareil photo / Galerie
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
            aria-hidden="true"
          />
        </div>
      )}

      {etat === "erreur" && (
        <div className="rounded-xl p-4 text-sm" style={{ background: "rgba(239,110,90,0.1)", border: "1px solid rgba(239,110,90,0.3)", color: "var(--coral-l)" }}>
          {erreur}
        </div>
      )}

      {/* Prévisualisation */}
      {(etat === "preview" || etat === "chargement") && imagePreview && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Aperçu de l'exercice"
              className="w-full max-h-96 object-contain"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={reinitialiser}
              disabled={etat === "chargement"}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
              style={{ border: "1px solid var(--border2)", color: "var(--text2)", background: "transparent", cursor: "pointer" }}
            >
              Changer la photo
            </button>
            <button
              type="button"
              onClick={analyser}
              disabled={etat === "chargement"}
              className="flex-[2] py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "var(--indigo)", color: "#fff", border: "none", cursor: "pointer" }}
            >
              {etat === "chargement" ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyse en cours…
                </>
              ) : (
                "✨ Analyser et corriger"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Résultat */}
      {etat === "resultat" && resultat && (
        <div className="space-y-4">
          {/* Correction principale */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(61,214,191,0.08)", border: "2px solid rgba(61,214,191,0.3)" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Correction</p>
            <p style={{ color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{resultat.correction}</p>
            {resultat.note && (
              <p style={{ fontSize: 12, color: "var(--teal)", marginTop: 12, fontStyle: "italic" }}>{resultat.note}</p>
            )}
          </div>

          {/* Explication */}
          {resultat.explication && (
            <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid rgba(77,94,232,0.2)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--indigo-l)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Explication</p>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>{resultat.explication}</p>
            </div>
          )}

          {/* Étapes */}
          {resultat.etapes.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Méthode pas à pas</p>
              <ol className="space-y-2">
                {resultat.etapes.map((etape, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{ color: "var(--text2)" }}>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center mt-0.5" style={{ background: "rgba(77,94,232,0.1)", color: "var(--indigo-l)" }}>
                      {i + 1}
                    </span>
                    <span>{etape}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Conseils */}
          {resultat.conseils.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: "rgba(245,200,64,0.08)", border: "1px solid rgba(245,200,64,0.25)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Conseils</p>
              <ul className="space-y-2">
                {resultat.conseils.map((conseil, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text2)" }}>
                    <span style={{ color: "var(--amber)", marginTop: 2 }}>💡</span>
                    <span>{conseil}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={reinitialiser}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ border: "1px solid var(--border2)", color: "var(--text2)", background: "transparent", cursor: "pointer" }}
            >
              Nouvel exercice
            </button>
            <button
              type="button"
              onClick={() => { setEtat("preview"); setResultat(null); }}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: "rgba(77,94,232,0.1)", color: "var(--indigo-l)", border: "1px solid rgba(77,94,232,0.2)", cursor: "pointer" }}
            >
              Réanalyser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
