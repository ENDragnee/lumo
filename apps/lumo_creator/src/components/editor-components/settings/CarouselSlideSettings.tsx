// @/components/editor-components/settings/CarouselSlideSettings.tsx
"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CarouselSlideProps } from '../CarouselSlideComponent';

export const CarouselSlideSettings = () => {
    const { actions: { setProp }, padding } = useNode<CarouselSlideProps>(node => ({
        padding: node.data.props.padding
    }));

    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <Label>Padding</Label>
                <div className="flex items-center gap-4">
                    <Slider
                        defaultValue={[padding || 0]}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                            setProp((props: CarouselSlideProps) => props.padding = value[0], 500);
                        }}
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">{padding}px</span>
                </div>
            </div>
        </div>
    );
};
