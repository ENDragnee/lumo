// components/cards/ContentCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { Card, CardContent } from '@/components/ui/card';
import { MobileCard, MobileCardContent } from '@/components/ui/mobile-card';
import { UnderstandingBadge } from '@/components/UnderstandingBadge';
import { DownloadButton } from "@/components/offline/DownloadButton";
import { formatRelativeDate } from '@/lib/format-date';
import Link from 'next/link';

// --- Constants for Fallback Images ---
const PLACEHOLDER_SVG_PATH = '/icons/default-content.png';

// --- Type Definitions ---
interface ContentCardProps {
  item: {
    _id: string;
    title: string;
    thumbnail: string;
    tags?: string[];
    contentType?: 'static' | 'dynamic';
    performance?: {
      understandingLevel: 'needs-work' | 'foundational' | 'good' | 'mastered';
    };
    lastAccessedAt?: string | Date;
    createdBy?: {
        _id: string;
        name: string;
    };
  };
  index: number;
}

export function ContentCard({ item, index }: ContentCardProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // State to manage image source for fallback mechanism
  const [imgSrc, setImgSrc] = useState(
    item.thumbnail 
      ? `${process.env.NEXT_PUBLIC_CREATOR_URL}${item.thumbnail}` 
      : PLACEHOLDER_SVG_PATH
  );

  // Effect to update image source if the item prop changes
  useEffect(() => {
    setImgSrc(
      item.thumbnail 
        ? `${process.env.NEXT_PUBLIC_CREATOR_URL}${item.thumbnail}` 
        : PLACEHOLDER_SVG_PATH
    );
  }, [item.thumbnail]);


  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/content/${item._id}`);
  };

  const CardComponent = isMobile ? MobileCard : Card;
  const CardComponentContent = isMobile ? MobileCardContent : CardContent;

  return (
    <motion.div
      key={item._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="h-full flex"
    >
      <CardComponent
        onClick={handleCardClick}
        className="w-full cursor-pointer transition-shadow duration-300 overflow-hidden group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col shadow-sm hover:shadow-lg"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          <Image
            src={imgSrc}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => {
              setImgSrc(PLACEHOLDER_SVG_PATH);
            }}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardComponentContent className="p-3 md:p-4 flex flex-col flex-grow justify-between bg-gray-50 dark:bg-slate-800">
          <div className="flex-grow flex flex-col">
            <p title={item.title} className="text-sm md:text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300 dark:text-gray-100 mb-1">
              {item.title}
            </p>
            
            {item.createdBy && (
              <Link
                href={`/creator/${item.createdBy._id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-sky-400 transition-colors w-fit"
              >
                by {item.createdBy.name}
              </Link>
            )}

            {item.lastAccessedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last accessed: {formatRelativeDate(item.lastAccessedAt)}
              </p>
            )}
            
            <div className="flex flex-row items-end justify-between mt-auto pt-2">
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-row flex-wrap gap-x-1.5 gap-y-1 mr-2 flex-grow flex-shrink basis-0 min-w-0">
                  {item.tags.slice(0, isMobile ? 1 : 2).map((tag, tagIndex) => (
                    <span key={tagIndex} className="inline-block text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded-md text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-end flex-shrink-0 space-x-2">
                 <div onClick={(e) => e.stopPropagation()}>
                    <DownloadButton contentId={item._id} />
                 </div>
                 {/* Replaced Circular Progress with Understanding Badge */}
                 <UnderstandingBadge level={item.performance?.understandingLevel} />
              </div>
            </div>
          </div>
        </CardComponentContent>
      </CardComponent>
    </motion.div>
  );
}
