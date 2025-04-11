import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Content } from "@/types/content";

const SearchForm = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
      };
    return (
        <div className="px-4 py-7 rounded-xl bg-transparent mb-2 md:mb-4">
            <form onSubmit={handleSearchSubmit} className="relative w-4/5 md:w-1/2 mx-auto">
            <div className="flex items-center gap-2 rounded-full bg-white dark:bg-slate-700 px-4 py-2 border-2 focus:ring-2 border-gray-300 focus:ring-[#1E1E24] dark:border-slate-800 dark:focus:ring-gray-700">
                <input
                type="search"
                placeholder="Hinted search text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 dark:text-white/80"
                />
                <Search className="h-6 w-6 text-gray-500" />
            </div>
            <button type="submit" className="hidden">
                Search
            </button>
            </form>
        </div>
    )
}

export default SearchForm