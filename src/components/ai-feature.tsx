// @/components/ai-feature.tsx (Corrected)
"use client"

import { useState } from "react"
import { AIButton } from "@/components/ai-button"
import { AISidebar } from "@/components/ai-sidebar"

// Remove the style prop if no longer needed
// interface AIFeatureProps {
//   style?: React.CSSProperties;
// }

export default function AIFeature(/*{style}: AIFeatureProps*/) { // Remove style prop
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* The button is now rendered directly without the extra div */}
      <AIButton onClick={toggleSidebar} isOpen={isOpen} />
      <AISidebar isOpen={isOpen} onClose={closeSidebar} />
    </>
  )
}