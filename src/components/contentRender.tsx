'use client'

import { useEffect, useState } from 'react'
import { Editor, Frame } from '@craftjs/core'
import { viewerResolver } from '@/types/resolver'

const componentResolver = {
  div: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: any
  }) => <div {...props}>{children}</div>,
  ...viewerResolver,
}

// Wrap the Frame in a container that fills the available height
const EditorContent = ({ data }: any) => {
  return (
    <div className="h-full w-full">
      <Frame data={data} />
    </div>
  )
}

interface ContentRendererProps {
  id: string
  onContentLoaded?: () => void
}

export function ContentRenderer({ id, onContentLoaded }: ContentRendererProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [content, setContent] = useState(undefined)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/Deserialize?id=${id}`)
        if (!response.ok) throw new Error('Failed to fetch content')
        const responseData = await response.json()
        if (!responseData?.data) throw new Error('Invalid data structure')
        const parsedContent = JSON.parse(responseData.data)
        setContent(parsedContent)
      } catch (err) {
        console.error('Error loading content:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [id])

  // Notify parent component when content is loaded
  useEffect(() => {
    if (!loading && content && onContentLoaded) {
      // Small delay to ensure the content is rendered in the DOM
      const timer = setTimeout(() => {
        onContentLoaded()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [loading, content, onContentLoaded])

  if (loading)
    return <div className="p-4 text-gray-500 h-full">Loading...</div>
  if (error)
    return <div className="p-4 text-red-500 h-full">Error: {error}</div>
  if (!content)
    return <div className="p-4 text-gray-500 h-full">No content available</div>

  return (
    <div id="content" className="h-full w-full">
      <Editor
        enabled={false}
        resolver={componentResolver}
        onRender={({ render }) => render}
      >
        <EditorContent data={content} />
      </Editor>
    </div>
  )
}

export default ContentRenderer
