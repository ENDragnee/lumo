import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';  
import SerializedData from '@/models/SerializedData';

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get search query
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    // Validate query
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Search query must be at least 2 characters' 
        },
        { status: 400 }
      );
    }

    // Perform search
    const results = await SerializedData.find({
      tags: { $regex: query, $options: 'i' }
    })
    .select('data tags createdAt')
    .limit(10)
    .lean();

    // Transform data
    const transformedResults = results.map(item => ({
      ...item,
      data: JSON.parse(item.data),
      _id: item._id.toString()
    }));

    return NextResponse.json({
      success: true,
      data: transformedResults
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}