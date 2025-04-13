import { useState } from 'react';
import { Creator, Stats } from '@/types/creator'; // Adjust import path
// import { FaStar, FaUsers, FaEye, FaLinkedin, FaTwitter } from 'react-icons/fa'; // Example Icons

interface AboutProps {
    creator: Creator;
    stats: Stats | null;
}

export default function AboutCard({ creator, stats }: AboutProps) {
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    // Interactive Rating Placeholder
    const RatingComponent = () => {
        const rating = stats?.rating ?? 0;
        const ratingCount = stats?.ratingCount ?? 0;

        if (ratingCount === 0) {
            return (
                <button className="mt-2 w-full text-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-[#007AFF] text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 animate-pulse-fast">
                    Be the first to rate!
                </button>
            );
        }

        // Placeholder for interactive stars/slider later
        return (
            <div className="flex items-center space-x-1 text-yellow-400">
                 {/* Simple stars for now */}
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-500'}>★</span> // [Star Icon]
                ))}
                <span className="text-sm text-gray-400 ml-1">({rating.toFixed(1)} / {ratingCount} ratings)</span>
            </div>
        );
    };

    return (
        <section className="my-12 flex justify-center">
            <div className="bg-gray-200 dark:bg-[#2A3A3C] p-6 rounded-lg shadow-lg w-full max-w-2xl text-center">
                <h3 className="text-xl font-bold mb-4 text-[#1E1E24] dark:text-[#F5F7FA]">About {creator.name}</h3>

                {/* Collapsible Bio */}
                <div className="text-gray-800 dark:text-gray-300 text-sm mb-4">
                    <p className={`${!isBioExpanded ? 'line-clamp-3' : ''}`}>
                        {creator.bio}
                    </p>
                    <button
                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                        className="text-[#007AFF] hover:underline text-xs mt-1"
                    >
                        {isBioExpanded ? 'Show Less' : 'Read More'}
                    </button>
                </div>

                {/* Credentials (Example - could be a collapsible section too) */}
                 {creator.credentials && creator.credentials.length > 0 && (
                    <div className="mb-4 text-left border-t border-gray-600 pt-4">
                        <h4 className="font-semibold text-sm mb-2 text-[#1E1E24] dark:text-[#F5F7FA]">Credentials</h4>
                        <ul className="list-disc list-inside text-gray-800 dark:text-gray-400 text-xs space-y-1">
                            {creator.credentials.map((cred, index) => <li key={index}>{cred}</li>)}
                        </ul>
                    </div>
                )}


                {/* Stats Icons */}
                {stats && (
                    <div className="flex justify-center space-x-6 my-4 text-gray-800 dark:text-gray-300 text-sm border-t border-b border-gray-600 py-4">
                        <span className="flex items-center space-x-1"> {/* [Users Icon] */}👤 <span>{stats.subscriberCount ?? 0} Subs</span></span>
                        <span className="flex items-center space-x-1"> {/* [Eye Icon] */}👁️ <span>{stats.totalViews ?? 0} Views</span></span>
                        <span className="flex items-center space-x-1"> {/* [Content Icon] */}📚 <span>{stats.contentCount ?? 0} Items</span></span>
                    </div>
                )}

                 {/* Rating */}
                <div className="mt-4 flex flex-col items-center">
                    <h4 className="font-semibold text-sm mb-2 text-[#1E1E24] dark:text-[#F5F7FA]">Rating</h4>
                    <RatingComponent />
                </div>

                {/* Social Links */}
                {creator.socialLinks && creator.socialLinks.length > 0 && (
                    <div className="mt-6 flex justify-center space-x-4">
                        {creator.socialLinks.map(link => (
                            <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#007AFF] transition-colors text-2xl">
                                {/* Render appropriate icon based on link.platform */}
                                {link.platform === 'linkedin' && <span>[Li]</span> /* <FaLinkedin /> */}
                                {link.platform === 'twitter' && <span>[Tw]</span> /* <FaTwitter /> */}
                                {/* Add other platforms */}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// Add pulse animation if needed for rating button
/*
@keyframes pulse-fast {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.animate-pulse-fast {
  animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
*/