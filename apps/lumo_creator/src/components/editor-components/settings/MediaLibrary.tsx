// @/components/editor-components/settings/MediaLibrary.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash-es';
import { Loader2, Search, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchMedia } from '@/app/store/slices/mediaSlice'; // Assumes you have this thunk
import { ImageUploader } from '../../studio/tool-panels/ImageUploader';
import { IMediaData } from '@/models/Media';
import clsx from 'clsx';
import Image from 'next/image';

interface MediaLibraryProps {
    onSelectImage: (path: string) => void;
    currentImageSrc: string | undefined;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelectImage, currentImageSrc }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: mediaItems, status, error } = useSelector((state: RootState) => state.media);
    const [searchTerm, setSearchTerm] = useState('');

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            // --- THIS IS THE CHANGE ---
            // Pass an object that matches the FetchMediaParams interface
            dispatch(fetchMedia({ tag: term }));
        }, 300),
        [dispatch]
    );

    useEffect(() => {
        // Fetch initial media on mount
        dispatch(fetchMedia());
    }, [dispatch]);

    useEffect(() => {
        debouncedSearch(searchTerm);
        // Cleanup debounce on unmount
        return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch]);

    const handleUploadComplete = () => {
        // After an upload, clear the search to show the new item at the top
        if (searchTerm) {
            setSearchTerm('');
        }
    };

    const renderContent = () => {
        if (status === 'loading' && mediaItems.length === 0) {
            return (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            );
        }

        if (status === 'failed') {
            return <p className="text-center text-destructive p-4">Error: {error}</p>;
        }

        if (mediaItems.length === 0) {
            return (
                <div className="text-center p-4 text-muted-foreground">
                    <p>No images found.</p>
                    <p className="text-sm">Try uploading one below!</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-1">
                {mediaItems.map((item: IMediaData) => (
                    <button
                        key={item._id}
                        onClick={() => onSelectImage(item.path)}
                        className={clsx(
                            "relative aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all",
                            {
                                "ring-2 ring-offset-2 ring-blue-600 shadow-lg": item.path === currentImageSrc,
                                "hover:scale-105 hover:shadow-md": item.path !== currentImageSrc
                            }
                        )}
                    >
                        <Image
                            src={item.path}
                            alt={item.tag || item.filename}
                            fill
                            sizes="(max-width: 768px) 33vw, 20vw"
                            className="object-cover"
                        />
                        {item.tag && (
                             <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5 truncate">
                                {item.tag}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold mb-2">Media Library</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by tag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                     {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <XCircle className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </button>
                    )}
                </div>
            </div>
            
            <ScrollArea className="flex-grow">
                {renderContent()}
            </ScrollArea>
            
            <div className="mt-auto border-t">
                <ImageUploader onUploadComplete={handleUploadComplete} />
            </div>
        </div>
    );
};
