import { genAI } from "./gemini.client";
import { APP_CONFIG } from "@/lib/constants/config";

/**
 * Generates embeddings for text content
 * @param content - The text content to embed
 * @returns Array of embedding values
 */
export async function generateEmbedding(content: string): Promise<number[]> {
    const embedModel = genAI.getGenerativeModel({
        model: APP_CONFIG.GEMINI_EMBEDDING_MODEL,
    });

    const result = await embedModel.embedContent(content);
    return result.embedding.values;
}

/**
 * Generates embeddings for multiple text chunks
 * @param chunks - Array of text chunks
 * @returns Array of embedding arrays
 */
export async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        embeddings.push(embedding);
    }

    return embeddings;
}
