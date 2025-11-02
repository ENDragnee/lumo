"use client";

import React, { ReactNode, useState } from "react";
import { useEditor, Element } from "@craftjs/core";
import {
  LayoutDashboard,
  MousePointerClick,
  Type,
  GalleryHorizontal,
  Square,
  SlidersHorizontal,
  Play,
  ImageIcon,
  HelpCircle,
  Monitor,
  Layers3,
  Info,
  FlipVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setLockedOpen } from "@/app/store/slices/toolbarSlice";
import { setActiveTool, ToolType } from "@/app/store/slices/editorSlice";

// --- Component Imports (Replaced Placeholders) ---
type ContainerProps = { children?: ReactNode; padding?: number };
const Container = ({ children, padding = 20 }: ContainerProps) => (
  <div style={{ padding: `${padding}px`, border: '1px dashed #ddd', minHeight: '50px' }}>
    {children}
  </div>
);

import { SliderComponent } from "@/components/editor-components/SliderComponent";
import { ChallengeComponent } from "./editor-components/ChallengeComponent";
import { TextComponent } from "@/components/editor-components/TextComponent";
import { ImageComponent } from "@/components/editor-components/ImageComponent";
import { VideoComponent } from "@/components/editor-components/VideoComponent";
import { SimulationComponent } from "@/components/editor-components/SimulationComponent";
import { TabsComponent } from "@/components/editor-components/TabsComponent";
import { CalloutComponent } from "@/components/editor-components/CalloutComponent";
import { FlashcardComponent } from "@/components/editor-components/FlashcardComponent";


// --- Reusable Draggable Tool Button ---
type DraggableToolButtonProps = {
  name: string;
  icon: React.ReactNode;
  component: React.ReactElement;
  tool: ToolType;
};
const DraggableToolButton = ({ name, icon, component, tool }: DraggableToolButtonProps) => {
  const { connectors } = useEditor();
  const dispatch = useAppDispatch();

  const handleToolClick = (selectedTool: ToolType) => {
    dispatch(setActiveTool(selectedTool));
  };
  
  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) connectors.create(ref, component);
      }}
      className="flex flex-col items-center justify-center p-2 rounded-lg cursor-grab hover:bg-accent transition-colors text-center w-24"
      onClick={() => handleToolClick(tool)}
    >
      {icon}
      <span className="text-xs mt-1">{name}</span>
    </div>
  );
};


// --- The Main Toolbar Component ---
export function Toolbar() {
  const dispatch = useAppDispatch();
  const isLocked = useAppSelector((state) => state.toolbar.isLockedOpen);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isHovered || isLocked;

  const handlePopoverOpenChange = (isOpen: boolean) => {
    dispatch(setLockedOpen(isOpen));
  };

  // UPDATED: Using actual components instead of placeholders
  const toolCategories = [
    { name: "Layout", icon: <LayoutDashboard className="h-5 w-5" />, 
      tools: [ 
        { name: "Container", icon: <Square className="h-5 w-5" />, component: <Element is={Container} padding={20} canvas />, tool: "container" as ToolType },
        { name: "Tabs", icon: <Layers3 className="h-5 w-5" />, component: <TabsComponent />, tool: "tab" as ToolType }, 
    ], },
    { name: "Media", icon: <GalleryHorizontal className="h-5 w-5" />, 
      tools: [ 
        { name: "Carousel", icon: <SlidersHorizontal className="h-5 w-5" />, component: <SliderComponent />, tool: "carousel" as ToolType }, 
        { name: "Image", icon: <ImageIcon className="h-5 w-5" />, component: <ImageComponent />, tool: "image" as ToolType },
        { name: "Video", icon: <Play className="h-5 w-5" />, component: <VideoComponent src="" />, tool: "video" as ToolType },
    ], },
    { name: "Interactive", icon: <MousePointerClick className="h-5 w-5" />, 
      tools: [ 
        { name: "Challenges", icon: <HelpCircle className="h-5 w-5" />, component: <ChallengeComponent challengeType="quiz" />, tool: "challenges" as ToolType },
        { name: "Flashcard", icon: <FlipVertical className="h-5 w-5" />, component: <FlashcardComponent />, tool: "flashcard" as ToolType },
        { name: "Simulation", icon: <Monitor className="h-5 w-5" />, component: <SimulationComponent src="" />, tool: "simulation" as ToolType }, 
    ], },
    { name: "Content", icon: <Type className="h-5 w-5" />, 
      tools: [ 
        { name: "Text", icon: <Type className="h-5 w-5" />, component: <TextComponent text="This is a new text block. Click to edit." />, tool: "text" as ToolType },
        { name: "Callout Box", icon: <Info className="h-5 w-5" />, component: <CalloutComponent />, tool: "callout" as ToolType }, 
    ], },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center p-4">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* UPDATED: Using new UI classes for animation */}
        <div
          className={cn(
            "flex items-center bg-card border rounded-full shadow-lg transition-all duration-300 ease-in-out",
            isExpanded ? "p-2 gap-1" : "p-1"
          )}
        >
          {toolCategories.map((category) => (
            <Popover key={category.name} onOpenChange={handlePopoverOpenChange}>
              <PopoverTrigger asChild>
                {/* UPDATED: Using new UI classes for button animation */}
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center rounded-full overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded
                      ? "w-32 h-12 px-4 justify-start"
                      : "w-10 h-10 justify-center"
                  )}
                >
                  {category.icon}
                  {/* UPDATED: Using new UI classes for text animation */}
                  <span
                    className={cn(
                      "whitespace-nowrap text-sm font-medium transition-all duration-200 ease-in-out",
                      isExpanded ? "ml-2 w-auto opacity-100" : "w-0 opacity-0"
                    )}
                  >
                    {category.name}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 mb-2" side="top" align="center">
                <div className="grid grid-cols-2 gap-2">
                  {category.tools.map((tool) => (
                    <DraggableToolButton
                      key={tool.name}
                      name={tool.name}
                      icon={tool.icon}
                      component={tool.component}
                      tool={tool.tool}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
}
