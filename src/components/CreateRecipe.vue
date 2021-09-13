<template>
    <div class="container">
        <div class="row justify-between mt-0">
            <h3 v-if="recipe">Edit recipe nº {{ index + 1 }}</h3>
            <h3 v-else>New recipe</h3>

            <div class="d-flex">
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
                @input="capitalizeFirstLetter"
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
                @input="capitalizeFirstLetter"
                @keyup="resizeTextArea"
                @keypress="resizeTextArea"
                class="w-100"
                placeholder="Description"
                v-model="newRecipe.description"
                id="descriptionInput"
            />
        </div>

        <div class="row">
            <div class="row numberInputs">
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
            </div>

            <div class="row ingredients">
                Ingredients:
                <div class="row mt-0" ref="ingredientInput">
                    <div
                        class="row ingredient"
                        v-for="(ingredient, index) in newRecipe.ingredients"
                        :key="ingredient._id"
                    >
                        <input
                            class="w-10"
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
                        <div class="w-10 d-flex-center">
                            <button
                                class="close"
                                @click="deleteIngredient(index)"
                            >
                                <CloseIcon class="default" />
                                <CloseIcon class="hover" color="red" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="row d-flex-center">
                    <button class="add" @click="addIngredient">
                        <AddCircleIcon class="default" size="l" />
                        <AddCircleFilledIcon class="hover" size="l" />
                    </button>
                </div>
            </div>
        </div>

        <div class="row steps">
            Instructions:
            <div class="row mt-0" ref="stepInput">
                <div
                    class="row step"
                    v-for="(step, index) in newRecipe.instructions"
                    :key="step._id"
                >
                    <div class="w-10 d-flex justify-center">
                        <div class="stepPosition">
                            {{ step.position }}
                        </div>
                    </div>
                    <textarea
                        @input="capitalizeFirstLetter"
                        @keyup="resizeTextArea"
                        @keypress="resizeTextArea"
                        class="w-80"
                        v-model="step.content"
                        placeholder="Instructions"
                    />
                    <div class="w-10 d-flex-center">
                        <button class="close" @click="deleteStep(index)">
                            <CloseIcon class="default" />
                            <CloseIcon class="hover" color="red" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="row d-flex-center">
                <button class="add" @click="addStep">
                    <AddCircleIcon class="default" size="l" />
                    <AddCircleFilledIcon class="hover" size="l" />
                </button>
            </div>
        </div>

        <div class="row align-center tags">
            Tags:
            <div class="d-flex" ref="tagInput">
                <div
                    v-for="(tag, index) in newRecipe.tags"
                    :key="tag._id"
                    class="pill ml-05"
                >
                    <input
                        @input="resizeInput"
                        v-model="tag.value"
                        type="text"
                    />
                    <button class="close" @click="deleteTag(index)">
                        <CloseIcon class="default" color="white" />
                        <CloseIcon class="hover" color="red" />
                    </button>
                </div>
            </div>
            <div class="ml-05">
                <button class="add" @click="addTag">
                    <AddCircleIcon class="default" size="l" />
                    <AddCircleFilledIcon class="hover" size="l" />
                </button>
            </div>
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
    nextTick,
    onMounted,
    PropType,
    ref,
} from 'vue';
import {
    EOS_CLOSE_OUTLINED as CloseIcon,
    EOS_ADD_CIRCLE_OUTLINED as AddCircleIcon,
    EOS_ADD_CIRCLE_FILLED as AddCircleFilledIcon,
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
        AddCircleFilledIcon,
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
        const tagInput = ref<HTMLDivElement>();

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

        async function addIngredient() {
            newRecipe.value.ingredients.push(new IngredientClass());

            await nextTick();

            const lastInput = ingredientInput.value?.lastElementChild
                ?.firstElementChild as HTMLInputElement;

            await nextTick();

            lastInput.focus();
        }

        async function addStep() {
            const newStep = new StepClass();
            newStep.position = newRecipe.value.instructions.length + 1;

            newRecipe.value.instructions.push(newStep);

            await nextTick();

            const lastInput = stepInput.value?.lastElementChild
                ?.children[1] as HTMLTextAreaElement;

            await nextTick();

            lastInput.focus();
        }

        async function addTag() {
            newRecipe.value.tags.push(new TagClass());

            await nextTick();

            const lastInput = tagInput.value?.lastElementChild
                ?.firstElementChild as HTMLInputElement;

            await nextTick();

            lastInput.focus();
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

        function resizeInput(event: Event) {
            const input = event.target as HTMLInputElement;
            //TODO - take into account m is bigger and i is smalloer
            input.style.width = `${input.value.length + 1}ch`;
        }

        function resizeTextArea(event: Event) {
            const textArea = event.target as HTMLTextAreaElement;

            textArea.style.height = '0';
            textArea.style.height = `${textArea.scrollHeight + 5}px`;
        }

        function capitalizeFirstLetter(event: Event) {
            const input = event.target as
                | HTMLInputElement
                | HTMLTextAreaElement;

            const firstLetter = input.value.charAt(0);

            if (firstLetter === firstLetter.toLowerCase()) {
                input.value = firstLetter.toUpperCase() + input.value.slice(1);
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
            resizeInput,
            resizeTextArea,
            capitalizeFirstLetter,
        };
    },
});
</script>

<style scoped>
.container {
    position: relative;
    margin-left: 5vw;
    margin-right: 5vw;
    display: flex;
    flex-wrap: wrap;
}

.stepPosition {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 20px;
    line-height: 20px;
    background-color: grey;
    border-radius: 50px;
    color: white;
    font-size: 0.8rem;
}

button.close {
    display: flex;
    align-items: flex-start;
    justify-content: left;
    height: 100%;
    margin-left: 0.5rem;
}
button.close:hover,
button.close:focus {
    background-color: transparent;
}
button.close > .hover {
    display: none;
}
button.close:hover > .default,
button.close:focus > .default {
    display: none;
}
button.close:hover > .hover,
button.close:focus > .hover {
    display: flex;
}

button.cancel {
    margin-right: -1rem;
}

button.add {
    border-radius: 50px;
}
button.add:hover,
button.add:focus {
    background-color: transparent;
}
button.add > .hover {
    display: none;
}
button.add:hover > .default,
button.add:focus > .default {
    display: none;
}
button.add:hover > .hover,
button.add:focus > .hover {
    display: flex;
}

.row {
    margin-top: 1rem;
}

.ingredient,
.step {
    flex-wrap: nowrap;
}

.ingredient > input:first-child {
    width: 15%;
}
.ingredient > input:nth-child(2) {
    width: 15%;
}
.ingredient > input:nth-child(3) {
    width: 70%;
}
.ingredient > div:last-child,
.step > div:last-child {
    width: fit-content !important;
}
.step > textarea {
    width: 100%;
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

@media only screen and (min-width: 769px) {
    .numberInputs {
        width: 40% !important;
        padding: 0.5rem;
        height: fit-content;
    }
    .numberInputs .row {
        height: fit-content;
    }
    .recipeTime {
        margin-top: 0 !important;
    }
    .recipeTime > .row:first-child {
        margin-top: 0 !important;
    }

    .ingredients {
        width: 60% !important;
        height: fit-content;
        background-color: lightgrey;
    }
    .ingredients .row {
        height: fit-content;
    }

    .ingredient:first-child {
        margin-top: 0.5rem !important;
    }

    .steps,
    .ingredients,
    .tags {
        padding: 0.5rem;
    }
}
</style>
