"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Paperclip } from "lucide-react";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onFileUpload: (file: File) => void;
    isThinking?: boolean;
    isUploading?: boolean;
    uploadStatus?: string | null;
}

export function ChatInput({
    onSendMessage,
    onFileUpload,
    isThinking = false,
    isUploading = false,
    uploadStatus,
}: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim() || isThinking) return;
        onSendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
            e.target.value = ""; // Reset input
        }
    };

    return (
        <div className="border-t p-4 bg-white">
            {uploadStatus && (
                <div className="text-xs text-gray-500 mb-2">{uploadStatus}</div>
            )}
            <div className="flex gap-2 items-center">
                <Input
                    type="file"
                    className="text-sm"
                    onChange={handleFileChange}
                    hidden
                    id="file-upload"
                />

                <Button
                    onClick={() => document.getElementById("file-upload")?.click()}
                    disabled={isUploading}
                    size="icon"
                >
                    {isUploading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Paperclip />
                    )}
                </Button>

                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1"
                    onKeyDown={handleKeyDown}
                    disabled={isThinking}
                />

                <Button onClick={handleSend} disabled={isThinking || !input.trim()}>
                    {isThinking ? "Thinking 🧐" : "Send ⏎"}
                </Button>
            </div>
        </div>
    );
}
