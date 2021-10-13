<template>
    <CustomModal v-if="isLoading">
        <LoadingModal>Loading ...</LoadingModal>
    </CustomModal>
    <div>
        <div class="search">
            <SearchRecipe
                @searchResult="showSearchRecipes"
                :recipes="recipes"
                ref="searchComponent"
            />
        </div>
        <div class="card-container d-flex mt-1 m-auto justify-around">
            <template v-for="(recipe, index) in recipes" :key="recipe._id">
                <RecipeCard
                    :recipe="recipe"
                    @click="openRecipeDetails(index)"
                />
            </template>
            <button
                v-if="showFilteredRecipes & !isLoading"
                @click="showAllRecipes"
                class="seeAll"
            >
                See all
            </button>
            <div v-if="recipes.length === 0">No recipes match this search</div>
            <Pagination
                v-if="!(currentPage === 1 && !nextPageExists)"
                class="mt-1"
                :nextPageExists="nextPageExists"
                @previousPage="goToPreviousPage"
                @nextPage="goToNextPage"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import { Recipe } from '@/api/types/recipe';
import RecipeCard from '@/components/recipes/RecipeCard.vue';
import SearchRecipe from '@/components/recipes/SearchRecipe.vue';
import { useRoute, useRouter } from 'vue-router';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import Pagination from '@/components/shared/Pagination.vue';
import useRecipeState from '@/store/recipe-state';
import usePaginationState from '@/store/pagination-state';

export default defineComponent({
    name: 'RecipesMainView',

    components: {
        RecipeCard,
        SearchRecipe,
        CustomModal,
        LoadingModal,
        Pagination,
    },

    setup() {
        const { isLoading, recipes } = useRecipeState();
        const { currentPage, nextPageExists } = usePaginationState();

        const router = useRouter();
        const route = useRoute();

        const showFilteredRecipes = ref(false);

        const selectedIndex = ref<number | null>(null);

        // const cachedRecipes = ref<Recipe[]>([]);

        const searchComponent = ref<InstanceType<typeof SearchRecipe>>();

        const data = {
            currentPage,
            nextPageExists,
            isLoading,
            showFilteredRecipes,
            searchComponent,
        };

        onMounted(() => {
            if (!route.query.searchBy) {
                if (
                    searchComponent.value &&
                    searchComponent.value.searchInput
                ) {
                    searchComponent.value.searchInput.value = '';
                }
                getRecipesPage(parseInt(route.query.page?.toString() ?? '1'));
            }
        });

        const selectedRecipe = computed<Recipe | null>(() => {
            if (selectedIndex.value === null) {
                return null;
            }
            return recipes.value[selectedIndex.value];
        });

        function getRecipesPage(page?: number) {
            showFilteredRecipes.value = false;

            router.push({
                name: 'RecipesMainView',
                query: {
                    page: page && page > 1 ? page : undefined,
                },
            });

            useRecipeState()
                .searchRecipes(page)
                .then(() => {
                    if (route.query.searchText) {
                        nextTick(() => searchComponent.value?.doSearch());
                    }
                });
        }

        function openRecipeDetails(index: number) {
            selectedIndex.value = index;

            if (selectedIndex.value === null || selectedRecipe.value === null) {
                console.error('No selected recipe');
                return;
            }

            const formattedTitle = selectedRecipe.value.title
                .toLowerCase()
                .replaceAll(' ', '-');

            router.push({
                name: 'RecipeDetails',
                params: { title: formattedTitle },
                query: { id: selectedRecipe.value._id! },
            });
        }

        function showSearchRecipes() {
            if (
                searchComponent.value &&
                searchComponent.value.searchInput &&
                searchComponent.value.searchInput.value === ''
            ) {
                return;
            }

            showFilteredRecipes.value = true;
        }

        function showAllRecipes() {
            router.push({
                name: 'RecipesMainView',
            });

            if (searchComponent.value && searchComponent.value.searchInput) {
                searchComponent.value.searchInput.value = '';
            }

            useRecipeState().setSearch('title', '');

            getRecipesPage();
        }

        function goToPreviousPage() {
            window.scrollTo({ top: 0 });
            if (showFilteredRecipes.value) {
                searchComponent.value?.doSearch(currentPage.value - 1);
                return;
            }
            getRecipesPage(currentPage.value - 1);
        }
        function goToNextPage() {
            window.scrollTo({ top: 0 });
            if (showFilteredRecipes.value) {
                searchComponent.value?.doSearch(currentPage.value + 1);
                return;
            }
            getRecipesPage(currentPage.value + 1);
        }

        return {
            ...data,
            getRecipesPage,
            openRecipeDetails,
            showSearchRecipes,
            showAllRecipes,
            recipes,
            goToPreviousPage,
            goToNextPage,
        };
    },
});
</script>

<style scoped>
.search {
    background-color: lightgrey;
    padding: 2rem;
    padding-top: calc(2rem + 50px);
    padding-bottom: 1rem;
    margin-top: -50px;
}

.card-container {
    flex-wrap: wrap;
    width: 90%;
}
.card-container > .card:first-child {
    margin-top: 0;
}

.seeAll {
    position: absolute;
    background-color: black;
    color: white;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    border-radius: 50px;
    font-size: 1.05rem;
    margin-top: -2rem;
    cursor: pointer;
}

@media only screen and (min-width: 769px) {
    .search {
        padding-top: calc(2rem + 60px);
        margin-top: -60px;
    }
}
@media only screen and (min-width: 906px) {
    .card-container > .card:nth-child(2) {
        margin-top: 0;
    }
}
@media only screen and (min-width: 1350px) {
    .card-container > .card:nth-child(3) {
        margin-top: 0;
    }
}
</style>
