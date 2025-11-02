// types/offline-package.ts
import { IContent } from '@/models/Content'; // Assuming barrel exports
import { IHighlight } from '@/models/Highlight'; // Assuming barrel exports

// This is the structure for the individual, heavy content packages
export interface IOfflinePackage {
  contentId: string;
  version: number; // The version of the content when it was downloaded
  content: {
    title: IContent['title'];
    data: IContent['data']; // The Craft.js JSON string
    tags: IContent['tags'];
    difficulty: IContent['difficulty'];
  };
  highlights: Pick<IHighlight, 'color' | 'highlighted_text' | 'start_offset' | 'end_offset'>[];
}

// NEW: This is the structure for our "package.json"-like manifest
export interface IOfflineManifest {
  version: number; // The version of the manifest format itself
  downloaded: {
    [contentId: string]: {
      version: number;
      downloadedAt: string; // Store as ISO string for easy serialization
      title: string;
      // Add any other lightweight metadata you want to display in the manager list
      subject?: string;
      sizeInBytes: number;
    }
  };
}
