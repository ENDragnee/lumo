// RENAME this file to src/app/home/[[...slug]]/page.tsx
"use client";

import React, { useState, useMemo, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Folder, Loader2, Edit, Trash2, MoreVertical, FileText, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DriveItem, HomePageCollection, HomePageContent } from "@/types/drive";
import { CollectionCard } from "@/components/cards/CollectionCard";
import { ContentCard } from "@/components/cards/ContentCard";
import { CollectionCardList } from "@/components/cards/CollectionCardList";
import { ContentCardList } from "@/components/cards/ContentCardList";
import { CollectionModal } from "@/components/modals/CollectionModal";
import { ContentModal } from "@/components/modals/ContentModal";
import { EditItemModal } from "@/components/modals/EditItemModal";
import { DeleteItemModal } from "@/components/modals/DeleteItemModal";
import { DriveHeader } from "@/components/layout/DriveHeader";
import { useAppSelector } from "@/app/store/hooks";
import { RootState } from "@/app/store/store";
import { ErrorFallback } from "@/components/error-fallback";
import { StatCard } from "@/components/layout/StatCard";
import { AlphabetNav } from "@/components/layout/AlphabetNav";

interface Breadcrumb {
  id: string | null;
  title: string;
}

interface DriveData {
  collections: HomePageCollection[];
  content: HomePageContent[];
  breadcrumbs: Breadcrumb[];
}

const fetchDriveData = async (collectionId: string | null): Promise<DriveData> => {
  if (collectionId) {
    // Logic for fetching a specific collection
    const res = await fetch(`/api/collections/${collectionId}`);
    if (!res.ok) throw new Error("Failed to fetch collection contents.");
    const response = await res.json();
    const currentCollection = response.data;

    // Construct breadcrumbs from the API response
    const homeCrumb: Breadcrumb = { id: null, title: "My Home" };
    const ancestorCrumbs: Breadcrumb[] = (currentCollection.path || [])
      .map((p: { _id: string; title: string }) => ({ id: p._id, title: p.title }))
      .reverse(); // Reverse to get Home > Parent > Child order
    const currentCrumb: Breadcrumb = { id: currentCollection._id, title: currentCollection.title };
    
    return {
      collections: currentCollection.childCollections || [],
      content: currentCollection.childContent || [],
      breadcrumbs: [homeCrumb, ...ancestorCrumbs, currentCrumb],
    };
  } else {
    // Logic for fetching the root directory
    const [collectionRes, contentRes] = await Promise.all([
      fetch(`/api/collections?parentId=null`),
      fetch(`/api/content?parentId=null`),
    ]);
    if (!collectionRes.ok || !contentRes.ok) throw new Error("Failed to fetch root data.");
    const collectionData = await collectionRes.json();
    const contentData = await contentRes.json();
    return {
      collections: collectionData.data || [],
      content: contentData.data || [],
      breadcrumbs: [{ id: null, title: "My Home" }],
    };
  }
};

