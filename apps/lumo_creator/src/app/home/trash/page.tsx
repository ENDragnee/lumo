"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Undo, Trash2, Folder, FileText, AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// --- Type Definitions ---
interface TrashItem {
    _id: string;
    type: "book" | "content";
    title: string;
    thumbnail: string;
    updatedAt: string;
    createdAt: string;
    parentId: string | null;
}

interface TrashApiResponse {
    items: TrashItem[];
}

// --- API Functions for React Query ---
const fetchTrashedItems = async (): Promise<TrashApiResponse> => {
    const res = await fetch('/api/trash');
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to fetch trash items`);
    }
    return res.json();
};

const restoreItem = async (item: TrashItem): Promise<any> => {
    const res = await fetch(`/api/trash`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, type: item.type }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to restore item`);
    }
    return res.json();
};

const deleteItemPermanently = async (item: TrashItem): Promise<any> => {
    const res = await fetch(`/api/trash?id=${item._id}&type=${item.type}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to permanently delete item`);
    }
    return res.json();
};


// --- Main Page Component ---
export default function TrashPage() {
    const queryClient = useQueryClient();

    // --- Data Fetching with useQuery ---
    const { data, isLoading, isError, error } = useQuery<TrashApiResponse, Error>({
        queryKey: ['trash'],
        queryFn: fetchTrashedItems,
    });
    
    const items = data?.items || [];

    // --- Mutation for Restoring Items with Optimistic Update ---
    const restoreMutation = useMutation({
        mutationFn: restoreItem,
        onMutate: async (itemToRestore) => {
            await queryClient.cancelQueries({ queryKey: ['trash'] });
            const previousTrash = queryClient.getQueryData<TrashApiResponse>(['trash']);
            queryClient.setQueryData<TrashApiResponse>(['trash'], (old) => ({
                items: old?.items.filter(item => item._id !== itemToRestore._id) || [],
            }));
            return { previousTrash };
        },
        onError: (err, variables, context) => {
            if (context?.previousTrash) {
                queryClient.setQueryData(['trash'], context.previousTrash);
            }
            toast.error(`Failed to restore "${variables.title}": ${err.message}`);
        },
        onSuccess: (data, variables) => {
             toast.success(`"${variables.title}" has been restored.`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['trash'] });
        },
    });

    // --- Mutation for Permanently Deleting Items with Optimistic Update ---
    const deleteMutation = useMutation({
        mutationFn: deleteItemPermanently,
        onMutate: async (itemToDelete) => {
            await queryClient.cancelQueries({ queryKey: ['trash'] });
            const previousTrash = queryClient.getQueryData<TrashApiResponse>(['trash']);
            queryClient.setQueryData<TrashApiResponse>(['trash'], (old) => ({
                items: old?.items.filter(item => item._id !== itemToDelete._id) || [],
            }));
            return { previousTrash };
        },
        onError: (err, variables, context) => {
            if (context?.previousTrash) {
                queryClient.setQueryData(['trash'], context.previousTrash);
            }
            toast.error(`Failed to delete "${variables.title}": ${err.message}`);
        },
        onSuccess: (data, variables) => {
             toast.success(`"${variables.title}" has been permanently deleted.`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['trash'] });
        },
    });
    
    const isProcessing = restoreMutation.isPending || deleteMutation.isPending;

    return (
        <div className="flex-1 flex flex-col min-w-0 h-full bg-background text-foreground">
             <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b flex-shrink-0">
                <h1 className="text-xl font-semibold flex items-center gap-2">
                    <Trash2 className="h-5 w-5"/>
                    Trash
                </h1>
            </header>

             {isError && (
                <div className="p-3 mx-4 mt-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md text-sm flex items-center gap-2">
                     <AlertTriangle className="h-4 w-4 flex-shrink-0"/>
                     <span><span className="font-semibold">Error:</span> {error.message}</span>
                 </div>
            )}

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent px-4 sm:px-6 pb-6 pt-4">
                {isLoading && (
                    <ul className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <li key={i} className="flex items-center p-2 space-x-3 h-[68px]">
                                <Skeleton className="h-10 w-10 rounded flex-shrink-0" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-3/4 rounded" />
                                    <Skeleton className="h-3 w-1/2 rounded" />
                                </div>
                                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0 ml-auto mr-2" />
                                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                            </li>
                        ))}
                    </ul>
                )}

                {!isLoading && items.length === 0 && !isError && (
                     <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <Inbox className="h-16 w-16 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        <p className="font-medium">Trash is empty</p>
                        <p className="text-sm mt-1">Items moved to the trash will appear here.</p>
                    </div>
                )}

                 {!isLoading && items.length > 0 && (
                    <ul className="space-y-1">
                        {items.map((item) => {
                            const isItemRestoring = restoreMutation.isPending && restoreMutation.variables?._id === item._id;
                            const isItemDeleting = deleteMutation.isPending && deleteMutation.variables?._id === item._id;
                            
                            return (
                                <li key={item._id} className="group flex items-center p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150 min-h-[68px]">
                                    <div className="flex-shrink-0 w-10 h-10 mr-3 bg-gray-200 dark:bg-slate-600 rounded flex items-center justify-center overflow-hidden">
                                        {item.thumbnail && !item.thumbnail.includes('/placeholder-') ? (
                                            <Image src={item.thumbnail} alt="" width={24} height={24} className="object-contain w-6 h-6" />
                                        ) : (
                                            item.type === 'book'
                                                ? <Folder className="w-5 h-5 text-blue-500 dark:text-blue-400"/>
                                                : <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={item.title}>
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={`Trashed: ${new Date(item.updatedAt).toLocaleString()}`}>
                                            {item.type === 'book' ? 'Book' : 'Content'} - Trashed {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                                        </p>
                                    </div>

                                    <div className="ml-auto flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30" title="Restore" onClick={() => restoreMutation.mutate(item)} disabled={isProcessing}>
                                            {isItemRestoring ? <Loader2 className="h-4 w-4 animate-spin"/> : <Undo className="h-4 w-4" />}
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                 <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30" title="Delete Permanently" disabled={isProcessing}>
                                                    <Trash2 className="h-4 w-4" />
                                                 </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="flex items-center gap-2">
                                                        <AlertTriangle className="h-5 w-5 text-red-500"/>
                                                        Delete Permanently?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to permanently delete "{item.title}"?
                                                        {item.type === 'book' && " All content and sub-folders within this book will also be permanently deleted."}
                                                         This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel disabled={isItemDeleting}>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteMutation.mutate(item)} disabled={isItemDeleting}>
                                                        {isItemDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin"/>}
                                                        {isItemDeleting ? 'Deleting...' : 'Delete Permanently'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                 )}
            </div>
        </div>
    );
}
