// /lib/institutionPortalLoader.ts (UPDATED FILE)
import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { IContent } from '@/models/Content';

// Define a type for the props these components will receive
export type InstitutionPortalProps = {
  institution: any;
  membership?: any;
  user?: any;
};

// Define a specific type for Dashboard props, which extends the base props.
export type DashboardPortalProps = InstitutionPortalProps & {
  modules: (IContent & { _id: string })[];
  accentColor: string;
  interactedContentIds: string[];
};

// The registry maps an institution's unique identifier to its set of portal components
const institutionPortals: Record<string, {
  PublicLanding: ComponentType<InstitutionPortalProps>;
  Registration: ComponentType<InstitutionPortalProps>;
  Dashboard: ComponentType<DashboardPortalProps>; // This now uses the corrected type
}> = {
  'mor-ethiopia': {
    PublicLanding: dynamic(() => import('@/components/static/institutions/mor-ethiopia/MorPublicLanding')),
    Registration: dynamic(() => import('@/components/static/institutions/mor-ethiopia/MorRegistration')),
    Dashboard: dynamic(() => import('@/components/static/institutions/mor-ethiopia/MorDashboard'))
  },
  'aastu-ethiopia': {
    PublicLanding: dynamic(() => import('@/app/aastu/page')),
    Registration: dynamic(() => import('@/app/aastu/page')),
    Dashboard: dynamic(() => import('@/app/aastu/page'))

  },
};

export const loadInstitutionPortal = (institutionKey: string) => {
  return institutionPortals[institutionKey] || null;
};
