<template>
    <div class="container">
        <ImportRecipe v-if="!recipe" @importedRecipe="importRecipe" />

        <div class="row justify-center">
            <h2
                v-if="importedRecipe"
                class="m-0 p-1 pt-2"
                ref="importedRecipeTitle"
            >
                {{ newRecipe.title }}
            </h2>
            <h3 v-else-if="!recipe">Or create your own recipe</h3>
        </div>
        <div class="row mt-0">
            <input
                v-if="!importedRecipe"
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
                @input="sanitizeTextArea"
                class="w-100"
                placeholder="Description"
                v-model="newRecipe.description"
                :ref="(el) => textAreaRefs.push(el)"
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
                        <div>
                            <CustomNumberInput
                                v-model="ingredient.quantity"
                                :min="0"
                                slim
                                emptyIf0
                            />
                        </div>
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
                        @input="sanitizeTextArea"
                        class="w-80"
                        v-model="step.content"
                        placeholder="Instructions"
                        :ref="(el) => textAreaRefs.push(el)"
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

        <div class="row justify-center mt-2">
            <template v-if="recipe">
                <button class="save p-1" @click="editRecipe" title="Save">
                    Save recipe
                </button>
                <button class="cancel p-1" @click="cancel" title="Cancel">
                    Cancel
                </button>
            </template>
            <button class="save p-1" v-else @click="addRecipe" title="Save">
                Save recipe
            </button>
        </div>
        <div v-if="saveErrors" class="row mt-05 errors">
            {{ saveErrors }}
        </div>
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
import { AxiosError, AxiosStatic } from 'axios';
import {
    computed,
    defineComponent,
    inject,
    nextTick,
    onBeforeUpdate,
    onMounted,
    PropType,
    reactive,
    ref,
} from 'vue';
import {
    EOS_CLOSE_OUTLINED as CloseIcon,
    EOS_ADD_CIRCLE_OUTLINED as AddCircleIcon,
    EOS_ADD_CIRCLE_FILLED as AddCircleFilledIcon,
} from 'eos-icons-vue3';
import CustomNumberInput from '@/components/shared/CustomNumberInput.vue';
import ImportRecipe from '@/components/ImportRecipe.vue';
import router from '@/router';

