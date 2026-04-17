"use client";

import { useState } from "react";
import { inscrire, connecter } from "@/lib/auth";

interface AuthModalProps {
  onFermer: () => void;
  onConnecte: () => void;
}

type Onglet = "connexion" | "inscription";

export default function AuthModal({ onFermer, onConnecte }: AuthModalProps) {
  const [onglet, setOnglet] = useState<Onglet>("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const handleSoumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    if (onglet === "connexion") {
      const { erreur: err } = await connecter(email, motDePasse);
      if (err) {
        setErreur(err);
      } else {
        onConnecte();
        onFermer();
      }
    } else {
      if (pseudo.trim().length < 3) {
        setErreur("Le pseudo doit faire au moins 3 caractères.");
        setChargement(false);
        return;
      }
      const { erreur: err } = await inscrire(email, motDePasse, pseudo.trim());
      if (err) {
        setErreur(err);
      } else {
        onConnecte();
        onFermer();
      }
    }

    setChargement(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onFermer(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
        {/* Onglets */}
        <div className="flex border-b border-gray-200">
          {(["connexion", "inscription"] as Onglet[]).map((o) => (
            <button
              key={o}
              onClick={() => { setOnglet(o); setErreur(null); }}
              className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${
                onglet === o
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {o === "connexion" ? "Connexion" : "Créer un compte"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSoumettre} className="space-y-4">
          {onglet === "inscription" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pseudo (visible publiquement)
              </label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="ex: SuperEleve42"
                required
                minLength={3}
                maxLength={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {erreur && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erreur}</p>
          )}

          <button
            type="submit"
            disabled={chargement}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-colors"
          >
            {chargement ? "Chargement..." : onglet === "connexion" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
