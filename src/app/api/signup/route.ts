import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { hashPassword } from '@/lib/password-utils';
import User from '@/models/User';
import { verifyOTP } from "@/lib/otp"
import { error } from 'console';

interface SignupRequestBody {
  email: string;
  gender: string;
  otp: string;
  userTag: string,
  password: string;
  userName: string;
  user_type: string;
  bio: string;
  tags: [string];
  credentials: [string];
  profileImage: string;
}

export async function POST(req: Request) {
  try {
    const body: SignupRequestBody = await req.json();

    // Validate the input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create new user
    const newUser = new User({
      email: body.email,
      userTag: body.userTag,
      otp: body.otp,
      gender: body.gender,
      password_hash: hashedPassword,
      user_type: body.user_type,
      name: body.userName,
      bio: body.bio,
      tags: body.tags,
      credentials: body.credentials,
      profileImage: body.profileImage || '',
    });
    
    try {
      const isOtpValid = await verifyOTP(body.email, body.otp);
      if (!isOtpValid) {
        return NextResponse.json({error: 'Invalid or expired OTP.'}, {status: 400})
      }
    } catch (error) {
      return NextResponse.json({error: 'Error verifying OTP.'}, {status: 500});
    }
  

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}