export default defineComponent({
    name: 'CreateRecipe',

    props: {
        recipe: Object as PropType<Recipe>,
    },

    components: {
        CloseIcon,
        AddCircleIcon,
        AddCircleFilledIcon,
        CustomNumberInput,
        ImportRecipe,
    },

    emits: ['saved', 'cancel'],

    setup(props, { emit }) {
        const axios: AxiosStatic | undefined = inject('axios');

        const newRecipe = reactive<Recipe>(new RecipeClass());
        const saveErrors = ref<string | null>(null);

        const titleInput = ref<HTMLInputElement>();
        const ingredientInput = ref<HTMLElement>();
        const stepInput = ref<HTMLInputElement>();
        const tagInput = ref<HTMLDivElement>();
        const textAreaRefs = ref<HTMLTextAreaElement[]>([]);
        const importedRecipeTitle = ref<HTMLElement>();

        const showImport = ref(false);
        const importedRecipe = ref(false);

        const data = {
            newRecipe,
            titleInput,
            ingredientInput,
            stepInput,
            tagInput,
            showImport,
            textAreaRefs,
            importedRecipe,
            importedRecipeTitle,
        };

        onMounted(() => {
            if (props.recipe) {
                Object.assign(newRecipe, props.recipe);
                titleInput.value?.focus();
                setTimeout(
                    () =>
                        textAreaRefs.value.forEach((textArea) =>
                            resizeTextArea(null, textArea)
                        ),
                    50
                );
            }
        });

        onBeforeUpdate(() => (textAreaRefs.value = []));

        const sanitizedRecipe = computed<Recipe>(() => {
            const sanitized = newRecipe;
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
            newRecipe.ingredients.push(new IngredientClass());

            await nextTick();

            const lastInput = ingredientInput.value?.lastElementChild
                ?.firstElementChild as HTMLInputElement;

            await nextTick();

            lastInput.focus();
        }

        async function addStep() {
            const newStep = new StepClass();
            newStep.position = newRecipe.instructions.length + 1;

            newRecipe.instructions.push(newStep);

            await nextTick();

            const lastInput = stepInput.value?.lastElementChild
                ?.children[1] as HTMLTextAreaElement;

            await nextTick();

            lastInput.focus();
        }

        async function addTag() {
            newRecipe.tags.push(new TagClass());

            await nextTick();

            const lastInput = tagInput.value?.lastElementChild
                ?.firstElementChild as HTMLInputElement;

            await nextTick();

            lastInput.focus();
        }

        function deleteIngredient(index: number) {
            newRecipe.ingredients.splice(index, 1);
        }

        function deleteStep(index: number) {
            newRecipe.instructions.splice(index, 1);
        }

        function deleteTag(index: number) {
            newRecipe.tags.splice(index, 1);
        }

        function addRecipe() {
            saveErrors.value = null;

            if (!isValidRecipe()) {
                return;
            }

            axios
                ?.post(URI.recipes.add, sanitizedRecipe.value)
                .then(() => {
                    router.push({
                        name: 'RecipeList',
                    });
                })
                .catch((err: AxiosError) => {
                    console.error(err.response?.data);
                    saveErrors.value = err.response?.data;
                });
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
            url.searchParams.append('id', newRecipe._id!);

            axios
                ?.put(url.toString(), sanitizedRecipe.value)
                .then(() => {
                    const formattedTitle = sanitizedRecipe.value.title
                        .toLowerCase()
                        .replaceAll(' ', '-');

                    router.push({
                        name: 'Recipe',
                        params: { title: formattedTitle },
                        query: { id: sanitizedRecipe.value._id },
                    });

                    emit('saved', sanitizedRecipe.value);
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

        function resizeTextArea(
            event: Event | null,
            _textArea?: HTMLTextAreaElement
        ) {
            const textArea = event
                ? (event.target as HTMLTextAreaElement)
                : _textArea;

            if (textArea) {
                textArea.style.height = '0';
                textArea.style.height = `${textArea.scrollHeight + 5}px`;
            }
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

        function sanitizeTextArea(event: Event) {
            capitalizeFirstLetter(event);
            resizeTextArea(event);
        }

        async function importRecipe(value: Recipe) {
            Object.assign(newRecipe, value);

            importedRecipe.value = true;

            await nextTick();

            importedRecipeTitle.value?.scrollIntoView({ behavior: 'smooth' });

            textAreaRefs.value.forEach((textArea) =>
                resizeTextArea(null, textArea)
            );
        }

        return {
            ...data,
            addIngredient,
            addStep,
            addTag,
            deleteIngredient,
            deleteStep,
            deleteTag,
            addRecipe,
            editRecipe,
            resizeInput,
            resizeTextArea,
            capitalizeFirstLetter,
            sanitizeTextArea,
            importRecipe,
            saveErrors,
            cancel,
        };
    },
});
</script>

<style scoped>
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

button.import.active {
    background-color: lightgrey;
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
button.save {
    background-color: grey;
    color: white;
    border: 1px solid black;
    border-radius: 2px;
    padding: 0.6rem;
    width: 100%;
    font-size: 1.2rem;
}
button.cancel {
    background-color: lightgrey;
    color: black;
    border: 1px solid black;
    border-radius: 2px;
    padding: 0.6rem;
    width: 20%;
    font-size: 1.2rem;
    margin-left: 2rem;
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

.errors {
    color: red;
    font-size: 0.8rem;
}

@media only screen and (min-width: 767px) {
    button.save {
        width: 350px;
    }
}

@media only screen and (min-width: 769px) {
    .numberInputs {
        width: 40% !important;
        padding-right: 1rem;
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
        width: calc(60% - 1rem) !important;
        height: fit-content;
        background-color: lightgrey;
        margin-left: 1rem;
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

    h3 {
        font-size: 1.5rem;
    }
}
</style>
