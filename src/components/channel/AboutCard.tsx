// @/components/channel/AboutCard.tsx
import { useState } from 'react';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

// --- Type Definitions for this specific component ---
interface AboutCreator {
    name: string;
    bio?: string;
    credentials?: string[];
    // This assumes socialLinks from the API has 'type' instead of 'platform'
    socialLinks?: { type: string; url: string; }[];
}

interface Stats {
    rating: number;
    ratingCount: number;
    subscriberCount: number;
    totalViews: number;
    contentCount?: number; // The parent page should provide this
}

interface AboutProps {
    creator: AboutCreator;
    stats: Stats | null;
}

export default function AboutCard({ creator, stats }: AboutProps) {
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    return (
        <section className="my-12 flex justify-center">
            <div className="bg-gray-100 dark:bg-[#2A3A3C] p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4 text-center text-[#1E1E24] dark:text-[#F5F7FA]">About {creator.name}</h3>
                <div className="text-gray-700 dark:text-gray-300 text-sm mb-4 text-left">
                    <p className={`${!isBioExpanded ? 'line-clamp-3' : ''}`}>
                        {creator.bio || "This creator hasn't added a bio yet."}
                    </p>
                    {creator.bio && creator.bio.length > 150 && (
                        <button onClick={() => setIsBioExpanded(!isBioExpanded)} className="text-[#007AFF] hover:underline text-xs mt-1 font-semibold">
                            {isBioExpanded ? 'Show Less' : 'Read More'}
                        </button>
                    )}
                </div>
                {creator.credentials && creator.credentials.length > 0 && (
                    <div className="mb-4 text-left border-t border-gray-300 dark:border-gray-700 pt-4">
                        <h4 className="font-semibold text-base mb-2 text-[#1E1E24] dark:text-[#F5F7FA]">Credentials</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 text-sm space-y-1">
                            {creator.credentials.map((cred, index) => <li key={index}>{cred}</li>)}
                        </ul>
                    </div>
                )}
                {stats && (
                    <div className="flex justify-center items-center space-x-6 my-4 text-gray-800 dark:text-gray-300 text-sm border-t border-b border-gray-300 dark:border-gray-700 py-4">
                        <div className="text-center">
                            <div className="font-bold text-lg">{stats.subscriberCount?.toLocaleString() ?? 0}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Subscribers</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg">{stats.totalViews?.toLocaleString() ?? 0}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Total Views</div>
                        </div>
                        {stats.contentCount !== undefined && (
                            <div className="text-center">
                                <div className="font-bold text-lg">{stats.contentCount}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Items</div>
                            </div>
                        )}
                    </div>
                )}
                {creator.socialLinks && creator.socialLinks.length > 0 && (
                    <div className="mt-6 flex justify-center space-x-4">
                        {creator.socialLinks.map(link => (
                            <a key={link.type} href={link.url} target="_blank" rel="noopener noreferrer" title={link.type} className="text-gray-500 hover:text-[#007AFF] transition-colors text-2xl">
                                {link.type.toLowerCase() === 'linkedin' && <FaLinkedin />}
                                {link.type.toLowerCase() === 'twitter' && <FaTwitter />}
                                {/* Add other platform icons as needed */}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
