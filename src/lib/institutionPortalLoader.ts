// /lib/institutionPortalLoader.ts (NEW FILE)
import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

// Define a type for the props these components will receive
export type InstitutionPortalProps = {
  institution: any; // Type this with your IInstitution lean object
  membership?: any; // Type with IInstitutionMember lean object
  user?: any; // Type with your session user object
  // Add any other props needed by all portal components
};

// The registry maps an institution's unique identifier to its set of portal components
const institutionPortals: Record<string, {
  PublicLanding: ComponentType<InstitutionPortalProps>;
  Registration: ComponentType<InstitutionPortalProps>;
  Dashboard: ComponentType<InstitutionPortalProps>;
}> = {
  // Key: 'mor-ethiopia' -> This should be a unique slug or ID for the institution
  'mor-ethiopia': {
    PublicLanding: dynamic(() => import('@/app/static/institutions/mor-ethiopia/MorPublicLanding')),
    Registration: dynamic(() => import('@/app/static/institutions/mor-ethiopia/MorRegistration')),
    Dashboard: dynamic(() => import('@/app/static/institutions/mor-ethiopia/MorDashboard')),
    // You can add the certificate page here too if it's part of the main portal view
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
