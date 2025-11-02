import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import { AIChat } from '@/models/AIChat';
import connectDB from '@/lib/mongodb';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { text, content_id} = await request.json();
    
    // Validate content_id
    if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
      return NextResponse.json(
        { error: 'Invalid content ID' }, 
        { status: 400 }
      );
    }

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid input: A text is required' },
        { status: 400 }
      );
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const processStream = async () => {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI assistant. Analyze and respond to the following selected text. 
              Provide insights, explanations, or answer any implicit questions in the text. 
              If the text is a question, answer it directly. If it's a statement, provide relevant analysis or additional context.`,
            },
            {
              role: 'user',
              content: `"${text}"`,
            },
          ],
          model: 'llama3-8b-8192',
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          stream: true,
          stop: null,
        });

        const encoder = new TextEncoder();
        await writer.write(encoder.encode('['));

        let fullResponse = '';
        let firstChunk = true;

        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            const data = JSON.stringify({ content });
            const chunkData = firstChunk ? data : `,${data}`;
            await writer.write(encoder.encode(chunkData));
            firstChunk = false;
          }
        }

        await AIChat.create({
          user_id: session.user.id,
          content_id: content_id,
          question: text,
          answer: fullResponse,
        });

        await writer.write(encoder.encode(']'));
      } catch (error) {
        console.error('Stream processing error:', error);
        await writer.write(
          new TextEncoder().encode(
            JSON.stringify({ error: 'Stream processing error' })
          )
        );
      } finally {
        await writer.close();
      }
    };

    processStream();

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const content_id = searchParams.get('id');

    if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
      return NextResponse.json(
        { error: 'Invalid content ID' }, 
        { status: 400 }
      );
    }

    const charHistory  = await AIChat.find({
      user_id: session.user.id,
      content_id
    })
    .select('-__v -createdAt')
    .lean();

    if (!charHistory || charHistory.length === 0) {
      return NextResponse.json(
        { error: 'No chat history found' }, 
        { status: 404 }
      );
    }

    // Format the chat history as messages
    const messages = charHistory.flatMap(entry => [
      { role: 'user', content: entry.question },
      { role: 'ai', content: entry.answer }
    ]);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}