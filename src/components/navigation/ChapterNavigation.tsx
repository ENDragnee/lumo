'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ChapterNavigationProps {
  previous?: string;
  next?: string;
  isPassed?: boolean;
  lang: 'am' | 'en';
}

const content = {
    am: {
        nextChapter: "ቀጣይ ምዕራፍ",
        prevChapter: "የቀድሞ ምዕራፍ",
    },
    en: {
        nextChapter: "Next Chapter",
        prevChapter: "Previous Chapter",
    }
}

export default function ChapterNavigation({ previous, next, isPassed = true, lang }: ChapterNavigationProps) {
  const t = content[lang];

  return (
    <div className="mt-12 flex justify-between items-center">
      {previous ? (
        <Link href={previous} passHref>
          <a className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
            <ArrowLeft className="mr-3 h-5 w-5" />
            {t.prevChapter}
          </a>
        </Link>
      ) : (
        <div /> // Empty div for alignment
      )}
      
      {next && (
        <Link href={next} passHref>
          <a
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              isPassed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={(e) => {
              if (!isPassed) {
                e.preventDefault();
              }
            }}
          >
            {t.nextChapter}
            <ArrowRight className="ml-3 h-5 w-5" />
          </a>
        </Link>
      )}
    </div>
  );
}
