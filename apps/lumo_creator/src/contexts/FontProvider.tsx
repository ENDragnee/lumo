// @/components/editor-components/FontProvider.tsx
"use client";

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';

// --- Define the shape of the context ---
interface FontContextType {
    loadedFonts: Set<string>;
    addFont: (fontFamily: string) => void;
}

// --- Create the context ---
const FontContext = createContext<FontContextType>({
    loadedFonts: new Set(),
    addFont: () => {},
});

// --- Custom hook for easy access to the context ---
export const useFontManager = () => useContext(FontContext);

// --- The FontProvider Component ---
interface FontProviderProps {
    children: ReactNode;
}

export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
    // Use a Set to automatically handle duplicate font families
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(['Inter'])); // Start with a default font

    // Function to add a font to our list, exposed via context
    const addFont = useCallback((fontFamily: string) => {
        setLoadedFonts(prevFonts => {
            // Create a new set to trigger a re-render if the font is new
            if (prevFonts.has(fontFamily)) {
                return prevFonts; // No change
            }
            const newSet = new Set(prevFonts);
            newSet.add(fontFamily);
            return newSet;
        });
    }, []);

    // --- Effect to dynamically load fonts from Google Fonts ---
    useEffect(() => {
        if (loadedFonts.size === 0) return;

        // Construct the Google Fonts URL
        const families = Array.from(loadedFonts)
            .map(font => `family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700;900`) // Load a good range of weights
            .join('&');
        
        const url = `https://fonts.googleapis.com/css2?${families}&display=swap`;
        
        const linkId = 'google-fonts-link';
        let link = document.getElementById(linkId) as HTMLLinkElement | null;

        // If the link tag doesn't exist, create it
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        // Update the href to load the new set of fonts
        link.href = url;

    }, [loadedFonts]); // This effect runs whenever the set of loaded fonts changes

    return (
        <FontContext.Provider value={{ loadedFonts, addFont }}>
            {children}
        </FontContext.Provider>
    );
};
