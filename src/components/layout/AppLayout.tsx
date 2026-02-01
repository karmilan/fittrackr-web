'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, User, Dumbbell, Utensils, Scale, CalendarDays, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import { cn } from '../ui/button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();

    const isAuthPage = pathname === '/login' || pathname === '/register';

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            logout();
            router.push('/login');
        }
    };

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/profile', label: 'Profile', icon: User },
        { href: '/weight', label: 'Weight', icon: Scale },
        { href: '/workouts', label: 'Workouts', icon: Dumbbell },
        { href: '/nutrition', label: 'Nutrition', icon: Utensils },
        { href: '/planner', label: 'Planner', icon: CalendarDays },
    ];

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-950 pb-20 md:pb-0 font-sans">
            <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-400">
                        <Dumbbell className="w-8 h-8" />
                        <span>FitTrackr</span>
                    </Link>

                    {isAuthenticated && user && (
                        <div className="flex items-center gap-4 text-sm">
                            <span className="hidden sm:inline text-gray-400">
                                Hi, <span className="text-white font-medium">{user.name}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 md:hidden z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center w-full h-full space-y-1',
                                    isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
