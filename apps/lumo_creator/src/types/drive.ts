// @/types/drive.ts

// This interface covers all properties needed by the Home page, Edit modal, and Delete modal for Books.
export type HomePageCollection = {
  _id: string;
  type: 'collection';
  title: string;
  isDraft: boolean;
  updatedAt: string; // or Date
  createdAt: string; // or Date
  description?: string;
  genre?: string;
  thumbnail?: string ;
  contentCount: number;
  collectionCount: number;
};

// This interface covers all properties needed for Content items.
export interface HomePageContent {
  _id: string;
  type: 'content';
  title: string;
  isDraft: boolean;
  thumbnail: string;
  tags?: string[];
  lastModifiedAt?: string;
  createdAt: string;
}

// This is the single source of truth for what a "DriveItem" is.
export type DriveItem = HomePageCollection | HomePageContent;
