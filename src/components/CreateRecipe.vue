<template>
    <div class="container">
        <div class="row justify-between mt-0">
            <h3 v-if="recipe">Edit recipe nº {{ index + 1 }}</h3>
            <h3 v-else>New recipe</h3>

            <div>
                <button class="p-1" v-if="recipe" @click="editRecipe">
                    <SaveIcon size="l" />
                </button>
                <button class="p-1" v-else @click="addRecipe">
                    <SaveIcon size="l" />
                </button>
                <button class="cancel p-1" @click="cancel">
                    <CloseIcon size="l" />
                </button>
            </div>
        </div>

        <div class="row">
            <input
                class="w-100"
                placeholder="Title"
                ref="titleInput"
                v-model="newRecipe.title"
                type="text"
                id="titleInput"
                required
            />
        </div>

        <div class="row">
            <textarea
                class="w-100"
                placeholder="Description"
                v-model="newRecipe.description"
                id="descriptionInput"
            />
        </div>

        <div class="row recipeTime">
            <div class="row">
                <span class="w-60 text-left">Preparation Time: </span>
                <div class="d-flex w-40 justify-center">
                    <CustomNumberInput
                        :id="'prepTimeInput'"
                        :label="'min'"
                        v-model="newRecipe.time.preparation"
                        :min="0"
                    />
                </div>
            </div>

            <div class="row">
                <span class="w-60 text-left">Cooking Time: </span>
                <div class="d-flex w-40 justify-center">
                    <CustomNumberInput
                        :id="'cookTimeInput'"
                        :label="'min'"
                        v-model="newRecipe.time.cooking"
                        :min="5"
                    />
                </div>
            </div>
        </div>

        <div class="row">
            <span class="w-60 text-left">Servings: </span>
            <div class="d-flex w-40 justify-center">
                <CustomNumberInput
                    :id="'servingsInput'"
                    v-model="newRecipe.servings"
                    :min="1"
                />
            </div>
        </div>

        <div class="row">
            Ingredients:
            <div
                class="row"
                v-for="(ingredient, index) in newRecipe.ingredients"
                :key="ingredient._id"
            >
                <input
                    class="w-10"
                    v-if="index === newRecipe.ingredients.length - 1"
                    ref="ingredientInput"
                    v-model="ingredient.quantity"
                    type="number"
                    min="1"
                />
                <input
                    class="w-10"
                    v-else
                    v-model="ingredient.quantity"
                    type="number"
                    min="1"
                />
                <input
                    class="w-20"
                    v-model="ingredient.units"
                    type="text"
                    placeholder="Units"
                />
                <input
                    class="w-60"
                    v-model="ingredient.name"
                    type="text"
                    placeholder="Ingredient"
                />
                <button class="w-10 close" @click="deleteIngredient(index)">
                    <CloseIcon />
                </button>
            </div>
            <div class="w-100">
                <button class="add mt-1" @click="addIngredient">
                    <AddCircleIcon size="l" />
                </button>
            </div>
        </div>

        <div class="row">
            Instructions:
            <div
                class="row"
                v-for="(step, index) in newRecipe.instructions"
                :key="step._id"
            >
                <div class="w-10">
                    <div class="stepPosition">
                        <span>{{ step.position }}</span>
                    </div>
                </div>
                <textarea
                    class="w-80"
                    v-if="index === newRecipe.instructions.length - 1"
                    ref="stepInput"
                    v-model="step.content"
                    placeholder="Instructions"
                />
                <textarea
                    class="w-80"
                    v-else
                    v-model="step.content"
                    placeholder="Instructions"
                />
                <button class="w-10 close" @click="deleteStep(index)">
                    <CloseIcon />
                </button>
            </div>
            <div class="w-100">
                <button class="add mt-1" @click="addStep">
                    <AddCircleIcon size="l" />
                </button>
            </div>
        </div>

        <div class="row align-center">
            Tags:
            <div v-for="(tag, index) in newRecipe.tags" :key="tag._id">
                <div class="pill">
                    <input
                        @input="resize"
                        v-if="index === newRecipe.tags.length - 1"
                        ref="tagInput"
                        v-model="tag.value"
                        type="text"
                    />
                    <input v-else v-model="tag.value" type="text" />
                    <button class="close" @click="deleteTag(index)">
                        <CloseIcon color="white" />
                    </button>
                </div>
            </div>
            <button class="d-flex align-center add" @click="addTag">
                <AddCircleIcon size="l" />
            </button>
        </div>

        <div class="row"></div>
    </div>
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
import {
    EOS_CLOSE_OUTLINED as CloseIcon,
    EOS_ADD_CIRCLE_OUTLINED as AddCircleIcon,
    EOS_SAVE_OUTLINED as SaveIcon,
} from 'eos-icons-vue3';
import CustomNumberInput from '@/components/shared/CustomNumberInput.vue';

