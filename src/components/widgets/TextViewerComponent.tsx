import React from "react";

export interface TextViewerComponentProps {
  content: string;
  // Keep these props for consistency with saved data, but ignore x/y for flow
  x?: number;
  y?: number;
  width?: number | string; // Ignore for auto-width flow
  height?: number | string; // Ignore for auto-height flow
  alignment?: "left" | "center" | "right" | "justify";
  fontSize?: string;
}

export const TextViewerComponent: React.FC<TextViewerComponentProps> = ({
  content,
  // x, y, width, height are ignored for responsiveness
  alignment = "left",
  fontSize = "1rem", // Default to relative unit for base text size
}) => {
  return (
    // Use standard div for flow, apply alignment and font size via styles/classes
    // 'my-2' adds vertical margin for spacing between elements
    <div className="my-2 w-full" style={{ textAlign: alignment, fontSize: fontSize }}>
       {/* Use dangerouslySetInnerHTML ONLY IF the content is trusted HTML */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {/* If content is plain text, use this instead: */}
      {/* <div>{content}</div> */}
    </div>
  );
};

// No CraftJS specific properties for viewer components