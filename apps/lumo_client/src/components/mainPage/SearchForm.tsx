// components/SearchForm.tsx or similar path
import React from 'react';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import UserIcon from '@/components/mainPage/UserIcon';

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
        // Use justify-between to push search and actions to opposite ends
        <div className="flex flex-row items-center justify-center px-4 py-5 md:py-6 bg-transparent mb-2 md:mb-4 w-full">
            {/* Search Form: Limit width and let justify-between handle positioning */}
            {/* Added mr-4 to give space between search and actions on desktop */}
            <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md lg:max-w-lg xl:max-w-xl mr-4">
                <div className="flex flex-row items-center gap-2 rounded-full bg-white dark:bg-[#1E1E24] px-4 py-2 border border-gray-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-600">
                    <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 dark:text-white/80"
                    />
                </div>
                <button type="submit" className="hidden">
                    Search
                </button>
            </form>

            {/* Right side actions: Hidden on mobile (default), flex on medium+ screens */}
            {/* Removed ml-4 as justify-between handles spacing */}
            <div className="hidden md:flex items-center gap-3"> {/* Use 'hidden md:flex' */}
                <button
                    type="button"
                    // On desktop, we can always show the text or keep sm:inline if needed within md screens
                    className="flex items-center justify-center gap-1.5 px-4 h-10 rounded-full bg-gray-100 dark:bg-[#2A2A30] text-black dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3a3a40] transition duration-200"
                    onClick={() => router.push("https://lumo-creator.aasciihub.com/")}
                    title="Create new content"
                >
                    <Plus className="h-5 w-5" />
                    {/* Text can likely be shown by default now since parent is hidden on mobile */}
                    <span className="text-sm font-medium">Create</span>
                </button>

                {/* UserIcon is part of this group */}
                <UserIcon />
            </div>
        </div>
    );
}

export default SearchForm;