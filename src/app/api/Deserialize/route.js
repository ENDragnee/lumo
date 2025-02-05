import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const SerializedDataSchema = new mongoose.Schema({
  data: String,
  createdAt: { type: Date, default: Date.now }
});

let SerializedData;
try {
  SerializedData = mongoose.model('Content');
} catch (error) {
  SerializedData = mongoose.model('Content', SerializedDataSchema);
}

export async function GET() {
  try {
    await connectDB();

    const latestData = await SerializedData.findOne()
      .sort({ createdAt: -1 })
      .select('data -_id')
      .exec();

    if (!latestData) {
      return new Response(JSON.stringify({ error: 'No content found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the data properly wrapped in an object
    return new Response(JSON.stringify({ data: latestData.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}