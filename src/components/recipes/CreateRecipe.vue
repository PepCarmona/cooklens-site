<template>
    <div>
        <div class="header">
            <span class="back" @click="handleGoBack">
                <i class="las la-angle-left"></i>
            </span>
            <span class="title">Add Recipe</span>
            <div class="actions">
                <span v-if="showRecipeForm" class="save">Save</span>
                <span
                    v-if="isEditting"
                    class="delete"
                    @click="deleteRecipe"
                    title="Delete"
                >
                    Delete
                </span>
            </div>
        </div>
        <div v-if="showRecipeForm" class="tabs">
            <button
                @click="showTab = 'introduction'"
                :class="{ selected: showTab === 'introduction' }"
            >
                Intro
            </button>
            <button
                @click="showTab = 'ingredients'"
                :class="{ selected: showTab === 'ingredients' }"
            >
                Ingredients
            </button>
            <button
                @click="showTab = 'steps'"
                :class="{ selected: showTab === 'steps' }"
            >
                Steps
            </button>
        </div>
        <div class="container" :class="{ thin }">
            <template v-if="showRecipeForm">
                <template v-if="showTab === 'introduction'">
                    <div class="row justify-center">
                        <h2
                            v-if="importedRecipe"
                            class="m-0 p-1 pt-2"
                            ref="importedRecipeTitle"
                        >
                            {{ newRecipe.title }}
                        </h2>
                    </div>
                    <div class="row mt-0">
                        <CustomInput
                            v-if="!importedRecipe"
                            class="w-100"
                            label="Title"
                            ref="titleInput"
                            v-model="newRecipe.title"
                            type="text"
                            id="title"
                            required
                            autocomplete="off"
                        />
                    </div>

                    <div class="row">
                        <CustomInput
                            type="textarea"
                            class="w-100"
                            label="Description"
                            id="descriptionInput"
                            v-model="newRecipe.description"
                            :ref="(el) => textAreaRefs.push(el)"
                        />
                    </div>

                    <div class="row">
                        <img
                            v-for="image in newRecipe.images"
                            :key="image"
                            :src="image"
                            height="300"
                        />
                    </div>
                    <div class="row numberInputs">
                        <div class="row recipeTime">
                            <div class="row">
                                <span class="w-60 text-left"
                                    >Preparation Time:
                                </span>
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
                                <span class="w-60 text-left"
                                    >Cooking Time:
                                </span>
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
                    <div class="row align-center tags">
                        Tags:
                        <div class="d-flex" ref="tagInput">
                            <div
                                v-for="(tag, index) in newRecipe.tags"
                                :key="tag._id"
                                class="pill ml-05"
                            >
                                <CustomInput
                                    type="text"
                                    v-model="tag.value"
                                    autoResize
                                />
                                <button
                                    class="close tag"
                                    @click="deleteTag(index)"
                                >
                                    <i class="las la-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="ml-05">
                            <button class="add" @click="addTag">
                                <i class="las la-plus-circle"></i>
                            </button>
                        </div>
                    </div>
                </template>

                <template v-if="showTab === 'ingredients'">
                    <div class="row ingredients">
                        <div class="row mt-0" ref="ingredientInput">
                            <div
                                class="row ingredient"
                                v-for="(
                                    ingredient, index
                                ) in newRecipe.ingredients"
                                :key="ingredient._id"
                            >
                                <div class="handle">
                                    <i class="las la-grip-lines"></i>
                                </div>
                                <div v-if="showAdvancedIngredientsForm">
                                    <CustomNumberInput
                                        v-model="ingredient.quantity"
                                        :min="0"
                                        slim
                                        emptyIf0
                                    />
                                </div>
                                <CustomInput
                                    v-if="showAdvancedIngredientsForm"
                                    class="w-20"
                                    v-model="ingredient.units"
                                    type="text"
                                    label="Units"
                                />
                                <CustomInput
                                    class="ingredient-query"
                                    v-model="ingredient.name"
                                    type="text"
                                    label="Ingredient"
                                />
                                <div class="w-10 delete">
                                    <button
                                        class="close"
                                        @click="deleteIngredient(index)"
                                    >
                                        <i class="las la-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="toggleAdvancedForm">
                                <span
                                    v-if="showAdvancedIngredientsForm"
                                    @click="showAdvancedIngredientsForm = false"
                                >
                                    See simple form
                                </span>
                                <span
                                    v-else
                                    @click="showAdvancedIngredientsForm = true"
                                >
                                    See advanced form
                                </span>
                            </div>
                        </div>

                        <button class="add" @click="addIngredient">
                            <i class="las la-plus"></i>
                        </button>
                    </div>
                </template>

                <template v-if="showTab === 'steps'">
                    <div class="row steps">
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
                                <CustomInput
                                    type="textarea"
                                    class="w-80"
                                    v-model="step.content"
                                    :id="`instructionInput-${step.position}`"
                                    :ref="(el) => textAreaRefs.push(el)"
                                />
                                <div class="w-10 delete">
                                    <button
                                        class="close"
                                        @click="deleteStep(index)"
                                    >
                                        <i class="las la-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button class="add" @click="addStep">
                            <i class="las la-plus-circle"></i>
                        </button>
                    </div>
                </template>

                <div class="row justify-center mt-2">
                    <template v-if="isEditting">
                        <!-- <button class="save m-1" @click="editRecipe" title="Save">
                        Save recipe
                    </button>
                    <button class="cancel m-1" @click="cancel" title="Cancel">
                        Cancel
                    </button> -->
                    </template>
                    <!-- <button class="save" v-else @click="addRecipe" title="Save">
                    Save recipe
                </button> -->
                </div>
                <div v-if="saveErrors" class="row mt-05 errors">
                    {{ saveErrors }}
                </div>
            </template>
            <template v-else>
                <ImportRecipe :thin="!!thin" @importedRecipe="importRecipe" />

                <span class="openRecipeForm" @click="showRecipeForm = true">
                    or use our recipe form
                </span>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import {
    IngredientClass,
    Recipe,
    RecipeClass,
    StepClass,
    TagClass,
} from '@/api/types/recipe';
import { AxiosError } from 'axios';
import {
    computed,
    defineComponent,
    nextTick,
    onBeforeUpdate,
    onMounted,
    reactive,
    ref,
} from 'vue';
import CustomNumberInput from '@/components/shared/CustomNumberInput.vue';
import CustomInput from '@/components/shared/CustomInput.vue';
import ImportRecipe from '@/components/recipes/ImportRecipe.vue';
import useRecipeState from '@/store/recipe-state';
import { useRoute, useRouter } from 'vue-router';

