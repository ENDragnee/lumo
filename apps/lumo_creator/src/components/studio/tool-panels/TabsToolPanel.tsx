"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { TabsComponent, TabsProps } from "@/components/editor-components/TabsComponent";
import { TabPanelComponent } from "@/components/editor-components/TabPanelComponent";
import { FolderKanban, ArrowRightFromLine, ArrowLeftFromLine, ArrowUpFromLine } from "lucide-react";

const tabsPresets: { name: string; icon: React.ElementType; props: Partial<TabsProps> }[] = [
  {
    name: "Tabs on Top",
    icon: FolderKanban,
    props: {
      placement: 'top',
    }
  },
  {
    name: "Tabs on Bottom",
    icon: ArrowUpFromLine,
    props: {
      placement: 'bottom',
    }
  },
  {
    name: "Tabs on Left",
    icon: ArrowRightFromLine,
    props: {
      placement: 'left',
    }
  },
   {
    name: "Tabs on Right",
    icon: ArrowLeftFromLine,
    props: {
      placement: 'right',
    }
  },
];

export function TabsToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Tabs</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag a tab layout onto the canvas.</p>
        {tabsPresets.map((preset) => (
          <div
            key={preset.name}
            ref={(ref: HTMLDivElement | null) => {
              if(ref){
                connectors.create(ref, 
                  <TabsComponent {...preset.props}>
                    <TabPanelComponent title="Tab 1" />
                    <TabPanelComponent title="Tab 2" />
                  </TabsComponent>
                )
              }
            }}
            className="cursor-grab p-4 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
          >
            <preset.icon className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">{preset.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}