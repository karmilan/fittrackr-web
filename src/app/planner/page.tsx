import DailyPlanView from '@/components/planner/DailyPlanView';

export default function PlannerPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Daily Planner</h1>
                <p className="text-muted-foreground">
                    Your personalized diet and workout plan for today.
                </p>
            </div>

            <DailyPlanView />
        </div>
    );
}
