"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { TabPanelProps } from '../TabPanelComponent';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export const TabPanelSettings = () => {
  const {
    actions: { setProp },
    title,
    isClosable,
    padding,
  } = useNode<TabPanelProps>((node) => ({
    // FIX: Be explicit about the props being selected to satisfy TypeScript
    title: node.data.props.title,
    isClosable: node.data.props.isClosable,
    padding: node.data.props.padding,
  }));

  return (
    <Accordion type="multiple" defaultValue={['general', 'style']} className="w-full p-1">
      <AccordionItem value="general">
        <AccordionTrigger className="p-2">General</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-2">
            <Label>Tab Title</Label>
            <Input
              value={title}
              // FIX: Add explicit type to the 'props' parameter
              onChange={(e) => setProp((props: TabPanelProps) => (props.title = e.target.value), 500)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <Label>Is Closable?</Label>
            {/* FIX: Add explicit type to the 'props' parameter */}
            <Switch checked={isClosable} onCheckedChange={(val) => setProp((props: TabPanelProps) => props.isClosable = val)} />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="style">
        <AccordionTrigger className="p-2">Style</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
           <div>
            <Label>Content Padding: {padding}px</Label>
            <Slider
              value={[padding || 0]}
              // FIX: Add explicit type to the 'props' parameter
              onValueChange={([value]) => setProp((props: TabPanelProps) => (props.padding = value))}
              max={64}
              step={1}
              className="mt-2"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};