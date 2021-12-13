import { Endpoint } from '.';
import { URI } from '../config';
import { PaginatedRecipes, Recipe } from '../../recipes/types/RecipeTypes';
import { User } from '../../profile/types/UserTypes';
import { WeekPlan } from '../../profile/components/MyWeekPlan/WeekPlanTypes';

interface UserEndpointInterface {
    addFavRecipe(recipe: Recipe): Promise<User>;

    removeFavRecipe(recipe: Recipe): Promise<User>;

    getFavRecipes(page: number, limit: number): Promise<PaginatedRecipes>;
}

export class UserEndpoint extends Endpoint implements UserEndpointInterface {
    public addFavRecipe(recipe: Recipe): Promise<User> {
        return this.put(URI.user.addFavRecipe, recipe);
    }

    public removeFavRecipe(recipe: Recipe): Promise<User> {
        return this.put(URI.user.removeFavRecipe, recipe);
    }

    public getFavRecipes(
        page: number,
        limit: number
    ): Promise<PaginatedRecipes> {
        const url = new URL(URI.user.getFavRecipes);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());

        return this.get(url.toString());
    }

    public getMyWeekPlans(): Promise<WeekPlan[]> {
        return this.get(URI.weekPlan.getMyWeekPlans);
    }
}
