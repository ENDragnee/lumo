"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge" // ✨ NEW IMPORT
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, ListFilter, SortAsc, Hash, Type } from "lucide-react" 
import { cn } from "@/lib/utils"

// The updated interface for column definitions
interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  /** Defines if and how this column can be filtered. */
  filterConfig?: {
    type: 'status' | 'date' | 'alphabetical' | 'number';
    options?: string[];
  }
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  selectable?: boolean
  onRowSelect?: (selectedRows: any[]) => void
  actions?: (row: any) => React.ReactNode
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function DataTable({
  data,
  columns,
  selectable = false,
  onRowSelect,
  actions,
}: DataTableProps) {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  
  // --- NEW FILTER STATES ---
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined)
  const [alphaSort, setAlphaSort] = useState<'asc' | 'desc' | null>(null);
  const [alphaFilter, setAlphaFilter] = useState<string | null>(null) 
  const [numberFilter, setNumberFilter] = useState<{ min: string; max: string }>({ min: '', max: '' })
  const itemsPerPage = 10

  // --- DYNAMICALLY FIND FILTERABLE COLUMNS (MEMOIZED) ---
  const statusColumn = useMemo(() => columns.find(c => c.filterConfig?.type === 'status'), [columns])
  const dateColumn = useMemo(() => columns.find(c => c.filterConfig?.type === 'date'), [columns])
  const alphabeticalColumn = useMemo(() => columns.find(c => c.filterConfig?.type === 'alphabetical'), [columns])
  const numberColumn = useMemo(() => columns.find(c => c.filterConfig?.type === 'number'), [columns])

  // --- MEMOIZED DATA PROCESSING PIPELINE ---
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data]

    // 1. Search Filter (broad search on all fields)
    if (searchTerm) {
      processedData = processedData.filter((item) =>
        Object.values(item).some((value) => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // 2. Status Filter
    if (statusColumn && statusFilter.length > 0) {
      processedData = processedData.filter(item => statusFilter.includes(item[statusColumn.key]))
    }

    // 3. Date Range Filter
    if (dateColumn && dateFilter?.from) {
      processedData = processedData.filter(item => {
        const itemDateValue = item[dateColumn.key];
        if (!itemDateValue) return false;

        const itemDate = new Date(Number(itemDateValue))
        if (isNaN(itemDate.getTime())) return false

        const fromDate = new Date(dateFilter.from!);
        // If 'to' is not selected, use the 'from' date for a single-day filter
        const toDate = dateFilter.to ? new Date(dateFilter.to) : new Date(dateFilter.from!);

        // Make the range inclusive by setting time to start/end of day
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        
        return itemDate >= fromDate && itemDate <= toDate
      })
    }
    // 4. Number Range Filter
    if (numberColumn) {
      const min = parseFloat(numberFilter.min)
      const max = parseFloat(numberFilter.max)
      if (!isNaN(min)) {
        processedData = processedData.filter(item => item[numberColumn.key] >= min)
      }
      if (!isNaN(max)) {
        processedData = processedData.filter(item => item[numberColumn.key] <= max)
      }
    }

    
    // 4. Header Column Sort
    if (sortConfig) {
      processedData.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    // 5. Alphabetical Sort (can be applied alongside header sort)
    if (alphabeticalColumn && alphaSort) {
      processedData.sort((a, b) => {
        const aValue = String(a[alphabeticalColumn.key]).toLowerCase()
        const bValue = String(b[alphabeticalColumn.key]).toLowerCase()
        if (alphaSort === 'asc') return aValue.localeCompare(bValue)
        return bValue.localeCompare(aValue)
      })
    }

    if (alphabeticalColumn && alphaFilter) {
      processedData = processedData.filter(item => {
        const value = String(item[alphabeticalColumn.key]).toLowerCase();
        return value.startsWith(alphaFilter.toLowerCase());
      });
    }

    return processedData
  }, [data, searchTerm, statusFilter, dateFilter, sortConfig, alphaSort, statusColumn, dateColumn, alphabeticalColumn, numberColumn, alphaSort])


  // --- PAGINATION ---
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

  // --- HANDLERS ---
  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const clearFilters = () => {
    setStatusFilter([])
    setDateFilter(undefined)
    setAlphaSort(null)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData)
      onRowSelect?.(paginatedData)
    } else {
      setSelectedRows([])
      onRowSelect?.([])
    }
  }

  const handleRowSelect = (row: any, checked: boolean) => {
    const rowId = row.userId || row.id;
    const newSelection = checked ? [...selectedRows, row] : selectedRows.filter((r) => (r.userId || r.id) !== rowId);
    setSelectedRows(newSelection);
    onRowSelect?.(newSelection);
  }

  const isAnyFilterActive = statusFilter.length > 0 || dateFilter || alphaSort || numberFilter.min || numberFilter.max

  return (
    <div className="space-y-4">
      {/* --- CONTROLS: SEARCH & FILTER --- */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search all columns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>Apply Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {statusColumn && (
                <>
                  <DropdownMenuLabel className="flex items-center text-xs font-semibold text-muted-foreground"><ListFilter className="w-3 h-3 mr-2"/>{statusColumn.label}</DropdownMenuLabel>
                  {statusColumn.filterConfig?.options?.map(option => (
                    <div key={option} className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-accent rounded-md" onClick={() => handleStatusFilterChange(option)}>
                      <Checkbox id={option} checked={statusFilter.includes(option)} onCheckedChange={() => handleStatusFilterChange(option)} />
                      <label htmlFor={option} className="text-sm font-medium capitalize flex-1 cursor-pointer">{option}</label>
                    </div>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}

              {dateColumn && (
                 <>
                  <DropdownMenuLabel className="flex items-center text-xs font-semibold text-muted-foreground"><CalendarIcon className="w-3 h-3 mr-2"/>{dateColumn.label}</DropdownMenuLabel>
                   <div className="p-1">
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateFilter && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFilter?.from ? (dateFilter.to ? <>{format(dateFilter.from, "LLL dd, y")} - {format(dateFilter.to, "LLL dd, y")}</> : format(dateFilter.from, "LLL dd, y")) : <span>Pick a date range</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start"><Calendar mode="range" selected={dateFilter} onSelect={setDateFilter} numberOfMonths={2} /></PopoverContent>
                    </Popover>
                   </div>
                  <DropdownMenuSeparator />
                </>
              )}

              {numberColumn && (
                <>
                  <DropdownMenuLabel className="flex items-center text-xs font-semibold text-muted-foreground"><Hash className="w-3 h-3 mr-2"/>{numberColumn.label}</DropdownMenuLabel>
                   <div className="flex items-center gap-2 p-1">
                     <Input type="number" placeholder="Min" value={numberFilter.min} onChange={e => setNumberFilter(f => ({...f, min: e.target.value}))} className="h-9"/>
                     <Input type="number" placeholder="Max" value={numberFilter.max} onChange={e => setNumberFilter(f => ({...f, max: e.target.value}))} className="h-9"/>
                   </div>
                   <DropdownMenuSeparator />
                </>
              )}

              {alphabeticalColumn && (
                 <>
                  <DropdownMenuLabel className="flex items-center text-xs font-semibold text-muted-foreground"><Type className="w-3 h-3 mr-2"/>Filter by {alphabeticalColumn.label} Initial</DropdownMenuLabel>
                  <div className="grid grid-cols-7 gap-1 p-1">
                    {ALPHABET.map(letter => (
                      <Button key={letter} variant={alphaFilter === letter ? 'default' : 'ghost'} size="sm" className="h-7 w-7 p-0" onClick={() => setAlphaFilter(current => current === letter ? null : letter)}>{letter}</Button>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center text-xs font-semibold text-muted-foreground"><SortAsc className="w-3 h-3 mr-2"/>Sort by {alphabeticalColumn.label}</DropdownMenuLabel>
                  <div className="flex gap-2 p-1">
                    <Button variant={alphaSort === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setAlphaSort('asc')}>A-Z</Button>
                    <Button variant={alphaSort === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setAlphaSort('desc')}>Z-A</Button>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}

              {alphaFilter && (
                 <Badge variant="secondary" className="pl-2">
                  Starts with: <span className="font-semibold ml-1">{alphaFilter}</span>
                  <button onClick={() => setAlphaFilter(null)} className="ml-1 rounded-full hover:bg-background p-0.5"><X className="w-3 h-3"/></button>
                </Badge>
              )}

              {alphaSort && (
                 <Badge variant="secondary" className="pl-2">
                  Sort: <span className="font-semibold ml-1">{alphaSort === 'asc' ? 'A-Z' : 'Z-A'}</span>
                  <button onClick={() => setAlphaSort(null)} className="ml-1 rounded-full hover:bg-background p-0.5"><X className="w-3 h-3"/></button>
                </Badge>
              )}
              
              {isAnyFilterActive && <Button variant="ghost" size="sm" className="w-full justify-center text-red-500" onClick={clearFilters}>Clear All Filters</Button>}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ✨ --- APPLIED FILTER PILLS --- ✨ */}
          {isAnyFilterActive && (
            <div className="flex items-center gap-2 flex-wrap">
              {statusFilter.map(status => (
                <Badge key={status} variant="secondary" className="pl-2">
                  {statusColumn?.label}: <span className="font-semibold ml-1 capitalize">{status}</span>
                  <button onClick={() => handleStatusFilterChange(status)} className="ml-1 rounded-full hover:bg-background p-0.5"><X className="w-3 h-3"/></button>
                </Badge>
              ))}
              {dateFilter?.from && (
                <Badge variant="secondary" className="pl-2">
                  {dateColumn?.label}: <span className="font-semibold ml-1">{format(dateFilter.from, "MMM d")}{dateFilter.to ? ` - ${format(dateFilter.to, "MMM d")}`: ''}</span>
                  <button onClick={() => setDateFilter(undefined)} className="ml-1 rounded-full hover:bg-background p-0.5"><X className="w-3 h-3"/></button>
                </Badge>
              )}
               {(numberFilter.min || numberFilter.max) && (
                <Badge variant="secondary" className="pl-2">
                  {numberColumn?.label}: <span className="font-semibold ml-1">{numberFilter.min || 'Min'} - {numberFilter.max || 'Max'}</span>
                  <button onClick={() => setNumberFilter({min: '', max: ''})} className="ml-1 rounded-full hover:bg-background p-0.5"><X className="w-3 h-3"/></button>
                </Badge>
              )}
              {alphaSort && (
                 <Badge variant="secondary" className="pl-2">
                  Sort: <span className="font-semibold ml-1">{alphaSort === 'asc' ? 'A-Z' : 'Z-A'}</span>
                  <button onClick={() => setAlphaSort(null)} className="ml-1 rounded-full hover:bg-background p-0.5"><X className="w-3 h-3"/></button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="text-red-500 h-auto p-1" onClick={clearFilters}>Clear All</Button>
            </div>
          )}
        </div>
      </div>
      
      {/* --- DATA TABLE --- */}
      <div className="border rounded-lg bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className={column.sortable ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" : ""} onClick={() => column.sortable && handleSort(column.key)}>
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-xs">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-12 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <motion.tr
                key={row.userId || row.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.some((r) => (r.userId || r.id) === (row.userId || row.id))}
                      onCheckedChange={(checked) => handleRowSelect(row, checked as boolean)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">{actions(row)}</DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        {paginatedData.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            No results found. Try adjusting your search or filters.
          </div>
        )}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4 mr-1" />Previous</Button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next<ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
