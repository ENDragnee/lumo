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
import Image from 'next/image'; // Import Next Image for optimized images

// --- Constants for Fallback Images ---
const PLACEHOLDER_SVG_PATH = '/placeholder.svg'; // Ensure placeholder.svg is in /public
const PLACEHOLDER_AVATAR_PATH = '/placeholder-avatar.svg'; // Add a placeholder avatar

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
  tags?: string[];
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

// --- Creator Data Interface and Dummy Data ---
interface Creator {
    id: string;
    name: string;
    avatarUrl: string;
    profileUrl?: string; // Optional link to creator's profile/content
}

const featuredCreatorsData: Creator[] = [
    { id: 'creator-1', name: 'Kidus Goshu', avatarUrl: '/KG.png', profileUrl: '/creators/aris' },
    { id: 'creator-2', name: 'Mastwal Mesfin', avatarUrl: '/mm.png', profileUrl: '/creators/elara' },
    { id: 'creator-3', name: 'Matiyas Woldemariam', avatarUrl: '/mw.png', profileUrl: '/creators/ken' },
    { id: 'creator-4', name: 'Maya Lin', avatarUrl: '/ascii.png', profileUrl: '/creators/maya' },
    { id: 'creator-5', name: 'Sam Vector', avatarUrl: '/ascii.png', profileUrl: '/creators/sam' },
    // Add more creators if needed
];
// --- End Creator Data ---


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

const levelOfUnderstanding = [ "None", "Needs working", "Intermediate", "Good", "Excellent" ];
const getLevelOfUnderstanding = (progress: number) => {
  if (progress < 20) return levelOfUnderstanding[0];
  else if (progress < 40) return levelOfUnderstanding[1];
  else if (progress < 60) return levelOfUnderstanding[2];
  else if (progress < 80) return levelOfUnderstanding[3];
  else return levelOfUnderstanding[4];
}
const getLevelOfUnderstandingColor = (progress: number) => {
  if (progress < 20) return "text-red-500";
  else if (progress < 40) return "text-orange-500";
  else if (progress < 60) return "text-yellow-500";
  else if (progress < 80) return "text-green-500";
  else return "text-blue-500";
}

