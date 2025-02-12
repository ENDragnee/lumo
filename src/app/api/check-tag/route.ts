import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { tag } = await request.json();
    await connectDB();

    const existingUser = await User.findOne({ userTag: tag });
    if (existingUser) {
      const baseTag = tag.replace(/@/g, '');
      const suggestions = [];
      
      for (let i = 1; i <= 3; i++) {
        const newTag = `@${baseTag}${Math.floor(Math.random() * 1000)}`;
        if (!(await User.findOne({ userTag: newTag }))) {
          suggestions.push(newTag);
          if (suggestions.length >= 3) break;
        }
      }
      
      return NextResponse.json({ available: false, suggestions });
    }
    
    return NextResponse.json({ available: true });
    
  } catch (error) {
    console.error('Error checking tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}