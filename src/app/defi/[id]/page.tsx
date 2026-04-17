"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getDefi, getResultatsDefi } from "@/lib/social";
import Header from "@/components/navigation/Header";
import CarteDefi from "@/components/social/CarteDefi";
import type { Defi, ResultatDefi } from "@/types";
import type { User } from "@supabase/supabase-js";

export default function PageDefi() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [defi, setDefi] = useState<Defi | null>(null);
  const [resultats, setResultats] = useState<ResultatDefi[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const [d, r] = await Promise.all([getDefi(id), getResultatsDefi(id)]);

      if (!d) {
        setErreur("Défi introuvable ou expiré.");
      } else {
        setDefi(d);
        setResultats(r);
      }
      setChargement(false);
    };
    init();
  }, [id]);

  if (chargement) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (erreur || !defi) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-4xl">😕</p>
          <p className="text-gray-700 font-medium">{erreur ?? "Défi introuvable"}</p>
          <button onClick={() => router.push("/")} className="text-indigo-600 hover:underline text-sm">
            Retour à l&apos;accueil
          </button>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-4xl">🔒</p>
          <p className="text-gray-700 font-medium text-center">
            Connecte-toi pour relever ce défi !
          </p>
          <CarteDefi defi={defi} resultats={resultats} userId="" />
        </main>
      </div>
    );
  }

  const dejaFait = resultats.some((r) => r.user_id === user.id);
  const expire = new Date(defi.expires_at) < new Date();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-800">Défi reçu</h1>
        <CarteDefi defi={defi} resultats={resultats} userId={user.id} />

        {!dejaFait && !expire && (
          <button
            onClick={() => router.push(`/${defi.niveau_scolaire}/${defi.matiere_slug}/${defi.chapitre_slug}/quiz?defi=${defi.id}&timer=${defi.time_limit_sec}`)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            ⚡ Commencer le défi
          </button>
        )}

        {dejaFait && (
          <p className="text-center text-green-600 font-semibold">Tu as déjà relevé ce défi !</p>
        )}
        {expire && (
          <p className="text-center text-gray-400">Ce défi est expiré.</p>
        )}
      </main>
    </div>
  );
}
