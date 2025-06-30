// app/api/settings/change-password/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, hashPassword } from '@/lib/password-utils';
import mongoose from 'mongoose';

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
        }

        await connectDB();
        const userId = new mongoose.Types.ObjectId(session.user.id);
        
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // You can't change the password for an OAuth user
        if (user.provider !== 'credentials' || !user.password_hash) {
            return NextResponse.json({ error: 'Password cannot be changed for this account type' }, { status: 403 });
        }

        // Verify the current password is correct
        const isPasswordCorrect = await verifyPassword(currentPassword, user.password_hash);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 403 });
        }

        // Hash the new password and update the user document
        const newHashedPassword = await hashPassword(newPassword);
        user.password_hash = newHashedPassword;
        await user.save();

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error("Change Password API Error:", error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
