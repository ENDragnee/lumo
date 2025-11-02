// @/components/editor-components/settings/CarouselSettings.tsx
"use client";

import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { CarouselProps } from '../CarouselComponent';
import { CarouselSlideComponent } from '../CarouselSlideComponent';
import { ImageComponent } from '../ImageComponent';
import { TextComponent } from '../TextComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const CarouselSettings = () => {
  const { id: selfId, actions: { setProp } } = useNode();
  
  // --- THE FIX ---
  // `actions` and `query` are destructured from the hook's top-level return.
  // The collector function is only used to get values from the state that we want to subscribe to.
  const { actions: editorActions, query, selectedNodeId } = useEditor((state, query) => ({
      selectedNodeId: state.events.selected.values().next().value,
  }));

  const { props, children: childNodes } = useNode((node) => ({
    props: node.data.props as CarouselProps,
    children: node.data.nodes || [],
  }));
  const { showArrows, showDots, loop } = props;

  // With the fix above, `query` and `editorActions` are now correctly defined.
  const handleAddSlide = () => {
    const newSlide = query.createNode(
      <CarouselSlideComponent>
        <ImageComponent />
        <TextComponent text="New Slide Title" fontSize="24px" alignment="center" />
        <TextComponent text="Describe your new slide here." alignment="center" />
      </CarouselSlideComponent>
    );
    editorActions.add(newSlide, selfId);
  };

  const handleRemoveSlide = (slideId: string) => {
    if (childNodes.length <= 1) return;
    editorActions.delete(slideId);
  };

  const handleSelectSlide = (slideId: string) => {
    editorActions.selectNode(slideId);
  };

  return (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={['manage', 'options']} className="w-full p-1">
        <AccordionItem value="manage">
          <AccordionTrigger className="p-2 text-sm">Manage Slides ({childNodes.length})</AccordionTrigger>
          <AccordionContent className="p-2 space-y-2">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {childNodes.map((slideId, index) => {
                const isLastSlide = childNodes.length <= 1;
                return (
                  <div key={slideId} className={cn("flex items-center justify-between p-2 bg-muted/50 rounded-md", selectedNodeId === slideId && "bg-blue-100 dark:bg-blue-900/50")}>
                    <Button variant="ghost" className="p-1 h-auto text-sm font-medium w-full justify-start" onClick={() => handleSelectSlide(slideId)}>
                      <Edit className="mr-2 h-4 w-4 text-muted-foreground"/>
                      Slide {index + 1}
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => handleRemoveSlide(slideId)} disabled={isLastSlide}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      {isLastSlide && <TooltipContent><p>Cannot delete the last slide.</p></TooltipContent>}
                    </Tooltip>
                  </div>
                )
              })}
            </div>
            <Button onClick={handleAddSlide} className="w-full mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add New Slide
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="options">
          <AccordionTrigger className="p-2 text-sm">Carousel Options</AccordionTrigger>
          <AccordionContent className="p-2 space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <Label>Show Arrows</Label>
              <Switch checked={showArrows} onCheckedChange={(val) => setProp((props: CarouselProps) => props.showArrows = val)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <Label>Show Dots</Label>
              <Switch checked={showDots} onCheckedChange={(val) => setProp((props: CarouselProps) => props.showDots = val)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <Label>Loop Slides</Label>
              <Switch checked={loop} onCheckedChange={(val) => setProp((props: CarouselProps) => props.loop = val)} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};
