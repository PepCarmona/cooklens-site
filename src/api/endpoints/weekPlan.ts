import { Endpoint } from '.';
import { URI } from '../config';
import { WeekPlan } from '../types/weekPlan';

export class WeekPlanEndpoint extends Endpoint {
    public getWeekPlanById(id: string): Promise<WeekPlan> {
        const url = new URL(URI.mealPlan.getById);
        url.searchParams.append('id', id);

        return this.get(url.toString());
    }

    public createWeekPlan(weekPlan: WeekPlan): Promise<WeekPlan> {
        return this.post(URI.mealPlan.add, weekPlan);
    }

    public updateWeekPlan(weekPlan: WeekPlan): Promise<WeekPlan> {
        const url = new URL(URI.mealPlan.update);
        url.searchParams.append('id', weekPlan._id!);

        return this.put(url.toString(), weekPlan);
    }

    public deleteWeekPlan(weekPlan: WeekPlan): Promise<WeekPlan> {
        const url = new URL(URI.mealPlan.delete);
        url.searchParams.append('id', weekPlan._id!);

        return this.delete(url.toString());
    }
}
