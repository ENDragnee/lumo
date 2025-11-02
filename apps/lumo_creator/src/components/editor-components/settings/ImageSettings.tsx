"use client"

import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import Image from 'next/image';

// Shadcn/UI Component Imports
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Local Component Imports
import { ImageProps } from '../ImageComponent'; // Make sure this path is correct
import { MediaLibrary } from './MediaLibrary'; // Import the new Media Library

export const ImageSettings: React.FC = () => {
    const {
        actions: { setProp },
        src,
        alt,
        width,
        height,
        objectFit,
        padding,
        lockAspectRatio,
    } = useNode<ImageProps>((node) => node.data.props as ImageProps);

    // State to control the visibility of the Media Library dialog
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // This function will be called by the MediaLibrary when an image is selected
    const handleSelectImage = (imagePath: string) => {
        // Update the 'src' prop of the Craft.js node
        setProp((props: ImageProps) => {
            props.src = imagePath;
        });
        // Close the dialog after selection
        setIsLibraryOpen(false);
    };

    return (
        // Use a React Fragment to wrap the settings panel and the dialog
        <>
            <div className="p-4 space-y-4">
                {/* --- IMAGE PREVIEW & REPLACE BUTTON --- */}
                <div className="space-y-2">
                    <Label>Current Image</Label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border bg-muted flex-shrink-0">
                            {src ? (
                                <Image
                                    src={src}
                                    alt={alt || 'Current image preview'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-1">
                                  No Image
                                </div>
                            )}
                        </div>
                        <Button variant="outline" onClick={() => setIsLibraryOpen(true)} className="w-full">
                            Replace Image
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="alt">Alt Text</Label>
                    <Input
                        id="alt"
                        value={alt || ''}
                        onChange={(e) => setProp((props: ImageProps) => { props.alt = e.target.value; }, 500)}
                        placeholder="Descriptive text for accessibility"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                            id="width"
                            value={width || ''}
                            onChange={(e) => setProp((props: ImageProps) => { props.width = e.target.value; }, 500)}
                            placeholder="e.g., 300px"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                            id="height"
                            value={height || ''}
                            onChange={(e) => setProp((props: ImageProps) => { props.height = e.target.value; }, 500)}
                            placeholder="e.g., 200px"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label htmlFor="lockAspectRatio">Lock Aspect Ratio</Label>
                        <p className="text-xs text-muted-foreground">
                            Maintain ratio when resizing.
                        </p>
                    </div>
                    <Switch
                        id="lockAspectRatio"
                        checked={lockAspectRatio || false}
                        onCheckedChange={(checked) => setProp((props: ImageProps) => { props.lockAspectRatio = checked; })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="objectFit">Image Fit</Label>
                    <Select
                        value={objectFit || 'cover'}
                        onValueChange={(value) => setProp((props: ImageProps) => { props.objectFit = value as ImageProps['objectFit']; })}
                    >
                        <SelectTrigger id="objectFit"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cover">Cover</SelectItem>
                            <SelectItem value="contain">Contain</SelectItem>
                            <SelectItem value="fill">Fill</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="scale-down">Scale Down</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="padding">Padding</Label>
                    <Input
                        id="padding"
                        value={padding || ''}
                        onChange={(e) => setProp((props: ImageProps) => { props.padding = e.target.value; }, 500)}
                        placeholder="e.g., 8px"
                    />
                </div>
            </div>

            {/* --- MEDIA LIBRARY DIALOG (MODAL) --- */}
            <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
              <DialogTitle title='Replace current image'>
                <DialogContent className="max-w-4xl w-full h-[85vh] p-0 flex flex-col">
                    {/* Render the library inside the dialog, passing the required props */}
                    <MediaLibrary
                        onSelectImage={handleSelectImage}
                        currentImageSrc={src}
                    />
                </DialogContent>
              </DialogTitle>
            </Dialog>
        </>
    );
};
