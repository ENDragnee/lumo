// @/components/modals/ContentModal.tsx
"use client";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { FilePlus, Tag, Loader2, UploadCloud, AlertTriangle } from 'lucide-react';

// --- Types for mutation payload and API responses ---
interface CreateContentPayload {
  title: string;
  thumbnailFile: File;
  tags: string;
  parentId: string | null;
}

interface MediaResponse {
  success: boolean;
  data: { _id: string; };
  message?: string;
}

interface ContentResponse {
  success: boolean;
  data: { _id: string; };
  message?: string;
}


// --- API logic extracted into a single function for useMutation ---
const createContentWithThumbnail = async (payload: CreateContentPayload): Promise<ContentResponse> => {
  const { title, thumbnailFile, tags, parentId } = payload;

  // 1. Upload thumbnail
  const mediaFormData = new FormData();
  mediaFormData.append("file", thumbnailFile);
  const mediaRes = await fetch("/api/media", { method: "POST", body: mediaFormData });
  if (!mediaRes.ok) {
    const err = await mediaRes.json();
    throw new Error(err.message || "Thumbnail upload failed.");
  }
  const mediaData: MediaResponse = await mediaRes.json();
  if (!mediaData.success || !mediaData.data?._id) {
    throw new Error(mediaData.message || "Could not retrieve uploaded thumbnail ID.");
  }
  const thumbnailId = mediaData.data._id;

  // 2. Create content with the new thumbnail ID
  const contentPayload = {
    title,
    thumbnail: thumbnailId,
    parentId,
    contentType: 'dynamic',
    tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
  };

  const contentRes = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contentPayload),
  });

  if (!contentRes.ok) {
    const err = await contentRes.json();
    throw new Error(err.message || "Failed to create content item.");
  }

  const result: ContentResponse = await contentRes.json();
  if (!result.data?._id) {
    throw new Error("API did not return a new content ID.");
  }

  // The return value of this function will be passed to `onSuccess`
  return result;
};


interface ContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newContentId: string) => void;
  parentId: string | null;
}

export const ContentModal: React.FC<ContentModalProps> = ({ open, onOpenChange, onSuccess, parentId }) => {
  const [title, setTitle] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: createContentWithThumbnail,
    onSuccess: (result) => {
      onSuccess(result.data._id); // Call parent success callback
      onOpenChange(false);      // Close modal
    },
    // onError is handled via mutation.error property
  });

  const resetState = () => {
    setTitle("");
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setTags("");
    setClientError(null);
    mutation.reset(); // Also reset the mutation state
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Reset all state when the modal closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => resetState(), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setClientError("Please select a valid image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB size limit
        setClientError("File is too large. Maximum size is 10MB.");
        return;
      }
      setThumbnailFile(file);
      setClientError(null); // Clear error on valid file selection
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const syntheticEvent = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation
    if (!title || !thumbnailFile) {
      setClientError("Title and a thumbnail image are required.");
      return;
    }
    setClientError(null);
    mutation.mutate({ title, thumbnailFile, tags, parentId });
  };

  const errorMessage = clientError || mutation.error?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FilePlus className="h-7 w-7 text-primary" />
            Create New Content
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            Fill in the details for your new masterpiece. A title and thumbnail are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="content-title" className="font-medium text-sm">Title</Label>
              <Input id="content-title" placeholder="e.g., Introduction to Quantum Physics" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={mutation.isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload" className="font-medium text-sm">Thumbnail</Label>
              <div
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors ${mutation.isPending ? 'cursor-not-allowed bg-muted/20' : 'cursor-pointer bg-muted/50 hover:bg-muted'}`}
                onDragOver={mutation.isPending ? undefined : handleDragOver}
                onDrop={mutation.isPending ? undefined : handleDrop}
                onClick={mutation.isPending ? undefined : () => fileInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <>
                    <Image src={thumbnailPreview} alt="Thumbnail Preview" layout="fill" className="object-cover rounded-lg" />
                    {!mutation.isPending && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white font-semibold">Click or drag to change</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4">
                    <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">PNG, JPG, or GIF (max 10MB). 16:9 recommended.</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={mutation.isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-tags" className="font-medium text-sm">Tags (Optional)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="content-tags" placeholder="Comma-separated, e.g., science, physics" value={tags} onChange={(e) => setTags(e.target.value)} className="pl-9" disabled={mutation.isPending} />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 mt-2 border-t flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="w-full sm:w-auto sm:max-w-xs">
              {errorMessage && (
                <div className="flex items-center gap-2 text-sm text-destructive font-medium p-2 rounded-md bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end w-full sm:w-auto">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !title || !thumbnailFile}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePlus className="mr-2 h-4 w-4" />}
                {mutation.isPending ? "Creating..." : "Create Content"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
