"use client";

import { Button } from "@/components/ui/button";

interface HeaderProps {
    email: string | null;
    onLogout: () => void;
}

export function Header({ email, onLogout }: HeaderProps) {
    return (
        <div className="border-b p-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">{email}</div>
            <Button variant="destructive" onClick={onLogout}>
                Logout
            </Button>
        </div>
    );
}
