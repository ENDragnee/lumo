"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { AccordionProps } from '../AccordionComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, DollarSign, MinusCircle, Lightbulb, Info, AlertTriangle, CheckCircle } from 'lucide-react';

// Centralized icon map. Export it so the component can use it too.
export const iconMap: { [key: string]: React.ElementType } = {
  FileText,
  DollarSign,
  MinusCircle,
  Lightbulb,
  Info,
  AlertTriangle,
  CheckCircle,
};

export const AccordionSettings = () => {
  const {
    actions: { setProp },
    title,
    icon,
    defaultOpen,
    accentColor,
    backgroundColor,
    padding,
  } = useNode<AccordionProps>((node) => node.data.props);

  return (
    <Accordion type="multiple" defaultValue={['general', 'style']} className="w-full p-1">
      <AccordionItem value="general">
        <AccordionTrigger className="p-2">General</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setProp((props: AccordionProps) => (props.title = e.target.value), 500)} />
          </div>
          <div className="grid gap-2">
            <Label>Icon</Label>
            <Select value={icon} onValueChange={(val) => setProp((props: AccordionProps) => (props.icon = val))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(iconMap).map(iconName => (
                  <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <Label>Open by Default</Label>
            <Switch checked={defaultOpen} onCheckedChange={(val) => setProp((props: AccordionProps) => props.defaultOpen = val)} />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="style">
        <AccordionTrigger className="p-2">Style</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-2">
            <Label>Accent Color</Label>
            <Input type="color" value={accentColor} onChange={(e) => setProp((props: AccordionProps) => (props.accentColor = e.target.value))} />
          </div>
           <div className="grid gap-2">
            <Label>Header Background</Label>
            <Input type="color" value={backgroundColor} onChange={(e) => setProp((props: AccordionProps) => (props.backgroundColor = e.target.value))} />
          </div>
          <div>
            <Label>Padding: {padding}px</Label>
            <Slider value={[padding || 0]} onValueChange={([val]) => setProp((props: AccordionProps) => (props.padding = val))} max={48} step={1} className="mt-2" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};