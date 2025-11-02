import React from "react";

interface VideoComponentViewerProps {
  src: string;
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
}

export const VideoComponentViewer: React.FC<VideoComponentViewerProps> = ({
  src,
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
      <video src={src} controls className="w-full h-full" />
    </div>
  );
};
