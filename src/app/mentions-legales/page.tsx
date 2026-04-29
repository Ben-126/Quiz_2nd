import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Révioria — éditeur, hébergeur, propriété intellectuelle.",
  robots: { index: false, follow: false },
};

export default function PageMentionsLegales() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-8 text-sm text-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mentions légales</h1>
          <p className="text-gray-500 mt-1">Conformément à la loi n° 2004-575 du 21 juin 2004 (LCEN)</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">1. Éditeur du site</h2>
          <p>
            Révioria est un projet édité par un particulier, actuellement en accès gratuit, avec des fonctionnalités
            payantes et des publicités prévues à terme.
          </p>
          <ul className="space-y-1 text-gray-600">
            <li><strong>Nom :</strong> Ben Podrojsky</li>
            <li><strong>Statut :</strong> Particulier</li>
            <li>
              <strong>Contact :</strong>{" "}
              <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">
                benpodrojsky@gmail.com
              </a>
            </li>
          </ul>
          <p className="text-gray-500 text-xs mt-2">
            Conformément à l&apos;article 6-III-2° de la LCEN, les particuliers ne sont pas tenus de publier leur adresse
            postale complète, mais doivent permettre d&apos;être contactés par l&apos;hébergeur.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">2. Hébergement</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium">Application web :</p>
              <ul className="space-y-0.5 text-gray-600 ml-4">
                <li>Vercel Inc.</li>
                <li>340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis</li>
                <li>Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">vercel.com</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Base de données :</p>
              <ul className="space-y-0.5 text-gray-600 ml-4">
                <li>Supabase Inc.</li>
                <li>Serveur : Union Européenne — Stockholm, Suède (aws-eu-north-1)</li>
                <li>Site : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">supabase.com</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Intelligence artificielle :</p>
              <ul className="space-y-0.5 text-gray-600 ml-4">
                <li>Groq Inc.</li>
                <li>101 Main Street, Floor 4, San Francisco, CA 94105, États-Unis</li>
                <li>Site : <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">groq.com</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Protection anti-abus (rate limiting) :</p>
              <ul className="space-y-0.5 text-gray-600 ml-4">
                <li>Upstash Inc.</li>
                <li>340 S Lemon Ave #1423, Walnut, CA 91789, États-Unis</li>
                <li>Site : <a href="https://upstash.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">upstash.com</a></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">3. Propriété intellectuelle</h2>
          <p>
            Le code source de Révioria est la propriété de son éditeur. Les contenus pédagogiques sont inspirés des{" "}
            <a
              href="https://www.education.gouv.fr/reussir-au-lycee/les-programmes-du-lycee-general-et-technologique-9812"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              programmes officiels du Ministère de l&apos;Éducation nationale
            </a>
            {" "}et générés dynamiquement par intelligence artificielle.
          </p>
          <p>
            Toute reproduction, distribution ou utilisation commerciale du site ou de ses contenus sans autorisation est interdite.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">4. Limitation de responsabilité</h2>
          <p>
            Les questions et explications générées par IA sont fournies à titre informatif et pédagogique uniquement.
            Elles peuvent contenir des erreurs. L&apos;éditeur ne saurait être tenu responsable d&apos;une utilisation
            de ces contenus dans un cadre autre qu&apos;éducatif.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">5. Données personnelles</h2>
          <p>
            Pour toute information sur le traitement de tes données personnelles, consulte notre{" "}
            <Link href="/confidentialite" className="text-indigo-600 hover:underline">
              politique de confidentialité
            </Link>.
          </p>
        </section>

        <Link href="/" className="inline-block text-indigo-600 hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