const LoadingSkeleton = () => {
  // Add skeleton for creators
  return (
    <div className="p-8">
       {/* Special Cards Skeleton */}
       <div className="mb-8">
           <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="h-36 rounded-lg bg-gray-200 dark:bg-gray-700 shimmer"></div>
                ))}
            </div>
       </div>

       {/* Creators Skeleton */}
       <div className="mb-8">
           <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 shimmer"></div>
           <div className="flex space-x-6 overflow-hidden">
               {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center flex-shrink-0">
                     <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mb-2 shimmer"></div>
                     <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                  </div>
               ))}
           </div>
       </div>

       {/* Learning Materials Skeleton */}
       <div>
           <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 shimmer"></div>
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
        /* Utility to hide scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
        }
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};


const CentralWorkspace = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  // const [rootBooks, setRootBooks] = useState<Book[]>([]); // Keep if needed, commented out based on structure
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // const [isBooksLoading, setIsBooksLoading] = useState(true); // Keep if needed
  const [isRecsLoading, setIsRecsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Commented out Book fetching if the section is removed/commented
  /*
  useEffect(() => {
    const fetchRootBooks = async () => {
      setIsBooksLoading(true);
      if (!fetchError) setFetchError(null);
      try {
        const res = await fetch("/api/drive?parentId=null&typeFilter=book");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch books (Status: ${res.status})`);
        }
        const data = await res.json();
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
  }, []);
  */

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsRecsLoading(true);
       if (!fetchError) setFetchError(null);
      try {
        const res = await fetch("/api/recommendations");
        if (!res.ok) {
             const errorData = await res.json().catch(() => ({}));
             throw new Error(errorData.error || `Failed to fetch recommendations (Status: ${res.status})`);
        }
        const data = await res.json();
        setSearchResults(
          (data || []).map((item: any) => ({
            _id: item._id,
            title: item.title || 'Untitled',
            thumbnail: item.thumbnail || '',
            subject: item.subject || 'General',
            institution: item.institution || 'Unknown',
            description: item.description || "",
            progress: item.progress,
            tags: item.tags || [],
          }))
        );
      } catch (err: any) {
        console.error("Recommendation Fetch Error:", err);
        if (!fetchError) { // Only set error if not already set by books fetch (if applicable)
          setFetchError(err.message || "Failed to load recommendations");
        }
        setSearchResults([]);
      } finally {
        setIsRecsLoading(false);
      }
    };

    fetchRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Adjust isLoading based on which fetches are active
    // setIsLoading(isBooksLoading || isRecsLoading); // Use this if books are fetched
    setIsLoading(isRecsLoading); // Use this if only recommendations are fetched
  }, [isRecsLoading]); // Add isBooksLoading here if used

  const handleBookCardClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleCardClick = (id: string) => {
    router.push(`/content?id=${id}`);
  };

  const handleSpecialCardClick = (path: string) => {
    router.push(path);
  }

  const handleCreatorClick = (profileUrl?: string) => {
      if (profileUrl) {
          router.push(profileUrl);
      } else {
          // Maybe show a toast or log that the profile is unavailable
          console.log("Creator profile URL not available.");
      }
  }

  // Handle image errors gracefully
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackPath: string) => {
      const target = e.currentTarget;
      if (target.src !== `${window.location.origin}${fallbackPath}`) {
          console.warn(`Failed to load image: ${target.src}. Falling back to ${fallbackPath}.`);
          target.onerror = null; // Prevent infinite loop if fallback fails
          target.src = fallbackPath;
      }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (fetchError && !isLoading) return <div className="p-8 text-center text-red-500">{`Error loading content: ${fetchError}`}</div>;

  const ContentCard = isMobile ? MobileCard : Card;
  const ContentCardContent = isMobile ? MobileCardContent : CardContent;


  // --- Featured Creators Section Component ---
  const FeaturedCreators = () => {
    if (featuredCreatorsData.length === 0) return null; // Don't render if no creators

    return (
        <div className="px-4 py-6 md:px-0 md:py-8"> {/* Consistent padding */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Featured Teachers</h2>
            {/* Scrollable container */}
            <div className="relative"> {/* Needed for potential scroll indicators if added later */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }} // Adjusted delay
                    className="flex space-x-5 md:space-x-8 overflow-x-auto pb-4 scrollbar-hide" // Added padding-bottom, scrollbar-hide utility
                >
                    {featuredCreatorsData.map((creator, index) => (
                        <motion.div
                            key={creator.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index + 0.3, duration: 0.4 }} // Staggered animation
                            whileHover={{ y: -4, scale: 1.03 }}
                            className="flex flex-col items-center flex-shrink-0 w-20 group cursor-pointer" // Fixed width for consistency
                            onClick={() => handleCreatorClick(creator.profileUrl)}
                        >
                            <div className="relative mb-2">
                                <Image
                                    src={creator.avatarUrl}
                                    alt={creator.name}
                                    width={128} // Specify size (e.g., w-16 = 64px)
                                    height={128} // Specify size (e.g., h-16 = 64px)
                                    className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-primary dark:group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-md"
                                    onError={(e) => handleImageError(e, PLACEHOLDER_AVATAR_PATH)}
                                />
                                {/* Optional: Online status indicator */}
                                {/* <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 ring-white ring-1"></span> */}
                             </div>
                            <p className="text-sm font-bold text-center text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                {creator.name}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
                {/* Optional: Add fade overlays for scroll indication if needed */}
            </div>
        </div>
    );
  }
  // --- End Featured Creators Section ---


  return (
    <div className="flex flex-col flex-auto p-4 pb-16 md:p-4 md:pb-4 overflow-y-auto dark:bg-gray-800 bg-white">
      <SearchForm />

      {/* (Optional) Regular Books Section - kept commented as per original */}
      {/* <div className="w-full px-4 md:px-0 pb-12 md:pb-24"> ... </div> */}

      {/* Special Cards Section */}
      <div className="px-4 py-4 md:px-0 md:py-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Featured Sections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-4 mb-8"> {/* Reduced gap for mobile */}
          {specialCardsData.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              className="h-full" // Make sure motion div takes height
            >
              <Card
                onClick={() => handleSpecialCardClick(card.path)}
                // Added flex flex-col to ensure content layout works correctly
                className={`cursor-pointer transition-all duration-300 overflow-hidden group h-full flex flex-col justify-between ${card.bgColor} ${card.textColor || 'text-white'} shadow-md hover:shadow-lg rounded-lg`} // Ensure rounded corners
              >
                {/* flex-grow pushes footer down */}
                <CardContent className="p-4 md:p-5 flex-grow">
                  <h3 className="font-bold text-base md:text-lg mb-1.5 group-hover:underline"> {/* Adjusted text size */}
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm opacity-90 line-clamp-2 md:line-clamp-3"> {/* Adjusted text size & clamp */}
                    {card.description}
                  </p>
                </CardContent>
                <CardFooter className="p-3 md:p-4 pt-0">
                   <div className="flex items-center justify-end w-full text-xs md:text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 ease-in-out">
                     Explore <ArrowRight className="ml-1.5 h-3.5 w-3.5 md:h-4 md:w-4" /> {/* Adjusted icon size */}
                   </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- INSERTED CREATORS SECTION --- */}
      <FeaturedCreators />
      {/* --- END CREATORS SECTION --- */}


      {/* Recommended For You Grid / Learning Materials */}
      <div className="w-full px-4 py-4 md:px-0 md:py-6 rounded-lg mb-0 md:mb-10">
         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Learning Materials</h2>
         {searchResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }} // Delay slightly after creators
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
            >
              {searchResults.map((item, index) => {
                 const currentProgress = item.progress ?? 0;
                 const understandingLevel = getLevelOfUnderstanding(currentProgress);
                 const progressColor = getLevelOfUnderstandingColor(currentProgress);

                 return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }} // Stagger after section animates
                      className="h-full flex"
                    >
                      <ContentCard
                        onMouseEnter={isMobile ? undefined : () => setHoveredCardId(item._id)}
                        onMouseLeave={isMobile ? undefined : () => setHoveredCardId(null)}
                        onClick={() => handleCardClick(item._id)}
                        className="w-full cursor-pointer transition-shadow duration-300 overflow-hidden group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col shadow-sm hover:shadow-md" // Added shadow consistency
                      >
                        {/* Image Container */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                           {/* Using Next Image for optimization */}
                           <Image
                                src={item.thumbnail ? `${process.env.NEXT_PUBLIC_CREATOR_URL || ''}${item.thumbnail}` : PLACEHOLDER_SVG_PATH}
                                alt={item.title}
                                layout="fill" // Use layout="fill" with parent having position relative & dimensions
                                objectFit="cover" // Like object-cover
                                className="transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => handleImageError(e, PLACEHOLDER_SVG_PATH)}
                            />
                           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content Area */}
                        <ContentCardContent className="p-3 md:p-4 flex flex-col flex-grow justify-between bg-gray-50 dark:bg-slate-800">
                          {/* Top part */}
                          <div className="flex-grow flex flex-col">
                            <p title={item.title} className="text-sm md:text-base font-medium line-clamp-2 group-hover:text-primary transition-colors duration-300 dark:text-gray-100 mb-1.5">
                              {item.title}
                            </p>
                            {/* Tags and Progress Container */}
                            <div className="flex flex-row items-end justify-between mt-auto pt-1"> {/* Use items-end and mt-auto */}
                              {/* Tags */}
                              {item.tags && item.tags.length > 0 && (
                                // Flex grow allows tags to take space, shrink prevents overflow, basis-0 starts small
                                <div className="flex flex-row flex-wrap gap-x-1 gap-y-1 mr-2 flex-grow flex-shrink basis-0 min-w-0">
                                  {item.tags.slice(0, isMobile ? 1 : 2).map((tag, tagIndex) => ( // Reduced tags shown slightly
                                    <span
                                      key={`${item._id}-tag-${tagIndex}`}
                                      className="inline-block text-xs px-1.5 py-0.5 dark:text-blue-300 bg-gray-200 dark:bg-slate-700 rounded-md text-gray-700 whitespace-nowrap"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {/* Progress Indicator - flex-shrink-0 prevents it shrinking */}
                              <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                <ResponsiveCircularProgress
                                    value={item.progress}
                                    levelOfUnderstanding={understandingLevel}
                                    color={progressColor}
                                    isHovered={hoveredCardId === item._id}
                                    alwaysShow={isMobile}
                                />
                              </div>
                            </div>
                          </div>
                        </ContentCardContent>
                      </ContentCard>
                    </motion.div>
                 );
              })}
            </motion.div>
          ) : (
            // No recommendations found message
            !isLoading && !fetchError && (
                <div className="text-center col-span-full py-10 text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-700 border-gray-300 rounded-lg">
                    No recommendations found at the moment. Explore other sections!
                </div>
            )
          )}
      </div>
      <Footer />
    </div>
  );
};

export default CentralWorkspace;