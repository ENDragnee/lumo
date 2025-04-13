import React from "react";

export interface VideoComponentViewerProps {
  src: string;
  // Keep these props for consistency with saved data, but they are NOT used for positioning
  x?: number;
  y?: number;
  width?: number | string; // Optional: Could be used as a max-width hint if needed
  height?: number | string; // Optional: Could be used to determine aspect ratio if not standard
}

export const VideoComponentViewer: React.FC<VideoComponentViewerProps> = ({
  src,
  // x, y are ignored in viewer
  // width, height are ignored for fixed sizing, aspect ratio handled by CSS
}) => {
  // Simple aspect ratio container (16:9 default) using padding-bottom hack
  // For aspect ratio CSS property, see commented out example
  const isExternalUrl = src.startsWith('http://') || src.startsWith('https://');

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
    
    if (url.includes('/embed/') || url.includes('/player/')) {
      return url;
    }
    
    return url;
  };

  return (
    <div className="w-full my-4"> {/* Container for flow and spacing */}
      {/* Aspect Ratio Container (16:9) */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
      {/* Alternative using modern CSS aspect-ratio property (if supported) */}
      {/* <div className="w-full aspect-video"> */}
        {isExternalUrl ? (
          <iframe
            src={getEmbedUrl(src)}
            className="absolute top-0 left-0 w-full h-full rounded-md"
            style={{ border: "none" }}
            allowFullScreen
            // Add 'allow' attributes if needed (e.g., for specific permissions)
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        ) : (
          <video
            src={src}
            controls
            className="absolute top-0 left-0 w-full h-full rounded-md"
          />
        )}
      </div>
    </div>
  );
};

// No CraftJS specific properties for viewer components