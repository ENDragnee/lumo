"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, WifiOff, AlertTriangle } from "lucide-react"

// Import the necessary hooks and types
import { IOfflinePackage } from "@/types/offline-package"
import { useOfflineSync } from "@/hooks/useOfflineSync"
import { useOfflineInteractionTracker } from "@/hooks/useOfflineInteractionTracker";
// We need the online ContentRenderer to display the offline Craft.js data
import { ContentRenderer } from "@/components/contentRender" 

interface OfflineContentViewerProps {
  contentId: string;
}

export function OfflineContentViewer({ contentId }: OfflineContentViewerProps) {
  // Destructure only the functions needed from the main sync hook
  const { getContent } = useOfflineSync();

  // State to hold the loaded offline package and the loading status
  const [pkg, setPkg] = useState<IOfflinePackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This effect runs when the component mounts or the contentId changes.
  // Its job is to load the content package from IndexedDB.
  useEffect(() => {
    // A self-invoking async function to load the data
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const foundPackage = await getContent(contentId);
        if (foundPackage) {
          setPkg(foundPackage);
        } else {
          // If the package is not found in IndexedDB, set an error message
          setError("This content is not available for offline viewing. Please download it first.");
        }
      } catch (err) {
        console.error("Failed to load offline package from IndexedDB:", err);
        setError("An error occurred while trying to load the offline content.");
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      loadContent();
    }
  }, [contentId, getContent]);
  
  // This dedicated hook handles all the logic for tracking how long
  // the user views this offline content. It activates as soon as 'pkg' is loaded.
  useOfflineInteractionTracker(pkg);


  // --- RENDER LOGIC ---

  // 1. Handle the loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full p-10 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-500">Loading Offline Content...</p>
      </div>
    );
  }

  // 2. Handle any errors, including content not being found
  if (error) {
    return (
      <Card className="shadow-apple-md bg-yellow-50 border-yellow-200">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-yellow-800 font-semibold">Could Not Load Content</p>
          <p className="text-yellow-700 text-sm mt-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // 3. Handle the case where loading is done but the package is still null
  if (!pkg) {
    return (
        <Card className="shadow-apple-md">
            <CardContent className="p-8 text-center">
                <p className="text-graphite">An unexpected error occurred. Package is null.</p>
            </CardContent>
        </Card>
    );
  }

  // 4. Render the full viewer if data is successfully loaded
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-apple-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-responsive-h3">{pkg.content.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{pkg.content.difficulty || 'Standard'}</Badge>
                {pkg.content.tags?.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 py-1 px-3">
                <WifiOff className="w-4 h-4 mr-2" />
                Offline Mode
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      {/* RENDER THE REAL OFFLINE CRAFT.JS CONTENT */}
      {/* We pass the stringified Craft.js JSON from our package to the renderer */}
      <div className="bg-white p-1 md:p-4 rounded-lg shadow-inner border border-gray-200">
         <ContentRenderer 
            id={pkg.contentId} 
            // This prop tells the renderer to use this data instead of fetching online
            offlineData={pkg.content.data} 
         />
      </div>

      {/* RENDER OFFLINE HIGHLIGHTS */}
      {pkg.highlights && pkg.highlights.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Your Highlights</CardTitle></CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="text-sm">
                      <span className="p-1 rounded" style={{ backgroundColor: `${h.color}40` }}>
                        "{h.highlighted_text}"
                      </span>
                    </li>
                  ))}
                </ul>
            </CardContent>
          </Card>
      )}

      {/* Future sections for offline quizzes or other interactive elements would go here,
          reading their data from the `pkg` object. */}
    </div>
  );
}
