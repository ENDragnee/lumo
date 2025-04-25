// components/cards/BookCard.tsx
import React, { useState } from 'react'; // Import useState
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Tag, Type } from "lucide-react";
import { motion } from "framer-motion";
import Image from 'next/image';

// Define the path for the default book SVG
// IMPORTANT: Ensure 'default-book.svg' is in the '/public/icons/' directory
const DEFAULT_BOOK_SVG_PATH = '/icons/default-book.svg';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    thumbnail: string; // Can be empty/null
    description?: string;
    tags?: string[];
    genre?: string;
  };
  onClick: (id: string) => void;
  index?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, index = 0 }) => {
  const MotionCard = motion(Card);
  // State to track if the primary image failed to load
  const [imgError, setImgError] = useState(false);

  // Determine the initial image source, handling potential absolute/relative paths and ensuring prefix
  const imageSrc = book.thumbnail
    ? book.thumbnail.startsWith('http') || book.thumbnail.startsWith('/')
      ? book.thumbnail
      : `${process.env.NEXT_PUBLIC_CREATOR_URL || ''}${book.thumbnail}` // Prefix relative paths
    : ''; // Use empty string if no thumbnail provided initially

  // Decide whether to render the Image component or the fallback directly
  // Render fallback if there's no initial imageSrc OR if an error occurred loading it.
  const showFallback = !imageSrc || imgError;

  return (
    <MotionCard
      key={book._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)" }}
      className="cursor-pointer overflow-hidden group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col h-full shadow-sm hover:border-blue-400 dark:hover:border-blue-600"
      onClick={() => onClick(book._id)}
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden rounded-t-lg">
        {showFallback ? (
          // Render the fallback SVG using a standard <img> tag
          // next/image isn't ideal for SVGs loaded this way unless configured specifically
          <img
            src={DEFAULT_BOOK_SVG_PATH}
            alt="Default book icon"
            className="w-16 h-16 text-blue-400 dark:text-blue-500 opacity-80 group-hover:scale-110 transition-transform duration-300"
            // Add an onError here too, just in case the default SVG itself fails (e.g., path typo)
            onError={(e) => {
                e.currentTarget.style.display = 'none'; // Hide the broken image element
                console.error(`Failed to load default book icon: ${DEFAULT_BOOK_SVG_PATH}`);
            }}
          />
          // Alternative: Render the Folder icon if the SVG fails or is preferred
          // <Folder className="w-16 h-16 text-blue-400 dark:text-blue-500 opacity-80 group-hover:scale-110 transition-transform duration-300" />
        ) : (
          // Render the next/image component if we have a valid source and no error yet
          <Image
            src={imageSrc} // Use the determined source
            alt={`${book.title} thumbnail`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" // Adjusted sizes example
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              // If the primary image fails, set the error state to true
              // This will trigger a re-render, showing the fallback defined above
              console.warn(`Failed to load book thumbnail: ${imageSrc}. Falling back to default.`);
              setImgError(true);
            }}
            // Optional: Add placeholder prop for better perceived loading
            // placeholder="blur"
            // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Example low-res placeholder
          />
        )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base md:text-lg line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 dark:text-gray-100">
          {book.title}
        </h3>
        {book.description && (
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mt-1">
            {book.description}
          </p>
        )}
         <div className="mt-auto pt-2 space-y-1">
             {book.genre && (
                 <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Type className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{book.genre}</span>
                 </div>
             )}
            {book.tags && book.tags.length > 0 && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                 <Tag className="h-3 w-3 mr-1.5 flex-shrink-0" />
                 <span className="truncate">{book.tags.join(', ')}</span>
              </div>
            )}
         </div>
      </CardContent>
    </MotionCard>
  );
};