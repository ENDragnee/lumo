// app/api/settings/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserSettings from '@/models/UserSettings';
import Subscribtion from '@/models/Subscribtion'; // Corrected import
import mongoose from 'mongoose';

// --- GET: Fetch all data needed for the settings page ---
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Fetch user profile, settings, and subscriptions in parallel for efficiency
    const [userProfile, userSettings, userSubscriptions] = await Promise.all([
      User.findById(userId).select('name email profileImage bio institution createdAt provider').lean(),
      // Use findOneAndUpdate with upsert to create default settings if they don't exist
      UserSettings.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId } },
        { upsert: true, new: true, runValidators: true }
      ).lean(),
      // Find all active subscriptions and populate the creator's details
      Subscribtion.find({ userId, isSubscribed: true })
        .populate({
            path: 'creatorId',
            model: User, // Explicitly provide the User model for population
            select: 'name profileImage' // Select only the fields we need
        })
        .lean()
    ]);

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Combine into a single response object
    const settingsData = {
      profile: userProfile,
      notifications: userSettings?.notifications,
      subscriptions: userSubscriptions,
    };

    return NextResponse.json(settingsData);

  } catch (error) {
    console.error("GET /api/settings Error:", error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// --- PATCH: Update user's profile and settings ---
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { profile, notifications } = body;

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const operations: Promise<any>[] = [];

    if (profile) {
      const updatePayload: Record<string, any> = {};
      if (profile.name) updatePayload.name = profile.name;
      if (profile.bio) updatePayload.bio = profile.bio;
      
      if (Object.keys(updatePayload).length > 0) {
        operations.push(User.findByIdAndUpdate(userId, { $set: updatePayload }));
      }
    }

    if (notifications) {
      const updatePayload: Record<string, any> = {};
      for (const [key, value] of Object.entries(notifications)) {
          updatePayload[`notifications.${key}`] = value;
      }
      if (Object.keys(updatePayload).length > 0) {
        operations.push(UserSettings.findOneAndUpdate({ userId }, { $set: updatePayload }));
      }
    }

    if (operations.length === 0) {
        return NextResponse.json({ message: "No settings data provided to update." }, { status: 400 });
    }

    await Promise.all(operations);

    return NextResponse.json({ message: 'Settings updated successfully' });

  } catch (error) {
    console.error("PATCH /api/settings Error:", error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
