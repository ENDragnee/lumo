"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Search, X, Folder, FileText, Loader2, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

// Import shared types and modals
import { DriveItem } from '@/types/drive';
import { ContentModal } from '@/components/modals/ContentModal';
import { CollectionModal } from '@/components/modals/CollectionModal'; // REFACTORED
import { EditItemModal } from '@/components/modals/EditItemModal';
import { DeleteItemModal } from '@/components/modals/DeleteItemModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

// --- TYPE DEFINITIONS ---
interface StudioTreeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onContentSelect: (contentId: string) => void;
}

interface SidebarLevelProps {
    parentId: string | null;
    level: number;
    searchQuery: string;
    onContentClick: (contentId: string) => void;
    onEditItem: (item: DriveItem) => void;
    onDeleteItem: (item: DriveItem) => void;
    setParentForNewItem: (parentId: string | null) => void;
}

// --- API Fetcher for a Sidebar Level ---
const fetchSidebarLevelItems = async (parentId: string | null): Promise<DriveItem[]> => {
    const parentQuery = `?parentId=${parentId ?? 'null'}`;
    const [collectionRes, contentRes] = await Promise.all([
        fetch(`/api/collections${parentQuery}`), // REFACTORED
        fetch(`/api/content${parentQuery}`),
    ]);
    if (!collectionRes.ok || !contentRes.ok) throw new Error("Failed to fetch library items.");

    const collectionsData = await collectionRes.json();
    const contentData = await contentRes.json();
    
    // Combine and sort alphabetically by title
    return [
        ...(collectionsData.data || []),
        ...(contentData.data || [])
    ].sort((a, b) => a.title.localeCompare(b.title));
};


