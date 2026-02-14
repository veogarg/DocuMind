import type { ChatMessage } from "@/lib/types/chat.types";

export interface AIServiceConfig {
    messages: ChatMessage[];
    userId: string;
}

export interface AIResponse {
    reply: string;
}

export class AIService {
    async generateResponse(config: AIServiceConfig): Promise<string> {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: config.messages,
                userId: config.userId,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate AI response");
        }

        const data: AIResponse = await response.json();
        return data.reply;
    }

    async processDocument(filePath: string, fileName: string, userId: string): Promise<void> {
        const response = await fetch("/api/process-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                filePath,
                fileName,
                userId,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to process document");
        }
    }
}

// Singleton instance
export const aiService = new AIService();