interface RouteParam {
  params: Promise<{ slug?: string[]}>;
}
export default function DrivePage({ params }: RouteParam) {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Determine the current collection ID from the URL slug.
  // For `/home`, slug is undefined -> currentId is null.
  // For `/home/[collectionId]`, slug is ['collectionId'] -> currentId is 'collectionId'.
  const currentCollectionId = use(params).slug?.[0] || null;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("all");
  const [sortTerm, setSortTerm] = useState("updatedAt-desc");
  const viewMode = useAppSelector((state: RootState) => state.view.viewMode);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["driveItems", currentCollectionId],
    queryFn: () => fetchDriveData(currentCollectionId),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  const { processedCollections, processedContent } = useMemo(() => {
    // No changes needed in this memoized calculation
    if (!data) return { processedCollections: [], processedContent: [] };
    const sortItems = <T extends DriveItem>(items: T[]): T[] => {
      return [...items].sort((a, b) => {
        switch (sortTerm) {
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'createdAt-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'updatedAt-desc':
          default:
            const modDateA = new Date(a.type === 'collection' ? a.updatedAt : a.lastModifiedAt || a.createdAt).getTime();
            const modDateB = new Date(b.type === 'collection' ? b.updatedAt : b.lastModifiedAt || b.createdAt).getTime();
            return modDateB - modDateA;
        }
      });
    };
    const searchedCollections = searchTerm
      ? data.collections.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : data.collections;
    const searchedContent = searchTerm
      ? data.content.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : data.content;
    return {
      processedCollections: sortItems(searchedCollections.map(c => ({...c, type: 'collection' as const}))),
      processedContent: sortItems(searchedContent.map(c => ({...c, type: 'content' as const}))),
    };
  }, [data, searchTerm, sortTerm]);

  // --- UPDATED: Navigation Handlers now use Next.js Router ---
  const handleCollectionClick = useCallback((collectionId: string) => {
    router.push(`/home/${collectionId}`);
    setSearchTerm(""); // Clear search on navigation
  }, [router]);

  const handleBreadcrumbClick = useCallback((crumbId: string | null) => {
    setSearchTerm("");
    if (crumbId === null) {
      router.push('/home');
    } else {
      router.push(`/home/${crumbId}`);
    }
  }, [router]);

  const handleLetterClick = useCallback((letter: string) => {
    const allVisibleItems = [
        ...(filterTerm === 'all' || filterTerm === 'collection' ? processedCollections : []),
        ...(filterTerm === 'all' || filterTerm === 'content' ? processedContent : []),
    ];
    const firstMatch = allVisibleItems.find(item => {
      const firstChar = item.title.charAt(0).toUpperCase();
      if (letter === '#') { return !/^[A-Z]$/.test(firstChar); }
      return firstChar === letter;
    });
    if (firstMatch) {
      const element = document.getElementById(`item-${firstMatch._id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filterTerm, processedCollections, processedContent]);

  const openEditModal = useCallback((item: DriveItem) => { setSelectedItem(item); setIsEditModalOpen(true); }, []);
  const openDeleteModal = useCallback((item: DriveItem) => { setSelectedItem(item); setIsDeleteModalOpen(true); }, []);
  const refreshData = useCallback(() => { queryClient.invalidateQueries({ queryKey: ["driveItems", currentCollectionId] }); }, [queryClient, currentCollectionId]);

  const ItemActions = ({ item }: { item: DriveItem }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="h-8 w-8 rounded-full data-[state=open]:bg-muted"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onSelect={() => openEditModal(item)} className="gap-2"><Edit className="h-4 w-4" /> Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openDeleteModal(item)} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="h-4 w-4" /> Move to Trash</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const breadcrumbs = data?.breadcrumbs || (currentCollectionId 
    ? [{ id: null, title: "My Home" }, { id: currentCollectionId, title: "Loading..." }]
    : [{ id: null, title: "My Home" }]);

  if (status === "loading" || (isLoading && !data)) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DriveHeader
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={(crumbId, _index) => handleBreadcrumbClick(crumbId)}
        onNewCollection={() => setIsCollectionModalOpen(true)}
        onNewContent={() => setIsContentModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterTerm={filterTerm}
        onFilterChange={setFilterTerm}
        sortTerm={sortTerm}
        onSortChange={setSortTerm}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          {isError ? (
            <div className="pt-10"><ErrorFallback error={error} onRetry={() => refetch()} /></div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Collections" value={data?.collections.length || 0} icon={Folder} iconBgColor="bg-blue-100 dark:bg-blue-900/40" />
                <StatCard title="Total Content" value={data?.content.length || 0} icon={FileText} iconBgColor="bg-green-100 dark:bg-green-900/40" />
              </div>

              {isLoading && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}

              {/* Collections Section */}
              {!isLoading && (filterTerm === 'all' || filterTerm === 'collection') && data?.collections && data.collections.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Collections</h2>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                      {processedCollections.map((item, index) => (
                         <div key={item._id} id={`item-${item._id}`}>
                          <CollectionCard item={item} index={index} onItemClick={handleCollectionClick} actionNode={<ItemActions item={item} />} />
                         </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {processedCollections.map((item, index) => (
                        <div key={item._id} id={`item-${item._id}`}>
                          <CollectionCardList item={item} index={index} onItemClick={handleCollectionClick} actionNode={<ItemActions item={item} />} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Content Section */}
              {!isLoading && (filterTerm === 'all' || filterTerm === 'content') && data?.content && data.content.length > 0 && (
                 <section>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Content</h2>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                      {processedContent.map((item, index) => (
                         <div key={item._id} id={`item-${item._id}`}>
                          <ContentCard item={item} index={index} actionNode={<ItemActions item={item} />} />
                         </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {processedContent.map((item, index) => (
                        <div key={item._id} id={`item-${item._id}`}>
                          <ContentCardList item={item} index={index} actionNode={<ItemActions item={item} />} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Empty State */}
              {!isLoading && processedCollections.length === 0 && processedContent.length === 0 && (
                <div className="text-center py-20 text-muted-foreground flex flex-col items-center">
                  <FolderOpen className="h-24 w-24 mx-auto mb-4 opacity-30" />
                  <p className="text-xl font-medium">
                    {searchTerm || filterTerm !== 'all' ? 'No matching items found' : 'This folder is empty'}
                  </p>
                  <p className="text-sm mt-1">
                    {searchTerm || filterTerm !== 'all' ? 'Try adjusting your search or filters.' : 'Create a new collection or content to get started.'}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
        
        {!isLoading && (processedCollections.length > 0 || processedContent.length > 0) && <AlphabetNav onLetterClick={handleLetterClick} />}
      </div>
      
      <CollectionModal open={isCollectionModalOpen} onOpenChange={setIsCollectionModalOpen} onSuccess={refreshData} parentId={currentCollectionId} />
      <ContentModal open={isContentModalOpen} onOpenChange={setIsContentModalOpen} onSuccess={refreshData} parentId={currentCollectionId} />
      <EditItemModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} onSuccess={refreshData} item={selectedItem} />
      <DeleteItemModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} onSuccess={refreshData} item={selectedItem} />
    </div>
  );
}
