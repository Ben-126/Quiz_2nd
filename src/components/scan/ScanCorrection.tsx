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
          className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Zone de dépôt ou clic pour choisir une image"
        >
          <div className="text-5xl mb-4">📷</div>
          <p className="text-indigo-700 font-semibold text-lg mb-1">
            Prends en photo ton exercice
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Appuie pour ouvrir l&apos;appareil photo ou glisse une image ici
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors"
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {erreur}
        </div>
      )}

      {/* Prévisualisation */}
      {(etat === "preview" || etat === "chargement") && imagePreview && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Aperçu de l'exercice"
              className="w-full max-h-96 object-contain bg-gray-50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={reinitialiser}
              disabled={etat === "chargement"}
              className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Changer la photo
            </button>
            <button
              type="button"
              onClick={analyser}
              disabled={etat === "chargement"}
              className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Correction</p>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{resultat.correction}</p>
            {resultat.note && (
              <p className="text-xs text-green-700 mt-3 italic">{resultat.note}</p>
            )}
          </div>

          {/* Explication */}
          {resultat.explication && (
            <div className="bg-white border border-indigo-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-2">Explication</p>
              <p className="text-gray-700 text-sm leading-relaxed">{resultat.explication}</p>
            </div>
          )}

          {/* Étapes */}
          {resultat.etapes.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Méthode pas à pas</p>
              <ol className="space-y-2">
                {resultat.etapes.map((etape, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5">
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
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">Conseils</p>
              <ul className="space-y-2">
                {resultat.conseils.map((conseil, i) => (
                  <li key={i} className="flex gap-2 text-sm text-amber-900">
                    <span className="text-amber-500 mt-0.5">💡</span>
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
              className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Nouvel exercice
            </button>
            <button
              type="button"
              onClick={() => { setEtat("preview"); setResultat(null); }}
              className="flex-1 py-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-semibold text-sm hover:bg-indigo-100 transition-colors"
            >
              Réanalyser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
