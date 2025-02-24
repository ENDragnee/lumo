import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SerializedData from '@/models/SerializedData';
import User from '@/models/User';

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    // Validate query length
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // SEARCH CONTENTS:
    // Search in content collection (SerializedData) by matching query against tags, title, subject, or institution
    const contentResults = await SerializedData.find({
      $or: [
        { tags: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { subject: { $regex: query, $options: 'i' } },
        { institution: { $regex: query, $options: 'i' } }
      ]
    })
      .select('data tags createdAt title subject institution thumbnail')
      .limit(10)
      .lean();

    // Transform content data (e.g., parse JSON data field and convert _id to a string)
    const transformedContent = contentResults.map((item) => ({
      ...item,
      data: JSON.parse(item.data),
      _id: item._id.toString(),
      thumbnail: item.thumbnail
    }));

    // SEARCH USERS:
    // Search in users collection by matching query against name, email, userTag, or bio
    const userResults = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { userTag: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    })
      .select('name email userTag profileImage')
      .limit(10)
      .lean();

    // Transform user results to match the expected component format:
    // Rename userTag to username, profileImage to avatar, and convert _id to string.
    const transformedUsers = userResults.map((user) => ({
      _id: user._id.toString(),
      username: user.userTag,
      name: user.name,
      avatar: user.profileImage || '/default-avatar.png'
    }));

    // Return both sets of results in the response
    return NextResponse.json({
      success: true,
      data: {
        content: transformedContent,
        users: transformedUsers
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
