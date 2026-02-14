"use client";

import Link from "next/link";
import type { ChatSession } from "@/lib/types/chat.types";

interface ChatSessionListProps {
    sessions: ChatSession[];
}

export function ChatSessionList({ sessions }: ChatSessionListProps) {
    return (
        <div className="space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 mb-2">CHATS</div>
            {sessions.map((session) => (
                <Link
                    key={session.id}
                    href={`/chat/${session.id}`}
                    className="block text-sm p-2 rounded hover:bg-gray-100 transition-colors"
                >
                    {session.title || "Untitled Chat"}
                </Link>
            ))}
            {sessions.length === 0 && (
                <div className="text-xs text-gray-400 p-2">No chats yet</div>
            )}
        </div>
    );
}
