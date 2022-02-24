import { ref } from 'vue';

import { RecipesEndpoint } from '@/api/endpoints/recipe';

import { AuthenticationState } from '@/auth/AuthenticationState';

import { Recipe, RecipeClass, SearchQuery, SearchType } from 'cooklens-types';

export default function createRecipeState(authState: AuthenticationState) {
	const recipeService = new RecipesEndpoint();
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

	async function editRating(value: number) {
		recipe.value.rating = value;

		await recipeService.editRecipe(recipe.value);
	}

	function setSearch(type: SearchType, text: string) {
		searchQuery.value.type = type;
		searchQuery.value.text = text;
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
		editRating,
		setSearch,
		getMainImageUrl,
	};
}

export type RecipeState = ReturnType<typeof createRecipeState>;
