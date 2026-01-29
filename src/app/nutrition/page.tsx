'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { nutritionService } from '@/services';
import { NutritionLog } from '@/types';
import { format } from 'date-fns';
import { Utensils } from 'lucide-react';

export default function NutritionPage() {
    const [logs, setLogs] = useState<NutritionLog[]>([]);
    const [formData, setFormData] = useState({
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        mealType: 'breakfast'
    });

    const fetchLogs = async () => {
        try {
            // Default fetching all or implement date picker later
            const data = await nutritionService.getLogs();
            setLogs(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await nutritionService.logNutrition({
                calories: parseInt(formData.calories),
                protein: formData.protein ? parseInt(formData.protein) : undefined,
                carbs: formData.carbs ? parseInt(formData.carbs) : undefined,
                fats: formData.fats ? parseInt(formData.fats) : undefined,
                mealType: formData.mealType
            });
            setFormData({ calories: '', protein: '', carbs: '', fats: '', mealType: 'breakfast' });
            fetchLogs();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Log Meal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Meal Type</label>
                                <select
                                    value={formData.mealType}
                                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                            </div>
                            <Input
                                label="Calories"
                                type="number"
                                value={formData.calories}
                                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                required
                            />
                            <Input
                                label="Protein (g)"
                                type="number"
                                value={formData.protein}
                                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                            />
                            <Input
                                label="Carbs (g)"
                                type="number"
                                value={formData.carbs}
                                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                            />
                            <Input
                                label="Fats (g)"
                                type="number"
                                value={formData.fats}
                                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700">Log Meal</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Recent Logs</h3>
                <div className="grid gap-2">
                    {logs.map((log) => (
                        <div key={log._id} className="bg-white p-4 rounded-lg border flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Utensils className="text-green-600 w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium capitalize">{log.mealType}</p>
                                    <p className="text-xs text-gray-500">{format(new Date(log.date), 'MMM d, h:mm a')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-bold">{log.calories} kcal</span>
                                <div className="text-xs text-gray-500">
                                    {log.protein ? `P: ${log.protein}g ` : ''}
                                    {log.carbs ? `C: ${log.carbs}g ` : ''}
                                    {log.fats ? `F: ${log.fats}g` : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-center text-gray-500 py-4">No meals tracked yet.</p>}
                </div>
            </div>
        </div>
    );
}
