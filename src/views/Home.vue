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
            <SearchRecipe :recipes="recipes" />
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
import SearchRecipe from '@/components/SearchRecipe.vue';

type View = 'add' | 'edit' | 'view' | 'search';

export default defineComponent({
    name: 'Home',

    components: {
        CreateRecipe,
        RecipeList,
        SearchRecipe,
    },

    setup() {
        const axios: AxiosStatic | undefined = inject('axios');

        const selectedView = ref<View | null>(null);

        const recipes = ref<Recipe[]>([]);

        const isSearching = ref(false);

        const data = {
            selectedView,
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

        return {
            ...data,
            showAddRecipe,
            showAllRecipes,
            getAllRecipes,
            showSearchRecipe,
        };
    },
});
</script>
