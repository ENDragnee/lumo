"use client"; // Keep this if it's a client component

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; // Import useSession
import { Creator, Stats } from '@/types/creator'; // Adjust import path if needed

interface HeaderProps {
    creator: Creator;
    stats: Stats | null;
    creatorId: string; // Add creatorId
    initialIsSubscribed: boolean; // Add initial subscription status
    isCheckingSubscription: boolean; // Add loading status for check
    onSubscriptionChange: (subscribe: boolean) => Promise<void>; // Function to call on button click
}

export default function NewHeader({
    creator,
    stats,
    creatorId, // Destructure new props
    initialIsSubscribed,
    isCheckingSubscription,
    onSubscriptionChange
}: HeaderProps) {
    const { data: session, status: sessionStatus } = useSession(); // Get session
    const [showStats, setShowStats] = useState(false); // For mobile 'More' button
    const [subscribed, setSubscribed] = useState(initialIsSubscribed); // Local state for UI
    const [isSubscribing, setIsSubscribing] = useState(false); // Loading state for subscribe action

    // Sync local state if the initial prop changes (e.g., after parent re-fetches)
    useEffect(() => {
        setSubscribed(initialIsSubscribed);
    }, [initialIsSubscribed]);

    useEffect(() => { 
      console.log("Status:", stats);  }, []); // Debugging line

    // Handle subscribe button click
    const handleSubscribeClick = async () => {
        if (isSubscribing || isCheckingSubscription) return; // Prevent double clicks or clicks during loading

        setIsSubscribing(true);
        const nextSubscribedState = !subscribed; // Determine the desired next state

        try {
            // Optimistic UI update (optional, but improves perceived speed)
            // setSubscribed(nextSubscribedState);

            // Call the handler function passed from the parent
            await onSubscriptionChange(nextSubscribedState);

            // --- If NOT using optimistic update, update state AFTER successful API call ---
            setSubscribed(nextSubscribedState); // Update local state based on successful API call

        } catch (error) {
            console.error("Subscription failed:", error);
            // Rollback optimistic update if it failed
            // setSubscribed(!nextSubscribedState);
            // TODO: Show an error message to the user (e.g., using a toast library)
            alert(`Error: ${error instanceof Error ? error.message : "Could not update subscription"}`);
        } finally {
            setIsSubscribing(false); // Ensure loading state is reset
        }
    };

    // Determine if the subscribe button should be shown/enabled
    const canSubscribe = sessionStatus === 'authenticated' && session?.user?.id !== creatorId;
    const isLoading = isCheckingSubscription || isSubscribing;
    const buttonText = isLoading ? "Loading..." : (subscribed ? "Subscribed" : "Subscribe");
    const buttonDisabled = isLoading || !canSubscribe;

    // Dynamic button styling based on subscription state
    const subscribeButtonClasses = `
        px-4 py-2 rounded-md transition duration-200 text-sm lg:text-base
        ${buttonDisabled ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' :
        subscribed
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500' // Subscribed style
            : 'bg-[#007AFF] text-white hover:bg-blue-600' // Subscribe style
        }
    `;

    // Example gradient - adjust colors and direction as needed
    const gradientBackground = "dark:bg-gradient-to-r from-[#1C2526] via-[#2A3A3C] to-[#1C2526] bg-gray-200 rounded-lg";

    return (
        <header className={`p-4 ${gradientBackground} dark:text-[#F5F7FA] text-[#1E1E24] relative`}>
            <div className="container mx-auto flex flex-col items-center text-center lg:flex-row lg:justify-between lg:text-left">
                {/* Creator Info */}
                <div className="flex flex-col items-center lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 mb-4 lg:mb-0">
                    <img
                        src={creator.avatarUrl || '/default-avatar.png'}
                        alt={`${creator.name}'s avatar`}
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-2 border-[#007AFF]"
                    />
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">{creator.name}</h1>
                        <p className="text-sm lg:text-base dark:text-gray-300 text-gray-700">{creator.tagline || 'Creator Channel'}</p>
                    </div>
                </div>

                {/* Desktop Stats & Subscribe Button */}
                <div className="hidden lg:flex space-x-4 items-center">
                    {stats && (
                        <>
                            {/* Use nullish coalescing for safety */}
                            <span>{stats.subscriberCount ?? 0} Subscribers</span>
                            <span>•</span>
                            <span>{stats.totalViews ?? 0} Views</span>
                            {/* Add more stats as needed */}
                        </>
                    )}
                    {/* Conditionally render button based on auth and not being self */}
                    {sessionStatus !== 'loading' && canSubscribe && (
                        <button
                            className={subscribeButtonClasses}
                            onClick={handleSubscribeClick}
                            disabled={buttonDisabled}
                        >
                            {buttonText}
                        </button>
                    )}
                     {/* Show placeholder or nothing if loading session or can't subscribe */}
                     {sessionStatus === 'loading' && <span className="text-sm">Loading...</span>}
                </div>

                {/* Mobile: "More" button */}
                <div className="lg:hidden mt-2">
                     {/* Only show stats toggle if stats exist */}
                     {stats && (
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="text-sm text-[#007AFF] hover:underline"
                        >
                            {showStats ? 'Less Info' : 'More Info'}
                        </button>
                     )}
                </div>

                 {/* Mobile: Collapsed Stats & Subscribe Button */}
                 {showStats && (
                    <div className="lg:hidden mt-4 flex flex-col items-center space-y-2 text-sm bg-black bg-opacity-20 p-3 rounded-md w-full max-w-xs">
                         {stats && (
                            <>
                                <span>{stats.subscriberCount ?? 0} Subscribers</span>
                                <span>{stats.totalViews ?? 0} Views</span>
                                {/* Add more stats */}
                            </>
                        )}
                        {/* Conditionally render button based on auth and not being self */}
                        {sessionStatus !== 'loading' && canSubscribe && (
                            <button
                                className={`${subscribeButtonClasses} mt-2 w-full`} // Ensure button takes full width
                                onClick={handleSubscribeClick}
                                disabled={buttonDisabled}
                            >
                                {buttonText}
                            </button>
                        )}
                         {/* Show placeholder or nothing if loading session or can't subscribe */}
                         {sessionStatus === 'loading' && <span className="text-sm mt-2">Loading...</span>}
                    </div>
                )}
            </div>
            {/* Dynamic Background Hint */}
            <div className="absolute inset-0 -z-10 opacity-10"></div>
        </header>
    );
}