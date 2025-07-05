// /lib/institutionPortalLoader.ts (UPDATED FILE)
import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { IContent } from '@/models/Content'; // Import IContent type for the dashboard props

// Define a type for the props these components will receive
export type InstitutionPortalProps = {
  institution: any; // Type this with your IInstitution lean object
  membership?: any; // Type with IInstitutionMember lean object
  user?: any; // Type with your session user object
  // Add any other props needed by all portal components
};

// --- NEW ---
// Define a specific type for Dashboard props, which extends the base props.
// This allows the dashboard to receive all the standard portal props plus its own specific ones (`modules`).
export type DashboardPortalProps = InstitutionPortalProps & {
  modules: (IContent & { _id: string })[];
};


// The registry maps an institution's unique identifier to its set of portal components
const institutionPortals: Record<string, {
  PublicLanding: ComponentType<InstitutionPortalProps>;
  Registration: ComponentType<InstitutionPortalProps>;
  // --- UPDATED ---
  // The Dashboard component type now uses the specific DashboardPortalProps.
  Dashboard: ComponentType<DashboardPortalProps>;
}> = {
  // Key: 'mor-ethiopia' -> This should be a unique slug or ID for the institution
  'mor-ethiopia': {
    PublicLanding: dynamic(() => import('@/components/static/institutions/mor-ethiopia/MorPublicLanding')),
    Registration: dynamic(() => import('@/components/static/institutions/mor-ethiopia/MorRegistration')),
    // --- UPDATED ---
    // Corrected the import path to point to the `/app` directory where the component is located.
    Dashboard: dynamic(() => import('@/components/static/institutions/mor-ethiopia/MorDashboard'))
  },
  // Add other institutions here as you create their portals
  // 'another-institution': { ... }
};

/**
 * Securely loads a set of portal components for a given institution.
 * @param institutionKey The unique identifier for the institution.
 * @returns An object with the portal components, or null if not found.
 */
export const loadInstitutionPortal = (institutionKey: string) => {
  return institutionPortals[institutionKey] || null;
};
