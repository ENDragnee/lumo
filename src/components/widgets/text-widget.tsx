"use client";

import React from "react";

export function TextViewerComponent({
  content,
  x = 0,
  y = 0,
  width = "auto",
  height = "auto",
  alignment = "left",
  fontSize = "16px",
}: {
  content: string;
  x?: number;
  y?: number;
  width?: string;
  height?: string;
  alignment?: "left" | "center" | "right" | "justify";
  fontSize?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: width,
        height: height,
        textAlign: alignment,
        fontSize: fontSize
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

TextViewerComponent.craft = {
  displayName: "Text Viewer",
  props: {
    content: "Hello World",
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    alignment: "left",
    fontSize: "16px",
  }
};