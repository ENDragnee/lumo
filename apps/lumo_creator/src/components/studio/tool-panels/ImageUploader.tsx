"use client";

import { useState, ChangeEvent, DragEvent, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, Image as ImageIcon, X, AlertTriangle } from "lucide-react";
import { AppDispatch } from "@/app/store/store";
import clsx from 'clsx';
import Image from "next/image";

interface ImageUploaderProps {
    onUploadComplete?: () => void;
}

export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [tag, setTag] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State for the selected file and its preview URL
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // State for drag-and-drop UI feedback
    const [isDragging, setIsDragging] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up the object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileSelect = useCallback((file: File | null) => {
        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            setError("Invalid file type. Please select an image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("File is too large. Maximum size is 5MB.");
            return;
        }

        setError(null);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);
    
    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("tag", tag);

        try {
            const response = await fetch("/api/media", { method: "POST", body: formData });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Upload failed due to a server error.");
            }
            
            // This now adds to the Redux store but doesn't remove the preview
            // The onUploadComplete callback will trigger a refetch, which is better
            // dispatch(addMediaItem(result.data as IMediaData));
            
            setTag("");
            handleClearSelection(); // Clear the uploader state
            onUploadComplete?.(); // Notify parent to refresh list

        } catch (err: any) {
            setError(err.message);
            console.error("Upload error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    // --- Drag and Drop Handlers ---
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Necessary to allow drop
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFileSelect(file || null);
    };

    // --- Render Logic ---
    if (previewUrl && selectedFile) {
        // --- STATE 2: File Selected, Ready for Upload ---
        return (
            <div className="relative p-4 border border-dashed rounded-lg space-y-4">
                 {isUploading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm font-semibold">Uploading...</p>
                    </div>
                 )}
                 <div className="relative w-full h-40 rounded-md overflow-hidden border bg-muted">
                    <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="tag-input-preview">Optional Tag</Label>
                    <Input id="tag-input-preview" type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g., product, banner" disabled={isUploading}/>
                 </div>
                 <div className="flex gap-2">
                    <Button onClick={handleUpload} className="w-full" disabled={isUploading}>
                        <UploadCloud className="mr-2 h-4 w-4"/>
                        Upload Image
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleClearSelection} disabled={isUploading} aria-label="Clear selection">
                        <X className="h-4 w-4"/>
                    </Button>
                 </div>
                 {error && <p className="text-sm text-destructive flex items-center gap-1"><AlertTriangle size={14}/> {error}</p>}
            </div>
        );
    }

    // --- STATE 1: Idle, Awaiting File ---
    return (
        <div 
            className={clsx(
                "relative transition-all duration-300",
                isDragging && "scale-105"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div
                className={clsx(
                    "w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
                    isDragging 
                        ? "border-primary bg-primary/10" 
                        : "border-muted-foreground/30 hover:border-primary hover:bg-muted/50"
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <UploadCloud className="h-10 w-10" />
                    <p className="font-semibold">Drag & drop an image here</p>
                    <p className="text-sm">or click to browse</p>
                    <p className="text-xs mt-2">Max file size: 5MB</p>
                </div>
            </div>
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files?.[0] || null)}
            />
            {error && <p className="text-sm text-destructive flex items-center gap-1 pt-2"><AlertTriangle size={14}/> {error}</p>}
        </div>
    );
}
