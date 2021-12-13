import { MealPlan } from '@/profile/components/MyMealPlan/MealPlanTypes';
import { Endpoint } from '.';
import { URI } from '../config';

export class MealPlantEndpoint extends Endpoint {
    public getMealPlan(): Promise<MealPlan> {
        return this.get(URI.mealPlan.get);
    }

    public updateMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
        const url = new URL(URI.mealPlan.update);
        url.searchParams.append('id', mealPlan._id!);

        return this.put(url.toString(), mealPlan);
    }
}
