import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/types/user.types";

export class AuthService {
    private supabase = createClient();

    async getCurrentUser(): Promise<User | null> {
        const { data } = await this.supabase.auth.getUser();
        return data.user;
    }

    async signIn(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    async signUp(email: string, password: string) {
        return await this.supabase.auth.signUp({
            email,
            password,
        });
    }

    async signOut() {
        return await this.supabase.auth.signOut();
    }

    async checkSession(): Promise<boolean> {
        const user = await this.getCurrentUser();
        return !!user;
    }
}

// Singleton instance
export const authService = new AuthService();
