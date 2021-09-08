<template>
    <div v-if="showEditRecipe">
        <CreateRecipe
            :recipe="selectedRecipe"
            :index="selectedIndex"
            @saved="refreshRecipeList"
            @cancel="closeEditRecipe"
        />
    </div>
    <div v-else>
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
                        <button @click.stop="openEditRecipe(index)">
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
</template>

<script lang="ts">
import { URI } from '@/api/config';
import { Recipe } from '@/api/recipes/recipe';
import axios from 'axios';
import { computed, defineComponent, PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateRecipe from '@/components/CreateRecipe.vue';

export default defineComponent({
    name: 'RecipeList',

    components: {
        CreateRecipe,
    },

    props: {
        recipes: {
            type: Array as PropType<Recipe[]>,
            required: true,
        },
    },

    emits: ['refresh-recipes'],

    setup(props, { emit }) {
        const router = useRouter();

        const recipeList = ref<Recipe[]>(props.recipes);

        const selectedIndex = ref<number | null>(null);

        const selectedRecipe = computed<Recipe | null>(() => {
            if (selectedIndex.value === null) {
                return null;
            }
            return recipeList.value[selectedIndex.value];
        });

        const showEditRecipe = ref(false);

        const data = {
            selectedIndex,
            selectedRecipe,
            showEditRecipe,
        };

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

        function openEditRecipe(index: number) {
            showEditRecipe.value = true;
            selectedIndex.value = index;
        }

        function closeEditRecipe() {
            showEditRecipe.value = false;
            selectedIndex.value = null;
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
                .then(() => recipeList.value.splice(index, 1))
                .catch((err) => console.error(err));
        }

        function refreshRecipeList() {
            closeEditRecipe();
            emit('refresh-recipes');
        }

        return {
            ...data,
            openRecipeDetails,
            openEditRecipe,
            closeEditRecipe,
            deleteRecipe,
            refreshRecipeList,
        };
    },
});
</script>
