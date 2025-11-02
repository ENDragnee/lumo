"use client";

import { useNode } from "@craftjs/core";
import { SliderProps } from "../SliderComponent";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function SliderSettings() {
  const { actions: { setProp }, showArrows, showDots, autoplay, delay } = useNode((node) => ({
    showArrows: node.data.props.showArrows,
    showDots: node.data.props.showDots,
    autoplay: node.data.props.autoplay,
    delay: node.data.props.delay,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label htmlFor="show-arrows">Show Arrows</Label>
        <Switch
          id="show-arrows"
          checked={showArrows}
          onCheckedChange={(value) => setProp((props: SliderProps) => props.showArrows = value)}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label htmlFor="show-dots">Show Dots</Label>
        <Switch
          id="show-dots"
          checked={showDots}
          onCheckedChange={(value) => setProp((props: SliderProps) => props.showDots = value)}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label htmlFor="autoplay">Autoplay</Label>
        <Switch
          id="autoplay"
          checked={autoplay}
          onCheckedChange={(value) => setProp((props: SliderProps) => props.autoplay = value)}
        />
      </div>
      {autoplay && (
        <div>
          <Label htmlFor="delay">Autoplay Delay (ms)</Label>
          <Input
            id="delay"
            type="number"
            value={delay}
            onChange={(e) => setProp((props: SliderProps) => props.delay = parseInt(e.target.value, 10))}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
}
