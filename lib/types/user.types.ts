import { User } from "@supabase/supabase-js";

export type { User };

export interface UserProfile {
    id: string;
    email: string | null;
    created_at?: string;
}
