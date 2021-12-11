<template>
    <div :class="{ embedded }">
        <div class="search">
            <SearchRecipe
                @doSearch="doSearch($event.page, $event.searchQuery)"
                @back="$emit('back')"
                embedded
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

import SearchRecipe from '@/components/recipes/SearchRecipe.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';

import useRecipeState, { SearchQuery } from '@/store/recipe-state';

export default defineComponent({
    name: 'RecipesMainComponent',

    props: {
        embedded: Boolean,
        showActions: Boolean,
    },

    components: {
        SearchRecipe,
        RecipeList,
    },

    emits: ['back', 'select-recipe', 'see-more-info'],

    setup() {
        const { isLoading, recipes, searchRecipes, setSearch, searchQuery } =
            useRecipeState();

        const showFilteredRecipes = ref(false);

        // const cachedRecipes = ref<Recipe[]>([]);

        const data = {
            isLoading,
            showFilteredRecipes,
        };

        onMounted(() => {
            doSearch();
        });

        function doSearch(page?: number, searchQuery?: SearchQuery) {
            showFilteredRecipes.value =
                !!searchQuery && searchQuery.text.length > 0;

            searchRecipes(page);
        }

        function showAllRecipes() {
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
