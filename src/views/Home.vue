<template>
    <div>
        <div>
            <button @click="showAddRecipe">Add recipe</button>
            <button @click="showAllRecipes">View all recipes</button>
            <button @click="showSearchRecipe">Search recipe</button>
        </div>
        <div v-if="isSearching">Loading...</div>
        <div v-if="selectedView === 'add'">
            <h3>New recipe</h3>

            <label for="titleInput">Title: </label>
            <input v-model="newRecipe.title" type="text" id="titleInput" />

            <label for="bodyInput">Description: </label>
            <input v-model="newRecipe.body" type="text" id="bodyInput" />

            <button @click="addRecipe">Save</button>
        </div>
        <div v-if="selectedView === 'view' && !isSearching">
            <h3>Total number of recipes: {{ recipes.length }}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        @click="openRecipeDetails(index)"
                        v-for="(recipe, index) in recipes"
                        :key="recipe._id"
                    >
                        <td>{{ recipe.title }}</td>
                        <td>{{ recipe.body }}</td>
                        <td>
                            <button @click.stop="showEditRecipe(index)">
                                Edit
                            </button>
                            <button @click.stop="deleteRecipe(index)">
                                Delete
                            </button>
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
            <input v-model="selectedRecipe.title" type="text" id="titleInput" />

            <label for="bodyInput">Description: </label>
            <input v-model="selectedRecipe.body" type="text" id="bodyInput" />

            <button @click="editRecipe">Save</button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import { Recipe } from '@/api/recipes/recipe';
import { AxiosResponse, AxiosStatic } from 'axios';
import { URI } from '@/api/config/index';
import { useRouter } from 'vue-router';

type View = 'add' | 'edit' | 'view' | 'search';

export default defineComponent({
    name: 'Home',

    setup() {
        const router = useRouter();
        const axios: AxiosStatic | undefined = inject('axios');

        const selectedView = ref<View | null>(null);
        const searchResult = ref<Recipe[]>([]);
        const selectedIndex = ref<number | null>(null);

        const recipes = ref<Recipe[]>([]);

        const newRecipe = ref<Recipe>({
            title: '',
            body: '',
        });

        const isSearching = ref(false);

        const data = {
            selectedView,
            selectedIndex,
            searchResult,
            recipes,
            newRecipe,
            isSearching,
        };

        onMounted(() => showAllRecipes());

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

        function addRecipe() {
            axios
                ?.post(URI.recipes.add, newRecipe.value)
                .then(() => {
                    recipes.value.push(newRecipe.value);
                    selectedView.value = 'view';
                })
                .catch((err) => console.error(err));
        }

        function showAllRecipes() {
            if (selectedView.value === 'view') {
                selectedView.value = null;
                return;
            }

            isSearching.value = true;

            setTimeout(() => (selectedView.value = 'view'), 100);
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

        function showEditRecipe(index: number) {
            selectedView.value = 'edit';
            selectedIndex.value = index;
        }

        function editRecipe() {
            if (selectedIndex.value === null || selectedRecipe.value === null) {
                console.error('No selected recipe');
                return;
            }

            const url = new URL(URI.recipes.update);
            url.searchParams.append('id', selectedRecipe.value._id!);

            axios
                ?.put(url.toString(), selectedRecipe.value)
                .then(() => {
                    recipes.value.splice(
                        selectedIndex.value!,
                        1,
                        selectedRecipe.value!
                    );
                    selectedView.value = 'view';
                })
                .catch((err) => console.error(err));
        }

        function deleteRecipe(index: number) {
            selectedIndex.value = index;

            if (selectedIndex.value === null || selectedRecipe.value === null) {
                console.error('No selected recipe');
                return;
            }

            const url = new URL(URI.recipes.delete);
            url.searchParams.append('id', selectedRecipe.value._id!);

            axios
                ?.delete(url.toString())
                .then(() => recipes.value.splice(index, 1))
                .catch((err) => console.error(err));
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
            selectedRecipe,
            openRecipeDetails,
        };
    },
});
</script>
