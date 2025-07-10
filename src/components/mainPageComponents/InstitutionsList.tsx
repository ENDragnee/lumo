"use client"

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { InstitutionProfile } from "./InstitutionProfile";
import { IInstitution } from "@/models/Institution";

// A custom hook for debouncing input
// This prevents API calls on every keystroke
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}


export function InstitutionsList() {
  const [institutions, setInstitutions] = useState<IInstitution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use useCallback to memoize the fetch function
  const fetchInstitutions = useCallback(async (search: string) => {
    setIsLoading(true);
    setError(null);

    // Construct the URL with a search query if available
    const url = search 
      ? `/api/institutions?search=${encodeURIComponent(search)}` 
      : '/api/institutions';
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }
      const data = await response.json();
      setInstitutions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setInstitutions([]); // Clear institutions on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect to trigger the fetch when the debounced search term changes
  useEffect(() => {
    fetchInstitutions(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchInstitutions]);


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-shadow tracking-tight">Institutions Directory</h2>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-graphite" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search institutions..."
            className="w-full md:w-[280px] h-[40px] pl-10 pr-4 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific bg-white/60 backdrop-blur-sm"
          />
        </div>
      </div>

      {isLoading && <div className="text-center p-10 text-graphite">Loading institutions...</div>}
      
      {error && <div className="text-center p-10 text-red-500">Error: {error}</div>}

      {!isLoading && !error && (
        institutions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {institutions.map((inst) => (
              <InstitutionProfile key={inst._id} institution={inst} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 text-graphite">No institutions found.</div>
        )
      )}
    </div>
  );
}
