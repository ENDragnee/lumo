// components/settings/SimulationSettings.tsx
"use client"

import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimulationProps } from '../SimulationComponent'; // Import props interface

// Define a unique, non-empty value for the "None" option
const NONE_VALUE = "__none__"; // Or "none", "manual", etc. - just not ""

export const SimulationSettings: React.FC = () => {
    const {
        actions: { setProp },
        src,
        width,
        aspectRatio,
        padding,
    } = useNode<SimulationProps>((node) => node.data.props as SimulationProps);

    const handleInputChange = (
        propName: Exclude<keyof SimulationProps, 'aspectRatio' | 'height'>,
        value: string
    ) => {
        setProp((currentProps: SimulationProps) => ({
            ...currentProps,
            [propName]: value,
        }), 500);
    };

    const handleSelectChange = (propName: 'aspectRatio', value: string) => {
        setProp((currentProps: SimulationProps) => ({
            ...currentProps,
            // If the selected value is our special "none" value, set prop to undefined
            // Otherwise, use the selected value directly.
            [propName]: value === NONE_VALUE ? undefined : value,
        }), 500);
    };

    // Determine the value prop for the Select component.
    // If aspectRatio is undefined, use our special NONE_VALUE.
    // Otherwise, use the actual aspectRatio string.
    const selectValue = aspectRatio === undefined ? NONE_VALUE : aspectRatio;

    return (
        <div className="p-4 space-y-4">
            {/* ... other inputs remain the same ... */}
             <div className="space-y-2">
                <Label htmlFor="src">Simulation URL</Label>
                <Input
                    id="src"
                    type="text"
                    value={src || ''} // Use destructured prop
                    onChange={(e) => handleInputChange('src', e.target.value)}
                    placeholder="https://example.com/simulation/embed"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                    id="width"
                    type="text" // Allow 'px' or '%'
                    value={width || ''} // Use destructured prop
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    placeholder="e.g., 400px or 100%"
                />
            </div>


            <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select
                    // Use the calculated selectValue based on aspectRatio state
                    value={selectValue}
                    onValueChange={(value) => handleSelectChange('aspectRatio', value)}
                >
                    <SelectTrigger id="aspectRatio">
                        {/* Keep placeholder */}
                        <SelectValue placeholder="Select ratio (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                        <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                        <SelectItem value="1/1">1:1 (Square)</SelectItem>
                        <SelectItem value="9/16">9:16 (Vertical)</SelectItem>
                        {/* Use the non-empty NONE_VALUE for the "None" option */}
                        <SelectItem value={NONE_VALUE}>None (Manual Height)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="padding">Padding</Label>
                <Input
                    id="padding"
                    type="text"
                    value={padding || ''} // Use destructured prop
                    onChange={(e) => handleInputChange('padding', e.target.value)}
                    placeholder="e.g., 0px or 8px"
                />
            </div>
            {/* Add any other simulation-specific settings here */}
        </div>
    );
};
