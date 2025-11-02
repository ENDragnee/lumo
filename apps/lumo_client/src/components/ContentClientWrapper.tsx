// /components/ContentClientWrapper.tsx
'use client';

import { useState } from 'react';
import { ProgressTracker } from './ProgressTracker';
import { ContentEffects } from './ContentEffects';

interface ContentClientWrapperProps {
    contentId: string;
    lastKnownPosition: number;
    children: React.ReactNode; // This will be the server-rendered page content
}

/**
 * A client-side wrapper that orchestrates interactive components on the content page.
 * It "lifts up" the state for the scroll position, allowing sibling components
 * (ProgressTracker and ContentEffects) to communicate.
 */
export function ContentClientWrapper({ 
    children, 
    contentId, 
    lastKnownPosition 
}: ContentClientWrapperProps) {
    
    // This state holds the live scroll position, managed by this wrapper.
    const [currentPosition, setCurrentPosition] = useState(lastKnownPosition);

    return (
        <>
            {/* 1. The ProgressTracker displays the position and reports changes up */}
            <ProgressTracker
                contentId={contentId}
                lastKnownPosition={lastKnownPosition}
                onPositionChange={setCurrentPosition} // The tracker updates this component's state
            />
            
            {/* 2. The server-rendered content is passed through */}
            {children}
            
            {/* 3. The ContentEffects component receives the live position state */}
            <ContentEffects
                contentId={contentId}
                currentPosition={currentPosition} // Pass the live state down
            /> 
        </>
    );
}
