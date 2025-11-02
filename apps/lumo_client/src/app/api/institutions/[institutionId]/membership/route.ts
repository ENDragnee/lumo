// /app/api/institutions/[institutionId]/membership/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Institution from '@/models/Institution';
import InstitutionMember, { IInstitutionMember } from '@/models/InstitutionMember';

type RouteParams = {
  params: Promise<{
    institutionId: string;
  }>;
};

// --- This is the main creation endpoint ---
export async function POST(request: Request, { params }: RouteParams) {
  // 1. Get the current user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please log in to join.' }, { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);

  // 2. Validate the institutionId from the URL
  const { institutionId: institutionIdStr } = await params;
  if (!mongoose.Types.ObjectId.isValid(institutionIdStr)) {
    return NextResponse.json({ error: 'Invalid Institution ID format.' }, { status: 400 });
  }
  const institutionId = new mongoose.Types.ObjectId(institutionIdStr);

  // 3. Parse request body for optional metadata
  let metadata = {};
  try {
    const body = await request.json();
    if (body.metadata) {
      metadata = body.metadata;
    }
  } catch (e) {
    // If the body is empty or not valid JSON, we just proceed with empty metadata.
    // This makes the metadata field truly optional.
  }
  
  await dbConnect();

  try {
    // 4. Check if the institution actually exists
    const institution = await Institution.findById(institutionId);
    if (!institution) {
      return NextResponse.json({ error: 'Institution not found.' }, { status: 404 });
    }

    // 5. Idempotency Check: Prevent duplicate memberships
    const existingMembership = await InstitutionMember.findOne({
      userId,
      institutionId,
    });

    if (existingMembership) {
      // If the user is already a member (even if pending/revoked), return a conflict error.
      // An update (PUT/PATCH) endpoint would be used to change their status.
      return NextResponse.json({
        error: `You are already associated with this institution with status: ${existingMembership.status}.`,
      }, { status: 409 }); // 409 Conflict is the appropriate status code
    }

    // 6. Create the new membership document
    // NOTE: By default, the role is 'member' and status is 'active'.
    // To implement an approval flow, you would change `status` to `'pending'`.
    const newMemberData: Partial<IInstitutionMember> = {
      userId,
      institutionId,
      role: 'member', // New joiners are standard members
      status: 'active', // or 'pending' for an approval workflow
      metadata,
    };

    const newMember = new InstitutionMember(newMemberData);
    await newMember.save();

    // 7. (Crucial) Update the institution's members array
    // This keeps the `institution.members` array in sync.
    await Institution.findByIdAndUpdate(institutionId, {
      $addToSet: { members: userId } // $addToSet prevents duplicate user IDs
    });

    // 8. Success!
    return NextResponse.json({
      message: 'Successfully joined institution.',
      data: {
        membershipId: newMember._id,
        role: newMember.role,
        status: newMember.status,
      },
    }, { status: 201 }); // 201 Created is the correct status for a successful POST

  } catch (error) {
    console.error('Failed to create institution membership:', error);
    // Handle potential duplicate key error from the database just in case
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json({ error: 'A membership for this user and institution already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
