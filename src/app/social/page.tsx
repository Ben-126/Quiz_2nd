"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/navigation/Header";
import Classement from "@/components/social/Classement";
import ListeAmis from "@/components/social/ListeAmis";
import type { User } from "@supabase/supabase-js";

type OngletSocial = "classement" | "amis" | "defis";

export default function PageSocial() {
  const [user, setUser] = useState<User | null>(null);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState<OngletSocial>("classement");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
      setChargement(false);
    });
  }, [router]);

  if (chargement) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, border: "4px solid rgba(77,94,232,0.3)", borderTopColor: "var(--indigo)", borderRadius: "50%" }} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: 720, margin: "0 auto", width: "100%", padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>Social</h1>

        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
          {([
            { id: "classement", label: "🏆 Classement" },
            { id: "amis", label: "👥 Amis" },
            { id: "defis", label: "⚡ Défis" },
          ] as { id: OngletSocial; label: string }[]).map((o) => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: "var(--r-sm) var(--r-sm) 0 0",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                ...(onglet === o.id
                  ? { background: "var(--indigo)", color: "#fff" }
                  : { background: "transparent", color: "var(--text3)" })
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {onglet === "classement" && <Classement userId={user.id} />}
        {onglet === "amis" && <ListeAmis userId={user.id} />}
        {onglet === "defis" && (
          <p style={{ textAlign: "center", color: "var(--text3)", padding: "32px 0", fontSize: 14 }}>
            Les défis arrivent bientôt !
          </p>
        )}
      </main>
    </div>
  );
}
