import { Recipe } from '@/recipes/types/RecipeTypes';

export const meals = ['lunch', 'dinner'] as const;
export type Meal = typeof meals[number];

export interface DayMeal {
    meal?: Meal;
    recipe?: Recipe;
}

export interface DayPlan {
    date: string;
    meals: DayMeal[];
}
