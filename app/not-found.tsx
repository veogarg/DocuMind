'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Custom404() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the homepage after a short delay
        const timer = setTimeout(() => {
            router.push('/');
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
            <h1>404 - Page Not Found</h1>
            <p>You will be redirected to the homepage shortly...</p>
        </div>
    );
}
