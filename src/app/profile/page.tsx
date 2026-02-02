'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { profile, fetchProfile, updateProfile, isLoading, error } = useAppStore();
    const router = useRouter();

    const [formData, setFormData] = useState<any>({
        height: '',
        startingWeight: '',
        targetWeight: '',
        weeklyGoal: -0.5,
        activityLevel: 'moderately_active'
    });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle number inputs
        if (type === 'number') {
            // Allow empty string for better DX (so user can delete field)
            if (value === '') {
                setFormData((prev: any) => ({ ...prev, [name]: '' }));
                return;
            }

            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setFormData((prev: any) => ({ ...prev, [name]: numValue }));
            }
            return;
        }

        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert empty strings to numbers (or validate)
        const submissionData = {
            ...formData,
            height: Number(formData.height) || 0,
            startingWeight: Number(formData.startingWeight) || 0,
            targetWeight: Number(formData.targetWeight) || 0,
            weeklyGoal: Number(formData.weeklyGoal) || 0,
        };

        await updateProfile(submissionData);
        if (!error) {
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Height (cm)"
                                name="height"
                                type="number"
                                value={formData.height ?? ''}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Starting Weight (kg)"
                                name="startingWeight"
                                type="number"
                                step="0.1"
                                value={formData.startingWeight ?? ''}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Target Weight (kg)"
                                name="targetWeight"
                                type="number"
                                step="0.1"
                                value={formData.targetWeight ?? ''}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Weekly Goal (kg/week)"
                                name="weeklyGoal"
                                type="number"
                                step="0.1"
                                value={formData.weeklyGoal ?? ''}
                                onChange={handleChange}
                                required
                                placeholder="-0.5 for loss"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-200">Activity Level</label>
                            <select
                                name="activityLevel"
                                value={formData.activityLevel}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="sedentary">Sedentary</option>
                                <option value="lightly_active">Lightly Active</option>
                                <option value="moderately_active">Moderately Active</option>
                                <option value="very_active">Very Active</option>
                                <option value="extra_active">Extra Active</option>
                            </select>
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            {profile ? 'Update Profile' : 'Create Profile'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
