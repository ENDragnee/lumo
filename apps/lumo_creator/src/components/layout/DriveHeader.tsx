
"use client";

import React from "react";
import { ChevronRight, LayoutGrid, List, Plus, Folder, FileText, Search, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setViewMode } from "@/app/store/slices/viewSlice";
import { RootState } from "@/app/store/store";

interface Breadcrumb {
  id: string | null;
  title: string;
}

interface DriveHeaderProps {
  breadcrumbs: Breadcrumb[];
  onBreadcrumbClick: (crumbId: string | null, index: number) => void;
  onNewCollection: () => void;
  onNewContent: () => void;
  // Props for search, filter, and sort controls
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterTerm: string;
  onFilterChange: (value: string) => void;
  sortTerm: string;
  onSortChange: (value: string) => void;
}

export function DriveHeader({ 
  breadcrumbs, onBreadcrumbClick, onNewCollection, onNewContent,
  searchTerm, onSearchChange, filterTerm, onFilterChange, sortTerm, onSortChange
}: DriveHeaderProps) {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state: RootState) => state.view.viewMode);

  return (
    <header className="flex-shrink-0 p-4 sm:p-6 border-b flex flex-col sm:flex-row items-center gap-4 bg-background z-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 min-w-0 w-full">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id || "root"}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            <Button
              variant="ghost" size="sm"
              className={`px-2 h-9 text-base font-medium truncate ${index === breadcrumbs.length - 1 ? "text-foreground cursor-default" : "text-muted-foreground"}`}
              onClick={() => onBreadcrumbClick(crumb.id, index)}
              disabled={index === breadcrumbs.length - 1}
            >
              {crumb.title}
            </Button>
          </React.Fragment>
        ))}
      </div>

      {/* Controls Section */}
      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-full sm:w-40 md:w-64"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter and Sort Dropdowns */}
        <Select value={filterTerm} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[120px] h-9" aria-label="Filter by type">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="collection">Collections</SelectItem>
            <SelectItem value="content">Content</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortTerm} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] h-9" aria-label="Sort by">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt-desc">Last Modified</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="createdAt-asc">Date Created</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Right-aligned Action Buttons */}
        <div className="hidden sm:flex items-center border-l ml-2 pl-4">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => dispatch(setViewMode("grid"))}> <LayoutGrid className="h-5 w-5" /></Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => dispatch(setViewMode("list"))}> <List className="h-5 w-5" /></Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button className="gap-2"><Plus className="h-5 w-5" /> <span className="hidden sm:inline">New</span></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onNewContent} className="gap-2 cursor-pointer"><FileText className="h-4 w-4 text-primary" /> New Content</DropdownMenuItem>
            <DropdownMenuItem onSelect={onNewCollection} className="gap-2 cursor-pointer"><Folder className="h-4 w-4 text-blue-500" /> New Collection</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
