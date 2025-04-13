// src/components/viewer/SimpleContainerViewer.tsx (Adjust path as needed)

import React from 'react';

interface SimpleContainerViewerProps {
  children?: React.ReactNode;
  // Add any other props passed to renderCanvas in the JSON if necessary (unlikely)
}

/**
 * A simple container used in the viewer to render the children
 * of the main canvas component (e.g., 'renderCanvas') defined in the editor.
 * It provides a basic block-level element for content flow.
 */
export const SimpleContainerViewer: React.FC<SimpleContainerViewerProps> = ({ children }) => {
  // Apply basic styles. 'w-full' ensures it takes up available width.
  // 'h-auto' lets its height be determined by its content.
  // No absolute positioning or fixed sizes here.
  return (
    <div className="w-full h-auto">
      {children}
    </div>
  );
};