// src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { hashPassword } from '@/lib/password-utils';
import User from '@/models/User';
import { verifyOTP } from "@/lib/otp";

// Helper function to generate a unique userTag (no changes needed here)
async function generateUniqueUserTag(email: string): Promise<string> {
  let baseTag = email.split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20);

  if (baseTag.length < 3) {
    baseTag = `user_${baseTag}`;
  }

  let userTag = `@${baseTag}`;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 20;

  while (!isUnique && attempts < maxAttempts) {
    const existingUser = await User.findOne({ userTag });
    if (!existingUser) {
      isUnique = true;
    } else {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      userTag = `@${baseTag.slice(0, 16)}_${randomSuffix}`;
    }
    attempts++;
  }

  if (!isUnique) {
    userTag = `@user_${Date.now()}`;
  }

  return userTag;
}

// Update the request body interface
interface SignupRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  otp: string;
}

export async function POST(req: Request) {
  try {
    const body: SignupRequestBody = await req.json();
    // Destructure new fields
    const { firstName, lastName, email, password, gender, otp } = body;

    // 1. Validate the input
    if (!firstName || !lastName || !email || !password || !gender || !otp) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // 2. Connect to MongoDB
    await connectDB();

    // 3. Verify OTP first
    const isOtpValid = await verifyOTP(email, otp);
    if (!isOtpValid) {
        return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 400 });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // 5. Combine first and last name for the 'name' field
    const name = `${firstName.trim()} ${lastName.trim()}`;

    // 6. Generate unique userTag
    const userTag = await generateUniqueUserTag(email);
    
    // 7. Hash password
    const hashedPassword = await hashPassword(password);

    // 8. Create new user with the combined name
    const newUser = new User({
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      userTag: userTag,
      name: name, // Use the combined name
      gender: gender,
      provider: 'credentials',
      isVerified: true, // Verified via OTP
      // Set other fields to defaults from your schema
      user_type: 'student',
      bio: '',
      tags: [],
      credentials: [],
      profileImage: '',
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully', userTag: newUser.userTag },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup.' },
      { status: 500 }
    );
  }
}