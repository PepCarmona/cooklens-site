import { ref } from 'vue';

import { RecipesEndpoint } from '@/api/endpoints/recipe';

import { PaginationState } from '@/shared/Pagination/PaginationState';
import { AuthenticationState } from '@/auth/AuthenticationState';

import {
	UserInfo,
	Recipe,
	RecipeClass,
	SearchQuery,
	SearchType,
} from 'cooklens-types';

export default function createRecipeState(
	authState: AuthenticationState,
	paginationState: PaginationState
) {
	const recipeService = new RecipesEndpoint();

	const { checkIfNextPageExists, goToPage } = paginationState;
	const { authenticatedUser } = authState;

	const isLoading = ref(false);
	const isOwnRecipe = ref(false);
	const recipe = ref<Recipe>(new RecipeClass());
	const canModifyServings = ref(false);
	const modifiedServings = ref<number | null>(null);
	const recipes = ref<Recipe[]>([]);
	const searchQuery = ref<SearchQuery>({ type: 'title', text: '' });

	function isFavoriteRecipe(recipe: Recipe): boolean {
		if (!authenticatedUser.value || !authenticatedUser.value.favRecipes) {
			return false;
		}
		return authenticatedUser.value.favRecipes.includes(recipe._id!);
	}

	function addRecipe(recipe: Recipe): Promise<Recipe> {
		isLoading.value = true;

		recipe.author = authenticatedUser.value?._id;

		return recipeService
			.addRecipe(recipe)
			.finally(() => (isLoading.value = false));
	}

	function editRecipe(_recipe: Recipe): Promise<Recipe> {
		isLoading.value = true;

		return recipeService
			.editRecipe(_recipe)
			.then((editedRecipe) => (recipe.value = editedRecipe))
			.finally(() => (isLoading.value = false));
	}

	async function editRating(value: number) {
		recipe.value.rating = value;

		await recipeService.editRecipe(recipe.value);
	}

	function importRecipe(url: string) {
		isLoading.value = true;

		return recipeService
			.importRecipe(url)
			.finally(() => (isLoading.value = false));
	}

	function setSearch(type: SearchType, text: string) {
		searchQuery.value.type = type;
		searchQuery.value.text = text;
	}

	function searchRecipes(page = 1, limit = 10) {
		isLoading.value = true;

		return recipeService
			.searchRecipes(
				page,
				limit,
				searchQuery.value.type,
				searchQuery.value.text
			)
			.then((paginatedRecipes) => {
				goToPage(page);

				checkIfNextPageExists(paginatedRecipes.next);

				recipes.value = paginatedRecipes.result;
			})
			.finally(() => (isLoading.value = false));
	}

	function getRecipe(id: string) {
		isLoading.value = true;

		return recipeService
			.getRecipe(id)
			.then((resultRecipe) => {
				// TODO: remove when all recipes in db are sanitized
				if (resultRecipe.time) {
					resultRecipe.time.preparation = resultRecipe.time.preparation ?? 0;
				}

				recipe.value = resultRecipe;

				canModifyServings.value = recipe.value.ingredients.some(
					(ingredient) => ingredient.quantity && ingredient.quantity > 0
				);

				if (canModifyServings.value) {
					modifiedServings.value = recipe.value.servings;
				}

				isOwnRecipe.value =
					!!resultRecipe.author &&
					authenticatedUser.value?._id ===
						(resultRecipe.author as UserInfo)._id;
			})
			.finally(() => (isLoading.value = false));
	}

	function getRandomRecipe() {
		isLoading.value = true;

		return recipeService
			.getRandomRecipe()
			.then((randomRecipe) => {
				recipe.value = randomRecipe;

				canModifyServings.value = recipe.value.ingredients.some(
					(ingredient) => ingredient.quantity && ingredient.quantity > 0
				);

				if (canModifyServings.value) {
					modifiedServings.value = recipe.value.servings;
				}
			})
			.finally(() => (isLoading.value = false));
	}

	function deleteRecipe(recipe: Recipe) {
		isLoading.value = true;

		return recipeService
			.deleteRecipe(recipe)
			.finally(() => (isLoading.value = false));
	}

	function getMainImageUrl(recipe: Recipe | undefined): string {
		return recipe && recipe.images && recipe.images?.length > 0
			? recipe.images[0]
			: '';
	}

	return {
		isLoading,
		isOwnRecipe,
		recipe,
		canModifyServings,
		modifiedServings,
		recipes,
		searchQuery,

		isFavoriteRecipe,
		addRecipe,
		editRecipe,
		editRating,
		importRecipe,
		setSearch,
		searchRecipes,
		getRecipe,
		getRandomRecipe,
		deleteRecipe,
		getMainImageUrl,
	};
}

export type RecipeState = ReturnType<typeof createRecipeState>;
