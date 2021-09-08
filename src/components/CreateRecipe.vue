<template>
    <h3 v-if="recipe">Edit recipe nº {{ index + 1 }}</h3>
    <h3 v-else>New recipe</h3>

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
            <input v-model="ingredient.quantity" type="number" min="0" />
            <input v-model="ingredient.units" type="text" />
            <input v-model="ingredient.name" type="text" />
            <button @click="deleteIngredient(index)">Delete</button>
        </div>
        <button @click="addIngredient">Add</button>
    </div>

    <div>
        Instructions:
        <div v-for="(step, index) in newRecipe.instructions" :key="step._id">
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

    <button v-if="recipe" @click="editRecipe">Save</button>
    <button v-else @click="addRecipe">Save</button>
    <button @click="cancel">Cancel</button>
</template>

<script lang="ts">
import { URI } from '@/api/config';
import {
    IngredientClass,
    Recipe,
    RecipeClass,
    StepClass,
    TagClass,
} from '@/api/recipes/recipe';
import { AxiosStatic } from 'axios';
import {
    computed,
    defineComponent,
    inject,
    onMounted,
    PropType,
    ref,
} from 'vue';

export default defineComponent({
    name: 'CreateRecipe',

    props: {
        recipe: Object as PropType<Recipe>,
        index: Number,
    },

    emits: ['saved', 'cancel'],

    setup(props, { emit }) {
        const axios: AxiosStatic | undefined = inject('axios');

        const newRecipe = ref<Recipe>(new RecipeClass());

        onMounted(() => {
            if (props.recipe) {
                newRecipe.value = props.recipe;
            }
        });

        const sanitizedRecipe = computed<Recipe>(() => {
            const sanitized = newRecipe.value;
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

        function addIngredient() {
            newRecipe.value.ingredients.push(new IngredientClass());
        }

        function addStep() {
            const newStep = new StepClass();
            newStep.position = newRecipe.value.instructions.length + 1;

            newRecipe.value.instructions.push(newStep);
        }

        function addTag() {
            newRecipe.value.tags.push(new TagClass());
        }

        function deleteIngredient(index: number) {
            newRecipe.value.ingredients.splice(index, 1);
        }

        function deleteStep(index: number) {
            newRecipe.value.instructions.splice(index, 1);
        }

        function deleteTag(index: number) {
            newRecipe.value.tags.splice(index, 1);
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
                    emit('saved');
                })
                .catch((err) => console.error(err));
        }

        function editRecipe() {
            const url = new URL(URI.recipes.update);
            url.searchParams.append('id', newRecipe.value._id!);

            axios
                ?.put(url.toString(), sanitizedRecipe.value)
                .then(() => {
                    emit('saved');
                })
                .catch((err) => console.error(err));
        }

        function cancel() {
            emit('cancel');
        }

        return {
            newRecipe,
            addIngredient,
            addStep,
            addTag,
            deleteIngredient,
            deleteStep,
            deleteTag,
            addRecipe,
            editRecipe,
            cancel,
        };
    },
});
</script>
