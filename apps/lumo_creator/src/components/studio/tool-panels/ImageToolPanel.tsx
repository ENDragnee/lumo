"use client";

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditor } from '@craftjs/core';
import Image from 'next/image';

// Local/UI Imports
import { fetchMedia, removeMediaItem } from '@/app/store/slices/mediaSlice';
import { AppDispatch, RootState } from '@/app/store/store';
import { ImageComponent } from '@/components/editor-components/ImageComponent';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Trash2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

export function ImageToolPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: mediaItems, status } = useSelector((state: RootState) => state.media);
  const { connectors } = useEditor();

  // Fetch media on initial load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMedia());
    }
  }, [status, dispatch]);

  // Filter for only images
  const images = mediaItems.filter(item => item.mediaType === 'image');

  // Memoized delete handler
  const handleDelete = useCallback(async (mediaId: string) => {
    // Optimistically remove from UI
    dispatch(removeMediaItem(mediaId));
    
    try {
      const response = await fetch(`/api/media/${mediaId}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok || !result.success) {
        // If server-side deletion fails, revert the UI by refetching data
        console.error("Failed to delete on server:", result.message);
        dispatch(fetchMedia());
      }
    } catch (error) {
      console.error("Error during API call for deletion:", error);
      // Revert UI on network error etc.
      dispatch(fetchMedia());
    }
  }, [dispatch]);

  const handleUploadComplete = useCallback(() => {
    // Refresh the list after a successful upload
    dispatch(fetchMedia());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Image Library</h2>
        <p className="text-sm text-muted-foreground">Drag an image onto the canvas.</p>
      </div>

      <div className="p-4 border-b">
        {/* Pass the onUploadComplete callback to the uploader */}
        <ImageUploader onUploadComplete={handleUploadComplete} />
      </div>

      <ScrollArea className="flex-grow p-4">
        {status === 'loading' && images.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {status === 'succeeded' && images.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No images found. Upload one to get started.</p>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {images.map(image => (
            <div key={image._id} className="relative group">
              <div
                ref={(ref: HTMLDivElement | null) => {
                  if (ref) {
                    // This creates a dragger that, when dropped, creates an ImageComponent
                    connectors.create(ref, <ImageComponent src={image.path} />);
                  }
                }}
                className="cursor-grab aspect-square bg-muted rounded-md overflow-hidden border hover:border-primary transition-all"
              >
                {/* Use Next.js Image for performance optimization */}
                <Image
                  src={image.path}
                  alt={image.tag || image.filename}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => handleDelete(image._id)}
                aria-label="Delete image"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
