"use client"

export const dynamic = 'force-dynamic'; // This disables static pre-rendering

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import SearchForm  from '@/components/mainPage/SearchForm'


interface ContentResult {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  progress: number;
  subject: string;
  institution: string;
}

interface UserResult {
  _id: string;
  username: string;
  name: string;
  profileImage: string;
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [contentResults, setContentResults] = useState<ContentResult[]>([])
  const [userResults, setUserResults] = useState<UserResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/oldSearch?query=${encodeURIComponent(query)}`)
        const { data } = await res.json()
        setContentResults(data?.content || [])
        setUserResults(data?.users || [])
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length >= 2) {
      fetchResults()
    } else {
      setContentResults([])
      setUserResults([])
      setIsLoading(false)
    }
  }, [query])

  const handleContentClick = (id: string) => {
    router.push(`/content?id=${id}`)
  }

  const handleUserClick = (userId: string) => {
    router.push(`/creator?id=${userId}`)
  }

  const UserSkeleton = () => (
    <div className="flex flex-col items-center p-4 min-w-[140px] bg-white dark:bg-slate-700 rounded-lg shadow-md">
      <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 mb-2 animate-pulse"></div>
      <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 mb-1 animate-pulse"></div>
      <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
    </div>
  )

  const ContentSkeleton = () => (
    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-t-lg animate-pulse"></div>
      <div className="p-4">
        <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 mb-2 animate-pulse"></div>
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-600 mb-1 animate-pulse"></div>
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
          <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-full h-full p-4 mx-4 my-2 md:p-8">
      <SearchForm />

      {query.length < 2 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Search className="mx-auto mb-4 text-gray-400" size={48} />
          Please enter at least 2 characters to search.
        </div>
      ) : isLoading ? (
        <div>
          {/* User Skeletons */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 dark:text-dark-text">Creators</h2>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {[...Array(4)].map((_, i) => <UserSkeleton key={i} />)}
            </div>
          </section>
          {/* Content Skeletons */}
          <section>
            <h2 className="text-xl font-bold mb-4 dark:text-dark-text">Learning Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ContentSkeleton key={i} />)}
            </div>
          </section>
        </div>
      ) : (
        <div className='rounded-lg h-full max-h-full'>
          {/* User Results */}
          {userResults.length > 0 && (
            <section className="mb-8 scrollbar-none">
              <div className="flex justify-between items-center mb-4 bg-gray-100 dark:bg-slate-800 p-2 rounded-3xl">
                <h2 className="text-xl font-bold mb-4 dark:text-dark-text bg-gray-200 dark:bg-slate-800 p-2 rounded-3xl">Creators</h2>
                <span className="text-sm text-gray-500 mb-4 dark:text-dark-text bg-gray-200 dark:bg-slate-800 p-2 rounded-3xl">
                  {userResults.length} results
                </span>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 bg-gray-200 dark:bg-[#1E1E24] p-2 rounded-3xl">
                {userResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className="flex flex-col items-center p-4 min-w-[140px] bg-transparent hover:bg-gray-200 hover:dark:bg-slate-700 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-16 h-16 rounded-full mb-2 object-cover hove:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full mb-2 flex justify-center items-center bg-[#383c4a] text-white">
                        {user.name[0].toUpperCase()}
                      </div>
                    )}
                    <h3 className="font-bold dark:text-dark-text">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-text">@{user.username}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Content Results */}
          {contentResults.length > 0 && (
            <section className='rounded-lg h-full max-h-full scrollbar-none'>
              <div className="flex justify-between items-center mb-4 bg-gray-200 dark:bg-slate-800 p-2 rounded-3xl">
                <h2 className="text-xl font-bold mb-4 dark:text-dark-text  p-2 rounded-3xl">Learning Materials</h2>
                <span className="text-sm text-gray-500 dark:text-dark-text mb-4 rounded-3xl">
                  {contentResults.length} results
                </span>
              </div>
                <div className="items-center dark:bg-[#1E1E24] bg-gray-200 p-4 rounded-lg justify-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {contentResults.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleContentClick(item._id)}
                      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                      <img
                        src={item.thumbnail || '/placeholder.svg'}
                        alt={item.title}
                        className="w-full h-24 md:h-48 lg:h-48 object-cover rounded-t-lg hover:scale-y-105 transition-transform duration-300"
                      />
                      <div className="p-4 h-24 flex flex-col justify-between bg-gray-100 dark:bg-slate-800 rounded-b-lg">  
                        <h3 className="font-bold text-xs md:text-sm mb-2 dark:text-dark-text rounded-xl">{item.title}</h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-dark-text line-clamp-2 truncate">
                          {item.description}
                        </p>
                        <div className="flex flex-row justify-between items-center">
                          <span className="text-xs md:text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded truncate">
                            {item.subject}
                          </span>
                          <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                            {item.institution}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </section>
          )}

          {/* No Results */}
          {contentResults.length === 0 && userResults.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Search className="mx-auto mb-4 text-gray-400" size={48} />
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}