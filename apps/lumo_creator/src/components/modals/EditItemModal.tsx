//@/components/modals/EditItemModal
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Edit as EditIcon, Image as ImageIcon, Loader2, Save, Tag, AlertTriangle } from "lucide-react";

type EditModalItem = {
  _id: string;
  type: "collection" | "content";
  title: string;
  thumbnail?: string | null;
  description?: string;
  tags?: string[];
  genre?: string;
};

// --- Type for the mutation payload ---
interface UpdateItemPayload {
  item: EditModalItem;
  title: string;
  description?: string;
  tags?: string;
  genre?: string;
  thumbnailFile?: File | null;
}

// --- API logic is now self-contained in a single function ---
const updateItem = async (payload: UpdateItemPayload) => {
  const { item, title, description, tags, genre, thumbnailFile } = payload;
  let newThumbnailId: string | undefined = undefined;

  // 1. If a new thumbnail is provided, upload it first
  if (thumbnailFile && item.type === 'content') {
    const mediaFormData = new FormData();
    mediaFormData.append("file", thumbnailFile);
    const mediaRes = await fetch("/api/media", { method: "POST", body: mediaFormData });
    if (!mediaRes.ok) {
        const err = await mediaRes.json();
        throw new Error(err.message || "New thumbnail upload failed.");
    }
    const mediaData = await mediaRes.json();
    if (!mediaData.success || !mediaData.data?._id) {
        throw new Error(mediaData.message || "Could not get new thumbnail ID.");
    }
    newThumbnailId = mediaData.data._id;
  }
  
  // 2. Prepare the data payload for the PUT request
  const endpoint = item.type === 'collection' ? `/api/collections/${item._id}` : `/api/content/${item._id}`;
  const dataToSave: any = { title };
  
  if (tags !== undefined) {
    dataToSave.tags = tags.split(",").map(t => t.trim()).filter(Boolean);
  }

  if (item.type === 'collection') {
    dataToSave.description = description;
    dataToSave.genre = genre;
  } else { // For 'content'
    if (newThumbnailId) dataToSave.thumbnail = newThumbnailId;
  }
  
  // 3. Make the final PUT request to update the item
  const updateRes = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSave),
  });

  if (!updateRes.ok) {
    const errData = await updateRes.json();
    throw new Error(errData.message || "Failed to save changes.");
  }

  return updateRes.json();
};

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EditModalItem | null;
  onSuccess: () => void;
}

export function EditItemModal({ open, onOpenChange, item, onSuccess }: EditItemModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [genre, setGenre] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
  });
  
  const resetState = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setGenre("");
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setClientError(null);
    mutation.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Populate form when modal opens with a valid item
  useEffect(() => {
    if (item && open) {
      setTitle(item.title);
      setTags(item.tags?.join(", ") || "");
      setThumbnailPreview(item.thumbnail || null);
      if (item.type === 'collection') {
        setDescription(item.description || "");
        setGenre(item.genre || "");
      }
    }
  }, [item, open]);

  // Reset all state when modal closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => resetState(), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setClientError("Please select a valid image file.");
        return;
      }
      setThumbnailFile(file);
      setClientError(null);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (!title.trim()) {
        setClientError("Title cannot be empty.");
        return;
    }
    setClientError(null);
    mutation.mutate({ item, title, description, tags, genre, thumbnailFile });
  };

  if (!item) return null;
  
  const isProcessing = mutation.isPending;
  const errorMessage = clientError || mutation.error?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <EditIcon className="h-7 w-7 text-green-500" />
            Edit {item.type === 'collection' ? 'Collection' : 'Content'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1 truncate">
            Making changes to "{item.title}".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="font-medium text-sm">Title</Label>
              <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isProcessing} />
            </div>

            {item.type === 'content' && (
              <div className="space-y-2">
                <Label className="font-medium text-sm">Thumbnail</Label>
                <div className="flex items-end gap-4">
                  {thumbnailPreview ? (
                    <div className="relative w-40 h-[90px] rounded-md border bg-muted overflow-hidden">
                       <Image src={thumbnailPreview} alt="Current thumbnail" layout="fill" className="object-cover" />
                    </div>
                  ) : <div className="w-40 h-[90px] rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-sm">No Thumbnail</div>}
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isProcessing} />
                </div>
              </div>
            )}
            
            {item.type === 'collection' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="font-medium text-sm">Description (Optional)</Label>
                  <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A brief summary..." disabled={isProcessing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-genre" className="font-medium text-sm">Genre (Optional)</Label>
                  <Input id="edit-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g., Learning, Sci-Fi" disabled={isProcessing} />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-tags" className="font-medium text-sm">Tags (Optional)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="edit-tags" placeholder="Comma-separated tags" value={tags} onChange={(e) => setTags(e.target.value)} className="pl-9" disabled={isProcessing} />
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
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
              <Button type="submit" disabled={isProcessing || !title.trim()} className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isProcessing ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
