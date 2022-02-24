<template>
	<div>
		<PageHeader @go-back="handleGoBack" :class="{ embedded }">
			<template v-slot:title>Add Recipe</template>
			<template v-slot:actions>
				<Button
					v-if="showRecipeForm && newRecipe.isIntegrated"
					class="save-recipe"
					@click="saveRecipe"
				>
					Save
				</Button>
				<Button
					v-if="isEditting"
					class="delete-recipe"
					@click="deleteRecipe"
					title="Delete"
				>
					Delete
				</Button>
			</template>
			<template v-slot:second-row>
				<div
					v-if="showRecipeForm && (newRecipe.isIntegrated || !newRecipe.url)"
					class="tabs"
				>
					<Button
						@click="showTab = 'introduction'"
						:class="{ selected: showTab === 'introduction' }"
					>
						Intro
					</Button>
					<Button
						@click="showTab = 'ingredients'"
						:class="{ selected: showTab === 'ingredients' }"
					>
						Ingredients
					</Button>
					<Button
						@click="showTab = 'steps'"
						:class="{ selected: showTab === 'steps' }"
					>
						Steps
					</Button>
				</div>
			</template>
		</PageHeader>
		<div class="container" :class="{ thin: embedded, embedded }">
			<template v-if="showRecipeForm">
				<template v-if="newRecipe.url && !newRecipe.isIntegrated">
					<div class="not-integrated-notice">
						Since this website is not integrated yet, this recipe will be
						imported as a link to the provided url
					</div>
					<CustomInput
						class="w-100"
						label="Title"
						ref="titleInput"
						v-model="newRecipe.title"
						type="text"
						id="title"
						:autoComplete="'off'"
						required
					/>
					<Button class="save-link" @click="saveRecipe" primary>
						<i class="las la-link"></i>
						<span>Save as link</span>
					</Button>
				</template>
				<template v-else>
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
								:autoComplete="'off'"
								required
							/>
						</div>

						<div class="row">
							<CustomNumberInput
								id="prepTime"
								class="w-100"
								label="Preparation Time (min)"
								v-model="newRecipe.time.preparation"
								:min="0"
								emptyIf0
							/>
						</div>

						<div class="row">
							<CustomNumberInput
								id="cookTime"
								class="w-100"
								label="Cooking Time (min)"
								v-model="newRecipe.time.cooking"
								:min="5"
							/>
						</div>

						<div class="row">
							<template v-if="newRecipe.images && newRecipe.images.length > 0">
								<div
									class="edit-images"
									v-for="image in newRecipe.images"
									:key="image"
									:style="`background-image: url(${image});`"
								>
									<Button>
										<i class="las la-pen"></i>
									</Button>
								</div>
							</template>
							<div v-else class="add-images">
								<Button class="primary"> Add images </Button>
							</div>
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

						<div class="row w-50">
							<CustomNumberInput
								id="servingsInput"
								label="Servings"
								v-model="newRecipe.servings"
								:min="1"
								showArrows
							/>
						</div>
						<div v-if="false" class="row align-center tags">
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
										:autoComplete="'off'"
									/>
									<Button class="close tag" @click="deleteTag(index)">
										<i class="las la-times"></i>
									</Button>
								</div>
							</div>
							<div class="ml-05">
								<Button class="add primary" @click="addTag">
									<i class="las la-plus-circle"></i>
								</Button>
							</div>
						</div>
					</template>

					<template v-if="showTab === 'ingredients'">
						<div class="row ingredients">
							<div class="row mt-0" ref="ingredientInput">
								<div
									class="row ingredient"
									v-for="(ingredient, index) in newRecipe.ingredients"
									:key="ingredient._id"
									ref="lastInputWrapper"
								>
									<div class="handle">
										<i class="las la-grip-lines grab"></i>
									</div>
									<div v-if="showAdvancedIngredientsForm">
										<CustomNumberInput
											label="Qty"
											v-model="ingredient.quantity"
											:min="0"
											slim
											emptyIf0
											showArrows
										/>
									</div>
									<CustomInput
										v-if="showAdvancedIngredientsForm"
										class="w-20"
										v-model="ingredient.units"
										type="text"
										label="Units"
										:autoComplete="'off'"
									/>
									<CustomInput
										class="ingredient-query"
										v-model="ingredient.name"
										type="text"
										:label="showAdvancedIngredientsForm && 'Ingredient'"
										:placeholder="
											!showAdvancedIngredientsForm && 'Add ingredient'
										"
										:autoComplete="'off'"
										ref="lastInput"
									/>
									<div class="w-10 delete-ingredient">
										<Button class="close" @click="deleteIngredient(index)">
											<i class="las la-times"></i>
										</Button>
									</div>
								</div>
							</div>

							<div v-if="false" class="row">
								<div class="toggleAdvancedForm">
									<span
										v-if="showAdvancedIngredientsForm"
										@click="showAdvancedIngredientsForm = false"
									>
										See simple form
									</span>
									<span
										v-else-if="newRecipe.ingredients.length > 0"
										@click="showAdvancedIngredientsForm = true"
									>
										See advanced form
									</span>
								</div>
							</div>

							<Button class="add primary" @click="addIngredient">
								<i class="las la-plus"></i>
							</Button>
						</div>
					</template>

					<template v-if="showTab === 'steps'">
						<div class="row steps">
							<div class="row mt-0" ref="stepInput">
								<div
									class="row step"
									v-for="(step, index) in newRecipe.instructions"
									:key="step._id"
									ref="lastInputWrapper"
								>
									<div class="handle">
										<i class="las la-grip-lines grab"></i>
									</div>
									<CustomInput
										type="textarea"
										class="w-80"
										v-model="step.content"
										:id="`instructionInput-${step.position}`"
										:ref="(el) => textAreaRefs.push(el)"
									/>
									<div class="w-10 delete-step">
										<Button class="close" @click="deleteStep(index)">
											<i class="las la-times"></i>
										</Button>
									</div>
								</div>
							</div>
							<Button class="add primary" @click="addStep">
								<i class="las la-plus"></i>
							</Button>
						</div>
					</template>

					<div v-if="saveErrors" class="row mt-05 errors">
						{{ saveErrors }}
					</div>
				</template>
			</template>
			<div v-else class="import-wrapper">
				<div class="title">Import Recipe</div>
				<div class="subtitle">
					Recipes can be added manually or imported through our integration
					system.
				</div>
				<ImportRecipe :thin="!!thin" @importedRecipe="importRecipe" />

				<span
					class="openRecipeForm"
					@click="
						resetNewRecipe();
						showRecipeForm = true;
					"
				>
					or use our recipe form
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	computed,
	defineComponent,
	inject,
	nextTick,
	onBeforeUpdate,
	onMounted,
	reactive,
	ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CustomNumberInput from '@/shared/CustomNumberInput.vue';
