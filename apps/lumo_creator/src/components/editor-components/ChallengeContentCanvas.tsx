"use client";

import React, { ReactNode } from 'react';
import { useNode, UserComponent } from '@craftjs/core';

// --- Component Props ---
export interface ChallengeContentCanvasProps {
    children?: ReactNode;
}

// --- Craftable Component Definition ---
// We explicitly define it as a UserComponent to attach the `.craft` static property.
type CraftableChallengeContentCanvas = UserComponent<ChallengeContentCanvasProps>;

export const ChallengeContentCanvas: CraftableChallengeContentCanvas = ({ children }) => {
    const { connectors: { connect } } = useNode();

    // This component is intentionally simple. It's just a div that Craft.js
    // knows can have other components dropped into it. The `connect` ref
    // is what enables this functionality.
    return (
        <div 
            ref={(ref: HTMLDivElement | null) => { 
                if (ref) connect(ref); 
            }} 
            className="relative min-h-[50px] w-full"
        >
            {/* If there are no children, we can show a placeholder message.
                This is helpful for the editor experience. */}
            {!children || (Array.isArray(children) && children.length === 0) ? (
                <div className="flex items-center justify-center p-4 text-center text-muted-foreground">
                    <p>Drag question components here</p>
                </div>
            ) : (
                children
            )}
        </div>
    );
}

// Crucial for Craft.js to recognize this component in the editor
ChallengeContentCanvas.craft = {
    displayName: "Challenge Canvas",
    // Rules can be added here if you want to restrict what can be dropped inside.
    // For now, we'll allow anything.
    rules: {
        canMoveIn: () => true,
    }
};
