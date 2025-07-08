// app/api/recommendations/institutions/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Institution from '@/models/Institution';
import InstitutionMember from '@/models/InstitutionMember';
import Content from '@/models/Content';
import mongoose, { Types } from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// The static ID for the Ministry of Education portal
const MINISTRY_OF_EDUCATION_ID = '6868ff85f4d25983b416bb61';

// NOTE: This type now perfectly matches the data being sent to the client
type RecommendedInstitution = {
    id: string;
    title: string;
    description: string;
    courseCount: number;
    enrolledCount: number;
    estimatedTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
    gradient: string;
};

// This is an intermediate type representing data from the aggregation pipeline
type AggregatedInstitution = {
    id: string;
    title: string;
    description: string;
    courseCount: number;
    enrolledCount: number;
    totalMinutes: number;
    avgDifficulty: number | null;
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userIdObject = new mongoose.Types.ObjectId(session.user.id);

    try {
        await connectDB();

        const memberships = await InstitutionMember.find({ 
            userId: userIdObject, 
            status: 'active' 
        }).select('institutionId');

        const memberInstitutionIds = memberships.map(m => m.institutionId);
        const institutionIdSet = new Set<string>(memberInstitutionIds.map(id => id.toString()));
        institutionIdSet.add(MINISTRY_OF_EDUCATION_ID);
        const finalInstitutionIds = Array.from(institutionIdSet).map(id => new Types.ObjectId(id));

        const aggregatedResults: AggregatedInstitution[] = await Institution.aggregate([
            { $match: { _id: { $in: finalInstitutionIds } } },
            {
                $lookup: {
                    from: 'contents',
                    localField: '_id',
                    foreignField: 'institutionId',
                    as: 'courses',
                    pipeline: [ { $match: { isDraft: { $ne: true }, isTrash: { $ne: true } } } ]
                }
            },
            {
                $addFields: {
                    courseCount: { $size: '$courses' },
                    enrolledCount: { $ifNull: [{ $sum: '$courses.views' }, 0] },
                    totalMinutes: { $ifNull: [{ $sum: '$courses.durationMinutes' }, 0] },
                    avgDifficulty: {
                        $avg: {
                            $map: {
                                input: '$courses', as: 'course', in: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ['$$course.difficulty', 'easy'] }, then: 1 },
                                            { case: { $eq: ['$$course.difficulty', 'medium'] }, then: 2 },
                                            { case: { $eq: ['$$course.difficulty', 'hard'] }, then: 3 }
                                        ],
                                        default: 2
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    title: '$name',
                    description: { $ifNull: ["$description", { $concat: ["A collection of ", { $toString: "$courseCount" }, " courses from ", "$name", "."] }] },
                    courseCount: 1,
                    enrolledCount: 1,
                    totalMinutes: 1,
                    avgDifficulty: 1
                }
            }
        ]);

        // 4. FINAL FORMATTING: Convert raw data to client-friendly format
        const formattedResults: RecommendedInstitution[] = aggregatedResults.map(inst => {
            // Convert totalMinutes to a string like "25 hours"
            const hours = Math.round((inst.totalMinutes || 0) / 60);
            const estimatedTime = `${hours} hours`;

            // Convert numeric avgDifficulty to a string like "medium"
            let difficulty: 'easy' | 'medium' | 'hard' = 'medium'; // Default value
            if (inst.avgDifficulty !== null) {
                if (inst.avgDifficulty < 1.7) difficulty = 'easy';
                else if (inst.avgDifficulty > 2.3) difficulty = 'hard';
            }
            
            // Assign a gradient based on ID
            const gradient = inst.id.toString() === MINISTRY_OF_EDUCATION_ID 
                ? 'from-butter to-yellow-500' 
                : 'from-sage to-green-600';

            return {
                id: inst.id,
                title: inst.title,
                description: inst.description,
                courseCount: inst.courseCount,
                enrolledCount: inst.enrolledCount,
                estimatedTime, // Use the formatted value
                difficulty,    // Use the formatted value
                gradient
            };
        });

        return NextResponse.json(formattedResults);

    } catch (error: any) {
        console.error('API Institution Recommendation Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
