"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import type { User } from "@/lib/types/user.types";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            setLoading(true);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Failed to load user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        reload: loadUser,
    };
}
