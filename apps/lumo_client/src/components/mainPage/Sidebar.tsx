import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Book, Star } from 'lucide-react'

type Module = {
  id: string
  title: string
  icon: 'book' | 'star'
}

const recentModules: Module[] = [
  { id: '1', title: 'Introduction to Physics', icon: 'book' },
  { id: '2', title: 'Advanced Mathematics', icon: 'book' },
  { id: '3', title: 'World History', icon: 'book' },
]

const favoriteModules: Module[] = [
  { id: '4', title: 'Chemistry 101', icon: 'star' },
  { id: '5', title: 'English Literature', icon: 'star' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  }

  const IconComponent = ({ icon }: { icon: 'book' | 'star' }) => {
    return icon === 'book' ? <Book size={16} /> : <Star size={16} />
  }

  return (
    <div className='z-50'>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 text-white hover:text-[#5294E2] transition-colors duration-300"
      >
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            open: { rotate: 90 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-current"></div>
              <div className="w-6 h-0.5 bg-current"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </div>
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-[#404552] to-[#383C4A] text-white z-40 overflow-y-auto"
          >
            <div className="p-4 space-y-6">
              <div className="flex flex-col items-center">
                <button className="w-16 h-16 bg-[#5294E2] rounded-full flex items-center justify-center shadow-lg hover:bg-[#4A84C8] transition-colors duration-300">
                  <Plus size={32} />
                </button>
                <span className="mt-2 text-sm">Add New Content</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recently Opened</h3>
                <ul className="space-y-2">
                  {recentModules.map((module) => (
                    <li key={module.id}>
                      <a
                        href="#"
                        className="flex items-center space-x-2 p-2 rounded hover:bg-[#4B5162] hover:text-[#5294E2] transition-colors duration-300"
                      >
                        <IconComponent icon={module.icon} />
                        <span>{module.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Favorites</h3>
                <ul className="space-y-2">
                  {favoriteModules.map((module) => (
                    <li key={module.id}>
                      <a
                        href="#"
                        className="flex items-center space-x-2 p-2 rounded hover:bg-[#4B5162] hover:text-[#5294E2] transition-colors duration-300"
                      >
                        <IconComponent icon={module.icon} />
                        <span>{module.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  )
}

