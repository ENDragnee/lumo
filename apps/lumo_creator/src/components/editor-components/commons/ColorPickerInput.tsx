// @/components/editor-componets/commons/ColorPickerInput.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { RgbaStringColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash-es';

// Extend colord with the accessibility plugin if needed for other features
extend([a11yPlugin]);

// --- PROPS INTERFACE ---
interface ColorPickerInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void; // New optional prop for the reset action
    placeholder?: string;
    className?: string;
}

// --- CHECKERBOARD BACKGROUND STYLE ---
const checkerboardStyle = {
    backgroundImage: `
        linear-gradient(45deg, #ddd 25%, transparent 25%), 
        linear-gradient(-45deg, #ddd 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #ddd 75%), 
        linear-gradient(-45deg, transparent 75%, #ddd 75%)`,
    backgroundSize: `16px 16px`,
    backgroundPosition: `0 0, 0 8px, 8px -8px, -8px 0px`,
};

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
    label,
    value,
    onChange,
    onClear,
    placeholder = 'transparent',
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const debouncedOnChange = useCallback(debounce(onChange, 200), [onChange]);
    const color = useMemo(() => colord(value || 'rgba(0,0,0,0)'), [value]);

    return (
        <div className={cn("space-y-2", className)}>
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    {/* --- TRIGGER BUTTON --- */}
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-10 w-10 p-0 flex-shrink-0"
                            aria-label={`Open color picker for ${label}`}
                        >
                            <div className="w-full h-full rounded-md" style={checkerboardStyle}>
                                <div 
                                    className="w-full h-full rounded-md border" 
                                    style={{ backgroundColor: color.toRgbString() }} 
                                />
                            </div>
                        </Button>
                    </PopoverTrigger>

                    {/* --- POPOVER CONTENT (The Color Picker UI) --- */}
                    <PopoverContent className="w-auto p-2" align="start">
                        <RgbaStringColorPicker
                            color={value || 'rgba(0,0,0,0)'}
                            onChange={debouncedOnChange}
                        />
                    </PopoverContent>
                </Popover>

                {/* --- TEXT INPUT FIELD --- */}
                <Input
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-grow"
                />
                
                {/* --- NEW: Render Reset button if onClear is provided --- */}
                {onClear && (
                    <Button variant="ghost" size="icon" onClick={onClear} aria-label="Reset color">
                        <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
            </div>
        </div>
    );
};
