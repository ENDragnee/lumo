import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      selectedText, 
      org,
      grade, 
      course, 
      chapter, 
      sub_chapter,
    } = body;

    if (!selectedText || selectedText.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid input: selectedText is required' },
        { status: 400 }
      );
    }

    // First, get the content_id
    const [contentRows] = await db.execute(
      'SELECT id FROM Contents WHERE Org = ? AND Grade = ? AND Course = ? AND Chapter = ? AND SubChapter = ? AND Type = ?',
      [org, grade, course, chapter, sub_chapter, "Books"]
    );

    if (!contentRows.length) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const content_id = contentRows[0].id;

    // Generate response_id
    const response_id = uuidv4();

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
              content: `"${selectedText}"`,
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

        // Store the complete response in the database
        await db.execute(
          'INSERT INTO AIResponses (response_id, user_id, question, answer, content_id) VALUES (?, ?, ?, ?, ?)',
          [response_id, session.user.id, selectedText, fullResponse, content_id]
        );

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