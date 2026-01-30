'use client';

import { useState, useEffect } from 'react';
import { PlannerService } from '@/services/planner.service';
import { IDailyPlan } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Dumbbell, Utensils, Flame, Target, Calendar, ChevronRight } from 'lucide-react';

export default function DailyPlanView() {
    const [plan, setPlan] = useState<IDailyPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPlan();
    }, []);

    const fetchPlan = async () => {
        try {
            setLoading(true);
            const data = await PlannerService.getDailyPlan(new Date());
            setPlan(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load plan');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setGenerating(true);
            const newPlan = await PlannerService.generateDailyPlan(new Date());
            setPlan(newPlan);
        } catch (err) {
            console.error(err);
            setError('Failed to generate plan');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    if (!plan) {
        return (
            <Card className="text-center p-12 border-gray-700 shadow-xl bg-gradient-to-b from-gray-800 to-gray-900">
                <CardContent className="space-y-6">
                    <div className="mx-auto bg-blue-900/50 w-20 h-20 rounded-full flex items-center justify-center">
                        <Target className="h-10 w-10 text-blue-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Start Your Day Right</h2>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            Generate a personalized diet and workout plan tailored to your goals.
                        </p>
                    </div>
                    <Button onClick={handleGenerate} disabled={generating} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/50">
                        {generating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Building Plan...
                            </>
                        ) : (
                            'Generate Today\'s Plan'
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">

            {/* Date Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(plan.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Today's Focus</h2>
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Target Summary */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg transition-all hover:shadow-xl">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-2 text-indigo-100 font-medium mb-4">
                            <Target className="h-5 w-5" /> Daily Calorie Goal
                        </div>
                        <div>
                            <div className="text-4xl font-extrabold tracking-tight text-white">{plan.calorieTarget}</div>
                            <p className="text-indigo-100 text-sm mt-1">Calories Recommended</p>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 translate-x-10" />
                </div>

                {/* Workout Summary */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-6 text-white shadow-lg transition-all hover:shadow-xl">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-2 text-blue-100 font-medium mb-4">
                            <Dumbbell className="h-5 w-5" /> Recommended Workout
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold line-clamp-1 text-white" title={plan.workout.type}>{plan.workout.type}</h3>
                            <p className="text-blue-100 text-sm mt-1 line-clamp-1">{plan.workout.description}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">{plan.workout.durationMinutes} min</span>
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full capitalize">{plan.workout.intensity} Intensity</span>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 translate-x-10" />
                </div>
            </div>

            {/* Meals List */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-gray-400" /> Meal Plan
                </h3>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {plan.meals.map((meal, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-sm transition-all hover:shadow-md hover:border-gray-600">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${meal.type === 'breakfast' ? 'bg-orange-400' :
                                    meal.type === 'lunch' ? 'bg-green-400' :
                                        meal.type === 'dinner' ? 'bg-blue-400' : 'bg-purple-400'
                                }`} />
                            <div className="p-5 pl-7">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold uppercase tracking-wider py-0.5 px-2 rounded-full ${meal.type === 'breakfast' ? 'bg-orange-900/50 text-orange-300' :
                                            meal.type === 'lunch' ? 'bg-green-900/50 text-green-300' :
                                                meal.type === 'dinner' ? 'bg-blue-900/50 text-blue-300' : 'bg-purple-900/50 text-purple-300'
                                        }`}>
                                        {meal.type}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                                        <Flame className="h-3.5 w-3.5 text-orange-400" />
                                        {meal.calories}
                                    </div>
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-3">{meal.name}</h4>

                                {/* Macros Visual */}
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 bg-gray-900/50 rounded-lg p-2">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-200">{meal.protein}g</div>
                                        <div className="text-[10px] uppercase">Prot</div>
                                    </div>
                                    <div className="text-center border-l border-gray-700">
                                        <div className="font-bold text-gray-200">{meal.carbs}g</div>
                                        <div className="text-[10px] uppercase">Carb</div>
                                    </div>
                                    <div className="text-center border-l border-gray-700">
                                        <div className="font-bold text-gray-200">{meal.fats}g</div>
                                        <div className="text-[10px] uppercase">Fat</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
