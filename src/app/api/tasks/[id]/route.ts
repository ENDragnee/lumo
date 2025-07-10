// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { NextRequest } from 'next/server';

// PUT /api/tasks/[id] - Update a specific task
export async function PUT(req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = params;
  
  try {
    await connectDB();
    const body = await req.json();

    // Find the task and ensure it belongs to the logged-in user before updating
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      body,
      { new: true, runValidators: true } // 'new: true' returns the updated doc, 'runValidators' ensures schema rules are checked
    ).lean();

    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found or you do not have permission to edit it' }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/tasks/${id} Error:`, error);
     if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a specific task
export async function DELETE(req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = params;

  try {
    await connectDB();

    // Find the task and ensure it belongs to the logged-in user before deleting
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found or you do not have permission to delete it' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/tasks/${id} Error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
