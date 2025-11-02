// @/components/studio/RightSidebar.tsx

"use client";

import React, { useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { useSelector, useDispatch } from 'react-redux';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AppDispatch, RootState } from '@/app/store/store';
import { setSidebarOpen } from '@/app/store/slices/editorSlice';

// UI Imports
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Import your tool panels
import { TextToolPanel } from './tool-panels/TextToolPanel';
import { ImageToolPanel } from './tool-panels/ImageToolPanel';
import { VideoToolPanel } from './tool-panels/VideoToolPanel';
import { SimulationToolPanel } from './tool-panels/SimulationToolPanel';
import { ContainerToolPanel } from './tool-panels/ContainerToolPanel';
import { TabsToolPanel } from './tool-panels/TabsToolPanel';
import { CarouselToolPanel } from './tool-panels/CarouselToolPanel';
import { ChallengeToolPanel } from './tool-panels/ChallengeToolPanel';

const SHEET_HEIGHT_VH = 60;

export function RightSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTool, isRightSidebarOpen } = useSelector((state: RootState) => state.editor);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  const { selected } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last();
    let selectedInfo = null;
    if (currentNodeId) {
      const node = state.nodes[currentNodeId];
      if (node) {
        selectedInfo = {
          id: currentNodeId,
          name: node.data.displayName || node.data.name,
          settings: node.related?.settings,
        };
      }
    }
    return { selected: selectedInfo };
  });

  // --- Animation and Gesture Logic (Mobile Only) ---
  const [{ y }, api] = useSpring(() => ({
    y: window.innerHeight,
    config: config.stiff,
  }));

  const openSheet = () => {
    api.start({ y: window.innerHeight * (1 - SHEET_HEIGHT_VH / 100) });
  };
  
  const closeSheet = (velocity = 0) => {
    api.start({ 
      y: window.innerHeight, 
      config: { ...config.stiff, velocity } 
    });
    // Ensure Redux state is updated when the sheet is closed via gesture.
    if (isRightSidebarOpen) {
        dispatch(setSidebarOpen(false));
    }
  };

  // This useEffect correctly syncs the animation with the Redux state.
  useEffect(() => {
    if (!isDesktop) {
        if (isRightSidebarOpen) {
            openSheet();
        } else {
            closeSheet();
        }
    }
  }, [isRightSidebarOpen, isDesktop]);

  const bind = useDrag(
    ({ last, velocity: [, vy], movement: [, my], cancel }) => {
      if (my < -70) cancel();

      if (last) {
        if (my > window.innerHeight * 0.2 || vy > 0.5) {
          closeSheet(vy);
        } else {
          openSheet();
        }
      } else {
        api.start({ y: my + (window.innerHeight * (1 - SHEET_HEIGHT_VH / 100)), immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );

  // --- Content Rendering Logic ---
  const renderContent = () => {
    if (selected && selected.settings) {
      return (
        <div className="flex flex-col h-full">
          <div className="p-4 flex-shrink-0 border-b">
            <h2 className="text-lg font-semibold">{selected.name} Settings</h2>
          </div>
          <div className="flex-grow p-4 overflow-y-auto pb-24 md:pb-4">
            {React.createElement(selected.settings)}
          </div>
        </div>
      );
    }
    return renderToolPanel();
  };

  const renderToolPanel = () => {
    switch(activeTool) {
      case 'text':
        return <TextToolPanel />;
      case 'image':
        return <ImageToolPanel />;
      case 'video':
        return <VideoToolPanel />;
      case 'simulation':
        return <SimulationToolPanel />;
      case 'container':
        return <ContainerToolPanel />;
      case 'tab':
        return <TabsToolPanel />;
      case 'carousel':
        return <CarouselToolPanel />;
      case 'challenges':
        return <ChallengeToolPanel />;
      default:
        // Show this when the sidebar is open but no tool is selected
        return <div className="p-4 pt-8 text-center text-muted-foreground">Select a tool from the toolbar below.</div>;
    }
  };

  // --- Main JSX ---
  return (
    <animated.aside
      style={isDesktop ? {} : { y, height: `${SHEET_HEIGHT_VH}vh` }}
      // This className logic correctly reacts to isRightSidebarOpen on desktop
      className={cn(
        "bg-background transition-all duration-300 ease-in-out flex-shrink-0 z-30",
        "fixed bottom-0 left-0 right-0 shadow-2xl border-t rounded-t-lg",
        "md:relative md:h-full md:bottom-auto md:left-auto md:right-auto",
        "md:border-t-0 md:border-l md:shadow-none md:rounded-none",
        isRightSidebarOpen ? "md:w-72 lg:w-80" : "md:w-0"
      )}
    >
      <div 
        {...(!isDesktop ? bind() : {})}
        className="h-12 border-b flex items-center justify-center p-2 md:hidden cursor-grab active:cursor-grabbing"
      >
        <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full" />
        <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={() => dispatch(setSidebarOpen(false))}
        >
            <X className="h-5 w-5" />
        </Button>
      </div>

      <div className={cn(
          "w-full h-full overflow-hidden",
          "md:w-72 lg:w-80"
      )}>
        {renderContent()}
      </div>
    </animated.aside>
  );
}
