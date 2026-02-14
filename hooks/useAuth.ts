"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import type { User } from "@/lib/types/user.types";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { error } = await authService.signIn(email, password);
            if (error) throw error;

            await loadUser();
            router.push("/");
        } catch (error: any) {
            throw new Error(error.message || "Sign in failed");
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { error } = await authService.signUp(email, password);
            if (error) throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await authService.signOut();
            setUser(null);
            router.push("/auth");
        } catch (error) {
            console.error("Sign out failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
    };
}
