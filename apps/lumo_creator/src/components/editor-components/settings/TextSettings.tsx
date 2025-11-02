// @/components/editor-components/settings/TextSettings.tsx
"use client";

import { useNode } from "@craftjs/core";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Italic } from 'lucide-react';
import { TextProps } from "../TextComponent";
import { ColorPickerInput } from "@/components/editor-components/commons/ColorPickerInput";

const fontList = [
    { name: "Inter", cssName: "Inter" },
    { name: "Roboto", cssName: "Roboto" },
    { name: "Open Sans", cssName: "Open Sans" },
    { name: "Lato", cssName: "Lato" },
    { name: "Montserrat", cssName: "Montserrat" },
    { name: "Oswald", cssName: "Oswald" },
    { name: "Source Code Pro", cssName: "Source Code Pro" },
    { name: "Playfair Display", cssName: "Playfair Display" },
    { name: "Merriweather", cssName: "Merriweather" },
];

export const TextSettings = () => {

  const { actions: { setProp }, text, fontSize, fontFamily, alignment, fontWeight, fontStyle, tagName, color, backgroundColor } = useNode<TextProps>((node) => node.data.props as TextProps);

  return (
    <Accordion type="multiple" defaultValue={['content', 'typography', 'colors']} className="w-full px-1">
      <AccordionItem value="content">
        <AccordionTrigger className="p-2 text-sm">Content</AccordionTrigger>
        <AccordionContent className="p-2">
          <Textarea
            value={text}
            onChange={(e) => setProp((props: TextProps) => (props.text = e.target.value), 500)}
            rows={5}
            placeholder="Enter your text here. Supports Markdown."
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="typography">
        <AccordionTrigger className="p-2 text-sm">Typography</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Font Family</Label>
            <Select value={fontFamily} onValueChange={(value) => setProp((props: TextProps) => (props.fontFamily = value))}>
              <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
              <SelectContent>
                {fontList.map(font => (
                  <SelectItem key={font.name} value={font.cssName} style={{ fontFamily: font.cssName }}>{font.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
            <div>
              <Label>Type</Label>
              <Select value={tagName} onValueChange={(value) => setProp((props: TextProps) => (props.tagName = value as any))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Size</Label>
              <Input type="text" value={fontSize} onChange={(e) => setProp((props: TextProps) => (props.fontSize = e.target.value))} placeholder="e.g. 16px" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Weight</Label>
              <Select value={fontWeight} onValueChange={(value) => setProp((props: TextProps) => (props.fontWeight = value))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lighter">Lighter</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="semibold">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Style</Label>
              <ToggleGroup type="single" value={fontStyle} onValueChange={(value) => setProp((props: TextProps) => props.fontStyle = value as any)} className="w-full">
                <ToggleGroupItem value="normal" aria-label="Normal" className="w-full">Normal</ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Italic" className="w-full"><Italic className="h-4 w-4" /></ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <div>
            <Label>Alignment</Label>
            <ToggleGroup type="single" value={alignment} onValueChange={(value) => setProp((props: TextProps) => props.alignment = value as any)} className="w-full">
              <ToggleGroupItem value="left" aria-label="Left align" className="w-full"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center align" className="w-full"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right align" className="w-full"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
              <ToggleGroupItem value="justify" aria-label="Justify" className="w-full"><AlignJustify className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="colors">
        <AccordionTrigger className="p-2 text-sm">Colors & Spacing</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <ColorPickerInput label="Text Color" value={color || ''} onChange={(newColor) => setProp((props: TextProps) => (props.color = newColor))} placeholder="#333333" />
          <ColorPickerInput label="Background Color" value={backgroundColor || ''} onChange={(newColor) => setProp((props: TextProps) => (props.backgroundColor = newColor))} placeholder="transparent" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
