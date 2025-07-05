// /app/institution/[institutionId]/page.tsx (CORRECTED)

import { getServerSession } from 'next-auth/next'; // Import Session type
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Institution, { IInstitution } from '@/models/Institution';
import InstitutionMember, { IInstitutionMember } from '@/models/InstitutionMember';
import { loadInstitutionPortal } from '@/lib/institutionPortalLoader';
import { notFound } from 'next/navigation';
import { Session } from 'next-auth';
// No need to import User from 'next-auth' here, we'll use Session

// It's good practice to define the data fetching logic separately
async function getPortalData(institutionId: string): Promise<{
  institution: (IInstitution & { _id: string }) | null;
  membership: (IInstitutionMember & { _id: string }) | null;
  session: Session | null; // Use the Session type which includes our custom user
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
  
  // The type declaration file ensures `session.user.id` exists and is a string
  if (session?.user?.id) {
    membershipPromise = InstitutionMember.findOne({
      institutionId: new mongoose.Types.ObjectId(institutionId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).lean();
  }

  // 5. Await all promises
  const [institution, membership] = await Promise.all([institutionPromise, membershipPromise]);

  // The .lean() objects need to be stringified for Next.js to be happy
  return {
    institution: institution ? JSON.parse(JSON.stringify(institution)) : null,
    membership: membership ? JSON.parse(JSON.stringify(membership)) : null,
    session, // Return the whole session object
  };
}


export default async function InstitutionPortalPage({ params }: { params: { institutionId: string } }) {
  const { institutionId } = params;
  
  const { institution, membership, session } = await getPortalData(institutionId);
  const sessionUser = session?.user; // This user is now correctly typed

  // If the institution itself doesn't exist, show a 404 page.
  if (!institution) {
    notFound();
  }
  
  // For this specific portal, we use 'mor-ethiopia' as the key.
  const PortalComponents = loadInstitutionPortal(institution.portalKey);

  if (!PortalComponents) {
    return <div>Error: The portal for this institution is not configured.</div>;
  }
  
  const portalProps = {
    institution,
    membership,
    user: sessionUser, // Pass the correctly typed user
  };

  // --- The Core Authorization and Rendering Logic ---

  if (membership && membership.status === 'active') {
    // USER IS AN ACTIVE MEMBER: Show the full dashboard.
    return <PortalComponents.Dashboard {...portalProps} />;
  } else if (sessionUser) {
    // USER IS LOGGED IN, BUT NOT A MEMBER (or pending/revoked): Show the registration page.
    return <PortalComponents.Registration {...portalProps} />;
  } else {
    // USER IS NOT LOGGED IN: Show the public landing page.
    return <PortalComponents.PublicLanding {...portalProps} />;
  }
}