type Tab = 'introduction' | 'ingredients' | 'steps';

export default defineComponent({
    name: 'CreateRecipe',

    props: {
        thin: Boolean,
    },

    components: {
        CustomNumberInput,
        ImportRecipe,
        CustomInput,
    },

    emits: ['newRecipeSaved'],

    setup(_, { emit }) {
        const route = useRoute();
        const router = useRouter();

        const { recipe } = useRecipeState();

        const newRecipe = reactive<Recipe>(new RecipeClass());
        const saveErrors = ref<string | null>(null);

        const titleInput = ref<HTMLInputElement>();
        const ingredientInput = ref<HTMLElement>();
        const stepInput = ref<HTMLInputElement>();
        const tagInput = ref<HTMLDivElement>();
        const importedRecipeTitle = ref<HTMLElement>();

        const showImport = ref(false);
        const importedRecipe = ref(false);

        const isEditting = computed(() => !!route.query.edit);
        const showRecipeForm = ref(false);
        const showAdvancedIngredientsForm = ref(false);
        const showTab = ref<Tab>('introduction');

        const textAreaRefs = ref<InstanceType<typeof CustomInput>[]>([]);

        const data = {
            newRecipe,
            titleInput,
            ingredientInput,
            stepInput,
            tagInput,
            showImport,
            importedRecipe,
            importedRecipeTitle,
            isEditting,
            showRecipeForm,
            showAdvancedIngredientsForm,
            showTab,
        };

        onMounted(() => {
            if (route.query.edit) {
                Object.assign(newRecipe, recipe.value);
                showRecipeForm.value = true;
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

            useRecipeState()
                .addRecipe(sanitizedRecipe.value)
                .then((savedRecipe) => {
                    router.push({
                        name: 'RecipesMainView',
                    });

                    emit('newRecipeSaved', savedRecipe);
                })
                .catch((err: AxiosError) => {
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
            useRecipeState()
                .editRecipe(sanitizedRecipe.value)
                .then((editedRecipe) => {
                    const formattedTitle = editedRecipe.title
                        .toLowerCase()
                        .replaceAll(' ', '-');

                    router.push({
                        name: 'RecipeDetails',
                        params: { title: formattedTitle },
                        query: { id: editedRecipe._id },
                    });

                    if (route.query.edit) {
                        router.back();
                    }
                });
        }

        function cancel() {
            router.back();
        }

        function deleteRecipe() {
            if (route.query.edit) {
                useRecipeState()
                    .deleteRecipe(recipe.value)
                    .then(() =>
                        router.push({
                            name: 'RecipesMainView',
                        })
                    );
                return;
            }
        }

        async function importRecipe(value: Recipe) {
            Object.assign(newRecipe, value);

            importedRecipe.value = true;

            await nextTick();

            importedRecipeTitle.value?.scrollIntoView({ behavior: 'smooth' });

            textAreaRefs.value.forEach((textArea) =>
                textArea.resizeTextArea(null)
            );
        }

        function handleGoBack() {
            if (isEditting.value || !showRecipeForm.value) {
                router.back();
            } else {
                showRecipeForm.value = false;
            }
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
            deleteRecipe,
            importRecipe,
            saveErrors,
            cancel,
            textAreaRefs,
            handleGoBack,
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
    background-color: var(--main-color);
    border-radius: 50px;
    color: var(--main-light-color);
    font-size: 0.8rem;
}

button.import.active {
    background-color: var(--secondary-color);
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
button.close.tag > i {
    color: white;
}
button.close:hover > i,
button.close:focus > i {
    color: var(--error-color);
}
/* button.save {
    background-color: var(--main-color);
    color: var(--main-light-color);
    border: 1px solid var(--main-dark-color);
    border-radius: 2px;
    padding: 0.6rem;
    width: 100%;
    font-size: 1.2rem;
} */
button.cancel {
    background-color: var(--secondary-color);
    color: var(--main-dark-color);
    border: 1px solid var(--main-dark-color);
    border-radius: 2px;
    padding: 0.6rem;
    width: 20%;
    font-size: 1.2rem;
    margin-left: 2rem;
}

.row {
    margin-top: 1rem;
}

.ingredients {
    padding-bottom: 50px;
}

.ingredients .add {
    background-color: var(--accent-color);
    height: 50px;
    width: 50px;
    border-radius: 50px;
    position: fixed;
    right: 1rem;
    bottom: calc(1rem + 55px);
}
.ingredients .add > i {
    color: white;
}

.ingredient,
.step {
    flex-wrap: nowrap;
}
.ingredient {
    align-items: flex-end;
}
.ingredient-query {
    flex-grow: 1;
}
.ingredient > .delete,
.step > .delete {
    width: fit-content !important;
}

.ingredient > .delete {
    padding-bottom: 5px;
}
.toggleAdvancedForm {
    margin-left: auto;
    margin-right: 10%;
    cursor: pointer;
}
.toggleAdvancedForm > span {
    color: var(--grey-600);
    text-decoration: underline;
    font-size: 13px;
}
.handle {
    padding-right: 1rem;
    padding-bottom: 4px;
}
.handle > i {
    font-size: 16px;
    cursor: grab;
}

.step > textarea {
    width: 100%;
}

.pill {
    display: flex;
    background-color: var(--main-color);
    border-radius: 50px;
    padding: 0.5rem;
}

.errors {
    color: var(--error-color);
    font-size: 0.8rem;
}

.header {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    line-height: 60px;
    padding: 1rem;
}
.header > .back,
.header > .actions {
    position: absolute;
}
.header > .back {
    left: 1rem;
}
.header > .back > i {
    font-size: 20px;
}
.header > .actions {
    display: flex;
    width: fit-content;
    right: 1rem;
}
.header .save,
.header .delete {
    font-family: var(--main-text-font);
    font-size: 16px;
}
.header .save {
    color: var(--accent-color);
}
.header .delete {
    color: var(--error-color);
    margin-left: 0.5rem;
}
.header > .title {
    font-family: var(--title-font);
    font-size: 20px;
}

.tabs {
    width: 100%;
    padding: 0 0.5rem;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 1px 0px var(--shadow-color);
}
.tabs > button {
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    width: 100%;
    color: var(--grey-800);
}
.tabs > button:first-child {
    margin-right: 0;
}
.tabs > button:last-child {
    margin-left: 0;
}
.tabs > button.selected {
    background-color: var(--accent-color);
    border-radius: 50px;
    color: var(--inverted-text-color);
}

@media only screen and (max-width: 768px) {
    .container {
        width: calc(100% - 2rem);
    }
}

@media only screen and (min-width: 769px) {
    .container:not(.thin) .numberInputs {
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

    .container:not(.thin) .ingredients {
        width: calc(60% - 1rem) !important;
        height: fit-content;
        background-color: var(--secondary-color);
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

    .tabs {
        padding-left: 10%;
        padding-right: 10%;
    }
    .tabs > button {
        margin-left: 4rem;
        margin-right: 4rem;
    }
}
</style>
