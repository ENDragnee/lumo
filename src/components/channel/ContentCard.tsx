import { ContentItem } from '@/types/creator'; // Adjust import path
// import { FaBook, FaPlayCircle, FaList } from 'react-icons/fa'; // Example using react-icons

interface CardProps {
    item: ContentItem;
    layout: 'grid' | 'carousel' | 'carousel-mobile';
}

export default function ContentCard({ item, layout }: CardProps) {
    // Placeholder for content type icon
    const ContentIcon = () => {
        switch (item.type) {
            case 'book': return <span className="text-xs">[Book]</span>; // <FaBook size={12} />;
            case 'playlist': return <span className="text-xs">[List]</span>; // <FaList size={12} />;
            case 'lesson':
            default: return <span className="text-xs">[Play]</span>; // <FaPlayCircle size={12} />;
        }
    };

    // Basic hover effect - can be enhanced with scale/preview
    const hoverEffect = "transition-transform duration-200 ease-in-out hover:scale-105";
    // Add group for potential hover effects on children
    return (
        <div className={`bg-[#2A3A3C] rounded-lg overflow-hidden shadow-md group ${layout !== 'carousel-mobile' ? hoverEffect : ''}`}>
            <div className="relative">
                 <img
                    src={item.thumbnail}
                    alt={`Thumbnail for ${item.title}`}
                    className="w-full aspect-video object-cover"
                />
                 {/* Placeholder for hover video/GIF preview (complex feature) */}
                {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"> PREVIEW </div> */}
            </div>
            <div className="p-3">
                <h4 className="font-semibold text-sm mb-1 text-[#F5F7FA] truncate">{item.title}</h4>
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                        <ContentIcon />
                        <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                    </span>
                    {item.views !== undefined && <span>{item.views} views</span>}
                </div>
            </div>
        </div>
    );
}