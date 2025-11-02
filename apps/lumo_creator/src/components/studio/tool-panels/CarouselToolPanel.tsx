// @/components/studio/tool-panels/CarouselToolPanel.tsx
"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { CarouselComponent } from "@/components/editor-components/CarouselComponent";
import { CarouselSlideComponent } from "@/components/editor-components/CarouselSlideComponent";
import { ImageComponent } from "@/components/editor-components/ImageComponent";
import { TextComponent } from "@/components/editor-components/TextComponent";
import { SlidersHorizontal } from "lucide-react";

export function CarouselToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Carousel</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag a preset onto the canvas.</p>
        <div
          ref={(ref: HTMLDivElement | null) => {
            if(ref){
              // Create a dragger for a pre-configured Carousel
              connectors.create(ref, 
                <CarouselComponent>
                  <CarouselSlideComponent>
                     <ImageComponent />
                     <TextComponent text="Slide 1 Title" fontSize="24px" alignment="center" />
                     <TextComponent text="Describe the first slide here. You can add more components." alignment="center" />
                  </CarouselSlideComponent>
                  <CarouselSlideComponent>
                     <ImageComponent />
                     <TextComponent text="Slide 2 Title" fontSize="24px" alignment="center" />
                     <TextComponent text="This is the second slide. Customize it freely." alignment="center" />
                  </CarouselSlideComponent>
                  <CarouselSlideComponent>
                     <TextComponent text="Text-Only Slide" fontSize="24px" alignment="center" />
                     <TextComponent text="Slides can contain any combination of components." alignment="center" />
                  </CarouselSlideComponent>
                </CarouselComponent>
              )
            }
          }}
          className="cursor-grab p-4 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
        >
          <SlidersHorizontal className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Image & Text Carousel</h3>
            <p className="text-xs text-muted-foreground">A slider with 3 pre-built slides.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
