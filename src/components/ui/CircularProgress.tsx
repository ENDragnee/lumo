"use client";
import type React from "react";

interface CircularProgressProps {
  value: number;
  isHovered: boolean; // New prop to control visibility
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ value, isHovered }) => {
  const radius = 16; // Radius of the circle
  const strokeWidth = 4; // Stroke width of the circle
  const viewBoxSize = radius * 2 + strokeWidth; // Adjust viewBox to include stroke width
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - value) / 100) * circumference;

  return (
    <div className="relative">
      <svg
        className={`w-12 h-12 text-green-500 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
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
      {/* Fallback text when not hovered */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-500">{value}%</span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;