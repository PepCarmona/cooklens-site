import { ref } from 'vue';

import { UserEndpoint } from '@/api/endpoints/user';
import { RecipesEndpoint } from '@/api/endpoints/recipe';

import createAuthenticationState from '@/auth/state/AuthenticationState';
import createPaginationState from '@/shared/Pagination/PaginationState';

import { Recipe } from 'cooklens-types';

export default function createUserState() {
	const userService = new UserEndpoint();
	const recipeService = new RecipesEndpoint();

	const { checkIfNextPageExists, goToPage } = createPaginationState();

	const user = createAuthenticationState().authenticatedUser;

	const isLoading = ref(false);
	const favRecipes = ref<Recipe[]>([]);
	const myRecipes = ref<Recipe[]>([]);

	function toggleFavRecipe(recipe: Recipe) {
		if (user.value?.favRecipes?.includes(recipe._id!)) {
			const index = user.value.favRecipes.indexOf(recipe._id!);
			user.value.favRecipes.splice(index, 1);
			return userService.removeFavRecipe(recipe);
		}

		user.value?.favRecipes?.push(recipe._id!);
		return userService.addFavRecipe(recipe);
	}

	function getFavRecipes(page = 1, limit = 10) {
		isLoading.value = true;

		return userService
			.getFavRecipes(page, limit)
			.then((paginatedRecipes) => {
				goToPage(page);

				checkIfNextPageExists(paginatedRecipes.next);

				favRecipes.value = paginatedRecipes.result;
			})
			.finally(() => (isLoading.value = false));
	}

	function getMyRecipes(page = 1, limit = 10) {
		isLoading.value = true;

		return recipeService
			.getRecipesByUser(user.value!._id!, page, limit)
			.then((paginatedRecipes) => {
				goToPage(page);

				checkIfNextPageExists(paginatedRecipes.next);

				myRecipes.value = paginatedRecipes.result;
			})
			.finally(() => (isLoading.value = false));
	}

	return {
		isLoading,
		favRecipes,
		myRecipes,

		toggleFavRecipe,
		getFavRecipes,
		getMyRecipes,
	};
}
