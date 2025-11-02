"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { CalloutProps } from '../CalloutComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Slider } from '@/components/ui/slider';

export const CalloutSettings = () => {
  const {
    actions: { setProp },
    accentColor,
    backgroundColor,
    borderRadius,
    padding,
    borderWidth
  } = useNode<CalloutProps>((node) => node.data.props);

  return (
    <Accordion type="multiple" defaultValue={['style']} className="w-full p-1">
      <AccordionItem value="style">
        <AccordionTrigger className="p-2">Callout Style</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-2">
            <Label>Accent Color</Label>
            <Input type="color" value={accentColor} onChange={(e) => setProp((props: CalloutProps) => (props.accentColor = e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label>Background Color</Label>
            <Input type="color" value={backgroundColor} onChange={(e) => setProp((props: CalloutProps) => (props.backgroundColor = e.target.value))} />
          </div>
          <div>
            <Label>Border Radius: {borderRadius}px</Label>
            <Slider value={[borderRadius || 0]} onValueChange={([val]) => setProp((props: CalloutProps) => (props.borderRadius = val))} max={32} step={1} className="mt-2" />
          </div>
          <div>
            <Label>Padding: {padding}px</Label>
            <Slider value={[padding || 0]} onValueChange={([val]) => setProp((props: CalloutProps) => (props.padding = val))} max={64} step={1} className="mt-2" />
          </div>
           <div>
            <Label>Accent Width: {borderWidth}px</Label>
            <Slider value={[borderWidth || 0]} onValueChange={([val]) => setProp((props: CalloutProps) => (props.borderWidth = val))} max={16} step={1} className="mt-2" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};