"use client";

import { useState, useCallback, useMemo } from "react";
import { useNode } from "@craftjs/core";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { Editor, Transforms, createEditor, Descendant, Element } from "slate";
import { withHistory } from "slate-history";

interface TextWidgetProps {
  content: string;
  textType: "body" | "heading" | "subheading";
  editable?: boolean;
}

interface CustomElement {
  type: "paragraph" | "heading" | "subheading";
  children: CustomText[];
}

interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "Start typing..." }],
  },
];

const serialize = (value: Descendant[]) => JSON.stringify(value);
const deserialize = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return initialValue;
  }
};
export function TextWidget ({
  content: initialContent,
  textType: initialTextType,
} : TextWidgetProps
) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(deserialize(initialContent));
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
    content: node.data.props.content,
    textType: node.data.props.textType,
  }));

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "heading":
        return (
          <h1 className="text-2xl font-bold mb-2" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "subheading":
        return (
          <h2 className="text-xl font-semibold mb-2" {...props.attributes}>
            {props.children}
          </h2>
        );
      case "paragraph":
      default:
        return (
          <p className="text-base mb-2" {...props.attributes}>
            {props.children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return (
      <span
        {...props.attributes}
        className={`${props.leaf.bold ? "font-bold" : ""} 
                   ${props.leaf.italic ? "italic" : ""} 
                   ${props.leaf.underline ? "underline" : ""}`}
      >
        {props.children}
      </span>
    );
  }, []);


  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`relative min-w-[200px] min-h-[100px] ${
        selected ? "border-2 border-blue-500" : ""
      }`}
    >
      <div className="h-full p-2">
        <Slate editor={editor} initialValue={value}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="focus:outline-none"
            readOnly={true}
          />
        </Slate>
      </div>
    </div>
  );
}
// CraftJS wrapper component
export const CraftTextWidget = ({ content, textType }: TextWidgetProps) => {
  return <TextWidget content={content} textType={textType} />;
};

// CraftJS configuration for the component
CraftTextWidget.craft = {
  displayName: "Rich Text Widget",
  props: {
    content: serialize(initialValue),
    textType: "body",
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};

export const TextViewerComponent = ({ content, textType }: TextWidgetProps) => {
  return <TextWidget content={content} textType={textType} />;
};
