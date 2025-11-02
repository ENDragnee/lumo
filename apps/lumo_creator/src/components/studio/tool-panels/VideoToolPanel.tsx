"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditor } from '@craftjs/core';
import { fetchMedia, removeMediaItem } from '@/app/store/slices/mediaSlice';
import { AppDispatch, RootState } from '@/app/store/store';
import { VideoComponent } from '@/components/editor-components/VideoComponent';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Video } from 'lucide-react';
import { VideoUploader } from './VideoUploader'; // Import the uploader

export function VideoToolPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: mediaItems, status } = useSelector((state: RootState) => state.media);
  const { connectors } = useEditor();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMedia());
    }
  }, [status, dispatch]);

  const videos = mediaItems.filter(item => item.mediaType === 'video');

  const handleDelete = async (mediaId: string) => {
    dispatch(removeMediaItem(mediaId));
    try {
      const response = await fetch(`/api/media/${mediaId}`, { method: 'DELETE' });
      if (!response.ok) {
        dispatch(fetchMedia());
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
      dispatch(fetchMedia());
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Video Library</h2>
      </div>
      <div className="p-4 border-b">
        <VideoUploader />
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <p className="text-sm text-muted-foreground mb-4">Drag a video onto the canvas.</p>
        {status === 'loading' && <Loader2 className="mx-auto my-8 animate-spin text-primary" />}
        {status === 'succeeded' && videos.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No videos found. Upload one to get started.</p>
        )}
        <div className="space-y-3">
          {videos.map(video => (
            <div key={video._id} className="relative group flex items-center gap-3 p-2 border rounded-lg">
              <div
                ref={(ref: HTMLDivElement) => {
                  if(ref){
                    connectors.create(ref, <VideoComponent src={video.path} />)
                  }
                }}
                className="flex-1 flex items-center gap-3 cursor-grab"
              >
                <div className="flex-shrink-0 h-10 w-10 bg-muted rounded flex items-center justify-center">
                    <Video className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium truncate flex-1" title={video.filename}>
                    {video.filename}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(video._id)}
                aria-label="Delete video"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
