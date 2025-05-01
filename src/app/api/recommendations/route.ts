// app/api/recommendations/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Assuming this handles DB connection logic
import Content from '@/models/SerializedData'; // Your primary Content model
import User from '@/models/User'; // Your User model
import Progress from '@/models/Progress'; // Your Progress model
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next"; // For server-side session retrieval (adjust if using different auth)
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration (adjust path if needed)

// Define interface for User with Interests (can be imported if used elsewhere)
interface UserWithInterests {
  interests?: string[];
}

export async function GET(request: Request) {
  try {
    await connectDB(); // Ensure database connection is established

    const { searchParams } = new URL(request.url);

    // --- Get User ID ---
    // Prioritize getting userId from a secure server session if available
    let userId: string | null = null;
    let userIdObject: mongoose.Types.ObjectId | null = null;

    const session = await getServerSession(authOptions); // Fetch server session
    if (session?.user?.id) {
        // Validate the ID format from the session
        if (mongoose.Types.ObjectId.isValid(session.user.id)) {
            userId = session.user.id;
            userIdObject = new mongoose.Types.ObjectId(userId);
        } else {
            console.warn(`Invalid user ID format found in session: ${session.user.id}`);
            // Optionally handle this case, e.g., log it, but proceed without userId
        }
    } else {
        // Fallback: Check query parameter if no session user ID (less secure, use with caution)
        const userIdFromQuery = searchParams.get('userId');
        if (userIdFromQuery) {
            if (mongoose.Types.ObjectId.isValid(userIdFromQuery)) {
                userId = userIdFromQuery;
                userIdObject = new mongoose.Types.ObjectId(userId);
            } else {
                // If an ID was *provided* via query but is invalid, return an error
                return NextResponse.json({ message: 'Invalid user ID format provided in query parameter' }, { status: 400 });
            }
        }
        // If no ID from session or query, proceed without user-specific data (userIdObject remains null)
    }


    // --- Fetch User Interests (only if userId is valid) ---
    let userInterests: string[] = [];
    if (userIdObject) { // Only fetch if we have a valid ObjectId
      try {
        const user = await User.findById(userIdObject).select('interests').lean<UserWithInterests>();
        userInterests = user?.interests || [];
      } catch (userError) {
          console.error(`Error fetching interests for user ${userIdObject}:`, userError);
          // Decide how to handle: Proceed with empty interests or return an error?
          // Let's proceed with empty interests for now.
          userInterests = [];
      }
    }
    // If userIdObject is null, userInterests remains empty array


    // --- Aggregation Pipeline ---
    const pipeline: mongoose.PipelineStage[] = [
      // Stage 1: Add Safe Fields & Calculate Initial Match Score
      {
        $addFields: {
          // Ensure tags is an array, default to empty array if not or null/missing
          safeTags: {
             $ifNull: [
                { $cond: { if: { $eq: [{ $type: "$tags" }, "array"] }, then: "$tags", else: [] } },
                []
             ]
          },
          // Calculate match score using safeTags and fetched userInterests
          matchScore: {
            $size: {
                $ifNull: [
                    { $setIntersection: [userInterests, "$safeTags"] }, // Use fetched interests
                    [] // Default to empty array if intersection yields null
                ]
            }
          },
          // Ensure numeric fields are numbers, default to 0 otherwise
          safeViews: {
            $ifNull: [
              { $cond: {
                  if: { $or: [ { $eq: [{ $type: "$views" }, "double"] }, { $eq: [{ $type: "$views" }, "int"] }, { $eq: [{ $type: "$views" }, "long"] }, { $eq: [{ $type: "$views" }, "decimal"] } ] },
                  then: "$views", else: 0
              }}, 0 ]
          },
          safePassRate: {
            $ifNull: [
              { $cond: {
                  if: { $or: [ { $eq: [{ $type: "$passRate" }, "double"] }, { $eq: [{ $type: "$passRate" }, "int"] }, { $eq: [{ $type: "$passRate" }, "long"] }, { $eq: [{ $type: "$passRate" }, "decimal"] } ] },
                  then: "$passRate", else: 0
              }}, 0 ]
          },
          // Ensure createdAt is a date, default to epoch if not
          safeCreatedAt: {
            $ifNull: [
              { $cond: {
                  if: { $eq: [{ $type: "$createdAt" }, "date"] },
                  then: "$createdAt", else: new Date(0)
              }}, new Date(0) ]
          }
        }
      },

      // Stage 2: Calculate Relevance Score using safe fields
      {
        $addFields: {
          relevance: {
            $add: [
              { $multiply: ["$safeViews", 0.15] },
              { $multiply: ["$safePassRate", 0.25] },
              { $multiply: ["$matchScore", 0.4] }, // matchScore uses userInterests
              { // Time decay factor (newer content is slightly more relevant)
                $multiply: [
                  { $max: [ 0, { $subtract: [1, { $divide: [ { $subtract: [new Date(), "$safeCreatedAt"] }, (30 * 24 * 60 * 60 * 1000) ] } ] } ] }, // Normalize based on 30 days
                  0.2
                ]
              }
            ]
          }
        }
      },

      // Stage 3: Sort by Relevance and Limit Results
      { $sort: { relevance: -1 } },
      { $limit: 20 }, // Limit the number of recommendations

      // Stage 4: Lookup User Progress (Conditional based on userIdObject)
      // This stage is only added to the pipeline if userIdObject is not null.
      ...(userIdObject ? [
        {
          $lookup: {
            from: Progress.collection.name, // The actual name of the progress collection in MongoDB
            let: { contentId: "$_id" }, // Define a variable for the current content's _id
            pipeline: [
              { // Match progress document for this specific user and content
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$contentId", "$$contentId"] }, // Match contentId from 'let'
                      { $eq: ["$userId", userIdObject] }     // Match the specific user's ObjectId
                    ]
                  }
                }
              },
              { $limit: 1 }, // Optimization: We only need one progress record per user/content
              { $project: { _id: 0, progress: 1 } } // Select only the 'progress' field
            ],
            as: "userProgressData" // Name of the output array field (will contain 0 or 1 doc)
          }
        }
      ] : []), // If userIdObject is null, this spreads an empty array, effectively skipping the $lookup

      // Stage 5: Project Final Fields (Including Progress)
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnail: 1,
          subject: 1,
          institution: 1,
          tags: "$safeTags", // Project the cleaned tags
          relevance: 1, // Optional: Include relevance score for debugging/analysis
          matchScore: 1, // Optional: Include match score for debugging/analysis

          // Extract progress value from the lookup result, defaulting to 0 if no progress record exists
          progress: {
            $ifNull: [ { $arrayElemAt: ["$userProgressData.progress", 0] }, 0 ]
            // $arrayElemAt gets the 'progress' field from the first (and likely only) element
            // in the 'userProgressData' array. $ifNull handles the case where the array is empty.
          }
        }
      }
    ];

    // Execute the aggregation pipeline
    const results = await Content.aggregate(pipeline).exec();

    // Return the recommendation results
    return NextResponse.json(results);

  } catch (error: any) {
    console.error('API Recommendation Route Error:', error);

    // Handle specific MongoDB errors if possible
    if (error instanceof mongoose.mongo.MongoServerError) {
         console.error("MongoDB Aggregation Error Details:", error.errInfo, "Code:", error.codeName);
         return NextResponse.json(
           { message: `Database error during recommendation aggregation: ${error.codeName || 'Unknown Code'}`, details: error.message },
           { status: 500 }
         );
    }

    // Generic internal server error
    return NextResponse.json(
      { message: 'Internal server error fetching recommendations.', details: error.message },
      { status: 500 }
    );
  }
}