'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { Card, CardContent } from '@/components/ui/card';
import { MobileCard, MobileCardContent } from '@/components/ui/mobile-card';
import { formatRelativeDate } from '@/lib/format-date';
import { PenIcon, Book } from 'lucide-react';

const PLACEHOLDER_SVG_PATH = '/icons/default-content.png';

interface Thumbnail {
  _id: string;
  path: string;
}

interface ContentCardProps {
  item: {
    _id: string;
    title: string;
    thumbnail: string | Thumbnail;
    tags?: string[];
    isDraft: boolean;
    lastModifiedAt?: string | Date;
    createdAt?: string | Date;
    createdBy?: {
        _id: string;
        name: string;
    };
  };
  index: number;
  actionNode?: React.ReactNode; // New prop for action button
}

export function ContentCard({ item, index, actionNode }: ContentCardProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/studio/${item._id}`);
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
            src={typeof item.thumbnail === 'object'? item.thumbnail?.path: item.thumbnail}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => {
              item.thumbnail = PLACEHOLDER_SVG_PATH;
            }}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           {/* Action Button Slot */}
           <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                {actionNode}
           </div>

            <div className="absolute top-1 left-1 bg-secondary rounded-full">
              {
                item.isDraft ? <PenIcon /> : <Book />
              }
            </div>

        </div>
        <CardComponentContent className="p-3 md:p-4 flex flex-col flex-grow justify-between bg-gray-50 dark:bg-slate-800">
          <div className="flex-grow flex flex-col">
            <p title={item.title} className="text-sm md:text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300 dark:text-gray-100 mb-1">
              {item.title}
            </p>
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
            </div>

            {item.lastModifiedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last modified: {formatRelativeDate(item.lastModifiedAt)}
              </p>
            )}
          </div>
        </CardComponentContent>
      </CardComponent>
    </motion.div>
  );
}
