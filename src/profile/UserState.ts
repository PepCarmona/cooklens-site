import { ref } from 'vue';

import { UserEndpoint } from '@/api/endpoints/user';
import { RecipesEndpoint } from '@/api/endpoints/recipe';

import { AuthenticationState } from '@/auth/AuthenticationState';
import { PaginationState } from '@/shared/Pagination/PaginationState';

import { Recipe } from 'cooklens-types';
import { loadingState } from '@/LoadingState';

export default function createUserState(
	authState: AuthenticationState,
	paginationState: PaginationState
) {
	const userService = new UserEndpoint();
	const recipeService = new RecipesEndpoint();

	const { isLoadingUser } = loadingState;

	const { currentPage, nextPage } = paginationState;

	const user = authState.authenticatedUser;

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
		isLoadingUser.value = true;

		return userService
			.getFavRecipes(page, limit)
			.then((paginatedRecipes) => {
				currentPage.value = page;

				nextPage.value = paginatedRecipes.next;

				favRecipes.value = paginatedRecipes.result;
			})
			.finally(() => (isLoadingUser.value = false));
	}

	function getMyRecipes(page = 1, limit = 10) {
		isLoadingUser.value = true;

		return recipeService
			.getRecipesByUser(user.value!._id!, page, limit)
			.then((paginatedRecipes) => {
				currentPage.value = page;

				nextPage.value = paginatedRecipes.next;

				myRecipes.value = paginatedRecipes.result;
			})
			.finally(() => (isLoadingUser.value = false));
	}

	return {
		favRecipes,
		myRecipes,

		toggleFavRecipe,
		getFavRecipes,
		getMyRecipes,
	};
}

export type UserState = ReturnType<typeof createUserState>;
