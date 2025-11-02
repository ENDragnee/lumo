// components/settings/VideoSettings.tsx
"use client"

import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoComponentProps } from '../VideoComponent'; // Import props interface

// Define a unique, non-empty value for the "None" option
const NONE_VALUE = "__none__"; // Consistent value for "None"

export const VideoSettings: React.FC = () => {
    const {
        actions: { setProp },
        src,
        width,
        aspectRatio,
        padding,
    } = useNode<VideoComponentProps>((node) => node.data.props as VideoComponentProps);

    // Helper to handle input changes (excluding aspectRatio, handled by select)
    const handleInputChange = (
        propName: Exclude<keyof VideoComponentProps, 'aspectRatio' | 'height'>,
        value: string // Input elements provide string values
    ) => {
        // Use the immutable update pattern
        setProp((currentProps: VideoComponentProps) => ({
            ...currentProps,
            [propName]: value,
        }), 500); // Optional debounce
    };

    // Helper for Select component change (specifically for aspectRatio)
    const handleSelectChange = (propName: 'aspectRatio', value: string) => {
         // Use the immutable update pattern
        setProp((currentProps: VideoComponentProps) => ({
            ...currentProps,
            // If the selected value is our special "none" value, set prop to undefined
            // Otherwise, use the selected value directly.
            [propName]: value === NONE_VALUE ? undefined : value,
        }), 500); // Optional debounce
    };

    // Determine the value prop for the Select component.
    const selectValue = aspectRatio === undefined ? NONE_VALUE : aspectRatio;

    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="src">YouTube/Vimeo URL</Label>
                <Input
                    id="src"
                    type="text"
                    value={src || ''}
                    onChange={(e) => handleInputChange('src', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                    id="width"
                    type="text"
                    value={width || ''}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    placeholder="e.g., 560px or 100%"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select
                    // Use the calculated selectValue
                    value={selectValue}
                    onValueChange={(value) => handleSelectChange('aspectRatio', value)}
                >
                    <SelectTrigger id="aspectRatio">
                        <SelectValue placeholder="Select ratio (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                        <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                        <SelectItem value="1/1">1:1 (Square)</SelectItem>
                        <SelectItem value="9/16">9:16 (Vertical)</SelectItem>
                        {/* Use the non-empty NONE_VALUE */}
                        <SelectItem value={NONE_VALUE}>None (Manual Height)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="padding">Padding</Label>
                <Input
                    id="padding"
                    type="text"
                    value={padding || ''}
                    onChange={(e) => handleInputChange('padding', e.target.value)}
                    placeholder="e.g., 0px or 8px"
                />
            </div>
        </div>
    );
};
