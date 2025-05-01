// app/api/recommendations/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/SerializedData';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let userInterests: string[] = [];
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
      }
      // Define interface directly or import if used elsewhere
      interface UserWithInterests {
        interests?: string[];
      }
      const user = await User.findById(userId).select('interests').lean<UserWithInterests>();
      userInterests = user?.interests || [];
    }

    const pipeline: mongoose.PipelineStage[] = [
      {
        $addFields: {
          // Ensure tags is an array, default to empty array if not or null/missing
          safeTags: {
             $ifNull: [
                { $cond: { if: { $eq: [{ $type: "$tags" }, "array"] }, then: "$tags", else: [] } },
                []
             ]
          },
          // Calculate match score using safeTags, ensuring $size always gets an array
          matchScore: {
            $size: { // Apply $size to the result of $ifNull
                $ifNull: [ // Check if $setIntersection returns null
                    { $setIntersection: [userInterests, "$safeTags"] },
                    [] // Default to empty array [] if intersection yields null
                ]
            }
          },
          // Ensure numeric fields are numbers using $type, default to 0 otherwise
          safeViews: {
            $ifNull: [
              { $cond: {
                  if: { $or: [
                      { $eq: [{ $type: "$views" }, "double"] }, { $eq: [{ $type: "$views" }, "int"] },
                      { $eq: [{ $type: "$views" }, "long"] }, { $eq: [{ $type: "$views" }, "decimal"] }
                  ]},
                  then: "$views", else: 0
              }},
              0
            ]
          },
          safePassRate: {
            $ifNull: [
              { $cond: {
                  if: { $or: [
                      { $eq: [{ $type: "$passRate" }, "double"] }, { $eq: [{ $type: "$passRate" }, "int"] },
                      { $eq: [{ $type: "$passRate" }, "long"] }, { $eq: [{ $type: "$passRate" }, "decimal"] }
                  ]},
                  then: "$passRate", else: 0
              }},
              0
            ]
          },
          // Ensure createdAt is a date using $type, default to epoch if not
          safeCreatedAt: {
            $ifNull: [
              { $cond: {
                  if: { $eq: [{ $type: "$createdAt" }, "date"] },
                  then: "$createdAt", else: new Date(0)
              }},
              new Date(0)
            ]
          }
        }
      },
      // Calculate relevance score using safe fields
      {
        $addFields: {
          relevance: {
            $add: [
              { $multiply: ["$safeViews", 0.15] },
              { $multiply: ["$safePassRate", 0.25] },
              { $multiply: ["$matchScore", 0.4] }, // matchScore should now always be a number (>= 0)
              {
                $multiply: [
                  { $max: [ 0,
                      { $subtract: [1, {
                          $divide: [
                            { $subtract: [new Date(), "$safeCreatedAt"] },
                            (30 * 24 * 60 * 60 * 1000)
                          ]
                      }]}
                  ]},
                  0.2
                ]
              }
            ]
          }
        }
      },
      // Sort and limit
      { $sort: { relevance: -1 } },
      { $limit: 20 },
      // Project the final fields - INCLUDING TAGS
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnail: 1,
          subject: 1,
          institution: 1,
          tags: "$safeTags",
        }
      }
    ];

    const results = await Content.aggregate(pipeline).exec();

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Recommendation error:', error);
    // Log the specific stage if possible, or more detailed error info
    if (error instanceof mongoose.mongo.MongoServerError) { // More specific type check
         console.error("Aggregation Pipeline Error Details:", error.errInfo); // Log potential extra info
         return NextResponse.json(
           { message: `Internal server error during recommendation aggregation: ${error.codeName || 'Unknown Code'}`, details: error.message },
           { status: 500 }
         );
    }
    return NextResponse.json(
      { message: 'Internal server error fetching recommendations.', details: error.message },
      { status: 500 }
    );
  }
}