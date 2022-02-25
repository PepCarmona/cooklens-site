import { RecipesEndpoint } from '@/api/endpoints/recipe';
import { AuthenticationState } from '@/auth/AuthenticationState';
import { loadingState } from '@/LoadingState';
import { PaginationState } from '@/shared/Pagination/PaginationState';
import { Recipe, UserInfo } from 'cooklens-types';
import { RecipeState } from './RecipeState';

const recipesEndpoint = new RecipesEndpoint();

export default function createRecipeService(
	recipeState: RecipeState,
	authState: AuthenticationState,
	paginationState: PaginationState
) {
	const { isLoadingRecipes } = loadingState;
	function addRecipe(recipe: Recipe): Promise<Recipe> {
		isLoadingRecipes.value = true;

		recipe.author = authState.authenticatedUser.value?._id;

		return recipesEndpoint
			.addRecipe(recipe)
			.finally(() => (isLoadingRecipes.value = false));
	}

	function editRecipe(_recipe: Recipe): Promise<Recipe> {
		isLoadingRecipes.value = true;

		return recipesEndpoint
			.editRecipe(_recipe)
			.then((editedRecipe) => (recipeState.recipe.value = editedRecipe))
			.finally(() => (isLoadingRecipes.value = false));
	}

	function importRecipe(url: string) {
		isLoadingRecipes.value = true;

		return recipesEndpoint
			.importRecipe(url)
			.finally(() => (isLoadingRecipes.value = false));
	}

	function searchRecipes(page = 1, limit = 10) {
		isLoadingRecipes.value = true;

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
			.finally(() => (isLoadingRecipes.value = false));
	}

	function getRecipe(id: string) {
		isLoadingRecipes.value = true;

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
			.finally(() => (isLoadingRecipes.value = false));
	}

	function getRandomRecipe() {
		isLoadingRecipes.value = true;

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
			.finally(() => (isLoadingRecipes.value = false));
	}

	function deleteRecipe(recipe: Recipe) {
		isLoadingRecipes.value = true;

		return recipesEndpoint
			.deleteRecipe(recipe)
			.finally(() => (isLoadingRecipes.value = false));
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