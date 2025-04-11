import { useState } from 'react';
import { Creator, Stats } from '@/types/creator'; // Adjust import path if needed

interface HeaderProps {
    creator: Creator;
    stats: Stats | null;
}

export default function NewHeader({ creator, stats }: HeaderProps) {
    const [showStats, setShowStats] = useState(false); // For mobile 'More' button

    // Example gradient - adjust colors and direction as needed
    const gradientBackground = "dark:bg-gradient-to-r from-[#1C2526] via-[#2A3A3C] to-[#1C2526] bg-gray-200 rounded-lg";

    return (
        <header className={`p-4 ${gradientBackground} dark:text-[#F5F7FA] text-[#1E1E24] relative`}>
            <div className="container mx-auto flex flex-col items-center text-center lg:flex-row lg:justify-between lg:text-left">
                {/* Mobile: Stacked / Desktop: Row */}
                <div className="flex flex-col items-center lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 mb-4 lg:mb-0">
                    <img
                        src={creator.avatarUrl || '/default-avatar.png'}
                        alt={`${creator.name}'s avatar`}
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-2 border-[#007AFF]" // Accent border
                    />
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">{creator.name}</h1>
                        <p className="text-sm lg:text-base dark:text-gray-300 text-[1E1E24]">{creator.tagline || 'Creator Channel'}</p>
                    </div>
                </div>

                {/* Stats - Hidden on Mobile by default, shown on Desktop */}
                <div className="hidden lg:flex space-x-4 items-center">
                    {stats && (
                         <>
                            <span>{stats.subscriberCount ?? 0} Subscribers</span>
                            <span>•</span>
                            <span>{stats.totalViews ?? 0} Views</span>
                            {/* Add more stats as needed */}
                         </>
                    )}
                    <button className="bg-[#007AFF] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Subscribe
                    </button>
                </div>

                {/* Mobile: "More" button for stats */}
                <div className="lg:hidden mt-2">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="text-sm text-[#007AFF] hover:underline"
                    >
                        {showStats ? 'Less Info' : 'More Info'}
                    </button>
                </div>

                 {/* Mobile: Collapsed Stats */}
                 {showStats && (
                    <div className="lg:hidden mt-4 flex flex-col items-center space-y-2 text-sm bg-black bg-opacity-20 p-3 rounded-md">
                         {stats && (
                            <>
                                <span>{stats.subscriberCount ?? 0} Subscribers</span>
                                <span>{stats.totalViews ?? 0} Views</span>
                                {/* Add more stats */}
                            </>
                        )}
                        <button className="mt-2 bg-[#007AFF] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full">
                            Subscribe
                        </button>
                    </div>
                )}
            </div>
            {/* Dynamic Background Hint - this is complex, maybe a subtle CSS animation */}
            <div className="absolute inset-0 -z-10 opacity-10 /* Add shifting gradient animation here */"></div>
        </header>
    );
}