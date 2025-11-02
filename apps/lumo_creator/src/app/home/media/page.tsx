//@/app/home/media
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IMediaData } from "@/models/Media";
import { StatCard } from "@/components/layout/StatCard";
import { Image as ImageIcon, HardDrive, FolderOpen, Loader2, Search } from "lucide-react";
import { ErrorFallback } from "@/components/error-fallback";
import { MediaCard } from "@/components/media/MediaCard";
import { MediaUploadModal } from "@/components/media/MediaUploadModal";
import { MediaDetailModal } from "@/components/media/MediaDetailModal";
import { MediaHeader } from "@/components/media/MediaHeader";
import { formatBytes } from "@/lib/utils";
import { PaginationControls } from "@/components/ui/pagination-controls";

const fetchUserMedia = async (searchTerm: string, page: number, limit: number) => {
  const params = new URLSearchParams({ search: searchTerm, page: String(page), limit: String(limit) });
  const res = await fetch(`/api/media?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch media.');
  }
  const responseData = await res.json();
  return responseData.data;
};

const MAX_STORAGE_BYTES = 21474836480;
const ITEMS_PER_PAGE = 12;

export default function MediaManagerPage() {
  const queryClient = useQueryClient();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<IMediaData | null>(null);
  
  // --- NEW: Separate states for live input and applied filter ---
  const [inputValue, setInputValue] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when the *applied filter* changes
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearchTerm]);

  // The main page query now depends on the `appliedSearchTerm`
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userMedia', appliedSearchTerm, currentPage],
    queryFn: () => fetchUserMedia(appliedSearchTerm, currentPage, ITEMS_PER_PAGE),
    staleTime: 5 * 60 * 1000,
  });

  const { mediaItems, pagination, totalStorageUsed } = useMemo(() => {
    const items = data?.media || [];
    const pageInfo = data?.pagination;
    const storage = pageInfo?.totalStorageUsed || 0;
    return { mediaItems: items, pagination: pageInfo, totalStorageUsed: storage };
  }, [data]);

  const handleOpenDetail = useCallback((media: IMediaData) => {
    setSelectedMedia(media);
    setIsDetailModalOpen(true);
  }, []);

  const handleMutationSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['userMedia'] });
  }, [queryClient]);
  
  // --- NEW: Handler for the "Filter" button ---
  const handleApplyFilter = () => {
    setAppliedSearchTerm(inputValue);
  };
  
  // --- NEW: Handler for when a user clicks a result in the search dropdown ---
  const handleSelectSearchResult = (media: IMediaData) => {
    handleOpenDetail(media);
    setInputValue(""); // Clear the search input
  };

  if (isLoading && !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <MediaHeader
          inputValue={inputValue}
          onInputChange={setInputValue}
          onApplyFilter={handleApplyFilter}
          onSelectSearchResult={handleSelectSearchResult}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />

        {isError ? (
          <div className="pt-10"><ErrorFallback error={error} onRetry={() => refetch()} /></div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard title="Total Files" value={pagination?.totalItems || 0} icon={ImageIcon} />
              <StatCard title="Storage Used" value={formatBytes(totalStorageUsed)} icon={HardDrive} />
              <StatCard title="Storage Remaining" value={formatBytes(MAX_STORAGE_BYTES - totalStorageUsed)} icon={HardDrive} iconBgColor="bg-green-100 dark:bg-green-900/30" />
            </div>

            {isLoading && (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            )}

            {!isLoading && mediaItems && mediaItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-4">
                {mediaItems.map((media: IMediaData) => (
                  <MediaCard key={media._id} media={media} onClick={() => handleOpenDetail(media)} />
                ))}
              </div>
            )}
            
            {!isLoading && (!mediaItems || mediaItems.length === 0) && (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center border-2 border-dashed rounded-lg mt-8">
                  {appliedSearchTerm ? <Search className="h-24 w-24 mx-auto mb-4 opacity-30" /> : <FolderOpen className="h-24 w-24 mx-auto mb-4 opacity-30" />}
                  <p className="text-xl font-medium">{appliedSearchTerm ? "No results found" : "Your library is empty"}</p>
                  <p className="text-sm mt-1">{appliedSearchTerm ? `No media matching "${appliedSearchTerm}" was found.` : "Upload your first image to get started."}</p>
              </div>
            )}

            {!isLoading && pagination && (
              <div className="pt-4">
                <PaginationControls 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <MediaUploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} onSuccess={handleMutationSuccess} />
      <MediaDetailModal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} media={selectedMedia} onSuccess={handleMutationSuccess} />
    </>
  );
}
