export interface ContentStub {
    _id: string;
    title: string;
    imageUrl?: string; // Assuming this will be populated
    subtitle?: string; // Assuming something like 'source' or 'provider' exists
  }
  
  export interface HistoryItem {
    _id: string;
    user_id: string;
    content_id: ContentStub; // Use the populated object structure
    viewed_at: string; // ISO date string
    starred_status?: boolean;
    starred_at?: string | null;
  }