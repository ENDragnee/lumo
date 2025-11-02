// models/Task.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the Task interface for TypeScript
export interface ITask extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Reference to the user who owns the task
  title: string;
  description?: string;
  course?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // A number from 0 to 100
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const taskSchema = new Schema<ITask>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates a reference to your User model
    required: true,
    index: true, // Indexing this field is good for performance when querying tasks by user
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  course: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'overdue'],
    default: 'todo',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

// Create and export the Task model
// This prevents Mongoose from redefining the model on every hot-reload
const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);

export default Task;