// @/components/studio/tool-panels/SimulationToolPanel
"use client";

import { useState } from "react";
import { useEditor } from "@craftjs/core";
import { SimulationComponent } from "@/components/editor-components/SimulationComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MonitorPlay } from "lucide-react";

export function SimulationToolPanel() {
  const { connectors } = useEditor();
  const [url, setUrl] = useState<string>("https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html");

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Simulations</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        <div>
            <Label htmlFor="sim-url" className="text-sm font-medium">Simulation URL</Label>
            <Input
                id="sim-url"
                type="url"
                placeholder="https://example.com/simulation"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1"
            />
        </div>

        <div
            ref={(ref: HTMLDivElement | null) => {
              if(ref){
                connectors.create(ref,<SimulationComponent src={url} />)
              }
            }}
            className="cursor-grab"
        >
            <Button className="w-full gap-2" disabled={!url}>
                <MonitorPlay className="h-4 w-4" />
                Drag to Add Simulation
            </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Enter a URL, then drag the button above onto the canvas.
        </p>
      </div>
    </div>
  );
}
