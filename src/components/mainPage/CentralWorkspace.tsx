"use client"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useRouter } from 'next/navigation' // Updated import
import ContentRenderer from '@/components/contentRender'

const CentralWorkspace = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  interface SearchResult {
    _id: string;
    data: {
      thumbnail: string;
      title: string;
      description: string;
      progress: number;
      subject: string;
      institution: string;
    };
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const filters = ["Grade 12", "Video", "AASTU Curriculum", "Trending"]

  // useEffect(() => {
  //   const fetchSearchResults = async () => {
  //     if (searchQuery.length >= 2) {
  //       try {
  //         const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)
  //         if (!response.ok) throw new Error('Search failed')
  //         const data = await response.json()
  //         if (data.success) setSearchResults(data.data)
  //       } catch (error) {
  //         console.error('Error fetching search results:', error)
  //         setSearchResults([])
  //       }
  //     } else {
  //       setSearchResults([])
  //     }
  //   }

  //   const debounceTimer = setTimeout(fetchSearchResults, 500)
  //   return () => clearTimeout(debounceTimer)
  // }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleCardClick = (id: string) => {
    router.push(`/content?id=${id}`)
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
            className="w-full p-3 pl-12 rounded-lg border border-border dark:border-gray-400 dark:bg-slate-700 dark:text-dark-text focus:border-dark-highlight focus:ring focus:ring-dark-highlight focus:ring-opacity-50 transition duration-300 ease-in-out"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-text" />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="flex flex-grow items-center pr-32 justify-center mb-8 overflow-x-auto whitespace-nowrap">
        {filters.map((filter) => (
          <button
            key={filter}
            className="inline-block px-4 py-2 mr-2 rounded-lg dark:text-dark-text text-sm font-medium dark:hover:bg-blue-600 hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {searchResults.map((item) => (
          <div
            key={item._id}
            onClick={() => handleCardClick(item._id)}
            className="rounded-lg shadow-md overflow-y-auto overflow-x-hidden transform hover:translate-y-[-5px] hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
          >
            <div className="relative">
              <img
                src={item.data.thumbnail || "/placeholder.svg"}
                alt={item.data.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 w-12 h-12">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#5294e2"
                    strokeWidth="3"
                    strokeDasharray={`${item.data.progress}, 100`}
                  />
                  <text x="18" y="20" textAnchor="middle" fill="#5294e2" fontSize="10">
                    {item.data.progress}%
                  </text>
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-bold mb-2 dark:text-dark-text">{item.data.title}</h3>
              <p className="text-sm text-gray-600 dark:text-dark-text mb-4">{item.data.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-dark-highlight text-white text-xs font-bold px-2 py-1 rounded">{item.data.subject}</span>
                <span className="text-xs text-gray-500 dark:text-dark-text">{item.data.institution}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CentralWorkspace