import React from "react";

export interface ImageComponentViewerProps {
  src?: string;
  alt?: string;
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
}

export const ImageComponentViewer: React.FC<ImageComponentViewerProps> = ({
  src = "/placeholder.svg",
  alt = "",
  x = 0,
  y = 0,
  width = "auto",
  height = "auto",
}) => {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
};
