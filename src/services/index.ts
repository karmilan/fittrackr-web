import api from '../lib/api';
import { UserProfile, WeightLog, WorkoutLog, NutritionLog, DailyNutritionSummary, WeightStats } from '../types';

export const profileService = {
    getProfile: () => api.get<UserProfile>('/profile'),
    updateProfile: (data: Partial<UserProfile>) => api.put<UserProfile>('/profile', data),
};

export const weightService = {
    getHistory: () => api.get<WeightLog[]>('/weight'),
    logWeight: (data: { weight: number; note?: string; date?: string }) => api.post<WeightLog>('/weight', data),
    getStats: () => api.get<WeightStats>('/weight/stats'),
};

export const workoutService = {
    getWorkouts: () => api.get<WorkoutLog[]>('/workouts'),
    logWorkout: (data: Partial<WorkoutLog>) => api.post<WorkoutLog>('/workouts', data),
};

export const nutritionService = {
    getLogs: (date?: string) => api.get<NutritionLog[]>(`/nutrition${date ? `?date=${date}` : ''}`),
    logNutrition: (data: Partial<NutritionLog>) => api.post<NutritionLog>('/nutrition', data),
    getSummary: () => api.get<DailyNutritionSummary>('/nutrition/summary'),
};
