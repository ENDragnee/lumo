// /lib/staticContentLoader.ts
import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

// Define the registry.
// The key is the identifier you will store in the 'data' field of your Content model.
// The value is a dynamic import function that points to the component.
const staticComponents: Record<string, ComponentType<{}>> = {
  // Key: 'welcome-page' -> Component: /src/app/static/WelcomePage.tsx
  'welcome-page': dynamic(() => import('@/components/static/institutions/mor-ethiopia/TaxRegistrationModule')),

  // Add more static pages here as you create them
  // 'advanced-css': dynamic(() => import('@/app/static/AdvancedCss')),
  // 'getting-started': dynamic(() => import('@/app/static/GettingStarted')),
};

/**
 * Securely loads a static component based on its registered key.
 * @param key The identifier for the component (from the database).
 * @returns The component if found, otherwise null.
 */
export const loadStaticComponent = (key: string): ComponentType<{}> | null => {
  return staticComponents[key] || null;
};
