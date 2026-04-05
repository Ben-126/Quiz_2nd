import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizSeconde — Révise avec l'IA",
  description: "Application de quiz IA pour réviser le programme de Seconde : Maths, Français, Histoire, SVT et plus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.className}>
      <body className="min-h-screen bg-gray-50 flex flex-col">{children}</body>
    </html>
  );
}
