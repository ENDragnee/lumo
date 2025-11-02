"use client";

import { useQuery } from "@tanstack/react-query";
import { IMediaData } from "@/models/Media";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search } from "lucide-react";

// This fetcher is specialized for quick search results
const fetchSearchResults = async (searchTerm: string): Promise<IMediaData[]> => {
  if (!searchTerm) return [];
  const params = new URLSearchParams({ search: searchTerm, limit: '5' }); // Fetch max 5 results for dropdown
  const res = await fetch(`/api/media?${params.toString()}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return data.data.media || [];
};

interface SearchResultsProps {
  searchTerm: string;
  onSelect: (media: IMediaData) => void;
}

export function SearchResults({ searchTerm, onSelect }: SearchResultsProps) {
  const { data: results, isLoading } = useQuery({
    queryKey: ['mediaSearch', searchTerm],
    queryFn: () => fetchSearchResults(searchTerm),
    enabled: !!searchTerm, // Only run query if searchTerm is not empty
  });

  return (
    <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      {isLoading && (
        <div className="p-4 flex items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
        </div>
      )}
      {!isLoading && !results?.length && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No results found.
        </div>
      )}
      {!isLoading && results && results.length > 0 && (
        <div className="p-2">
          {results.map((media) => (
            <button
              key={media._id}
              onClick={() => onSelect(media)}
              className="w-full flex items-center gap-3 p-2 text-left rounded-md hover:bg-muted transition-colors"
            >
              <Avatar className="h-9 w-9 rounded-md">
                <AvatarImage src={media.path} alt={media.filename} />
                <AvatarFallback className="rounded-md"><Search /></AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{media.filename}</p>
                {media.tag && <p className="text-xs text-muted-foreground truncate">{media.tag}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
