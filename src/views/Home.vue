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

            <label for="descriptionInput">Description: </label>
            <textarea v-model="newRecipe.description" id="descriptionInput" />

            <div>
                <label for="prepTimeInput">Preparation Time: </label>
                <input
                    v-model="newRecipe.time.preparation"
                    type="number"
                    min="0"
                    id="prepTimeInput"
                />

                <label for="cookTimeInput">Cooking Time: </label>
                <input
                    v-model="newRecipe.time.cooking"
                    type="number"
                    min="0"
                    id="cookTimeInput"
                />
            </div>

            <label for="servingsInput">Servings: </label>
            <input
                v-model="newRecipe.servings"
                type="number"
                min="0"
                id="servingsInput"
            />

            <div>
                Ingredients:
                <div
                    v-for="(ingredient, index) in newRecipe.ingredients"
                    :key="ingredient._id"
                >
                    <input
                        v-model="ingredient.quantity"
                        type="number"
                        min="0"
                    />
                    <input v-model="ingredient.units" type="text" />
                    <input v-model="ingredient.name" type="text" />
                    <button @click="deleteIngredient(index)">Delete</button>
                </div>
                <button @click="addIngredient">Add</button>
            </div>

            <div>
                Instructions:
                <div
                    v-for="(step, index) in newRecipe.instructions"
                    :key="step._id"
                >
                    Step {{ step.position }} -
                    <textarea v-model="step.content" />
                    <button @click="deleteStep(index)">Delete</button>
                </div>
                <button @click="addStep">Add</button>
            </div>

            <div>
                Tags:
                <div v-for="(tag, index) in newRecipe.tags" :key="tag._id">
                    <input v-model="tag.value" type="text" />
                    <button @click="deleteTag(index)">Delete</button>
                </div>
                <button @click="addTag">Add</button>
            </div>

            <button @click="addRecipe">Save</button>
        </div>
        <div v-if="selectedView === 'view' && !isSearching">
            <h3>Total number of recipes: {{ recipes.length }}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Time</th>
                        <th>Servings</th>
                        <th>Ingredients</th>
                        <th>Instructions</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        @click="openRecipeDetails(index)"
                        v-for="(recipe, index) in recipes"
                        :key="recipe._id"
                    >
                        <td>{{ recipe.title }}</td>
                        <td>{{ recipe.description }}</td>
                        <td>
                            <ul>
                                <li v-if="recipe.time.preparation">
                                    Preparation: {{ recipe.time.preparation }}
                                </li>
                                <li>Cooking: {{ recipe.time.cooking }}</li>
                            </ul>
                        </td>
                        <td>{{ recipe.servings }}</td>
                        <td>
                            <ul>
                                <li
                                    v-for="ingredient in recipe.ingredients"
                                    :key="ingredient._id"
                                >
                                    {{ ingredient.quantity }}
                                    {{ ingredient.units }}
                                    {{ ingredient.name }}
                                </li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li
                                    v-for="step in recipe.instructions"
                                    :key="step._id"
                                >
                                    Step{{ step.position }} - {{ step.content }}
                                </li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li v-for="tag in recipe.tags" :key="tag._id">
                                    {{ tag.value }}
                                </li>
                            </ul>
                        </td>
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
                <div>{{ recipe.description }}</div>
            </div>
        </div>
        <div v-if="selectedView === 'edit'">
            <h3>Edit recipe nº {{ selectedIndex + 1 }}</h3>

            <label for="titleInput">Title: </label>
            <input v-model="selectedRecipe.title" type="text" id="titleInput" />

            <label for="descriptionInput">Description: </label>
            <textarea
                v-model="selectedRecipe.description"
                id="descriptionInput"
            />

            <div>
                <label for="prepTimeInput">Preparation Time: </label>
                <input
                    v-model="selectedRecipe.time.preparation"
                    type="number"
                    min="0"
                    id="prepTimeInput"
                />

                <label for="cookTimeInput">Cooking Time: </label>
                <input
                    v-model="selectedRecipe.time.cooking"
                    type="number"
                    min="0"
                    id="cookTimeInput"
                />
            </div>

            <label for="servingsInput">Servings: </label>
            <input
                v-model="selectedRecipe.servings"
                type="number"
                min="0"
                id="servingsInput"
            />

            <div>
                Ingredients:
                <div
                    v-for="(ingredient, index) in selectedRecipe.ingredients"
                    :key="ingredient._id"
                >
                    <input
                        v-model="ingredient.quantity"
                        type="number"
                        min="0"
                    />
                    <input v-model="ingredient.units" type="text" />
                    <input v-model="ingredient.name" type="text" />
                    <button @click="deleteIngredient(index, selectedRecipe)">
                        Delete
                    </button>
                </div>
                <button @click="addIngredient($event, selectedRecipe)">
                    Add
                </button>
            </div>

            <div>
                Instructions:
                <div
                    v-for="(step, index) in selectedRecipe.instructions"
                    :key="step._id"
                >
                    Step {{ step.position }} -
                    <textarea v-model="step.content" />
                    <button @click="deleteStep(index, selectedRecipe)">
                        Delete
                    </button>
                </div>
                <button @click="addStep($event, selectedRecipe)">Add</button>
            </div>

            <div>
                Tags:
                <div v-for="(tag, index) in selectedRecipe.tags" :key="tag">
                    <input v-model="tag.value" type="text" />
                    <button @click="deleteTag(index, selectedRecipe)">
                        Delete
                    </button>
                </div>
                <button @click="addTag($event, selectedRecipe)">Add</button>
            </div>

            <button @click="editRecipe">Save</button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import {
    IngredientClass,
    Recipe,
    RecipeClass,
    StepClass,
    TagClass,
} from '@/api/recipes/recipe';
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

        const newRecipe = ref<Recipe>(new RecipeClass());

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

        const sanitizedRecipe = computed<Recipe>(() => {
            const sanitized = selectedRecipe.value ?? newRecipe.value;
            sanitized.ingredients = sanitized.ingredients.filter(
                (ingredient) => !!ingredient.quantity || !!ingredient.name
            );
            sanitized.instructions = sanitized.instructions.filter(
                (step) => !!step.content
            );
            sanitized.instructions.map(
                (step, index) => (step.position = index + 1)
            );
            sanitized.tags = sanitized.tags.filter((tag) => !!tag.value);
            return sanitized;
        });

        function showAddRecipe() {
            selectedView.value = selectedView.value === 'add' ? null : 'add';
            newRecipe.value = new RecipeClass();
        }

        function addRecipe() {
            if (sanitizedRecipe.value.title === '') {
                window.alert('Cannot save recipes with empty title');
                return;
            }

            if (
                sanitizedRecipe.value.ingredients.length === 0 ||
                sanitizedRecipe.value.instructions.length === 0
            ) {
                const confirm = window.confirm(
                    'Ingredients and/or instructions are empty. Do you stil want to save this recipe?'
                );
                if (!confirm) {
                    return;
                }
            }

            axios
                ?.post(URI.recipes.add, sanitizedRecipe.value)
                .then(() => {
                    showAllRecipes();
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
                ?.put(url.toString(), sanitizedRecipe.value)
                .then(() => {
                    showAllRecipes();
                })
                .catch((err) => console.error(err));
        }

        function deleteRecipe(index: number) {
            const confirm = window.confirm(
                'Are you sure you want to delete this recipe?'
            );

            if (!confirm) {
                return;
            }

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

        function addIngredient(event: Event, modifyingRecipe?: Recipe) {
            let recipe = modifyingRecipe ?? newRecipe.value;

            recipe.ingredients.push(new IngredientClass());
        }

        function addStep(event: Event, modifyingRecipe?: Recipe) {
            let recipe = modifyingRecipe ?? newRecipe.value;

            const newStep = new StepClass();
            newStep.position = recipe.instructions.length + 1;

            recipe.instructions.push(newStep);
        }

        function addTag(event: Event, modifyingRecipe?: Recipe) {
            let recipe = modifyingRecipe ?? newRecipe.value;

            recipe.tags.push(new TagClass());
        }

        function deleteIngredient(index: number, modifyingRecipe?: Recipe) {
            let recipe = modifyingRecipe ?? newRecipe.value;

            recipe.ingredients.splice(index, 1);
        }

        function deleteStep(index: number, modifyingRecipe?: Recipe) {
            let recipe = modifyingRecipe ?? newRecipe.value;

            recipe.instructions.splice(index, 1);
        }

        function deleteTag(index: number, modifyingRecipe?: Recipe) {
            let recipe = modifyingRecipe ?? newRecipe.value;

            recipe.tags.splice(index, 1);
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
            addIngredient,
            addStep,
            addTag,
            deleteIngredient,
            deleteStep,
            deleteTag,
        };
    },
});
</script>