// --- RECURSIVE FILE TREE LEVEL COMPONENT (Refactored with React Query) ---
const SidebarLevel: React.FC<SidebarLevelProps> = ({ parentId, level, searchQuery, onContentClick, onEditItem, onDeleteItem, setParentForNewItem }) => {
    const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());

    // --- REFACTOR: Data fetching is now declarative with useQuery ---
    const { data: items = [], isLoading, isError } = useQuery<DriveItem[], Error>({
        queryKey: ['sidebarLevel', parentId], // Unique key for this level's data
        queryFn: () => fetchSidebarLevelItems(parentId),
    });

    const toggleCollectionExpansion = (collectionId: string) => {
        setExpandedCollections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(collectionId)) newSet.delete(collectionId);
            else newSet.add(collectionId);
            return newSet;
        });
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indentStyle = { paddingLeft: `${level * 1.25 + 0.5}rem` };

    if (isLoading) return <div className="flex items-center p-2 text-sm text-muted-foreground" style={indentStyle}><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</div>;
    if (isError) return <div className="p-2 text-xs text-destructive" style={indentStyle}>Failed to load</div>;
    if (!isLoading && items.length === 0 && level > 0 && !searchQuery) return <div className="p-1.5 text-xs text-muted-foreground" style={indentStyle}>Empty folder</div>;
    
    return (
        <ul className="space-y-0.5">
            {filteredItems.map(item => {
                const isCollection = item.type === 'collection'; // REFACTORED
                const isExpanded = isCollection && expandedCollections.has(item._id);
                return (
                    <li key={item._id} className="group/item relative rounded-md">
                        {/* Right-click or long-press can also trigger this for better UX */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    role="button"
                                    onClick={() => isCollection ? toggleCollectionExpansion(item._id) : onContentClick(item._id)}
                                    className={cn(
                                        "flex items-center justify-between w-full hover:bg-muted rounded-md text-sm pr-1", // Added pr-1
                                        isCollection ? "font-medium text-foreground" : "font-normal text-muted-foreground hover:text-foreground"
                                    )}
                                    style={indentStyle}
                                >
                                    <div className="flex items-center gap-2 py-1.5 truncate">
                                        {isCollection && <ChevronRight className={cn('h-4 w-4 transition-transform duration-200 shrink-0', isExpanded && 'rotate-90')} />}
                                        {isCollection ? <Folder className="h-4 w-4 text-blue-500 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/item:opacity-100 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onSelect={() => onEditItem(item)} className="gap-2"><Edit className="h-4 w-4" /> Rename</DropdownMenuItem>
                                {isCollection && (
                                    <>
                                        <DropdownMenuItem onSelect={() => setParentForNewItem(item._id)} className="gap-2"><Plus className="h-4 w-4" /> New Item Here</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => toggleCollectionExpansion(item._id)} className="gap-2"><ChevronRight className="h-4 w-4"/> {isExpanded ? 'Collapse' : 'Expand'}</DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => onDeleteItem(item)} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                    <SidebarLevel {...{ parentId: item._id, level: level + 1, searchQuery, onContentClick, onEditItem, onDeleteItem, setParentForNewItem }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </li>
                );
            })}
        </ul>
    );
};

// --- MAIN SIDEBAR COMPONENT (Refactored with React Query) ---
export function StudioTreeSidebar({ isOpen, onClose, onContentSelect }: StudioTreeSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const queryClient = useQueryClient();
    
    const [modalState, setModalState] = useState<{
        isCollectionOpen: boolean; // REFACTORED
        isContentOpen: boolean;
        isEditOpen: boolean;
        isDeleteOpen: boolean;
        selectedItem: DriveItem | null;
        parentForNew: string | null;
    }>({
        isCollectionOpen: false, // REFACTORED
        isContentOpen: false,
        isEditOpen: false,
        isDeleteOpen: false,
        selectedItem: null,
        parentForNew: null,
    });
    
    // --- REFACTOR: Mutation for deleting items ---
    const deleteItemMutation = useMutation({
        mutationFn: async (item: DriveItem) => {
            const endpoint = item.type === 'collection' ? `/api/collections/${item._id}` : `/api/content/${item._id}`;
            const res = await fetch(endpoint, { method: 'DELETE' });
            if (!res.ok) throw new Error("Deletion failed");
        },
        onSuccess: (_, variables) => {
            // Invalidate the cache for the parent folder of the deleted item
            const parentId = (variables as any).parentId ?? null; // Get parentId from the item itself
            queryClient.invalidateQueries({ queryKey: ['sidebarLevel', parentId] });
        },
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleContentClick = (contentId: string) => {
        onContentSelect(contentId);
        if (isMobile) onClose();
    };

    // --- REFACTOR: Centralized success handler for mutations ---
    const handleMutationSuccess = (parentId: string | null) => {
        queryClient.invalidateQueries({ queryKey: ['sidebarLevel', parentId] });
    };

    const openEditModal = (item: DriveItem) => setModalState(s => ({ ...s, isEditOpen: true, selectedItem: item }));
    const openDeleteModal = (item: DriveItem) => setModalState(s => ({ ...s, isDeleteOpen: true, selectedItem: item }));
    const setParentForNewItem = (parentId: string | null) => setModalState(s => ({ ...s, isContentOpen: true, parentForNew: parentId }));

    const sidebarContent = (
        <div className="flex flex-col h-full bg-background border-r w-72">
            <div className="flex items-center justify-between p-2 border-b h-14 shrink-0">
                <Link href='/home'><h2 className="font-semibold text-lg px-2">Studio Library</h2></Link>
                {isMobile && <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>}
            </div>
            <div className="p-2 shrink-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button className="w-full gap-2"><Plus className="h-4 w-4"/>New</Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem onSelect={() => setModalState(s => ({ ...s, isContentOpen: true, parentForNew: null }))} className="gap-2 cursor-pointer"><FileText className="h-4 w-4"/>New Content</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setModalState(s => ({ ...s, isCollectionOpen: true, parentForNew: null }))} className="gap-2 cursor-pointer"><Folder className="h-4 w-4 text-blue-500"/>New Collection (Folder)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="p-2 shrink-0">
                <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2">
                    <SidebarLevel parentId={null} level={0} searchQuery={searchQuery} onContentClick={handleContentClick} onEditItem={openEditModal} onDeleteItem={openDeleteModal} setParentForNewItem={setParentForNewItem}/>
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    isMobile ? (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={onClose}/>
                            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 left-0 h-full z-50">
                                {sidebarContent}
                            </motion.aside>
                        </>
                    ) : (
                        <motion.aside initial={{ width: 0 }} animate={{ width: 288 }} exit={{ width: 0 }} transition={{ duration: 0.2 }} className="shrink-0 overflow-hidden">
                           {sidebarContent}
                        </motion.aside>
                    )
                )}
            </AnimatePresence>

            {/* Modals are now decoupled and simply invalidate queries on success */}
            <CollectionModal open={modalState.isCollectionOpen} onOpenChange={(open) => setModalState(s => ({ ...s, isCollectionOpen: open }))} onSuccess={() => handleMutationSuccess(modalState.parentForNew)} parentId={modalState.parentForNew} />
            <ContentModal open={modalState.isContentOpen} onOpenChange={(open) => setModalState(s => ({ ...s, isContentOpen: open }))} onSuccess={() => handleMutationSuccess(modalState.parentForNew)} parentId={modalState.parentForNew} />
            <EditItemModal open={modalState.isEditOpen} onOpenChange={(open) => setModalState(s => ({ ...s, isEditOpen: open }))} onSuccess={() => handleMutationSuccess((modalState.selectedItem as any)?.parentId ?? null)} item={modalState.selectedItem} />
            <DeleteItemModal open={modalState.isDeleteOpen} onOpenChange={(open) => setModalState(s => ({ ...s, isDeleteOpen: open }))} onConfirm={(item) => {
                if(item) deleteItemMutation.mutate(item);
            }} item={modalState.selectedItem} />
        </>
    );
}
