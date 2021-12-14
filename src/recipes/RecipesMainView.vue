<template>
    <div :class="{ embedded }">
        <div class="search">
            <SearchRecipe
                @doSearch="doSearch($event.page, $event.searchQuery)"
                @back="$emit('back')"
                :embedded="embedded"
            />
        </div>
        <div v-if="isLoading">Loading...</div>
        <RecipeList
            v-else
            :recipes="recipes"
            :showFilteredRecipes="showFilteredRecipes && !isLoading"
            @showAllRecipes="showAllRecipes"
            @goToPage="goToPage"
            :slim="embedded"
            :showActions="showActions"
            @see-more-info="$emit('see-more-info', $event)"
            @select-recipe="$emit('select-recipe', $event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import SearchRecipe from '@/recipes/SearchRecipe.vue';
import RecipeList from '@/recipes/RecipeList.vue';

import useRecipeState from '@/recipes/state/RecipeState';
import { SearchType, SearchQuery } from '@/recipes/types/RecipeTypes';

export default defineComponent({
    name: 'RecipesMainView',

    props: {
        embedded: Boolean,
        showActions: Boolean,
    },

    components: {
        SearchRecipe,
        RecipeList,
    },

    emits: ['back', 'select-recipe', 'see-more-info'],

    setup(props) {
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
            if (props.embedded) {
                showAllRecipes();
                return;
            }

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
            if (props.embedded) {
                return;
            }

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
div:not(.embedded) > .search {
    padding: 1rem;
    padding-top: calc(2rem + 50px);
    margin-top: -50px;
}
.embedded > .search {
    margin-bottom: 1.5rem;
}

@media only screen and (min-width: 769px) {
    .search {
        padding-top: calc(2rem + 60px);
        margin-top: -60px;
    }
}
</style>
