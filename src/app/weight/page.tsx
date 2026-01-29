'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { weightService } from '@/services';
import { WeightLog } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function WeightPage() {
    const [logs, setLogs] = useState<WeightLog[]>([]);
    const [newWeight, setNewWeight] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const data = await weightService.getHistory();
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleLogWeight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWeight) return;

        try {
            await weightService.logWeight({ weight: parseFloat(newWeight) });
            setNewWeight('');
            fetchLogs();
        } catch (error) {
            console.error(error);
        }
    };

    // Prepare chart data (reverse for chronological order if API returns desc)
    const chartData = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(log => ({
        date: format(new Date(log.date), 'MMM d'),
        weight: log.weight
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Log Weight Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Log Weight</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogWeight} className="flex gap-4 items-end">
                            <Input
                                label="Weight (kg)"
                                type="number"
                                step="0.1"
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                                required
                                className="flex-1"
                            />
                            <Button type="submit">Add</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Chart */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Progress Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">
                                No data yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* History List */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log._id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{format(new Date(log.date), 'PPP')}</p>
                                        {log.note && <p className="text-sm text-gray-500">{log.note}</p>}
                                    </div>
                                    <div className="text-lg font-bold">
                                        {log.weight} kg
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
