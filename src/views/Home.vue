<template>
    <div>
        <div>
            <button @click="showAddRecipe">Add recipe</button>
            <button @click="showAllRecipes">View all recipes</button>
            <button @click="showSearchRecipe">Search recipe</button>
        </div>
        <div v-if="selectedView === 'add'">
            <CreateRecipe
                @saved="showAllRecipes"
                @cancel="selectedView = 'view'"
            />
        </div>
        <div v-if="selectedView === 'view'">
            <div v-if="isSearching">Loading...</div>
            <RecipeList
                v-else
                :recipes="recipes"
                @refresh-recipes="getAllRecipes"
            />
        </div>
        <div v-if="selectedView === 'search'">
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
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue';
import { Recipe } from '@/api/recipes/recipe';
import { AxiosResponse, AxiosStatic } from 'axios';
import { URI } from '@/api/config/index';
import CreateRecipe from '@/components/CreateRecipe.vue';
import RecipeList from '@/components/RecipeList.vue';

type View = 'add' | 'edit' | 'view' | 'search';

export default defineComponent({
    name: 'Home',

    components: {
        CreateRecipe,
        RecipeList,
    },

    setup() {
        const axios: AxiosStatic | undefined = inject('axios');

        const selectedView = ref<View | null>(null);
        const searchResult = ref<Recipe[]>([]);

        const recipes = ref<Recipe[]>([]);

        const isSearching = ref(false);

        const data = {
            selectedView,
            searchResult,
            recipes,
            isSearching,
        };

        onMounted(() => showAllRecipes());

        function showAddRecipe() {
            selectedView.value = selectedView.value === 'add' ? null : 'add';
        }

        function showAllRecipes() {
            if (selectedView.value === 'view') {
                selectedView.value = null;
                return;
            }

            getAllRecipes();

            selectedView.value = 'view';
        }

        function getAllRecipes() {
            isSearching.value = true;

            axios
                ?.get<Recipe[]>(URI.recipes.get)
                .then((response: AxiosResponse<Recipe[]>) => {
                    recipes.value = response.data;
                })
                .catch((err) => console.error(err))
                .finally(() => (isSearching.value = false));
        }

        function showSearchRecipe() {
            selectedView.value =
                selectedView.value === 'search' ? null : 'search';
        }

        function searchRecipeByTitle(value: string) {
            searchResult.value = recipes.value.filter(
                (recipe) =>
                    value.length > 0 &&
                    recipe.title.substr(0, value.length).toLowerCase() ===
                        value.toLowerCase()
            );
        }

        return {
            ...data,
            showAddRecipe,
            showAllRecipes,
            getAllRecipes,
            showSearchRecipe,
            searchRecipeByTitle,
        };
    },
});
</script>
