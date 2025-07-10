'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowLeftRight, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

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
  const router = useRouter();

  return (
    <div className="mt-12 flex justify-between items-center">
      {previous ? (
        <Button onClick={()=> router.push(previous)} variant="default">
          {t.prevChapter}
          <ArrowLeft className='mr-3 h-5 w-5' />
        </Button>
      ) : (
        <div /> // Empty div for alignment
      )}
      
      {next && (
        <Button onClick={()=> router.push(next)} variant="default" disabled={!isPassed}>
          {t.nextChapter}
          <ArrowRight className='mr-3 h-5 w-5' />
        </Button>
      )}
    </div>
  );
}
