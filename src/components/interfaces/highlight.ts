export interface HighlightInstance {
    _id?: string;
    userId: string;
    contentId: string;
    highlighted_text: string;
    color: string;
    start_offset: number;
    end_offset: number;
    contextPrefix?: string;
    contextSuffix?: string;
    createdAt: Date;
  }
