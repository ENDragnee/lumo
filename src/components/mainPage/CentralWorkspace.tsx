"use client";
import { useState, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { ResponsiveCircularProgress } from "@/components/ui/CircularProgress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MobileCard, MobileCardContent, MobileCardFooter } from "@/components/ui/mobile-card";
import { useMediaQuery } from "react-responsive";
import SearchForm from "@/components/mainPage/SearchForm";
import { BookCard } from "@/components/cards/BookCard";

// --- Constants for Fallback Images ---
const PLACEHOLDER_SVG_PATH = '/placeholder.svg'; // Ensure placeholder.svg is in /public

interface Book {
  _id: string;
  title: string;
  thumbnail: string;
  description?: string;
  tags?: string[];
  genre?: string;
}

interface Content {
  _id: string;
  title: string;
  thumbnail: string;
  subject: string;
  institution: string;
  description?: string;
  progress?: number;
}

interface SpecialCardData {
  id: string;
  path: string;
  title: string;
  description: string;
  bgColor: string;
  textColor?: string;
}

const specialCardsData: SpecialCardData[] = [
  {
    id: 'moe-card',
    path: '/moe',
    title: 'Ministry of Education (MoE)',
    description: 'Access official resources, curriculum, and exam materials.',
    bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700',
    textColor: 'text-white',
  },
  {
    id: 'aastu-card',
    path: '/aastu',
    title: 'AASTU Curriculum',
    description: 'Explore content specifically tailored for AASTU students.',
    bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600',
    textColor: 'text-white',
  },
];

const LoadingSkeleton = () => {
  // ... (keep existing LoadingSkeleton code)
  return (
    <div className="p-8">
      {/* Optional: Add skeleton for special cards too */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-36 rounded-lg bg-gray-200 dark:bg-gray-700 shimmer"></div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="cursor-pointer group dark:hover:bg-[#3337446c] hover:bg-zinc-200 rounded-md py-2 px-4"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 shimmer" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full shimmer" />
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 shimmer" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(225, 225, 225, 0) 0%, rgba(225, 225, 225, 0.8) 50%, rgba(225, 225, 225, 0) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .dark .shimmer {
             background: linear-gradient(90deg, rgba(55, 65, 81, 0) 0%, rgba(55, 65, 81, 0.8) 50%, rgba(55, 65, 81, 0) 100%);
             background-size: 200% 100%;
             animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};


const CentralWorkspace = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rootBooks, setRootBooks] = useState<Book[]>([]);
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [isBooksLoading, setIsBooksLoading] = useState(true);
  const [isRecsLoading, setIsRecsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRootBooks = async () => {
      setIsBooksLoading(true);
      // Reset error *only* if recommendations haven't failed yet
      if (!fetchError) setFetchError(null);
      try {
        const res = await fetch("/api/drive?parentId=null&typeFilter=book");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch books (Status: ${res.status})`);
        }
        const data = await res.json();
        // Ensure thumbnail is at least an empty string
        const formattedBooks = (data.items || []).map((book: any) => ({
            ...book,
            thumbnail: book.thumbnail || ''
        }));
        setRootBooks(formattedBooks);
      } catch (err: any) {
        console.error("Book Fetch Error:", err);
        setFetchError(err.message || "Failed to load books");
        setRootBooks([]);
      } finally {
        setIsBooksLoading(false);
      }
    };

    fetchRootBooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsRecsLoading(true);
      // Reset error *only* if books haven't failed yet
       if (!fetchError) setFetchError(null);
      try {
        const res = await fetch("/api/recommendations");
        if (!res.ok) {
             const errorData = await res.json().catch(() => ({}));
             throw new Error(errorData.error || `Failed to fetch recommendations (Status: ${res.status})`);
        }
        const data = await res.json();
        setSearchResults(
          (data || []).map((item: any) => ({ // Ensure data is an array
            _id: item._id,
            title: item.title || 'Untitled', // Add fallback title
            thumbnail: item.thumbnail || '', // Ensure thumbnail is at least an empty string
            subject: item.subject || 'General', // Add fallback subject
            institution: item.institution || 'Unknown', // Add fallback institution
            description: item.data?.description || "",
            progress: item.data?.progress || 0,
          }))
        );
      } catch (err: any) {
        console.error("Recommendation Fetch Error:", err);
        // Don't overwrite book error if it exists
        if (!fetchError) {
          setFetchError(err.message || "Failed to load recommendations");
        }
        setSearchResults([]);
      } finally {
        setIsRecsLoading(false);
      }
    };

    fetchRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    setIsLoading(isBooksLoading || isRecsLoading);
  }, [isBooksLoading, isRecsLoading]);

  const handleBookCardClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleCardClick = (id: string) => {
    router.push(`/content?id=${id}`);
  };

  const handleSpecialCardClick = (path: string) => {
    router.push(path);
  }

  if (isLoading) return <LoadingSkeleton />;
  if (fetchError && !isLoading) return <div className="p-8 text-center text-red-500">{`Error loading content: ${fetchError}`}</div>;

  const ContentCard = isMobile ? MobileCard : Card;
  const ContentCardContent = isMobile ? MobileCardContent : CardContent;

  return (
    <div className="flex flex-col flex-auto p-4 pb-16 md:p-4 md:pb-4 overflow-y-auto dark:bg-gray-800 bg-white">
      <SearchForm />

      {/* Special Cards Section */}
      <div className="px-4 py-4 md:px-0 md:py-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Featured Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
          {specialCardsData.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              className="h-full"
            >
              <Card
                onClick={() => handleSpecialCardClick(card.path)}
                className={`cursor-pointer transition-all duration-300 overflow-hidden group h-full flex flex-col justify-between ${card.bgColor} ${card.textColor || 'text-white'} shadow-md hover:shadow-lg`}
              >
                <CardContent className="p-5 md:p-6 flex-grow">
                  <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:underline">
                    {card.title}
                  </h3>
                  <p className="text-sm opacity-90 line-clamp-3">
                    {card.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                   <div className="flex items-center justify-end w-full text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 ease-in-out">
                     Explore <ArrowRight className="ml-1.5 h-4 w-4" />
                   </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Regular Books Section */}
      <div className="w-full px-4 md:px-0 pb-12 md:pb-24">
         <h2 className="text-xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-gray-200">My Books</h2>
         {rootBooks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              {rootBooks.map((book, index) => (
                 <BookCard
                    key={book._id}
                    book={book}
                    onClick={handleBookCardClick}
                    index={index}
                 />
              ))}
            </motion.div>
          ) : (
            !isLoading && !fetchError && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-700 border-gray-300 rounded-lg">
                    You haven't created any books yet.
                </div>
            )
          )}
      </div>

      {/* Recommended For You Grid */}
      <div className="w-full px-4 py-4 md:px-0 md:py-6 rounded-lg mb-12 md:mb-24">
         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recommended For You</h2>
         {searchResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              {searchResults.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index + 0.2, duration: 0.3 }}
                  className="h-full"
                >
                  <ContentCard
                    onMouseEnter={isMobile ? undefined : () => setHoveredCardId(item._id)}
                    onMouseLeave={isMobile ? undefined : () => setHoveredCardId(null)}
                    onClick={() => handleCardClick(item._id)}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col h-full"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700"> {/* Added fallback bg */}
                      {/* Construct the primary source URL */}
                      {/* Ensure item.thumbnail is not empty before constructing URL */}
                      <img
                        src={item.thumbnail ? `${process.env.NEXT_PUBLIC_CREATOR_URL || ''}${item.thumbnail}` : PLACEHOLDER_SVG_PATH}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Only set fallback if the current src isn't already the fallback
                          if (e.currentTarget.src !== window.location.origin + PLACEHOLDER_SVG_PATH) {
                            console.warn(`Failed to load image: ${e.currentTarget.src}. Falling back to placeholder.`);
                            e.currentTarget.onerror = null; // Prevent future error triggers for this element
                            e.currentTarget.src = PLACEHOLDER_SVG_PATH; // Use constant
                            e.currentTarget.classList.add('image-fallback'); // Optional class for styling
                          }
                        }}
                      />
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <ContentCardContent className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-semibold text-base md:text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors duration-300 dark:text-gray-100">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                       <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                         <span className="truncate pr-2">{item.institution || 'General'}</span>
                         {item.progress !== undefined && item.progress > 0 && (
                           <ResponsiveCircularProgress value={item.progress} isHovered={hoveredCardId === item._id}/>
                         )}
                      </div>
                    </ContentCardContent>
                  </ContentCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !isLoading && !fetchError && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-700 border-gray-300 rounded-lg">
                    No recommendations found at the moment.
                </div>
            )
          )}
      </div>
      <Footer />
    </div>
  );
};

export default CentralWorkspace;