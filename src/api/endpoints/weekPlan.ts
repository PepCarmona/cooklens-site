import { Endpoint } from '.';
import { URI } from '../config';
import { WeekPlan } from '../types/weekPlan';

export class WeekPlanEndpoint extends Endpoint {
    public getWeekPlanById(id: string): Promise<WeekPlan> {
        const url = new URL(URI.mealPlan.getById);
        url.searchParams.append('id', id);

        return this.get(url.toString());
    }
}
