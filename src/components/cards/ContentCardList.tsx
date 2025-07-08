// components/cards/ContentCardList.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { UnderstandingBadge } from '@/components/UnderstandingBadge';
import { DownloadButton } from "@/components/offline/DownloadButton"; // NEW: Import DownloadButton
import { formatRelativeDate } from '@/lib/format-date'; // NEW: Import date formatter
import { MoreVertical, Star } from 'lucide-react';

// --- Constants for Fallback Images ---
const PLACEHOLDER_SVG_PATH = '/placeholder.svg';

// --- Type Definitions for props ---
interface ContentCardListProps {
  item: {
    _id: string;
    title: string;
    thumbnail: string;
    tags?: string[];
    progress?: number;
    performance?: {
      understandingLevel: 'needs-work' | 'foundational' | 'good' | 'mastered';
    };
    lastAccessedAt?: string | Date; // NEW: Added last accessed date
  };
  index: number;
}

export function ContentCardList({ item, index }: ContentCardListProps) {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    router.push(`/content/${id}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== `${window.location.origin}${PLACEHOLDER_SVG_PATH}`) {
      target.onerror = null;
      target.src = PLACEHOLDER_SVG_PATH;
    }
  };

  const currentProgress = item.progress ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="w-full"
    >
      <div
        onClick={() => handleCardClick(item._id)}
        className="flex items-center gap-4 p-3 w-full cursor-pointer transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50"
      >
        {/* Thumbnail */}
        <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
          <Image
            src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${item.thumbnail}` || PLACEHOLDER_SVG_PATH}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        {/* Main Info */}
        <div className="flex-grow min-w-0">
          <p title={item.title} className="text-sm font-semibold line-clamp-1 dark:text-gray-100 text-gray-800">
            {item.title}
          </p>
          {/* NEW: Display Last Accessed Date */}
          {item.lastAccessedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last accessed: {formatRelativeDate(item.lastAccessedAt)}
              </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <UnderstandingBadge level={item.performance?.understandingLevel} />
            {item.tags && item.tags.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 hidden sm:block">
                {item.tags.join(' · ')}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar and Score (visible on larger screens) */}
        <div className="hidden md:flex flex-col items-end w-40 flex-shrink-0">
          <div className="flex items-center w-full">
            <Progress value={currentProgress} className="h-1.5 w-full" />
            <span className="ml-2 text-xs font-mono text-gray-500 dark:text-gray-400 w-8 text-right">
              {currentProgress}%
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Progress</p>
        </div>
        
        {/* NEW: Updated Actions Menu */}
        <div className="flex-shrink-0 flex items-center">
           <div onClick={(e) => e.stopPropagation()}>
             <DownloadButton contentId={item._id} />
           </div>
           <button onClick={(e) => { e.stopPropagation(); console.log('Star clicked!'); }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
              <Star className="h-4 w-4 text-gray-400" />
           </button>
           <button onClick={(e) => { e.stopPropagation(); console.log('Menu clicked!'); }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
              <MoreVertical className="h-4 w-4 text-gray-500" />
           </button>
        </div>

      </div>
    </motion.div>
  );
}
