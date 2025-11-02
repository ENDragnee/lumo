// /components/ProgressTracker.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
    contentId: string;
    lastKnownPosition: number;
    // NEW: Callback to report position changes
    onPositionChange: (position: number) => void; 
}

export function ProgressTracker({ contentId, lastKnownPosition, onPositionChange }: ProgressTrackerProps) {
    const [scrollPosition, setScrollPosition] = useState(lastKnownPosition);
    const isInitialScrollDone = useRef(false);

    // NEW: Effect to report changes up to the parent
    useEffect(() => {
        // Inform the parent component whenever the scroll position changes.
        onPositionChange(scrollPosition);
    }, [scrollPosition, onPositionChange]);

    const handleScroll = useCallback(() => {
        const contentElement = document.getElementById('content-container');
        if (!contentElement) return;

        const { scrollTop, scrollHeight, clientHeight } = contentElement;
        if (scrollHeight <= clientHeight) {
            setScrollPosition(100);
            return;
        }
        const currentPosition = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollPosition(Math.min(100, Math.round(currentPosition)));
    }, []);

    useEffect(() => {
        const contentElement = document.getElementById('content-container');
        if (contentElement) {
            contentElement.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Initial check
        }
        return () => contentElement?.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // This effect to restore scroll position is unchanged and correct.
    useEffect(() => {
        if (lastKnownPosition > 0 && !isInitialScrollDone.current) {
            const contentElement = document.getElementById('content-container');
            if (contentElement) {
                const observer = new ResizeObserver(() => {
                    const scrollHeight = contentElement.scrollHeight - contentElement.clientHeight;
                    if (scrollHeight > 0) {
                        const scrollToPosition = (scrollHeight * lastKnownPosition) / 100;
                        contentElement.scrollTo({ top: scrollToPosition, behavior: 'auto' });
                        isInitialScrollDone.current = true;
                        observer.disconnect();
                    }
                });
                observer.observe(contentElement);
                setTimeout(() => observer.disconnect(), 2000);
            }
        } else {
            isInitialScrollDone.current = true;
        }
    }, [lastKnownPosition]);

    return (
        <div className="sticky top-[4rem] z-40 w-full bg-background/95 backdrop-blur">
            <Progress value={scrollPosition} className="h-1.5" />
        </div>
    );
}
