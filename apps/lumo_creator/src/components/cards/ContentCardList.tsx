'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatRelativeDate } from '@/lib/format-date';
import Link from 'next/link';

const PLACEHOLDER_SVG_PATH = '/icons/default-content.png';

interface Thumbnail {
  _id: string;
  path: string;
}

interface ContentCardListProps {
  item: {
    _id: string;
    title: string;
    thumbnail: string | Thumbnail;
    tags?: string[];
    lastAccessedAt?: string | Date;
    createdBy?: {
        _id: string;
        name: string;
    };
  };
  index: number;
  actionNode?: React.ReactNode; // New prop for action button
}

export function ContentCardList({ item, index, actionNode }: ContentCardListProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/studio/${item._id}`);
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
        className="group flex items-center gap-4 p-3 w-full cursor-pointer transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50"
      >
        <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
          <Image
            src={typeof item.thumbnail === 'object'? item.thumbnail?.path: item.thumbnail}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            onError={() => {
              item.thumbnail = PLACEHOLDER_SVG_PATH
            }}
          />
        </div>

        <div className="flex-grow min-w-0">
          <p title={item.title} className="text-sm font-semibold line-clamp-1 dark:text-gray-100 text-gray-800">
            {item.title}
          </p>
          {item.createdBy && (
              <Link
                href={`/studio/${item.createdBy._id}`}
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

        {/* Action Button Slot */}
        <div className="ml-auto opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex-shrink-0">
           {actionNode}
        </div>

      </div>
    </motion.div>
  );
}
