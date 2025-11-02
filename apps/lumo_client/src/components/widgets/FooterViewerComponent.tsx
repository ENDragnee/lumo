// components/widget/FooterViewerComponent.tsx (or your preferred location)
import React from "react";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

// --- Props Interface ---
// Matches FooterProps from the editor component for styling consistency
export interface FooterViewerComponentProps {
  content: string;
  width?: string | number;
  alignment?: "left" | "center" | "right" | "justify";
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  padding?: string | number;

  // Ignored props from potential saved editor state
  x?: number;
  y?: number;
  height?: number | string;
}

export const FooterViewerComponent: React.FC<FooterViewerComponentProps> = ({
  content,
  width = "100%",        // Default from FooterComponent
  alignment = "center",      // Default from FooterComponent
  fontSize = "12px",         // Default from FooterComponent
  color = "#666666",         // Default from FooterComponent
  fontWeight = "normal",     // Default from FooterComponent
  padding = "4px 8px",       // Default from FooterComponent
}) => {

  // --- Container Style ---
  // Apply base typography and layout settings from props
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    textAlign: alignment,
    fontSize: fontSize,
    color: color,
    fontWeight: fontWeight,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    overflowWrap: 'break-word', // Ensure long words break correctly
    lineHeight: 1.5, // Match editor's base line height for footer
  };

  return (
    // Apply container styles and optionally add margin for spacing
    <footer style={containerStyle} className="my-2 text-sm dark:text-gray-50"> {/* Use <footer> semantic tag */}
       {/* --- Markdown Rendering --- */}
       {/* Apply prose styles matching the FooterComponent's display mode (prose-sm) */}
       <div className="prose prose-sm max-w-none">
         <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
         >
            {content || ""}
         </ReactMarkdown>
       </div>
    </footer>
  );
};