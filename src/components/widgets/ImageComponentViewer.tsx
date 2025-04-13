// components/viewer/ImageComponentViewer.tsx (Example Path)
import React from "react";

export interface ImageComponentViewerProps {
  // Keep props consistent with saved data
  src?: string;
  alt?: string;
  x?: number; // We'll likely ignore these for rendering flow
  y?: number; // We'll likely ignore these for rendering flow
  width?: number | string; // Keep this, maybe use as max-width hint
  height?: number | string; // Keep this, maybe use as max-height hint or for aspect ratio
}

export const ImageComponentViewer: React.FC<ImageComponentViewerProps> = ({
  src = "/placeholder.svg",
  alt = "",
  // x, y are ignored in this rendering strategy
  width, // The original width set by the creator
  // height is implicitly handled by 'h-auto' and aspect ratio
}) => {
  // --- Option 1: Simple Fluid Image ---
  // Ignores saved width/height mostly, scales to container
  // return (
  //   <div className="my-4"> {/* Add some margin for flow */}
  //     <img
  //       src={src}
  //       alt={alt}
  //       // max-w-full: prevents exceeding container width
  //       // h-auto: maintains aspect ratio automatically
  //       // object-contain: ensures the whole image is visible within its box
  //       className="block max-w-full h-auto object-contain mx-auto" // mx-auto to center if block
  //       draggable={false}
  //       loading="lazy" // Good practice for images
  //     />
  //   </div>
  // );

  // --- Option 2: Fluid Image respecting Creator's Max Width ---
  // Tries to respect the creator's intended size, but still scales down
  return (
    // Use a container div for better control and potential future styling
    // 'my-4' adds vertical margin when elements flow vertically
    <div className="my-4 w-full">
      <img
        src={src}
        alt={alt}
        className="block max-w-full h-auto object-contain mx-auto" // Basic responsive classes
        style={{
          // Set the creator's width as the *maximum* width in pixels.
          // The 'max-w-full' class will still override this if the container is smaller.
          maxWidth: typeof width === 'number' ? `${width}px` : width,
          // height: 'auto' is handled by className, no need for style height usually
        }}
        draggable={false}
        loading="lazy"
      />
    </div>
  );
};