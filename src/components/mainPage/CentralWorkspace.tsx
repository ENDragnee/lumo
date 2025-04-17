"use client";
import { useState, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react"; // Import ArrowRight for the special cards
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { ResponsiveCircularProgress } from "@/components/ui/CircularProgress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MobileCard, MobileCardContent, MobileCardFooter } from "@/components/ui/mobile-card";
import { useMediaQuery } from "react-responsive";
import SearchForm from "@/components/mainPage/SearchForm";

interface Content {
  _id: string;
  title: string;
  thumbnail: string;
  subject: string;
  institution: string;
  description?: string;
  progress?: number;
}

// Define the structure for our special cards
interface SpecialCardData {
  id: string;
  path: string;
  title: string;
  description: string;
  bgColor: string; // Tailwind class for background
  textColor?: string; // Optional: Tailwind class for text color (defaults usually work)
}

// Array defining the special cards
const specialCardsData: SpecialCardData[] = [
  {
    id: 'moe-card',
    path: '/moe', // Target route
    title: 'Ministry of Education (MoE)',
    description: 'Access official resources, curriculum, and exam materials.',
    bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700',
    textColor: 'text-white',
  },
  {
    id: 'aastu-card',
    path: '/aastu', // Target route
    title: 'AASTU Curriculum',
    description: 'Explore content specifically tailored for AASTU students.',
    bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600',
    textColor: 'text-white',
  },
  // Add more special cards here in the future
  // {
  //   id: 'grade12-card',
  //   path: '/grade-12',
  //   title: 'Grade 12 Focus',
  //   description: 'Dedicated resources for Grade 12 students.',
  //   bgColor: 'bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700',
  //   textColor: 'text-white',
  // }
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
  const [searchQuery, setSearchQuery] = useState(""); // Keep if SearchForm uses it internally
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  // const filters = ["Grade 12", "MoE", "AASTU Curriculum", "Trending"]; // Keep if filters are implemented elsewhere
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  // const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // Keep if filters are implemented elsewhere
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true); // Ensure loading state is true at the start
      try {
        const res = await fetch("/api/recommendations");
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setSearchResults(
          data.map((item: any) => ({
            _id: item._id,
            title: item.title,
            thumbnail: item.thumbnail,
            subject: item.subject,
            institution: item.institution,
            description: item.data?.description || "",
            progress: item.data?.progress || 0,
          }))
        );
        setError(""); // Clear any previous error
      } catch (err: any) {
        setError(err.message || "Failed to load recommendations");
        console.error(err);
        setSearchResults([]); // Clear results on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Handler remains the same if SearchForm manages its own state and submission logic
  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
  //   }
  // };

  const handleCardClick = (id: string) => {
    router.push(`/content?id=${id}`);
  };

  const handleSpecialCardClick = (path: string) => {
    router.push(path);
  }

  // const handleFilterClick = (filter: string) => {
  //   setSelectedFilter(filter === selectedFilter ? null : filter);
  //   // Add filter logic here if needed
  // };

  if (isLoading) return <LoadingSkeleton />;
  if (error && !isLoading) return <div className="p-8 text-center text-red-500">{error}</div>; // Show error only if not loading

  // Dynamically select Card or MobileCard based on screen size for regular content
  const ContentCard = isMobile ? MobileCard : Card;
  const ContentCardContent = isMobile ? MobileCardContent : CardContent;
  const ContentCardFooter = isMobile ? MobileCardFooter : CardFooter;

  return (
    <div className="flex flex-col flex-auto p-4 pb-16 md:p-4 md:pb-4 overflow-y-auto dark:bg-gray-800 bg-white">
      <SearchForm /> {/* Assuming SearchForm handles its own input state */}

      {/* Special Cards Section - Placed Above Main Content */}
      <div className="px-4 py-4 md:px-0 md:py-6"> {/* Add some padding */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Featured Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8"> {/* Responsive grid */}
          {specialCardsData.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} // Subtle lift on hover
              className="h-full" // Ensure motion div takes full height for consistent hover effect
            >
              {/* Use the standard Card component but apply custom styles */}
              <Card
                onClick={() => handleSpecialCardClick(card.path)}
                // Combine base classes with dynamic background and text color
                className={`cursor-pointer transition-all duration-300 overflow-hidden group h-full flex flex-col justify-between ${card.bgColor} ${card.textColor || 'text-white'} shadow-md hover:shadow-lg`}
              >
                <CardContent className="p-5 md:p-6 flex-grow"> {/* Added flex-grow */}
                  <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:underline">
                    {card.title}
                  </h3>
                  <p className="text-sm opacity-90 line-clamp-3"> {/* Limit description lines */}
                    {card.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0"> {/* Adjusted padding */}
                   <div className="flex items-center justify-end w-full text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 ease-in-out">
                     Explore <ArrowRight className="ml-1.5 h-4 w-4" />
                   </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      {/* End Special Cards Section */}


      {/* Main Content Grid */}
      {/* Removed outer container bg-zinc-100 to let the main container handle bg */}
      <div className="w-full px-4 py-4 md:px-0 md:py-6 rounded-lg mb-12 md:mb-24">
         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recommended For You</h2>
         {searchResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }} // Adjusted delay slightly
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" // Adjusted grid gaps
            >
              {searchResults.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }} // Slightly adjusted animation
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index + 0.2, duration: 0.3 }} // Staggered delay starting after special cards
                  className="h-full" // Ensure motion div takes full height
                >
                  {/* Use ContentCard for responsiveness */}
                  <ContentCard
                    onMouseEnter={isMobile ? undefined : () => setHoveredCardId(item._id)}
                    onMouseLeave={isMobile ? undefined : () => setHoveredCardId(null)}
                    onClick={() => handleCardClick(item._id)}
                    // Added explicit background for light/dark modes
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col h-full"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-t-lg"> {/* Rounded top corners */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${item.thumbnail}` || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => (e.currentTarget.src = '/placeholder.svg')} // Fallback image
                      />
                       {/* Optional: Add overlay on hover */}
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    {/* Ensure ContentCardContent allows flex grow */}
                    <ContentCardContent className="p-4 flex flex-col justify-between flex-grow">
                      <div> {/* Wrap text content */}
                        <h3 className="font-semibold text-base md:text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors duration-300 dark:text-gray-100">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                       {/* Footer is positioned absolutely relative to the Card */}
                       <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                         <span className="truncate pr-2">{item.institution}</span>
                         {item.progress !== undefined && item.progress > 0 && ( // Only show progress > 0
                           <ResponsiveCircularProgress value={item.progress} isHovered={hoveredCardId === item._id}/>
                         )}
                      </div>
                    </ContentCardContent>
                    {/* Footer removed from here - integrated into ContentCardContent */}
                  </ContentCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Display message if no recommendations are found (after loading and no error)
            !isLoading && !error && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
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