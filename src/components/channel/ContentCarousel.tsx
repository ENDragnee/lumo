import { ContentItem } from '@/types/creator'; // Adjust import path
import ContentCard from './ContentCard'; // Reusable card component

interface CarouselProps {
    content: ContentItem[];
}

export default function ContentCarousel({ content }: CarouselProps) {
    return (
        <section className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-[#1E1E24] dark:text-[#F5F7FA]">More to Explore</h3>
            {/* Desktop: Horizontal Scroll */}
            <div className="hidden lg:flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                 {content.map((item) => (
                    <div key={item._id as string} className="flex-shrink-0 w-64"> {/* Adjust width as needed */}
                        <ContentCard item={item} layout="carousel" />
                    </div>
                ))}
            </div>
             {/* Mobile: Vertical Scroll (or swipeable full-width cards) */}
            <div className="lg:hidden space-y-4">
                {content.map((item) => (
                     <div key={item._id as string} className="w-full">
                        {/* Using same card, maybe adjust styles slightly for mobile full-width */}
                         <ContentCard item={item} layout="carousel-mobile" />
                    </div>
                ))}
            </div>
        </section>
    );
}
