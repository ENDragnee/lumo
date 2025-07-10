// components/cards/ContentCardList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UnderstandingBadge } from '@/components/UnderstandingBadge';
import { DownloadButton } from "@/components/offline/DownloadButton";
import { formatRelativeDate } from '@/lib/format-date';
import { MoreVertical, Star } from 'lucide-react';
import Link from 'next/link';

// --- Constants for Fallback Images ---
const PLACEHOLDER_SVG_PATH = '/icons/default-content.png';

// --- Type Definitions for props ---
interface ContentCardListProps {
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

export function ContentCardList({ item, index }: ContentCardListProps) {
  const router = useRouter();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="w-full"
    >
      <div
        onClick={handleCardClick}
        className="flex items-center gap-4 p-3 w-full cursor-pointer transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50"
      >
        {/* Thumbnail */}
        <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
          <Image
            src={imgSrc}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            onError={() => {
              setImgSrc(PLACEHOLDER_SVG_PATH);
            }}
          />
        </div>

        {/* Main Info */}
        <div className="flex-grow min-w-0">
          <p title={item.title} className="text-sm font-semibold line-clamp-1 dark:text-gray-100 text-gray-800">
            {item.title}
          </p>
          {item.createdBy && (
              <Link
                href={`/creator/${item.createdBy._id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-gray-500 dark:text-gray-400 mt-1 hover:text-primary dark:hover:text-sky-400 transition-colors w-fit"
              >
                by {item.createdBy.name}
              </Link>
          )}
          {item.lastAccessedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last accessed: {formatRelativeDate(item.lastAccessedAt)}
              </p>
          )}
        </div>

        {/* Understanding Badge (replaces progress bar) */}
        <div className="hidden sm:block flex-shrink-0 mx-4">
            <UnderstandingBadge level={item.performance?.understandingLevel} />
        </div>
        
        {/* Actions Menu */}
        <div className="flex-shrink-0 flex items-center ml-auto">
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
