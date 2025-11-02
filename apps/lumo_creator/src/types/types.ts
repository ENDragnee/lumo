import type { Element as SlateElement } from "slate"

export interface CustomText {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export interface CustomElement extends SlateElement {
  type: "paragraph" | "heading" | "subheading"
  children: CustomText[]
  align: "left" | "center" | "right" | "justify"
}

export interface TextWidgetProps {
  content: string
  textType: "body" | "heading" | "subheading"
  editable?: boolean
}

export interface TextWidgetProps {
  content: string;
  textType: "body" | "heading" | "subheading";
  editable?: boolean;
}


export interface CustomElement {
  type: "paragraph" | "heading" | "subheading";
  children: CustomText[];
}


export interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}