"use client"; // Keep this if using Next.js App Router

import { useState, useEffect, useCallback } from 'react';
import { ContentItem } from '@/types/creator'; // Adjust import path
import { useRouter } from 'next/router';

interface HeroProps {
    popularVideos: ContentItem[];
    autoScrollInterval?: number;
}

export default function HeroContent({ popularVideos, autoScrollInterval = 5000 }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? popularVideos.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const handleCardClick = (id: string) => {
        const router = useRouter();
        router.push(`/content?id=${id}`);
    };

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === popularVideos.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, popularVideos.length]);

    useEffect(() => {
        if (isHovering || popularVideos.length <= 1) return;
        const intervalId = setInterval(goToNext, autoScrollInterval);
        return () => clearInterval(intervalId);
    }, [goToNext, isHovering, popularVideos.length, autoScrollInterval]);

    if (!popularVideos || popularVideos.length === 0) {
        return <section className="text-center my-8 lg:my-12"><p>No popular videos available.</p></section>;
    }

    // Calculate the translateX percentage for the slide effect
    const slideOffset = `-${currentIndex * 100}%`;

    return (
        <section
            className="my-8 lg:my-12 relative" // Added relative for absolute positioning context
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Outer container for slide positioning and hover */}
            <div className="relative max-w-3xl mx-auto">

                {/* Overflow Container: Hides the non-visible slides */}
                <div className="overflow-hidden rounded-lg shadow-lg mb-4">
                    {/* Slider Track: Holds all slides horizontally, moves via transform */}
                    <div
                        className="flex transition-transform duration-500 ease-in-out" // Added transition classes
                        style={{ transform: `translateX(${slideOffset})` }} // Apply dynamic transform
                    >
                        {/* Map through videos to create slides */}
                        {popularVideos.map((video, index) => (
                            <div
                                key={video.id || index} // Use unique ID if available
                                className="w-full flex-shrink-0" // Ensure each slide takes full width and doesn't shrink
                            >
                                {/* Individual Slide Content */}
                                <div className="relative group aspect-video"> {/* Maintain aspect ratio */}
                                     <img
                                        src={video.thumbnail}
                                        alt={`Thumbnail for ${video.title}`}
                                        className="w-full h-full object-cover text-[#1E1E24] dark:text-[#F5F7FA]" // Ensure image covers the area
                                    />
                                    {/* Play Button Overlay (Stays within each slide's relative context) */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#1E1E24] bg-opacity-30 dark:bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300">
                                        <button className="bg-[#007AFF] text-white rounded-full w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center text-3xl lg:text-4xl animate-pulse-slow hover:animate-none shadow-xl transform transition-transform duration-200 group-hover:scale-110" onClick={() => handleCardClick(video.id as string)}>
                                            ▶
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Navigation Arrows (Positioned absolutely relative to the 'max-w-3xl mx-auto' div) */}
                 {popularVideos.length > 1 && (
                    <>
                        {/* Left Arrow */}
                        <button
                            onClick={goToPrevious}
                            aria-label="Previous video"
                            className="absolute top-1/2 left-[-30px] sm:left-[-20px] md:left-[-50px] transform -translate-y-[calc(50%+1rem)] z-10 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200" // Adjusted translate-y slightly
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={goToNext}
                            aria-label="Next video"
                            className="absolute top-1/2 right-[-30px] sm:right-[-20px] md:right-[-50px] transform -translate-y-[calc(50%+1rem)] z-10 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200" // Adjusted translate-y slightly
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}

                 {/* Pagination Dots (Positioned absolutely relative to the 'max-w-3xl mx-auto' div) */}
                 {popularVideos.length > 1 && (
                    <div className="absolute bottom-[-35px] left-1/2 transform -translate-x-1/2 flex justify-center space-x-2 z-10">
                        {popularVideos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to video ${index + 1}`}
                                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                    currentIndex === index ? 'bg-[#007AFF]' : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                 )}

            </div> {/* End of relative max-w-3xl container */}

            {/* Video Title and Description (Centered below the slider) */}
            {/* We need to get the current video data again here */}
            {popularVideos[currentIndex] && (
                <div className="text-center mt-10"> {/* Increased margin-top slightly */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#1E1E24] dark:text-[#F5F7FA]">{popularVideos[currentIndex].title}</h2>
                    <p className="text-base lg:text-lg dark:text-gray-300 text-[#3B82F6] mt-2 max-w-2xl mx-auto">
                        {popularVideos[currentIndex].description || 'Check out this featured lesson!'}
                    </p>
                </div>
            )}
        </section>
    );
}