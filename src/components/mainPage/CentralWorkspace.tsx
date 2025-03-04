'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
interface Content {
  _id: string;
  title: string;
  thumbnail: string;
  subject: string;
  institution: string;
  description?: string;
  progress?: number;
}

const LoadingSkeleton = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      {/* Shimmer animation styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(225, 225, 225, 0) 0%,
            rgba(225, 225, 225, 0.8) 50%,
            rgba(225, 225, 225, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

const CentralWorkspace = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const filters = ['Grade 12', 'MoE', 'AASTU Curriculum', 'Trending'];
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // Track selected filter

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/recommendations');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setSearchResults(
          data.map((item: any) => ({
            _id: item._id,
            title: item.title,
            thumbnail: item.thumbnail,
            subject: item.subject,
            institution: item.institution,
            description: item.data?.description || '',
            progress: item.data?.progress || 0,
          })),
        );
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  let handleCardClick = (id: string) => {
    router.push(`/content?id=${id}`);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  function handleFilterClick(filter: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="mb-8">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full md:w-2/3 mx-auto"
        >
          <div className="flex items-center gap-2 rounded-full bg-gray-200/80 dark:bg-gray-700/80 px-4 py-2">
            {/* <Menu className="h-5 w-5 text-gray-500" /> */}
            <input
              type="search"
              placeholder="Hinted search text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 dark:text-white/80"
            />
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <button type="submit" className="hidden">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-grow items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-4">
              {filters.map((filter, index) => (
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Badge
                    isSelected={selectedFilter === filter}
                    onClick={() => handleFilterClick(filter)}
                    className="rounded-full px-4 py-1 text-sm dark:border-[#383c4a9f] bg-transparent dark:text-white dark:hover:bg-transparent dark:hover:border-[#585f789f] font-normal cursor-pointer transition-colors"
                  >
                    {filter}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      </div>

      <div className="w-full h-full px-4 py-8 rounded-xl">
        {/* YouTube-like grid layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {searchResults.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <Card
                onMouseEnter={() => setHoveredCardId(item._id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => handleCardClick(item._id)} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group relative h-[300px]" // Fixed height
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.thumbnail || '/placeholder.svg'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Card Content */}
                <CardContent className="p-4 flex flex-col justify-between grow">
                  {' '}
                  {/* Flex column layout */}
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </CardContent>

                {/* Card Footer (Absolutely Positioned) */}
                <CardFooter className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-muted/50 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {item.institution}
                  </span>
                  {item.progress !== undefined && (
                    <CircularProgress
                      value={item.progress}
                      isHovered={hoveredCardId === item._id}
                    />
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CentralWorkspace;
