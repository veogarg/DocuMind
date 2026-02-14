import { createClient } from "@/lib/supabase/client";
import type { ChatSession, ChatMessage, ChatMessageInput } from "@/lib/types/chat.types";
import { DATABASE_TABLES, APP_CONFIG } from "@/lib/constants/config";

export class ChatService {
    private supabase = createClient();

    async getChatSessions(userId?: string): Promise<ChatSession[]> {
        let query = this.supabase
            .from(DATABASE_TABLES.CHAT_SESSIONS)
            .select("*")
            .order("created_at", { ascending: false });

        if (userId) {
            query = query.eq("user_id", userId);
        }

        const { data } = await query;
        return data || [];
    }

    async getChatSession(sessionId: string): Promise<ChatSession | null> {
        const { data } = await this.supabase
            .from(DATABASE_TABLES.CHAT_SESSIONS)
            .select("*")
            .eq("id", sessionId)
            .single();

        return data;
    }

    async createChatSession(userId: string, title?: string): Promise<ChatSession> {
        const { data } = await this.supabase
            .from(DATABASE_TABLES.CHAT_SESSIONS)
            .insert({
                user_id: userId,
                title: title || APP_CONFIG.DEFAULT_CHAT_TITLE,
            })
            .select()
            .single();

        return data;
    }

    async updateChatTitle(sessionId: string, title: string): Promise<void> {
        await this.supabase
            .from(DATABASE_TABLES.CHAT_SESSIONS)
            .update({ title })
            .eq("id", sessionId);
    }

    async getMessages(sessionId: string): Promise<ChatMessage[]> {
        const { data } = await this.supabase
            .from(DATABASE_TABLES.MESSAGES)
            .select("*")
            .eq("session_id", sessionId)
            .order("created_at");

        return data || [];
    }

    async saveMessage(message: ChatMessageInput): Promise<ChatMessage> {
        const { data } = await this.supabase
            .from(DATABASE_TABLES.MESSAGES)
            .insert(message)
            .select()
            .single();

        return data;
    }

    async getLatestChatSession(userId: string): Promise<ChatSession | null> {
        const { data } = await this.supabase
            .from(DATABASE_TABLES.CHAT_SESSIONS)
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1);

        return data?.[0] || null;
    }
}

// Singleton instance
export const chatService = new ChatService();
