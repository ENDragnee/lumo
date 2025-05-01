// components/ui/CircularProgress.tsx (or your path)
"use client";
import type React from "react";

interface ResponsiveCircularProgressProps {
  value?: number | null; // Make value optional/nullable
  color?: string; // Optional color class (e.g., "text-green-500")
  levelOfUnderstanding?: string; // Keep for potential tooltips later, but don't render directly
  isHovered: boolean;
  alwaysShow?: boolean;
}

export const ResponsiveCircularProgress: React.FC<ResponsiveCircularProgressProps> = ({
  value,
  color = "text-gray-500", // Default color if none provided
  levelOfUnderstanding, // Prop received but not rendered here
  isHovered,
  alwaysShow = false,
}) => {
  // --- Value Handling ---
  // Ensure value is a number between 0 and 100, default to 0 if invalid/null/undefined
  const displayValue =
    typeof value === 'number' && Number.isFinite(value)
      ? Math.max(0, Math.min(100, Math.round(value))) // Clamp between 0-100 and round
      : 0; // Default to 0

  // --- SVG Calculations ---
  const radius = 16;
  const strokeWidth = 4;
  const viewBoxSize = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  // Calculate offset based on the validated displayValue
  const strokeDashoffset = ((100 - displayValue) / 100) * circumference;

  // Determine if the SVG or fallback text should be shown
  // Show SVG if alwaysShow is true, or if hovered (on desktop), or if value > 0
  // This ensures the 0% text fallback doesn't flash if alwaysShow is false and not hovered
  const showSVG = alwaysShow || isHovered || displayValue > 0;
  // Always show *something* (either SVG or fallback text)
  const showComponent = true; // Or simply remove conditions where it might hide entirely

  // Determine the color class to apply, using the prop or default
  const progressColorClass = color || "text-gray-500";

  return (
    // Main container with fixed size
    <div className="relative w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
      {/* SVG Element - Conditionally visible based on hover/alwaysShow */}
      <svg
        // Apply the determined color class here
        className={`${progressColorClass} transition-opacity duration-300 ${
          showSVG ? "opacity-100" : "opacity-0" // Control visibility via opacity
        }`}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        // Add ARIA attributes for accessibility
        role="progressbar"
        aria-valuenow={displayValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={levelOfUnderstanding || `Progress: ${displayValue}%`}
      >
        {/* Background Circle */}
        <circle
          className="text-gray-200 dark:text-gray-700" // Static background color
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke="currentColor" // Inherits color from parent SVG element
        />
        {/* Progress Arc */}
        <circle
          // Color applied via parent SVG's class
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke="currentColor" // Inherits color from parent SVG element
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }} // Smooth transition for value changes
        />
        {/* Percentage Text inside circle */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10" // Adjust font size as needed
          // Use the same color as the progress arc
          fill="currentColor" // Inherits color from parent SVG element
          className="font-medium" // Optional: make text bolder
        >
          {`${displayValue}%`}
        </text>
      </svg>

      {/* Fallback Text - Shown when SVG is hidden (opacity 0) */}
      {/* This ensures the 0% value is visible even when not hovered on desktop */}
      {!showSVG && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] md:text-xs font-medium ${progressColorClass}`}>
            {`${displayValue}%`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ResponsiveCircularProgress;