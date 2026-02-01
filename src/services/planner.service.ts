import apiWrapper from "@/lib/api";
import { IDailyPlan } from "@/types";

export const PlannerService = {
    /**
     * Fetches the daily plan for a specific date.
     */
    getDailyPlan: async (date: Date): Promise<IDailyPlan | null> => {
        try {
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
            const plan = await apiWrapper.get<IDailyPlan>(`/planner?date=${dateStr}`);
            return plan || null;
        } catch (error: unknown) {
            // Handle 404 gracefully - this is expected when no plan exists
            const errorObj = error as Record<string, unknown>;
            if (errorObj?.message === 'No plan found for this date.') {
                return null; // No plan exists for this date - this is normal
            }
            console.error('Error fetching daily plan:', error);
            return null;
        }
    },

    /**
     * Generates a new daily plan for a specific date (defaults to today).
     */
    generateDailyPlan: async (date?: Date): Promise<IDailyPlan> => {
        try {
            const plan = await apiWrapper.post<IDailyPlan>('/planner/generate', {
                date: date ? date.toISOString() : new Date().toISOString()
            });
            return plan;
        } catch (error: unknown) {
            console.error('Error generating plan:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to generate plan');
        }
    }
};
