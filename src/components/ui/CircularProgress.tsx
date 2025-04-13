"use client";
import type React from "react";

interface ResponsiveCircularProgressProps {
  value: number;
  isHovered: boolean;
  alwaysShow?: boolean; // Optional prop to always show the SVG (e.g., on mobile)
}

export const ResponsiveCircularProgress: React.FC<ResponsiveCircularProgressProps> = ({
  value,
  isHovered,
  alwaysShow = false,
}) => {
  const radius = 16;
  const strokeWidth = 4;
  const viewBoxSize = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - value) / 100) * circumference;

  // Show SVG if alwaysShow is true (e.g., on mobile) or if hovered (on desktop)
  const showSVG = alwaysShow || isHovered;

  return (
    <div className="relative w-8 h-8 md:w-12 md:h-12">
      <svg
        className={`text-green-500 transition-opacity duration-300 ${
          showSVG ? "opacity-100" : "opacity-0"
        }`}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* Background circle */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke="currentColor"
        />
        {/* Progress circle */}
        <circle
          className="text-green-500"
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
        />
        {/* Text inside the circle */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
        >
          {value}%
        </text>
      </svg>
      {/* Fallback text when SVG is not shown */}
      {!showSVG && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] md:text-xs font-medium text-gray-500">{value}%</span>
        </div>
      )}
    </div>
  );
};

export default ResponsiveCircularProgress;