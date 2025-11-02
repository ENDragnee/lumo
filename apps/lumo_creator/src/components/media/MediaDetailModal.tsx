//@/components/media/MediaDetailModal
"use client";

import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IMediaData } from "@/models/Media";
import { format } from "date-fns";
import { Trash2, Download, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatBytes } from '@/lib/utils'; // We will create this helper

interface MediaDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: IMediaData | null;
  onSuccess: () => void;
}

const deleteMedia = async (mediaId: string) => {
  const res = await fetch(`/api/media/${mediaId}`, { method: 'DELETE' });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Failed to delete media.');
  }
  return res.json();
};

export function MediaDetailModal({ open, onOpenChange, media, onSuccess }: MediaDetailModalProps) {
  const mutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      toast.success("Media deleted successfully.");
      onSuccess();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!media) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 p-0">
        <div className="relative aspect-square md:aspect-auto">
          <Image src={media.path} alt={media.filename} fill className="object-contain bg-muted/30" />
        </div>
        <div className="flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl break-all">{media.filename}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-sm text-muted-foreground flex-1">
            <p><strong>Type:</strong> {media.mediaType.charAt(0).toUpperCase() + media.mediaType.slice(1)}</p>
            <p><strong>Uploaded:</strong> {format(new Date(media.createdAt), "PPP")}</p>
            <p><strong>Size:</strong> {formatBytes(media.mediaSize)}</p>
            {media.tag && <p><strong>Tag:</strong> <span className="px-2 py-1 bg-secondary rounded-full text-secondary-foreground">{media.tag}</span></p>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <a href={media.path} download={media.filename}><Download className="mr-2 h-4 w-4" /> Download</a>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={mutation.isPending}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the media file from the servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {mutation.isError && (
                    <div className="flex items-center gap-2 text-sm text-destructive font-medium p-3 rounded-md bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <p>{mutation.error.message}</p>
                    </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => mutation.mutate(media._id)} disabled={mutation.isPending} className="bg-destructive hover:bg-destructive/90">
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
