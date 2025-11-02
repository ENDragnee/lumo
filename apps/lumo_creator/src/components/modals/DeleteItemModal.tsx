// @/components/modals/DeleteItemModal.tsx
"use client";

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { DriveItem } from '@/types/drive';

// --- API call logic is now self-contained ---
const deleteItem = async (item: DriveItem) => {
  // Determine the correct API endpoint based on the item type
  const endpoint = item.type === 'collection' 
    ? `/api/collections/${item._id}` 
    : `/api/content/${item._id}`;

  const res = await fetch(endpoint, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Failed to move the item to trash.');
  }

  return res.json();
};


interface DeleteItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: DriveItem | null;
  onSuccess: () => void;
}

export function DeleteItemModal({ open, onOpenChange, item, onSuccess }: DeleteItemModalProps) {
  
  const mutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      onSuccess(); // Invalidate parent queries
      onOpenChange(false); // Close the modal
    },
    // onError is captured by mutation.error
  });

  if (!item) return null;

  const handleConfirm = () => {
    // The mutation will only be called if an item exists
    mutation.mutate(item);
  };

  const descriptionText = `Are you sure you want to move "${item.title}" to the trash? ${item.type === 'collection' ? 'Its contents will also be moved.' : ''} You can restore it later.`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <AlertTriangle className="h-7 w-7 text-destructive" />
            Move to Trash?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground pt-2 text-base">
            {descriptionText}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Display API error message if one occurs */}
        {mutation.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive font-medium p-3 rounded-md bg-destructive/10 mx-6">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p>{mutation.error.message}</p>
          </div>
        )}

        <AlertDialogFooter className="pt-4 gap-2 flex-col-reverse sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Moving..." : "Move to Trash"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
