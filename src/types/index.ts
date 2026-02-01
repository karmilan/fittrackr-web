export interface UserProfile {
    userId: string;
    height: number;
    startingWeight: number;
    targetWeight: number;
    weeklyGoal: number;
    activityLevel: string;
}

export interface WeightLog {
    _id: string;
    userId: string;
    date: string;
    weight: number;
    note?: string;
}

export interface WorkoutLog {
    _id: string;
    userId: string;
    date: string;
    type: string;
    durationMinutes: number;
    caloriesBurned: number;
    notes?: string;
}

export interface NutritionLog {
    _id: string;
    userId: string;
    date: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    mealType: string;
}

export interface DailyNutritionSummary {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface WeightStats {
    current: number;
    start: number;
    totalLoss: number;
    logs: WeightLog[];
}

export interface IMeal {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface IWorkout {
    type: string;
    durationMinutes: number;
    intensity: 'low' | 'medium' | 'high';
    description: string;
}

export interface IDailyPlan {
    _id: string;
    userId: string;
    date: string;
    calorieTarget: number;
    meals: IMeal[];
    workout: IWorkout;
}

export interface User {
    _id: string;
    email: string;
    name: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
}
