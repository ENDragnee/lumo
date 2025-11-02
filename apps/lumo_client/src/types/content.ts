export interface Content {
    _id: string;
    title: string;
    data?: string;
    tags?: string[];
    thumbnail: string;
    difficulty?: "easy" | "medium" | "hard";
    subject: string;
    institution: string;
    description?: string;
    estimatedTime?: number; // Estimated time in minutes
    version?: number;
  }
