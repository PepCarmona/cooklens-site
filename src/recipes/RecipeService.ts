import { RecipesEndpoint } from '@/api/endpoints/recipe';
import { AuthenticationState } from '@/auth/AuthenticationState';
import { PaginationState } from '@/shared/Pagination/PaginationState';
import { Recipe, UserInfo } from 'cooklens-types';
import { RecipeState } from './RecipeState';

const recipesEndpoint = new RecipesEndpoint();

export default function createRecipeService(
	recipeState: RecipeState,
	authState: AuthenticationState,
	paginationState: PaginationState
) {
	function addRecipe(recipe: Recipe): Promise<Recipe> {
		recipeState.isLoading.value = true;

		recipe.author = authState.authenticatedUser.value?._id;

		return recipesEndpoint
			.addRecipe(recipe)
			.finally(() => (recipeState.isLoading.value = false));
	}

	function editRecipe(_recipe: Recipe): Promise<Recipe> {
		recipeState.isLoading.value = true;

		return recipesEndpoint
			.editRecipe(_recipe)
			.then((editedRecipe) => (recipeState.recipe.value = editedRecipe))
			.finally(() => (recipeState.isLoading.value = false));
	}

	function importRecipe(url: string) {
		recipeState.isLoading.value = true;

		return recipesEndpoint
			.importRecipe(url)
			.finally(() => (recipeState.isLoading.value = false));
	}

	function searchRecipes(page = 1, limit = 10) {
		recipeState.isLoading.value = true;

		return recipesEndpoint
			.searchRecipes(
				page,
				limit,
				recipeState.searchQuery.value.type,
				recipeState.searchQuery.value.text
			)
			.then((paginatedRecipes) => {
				paginationState.goToPage(page);

				paginationState.checkIfNextPageExists(paginatedRecipes.next);

				recipeState.recipes.value = paginatedRecipes.result;
			})
			.finally(() => (recipeState.isLoading.value = false));
	}

	function getRecipe(id: string) {
		recipeState.isLoading.value = true;

		return recipesEndpoint
			.getRecipe(id)
			.then((resultRecipe) => {
				// TODO: remove when all recipes in db are sanitized
				if (resultRecipe.time) {
					resultRecipe.time.preparation = resultRecipe.time.preparation ?? 0;
				}

				recipeState.recipe.value = resultRecipe;

				recipeState.canModifyServings.value =
					recipeState.recipe.value.ingredients.some(
						(ingredient) => ingredient.quantity && ingredient.quantity > 0
					);

				if (recipeState.canModifyServings.value) {
					recipeState.modifiedServings.value =
						recipeState.recipe.value.servings;
				}

				recipeState.isOwnRecipe.value =
					!!resultRecipe.author &&
					authState.authenticatedUser.value?._id ===
						(resultRecipe.author as UserInfo)._id;
			})
			.finally(() => (recipeState.isLoading.value = false));
	}

	function getRandomRecipe() {
		recipeState.isLoading.value = true;

		return recipesEndpoint
			.getRandomRecipe()
			.then((randomRecipe) => {
				recipeState.recipe.value = randomRecipe;

				recipeState.canModifyServings.value =
					recipeState.recipe.value.ingredients.some(
						(ingredient) => ingredient.quantity && ingredient.quantity > 0
					);

				if (recipeState.canModifyServings.value) {
					recipeState.modifiedServings.value =
						recipeState.recipe.value.servings;
				}
			})
			.finally(() => (recipeState.isLoading.value = false));
	}

	function deleteRecipe(recipe: Recipe) {
		recipeState.isLoading.value = true;

		return recipesEndpoint
			.deleteRecipe(recipe)
			.finally(() => (recipeState.isLoading.value = false));
	}

	return {
		addRecipe,
		editRecipe,
		importRecipe,
		searchRecipes,
		getRecipe,
		getRandomRecipe,
		deleteRecipe,
	};
}

export type RecipeService = ReturnType<typeof createRecipeService>;
