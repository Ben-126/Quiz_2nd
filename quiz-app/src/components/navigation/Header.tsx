"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  titre?: string;
  showBack?: boolean;
  backHref?: string;
}

export default function Header({ titre, showBack, backHref }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            aria-label="Retour"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-700 hover:text-indigo-900">
          🎓 QuizSeconde
        </Link>
        {titre && (
          <>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium text-sm truncate">{titre}</span>
          </>
        )}
      </div>
    </header>
  );
}
