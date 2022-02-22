import { reactive, readonly, ref } from 'vue';

import { RecipesEndpoint } from '@/recipes/RecipesEndpoint';

import usePaginationState from '@/shared/Pagination/PaginationState';
import useAuthenticationState from '@/auth/state/AuthenticationState';

import { Recipe, RecipeClass, SearchQuery, SearchType } from 'cooklens-types';

const recipeService = new RecipesEndpoint();

export type RecipeState = ReturnType<typeof useRecipeState>;

export default function useRecipeState() {
	const { checkIfNextPageExists, goToPage } = usePaginationState();
	const { authenticatedUser } = useAuthenticationState();

	const isLoading = ref(false);
	const isOwnRecipe = ref(false);
	const recipe = ref<Recipe>(new RecipeClass());
	const canModifyServings = ref(false);
	const modifiedServings = ref<number | null>(null);
	const recipes = ref<Recipe[]>([]);
	const searchQuery = reactive<SearchQuery>({ type: 'title', text: '' });

	function setSearch(type: SearchType, text: string) {
		searchQuery.type = type;
		searchQuery.text = text;
	}

	function isFavoriteRecipe(recipe: Recipe): boolean {
		return !!authenticatedUser?.favRecipes?.includes(recipe._id!);
	}

	async function editRating(value: number) {
		recipe.value.rating = value;

		await recipeService.editRecipe(recipe.value);
	}

	function getMainImageUrl(recipe: Recipe | undefined): string {
		return recipe && recipe.images && recipe.images?.length > 0
			? recipe.images[0]
			: '';
	}

	return {
		isLoading: readonly(isLoading).value,
		isOwnRecipe: readonly(isOwnRecipe).value,
		recipe: readonly(recipe).value,
		canModifyServings: readonly(canModifyServings).value,
		modifiedServings: readonly(modifiedServings).value,
		recipes: readonly(recipes).value,
		searchQuery: readonly(searchQuery),

		isFavoriteRecipe,
		editRating,
		setSearch,
		getMainImageUrl,
	};
}
