// components/viewer/text-viewer.tsx
import React from "react";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';    // <--- Import remark-math
import rehypeKatex from 'rehype-katex';  // <--- Import rehype-katex

// --- Props Interface --- (Keep as is)
export interface TextViewerComponentProps {
  content: string;
  width?: string | number;
  alignment?: "left" | "center" | "right" | "justify";
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  padding?: string | number;
  // x, y, height likely ignored
  x?: number;
  y?: number;
  height?: number | string;
}

export const TextViewerComponent: React.FC<TextViewerComponentProps> = ({
  content,
  width = "100%",
  alignment = "left",
  fontSize = "16px",
  color = "#333333",
  fontWeight = "normal",
  padding = "8px",
}) => {

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    textAlign: alignment,
    fontSize: fontSize,
    color: color,
    fontWeight: fontWeight,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    overflowWrap: 'break-word',
    lineHeight: 1.5,
    // Regarding "take as much space as it can":
    // width: '100%' already makes it take full available width.
    // Height will naturally adjust to the content size. If you need it
    // to fill a specific vertical space, the *parent* container should
    // use CSS like Flexbox or Grid to manage its children's heights.
    // Forcing height: '100%' here might cause overflow issues if the
    // parent doesn't handle it correctly.
  };

  return (
    <div style={containerStyle} className="my-2"> {/* my-2 adds vertical margin */}
       <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:text-gray-100">
         <ReactMarkdown
            // --- Add Math Plugins ---
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
                rehypeSanitize, // Sanitize first
                [rehypeKatex, { output: 'mathml' }] // Then render KaTeX. output: 'mathml' improves accessibility
            ]}
         >
            {content || ""}
         </ReactMarkdown>
       </div>
    </div>
  );
};