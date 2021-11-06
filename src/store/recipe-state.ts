import { RecipesEndpoint } from '@/api/endpoints/recipe';
import {
    IntegratedSite,
    Recipe,
    RecipeClass,
    SearchType,
} from '@/api/types/recipe';
import { computed, reactive, readonly, ref, Ref } from 'vue';
import usePaginationState from '@/store/pagination-state';
import useAuthState from './auth-state';

export interface SearchQuery {
    type: SearchType;
    text: string;
}

interface RecipeState {
    isLoading: Readonly<Ref<boolean>>;
    recipe: Readonly<Ref<Recipe>>;
    canModifyServings: Readonly<Ref<boolean>>;
    modifiedServings: Readonly<Ref<number | null>>;
    recipes: Readonly<Ref<Recipe[]>>;
    searchQuery: Readonly<Ref<SearchQuery>>;

    integratedSites: Readonly<Ref<IntegratedSite[]>>;

    isFavoriteRecipe(recipe: Recipe): boolean;
    addRecipe(recipe: Recipe): Promise<Recipe>;
    editRecipe(recipe: Recipe): Promise<Recipe>;
    editRating(value: number): Promise<void>;
    importRecipe(url: string): Promise<Recipe>;
    setSearch(type: SearchType, text: string): void;
    searchRecipes(page?: number, limit?: number): Promise<void>;
    getRecipe(id: string): Promise<void>;
    getRandomRecipe(): Promise<void>;
    deleteRecipe(recipe: Recipe): Promise<Recipe>;
    getIntegratedSites(): Promise<IntegratedSite[]>;
    getMainImageUrl(recipe: Recipe | undefined): string;
}

const recipeService = new RecipesEndpoint();
const { checkIfNextPageExists, goToPage } = usePaginationState();
const { authenticatedUser } = useAuthState();

const isLoading = ref(false);
const recipe = ref<Recipe>(new RecipeClass());
const canModifyServings = ref(false);
const modifiedServings = ref<number | null>(null);
const recipes = ref<Recipe[]>([]);
const searchQuery = reactive<SearchQuery>({ type: 'title', text: '' });

const integratedSites = ref<IntegratedSite[]>([]);

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
    searchQuery.type = type;
    searchQuery.text = text;
}

function searchRecipes(page = 1, limit = 5) {
    isLoading.value = true;

    return recipeService
        .searchRecipes(page, limit, searchQuery.type, searchQuery.text)
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
            resultRecipe.time.preparation = resultRecipe.time.preparation ?? 0;

            recipe.value = resultRecipe;

            canModifyServings.value = recipe.value.ingredients.some(
                (ingredient) => ingredient.quantity && ingredient.quantity > 0
            );

            if (canModifyServings.value) {
                modifiedServings.value = recipe.value.servings;
            }
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

function getIntegratedSites() {
    isLoading.value = true;

    return recipeService
        .getIntegratedSites()
        .then((sites) => (integratedSites.value = sites))
        .finally(() => (isLoading.value = false));
}

function getMainImageUrl(recipe: Recipe | undefined): string {
    return recipe && recipe.images && recipe.images?.length > 0
        ? recipe.images[0]
        : '';
}

export default function useRecipeState(): RecipeState {
    return {
        isLoading: readonly(isLoading),
        recipe: computed(() => recipe.value),
        canModifyServings: readonly(canModifyServings),
        modifiedServings: readonly(modifiedServings),
        recipes: computed(() => recipes.value),
        searchQuery: computed(() => searchQuery),

        integratedSites: computed(() => integratedSites.value),

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
        getIntegratedSites,
        getMainImageUrl,
    };
}
