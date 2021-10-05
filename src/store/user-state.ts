import { UserEndpoint } from '@/api/endpoints/user';
import { Recipe } from '@/api/types/recipe';
import { User } from '@/api/types/user';
import { computed, ref, Ref } from 'vue';
import useAuthState from './auth-state';
import usePaginationState from '@/store/pagination-state';

interface UserState {
    isLoading: Readonly<Ref<boolean>>;
    favRecipes: Readonly<Ref<Recipe[]>>;

    toggleFavRecipe(recipe: Recipe): Promise<User>;
    getFavRecipes(): Promise<void>;
}

const userService = new UserEndpoint();
const { checkIfNextPageExists, goToPage } = usePaginationState();

const user = useAuthState().authenticatedUser;

const isLoading = ref(false);
const favRecipes = ref<Recipe[]>([]);

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

export default function useUserState(): UserState {
    return {
        isLoading: computed(() => isLoading.value),
        favRecipes: computed(() => favRecipes.value),

        toggleFavRecipe,
        getFavRecipes,
    };
}
