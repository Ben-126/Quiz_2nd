import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et traitement des données personnelles de Révioria.",
  robots: { index: false, follow: false },
};

export default function PageConfidentialite() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-8 text-sm text-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Politique de confidentialité</h1>
          <p className="text-gray-500 mt-1">Dernière mise à jour : 28 avril 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles collectées sur Révioria est l&apos;éditeur du site,
            Ben Podrojsky, joignable à l&apos;adresse : <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">benpodrojsky@gmail.com</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">2. Données collectées et finalités</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left">Donnée</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Finalité</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Base légale</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Adresse email</td>
                  <td className="border border-gray-200 px-3 py-2">Authentification et identification du compte</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (création de compte)</td>
                  <td className="border border-gray-200 px-3 py-2">Jusqu&apos;à suppression du compte</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Pseudo</td>
                  <td className="border border-gray-200 px-3 py-2">Affichage dans le classement</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (création de compte)</td>
                  <td className="border border-gray-200 px-3 py-2">Jusqu&apos;à suppression du compte</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">XP, niveau, badges</td>
                  <td className="border border-gray-200 px-3 py-2">Suivi de la progression et gamification</td>
                  <td className="border border-gray-200 px-3 py-2">Intérêt légitime (service demandé)</td>
                  <td className="border border-gray-200 px-3 py-2">Jusqu&apos;à suppression du compte</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Résultats de quiz</td>
                  <td className="border border-gray-200 px-3 py-2">Affichage local de tes résultats</td>
                  <td className="border border-gray-200 px-3 py-2">Intérêt légitime (service demandé)</td>
                  <td className="border border-gray-200 px-3 py-2">Stocké localement — supprimé à la réinitialisation</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Adresse IP (technique)</td>
                  <td className="border border-gray-200 px-3 py-2">Limitation des requêtes (anti-abus)</td>
                  <td className="border border-gray-200 px-3 py-2">Intérêt légitime (sécurité)</td>
                  <td className="border border-gray-200 px-3 py-2">60 secondes max (Upstash Redis), non persistée</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Images de devoir (scan IA)</td>
                  <td className="border border-gray-200 px-3 py-2">Analyse par IA pour aide aux exercices</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (utilisation explicite de la fonctionnalité)</td>
                  <td className="border border-gray-200 px-3 py-2">Non stockée — transmise à Groq puis supprimée</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Audio (prononciation langues)</td>
                  <td className="border border-gray-200 px-3 py-2">Analyse de prononciation par IA</td>
                  <td className="border border-gray-200 px-3 py-2">Consentement (utilisation explicite de la fonctionnalité)</td>
                  <td className="border border-gray-200 px-3 py-2">Non stockée — transmise à Groq puis supprimée</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500">
            Actuellement, aucune donnée publicitaire ni de suivi comportemental n&apos;est collectée.
            Si des publicités sont introduites à l&apos;avenir, cette politique sera mise à jour et un nouveau
            consentement te sera demandé avant tout dépôt de cookies publicitaires.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">3. Utilisation de l&apos;intelligence artificielle</h2>
          <p>
            Révioria utilise l&apos;API <strong>Groq</strong> (Groq Inc., États-Unis) pour générer les questions de quiz,
            corriger les réponses et proposer des explications. Lorsque tu utilises le quiz, le <strong>thème du chapitre</strong> et
            le <strong>contenu pédagogique</strong> sont transmis à Groq pour générer les questions.
          </p>
          <p>
            <strong>Aucune donnée personnelle identifiable</strong> (email, pseudo, IP) n&apos;est transmise à Groq.
            Seul le contexte pédagogique (matière, chapitre, niveau scolaire) est envoyé pour les quiz.
          </p>
          <p>
            Pour les fonctionnalités <strong>Scan de devoir</strong> et <strong>Prononciation (Langues)</strong>,
            l&apos;image photographiée ou l&apos;enregistrement audio sont transmis à Groq pour analyse.
            Ces données ne sont pas stockées par Révioria ni par Groq au-delà du traitement immédiat.
          </p>
          <p>
            Ce transfert vers les États-Unis est encadré par les{" "}
            <a href="https://www.groq.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              clauses contractuelles types
            </a>{" "}
            acceptées par Groq (conformité RGPD).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">4. Sous-traitants et hébergeurs</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left">Prestataire</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Rôle</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Localisation</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Garanties</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Vercel Inc.</td>
                  <td className="border border-gray-200 px-3 py-2">Hébergement de l&apos;application</td>
                  <td className="border border-gray-200 px-3 py-2">USA / mondial (CDN)</td>
                  <td className="border border-gray-200 px-3 py-2">Clauses contractuelles types UE</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Supabase</td>
                  <td className="border border-gray-200 px-3 py-2">Base de données (comptes, profils)</td>
                  <td className="border border-gray-200 px-3 py-2">UE — Stockholm, Suède</td>
                  <td className="border border-gray-200 px-3 py-2">Serveur UE — pas de transfert hors UE</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Groq Inc.</td>
                  <td className="border border-gray-200 px-3 py-2">Génération IA (quiz, scan, prononciation)</td>
                  <td className="border border-gray-200 px-3 py-2">USA</td>
                  <td className="border border-gray-200 px-3 py-2">Clauses contractuelles types UE</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">Upstash Inc.</td>
                  <td className="border border-gray-200 px-3 py-2">Limitation des requêtes (rate limiting par IP)</td>
                  <td className="border border-gray-200 px-3 py-2">USA / EU</td>
                  <td className="border border-gray-200 px-3 py-2">Clauses contractuelles types UE — IP expirée en 60s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-base">5. Tes droits (RGPD)</h2>
          <p>Conformément au RGPD, tu disposes des droits suivants :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>Droit d&apos;accès</strong> — consulter toutes tes données depuis ton profil</li>
            <li><strong>Droit de rectification</strong> — modifier ton pseudo depuis les paramètres</li>
            <li><strong>Droit à l&apos;effacement</strong> — supprimer ton compte depuis les paramètres (suppression intégrale)</li>
            <li><strong>Droit d&apos;opposition</strong> — t&apos;opposer à un traitement basé sur l&apos;intérêt légitime</li>
            <li><strong>Droit à la portabilité</strong> — demander une copie de tes données par email</li>
            <li><strong>Droit à la limitation</strong> — demander la suspension d&apos;un traitement</li>
          </ul>
          <p>
            Pour exercer tes droits, contacte-nous à :{" "}
            <a href="mailto:benpodrojsky@gmail.com" className="text-indigo-600 hover:underline">benpodrojsky@gmail.com</a>.
            Nous répondons sous 30 jours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">6. Mineurs</h2>
          <p>
            Révioria est un service destiné aux lycéens, susceptible d&apos;être utilisé par des personnes de moins de 15 ans.
            Si tu as moins de 15 ans, l&apos;utilisation du service nécessite l&apos;accord d&apos;un parent ou tuteur légal.
          </p>
          <p>
            Nous ne collectons pas sciemment de données sur des enfants de moins de 13 ans.
            Si tu es parent et penses que ton enfant a créé un compte sans autorisation, contacte-nous pour suppression immédiate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">7. Sécurité</h2>
          <p>
            Tes données sont protégées par :
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Chiffrement HTTPS (TLS) sur toutes les communications</li>
            <li>Accès à la base de données limité via Row Level Security (Supabase)</li>
            <li>Aucune donnée sensible stockée en clair</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">8. Cookies et stockage local</h2>
          <p>
            Révioria n&apos;utilise pas de cookies publicitaires ou de tracking. Le stockage local (localStorage) est utilisé pour :
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Conserver ta session de connexion</li>
            <li>Stocker tes résultats de quiz localement</li>
            <li>Mémoriser tes préférences d&apos;affichage</li>
            <li>Enregistrer ton consentement à cette politique</li>
          </ul>
          <p>Ces données restent sur ton appareil et ne sont pas transmises à des tiers.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-800 text-base">9. Droit de réclamation</h2>
          <p>
            Si tu estimes que le traitement de tes données ne respecte pas le RGPD, tu as le droit de déposer une plainte
            auprès de la{" "}
            <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              CNIL (Commission Nationale de l&apos;Informatique et des Libertés)
            </a>.
          </p>
        </section>

        <Link href="/" className="inline-block text-indigo-600 hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
