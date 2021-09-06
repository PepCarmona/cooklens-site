<template>
    <div>
        <div>
            <button @click="showAddRecipe">Add recipe</button>
            <button @click="showAllRecipes">View all recipes</button>
            <button @click="showSearchRecipe">Search recipe</button>
        </div>
        <div v-if="selectedView === 'add'">
            <h3>New recipe</h3>

            <label for="titleInput">Title: </label>
            <input v-model="newRecipe.title" type="text" id="titleInput" />

            <label for="bodyInput">Description: </label>
            <input v-model="newRecipe.body" type="text" id="bodyInput" />

            <button @click="addRecipe">Save</button>
        </div>
        <div v-if="selectedView === 'view'">
            <h3>Total number of recipes: {{ recipes.length }}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(recipe, index) in recipes" :key="recipe._id">
                        <td>{{ recipe.title }}</td>
                        <td>{{ recipe.body }}</td>
                        <td>
                            <button @click="showEditRecipe(index)">Edit</button>
                            <button @click="deleteRecipe(index)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
                <div>{{ recipe.body }}</div>
            </div>
        </div>
        <div v-if="selectedView === 'edit'">
            <h3>Edit recipe nº {{ selectedIndex + 1 }}</h3>

            <label for="titleInput">Title: </label>
            <input v-model="newRecipe.title" type="text" id="titleInput" />

            <label for="bodyInput">Description: </label>
            <input v-model="newRecipe.body" type="text" id="bodyInput" />

            <button @click="editRecipe(selectedIndex)">Save</button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue';
import { Recipe, FakeRecipes } from '@/api/recipes/recipe';
import { AxiosResponse, AxiosStatic } from 'axios';
import { URI } from '@/api/config/index';

type View = 'add' | 'edit' | 'view' | 'search';

export default defineComponent({
    setup() {
        const axios: AxiosStatic | undefined = inject('axios');

        const selectedView = ref<View | null>(null);
        const searchResult = ref<Recipe[]>([]);
        const selectedIndex = ref<number | null>(null);

        const newRecipe = ref<Recipe>({
            title: '',
            body: '',
        });

        const recipes = ref<Recipe[]>([]);

        const data = {
            selectedView,
            recipes,
            searchResult,
            newRecipe,
            selectedIndex,
        };

        const selectedRecipe = computed<Recipe | null>(() => {
            if (selectedIndex.value === null) {
                return null;
            }
            return recipes.value[selectedIndex.value];
        });

        function showAddRecipe() {
            selectedView.value = selectedView.value === 'add' ? null : 'add';
            newRecipe.value = {
                title: '',
                body: '',
            };
        }

        // function getAllRecipes(): Promise<AxiosResponse<Recipe[]>> | null {
        //     if (!axios) {
        //         return null;
        //     }
        //     return axios.get<Recipe[]>(URI.recipes.get);
        // }

        // function getRecipeById(id: string): Promise<Recipe | null> {
        //     return axios.get(`${URI.recipes.get}?id=${id}`);
        // }

        function showAllRecipes() {
            selectedView.value = selectedView.value === 'view' ? null : 'view';
            if (axios) {
                axios
                    .get<Recipe[]>(URI.recipes.get)
                    .then(
                        (response: AxiosResponse<Recipe[]>) =>
                            (recipes.value = response.data)
                    );
            }
        }

        function showSearchRecipe() {
            selectedView.value =
                selectedView.value === 'search' ? null : 'search';
        }

        function searchRecipeByTitle(value: string) {
            searchResult.value = recipes.value.filter(
                (recipe) => recipe.title === value
            );
        }

        function addRecipe() {
            recipes.value.push(newRecipe.value);
            selectedView.value = 'view';
        }

        function showEditRecipe(index: number) {
            selectedView.value = 'edit';
            selectedIndex.value = index;
            if (selectedRecipe.value !== null) {
                newRecipe.value = selectedRecipe.value;
            }
        }

        function editRecipe(index: number) {
            recipes.value.splice(index, 1, newRecipe.value);
            selectedView.value = 'view';
        }

        function deleteRecipe(index: number) {
            recipes.value.splice(index, 1);
        }

        return {
            ...data,
            showAddRecipe,
            showAllRecipes,
            showSearchRecipe,
            searchRecipeByTitle,
            addRecipe,
            showEditRecipe,
            editRecipe,
            deleteRecipe,
        };
    },
});
</script>
