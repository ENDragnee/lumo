import React from "react";

export interface SimulationComponentViewerProps {
  src: string;
  // Keep these props for consistency with saved data, but they are NOT used for positioning
  x?: number;
  y?: number;
  width?: number | string; // Optional: Could be used as a max-width hint
  height?: number | string; // Optional: Could be used to determine aspect ratio
}

export const SimulationComponentViewer: React.FC<SimulationComponentViewerProps> = ({
  src,
  // x, y are ignored in viewer
  // width, height are ignored for fixed sizing, aspect ratio handled by CSS
}) => {
  // Use a standard aspect ratio container (e.g., 4:3 often used for simulations, adjust if needed)
  // Calculate percentage: height / width * 100
  const aspectRatioPadding = '75%'; // Example: 4:3 aspect ratio (3/4 * 100 = 75)

  return (
    <div className="w-full my-4"> {/* Container for flow and spacing */}
      {/* Aspect Ratio Container */}
      <div className="relative w-full" style={{ paddingTop: aspectRatioPadding }}>
        <iframe
          src={src}
          className="absolute top-0 left-0 w-full h-full rounded-md"
          frameBorder="0" // Important for many simulation embeds
          allowFullScreen // Allow fullscreen
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

// No CraftJS specific properties for viewer components