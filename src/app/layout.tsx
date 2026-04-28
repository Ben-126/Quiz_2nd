import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/engagement/ServiceWorkerRegistrar";
import BandeauCookies from "@/components/legal/BandeauCookies";

export const metadata: Metadata = {
  title: "Révioria — Révise avec l'IA",
  description: "Application de quiz IA pour réviser les programmes du lycée général et technologique : Seconde, Première et Terminale.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-revioria.png",
    apple: "/logo-revioria.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <ServiceWorkerRegistrar />
        {children}
        <BandeauCookies />
      </body>
    </html>
  );
}
