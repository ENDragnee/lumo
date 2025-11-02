//@/components/media/MediaUploadModal
"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// API call logic
const uploadMedia = async (formData: FormData) => {
  const res = await fetch('/api/media', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'File upload failed.');
  }
  return res.json();
};

interface MediaUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MediaUploadModal({ open, onOpenChange, onSuccess }: MediaUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const mutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: () => {
      toast.success("Media uploaded successfully!");
      onSuccess();
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Invalid file type. Please select an image.");
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleClose = () => {
    if (mutation.isPending) return;
    setFile(null);
    setTag('');
    setPreview(null);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tag', tag);
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload New Media</DialogTitle>
          <DialogDescription>Drag and drop an image or click to browse.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={cn(
              "w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground transition-colors",
              isDragging ? "border-primary bg-primary/10" : "border-border"
            )}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-md p-2" />
            ) : (
              <>
                <UploadCloud className="h-10 w-10 mb-2" />
                <p>Drag & drop image here</p>
                <p className="text-xs">or</p>
                <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <label htmlFor="file-upload">Click to browse</label>
                </Button>
                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Tag (Optional)</Label>
            <Input id="tag" placeholder="e.g., character, landscape" value={tag} onChange={(e) => setTag(e.target.value)} />
          </div>

          {mutation.isError && (
             <div className="flex items-center gap-2 text-sm text-destructive font-medium p-3 rounded-md bg-destructive/10">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <p>{mutation.error.message}</p>
             </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={mutation.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!file || mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
