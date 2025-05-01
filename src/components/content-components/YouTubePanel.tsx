import YouTubeEmbed from "../YouTubeEmbed"

interface YouTubePanelProps {
  videoId: string
  title: string
}

const YouTubePanel = ({videoId, title}: YouTubePanelProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold font-inter mb-3 text-purple-700 dark:text-purple-300">
            {title}
        </h3>
        <YouTubeEmbed videoId={videoId} title={title} />
    </div>
  )
}

export default YouTubePanel
