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
