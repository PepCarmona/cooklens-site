import { ref } from 'vue';

import { RecipesEndpoint } from '@/api/endpoints/recipe';

import { AuthenticationState } from '@/auth/AuthenticationState';

import {
	Recipe as IRecipe,
	RecipeClass,
	SearchQuery,
	SearchType,
} from 'cooklens-types';

export interface Recipe extends IRecipe {
	isOwnRecipe?: boolean;
	canModifyServings?: boolean;
	modifiedServings?: number | null;
}

export default function createRecipeState(authState: AuthenticationState) {
	const recipeService = new RecipesEndpoint();
	const { authenticatedUser } = authState;

	const recipe = ref<Recipe>(new RecipeClass());
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
		recipe,
		recipes,
		searchQuery,

		isFavoriteRecipe,
		editRating,
		setSearch,
		getMainImageUrl,
	};
}

export type RecipeState = ReturnType<typeof createRecipeState>;
