"use client";

import { Hand, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { RootState } from "@/app/store/store";
import { setTool, ManagerTool } from "@/app/store/slices/managerToolSlice"; // <-- Update the import path
import { cn } from "@/lib/utils";

export function EditorToolbar() {
  const dispatch = useAppDispatch();
  // --- UPDATED: Select state from `state.managerTool` ---
  const activeTool = useAppSelector((state: RootState) => state.managerTool.tool);

  const handleToolChange = (tool: ManagerTool) => {
    dispatch(setTool(tool));
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-background p-1.5 border rounded-lg shadow-md flex flex-col gap-1">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === 'connect' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => handleToolChange('connect')}
            >
              <Hand className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Connect Tool (Drag nodes, create links)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === 'delete' ? 'destructive' : 'ghost'}
              size="icon"
              onClick={() => handleToolChange('delete')}
              className={cn(activeTool === 'delete' && 'bg-destructive/20 text-destructive-foreground hover:bg-destructive/30')}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Delete Tool (Click an edge to remove it)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
