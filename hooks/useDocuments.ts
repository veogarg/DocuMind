"use client";

import { useState, useEffect } from "react";
import { documentService } from "@/lib/services/document.service";
import type { UserDocument } from "@/lib/types/document.types";

export function useDocuments(userId?: string) {
    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (userId) {
            loadDocuments();
        }
    }, [userId]);

    const loadDocuments = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await documentService.getDocuments(userId);
            setDocuments(data);
        } catch (err) {
            setError(err as Error);
            console.error("Failed to load documents:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        documents,
        loading,
        error,
        reload: loadDocuments,
    };
}
