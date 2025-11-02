"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload } from "lucide-react";
import { SearchResults } from "./SearchResults";
import { IMediaData } from "@/models/Media";
import { useDebounce } from "@/hooks/use-debounce";

interface MediaHeaderProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onApplyFilter: () => void;
  onSelectSearchResult: (media: IMediaData) => void;
  onUploadClick: () => void;
}

export function MediaHeader({
  inputValue, onInputChange, onApplyFilter, onSelectSearchResult, onUploadClick
}: MediaHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  // --- FIX: Use a robust focus management approach ---
  // When focus enters this container (e.g., clicking the input), open the search.
  const handleFocus = () => setIsSearchOpen(true);
  
  // When focus leaves this container entirely, close the search.
  // This allows clicks inside the SearchResults component without closing it.
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // `currentTarget` is the div, `relatedTarget` is the element receiving focus.
    // If the relatedTarget is NOT inside the currentTarget, then we can close.
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
      <div className="flex w-full md:w-auto items-center gap-2">
        {/* --- FIX: The search container now manages focus --- */}
        <div 
          className="relative flex-1"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or tag..."
            className="pl-8 w-full md:w-64 lg:w-80"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
          />
          {/* The dropdown's visibility is now controlled by isSearchOpen */}
          {isSearchOpen && inputValue && (
            <SearchResults searchTerm={debouncedSearchTerm} onSelect={onSelectSearchResult} />
          )}
        </div>
        
        <Button onClick={onApplyFilter} variant="secondary">
          <Search className="mr-2 h-4 w-4" /> Filter
        </Button>

        <Button onClick={onUploadClick}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>
    </div>
  );
}
