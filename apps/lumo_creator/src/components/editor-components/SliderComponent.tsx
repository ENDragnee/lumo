"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, useNode, Node as CraftNode } from '@craftjs/core';
import useEmblaCarousel from 'embla-carousel-react';
import { SliderSettings } from './settings/SliderSettings';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Props Interface ---
export interface SliderProps {
  showArrows?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  delay?: number;
  padding?: string;
  children?: React.ReactNode;
}

// --- Craftable Component Definition ---
interface CraftableComponent extends React.FC<SliderProps> {
    craft?: {
      displayName: string;
      props: Partial<SliderProps>;
      related?: {
        settings: React.ComponentType<any>;
      };
      rules?: {
        canDrag?: (node: CraftNode) => boolean;
      };
      isCanvas?: boolean;
    };
}

export const SliderComponent: CraftableComponent = ({
  showArrows = true,
  showDots = true,
  autoplay = false,
  delay = 3000,
  padding = '16px',
  children
}) => {
  const { connectors: { connect, drag } } = useNode();
  const { enabled: editorEnabled } = useEditor(state => ({ enabled: state.options.enabled }));

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);
  
  // Autoplay functionality
  useEffect(() => {
    if (!emblaApi || !autoplay || editorEnabled) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, delay);
    return () => clearInterval(interval);
  }, [emblaApi, autoplay, delay, editorEnabled]);

  const slideCount = React.Children.count(children);

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if(ref){
          connect(drag(ref));
        }}}
      style={{ padding }}
      className="relative"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slideCount > 0 ? React.Children.map(children, (child) => (
            <div className="relative flex-[0_0_100%] min-w-0">
              {child}
            </div>
          )) : (
             <div className="flex-[0_0_100%] min-w-0 p-8 flex items-center justify-center bg-muted/50 border border-dashed rounded-lg">
                <p className="text-muted-foreground">Drag components here to create slides</p>
             </div>
          )}
        </div>
      </div>
      
      {showArrows && slideCount > 1 && (
        <>
          <Button variant="outline" size="icon" className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full z-10" onClick={scrollPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full z-10" onClick={scrollNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {showDots && slideCount > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full bg-primary transition-all",
                index === selectedIndex ? "opacity-100 w-4" : "opacity-50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

SliderComponent.craft = {
  displayName: "Slider",
  isCanvas: true, // This is crucial. It makes the component a drop-zone.
  props: {
    showArrows: true,
    showDots: true,
    autoplay: false,
    delay: 3000,
    padding: '0px',
  },
  related: {
    settings: SliderSettings,
  },
};
