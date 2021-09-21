<template>
    <CustomModal v-if="isSearching">
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
            <template
                v-for="(recipe, index) in recipesToShow"
                :key="recipe._id"
            >
                <RecipeCard
                    :recipe="recipe"
                    @click="openRecipeDetails(index)"
                />
            </template>
            <button
                v-if="showFilteredRecipes & !isSearching"
                @click="showAllRecipes"
                class="seeAll"
            >
                See all
            </button>
            <div v-if="recipesToShow.length === 0">
                No recipes match this search
            </div>
            <Pagination
                v-if="!(currentPage === 1 && !nextPage)"
                class="mt-1"
                :page="currentPage"
                :next="nextPage"
                @previousPage="goToPreviousPage"
                @nextPage="goToNextPage"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    inject,
    nextTick,
    onMounted,
    ref,
} from 'vue';
import { PaginatedRecipes, Recipe } from '@/api/recipes/recipe';
import { AxiosResponse, AxiosStatic } from 'axios';
import { URI } from '@/api/config/index';
import RecipeCard from '@/components/RecipeCard.vue';
import SearchRecipe from '@/components/SearchRecipe.vue';
import { useRoute, useRouter } from 'vue-router';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import Pagination from '@/components/shared/Pagination.vue';

export default defineComponent({
    name: 'RecipeList',

    components: {
        RecipeCard,
        SearchRecipe,
        CustomModal,
        LoadingModal,
        Pagination,
    },

    setup() {
        const axios: AxiosStatic | undefined = inject('axios');
        const router = useRouter();
        const route = useRoute();

        const selectedIndex = ref<number | null>(null);
        const recipes = ref<Recipe[]>([]);
        // const cachedRecipes = ref<Recipe[]>([]);
        const filteredRecipes = ref<Recipe[]>([]);

        const currentPage = ref(1);
        const nextPage = ref<number | null>(null);

        const isSearching = ref(false);
        const showFilteredRecipes = ref(false);

        const searchComponent = ref<InstanceType<typeof SearchRecipe>>();

        const data = {
            recipes,
            filteredRecipes,
            isSearching,
            showFilteredRecipes,
            searchComponent,
            currentPage,
            nextPage,
        };

        onMounted(() => {
            if (!route.query.searchBy) {
                if (
                    searchComponent.value &&
                    searchComponent.value.searchInput
                ) {
                    searchComponent.value.searchInput.value = '';
                }
                getRecipesPage(
                    route.query.page ? parseInt(route.query.page.toString()) : 1
                );
            }
        });

        const selectedRecipe = computed<Recipe | null>(() => {
            if (selectedIndex.value === null) {
                return null;
            }
            return recipes.value[selectedIndex.value];
        });

        const recipesToShow = computed<Recipe[]>(() => {
            if (isSearching.value) {
                return [];
            }
            if (showFilteredRecipes.value) {
                return filteredRecipes.value;
            }
            return recipes.value;
        });

        function getRecipesPage(page: number) {
            isSearching.value = true;
            showFilteredRecipes.value = false;

            router.push({
                name: 'RecipeList',
                query: {
                    page: page > 1 ? page : undefined,
                },
            });

            const url = new URL(URI.recipes.get);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', URI.recipes.defaultLimit);

            axios
                ?.get(url.toString())
                .then((response: AxiosResponse<PaginatedRecipes>) => {
                    recipes.value = response.data.recipes;

                    currentPage.value = page;
                    nextPage.value = response.data.next
                        ? currentPage.value + 1
                        : null;
                    if (route.query.searchText) {
                        nextTick(() => searchComponent.value?.searchPage(1));
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => (isSearching.value = false));
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
                name: 'Recipe',
                params: { title: formattedTitle },
                query: { id: selectedRecipe.value._id! },
            });
        }

        function showSearchRecipes(searchResultRecipes: Recipe[]) {
            if (
                searchComponent.value &&
                searchComponent.value.searchInput &&
                searchComponent.value.searchInput.value === ''
            ) {
                return;
            }

            showFilteredRecipes.value = true;
            if (searchComponent.value) {
                currentPage.value = searchComponent.value.currentPage;
                nextPage.value = searchComponent.value.nextPage;
            }

            filteredRecipes.value = searchResultRecipes;
        }

        function showAllRecipes() {
            router.push({
                name: 'RecipeList',
            });

            if (searchComponent.value && searchComponent.value.searchInput) {
                searchComponent.value.searchInput.value = '';
            }

            getRecipesPage(1);
        }

        function goToPreviousPage() {
            if (showFilteredRecipes.value) {
                searchComponent.value?.searchPage(currentPage.value - 1);
                return;
            }
            getRecipesPage(currentPage.value - 1);
        }
        function goToNextPage() {
            if (showFilteredRecipes.value) {
                searchComponent.value?.searchPage(nextPage.value!);
                return;
            }
            getRecipesPage(nextPage.value!);
        }

        return {
            ...data,
            getRecipesPage,
            openRecipeDetails,
            showSearchRecipes,
            showAllRecipes,
            recipesToShow,
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
