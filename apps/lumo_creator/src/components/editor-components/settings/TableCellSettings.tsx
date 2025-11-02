"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { TableCellProps } from '../TableCellComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

export const TableCellSettings = () => {
  const {
    actions: { setProp },
    isHeader,
    backgroundColor,
    verticalAlign,
    padding,
  } = useNode<TableCellProps>((node) => ({
    isHeader: node.data.props.isHeader,
    backgroundColor: node.data.props.backgroundColor,
    verticalAlign: node.data.props.verticalAlign,
    padding: node.data.props.padding
  }));

  return (
    <Accordion type="multiple" defaultValue={['style']} className="w-full p-1">
      <AccordionItem value="style">
        <AccordionTrigger className="p-2">Cell Style</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <Label>Header Cell</Label>
            <Switch checked={isHeader} onCheckedChange={(val) => setProp((props: TableCellProps) => props.isHeader = val)} />
          </div>
          <div className="grid gap-2">
            <Label>Background Color</Label>
            <Input type="color" value={backgroundColor} onChange={e => setProp((props: TableCellProps) => props.backgroundColor = e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Vertical Align</Label>
            <RadioGroup value={verticalAlign} onValueChange={(val: 'top' | 'middle' | 'bottom') => setProp((props: TableCellProps) => props.verticalAlign = val)} className="grid grid-cols-3 gap-2 mt-2">
              <RadioGroupItem value="top" id="top" className="sr-only" /><Label htmlFor="top" className="flex items-center justify-center p-2 border rounded-md cursor-pointer [&:has([data-state=checked])]:border-primary">Top</Label>
              <RadioGroupItem value="middle" id="middle" className="sr-only" /><Label htmlFor="middle" className="flex items-center justify-center p-2 border rounded-md cursor-pointer [&:has([data-state=checked])]:border-primary">Middle</Label>
              <RadioGroupItem value="bottom" id="bottom" className="sr-only" /><Label htmlFor="bottom" className="flex items-center justify-center p-2 border rounded-md cursor-pointer [&:has([data-state=checked])]:border-primary">Bottom</Label>
            </RadioGroup>
          </div>
          <div>
            <Label>Padding: {padding}px</Label>
            <Slider value={[padding || 0]} onValueChange={([val]) => setProp((props: TableCellProps) => props.padding = val)} max={32} step={1} className="mt-2" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};