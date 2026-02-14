"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/types/chat.types";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={`p-4 rounded-lg max-w-3xl ${isUser ? "bg-blue-50 ml-auto" : "bg-gray-100"
                }`}
        >
            <div className="text-xs text-gray-500 mb-1">
                {isUser ? "You" : "AI"}
            </div>
            <div className="whitespace-pre-line text-sm">{message.content}</div>
        </div>
    );
}
