"use client";

import React from 'react';
import { useEditor, useNode } from '@craftjs/core';
import { TabsProps } from '../TabsComponent';
import { TabPanelComponent } from '../TabPanelComponent'; // Import component for creation
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const TabsSettings = () => {
  const { id: selfId, actions: { setProp } } = useNode();
  const { actions: { add }, query } = useEditor();

  const { placement } = useNode<TabsProps>((node) => ({
    placement: node.data.props.placement,
  }));

  const handleAddNewTab = () => {
    // FIX: Provide the required 'title' prop when creating a new node.
    const newTab = query.createNode(<TabPanelComponent title="New Tab" />);
    add(newTab, selfId);
  }

  return (
    <Accordion type="multiple" defaultValue={['general', 'layout']} className="w-full p-1">
      <AccordionItem value="general">
        <AccordionTrigger className="p-2">Manage Tabs</AccordionTrigger>
        <AccordionContent className="p-2">
          <Button onClick={handleAddNewTab} className="w-full">
            Add New Tab Panel
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Select an individual tab on the canvas to edit its title.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="layout">
        <AccordionTrigger className="p-2">Layout</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div>
            <Label>Tab Placement</Label>
            <RadioGroup
              value={placement}
              // Add explicit type here as a proactive fix
              onValueChange={(value) => setProp((props: TabsProps) => (props.placement = value as any))}
              className="grid grid-cols-2 gap-2 mt-2"
            >
              <div>
                <RadioGroupItem value="top" id="top" className="sr-only" />
                <Label htmlFor="top" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent [&:has([data-state=checked])]:border-primary cursor-pointer">Top</Label>
              </div>
              <div>
                <RadioGroupItem value="bottom" id="bottom" className="sr-only" />
                <Label htmlFor="bottom" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent [&:has([data-state=checked])]:border-primary cursor-pointer">Bottom</Label>
              </div>
              <div>
                <RadioGroupItem value="left" id="left" className="sr-only" />
                <Label htmlFor="left" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent [&:has([data-state=checked])]:border-primary cursor-pointer">Left</Label>
              </div>
              <div>
                <RadioGroupItem value="right" id="right" className="sr-only" />
                <Label htmlFor="right" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent [&:has([data-state=checked])]:border-primary cursor-pointer">Right</Label>
              </div>
            </RadioGroup>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};