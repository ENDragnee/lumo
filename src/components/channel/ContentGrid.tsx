import { ContentItem } from '@/types/creator'; // Adjust import path
import ContentCard from './ContentCard'; // Reusable card component

interface GridProps {
    content: ContentItem[];
}

// This component now just focuses on the grid layout
export default function ContentGrid({ content }: GridProps) {
    if (!content || content.length === 0) {
        return <p className="text-[#1E1E24] dark:text-gray-200">No additional content found.</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
                <ContentCard key={item._id as string} item={item} layout="grid" />
            ))}
        </div>
    );
}