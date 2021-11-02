<template>
    <CustomModal v-if="isLoading">
        <LoadingModal>Loading ...</LoadingModal>
    </CustomModal>
    <div>
        <div class="search">
            <SearchRecipe
                @doSearch="doSearch($event.page, $event.searchQuery)"
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
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import SearchRecipe from '@/components/recipes/SearchRecipe.vue';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';

import useRecipeState, { SearchQuery } from '@/store/recipe-state';
import { SearchType } from '@/api/types/recipe';

export default defineComponent({
    name: 'RecipesMainView',

    components: {
        SearchRecipe,
        CustomModal,
        LoadingModal,
        RecipeList,
    },

    setup() {
        const { isLoading, recipes, searchRecipes, setSearch, searchQuery } =
            useRecipeState();

        const router = useRouter();
        const route = useRoute();

        const showFilteredRecipes = ref(false);

        // const cachedRecipes = ref<Recipe[]>([]);

        const data = {
            isLoading,
            showFilteredRecipes,
        };

        onMounted(() => {
            if (route.query.searchBy && route.query.searchText) {
                setSearch(
                    route.query.searchBy.toString() as SearchType,
                    route.query.searchText.toString()
                );

                doSearch(
                    parseInt(route.query.page?.toString() ?? '1'),
                    searchQuery.value
                );
            }

            doSearch(parseInt(route.query.page?.toString() ?? '1'));
        });

        function updateQueryString(page?: number, searchQuery?: SearchQuery) {
            router.push({
                name: 'RecipesMainView',
                query: {
                    searchBy: searchQuery ? searchQuery.type : undefined,
                    searchText: searchQuery ? searchQuery.text : undefined,
                    page: page && page > 1 ? page : undefined,
                },
            });
        }

        function doSearch(page?: number, searchQuery?: SearchQuery) {
            showFilteredRecipes.value =
                !!searchQuery && searchQuery.text.length > 0;

            updateQueryString(page, searchQuery);

            searchRecipes(page);
        }

        function showAllRecipes() {
            updateQueryString();

            setSearch('title', '');

            doSearch();
        }

        function goToPage(page: number) {
            window.scrollTo({ top: 0 });
            if (showFilteredRecipes.value) {
                doSearch(page, searchQuery.value);
                return;
            }
            doSearch(page);
        }

        return {
            ...data,
            doSearch,
            showAllRecipes,
            recipes,
            searchQuery,
            goToPage,
        };
    },
});
</script>

<style scoped>
.search {
    background-color: var(--secondary-color);
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
