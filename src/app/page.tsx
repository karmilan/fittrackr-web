'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { weightService, nutritionService } from '@/services';
import { WeightStats, DailyNutritionSummary } from '@/types';
import { Activity, Apple, Scale, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { profile, fetchProfile, isLoading: isProfileLoading } = useAppStore();
  const [weightStats, setWeightStats] = useState<WeightStats | null>(null);
  const [nutritionSummary, setNutritionSummary] = useState<DailyNutritionSummary | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoadingStats(true);
      try {
        await fetchProfile();
        const [wStats, nStats] = await Promise.all([
          weightService.getStats().catch(() => null), // Graceful fail if no data
          nutritionService.getSummary().catch(() => null)
        ]);
        setWeightStats(wStats);
        setNutritionSummary(nStats);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoadingStats(false);
      }
    };
    loadData();
  }, [fetchProfile]);

  if (isProfileLoading || loadingStats) {
    return <div className="flex h-[50vh] items-center justify-center">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Welcome to FitTrackr!</h2>
        <p className="text-gray-500">Please set up your profile to get started.</p>
        <Link href="/profile">
          <Button size="lg">Create Profile</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weight Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Scale className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weightStats?.current ? `${weightStats.current} kg` : '--'}</div>
            <p className="text-xs text-gray-500">
              {weightStats?.totalLoss ?
                `${weightStats.totalLoss > 0 ? 'Lost' : 'Gained'} ${Math.abs(weightStats.totalLoss).toFixed(1)} kg total`
                : 'Start tracking today'}
            </p>
            <Link href="/weight" className="mt-4 block">
              <Button variant="outline" size="sm" className="w-full">Log Weight</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Calories Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
            <Apple className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionSummary?.calories || 0} kcal</div>
            <p className="text-xs text-gray-500">
              Goal: TBD {/* Future: Calculate based on profile */}
            </p>
            <Link href="/nutrition" className="mt-4 block">
              <Button variant="outline" size="sm" className="w-full">Log Meal</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/workouts">
          <Card className="bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="font-medium text-blue-900">Log Workout</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/weight">
          <Card className="bg-green-50 border-green-100 hover:bg-green-100 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
              <Scale className="h-8 w-8 text-green-600" />
              <span className="font-medium text-green-900">Log Weight</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
