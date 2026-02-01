'use client';

import { useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useLayoutEffect(() => {
        const isPublicPath = PUBLIC_PATHS.includes(pathname);

        if (!isAuthenticated && !isPublicPath) {
            router.push('/login');
        } else if (isAuthenticated && isPublicPath) {
            router.push('/');
        }
    }, [isAuthenticated, pathname, router]);

    // Don't show anything while redirecting if not authenticated
    if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
        return null;
    }

    // Don't show public pages if already authenticated (redirecting to home)
    if (isAuthenticated && PUBLIC_PATHS.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
