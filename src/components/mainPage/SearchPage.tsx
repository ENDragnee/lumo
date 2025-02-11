"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface ContentResult {
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

interface UserResult {
  _id: string;
  username: string;
  name: string;
  avatar: string;
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [contentResults, setContentResults] = useState<ContentResult[]>([])
  const [userResults, setUserResults] = useState<UserResult[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
        const { data } = await res.json()
        setContentResults(data?.content || [])
        setUserResults(data?.users || [])
      } catch (error) {
        console.error('Search failed:', error)
      }
    }
    
    if (query.length >= 2) fetchResults()
  }, [query])

  const handleContentClick = (id: string) => {
    router.push(`/content?id=${id}`)
  }

  const handleUserClick = (userId: string) => {
    router.push(`/creator/${userId}`)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="relative w-full md:w-2/3 mx-auto">
          <input
            type="text"
            placeholder="Search modules, quizzes, creators or books"
            defaultValue={query}
            className="w-full p-3 pl-12 rounded-lg border border-border dark:border-gray-400 dark:bg-slate-700 dark:text-dark-text focus:border-dark-highlight focus:ring focus:ring-dark-highlight focus:ring-opacity-50 transition duration-300 ease-in-out"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                router.push(`/search?query=${encodeURIComponent(e.currentTarget.value)}`)
              }
            }}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-text" />
        </div>
      </div>

      {/* User Results */}
      {userResults.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 dark:text-dark-text">Creators</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {userResults.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex flex-col items-center p-4 min-w-[140px] bg-white dark:bg-slate-700 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name[0].toUpperCase()}
                  className="w-16 h-16 rounded-full mb-2 object-cover"
                />
                <h3 className="font-bold dark:text-dark-text">{user.name}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-text">@{user.username}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content Results */}
      <section>
        <h2 className="text-xl font-bold mb-4 dark:text-dark-text">Learning Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentResults.map((item) => (
            <div
              key={item._id}
              onClick={() => handleContentClick(item._id)}
              className="bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={item.data.thumbnail || '/placeholder.svg'}
                alt={item.data.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2 dark:text-dark-text">{item.data.title}</h3>
                <p className="text-sm text-gray-600 dark:text-dark-text line-clamp-2">
                  {item.data.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                    {item.data.subject}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.data.institution}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* No Results */}
      {contentResults.length === 0 && userResults.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No results found for "{query}"
        </div>
      )}
    </div>
  )
}