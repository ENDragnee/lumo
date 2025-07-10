// @/components/channel/Header.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';

// --- Type Definitions for this specific component ---
type TabName = 'Home' | 'Contents' | 'Books' | 'Workspaces';
const TABS: TabName[] = ['Home', 'Contents', 'Books', 'Workspaces'];

interface HeaderCreator {
    id: string;
    name: string;
    avatarUrl: string;
    tagline?: string;
}

interface Stats {
    rating: number;
    ratingCount: number;
    subscriberCount: number;
    totalViews: number;
}

interface HeaderProps {
    creator: HeaderCreator;
    stats: Stats | null;
    creatorId: string;
    initialIsSubscribed: boolean;
    isCheckingSubscription: boolean;
    onSubscriptionChange: (subscribe: boolean) => Promise<void>;
    activeTab: TabName;
    onTabChange: (tab: TabName) => void;
}

export default function NewHeader({
    creator,
    stats,
    creatorId,
    initialIsSubscribed,
    isCheckingSubscription,
    onSubscriptionChange,
    activeTab,
    onTabChange
}: HeaderProps) {
    const { data: session, status: sessionStatus } = useSession();
    const [subscribed, setSubscribed] = useState(initialIsSubscribed);
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        setSubscribed(initialIsSubscribed);
    }, [initialIsSubscribed]);

    const handleSubscribeClick = async () => {
        if (isSubscribing || isCheckingSubscription) return;
        setIsSubscribing(true);
        try {
            await onSubscriptionChange(!subscribed);
            setSubscribed(!subscribed); // Sync state after successful parent call
        } catch (error) {
            console.error("Subscription failed:", error);
            alert(`Error: ${error instanceof Error ? error.message : "Could not update subscription"}`);
        } finally {
            setIsSubscribing(false);
        }
    };

    const isOwnChannel = sessionStatus === 'authenticated' && session?.user?.id === creatorId;
    const isLoading = isCheckingSubscription || isSubscribing;

    let buttonText = "Subscribe";
    if (isLoading) buttonText = "Loading...";
    else if (subscribed) buttonText = "Subscribed";

    const buttonDisabled = isLoading || sessionStatus !== 'authenticated' || isOwnChannel;

    const subscribeButtonClasses = `
        px-4 py-2 rounded-full shadow-md transition duration-200 ease-in-out text-sm lg:text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E24]
        ${buttonDisabled && !isLoading ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-400' : ''}
        ${isLoading ? 'bg-gray-500 dark:bg-gray-700 cursor-wait text-gray-300 dark:text-gray-400' : ''}
        ${!buttonDisabled && !isLoading && subscribed ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500' : ''}
        ${!buttonDisabled && !isLoading && !subscribed ? 'bg-[#007AFF] text-white hover:bg-blue-600 focus:ring-blue-500' : ''}
    `;

    const headerBackground = "dark:bg-gradient-to-b dark:from-[#1C2526] dark:to-[#243133] bg-white dark:text-[#F5F7FA] text-[#1E1E24]";
    const subscriberText = stats?.subscriberCount === 1 ? 'subscriber' : 'subscribers';
    const viewText = stats?.totalViews === 1 ? 'view' : 'views';

    return (
        <header className={`${headerBackground} shadow-md relative border-b border-gray-200 dark:border-gray-700`}>
            <div className="container mx-auto px-4 py-4 md:py-6">
                <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${creator.avatarUrl}` || '/default-avatar.png'}
                            alt={`${creator.name}'s avatar`}
                            width={80}
                            height={80}
                            className="rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                            priority
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl lg:text-3xl font-bold">{creator.name}</h1>
                            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">{creator.tagline || 'Creator Channel'}</p>
                             <div className="hidden md:flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {stats && (
                                    <>
                                        <span>{stats.subscriberCount?.toLocaleString() ?? 0} {subscriberText}</span>
                                        <span>•</span>
                                        <span>{stats.totalViews?.toLocaleString() ?? 0} {viewText}</span>
                                         {stats.rating > 0 && stats.ratingCount > 0 && ( <><span>•</span><span>{stats.rating.toFixed(1)} ({stats.ratingCount}) Rating</span></> )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
                         {isOwnChannel ? ( <button disabled className="px-4 py-2 rounded-full text-sm lg:text-base font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed">Your Channel</button> ) : ( <button className={subscribeButtonClasses} onClick={handleSubscribeClick} disabled={buttonDisabled}>{buttonText}</button> )}
                    </div>
                     <div className="md:hidden flex items-center justify-center space-x-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {stats && ( <><span>{stats.subscriberCount?.toLocaleString() ?? 0} {subscriberText}</span><span>•</span><span>{stats.totalViews?.toLocaleString() ?? 0} {viewText}</span>{stats.rating > 0 && stats.ratingCount > 0 && ( <><span>•</span><span>{stats.rating.toFixed(1)} ({stats.ratingCount}) Rating</span></> )}</> )}
                     </div>
                </div>
                <div className="mt-4 md:mt-6 border-t border-gray-200 dark:border-gray-700 pt-3 -mb-px">
                     <nav className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                         {TABS.map((tab) => (
                             <button key={tab} onClick={() => onTabChange(tab)} className={`whitespace-nowrap py-2 px-3 md:px-4 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-150 ease-in-out ${activeTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200 dark:hover:border-gray-500'}`} aria-current={activeTab === tab ? 'page' : undefined}>{tab}</button>
                         ))}
                     </nav>
                 </div>
            </div>
        </header>
    );
}
