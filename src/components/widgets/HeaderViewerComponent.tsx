// components/widget/HeaderViewerComponent.tsx (or your preferred location)
import React from "react";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

// --- Props Interface ---
// Matches HeaderProps from the editor component for styling consistency
export interface HeaderViewerComponentProps {
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

export const HeaderViewerComponent: React.FC<HeaderViewerComponentProps> = ({
  content,
  width = "100%",        // Default from HeaderComponent
  alignment = "center",      // Default from HeaderComponent
  fontSize = "24px",         // Default from HeaderComponent
  color = "#333333",         // Default from HeaderComponent (or inherit if needed)
  fontWeight = "bold",       // Default from HeaderComponent
  padding = "12px 8px",      // Default from HeaderComponent
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
    lineHeight: 1.4, // Match editor's base line height for header
  };

  return (
    // Apply container styles and optionally add margin for spacing
    <header style={containerStyle} className="my-4 dark:text-gray-200"> {/* Use <header> semantic tag */}
       {/* --- Markdown Rendering --- */}
       {/* Apply prose styles matching the HeaderComponent's display mode */}
       <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
         <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
         >
            {content || ""}
         </ReactMarkdown>
       </div>
    </header>
  );
};
