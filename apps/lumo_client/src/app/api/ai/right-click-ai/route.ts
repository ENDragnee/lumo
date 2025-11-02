import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerateContentStreamResult,
    Content // Import Content type
} from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth'; // Import Session type
import { authOptions } from '@/lib/auth'; // Ensure path is correct

// --- Type definition for Session User (adjust based on your actual session structure) ---
interface SessionUser {
    id?: string;
    _id?: string; // Include _id if it might be present
    // Add other user properties if needed
}

// --- Type for the POST request body ---
interface ExplainRequestBody {
    selectedText?: string;
}

// --- Check and Initialize Google AI Client ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Consider using gemini-1.5-flash for potentially faster responses for simple explanations
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    // Optional Safety Settings can be added here if needed
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500, // Mapped from max_tokens
        topP: 1,             // Mapped from top_p
    },
});

// --- Define System Instruction ---
// Note: The user prompt below already contains specific instructions.
// The system prompt provides the general persona.
const SYSTEM_INSTRUCTION = `You are a helpful AI assistant designed to explain concepts clearly and concisely.`;

// --- POST Function (Typed) ---
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const session: Session | null = await getServerSession(authOptions);
        const sessionUser = session?.user as SessionUser | undefined;

        // Although userId isn't used directly in the AI call here,
        // checking auth is still crucial.
        if (!sessionUser?.id && !sessionUser?._id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse the request body
        const body: ExplainRequestBody = await request.json();
        const { selectedText } = body;

        // Log for debugging
        console.log('Received request body for explanation:', body);

        // Validate selectedText
        if (!selectedText || typeof selectedText !== 'string' || selectedText.trim() === '') {
            return NextResponse.json(
                { error: 'Invalid input: selectedText is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        console.log('Selected text for explanation:', selectedText);

        // Set up streaming
        const stream = new TransformStream<Uint8Array, Uint8Array>();
        const writer = stream.writable.getWriter();
        const encoder = new TextEncoder();

        // Moved declaration outside the try block for access in catch
        let firstChunk = true;

        const processStream = async (): Promise<void> => {
            try {
                // Construct the prompt for Gemini
                const promptContent: Content[] = [
                    {
                        role: 'user',
                        parts: [{
                            text: `Please explain the following selected text in a simple and concise manner. Provide examples if necessary to aid understanding:\n\n"${selectedText}"`
                        }]
                    }
                ];

                // Start generation stream
                const result: GenerateContentStreamResult = await model.generateContentStream({
                    contents: promptContent,
                    // Pass system instruction separately
                    systemInstruction: { role: "system", parts: [{ text: SYSTEM_INSTRUCTION }] },
                });

                // Write the opening bracket for the JSON array
                await writer.write(encoder.encode('['));

                // Iterate over the stream
                for await (const chunk of result.stream) {
                    try {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            const data = JSON.stringify({ content: chunkText });
                            // Prepend comma if not the first chunk
                            const chunkData = firstChunk ? data : `,${data}`;
                            await writer.write(encoder.encode(chunkData));
                            firstChunk = false; // Update flag
                        }
                    } catch (chunkError: unknown) {
                        // Handle potential errors within a chunk (e.g., safety blocks)
                         console.error("Error processing stream chunk:", chunkError);
                         const message = chunkError instanceof Error ? chunkError.message : 'Unknown chunk processing error';
                         const errorData = JSON.stringify({ error: `Error processing part of the stream: ${message}` });
                         const errorChunkData = firstChunk ? errorData : `,${errorData}`;
                         try { await writer.write(encoder.encode(errorChunkData)); firstChunk = false; } catch {/* Ignore write error if stream closed */}
                    }
                }

                // Write the closing bracket
                await writer.write(encoder.encode(']'));

            } catch (error: unknown) {
                console.error('Google AI Stream processing error:', error);
                const message = error instanceof Error ? error.message : 'Unknown stream processing error';
                try {
                    // Try to write a final error object to the stream
                    const errorPayload = JSON.stringify({ error: `Stream processing error: ${message}` });
                    await writer.write(encoder.encode(firstChunk ? errorPayload : `,${errorPayload}]`));
                } catch (writeError: unknown) {
                    console.error("Failed to write error to stream:", writeError);
                }
            } finally {
                // Ensure the writer is closed
                try {
                    await writer.close();
                } catch (closeError: unknown) {
                    console.error("Error closing stream writer:", closeError);
                }
            }
        };

        // Start the stream processing without awaiting it here
        processStream().catch(err => {
            console.error("Unhandled error executing explanation processStream:", err);
            // Cannot modify response headers here, client needs to handle stream failures.
        });

        // Return the readable stream immediately
        return new NextResponse(stream.readable, {
            headers: {
                'Content-Type': 'application/json', // Let client know chunks are JSON parsable
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error: unknown) {
        // Handle errors during initial setup (auth, parsing, etc.)
        console.error('Error in POST /api/explain-text:', error);
        const message = error instanceof Error ? error.message : 'Unknown server error';
        // Use a more specific error message if appropriate
        return NextResponse.json(
            { error: `Failed to process explanation request: ${message}` },
            { status: 500 }
        );
    }
}
