// components/cards/ContentCard.tsx
'use client';

import React,{ useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { Card, CardContent } from '@/components/ui/card';
import { MobileCard, MobileCardContent } from '@/components/ui/mobile-card';
import { ResponsiveCircularProgress } from '@/components/ui/CircularProgress';
import { UnderstandingBadge } from '@/components/UnderstandingBadge';
import { DownloadButton } from "@/components/offline/DownloadButton"; // NEW: Import DownloadButton
import { formatRelativeDate } from '@/lib/format-date'; // NEW: Import date formatter

// --- Constants for Fallback Images ---
const PLACEHOLDER_SVG_PATH = '/placeholder.svg';

// --- Type Definitions ---
interface ContentCardProps {
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

export function ContentCard({ item, index }: ContentCardProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isHovered, setIsHovered] = useState(false);

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

  const CardComponent = isMobile ? MobileCard : Card;
  const CardComponentContent = isMobile ? MobileCardContent : CardContent;
  const currentProgress = item.progress ?? 0;

  return (
    <motion.div
      key={item._id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
      className="h-full flex"
    >
      <CardComponent
        onMouseEnter={isMobile ? undefined : () => setIsHovered(true)}
        onMouseLeave={isMobile ? undefined : () => setIsHovered(false)}
        onClick={() => handleCardClick(item._id)}
        className="w-full cursor-pointer transition-shadow duration-300 overflow-hidden group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col shadow-sm hover:shadow-md"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${item.thumbnail}` || PLACEHOLDER_SVG_PATH}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardComponentContent className="p-3 md:p-4 flex flex-col flex-grow justify-between bg-gray-50 dark:bg-slate-800">
          <div className="flex-grow flex flex-col">
            <p title={item.title} className="text-sm md:text-base font-medium line-clamp-2 group-hover:text-primary transition-colors duration-300 dark:text-gray-100 mb-2">
              {item.title}
            </p>
            <div className='mb-2'>
              <UnderstandingBadge level={item.performance?.understandingLevel} />
            </div>
             {/* NEW: Display Last Accessed Date */}
            {item.lastAccessedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                Last accessed: {formatRelativeDate(item.lastAccessedAt)}
              </p>
            )}
            
            <div className="flex flex-row items-end justify-between mt-auto pt-1">
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-row flex-wrap gap-x-1.5 gap-y-1 mr-2 flex-grow flex-shrink basis-0 min-w-0">
                  {item.tags.slice(0, isMobile ? 1 : 2).map((tag, tagIndex) => (
                    <span
                      key={`${item._id}-tag-${tagIndex}`}
                      className="inline-block text-xs px-1.5 py-0.5 dark:text-blue-300 bg-gray-200 dark:bg-slate-700 rounded-md text-gray-700 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
               {/* NEW: Actions section with Download button and Progress */}
              <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 space-x-2">
                 <div onClick={(e) => e.stopPropagation()}>
                    <DownloadButton contentId={item._id} />
                 </div>
                <ResponsiveCircularProgress
                  value={currentProgress}
                  isHovered={isHovered}
                  alwaysShow={isMobile}
                />
              </div>
            </div>
          </div>
        </CardComponentContent>
      </CardComponent>
    </motion.div>
  );
}
