import { Plus, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface RightPanelProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  onCreateContent: () => void
}

const RightPanel = ({ isCollapsed, setIsCollapsed, onCreateContent }: RightPanelProps) => {
  return (
    <motion.div
      className="border-l border-gray-200 dark:border-gray-500 rounded-lg flex flex-col"
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 dark:text-dark-text hover:text-gray-700 dark:hover:text-white"
          >
            {isCollapsed ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            <button
              onClick={onCreateContent}
              className="mb-8 w-full bg-dark-highlight text-white rounded-lg py-2 px-4 flex items-center justify-center hover:bg-dark-highlight/90 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create Content
            </button>

            <div className="mb-8">
              <h3 className="font-medium text-lg mb-4 dark:text-dark-text">Collaborators</h3>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-accent" />
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-dark-accent" />
                  <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-dark-accent" />
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-200">+2 more</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4 dark:text-dark-text">AI Summary</h3>
              <button className="w-full bg-gray-100 dark:bg-blue-500 text-gray-700 dark:text-white rounded-lg py-2 px-4 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-dark-accent/90 transition-colors">
                <Users size={20} className="mr-2" />
                Generate Summary
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default RightPanel

