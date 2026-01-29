'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Dumbbell, Utensils, Scale } from 'lucide-react';
import { cn } from '../ui/button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/profile', label: 'Profile', icon: User },
        { href: '/weight', label: 'Weight', icon: Scale },
        { href: '/workouts', label: 'Workouts', icon: Dumbbell },
        { href: '/nutrition', label: 'Nutrition', icon: Utensils },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                        <Dumbbell className="w-8 h-8" />
                        <span>FitTrackr</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 pb-safe">
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
                                    isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Navigation (sidebar or top nav would go here, omitting for simplicity in PWA mobile-first focus but ensuring layout is clean) */}
        </div>
    );
}
