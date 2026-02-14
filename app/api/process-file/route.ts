export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { chunkText } from "@/lib/utils/chunk";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { DATABASE_TABLES, STORAGE_BUCKETS } from "@/lib/constants/config";
import path from "path";
import { PDFParse } from "pdf-parse";

// Set worker source for pdf-parse
PDFParse.setWorker(
    path.resolve("./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")
);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { filePath, fileName, userId } = await req.json();

        if (!filePath || !fileName || !userId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("Downloading file:", filePath);

        // Download file from storage
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKETS.USER_FILES)
            .download(filePath);

        if (error || !data) {
            console.error("Download error:", error);
            return NextResponse.json(
                {
                    error: error?.message || "Failed to download file",
                    details: error,
                },
                { status: 500 }
            );
        }

        // Convert to buffer and extract text
        const buffer = Buffer.from(await data.arrayBuffer());

        // @ts-ignore - pdf-parse is a CommonJS module
        const parser = new PDFParse({ data: buffer });
        const docData = await parser.getText();
        const text = docData.text;

        // Chunk the text
        const chunks = chunkText(text);

        // Generate and store embeddings for each chunk
        for (const chunk of chunks) {
            const embedding = await generateEmbedding(chunk);

            await supabase.from(DATABASE_TABLES.DOCUMENT_CHUNKS).insert({
                user_id: userId,
                file_name: fileName,
                content: chunk,
                embedding,
            });
        }

        return NextResponse.json({
            success: true,
            chunksProcessed: chunks.length
        });
    } catch (error) {
        console.error("Processing error:", error);
        return NextResponse.json(
            {
                error: "Processing failed",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
