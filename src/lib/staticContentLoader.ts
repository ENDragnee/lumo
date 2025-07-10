// /lib/staticContentLoader.ts
import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

// Define the registry.
// The key is the identifier you will store in the 'data' field of your Content model.
// The value is a dynamic import function that points to the component.
const staticComponents: Record<string, ComponentType<{}>> = {
  // Key: 'welcome-page' -> Component: /src/app/static/WelcomePage.tsx
  'chapter 1/chapter 1.1': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 1/chapter 1.1')),
  'chapter 1/chapter 1.2': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 1/chapter 1.2')),
  'chapter 1/chapter 1.3': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 1/chapter 1.3')),
  'chapter 1/chapter 1.4': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 1/chapter 1.4')),
  'chapter 2/chapter 2.1': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.1')),
  'chapter 2/chapter 2.10': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.10')),
  'chapter 2/chapter 2.11': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.11')),
  'chapter 2/chapter 2.12': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.12')),
  'chapter 2/chapter 2.13': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.13')),
  'chapter 2/chapter 2.14': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.14')),
  'chapter 2/chapter 2.15': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.15')),
  'chapter 2/chapter 2.16': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.16')),
  'chapter 2/chapter 2.17': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.17')),
  'chapter 2/chapter 2.18': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.18')),
  'chapter 2/chapter 2.2': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.2')),
  'chapter 2/chapter 2.3': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.3')),
  'chapter 2/chapter 2.4': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.4')),
  'chapter 2/chapter 2.5': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.5')),
  'chapter 2/chapter 2.6': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.6')),
  'chapter 2/chapter 2.7': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.7')),
  'chapter 2/chapter 2.8': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.8')),
  'chapter 2/chapter 2.9': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 2/chapter 2.9')),
  'chapter 3/chapter 3.1': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 3/chapter 3.1')),
  'chapter 3/chapter 3.2': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 3/chapter 3.2')),
  'chapter 3/chapter 3.3': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 3/chapter 3.3')),
  'chapter 3/chapter 3.4': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 3/chapter 3.4')),
  'chapter 3/chapter 3.5': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 3/chapter 3.5')),
  'chapter 3/chapter 3.6': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 3/chapter 3.6')),
  'chapter 3/chapter 3.7': dynamic(() => import('@/components/static/institutions/mor-ethiopia/modules/chapter 3/chapter 3.7')),

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
