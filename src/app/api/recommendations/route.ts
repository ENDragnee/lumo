// app/api/recommendations/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/SerializedData';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let userInterests: string[] = [];
    if (userId) {
      const user = await User.findById(userId).select('interests');
      userInterests = user?.interests || [];
    }

    const pipeline = [
      {
        $addFields: {
          matchScore: {
            $size: {
              $setIntersection: [userInterests, "$tags"]
            }
          }
        }
      },
      {
        $addFields: {
          relevance: {
            $add: [
              { $multiply: ["$views", 0.15] },
              { $multiply: ["$passRate", 0.25] },
              { $multiply: ["$matchScore", 0.4] },
              { 
                $multiply: [
                  { $subtract: [1, { 
                    $divide: [
                      { $subtract: [new Date(), "$createdAt"] },
                      2592000000 // 30 days
                    ]
                  }]},
                  0.2
                ]
              }
            ]
          }
        }
      },
      { $sort: { relevance: -1 as 1 | -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnail: 1,
          subject: 1,
          institution: 1,
          views: 1,
          passRate: 1
        }
      }
    ];

    const results = await Content.aggregate(pipeline);
    return NextResponse.json(results);

  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}