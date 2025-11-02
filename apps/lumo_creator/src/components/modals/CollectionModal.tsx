"use client";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderPlus, Loader2, AlertTriangle } from "lucide-react";

// --- Type for the mutation payload ---
interface CreateCollectionPayload {
  title: string;
  description: string;
  parentId: string | null;
}

// --- API call logic extracted into its own function ---
const createCollection = async (payload: CreateCollectionPayload) => {
  const res = await fetch("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json();
    // Throwing an error here will be caught by useMutation's `onError`
    throw new Error(errData.message || "Failed to create collection.");
  }

  return res.json();
};


interface CollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // This will typically invalidate the query in the parent component
  parentId: string | null;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  parentId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // --- useMutation hook replaces useState for processing and error ---
  const mutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      onSuccess(); // Invalidate queries in the parent component
      onOpenChange(false); // Close the modal
    },
    // onError is handled automatically by the `error` property of the hook
  });

  // Resets the form state when the modal is closed
  const resetState = () => {
    setTitle("");
    setDescription("");
    mutation.reset(); // Resets mutation state (isPending, error, etc.)
  };
  
  // When the modal is closed, reset everything
  useEffect(() => {
    if (!open) {
      // Use a timeout to avoid seeing the state reset before the closing animation finishes
      const timer = setTimeout(() => {
        resetState();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      // For simple client-side validation, we can just return
      // A more robust solution might use a form library (e.g., react-hook-form)
      return;
    }
    const collectionPayload = { title, description, parentId };
    mutation.mutate(collectionPayload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FolderPlus className="h-7 w-7 text-blue-500" />
            Create New Collection
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            Collections act like folders to help you organize your content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="collection-title" className="font-medium text-sm">
                Title
              </Label>
              <Input
                id="collection-title"
                placeholder="e.g., Introduction to JavaScript"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description" className="font-medium text-sm">
                Description (Optional)
              </Label>
              <Textarea
                id="collection-description"
                placeholder="A brief summary of what this collection contains..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <DialogFooter className="p-6 mt-2 border-t flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="w-full sm:w-auto sm:max-w-xs">
              {mutation.isError && (
                <div className="flex items-center gap-2 text-sm text-destructive font-medium p-2 rounded-md bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <p>{mutation.error.message}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end w-full sm:w-auto">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || !title.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FolderPlus className="mr-2 h-4 w-4" />
                )}
                {mutation.isPending ? "Creating..." : "Create Collection"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
