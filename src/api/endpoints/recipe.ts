import { Endpoint } from '.';
import { URI } from '@/api/config';
import {
    IntegratedSite,
    PaginatedRecipes,
    Recipe,
    SearchType,
} from '@/api/types/recipe';

interface RecipesEndpointInterface {
    addRecipe(recipe: Recipe): Promise<Recipe>;
    editRecipe(recipe: Recipe): Promise<Recipe>;
    importRecipe(importURL: string): Promise<Recipe>;
    searchRecipes(
        page: number,
        limit: number,
        searchType?: SearchType,
        searchText?: string
    ): Promise<PaginatedRecipes>;
    getRecipe(id: string): Promise<Recipe>;
    getRandomRecipe(): Promise<Recipe>;
    deleteRecipe(recipe: Recipe): Promise<Recipe>;
    getIntegratedSites(): Promise<IntegratedSite[]>;
}

export class RecipesEndpoint
    extends Endpoint
    implements RecipesEndpointInterface
{
    public addRecipe(recipe: Recipe): Promise<Recipe> {
        return this.post(URI.recipes.add, recipe);
    }

    public editRecipe(recipe: Recipe): Promise<Recipe> {
        const url = new URL(URI.recipes.update);
        url.searchParams.append('id', recipe._id!);

        return this.put(url.toString(), recipe);
    }

    public importRecipe(importURL: string): Promise<Recipe> {
        const url = new URL(URI.recipes.import);
        url.searchParams.append('url', importURL);

        return this.get(url.toString());
    }

    public searchRecipes(
        page: number,
        limit: number,
        searchType?: SearchType,
        searchText?: string
    ): Promise<PaginatedRecipes> {
        const url = new URL(URI.recipes.get);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());
        if (searchType && searchText) {
            url.searchParams.append('searchType', searchType);
            url.searchParams.append('searchText', searchText);
        }

        return this.get(url.toString());
    }

    public getRecipe(id: string): Promise<Recipe> {
        const url = new URL(URI.recipes.getById);
        url.searchParams.append('id', id);

        return this.get(url.toString());
    }

    public getRandomRecipe(): Promise<Recipe> {
        return this.get(URI.recipes.getRandom);
    }

    public deleteRecipe(recipe: Recipe): Promise<Recipe> {
        const url = new URL(URI.recipes.delete);
        url.searchParams.append('id', recipe._id!);

        return this.delete(url.toString());
    }

    public getIntegratedSites(): Promise<IntegratedSite[]> {
        return this.get(URI.recipes.integratedSites);
    }
}