import CustomInput from '@/shared/CustomInput.vue';
import ImportRecipe from '@/recipes/components/ImportRecipe.vue';
import PageHeader from '@/shared/PageHeader.vue';

import {
	IngredientClass,
	Recipe,
	RecipeClass,
	StepClass,
	TagClass,
} from 'cooklens-types';

import { AxiosError } from 'axios';
import { RecipeServiceKey, RecipeStateKey } from '@/injectionKeys';

type Tab = 'introduction' | 'ingredients' | 'steps';

export default defineComponent({
	name: 'CreateRecipe',

	props: {
		thin: Boolean,
		embedded: Boolean,
	},

	components: {
		CustomNumberInput,
		ImportRecipe,
		CustomInput,
		PageHeader,
	},

	emits: ['newRecipeSaved', 'go-back'],

	setup(props, { emit }) {
		const route = useRoute();
		const router = useRouter();

		const recipeState = inject(RecipeStateKey)!;
		const { recipe } = recipeState;

		const recipeService = inject(RecipeServiceKey)!;

		const newRecipe = reactive<Recipe>(new RecipeClass()) as Recipe;
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
		const showIntegratedSites = ref(false);

		const textAreaRefs = ref<InstanceType<typeof CustomInput>[]>([]);

		const lastInputWrapper = ref<HTMLElement>();
		const lastInput = ref<InstanceType<typeof CustomInput>>();

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
			lastInputWrapper,
			lastInput,
			showIntegratedSites,
		};

		onMounted(async () => {
			if (route.query.edit) {
				if (!recipe.value._id) {
					await recipeService.getRecipe(route.query.edit.toString());
				}
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
			sanitized.instructions.map((step, index) => (step.position = index + 1));
			sanitized.tags = sanitized.tags.filter((tag) => !!tag.value);

			return sanitized;
		});

		async function addIngredient() {
			if (
				newRecipe.ingredients.length === 0 ||
				newRecipe.ingredients[newRecipe.ingredients.length - 1].name.length > 0
			) {
				newRecipe.ingredients.push(new IngredientClass());
			} else {
				await nextTick();

				lastInputWrapper.value?.classList.add('highlighting');
				setTimeout(
					() => lastInputWrapper.value?.classList.remove('highlighting'),
					400
				);
			}

			await nextTick();

			if (lastInputWrapper.value) {
				const y =
					lastInputWrapper.value?.getBoundingClientRect().top +
					window.scrollY -
					500;
				window.scrollTo({ top: y, behavior: 'smooth' });
			}

			lastInput.value?.focus();
		}

		async function addStep() {
			const newStep = new StepClass();
			newStep.position = newRecipe.instructions.length + 1;

			if (
				newRecipe.instructions.length === 0 ||
				newRecipe.instructions[newRecipe.instructions.length - 1].content
					.length > 0
			) {
				newRecipe.instructions.push(newStep);
			} else {
				await nextTick();

				lastInputWrapper.value?.classList.add('highlighting');
				setTimeout(
					() => lastInputWrapper.value?.classList.remove('highlighting'),
					400
				);
			}

			await nextTick();

			if (lastInputWrapper.value) {
				const y =
					lastInputWrapper.value?.getBoundingClientRect().top + window.scrollY;
				window.scrollTo({ top: y, behavior: 'smooth' });
			}

			textAreaRefs.value[textAreaRefs.value.length - 1].focus();
		}

		async function addTag() {
			newRecipe.tags.push(new TagClass());
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

		function isValidRecipe(): boolean {
			if (sanitizedRecipe.value.title === '') {
				alert('Cannot save recipes with empty title');
				return false;
			}

			if (
				// @ts-ignore
				sanitizedRecipe.value.isIntegrated &&
				(sanitizedRecipe.value.ingredients.length === 0 ||
					sanitizedRecipe.value.instructions.length === 0)
			) {
				const confirm = window.confirm(
					'Ingredients and/or instructions are empty. Do you stil want to save this recipe?'
				);
				return confirm;
			}

			return true;
		}

		function saveNewRecipe() {
			saveErrors.value = null;

			if (!isValidRecipe()) {
				return;
			}

			recipeService
				.addRecipe(sanitizedRecipe.value)
				.then((savedRecipe) => {
					if (!props.embedded) {
						router.push({
							name: 'RecipesMainView',
						});
					}

					emit('newRecipeSaved', savedRecipe);
				})
				.catch((err: AxiosError) => {
					saveErrors.value = err.response?.data;
				});
		}

		function saveEditedRecipe() {
			recipeService.editRecipe(sanitizedRecipe.value).then((editedRecipe) => {
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

		function saveRecipe() {
			if (isEditting.value) {
				saveEditedRecipe();
			} else {
				saveNewRecipe();
			}
		}

		function deleteRecipe() {
			if (route.query.edit) {
				recipeService.deleteRecipe(recipe.value).then(() =>
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

			showRecipeForm.value = true;

			importedRecipeTitle.value?.scrollIntoView({ behavior: 'smooth' });

			textAreaRefs.value.forEach((textArea) => textArea.resizeTextArea(null));
		}

		function handleGoBack() {
			if (showRecipeForm.value && !isEditting.value) {
				showRecipeForm.value = false;
				return;
			}

			if (props.embedded) {
				emit('go-back');
				return;
			}

			router.back();
		}

		function resetNewRecipe() {
			Object.assign(newRecipe, new RecipeClass());
			// @ts-ignore
			newRecipe.isIntegrated = undefined;
			// @ts-ignore
			newRecipe.time = undefined;

			if (!newRecipe.url && !newRecipe.time) {
				newRecipe.time = {
					preparation: 0,
					cooking: 0,
				};
			}

			newRecipe.url = undefined;

			importedRecipe.value = false;
		}

		return {
			...data,
			addIngredient,
			addStep,
			addTag,
			deleteIngredient,
			deleteStep,
			deleteTag,
			saveRecipe,
			deleteRecipe,
			importRecipe,
			saveErrors,
			textAreaRefs,
			handleGoBack,
			resetNewRecipe,
		};
	},
});
</script>

<style lang="scss" scoped>
.container.embedded {
	margin-bottom: 1rem;
	width: 100%;
}

.header.embedded {
	position: sticky;
	top: 0;
	z-index: 99;
}

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

.import.active {
	background-color: var(--secondary-color);
}

.close {
	display: flex;
	align-items: flex-start;
	justify-content: left;
	height: 100%;
	margin-left: 0.5rem;
	padding: 0;
	&:focus {
		background-color: transparent;
		& > i {
			color: var(--error-color);
		}
	}
	&:hover {
		background-color: transparent;
		& > i {
			color: var(--error-color);
		}
	}

	&.tag > i {
		color: white;
	}
}

.cancel {
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

.ingredients .add,
.steps .add {
	position: sticky;
	margin-left: auto;
	margin-right: 0;
	margin-top: 1rem;
	bottom: calc(1rem + 55px);
	height: 50px;
	width: 50px;
	border-radius: 50px;
	& > i {
		color: white;
	}
}
.ingredient,
.step {
	flex-wrap: nowrap;
	border-radius: 1rem;
	padding: 0.5rem;
	transition: all 0.4s;
	&.highlighting {
		background-color: var(--accent-color-transparent);
		transition: all 0s;
	}
}
.ingredient {
	align-items: flex-end;
}
.ingredient-query {
	flex-grow: 1;
}

.delete-ingredient,
.delete-step {
	width: fit-content !important;
}
.delete-ingredient {
	padding-bottom: 5px;
}

.toggleAdvancedForm {
	margin-left: auto;
	margin-right: 10%;
	cursor: pointer;
	& > span {
		color: var(--grey-600);
		text-decoration: underline;
		font-size: 13px;
	}
}

.handle {
	padding-right: 1rem;
	padding-bottom: 5px;
	& > .grab {
		font-size: 16px;
		cursor: grab;
	}
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

.save-recipe,
.delete-recipe {
	font-family: var(--main-text-font);
	font-size: 16px;
}
.save-recipe {
	color: var(--accent-color);
}
.delete-recipe {
	color: var(--error-color);
	margin-left: 0.5rem;
}

.tabs {
	width: 100%;
	padding: 0 0.5rem;
	display: flex;
	justify-content: space-between;
	& > button {
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		width: 100%;
		border-radius: 50px;
		color: var(--grey-800);
		&:hover {
			background-color: var(--accent-color-transparent);
			color: var(--inverted-text-color);
		}
		&:first-child {
			margin-right: 0;
		}
		&:last-child {
			margin-left: 0;
		}
		&.selected {
			background-color: var(--accent-color);
			color: var(--inverted-text-color);
		}
	}
}

.add-images,
.edit-images {
	width: 100%;
	background-image: url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80');
	background-size: cover;
	background-position: center;
	padding: 1rem;
	margin-top: 1rem;
	text-align: left;
	& > button {
		box-shadow: 0 0 10px 15px var(--shadow-color);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-left: auto;
	}
}
.edit-images {
	height: 220px;
	& > button {
		background-color: var(--background-contrast-color);
		color: var(--accent-color);
	}
}

.import-wrapper {
	text-align: left;
	width: 100%;
	& > .title {
		font-family: var(--title-font);
		font-size: 20px;
		margin-top: 1.5rem;
	}
	& > .subtitle {
		font-size: 14px;
		color: var(--grey-800);
		margin-top: 0.25rem;
	}
}

.openRecipeForm {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: fit-content;
	color: var(--accent-color);
	cursor: pointer;
}

.save-link {
	padding: 1rem 2rem;
	margin: 2rem auto;
	& > i {
		margin-right: 1rem;
		font-size: 20px;
	}
}

.actions > button {
	padding: 0;
	&:hover {
		background-color: transparent;
	}
}

@media only screen and (max-width: 768px) {
	.container {
		width: calc(100% - 2rem);
	}
}

@media only screen and (min-width: 769px) {
	h3 {
		font-size: 1.5rem;
	}

	.container:not(.thin) {
		& .numberInputs {
			width: 40% !important;
			padding-right: 1rem;
			height: fit-content;
		}
		& .ingredients {
			width: calc(60% - 1rem) !important;
			height: fit-content;
			background-color: var(--secondary-color);
			margin-left: 1rem;
		}
	}

	.numberInputs .row {
		height: fit-content;
	}

	.recipeTime {
		margin-top: 0 !important;
		& > .row:first-child {
			margin-top: 0 !important;
		}
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

	.tabs {
		padding-left: 10%;
		padding-right: 10%;
		& > button {
			margin-left: 4rem;
			margin-right: 4rem;
		}
	}

	.import-wrapper {
		width: 500px;
		margin-left: auto;
		margin-right: auto;
	}
}
</style>
