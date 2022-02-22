import { AuthenticationState } from '@/auth/state/AuthenticationState';
import { PaginationState } from '@/shared/Pagination/PaginationState';
import { Recipe, SearchQuery, UserInfo } from 'cooklens-types';
import { RecipesEndpoint } from './RecipesEndpoint';
import { RecipeState } from './RecipeState';

const RECIPES_API = new RecipesEndpoint();

export class RecipeService {
	constructor(
		private recipeState: RecipeState,
		private authState: AuthenticationState,
		private paginationState: PaginationState
	) {}

	public addRecipe(recipe: Recipe): Promise<Recipe> {
		this.recipeState.isLoading = true;

		recipe.author = this.authState.authenticatedUser?._id;

		return RECIPES_API.addRecipe(recipe).finally(
			() => (this.recipeState.isLoading = false)
		);
	}

	public editRecipe(_recipe: Recipe): Promise<Recipe> {
		this.recipeState.isLoading = true;

		return RECIPES_API.editRecipe(_recipe).finally(
			() => (this.recipeState.isLoading = false)
		);
	}
	public importRecipe(url: string) {
		this.recipeState.isLoading = true;

		return RECIPES_API.importRecipe(url).finally(
			() => (this.recipeState.isLoading = false)
		);
	}

	public searchRecipes(searchQuery: SearchQuery, page = 1, limit = 10) {
		this.recipeState.isLoading = true;

		return RECIPES_API.searchRecipes(searchQuery, page, limit)
			.then((paginatedRecipes) => {
				this.paginationState.goToPage(page);

				this.paginationState.checkIfNextPageExists(paginatedRecipes.next);

				return paginatedRecipes.result;
			})
			.finally(() => (this.recipeState.isLoading = false));
	}

	public getRecipe(id: string) {
		this.recipeState.isLoading = true;

		return RECIPES_API.getRecipe(id)
			.then((foundRecipe) => {
				// TODO: remove when all recipes in db are sanitized
				if (foundRecipe.time) {
					foundRecipe.time.preparation = foundRecipe.time.preparation ?? 0;
				}

				this.recipeState.canModifyServings = foundRecipe.ingredients.some(
					(ingredient) => ingredient.quantity && ingredient.quantity > 0
				);

				if (this.recipeState.canModifyServings) {
					this.recipeState.modifiedServings = foundRecipe.servings;
				}

				this.recipeState.isOwnRecipe =
					!!foundRecipe.author &&
					this.authState.authenticatedUser?._id ===
						(foundRecipe.author as UserInfo)._id;

				return foundRecipe;
			})
			.finally(() => (this.recipeState.isLoading = false));
	}

	public getRandomRecipe() {
		this.recipeState.isLoading = true;

		return RECIPES_API.getRandomRecipe()
			.then((randomRecipe) => {
				this.recipeState.canModifyServings = randomRecipe.ingredients.some(
					(ingredient) => ingredient.quantity && ingredient.quantity > 0
				);

				if (this.recipeState.canModifyServings) {
					this.recipeState.modifiedServings = randomRecipe.servings;
				}

				return randomRecipe;
			})
			.finally(() => (this.recipeState.isLoading = false));
	}

	public deleteRecipe(recipe: Recipe) {
		this.recipeState.isLoading = true;

		return RECIPES_API.deleteRecipe(recipe).finally(
			() => (this.recipeState.isLoading = false)
		);
	}
}
