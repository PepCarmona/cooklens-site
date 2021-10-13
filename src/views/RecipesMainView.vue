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
        <RecipeList
            :recipes="recipes"
            :showFilteredRecipes="showFilteredRecipes && !isLoading"
            @showAllRecipes="showAllRecipes"
            @goToPage="goToPage"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import SearchRecipe from '@/components/recipes/SearchRecipe.vue';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';

import useRecipeState from '@/store/recipe-state';
import usePaginationState from '@/store/pagination-state';

export default defineComponent({
    name: 'RecipesMainView',

    components: {
        SearchRecipe,
        CustomModal,
        LoadingModal,
        RecipeList,
    },

    setup() {
        const { isLoading, recipes } = useRecipeState();
        const { currentPage, nextPageExists } = usePaginationState();

        const router = useRouter();
        const route = useRoute();

        const showFilteredRecipes = ref(false);

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

        function goToPage(page: number) {
            window.scrollTo({ top: 0 });
            if (showFilteredRecipes.value) {
                searchComponent.value?.doSearch(page);
                return;
            }
            getRecipesPage(page);
        }

        return {
            ...data,
            getRecipesPage,
            showSearchRecipes,
            showAllRecipes,
            recipes,
            goToPage,
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

@media only screen and (min-width: 769px) {
    .search {
        padding-top: calc(2rem + 60px);
        margin-top: -60px;
    }
}
</style>
