import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import mongoose from 'mongoose';

/**
 * GET /api/tasks/stats
 * 
 * Fetches statistics about the user's tasks, including total,
 * completed, overdue, and in-progress counts. This is more efficient
 * than fetching all tasks to calculate stats on the client.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // First, ensure task statuses are up-to-date.
    // This marks any non-completed tasks with a past due date as 'overdue'.
    await Task.updateMany(
      { userId: userId, dueDate: { $lt: new Date() }, status: { $in: ['todo', 'in-progress'] } },
      { $set: { status: 'overdue' } }
    );

    // Use an aggregation pipeline for maximum efficiency.
    // This performs all counts in a single database query.
    const statsPipeline = await Task.aggregate([
      // Step 1: Filter tasks to only those of the logged-in user.
      { 
        $match: { userId: userId } 
      },
      // Step 2: Group all matched documents into a single output document.
      {
        $group: {
          _id: null, // Grouping by null gets stats for the entire matched set.
          total: { $sum: 1 }, // Count every document.
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          overdue: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
        }
      }
    ]);

    // The aggregation returns an array. If the user has no tasks, it will be empty.
    const result = statsPipeline[0];

    if (!result) {
      // If the user has no tasks, return a default stats object.
      return NextResponse.json({
        total: 0,
        completed: 0,
        overdue: 0,
        inProgress: 0,
        completionRate: 0,
      });
    }

    // Calculate the completion rate.
    const completionRate = result.total > 0 ? (result.completed / result.total) * 100 : 0;

    const response = {
      total: result.total || 0,
      completed: result.completed || 0,
      overdue: result.overdue || 0,
      inProgress: result.inProgress || 0,
      completionRate: Math.round(completionRate),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET /api/tasks/stats Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}