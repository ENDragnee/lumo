"use client";

import { useNode } from "@craftjs/core";
import { ContainerProps } from "../ContainerComponent";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export function ContainerSettings() {
  const {
    actions: { setProp },
    layout,
    gap,
    padding,
    backgroundColor,
    borderRadius,
    gridColumns,
  } = useNode((node) => ({
    layout: node.data.props.layout,
    gap: node.data.props.gap,
    padding: node.data.props.padding,
    backgroundColor: node.data.props.backgroundColor,
    borderRadius: node.data.props.borderRadius,
    gridColumns: node.data.props.gridColumns,
  }));

  return (
    <div className="space-y-6 p-1">
      <div>
        <Label>Layout</Label>
        <RadioGroup
          value={layout}
          onValueChange={(value) => setProp((props: ContainerProps) => props.layout = value as any)}
          className="grid grid-cols-3 gap-2 mt-2"
        >
          <div>
            <RadioGroupItem value="vertical" id="vertical" className="sr-only" />
            <Label htmlFor="vertical" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
              Vertical
            </Label>
          </div>
          <div>
            <RadioGroupItem value="stack" id="stack" className="sr-only" />
            <Label htmlFor="stack" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
              Stack
            </Label>
          </div>
          <div>
            <RadioGroupItem value="grid" id="grid" className="sr-only" />
            <Label htmlFor="grid" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
              Grid
            </Label>
          </div>
        </RadioGroup>
      </div>

      {layout === 'grid' && (
        <div>
            <Label>Grid Columns</Label>
            <Input 
                type="number" 
                min="1"
                max="12"
                value={gridColumns}
                onChange={(e) => setProp((props: ContainerProps) => props.gridColumns = parseInt(e.target.value, 10))}
                className="mt-1"
            />
        </div>
      )}

      <div>
        <Label>Gap: {gap}px</Label>
        <Slider
          value={[gap]}
          onValueChange={([value]) => setProp((props: ContainerProps) => props.gap = value)}
          max={64}
          step={1}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Padding: {padding}px</Label>
        <Slider
          value={[padding]}
          onValueChange={([value]) => setProp((props: ContainerProps) => props.padding = value)}
          max={64}
          step={1}
          className="mt-2"
        />
      </div>

       <div>
        <Label>Border Radius: {borderRadius}px</Label>
        <Slider
          value={[borderRadius]}
          onValueChange={([value]) => setProp((props: ContainerProps) => props.borderRadius = value)}
          max={32}
          step={1}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Background Color</Label>
        <div className="flex items-center gap-2 mt-1">
            <Input 
                type="color" 
                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                onChange={(e) => setProp((props: ContainerProps) => props.backgroundColor = e.target.value)}
                className="w-12 h-10 p-1"
            />
            <Input 
                type="text"
                value={backgroundColor}
                onChange={(e) => setProp((props: ContainerProps) => props.backgroundColor = e.target.value)}
                placeholder="e.g., #ffffff or transparent"
            />
        </div>
      </div>
    </div>
  );
}
