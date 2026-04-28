import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/engagement/ServiceWorkerRegistrar";
import BandeauCookies from "@/components/legal/BandeauCookies";

const BASE_URL = "https://quiz-2nd-q5pu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Révioria — Révise avec l'IA",
    template: "%s | Révioria",
  },
  description:
    "Quiz IA gratuits pour réviser le lycée : Seconde, Première, Terminale. Mathématiques, Physique-Chimie, SVT, Histoire-Géo, Philosophie et plus encore.",
  keywords: [
    "révision lycée",
    "quiz ia",
    "révision ia",
    "quiz lycée",
    "révision seconde",
    "révision première",
    "révision terminale",
    "bac révision",
    "quiz bac",
    "mathématiques lycée",
    "révision gratuite",
  ],
  authors: [{ name: "Révioria" }],
  creator: "Révioria",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-revioria.png",
    apple: "/logo-revioria.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "Révioria",
    title: "Révioria — Révise avec l'IA",
    description:
      "Quiz IA gratuits pour réviser le lycée : Seconde, Première, Terminale. Mathématiques, Physique-Chimie, SVT et plus.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Révioria — Révise avec l'IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Révioria — Révise avec l'IA",
    description:
      "Quiz IA gratuits pour réviser le lycée : Seconde, Première, Terminale.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
