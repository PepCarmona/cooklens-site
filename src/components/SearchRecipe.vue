<template>
    <h3>Search by {{ searchType }}</h3>

    <input
        ref="searchInput"
        type="text"
        id="search"
        @input="search($event.target.value)"
    />

    <div>
        <button v-if="searchType !== 'title'" @click="changeSearch('title')">
            Search by title
        </button>
        <button
            v-if="searchType !== 'ingredient'"
            @click="changeSearch('ingredient')"
        >
            Search by ingredient
        </button>
        <button v-if="searchType !== 'tag'" @click="changeSearch('tag')">
            Search by tag
        </button>
    </div>

    <div v-for="recipe in searchResult" :key="recipe._id">
        <div>{{ recipe.title }}</div>
        <div>{{ recipe.description }}</div>
    </div>
</template>

<script lang="ts">
import { Recipe } from '@/api/recipes/recipe';
import { defineComponent, onMounted, PropType, ref } from 'vue';

type SearchType = 'title' | 'ingredient' | 'tag';

export default defineComponent({
    name: 'SearchRecipe',

    props: {
        recipes: {
            type: Array as PropType<Recipe[]>,
            required: true,
        },
    },

    setup(props) {
        const searchResult = ref<Recipe[]>([]);

        const searchType = ref<SearchType>('title');

        const searchInput = ref<HTMLInputElement>();

        onMounted(() => searchInput.value?.focus());

        function searchByTitle(searchQuery: string) {
            searchResult.value = props.recipes.filter(
                (recipe) =>
                    searchQuery.length > 0 &&
                    recipe.title
                        .toLowerCase()
                        .search(searchQuery.toLowerCase()) > -1
            );
        }

        function searchByIngredient(searchQuery: string) {
            searchResult.value = props.recipes.filter(
                (recipe) =>
                    searchQuery.length > 0 &&
                    recipe.ingredients.some(
                        (ingredient) =>
                            ingredient.name
                                .toLowerCase()
                                .search(searchQuery.toLowerCase()) > -1
                    )
            );
        }
        function searchByTag(searchQuery: string) {
            searchResult.value = props.recipes.filter(
                (recipe) =>
                    searchQuery.length > 0 &&
                    recipe.tags.some(
                        (tag) =>
                            tag.value
                                .toLowerCase()
                                .search(searchQuery.toLowerCase()) > -1
                    )
            );
        }

        function search(searchQuery: string) {
            switch (searchType.value) {
                case 'title':
                    searchByTitle(searchQuery);
                    break;
                case 'ingredient':
                    searchByIngredient(searchQuery);
                    break;
                case 'tag':
                    searchByTag(searchQuery);
                    break;
            }
        }

        function changeSearch(type: SearchType) {
            searchType.value = type;
            if (searchInput.value) {
                search(searchInput.value.value);
            }
        }

        return {
            searchResult,
            search,
            searchType,
            changeSearch,
            searchInput,
        };
    },
});
</script>
