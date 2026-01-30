'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeightStats, DailyNutritionSummary, IDailyPlan } from '@/types';
import { Activity, Apple, Scale, Plus, CalendarDays, Dumbbell, Target } from 'lucide-react';
import { weightService, nutritionService, PlannerService } from '@/services';
import Link from 'next/link';

export default function Dashboard() {
  const { profile, fetchProfile, isLoading: isProfileLoading } = useAppStore();
  const [weightStats, setWeightStats] = useState<WeightStats | null>(null);
  const [nutritionSummary, setNutritionSummary] = useState<DailyNutritionSummary | null>(null);
  const [dailyPlan, setDailyPlan] = useState<IDailyPlan | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoadingStats(true);
      try {
        await fetchProfile();
        const [wStats, nStats, plan] = await Promise.all([
          weightService.getStats().catch(() => null), // Graceful fail if no data
          nutritionService.getSummary().catch(() => null),
          PlannerService.getDailyPlan(new Date()).catch(() => null)
        ]);
        setWeightStats(wStats);
        setNutritionSummary(nStats);
        setDailyPlan(plan);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoadingStats(false);
      }
    };
    loadData();
  }, [fetchProfile]);

  if (isProfileLoading || loadingStats) {
    return <div className="flex h-[50vh] items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Welcome to FitTrackr!</h2>
        <p className="text-gray-400">Please set up your profile to get started.</p>
        <Link href="/profile">
          <Button size="lg">Create Profile</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Planner Snapshot */}
        <Card className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                  <CalendarDays className="h-5 w-5" /> Today's Plan
                </CardTitle>
                <p className="text-blue-50 text-sm">Your daily roadmap to success</p>
              </div>
              <Link href="/planner">
                <Button size="sm" variant="secondary" className="hover:bg-white/90">
                  View Full Plan
                </Button>
              </Link>
            </div>

            {dailyPlan ? (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center gap-2 text-blue-50 text-xs mb-1 font-medium">
                    <Target className="h-3 w-3" /> Target
                  </div>
                  <div className="text-xl font-bold text-white">{dailyPlan.calorieTarget} kcal</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center gap-2 text-blue-50 text-xs mb-1 font-medium">
                    <Dumbbell className="h-3 w-3" /> Workout
                  </div>
                  <div className="text-xl font-bold truncate text-white">{dailyPlan.workout.type}</div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <p className="font-medium text-white">No plan generated for today yet.</p>
                <Link href="/planner" className="text-xs underline mt-1 block text-blue-100 hover:text-blue-200">Generate Now</Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Current Weight</CardTitle>
            <Scale className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{weightStats?.current ? `${weightStats.current} kg` : '--'}</div>
            <p className="text-xs text-gray-400">
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
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Calories Today</CardTitle>
            <Apple className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{nutritionSummary?.calories || 0} kcal</div>
            <p className="text-xs text-gray-400">
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
          <Card className="bg-blue-950 border-blue-800 hover:bg-blue-900 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
              <Activity className="h-8 w-8 text-blue-400" />
              <span className="font-medium text-blue-200">Log Workout</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/weight">
          <Card className="bg-green-950 border-green-800 hover:bg-green-900 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
              <Scale className="h-8 w-8 text-green-400" />
              <span className="font-medium text-green-200">Log Weight</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
