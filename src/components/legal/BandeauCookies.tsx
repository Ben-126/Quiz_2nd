"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getConsentement, enregistrerConsentement, effacerDonneesNonEssentielles } from "@/lib/consent";

export default function BandeauCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsentement()) setVisible(true);
  }, []);

  const accepter = () => {
    enregistrerConsentement("accepted");
    setVisible(false);
  };

  const refuser = () => {
    enregistrerConsentement("refused");
    // RGPD : supprimer immédiatement toutes les données non-essentielles déjà collectées
    effacerDonneesNonEssentielles();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-gray-700 space-y-1">
          <p>
            Révioria sauvegarde ta progression, tes résultats et tes préférences <strong>localement sur ton appareil</strong> pour
            faire fonctionner le service. Ces données ne sont pas transmises à des tiers à des fins publicitaires.{" "}
            <Link href="/confidentialite" className="text-indigo-600 hover:underline">
              En savoir plus
            </Link>
          </p>
          <p className="text-xs text-gray-400">
            Si tu refuses, ta progression et tes résultats ne seront pas sauvegardés.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={refuser}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accepter}
            className="px-4 py-2 text-sm bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
