"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Spinner } from "@/components/ui/spinner";

export default function AuthPage() {
    const router = useRouter();
    const { user, loading, signIn, signUp } = useAuth();

    useEffect(() => {
        if (user && !loading) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <AuthForm onSignIn={signIn} onSignUp={signUp} loading={loading} />
        </div>
    );
}
