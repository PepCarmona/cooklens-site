<template>
    <h3>Search by title</h3>

    <input
        type="text"
        id="search"
        @input="searchRecipeByTitle($event.target.value)"
    />

    <div v-for="recipe in searchResult" :key="recipe._id">
        <div>{{ recipe.title }}</div>
        <div>{{ recipe.description }}</div>
    </div>
</template>

<script lang="ts">
import { Recipe } from '@/api/recipes/recipe';
import { defineComponent, PropType, ref } from 'vue';

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

        function searchRecipeByTitle(value: string) {
            searchResult.value = props.recipes.filter(
                (recipe) =>
                    value.length > 0 &&
                    recipe.title.substr(0, value.length).toLowerCase() ===
                        value.toLowerCase()
            );
        }

        return {
            searchResult,
            searchRecipeByTitle,
        };
    },
});
</script>
