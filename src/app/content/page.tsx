"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ContentRenderer } from '@/components/contentRender'
import { restoreHighlights } from '@/utils/restoreHighlight'

export default function ContentPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [isContentLoaded, setIsContentLoaded] = useState(false)

  useEffect(() => {
    if (id && isContentLoaded) {
      const applyHighlights = async () => {
        try {
          await restoreHighlights(id)
        } catch (error) {
          console.error('Error applying highlights:', error)
        }
      }

      // Add a small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        applyHighlights()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [id, isContentLoaded])

  const handleContentLoaded = () => {
    setIsContentLoaded(true)
  }

  return (
    <div className="px-6 sm:px-6 sm:text-xs md:text-base py-6 max-w-4xl mx-auto text-justify">
      <header className="p-4 bg-white shadow-sm">
        {id ? (
          <ContentRenderer 
            id={id as string} 
            onContentLoaded={handleContentLoaded} 
          />
        ) : (
          <div className="p-4 text-red-500">Error: Missing content ID</div>
        )}
      </header>
    </div>
  )
}