import { useCallback, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight, Sparkles, Clock, Star, BookOpen, Code, PenTool, Atom } from 'lucide-react'
import Link from 'next/link' // Import Link for Next.js
import { SerializedData, ApiResponse } from '@/types/serializedData';
import { useDebounce } from '@uidotdev/usehooks';

type PopularItem = {
  title: string
  description: string
  icon: React.ReactNode
  category: string
  link: string
}

const popularItems: PopularItem[] = [
  {
    title: "MOE Curriculum",
    description: "Learn the fundamentals of chemistry",
    icon: <Atom className="h-5 w-5" />,
    category: "MOE",
    link: "/moe"
  },
  {
    title: "AASTU Curriculum",
    description: "Understanding mechanics and energy",
    icon: <Sparkles className="h-5 w-5" />,
    category: "AASTU",
    link: "/aastu"
  },
]

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SerializedData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchSearchResults = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const result: ApiResponse<SerializedData[]> = await response.json();
      
      if (result.success && result.data) {
        setSearchResults(result.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchSearchResults(debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchSearchResults]);


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative max-w-2xl mx-auto mb-16">
        <Input
          type="text"
          placeholder="Search for lessons, modules, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-full border-gray-200 shadow-sm focus:border-lumo-accent focus:ring-lumo-accent"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      {searchQuery ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isSearching ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <Link key={item._id} href={`/content/${item._id}`} passHref>
                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-lumo-accent/10 rounded-lg">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div className="flex gap-2">
                            {item.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <CardTitle className="mt-4">
                          {JSON.parse(item.data).title}
                        </CardTitle>
                        <CardDescription>
                          {JSON.parse(item.data).description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No results found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Now</h2>
                <p className="text-lumo-muted mt-1">Trending topics and lessons</p>
              </div>
              <Button variant="ghost" className="text-lumo-accent hover:text-lumo-accent/90">
                View all <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item, index) => (
                <Link key={index} href={item.link} passHref>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-lumo-accent/10 rounded-lg">
                          {item.icon}
                        </div>
                        <span className="text-sm text-lumo-muted">{item.category}</span>
                      </div>
                      <CardTitle className="mt-4">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">More to Explore</h2>
                <p className="text-lumo-muted mt-1">Recommended for you</p>
              </div>
              <Button variant="ghost" className="text-lumo-accent hover:text-lumo-accent/90">
                View all <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Additional cards can be added here */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 

