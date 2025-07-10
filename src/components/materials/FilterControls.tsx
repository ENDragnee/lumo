// components/materials/FilterControls.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Grid3X3, List, Filter, Search, ChevronDown } from "lucide-react"

interface FilterControlsProps {
  onViewChange: (view: "list" | "grid") => void
  currentView: "list" | "grid"
  onFilterChange: (filters: any) => void
  activeFilters: any
}

export function FilterControls({ onViewChange, currentView, onFilterChange, activeFilters }: FilterControlsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const subjects = ["All Subjects", "Physics", "Chemistry", "Mathematics", "Biology"]
  const progressStates = ["All Progress", "Not Started", "In Progress", "Completed"]
  const difficulties = ["All Levels", "Easy", "Medium", "Hard"]

  const handleFilterChange = (type: string, value: string) => {
    // A more robust check for "All" options
    const isAllOption = value.toLowerCase().startsWith("all ");
    
    onFilterChange((prevFilters: any) => ({
      ...prevFilters,
      [type]: isAllOption ? undefined : value, // Use undefined to remove the key
    }));
  };

  const clearAllFilters = () => {
    onFilterChange({})
    setSearchQuery("")
  }

  // Calculate active filters by checking for non-undefined, non-null values
  const activeFilterCount = Object.values(activeFilters).filter(val => val != null).length

  return (
    <div className="space-y-4">
      {/* Search and View Toggle Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-graphite" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific bg-white/60 backdrop-blur-sm"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-lg border border-cloud p-1">
          <Button
            variant={currentView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("list")}
            className="h-8 px-3"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={currentView === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("grid")}
            className="h-8 px-3"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Subject Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-cloud">
              {activeFilters.subject || "All Subjects"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {subjects.map((subject) => (
              <DropdownMenuItem key={subject} onClick={() => handleFilterChange("subject", subject)}>
                {subject}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Progress Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-cloud">
              {activeFilters.progress || "All Progress"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {progressStates.map((state) => (
              <DropdownMenuItem key={state} onClick={() => handleFilterChange("progress", state)}>
                {state}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Difficulty Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-cloud">
              {activeFilters.difficulty || "All Levels"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {difficulties.map((difficulty) => (
              <DropdownMenuItem key={difficulty} onClick={() => handleFilterChange("difficulty", difficulty)}>
                {difficulty}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters Badge */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-pacific/10 text-pacific">
              <Filter className="w-3 h-3 mr-1" />
              {activeFilterCount} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs text-pacific hover:text-pacific/80">
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
