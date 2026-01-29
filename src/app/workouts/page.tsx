'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { workoutService } from '@/services';
import { WorkoutLog } from '@/types';
import { format } from 'date-fns';
import { Dumbbell } from 'lucide-react';

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
    const [formData, setFormData] = useState({
        type: '',
        durationMinutes: '',
        caloriesBurned: '',
        notes: ''
    });

    const fetchWorkouts = async () => {
        try {
            const data = await workoutService.getWorkouts();
            setWorkouts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await workoutService.logWorkout({
                type: formData.type,
                durationMinutes: parseInt(formData.durationMinutes),
                caloriesBurned: parseInt(formData.caloriesBurned),
                notes: formData.notes
            });
            setFormData({ type: '', durationMinutes: '', caloriesBurned: '', notes: '' });
            fetchWorkouts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Log Workout</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Type (e.g., Running, Gym)"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            />
                            <Input
                                label="Duration (minutes)"
                                type="number"
                                value={formData.durationMinutes}
                                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                                required
                            />
                            <Input
                                label="Calories Burned"
                                type="number"
                                value={formData.caloriesBurned}
                                onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                                required
                            />
                            <Input
                                label="Notes (Optional)"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full md:w-auto">Log Workout</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {workouts.map((workout) => (
                    <Card key={workout._id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Dumbbell className="text-blue-600 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{workout.type}</h3>
                                    <p className="text-sm text-gray-500">{format(new Date(workout.date), 'PPP')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">{workout.caloriesBurned} kcal</div>
                                <div className="text-sm text-gray-500">{workout.durationMinutes} mins</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {workouts.length === 0 && <p className="text-center text-gray-500 py-8">No workouts logged yet.</p>}
            </div>
        </div>
    );
}
