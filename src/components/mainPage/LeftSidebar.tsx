import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface LeftSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [activeWorkspace, setActiveWorkspace] = useState("My Notes")

  const workspaces = [
    { name: "My Notes", icon: Star },
    { name: "Exam Prep", icon: Star },
  ]

  const recentItems = [
    { name: "Physics", icon: Star, timestamp: "2h ago" },
    { name: "Chemistry", icon: Star, timestamp: "5h ago" },
  ]

  const favoriteItems = [
    { name: "Math Quiz", tag: "urgent" },
    { name: "Biology Notes", tag: "completed" },
  ]

  return (
    <motion.div
      className="h-full bg-white dark:bg-dark-primary border-r border-gray-200 dark:border-dark-accent"
      initial={{ width: isCollapsed ? 80 : 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold dark:text-dark-text ${isCollapsed ? "hidden" : "block"}`}>Lumo</h2>
          <div className="flex items-center gap-2">
            {!isCollapsed && <ThemeToggle />}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-dark-text">
              {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={`text-sm font-semibold mb-2 dark:text-dark-text ${isCollapsed ? "hidden" : "block"}`}>
              Workspaces
            </h3>
            {workspaces.map((workspace) => (
              <button
                key={workspace.name}
                className={`flex items-center w-full p-2 rounded-md ${
                  activeWorkspace === workspace.name
                    ? "bg-dark-highlight text-white"
                    : "hover:bg-dark-secondary dark:text-dark-text"
                }`}
                onClick={() => setActiveWorkspace(workspace.name)}
              >
                <workspace.icon className="w-5 h-5 mr-2" />
                <span className={isCollapsed ? "hidden" : "block"}>{workspace.name}</span>
              </button>
            ))}
          </div>

          {!isCollapsed && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-2 dark:text-dark-text">Recent</h3>
                {recentItems.map((item) => (
                  <div key={item.name} className="flex items-center mb-2 dark:text-dark-text">
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.name}</span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-dark-text">{item.timestamp}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 dark:text-dark-text">Favorites</h3>
                {favoriteItems.map((item) => (
                  <div key={item.name} className="flex items-center mb-2 dark:text-dark-text">
                    <Star className="w-5 h-5 mr-2 text-dark-highlight" />
                    <span>{item.name}</span>
                    <span
                      className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        item.tag === "urgent" ? "bg-dark-highlight text-white" : "bg-dark-accent text-dark-text"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-auto">
          <div className={`flex items-center p-2 bg-dark-secondary rounded-md ${isCollapsed ? "hidden" : "block"}`}>
            <Sparkles className="w-5 h-5 mr-2 text-dark-highlight" />
            <input
              type="text"
              placeholder="Find resources about..."
              className="w-full bg-transparent border-none focus:outline-none text-sm dark:text-dark-text dark:placeholder-dark-text"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LeftSidebar

