// @/components/channel/HeroContent.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlay } from 'react-icons/fa';

// --- Type Definition for this specific component ---
interface HeroItem {
    id: string;
    title: string;
    thumbnail: string;
    description?: string;
}

interface HeroProps {
    popularVideos: HeroItem[];
    autoScrollInterval?: number;
}

export default function HeroContent({ popularVideos, autoScrollInterval = 7000 }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const router = useRouter();

    const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? popularVideos.length - 1 : prev - 1));
    const goToNext = useCallback(() => setCurrentIndex(prev => (prev === popularVideos.length - 1 ? 0 : prev + 1)), [popularVideos.length]);
    
    const handleCardClick = (id: string) => {
        router.push(`/content/${id}`);
    };

    useEffect(() => {
        if (isHovering || popularVideos.length <= 1) return;
        const intervalId = setInterval(goToNext, autoScrollInterval);
        return () => clearInterval(intervalId);
    }, [goToNext, isHovering, popularVideos.length, autoScrollInterval]);

    if (!popularVideos || popularVideos.length === 0) {
        return null;
    }

    const slideOffset = `-${currentIndex * 100}%`;

    return (
        <section className="my-8 lg:my-12 relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <div className="relative max-w-4xl mx-auto">
                <div className="overflow-hidden rounded-lg shadow-xl mb-4">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(${slideOffset})` }}>
                        {popularVideos.map((video) => (
                            <div key={video.id} className="w-full flex-shrink-0">
                                <div className="relative group aspect-video cursor-pointer" onClick={() => handleCardClick(video.id)}>
                                     <img src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${video.thumbnail}`} alt={`Thumbnail for ${video.title}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300">
                                        <div className="bg-[#007AFF] text-white rounded-full w-16 h-16 flex items-center justify-center transform transition-transform group-hover:scale-110">
                                            <FaPlay size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 {popularVideos.length > 1 && (
                    <>
                        <button onClick={goToPrevious} aria-label="Previous" className="absolute top-1/2 left-[-20px] md:left-[-50px] transform -translate-y-1/2 z-10 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
                        <button onClick={goToNext} aria-label="Next" className="absolute top-1/2 right-[-20px] md:right-[-50px] transform -translate-y-1/2 z-10 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></button>
                    </>
                )}
                 {popularVideos.length > 1 && ( <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 flex space-x-2">{popularVideos.map((_, index) => ( <button key={index} onClick={() => setCurrentIndex(index)} aria-label={`Go to slide ${index + 1}`} className={`w-2.5 h-2.5 rounded-full transition-colors ${currentIndex === index ? 'bg-[#007AFF]' : 'bg-gray-500'}`} /> ))}</div> )}
            </div>
            {popularVideos[currentIndex] && (
                <div className="text-center mt-12">
                    <h2 className="text-3xl font-bold text-[#F5F7FA]">{popularVideos[currentIndex].title}</h2>
                    <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto">{popularVideos[currentIndex].description || 'Check out this featured item!'}</p>
                </div>
            )}
        </section>
    );
}
