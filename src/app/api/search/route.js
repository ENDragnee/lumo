import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SerializedData from '@/models/SerializedData';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Search the content collection by tags or data.
    const contentResults = await SerializedData.find({
      $or: [
        { tags: { $regex: query, $options: 'i' } },
        { data: { $regex: query, $options: 'i' } }
      ]
    })
      .select('data tags createdAt')
      .limit(10)
      .lean();

    // Search for matching users.
    const userResults = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    })
      .select('username name avatar')
      .limit(5)
      .lean();

    // Transform the general content results.
    const transformedContent = contentResults.map((item) => ({
      ...item,
      data: JSON.parse(item.data),
      _id: item._id.toString(),
      type: 'content',
    }));

    // For each found user, fetch content created by that user.
    const transformedUsers = await Promise.all(
      userResults.map(async (user) => {
        const userId = user._id.toString();
        const userContent = await SerializedData.find({ user: userId })
          .select('data tags createdAt')
          .limit(10)
          .lean();

        const transformedUserContent = userContent.map((item) => ({
          ...item,
          data: JSON.parse(item.data),
          _id: item._id.toString(),
          type: 'userContent',
        }));

        return {
          ...user,
          _id: userId,
          type: 'user',
          // Attach the content created by this user.
          content: transformedUserContent,
        };
      })
    );

    // Return the response with both general content and users (with their content).
    return NextResponse.json({
      success: true,
      data: {
        content: transformedContent,
        users: transformedUsers,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
