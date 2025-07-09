// /app/institution/[institutionId]/page.tsx (CORRECTED & UPDATED)

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Institution, { IInstitution } from '@/models/Institution';
import InstitutionMember, { IInstitutionMember } from '@/models/InstitutionMember';
import { loadInstitutionPortal } from '@/lib/institutionPortalLoader';
import { notFound } from 'next/navigation';
import { Session } from 'next-auth';
import Content from '@/models/Content';
// --- 1. IMPORT THE ACTION ---
import { getInteractedContentIds } from '@/app/actions/interactionActions';

// It's good practice to define the data fetching logic separately
async function getPortalData(institutionId: string): Promise<{
  institution: (IInstitution & { _id: string }) | null;
  membership: (IInstitutionMember & { _id: string }) | null;
  session: Session | null;
}> {
  // 1. Get Session
  const session = await getServerSession(authOptions);

  // 2. Validate ID and Connect to DB
  if (!mongoose.Types.ObjectId.isValid(institutionId)) {
    return { institution: null, membership: null, session };
  }
  await dbConnect();

  // 3. Fetch Institution in parallel
  const institutionPromise = Institution.findById(institutionId).lean();
  
  // 4. Fetch Membership only if user is logged in
  let membershipPromise: Promise<IInstitutionMember | null> = Promise.resolve(null);
  
  if (session?.user?.id) {
    membershipPromise = InstitutionMember.findOne({
      institutionId: new mongoose.Types.ObjectId(institutionId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).lean();
  }

  // 5. Await all promises
  const [institution, membership] = await Promise.all([institutionPromise, membershipPromise]);

  return {
    institution: institution ? JSON.parse(JSON.stringify(institution)) : null,
    membership: membership ? JSON.parse(JSON.stringify(membership)) : null,
    session,
  };
}


export default async function InstitutionPortalPage({ params }: { params: Promise<{ institutionId: string }> }) {
  const { institutionId } = await params;
  
  const { institution, membership, session } = await getPortalData(institutionId);
  const sessionUser = session?.user;
  // Fetch modules only if the user is a member, as they are only needed for the dashboard
  const modules = (membership && membership.status === 'active') 
    ? await Content.find({ institutionId: institutionId }).sort({ order: 1 }).lean() 
    : [];

  if (!institution) {
    notFound();
  }
  
  const PortalComponents = loadInstitutionPortal(institution.portalKey);

  if (!PortalComponents) {
    return <div>Error: The portal for this institution is not configured.</div>;
  }
  
  const portalProps = {
    institution,
    membership,
    user: sessionUser,
  };

  // --- The Core Authorization and Rendering Logic ---

  if (membership && membership.status === 'active') {
    // USER IS AN ACTIVE MEMBER: Show the full dashboard.

    // --- 2. GET LIVE INTERACTION DATA ---
    // Get an array of all module IDs
    const moduleIds = modules.map(m => m._id.toString());
    // Call the action to find out which of these modules the user has interacted with
    const interactedIds = await getInteractedContentIds(moduleIds);
    
    // Construct the full props object required by the Dashboard component.
    const dashboardProps = {
      ...portalProps,
      modules: JSON.parse(JSON.stringify(modules)),
      accentColor: institution.branding?.primaryColor || '#059669',
      // --- 3. PASS THE CORRECT DATA TO THE DASHBOARD ---
      // Use the fresh data from the action, not from membership metadata.
      interactedContentIds: interactedIds,
    };
    
    return <PortalComponents.Dashboard {...dashboardProps} />;

  } else if (sessionUser) {
    // USER IS LOGGED IN, BUT NOT A MEMBER: Show the registration page.
    return <PortalComponents.Registration {...portalProps} />;
  } else {
    // USER IS NOT LOGGED IN: Show the public landing page.
    return <PortalComponents.PublicLanding {...portalProps} />;
  }
}
