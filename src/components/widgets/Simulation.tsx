"use client";

import React from "react";

interface SimulationViewerProps {
  src: string;
  x?: number;
  y?: number;
  width?: string | number;
  height?: string | number;
}

export const SimulationViewerComponent = ({
  src,
  x = 0,
  y = 0,
  width = "100%",
  height = 300
}: SimulationViewerProps) => {
  // Convert width and height to strings with px if they're numbers
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: widthStyle,
        height: heightStyle
      }}
    >
      <iframe
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        className="rounded-md"
      ></iframe>
    </div>
  );
};

SimulationViewerComponent.craft = {
  displayName: "Simulation Viewer",
  props: {
    src: "",
    x: 0,
    y: 0,
    width: "100%",
    height: 300
  }
};