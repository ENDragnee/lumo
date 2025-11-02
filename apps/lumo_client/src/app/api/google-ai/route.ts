import {
    GoogleGenerativeAI,
    GenerateContentStreamResult,
    Content // Import Content type
} from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth'; // Import Session type
import { authOptions } from '@/lib/auth'; // Ensure path is correct
import mongoose, { Types } from 'mongoose'; // Import Types
// Ensure this path is correct and points to the updated model file
import { AIChat, AIDocument } from '@/models/AIChat';
import connectDB from '@/lib/mongodb'; // Ensure path is correct

// --- Type definition for Session User (adjust based on your actual session structure) ---
interface SessionUser {
    id?: string;
    _id?: string; // Include _id if it might be present
    // Add other user properties if needed (e.g., name, email)
}

// --- Check and Initialize Google AI Client ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    // Optional Safety Settings
    // safetySettings: [
    //   { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    //   // ... other categories
    // ],
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 1,
    },
});

const SYSTEM_INSTRUCTION = `You are a helpful AI assistant. Analyze and respond to the following selected text.
Provide insights, explanations, or answer any implicit questions in the text.
If the text is a question, answer it directly. If it's a statement, provide relevant analysis or additional context.`;

// --- Type for the POST request body ---
interface PostRequestBody {
    text?: string;
    content_id?: string;
}

// --- POST Function (Typed) ---
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const session: Session | null = await getServerSession(authOptions);
        const sessionUser = session?.user as SessionUser | undefined;
        const userId = sessionUser?.id ?? sessionUser?._id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body: PostRequestBody = await request.json();
        const { text, content_id } = body;

        if (!content_id || typeof content_id !== 'string' || !Types.ObjectId.isValid(content_id)) {
            return NextResponse.json(
                { error: 'Invalid or missing content ID' },
                { status: 400 }
            );
        }

        if (!text || typeof text !== 'string' || text.trim() === '') {
            return NextResponse.json(
                { error: 'Invalid or missing input text' },
                { status: 400 }
            );
        }

        const stream = new TransformStream<Uint8Array, Uint8Array>();
        const writer = stream.writable.getWriter();
        const encoder = new TextEncoder();

        // Moved declaration outside the try block
        let firstChunk = true;

        const processStream = async (): Promise<void> => {
            let fullResponse: string = ''; // Keep fullResponse scoped here if only needed for saving

            try {
                const promptContent: Content[] = [
                    { role: "user", parts: [{ text: `"${text}"` }] }
                ];

                const result: GenerateContentStreamResult = await model.generateContentStream({
                    contents: promptContent,
                });

                await writer.write(encoder.encode('['));
                // firstChunk is already declared outside

                for await (const chunk of result.stream) {
                    try {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            fullResponse += chunkText;
                            const data = JSON.stringify({ content: chunkText });
                            const chunkData = firstChunk ? data : `,${data}`;
                            await writer.write(encoder.encode(chunkData));
                            firstChunk = false; // Set firstChunk to false here
                        }
                    } catch (chunkError: unknown) {
                        console.error("Error processing stream chunk:", chunkError);
                        const message = chunkError instanceof Error ? chunkError.message : 'Unknown chunk processing error';
                        const errorData = JSON.stringify({ error: `Error processing part of the stream: ${message}` });
                        // Use the already declared firstChunk
                        const errorChunkData = firstChunk ? errorData : `,${errorData}`;
                        try {
                           await writer.write(encoder.encode(errorChunkData));
                           firstChunk = false; // Also set to false after writing error chunk
                        } catch {/* Ignore write error if stream closed */}
                    }
                }

                // --- Save the full conversation to DB ---
                const userObjectId = new Types.ObjectId(userId);
                const contentObjectId = new Types.ObjectId(content_id);

                await AIChat.create({
                    user_id: userObjectId,
                    content_id: contentObjectId,
                    question: text,
                    answer: fullResponse, // Use the accumulated fullResponse
                });

                await writer.write(encoder.encode(']')); // End JSON array

            } catch (error: unknown) {
                console.error('Google AI Stream processing error:', error);
                const message = error instanceof Error ? error.message : 'Unknown stream processing error';
                try {
                    const errorPayload = JSON.stringify({ error: `Stream processing error: ${message}` });
                    // Use the correctly scoped firstChunk here
                    // If an error happens before '[' is sent, firstChunk is true. Send only the error object.
                    // If '[' was sent, firstChunk is false. Append error to array and close it.
                    await writer.write(encoder.encode(firstChunk ? errorPayload : `,${errorPayload}]`));
                    // No need to set firstChunk = false here, as the stream is likely ending due to error.
                } catch (writeError: unknown) {
                    console.error("Failed to write error to stream:", writeError);
                }
            } finally {
                try {
                    await writer.close();
                } catch (closeError: unknown) {
                    console.error("Error closing stream writer:", closeError);
                }
            }
        };

        processStream().catch(err => {
            console.error("Unhandled error executing processStream:", err);
        });

        return new NextResponse(stream.readable, {
            headers: {
                'Content-Type': 'application/json',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error: unknown) {
        console.error('Error processing POST request:', error);
        const message = error instanceof Error ? error.message : 'Unknown server error';
        return NextResponse.json(
            { error: `Failed to process request: ${message}` },
            { status: 500 }
        );
    }
}

// --- Type for Formatted Gemini Chat History Entry ---
interface GeminiMessage {
    role: "user" | "model"; // Gemini uses 'model' for AI responses
    parts: { text: string }[];
}

// --- GET Function (Typed) ---
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const session: Session | null = await getServerSession(authOptions);
        const sessionUser = session?.user as SessionUser | undefined;
        const userId = sessionUser?.id ?? sessionUser?._id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const content_id: string | null = searchParams.get('id');

        if (!content_id || typeof content_id !== 'string' || !Types.ObjectId.isValid(content_id)) {
            return NextResponse.json(
                { error: 'Invalid or missing content ID' },
                { status: 400 }
            );
        }

        // Use the corrected AIDocument interface here
        const chatHistory: AIDocument[] = await AIChat.find({
            user_id: new Types.ObjectId(userId),
            content_id: new Types.ObjectId(content_id)
        })
            .sort({ createdAt: 1 })
             // Select fields to exclude. If using timestamps: true, updatedAt will exist.
            .select('-__v -updatedAt') // Adjust selection based on schema (keep createdAt?)
            .lean<AIDocument[]>();

        // Option 2: Return formatted messages for Gemini context
        if (chatHistory.length === 0) {
            return NextResponse.json({ messages: [] }, { status: 200 });
            // return NextResponse.json({ error: 'No chat history found' }, { status: 404 });
        }

        // This should now work correctly because AIDocument uses string
        const messages: GeminiMessage[] = chatHistory.flatMap(entry => [
            { role: 'user', parts: [{ text: entry.question }] },
            { role: 'model', parts: [{ text: entry.answer }] }
        ]);

        return NextResponse.json({ messages }, { status: 200 });

    } catch (error: unknown) {
        console.error('Error fetching chat history:', error);
        const message = error instanceof Error ? error.message : 'Unknown server error';
        return NextResponse.json(
            { error: `Failed to fetch chat history: ${message}` },
            { status: 500 }
        );
    }
}