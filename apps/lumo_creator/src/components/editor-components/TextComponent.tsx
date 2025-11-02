// @/components/editor-components/TextComponent.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNode, useEditor, Node as CraftNode } from "@craftjs/core";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { TextSettings } from "./settings/TextSettings";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { useFontManager } from "@/contexts/FontProvider";

export interface TextProps {
  text: string;
  width?: string | number;
  alignment?: "left" | "center" | "right" | "justify";
  fontFamily?: string; 
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
  fontStyle?: "normal" | "italic";
  padding?: string | number;
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

interface CraftableComponent extends React.FC<TextProps> {
  craft?: {
    displayName: string;
    props: Partial<TextProps>;
    related?: {
      settings: React.ComponentType<any>;
    };
    rules?: {
      canDrag?: (node: CraftNode) => boolean;
    };
  };
}

const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

export const TextComponent: CraftableComponent = ({
  text = "Edit me!",
  alignment = "left",
  fontFamily = "Inter",
  fontSize = "16px",
  color = "inherit",
  backgroundColor = "transparent",
  fontWeight = "normal",
  fontStyle = "normal",
  width = "100%",
  padding = "8px",
  tagName = "p",
}) => {
  const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
  
  const { actions: editorActions, selected, enabled: editorEnabled } = useEditor((state, query) => ({
      selected: query.getEvent('selected').contains(id),
      enabled: state.options.enabled,
  }));

  const { addFont } = useFontManager(); // Get the function to register fonts
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (fontFamily) {
      addFont(fontFamily);
    }
  }, [fontFamily, addFont]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      textarea.select();
      requestAnimationFrame(() => adjustTextareaHeight(textarea));
    }
  }, [isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProp((props: TextProps) => { props.text = e.target.value; }, 0);
    adjustTextareaHeight(e.target);
  };
  
  const handleFinishEditing = useCallback(() => setIsEditing(false), []);

  const handleRemove = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      editorActions.delete(id);
    }, [editorActions, id]);

  const rootStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    position: "relative",
    padding: typeof padding === "number" ? `${padding}px` : padding,
  };

  const textStyle: React.CSSProperties = {
    width: "100%",
    textAlign: alignment,
    fontSize: fontSize,
    color: color === "inherit" ? undefined : color,
    backgroundColor: backgroundColor,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    lineHeight: 1.5,
  };

  const CustomTag = tagName;

  return (
    // --- FIX: Use the ref callback pattern for the `connect` connector ---
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      style={rootStyle}
      className={cn(
        "text-component-wrapper relative",
        editorEnabled && "cursor-pointer",
        selected && editorEnabled && "outline-dashed outline-2 outline-blue-500 outline-offset-2"
      )}
      onClick={() => { if (editorEnabled && selected) setIsEditing(true); }}
    >
      {isEditing && editorEnabled ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextareaChange}
          onBlur={handleFinishEditing}
          style={{...textStyle, outline: 'none', resize: 'none', border: 'none', background: 'rgba(240, 240, 240, 0.5)', overflowY: 'hidden'}}
          onClick={(e) => e.stopPropagation()}
          rows={1}
        />
      ) : (
        <CustomTag style={textStyle} className="craft-markdown-display prose max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeKatex]} remarkPlugins={[remarkGfm, remarkMath]}>
            {text || "Empty Text"}
          </ReactMarkdown>
        </CustomTag>
      )}

      {selected && editorEnabled && (
        <>
            {/* --- FIX: Use the ref callback pattern for the `drag` connector --- */}
            <div 
              ref={(ref) => { if (ref) drag(ref); }}
              className="absolute top-1/2 -left-2 -translate-x-full -translate-y-1/2 bg-blue-500 text-white p-1 rounded-l-md cursor-move opacity-80 hover:opacity-100"
            >
                <GripVertical size={20} />
            </div>
            <Button variant="destructive" size="icon" className="absolute top-0 right-0 z-10 h-6 w-6 -translate-y-1/2 translate-x-1/2" onMouseDown={(e) => { e.stopPropagation(); }} onClick={handleRemove}>
                <Trash2 className="h-3 w-3" />
            </Button>
        </>
      )}
    </div>
  );
};

TextComponent.craft = {
  displayName: "Text",
  props: {
    text: "This is a new text block. Click to edit.",
    tagName: "p",
    fontFamily: "Inter",
    fontSize: "16px",
    alignment: "left",
    color: "#333333",
    backgroundColor: "transparent",
    fontWeight: "normal",
    fontStyle: "normal",
  } satisfies Partial<TextProps>,
  related: {
    settings: TextSettings,
  },
  rules: {
    canDrag: () => true,
  },
};
