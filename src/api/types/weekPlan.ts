import { Recipe } from './recipe';
import { User } from './user';

export type Meals = keyof DailyPlan;

export interface DailyPlan {
    lunch?: string | Recipe;
    dinner?: string | Recipe;
}

export interface WeekPlan {
    _id?: string;
    name: string;
    dailyPlans: [
        DailyPlan,
        DailyPlan,
        DailyPlan,
        DailyPlan,
        DailyPlan,
        DailyPlan,
        DailyPlan
    ];
    author: string | User;
}
