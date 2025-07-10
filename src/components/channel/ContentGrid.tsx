// @/components/channel/ContentGrid.tsx
import { ContentCard } from '@/components/cards/ContentCard';

// --- Type Definition ---
// This is the shape of data the grid expects to receive.
// It matches the 'item' prop of your ContentCard.
interface GridItem {
    _id: string;
    title: string;
    thumbnail: string;
    tags?: string[];
    createdBy: {
        _id: string;
        name: string;
    }
    // Public page won't have progress/performance, so they are omitted here.
    // Your ContentCard will handle their absence gracefully.
}

interface GridProps {
    content: GridItem[];
    displayAs?: 'grid' | 'list'; // Optional: To switch between card types
}

export default function ContentGrid({ content, displayAs = 'grid' }: GridProps) {
    if (!content || content.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No content to display.</p>;
    }

    if (displayAs === 'list') {
        // Here you would render ContentCardList, but for now we focus on the grid
        // This is left as a placeholder for future implementation
        return <div className="space-y-2">Not implemented yet</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {content.map((item, index) => (
                <ContentCard
                    key={item._id}
                    item={item} // Pass the entire item object
                    index={index}
                />
            ))}
        </div>
    );
}
