import { Endpoint } from '.';
import { URI } from '../config';
import { PaginatedRecipes, Recipe } from '../types/recipe';
import { User } from '../types/user';

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
}
