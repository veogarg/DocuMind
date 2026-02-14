"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DocumentList } from "./DocumentList";
import { ChatSessionList } from "./ChatSessionList";
import type { ChatSession } from "@/lib/types/chat.types";
import type { UserDocument } from "@/lib/types/document.types";

interface SidebarProps {
    sessions: ChatSession[];
    documents: UserDocument[];
    onNewChat: () => void;
}

export function Sidebar({ sessions, documents, onNewChat }: SidebarProps) {
    return (
        <div className="w-64 border-r p-4 flex flex-col">
            <Link href="/" className="text-xl font-bold mb-4">
                DocuMind
            </Link>

            <Button className="mb-4" onClick={onNewChat}>
                + New Chat
            </Button>

            <DocumentList documents={documents} />
            <ChatSessionList sessions={sessions} />
        </div>
    );
}
