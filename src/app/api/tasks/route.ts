// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { NextRequest } from 'next/server';

// GET /api/tasks - Fetch all tasks for the logged-in user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const filter: any = { userId: session.user.id };

    // Build filter query from search params
    if (searchParams.get('search')) {
      const searchRegex = new RegExp(searchParams.get('search')!, 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }
    if (searchParams.get('course')) filter.course = searchParams.get('course');
    if (searchParams.get('priority')) filter.priority = searchParams.get('priority');
    if (searchParams.get('status')) filter.status = searchParams.get('status');
    
    // Check for overdue tasks automatically
    // This is a server-side check to ensure statuses are up-to-date
    await Task.updateMany(
      { userId: session.user.id, dueDate: { $lt: new Date() }, status: { $in: ['todo', 'in-progress'] } },
      { $set: { status: 'overdue' } }
    );
    
    const tasks = await Task.find(filter).sort({ dueDate: 'asc' }).lean();

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('GET /api/tasks Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const newTask = new Task({
      ...body,
      userId: session.user.id, // Ensure the task is linked to the logged-in user
    });

    const savedTask = await newTask.save();
    return NextResponse.json(savedTask, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/tasks Error:', error);
    // Provide more specific error for validation issues
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}