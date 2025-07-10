// /app/api/institutions/[institutionId]/auth/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Assuming you have your NextAuth config here
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import InstitutionMember from '@/models/InstitutionMember';

type RouteParams = {
  params: Promise<{
    institutionId: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  // 1. Get the current user session
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  // 2. Validate the institutionId from the URL
  const { institutionId } = await params;
  if (!mongoose.Types.ObjectId.isValid(institutionId)) {
    return NextResponse.json({ error: 'Invalid Institution ID format.' }, { status: 400 });
  }

  try {
    await dbConnect();

    // 3. The Core Logic: Find the membership document
    // This single query checks if the user is a member AND is active.
    const membership = await InstitutionMember.findOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
      institutionId: new mongoose.Types.ObjectId(institutionId),
      status: 'active', // Ensure the membership is active
    }).lean(); // .lean() for a fast, read-only operation

    // 4. Handle the result
    if (!membership) {
      // If no document is found, the user is not an active member.
      return NextResponse.json({ error: 'Forbidden. You are not a member of this institution.' }, { status: 403 });
    }

    // 5. Success! The user is authorized.
    // Return the membership details. The frontend can use this to customize the portal
    // (e.g., show an "Admin Panel" button if role is 'admin').
    return NextResponse.json({
      message: 'Authorization successful.',
      data: {
        role: membership.role,
        joinedAt: membership.joinedAt,
        metadata: membership.metadata,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Institution auth error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
