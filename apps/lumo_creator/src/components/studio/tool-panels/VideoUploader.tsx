"use client";

import { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { addMediaItem } from "@/app/store/slices/mediaSlice";
import { AppDispatch } from "@/app/store/store";
import { IMediaData } from "@/models/Media";

export function VideoUploader() {
  const dispatch = useDispatch<AppDispatch>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }
      
      dispatch(addMediaItem(result.data as IMediaData));

    } catch (err: any) {
      setError(err.message);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="video-upload" className="font-semibold">Upload Video</Label>
      <div className="flex items-center gap-2">
        <Input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="flex-1 file:text-sm file:font-medium file:text-primary"
        />
        <Button size="icon" disabled={isUploading} aria-label="Upload">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
