import { APP_CONFIG } from "@/lib/constants/config";

/**
 * Splits text into chunks of specified size for embedding
 * @param text - The text to chunk
 * @param size - The size of each chunk (default: 800)
 * @returns Array of text chunks
 */
export function chunkText(text: string, size = APP_CONFIG.CHUNK_SIZE): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        chunks.push(text.slice(start, start + size));
        start += size;
    }

    return chunks;
}
