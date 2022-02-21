import { computed, ref } from 'vue';

import { UserEndpoint } from '@/api/endpoints/user';
import { RecipesEndpoint } from '@/recipes/RecipesEndpoint';

import useAuthenticationState from '@/auth/state/AuthenticationState';
import usePaginationState from '@/shared/Pagination/PaginationState';

import { Recipe } from 'cooklens-types';

const userService = new UserEndpoint();
const recipeService = new RecipesEndpoint();

const { checkIfNextPageExists, goToPage } = usePaginationState();

const user = useAuthenticationState().authenticatedUser;

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

export default function useUserState() {
	return {
		isLoading: computed(() => isLoading.value),
		favRecipes: computed(() => favRecipes.value),
		myRecipes: computed(() => myRecipes.value),

		toggleFavRecipe,
		getFavRecipes,
		getMyRecipes,
	};
}
