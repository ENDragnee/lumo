"use client"

import React from "react"
import { useNode } from "@craftjs/core"

interface CanvasComponent extends React.FC<{ children?: React.ReactNode }> {
  craft: {
    rules: {
      canMoveIn: () => boolean
    }
  }
}

export const ViewerCanvas: CanvasComponent = ({ children }) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  const isEmpty = React.Children.count(children) === 0

  return (
    <div
      ref={(ref) => {
        connect(drag(ref!))
      }}
      className="relative flex-1 h-full w-full p-0"
    >
      <div
        className={`relative h-full w-full rounded-lg ${
          isEmpty ? "border-2 border-dashed border-zinc-200" : ""
        }`}
      >
        {children}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Drag and drop elements here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

ViewerCanvas.displayName = "ViewerCanvas"

ViewerCanvas.craft = {
  rules: {
    canMoveIn: () => true,
  },
}

export default ViewerCanvas