export default defineComponent({
    name: 'CreateRecipe',

    props: {
        recipe: Object as PropType<Recipe>,
        index: Number,
    },

    components: {
        CloseIcon,
        AddCircleIcon,
        SaveIcon,
        CustomNumberInput,
    },

    emits: ['saved', 'cancel'],

    setup(props, { emit }) {
        const axios: AxiosStatic | undefined = inject('axios');

        const newRecipe = ref<Recipe>(new RecipeClass());

        const titleInput = ref<HTMLInputElement>();
        const ingredientInput = ref<HTMLElement>();
        const stepInput = ref<HTMLInputElement>();
        const tagInput = ref<HTMLInputElement>();

        onMounted(() => {
            if (props.recipe) {
                newRecipe.value = props.recipe;
            }
            titleInput.value?.focus();
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

            if (sanitized.time.preparation === 0) {
                sanitized.time.preparation = undefined;
            }

            return sanitized;
        });

        function addIngredient() {
            newRecipe.value.ingredients.push(new IngredientClass());

            setTimeout(() => ingredientInput.value?.focus(), 50);
        }

        function addStep() {
            const newStep = new StepClass();
            newStep.position = newRecipe.value.instructions.length + 1;

            newRecipe.value.instructions.push(newStep);

            setTimeout(() => stepInput.value?.focus(), 50);
        }

        function addTag() {
            newRecipe.value.tags.push(new TagClass());

            setTimeout(() => tagInput.value?.focus(), 50);
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
            if (!isValidRecipe()) {
                return;
            }

            axios
                ?.post(URI.recipes.add, sanitizedRecipe.value)
                .then(() => {
                    emit('saved');
                })
                .catch((err) => console.error(err));
        }

        function isValidRecipe(): boolean {
            if (sanitizedRecipe.value.title === '') {
                alert('Cannot save recipes with empty title');
                return false;
            }

            if (
                sanitizedRecipe.value.ingredients.length === 0 ||
                sanitizedRecipe.value.instructions.length === 0
            ) {
                const confirm = window.confirm(
                    'Ingredients and/or instructions are empty. Do you stil want to save this recipe?'
                );
                return confirm;
            }

            return true;
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

        function resize(event: Event) {
            const input = event.target as HTMLInputElement;
            //TODO - take into account m is bigger and i is smalloer
            input.style.width = `${input.value.length + 1}ch`;
        }

        function min5(event: Event) {
            const input = event.target as HTMLInputElement;

            if (parseInt(input.value) < 5) {
                input.value = '5';
            }
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
            titleInput,
            ingredientInput,
            stepInput,
            tagInput,
            resize,
            min5,
        };
    },
});
</script>

<style scoped>
.container {
    position: relative;
    /* width: 90%; */
    margin-left: 5vw;
    margin-right: 5vw;
    display: flex;
    flex-wrap: wrap;
}

.stepPosition {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 25px;
    background-color: grey;
    border-radius: 50px;
    color: white;
}
.stepPosition span {
    line-height: 0;
}

button.close {
    display: flex;
    align-items: flex-start;
}
button.cancel {
    margin-right: -5vw;
}

.row {
    margin-top: 1rem;
}

.pill {
    display: flex;
    background-color: grey;
    border-radius: 50px;
    padding: 0.5rem;
}
.pill input {
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    width: 1ch;
}
.pill input:focus {
    border-bottom: 1px solid white;
}
</style>
