// @/components/editor-components/CarouselComponent.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { CarouselSettings } from './settings/CarouselSettings';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronLeft, ChevronRight, Wand2, GripVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel';
import { CarouselSlideComponent } from './CarouselSlideComponent';
import { ImageComponent } from './ImageComponent'; // Import for pre-built layout
import { TextComponent } from './TextComponent';   // Import for pre-built layout

export interface CarouselProps {
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  children?: React.ReactNode;
}

type CraftableCarouselComponent = UserComponent<CarouselProps>;

export const CarouselComponent: CraftableCarouselComponent = ({
  showArrows = true,
  showDots = true,
  loop = false,
  children
}) => {
  const { connectors: { connect, drag }, id, children: childNodes } = useNode(node => ({
      children: node.data.nodes,
      id: node.id
  }));
  
  const { selected, actions: editorActions, query, enabled: editorEnabled, selectedChildId } = useEditor((state, query) => {
      const selectedNodeId = state.events.selected.values().next().value;
      return {
          selected: query.getEvent('selected').contains(id),
          enabled: state.options.enabled,
          selectedChildId: childNodes.find(childId => childId === selectedNodeId),
      };
  });
  
  const slideCount = childNodes.length;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, watchDrag: !editorEnabled });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // FIX 1: Call `.toNodeTree()` on the result of `parseReactElement`.
  const handleAddSlide = useCallback(() => {
    const newSlideTree = query.parseReactElement(
      <CarouselSlideComponent>
        <ImageComponent />
        <TextComponent text="New Slide Title" fontSize="24px" alignment="center" />
        <TextComponent text="Describe your new slide here." alignment="center" />
      </CarouselSlideComponent>
    ).toNodeTree(); // This generates the required NodeTree object.
    
    editorActions.addNodeTree(newSlideTree, id);
  }, [editorActions, query, id]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = (api: EmblaCarouselType) => setSelectedIndex(api.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect(emblaApi);
    return () => { 
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);
  
  useEffect(() => {
    if (emblaApi) emblaApi.reInit({ loop, watchDrag: !editorEnabled });
  }, [slideCount, loop, editorEnabled, emblaApi]);

  useEffect(() => {
    if (emblaApi && selectedChildId) {
        const index = childNodes.indexOf(selectedChildId);
        if (index !== -1 && index !== selectedIndex) emblaApi.scrollTo(index);
    }
  }, [selectedChildId, childNodes, emblaApi, selectedIndex]);

  // FIX 2 & 3: Use the correct ref callback pattern for Craft.js connectors.
  return (
    <div ref={(ref) => {if(ref){ connect(ref)}}} className="relative w-full flex flex-col gap-2 p-2">
      {selected && editorEnabled && (
          <div className="flex items-center gap-2 bg-blue-500/10 p-1 rounded-t-lg">
              <div ref={(ref: HTMLDivElement) => {
                if(ref)
                  {
                    drag(ref)
                  }
              }} className="p-1 cursor-move text-blue-800 hover:bg-blue-500/20 rounded-md">
                  <GripVertical size={20} />
              </div>
              <div className="flex-grow text-sm font-semibold text-blue-800">
                  Carousel {slideCount > 0 && `(Slide ${selectedIndex + 1} of ${slideCount})`}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-800 hover:bg-blue-500/20" onMouseDown={e => e.stopPropagation()} onClick={handleAddSlide}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-800 hover:bg-blue-500/20 hover:text-red-500" onMouseDown={e => e.stopPropagation()} onClick={() => editorActions.delete(id)}>
                  <Trash2 className="h-4 w-4" />
              </Button>
          </div>
      )}
      
      <div className={cn("relative w-full bg-card shadow-sm rounded-lg", selected && editorEnabled && "outline-dashed outline-2 outline-blue-500")}>
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {slideCount > 0 ? children : (
                <div className="flex-[0_0_100%] min-h-[250px] flex flex-col items-center justify-center p-4 bg-muted/50">
                    <Wand2 className="h-10 w-10 text-muted-foreground mb-4"/>
                    <h3 className="font-semibold text-muted-foreground">Carousel is Empty</h3>
                    <p className="text-sm text-muted-foreground">Add a slide from the settings panel or the header above.</p>
                </div>
            )}
          </div>
        </div>
        
        {showArrows && slideCount > 1 && (
          <>
            <Button variant="secondary" size="icon" className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full z-10 h-9 w-9 bg-background/60 hover:bg-background/90" onClick={scrollPrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon" className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full z-10 h-9 w-9 bg-background/60 hover:bg-background/90" onClick={scrollNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {showDots && slideCount > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 p-1 bg-background/20 backdrop-blur-sm rounded-full">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button key={index} onClick={() => scrollTo(index)} className={cn("h-2 w-2 rounded-full bg-primary transition-all duration-300", index === selectedIndex ? "w-6 opacity-100" : "opacity-40 hover:opacity-70")} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

CarouselComponent.craft = {
  displayName: "Carousel",
  isCanvas: true,
  props: { 
    showArrows: true, 
    showDots: true, 
    loop: false, 
    children: [
      <CarouselSlideComponent>
        <ImageComponent />
        <TextComponent text="Welcome to Your Carousel" fontSize="28px" alignment="center" />
        <TextComponent text="You can edit this slide or add new ones." alignment="center" />
      </CarouselSlideComponent>
    ] 
  },
  related: { settings: CarouselSettings },
  rules: {
    canMoveIn: (incoming, _self, query) => incoming.every(node => query(node.id).get().data.displayName === 'Carousel Slide')
  }
};
