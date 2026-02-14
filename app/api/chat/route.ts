export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks, generateRAGResponse } from "@/lib/ai/rag";

export async function POST(req: NextRequest) {
    try {
        const { messages, userId } = await req.json();

        if (!messages || !userId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const lastMessage = messages[messages.length - 1].content;

        // Retrieve relevant document chunks using RAG
        const relevantChunks = await retrieveRelevantChunks(lastMessage, userId);
        const docContext = relevantChunks.map((chunk) => chunk.content).join("\n\n");

        // Generate AI response with context
        const reply = await generateRAGResponse(messages, docContext);

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            {
                error: "AI failed to generate response",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
