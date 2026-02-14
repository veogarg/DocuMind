"use client";

import type { UserDocument } from "@/lib/types/document.types";

interface DocumentListProps {
    documents: UserDocument[];
}

export function DocumentList({ documents }: DocumentListProps) {
    return (
        <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 mb-2">DOCUMENTS</div>
            <div className="space-y-1">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="text-sm p-2 rounded bg-gray-50 truncate"
                        title={doc.file_name}
                    >
                        📄 {doc.file_name}
                    </div>
                ))}
                {documents.length === 0 && (
                    <div className="text-xs text-gray-400 p-2">No documents yet</div>
                )}
            </div>
        </div>
    );
}
