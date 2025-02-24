"use client"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useRouter } from 'next/navigation'

interface Content {
  _id: string;
  title: string;
  thumbnail: string;
  subject: string;
  institution: string;
  description?: string;
  progress?: number;
}

const CentralWorkspace = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchResults, setSearchResults] = useState<Content[]>([])
  const filters = ["Grade 12", "Video", "AASTU Curriculum", "Trending"]

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/recommendations');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setSearchResults(data.map((item: any) => ({
          _id: item._id,
          title: item.title,
          thumbnail: item.thumbnail,
          subject: item.subject,
          institution: item.institution,
          description: item.data?.description || '',
          progress: item.data?.progress || 0
        })));
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
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  
  const handleCardClick = (id: string) => {
    router.push(`/content?id=${id}`)
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading recommendations...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-2/3 mx-auto">
          <input
            type="text"
            placeholder="Search modules, quizzes, creators or books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-12 rounded-lg border bg-gray-50 border-gray-100 dark:border-gray-400 dark:bg-slate-700 dark:text-[#5294e2] focus:border-zinc-100 focus:ring focus:ring-zinc-200 focus:ring-opacity-50 transition duration-300 ease-in-out"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-text" />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="flex flex-grow items-center justify-center">
        <div className="flex flex-grow items-center w-fit max-w-fit px-4 justify-center mb-8 overflow-x-auto whitespace-nowrap bg-gray-100 dark:bg-[#383c4a9f] rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter}
              className="inline-block px-4 py-2 rounded-lg dark:text-gray-300 text-sm font-medium dark:hover:bg-[#7c818c] hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#e2eaed3b] dark:bg-[#393e4960] dark:border-[#383c4a] w-full h-full px-4 py-8 rounded-xl">
        {/* YouTube-like grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg">
          {searchResults.map((item) => (
            <div
              key={item._id}
              onClick={() => handleCardClick(item._id)}
              className="cursor-pointer group dark:hover:bg-[#3337446c] hover:bg-zinc-200 rounded-md py-2 px-4"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-lg dark:text-dark-text line-clamp-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.institution}
                  </span>
                  {item.progress !== undefined && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {item.progress}% Complete
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CentralWorkspace