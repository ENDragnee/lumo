"use client"

import { useState } from "react"
import { Expand } from "lucide-react"

interface SimulationPanelProps {
  title: string
  description?: string
  simulationUrl: string
}

const SimulationPanel = ({ title, description, simulationUrl }: SimulationPanelProps) => {
  // We'll use a context or a global modal state manager in a real app
  // For this component, we'll use a callback approach
  const [isModalOpen, setIsModalOpen] = useState(false)

  // This function will be passed to the parent component via onExpand
  const handleExpand = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold font-inter mb-3 text-center">{title}</h3>
      {description && (
        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">{description}</p>
      )}
      <div className="relative">
        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
          <iframe src={simulationUrl} className="absolute top-0 left-0 w-full h-full" allowFullScreen title={title}>
            <p className="text-light-gray text-center pt-10">Loading Simulation...</p>
          </iframe>
        </div>
        <button
          onClick={handleExpand}
          className="absolute bottom-2 right-2 hover:bg-purple-600 dark:bg-purple-400 bg-purple-400 rounded-full p-2 text-white"
          aria-label="Expand simulation"
        >
          <Expand size={16} />
        </button>
      </div>

      {/* Modal handling - this will be rendered by the parent component */}
      {isModalOpen && (
        <SimulationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          simulationUrl={simulationUrl}
        />
      )}
    </div>
  )
}

// This is a simplified modal component that can be used directly within SimulationPanel
// In a real app, you'd likely use your existing Modal component
interface SimulationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  simulationUrl: string
}

const SimulationModal = ({ isOpen, onClose, title, simulationUrl }: SimulationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">
          {title}
        </h2>
        <div className="relative w-full h-[70vh] overflow-hidden border dark:border-gray-600 rounded bg-black">
          <iframe src={simulationUrl} className="absolute top-0 left-0 w-full h-full" allowFullScreen title={title}>
            <p className="text-light-gray text-center pt-10">Loading Simulation...</p>
          </iframe>
        </div>
      </div>
    </div>
  )
}

export default SimulationPanel
