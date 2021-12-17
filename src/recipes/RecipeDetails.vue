<template>
	<CustomModal v-if="isLoading && !id">
		<LoadingModal>Loading ...</LoadingModal>
	</CustomModal>
	<div class="container" :class="{ thin: !!id, embedded }" v-else>
		<div v-if="isLoading & !!id">Loading...</div>
		<template v-else>
			<div class="gallery-and-icons">
				<button v-if="canGoBack" class="back" @click="goBack">
					<i class="las la-angle-left"></i>
				</button>
				<div v-if="recipeHasImages" class="gallery" ref="gallery">
					<div
						class="image"
						:style="`background: url(${recipe.images[0]}) center center / cover;`"
					></div>
				</div>
				<div class="icons" :class="{ 'no-image': !recipeHasImages }">
					<button
						class="editButton"
						v-if="isOwnRecipe && !isMobile"
						@click="showEditRecipe"
					>
						<i class="las la-pen"></i>
					</button>
					<button @click="toggleFavRecipe(recipe)">
						<i v-if="isFavoriteRecipe(recipe)" class="las la-heart"></i>
						<i v-else class="lar la-heart"></i>
					</button>
					<button>
						<i class="las la-calendar-week"></i>
					</button>
					<button>
						<i class="las la-share-alt"></i>
					</button>
				</div>
			</div>
			<div class="brief" :class="{ 'no-image': !recipeHasImages }">
				<div class="title">
					<h1>{{ recipe.title }}</h1>
				</div>
				<div v-if="recipe.url" class="imported-url">
					Imported from
					<a :href="recipe.url" target="_blank" rel="noopener noreferrer">{{
						formattedURL
					}}</a>
				</div>
				<div v-if="recipe.author" class="author">
					By: {{ recipe.author.username }}
				</div>
				<div class="basic-info">
					<div class="time">
						<i class="las la-clock"></i>
						<span>{{ totalTime }}</span>
					</div>
					<div class="vertical-separator"></div>
					<div class="difficulty">
						<i class="las la-concierge-bell"></i>
						<span>Easy</span>
					</div>
					<div class="vertical-separator"></div>
					<div class="servings">
						<i class="las la-utensils"></i>
						<span>Serves {{ recipe.servings }}</span>
					</div>
				</div>
			</div>
			<div v-if="recipe.tags.length > 0">
				<h3>Tags:</h3>
				<ul class="tags d-flex">
					<li class="pill" v-for="tag in recipe.tags" :key="tag._id">
						{{ tag.value }}
					</li>
				</ul>
			</div>

			<div class="row">
				<Rating :recipeRating="recipe.rating" @rate="editRating" />
			</div>
			<div class="main-info">
				<div class="tabs">
					<button
						@click="showTab = 'introduction'"
						:class="{
							selected: showTab === 'introduction',
						}"
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
				<div class="content">
					<div v-if="showTab === 'introduction'" class="introduction">
						{{ recipe.description }}
					</div>
					<div v-if="showTab === 'ingredients'" class="ingredients">
						<CustomNumberInput
							v-if="canModifyServings"
							class="modifyServingsInput"
							:id="'servingsInput'"
							:min="1"
							v-model="modifiedServings"
						/>
						<ul class="ingredients-list">
							<li v-for="ingredient in ingredientsToShow" :key="ingredient._id">
								<span class="bullet"></span>
								<span v-if="ingredient.quantity && ingredient.quantity > 0">
									{{ ingredient.quantity }}
								</span>
								<span>{{ ingredient.units }}</span>
								<span>{{ ingredient.name }}</span>
							</li>
						</ul>
					</div>
					<div v-if="showTab === 'steps'" class="steps">
						<ul class="steps-list">
							<li v-for="step in recipe.instructions" :key="step._id">
								<!-- <div class="stepPosition">
                                        {{ step.position }}
                                    </div> -->
								<div class="stepHead">
									<span class="bullet"></span>
								</div>
								<div class="stepContent">
									{{ step.content }}
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CustomModal from '@/shared/CustomModal.vue';
import LoadingModal from '@/shared/LoadingModal.vue';
import CustomNumberInput from '@/shared/CustomNumberInput.vue';
import Rating from '@/shared/Rating.vue';

import { Ingredient, Recipe } from 'cooklens-types';

import useRecipeState from '@/recipes/state/RecipeState';
import useUserState from '@/profile/state/UserState';

import { isMobile } from '@/helpers/media';

export function getFormattedTitle(recipe: Recipe): string {
	return recipe.title.toLowerCase().replaceAll(' ', '-');
}

type Tab = 'introduction' | 'ingredients' | 'steps';

export default defineComponent({
	name: 'RecipeDetails',

	props: {
		id: String,
		embedded: Boolean,
	},

	components: {
		CustomModal,
		LoadingModal,
		CustomNumberInput,
		Rating,
	},

	emits: ['back'],

	setup(props, { emit }) {
		const {
			isLoading,
			canModifyServings,
			modifiedServings,
			isFavoriteRecipe,
			isOwnRecipe,
			getRecipe,
			recipe,
			editRating,
		} = useRecipeState();
		const { toggleFavRecipe } = useUserState();

		const route = useRoute();
		const router = useRouter();

		const gallery = ref<HTMLDivElement>();

		const showTab = ref<Tab>('introduction');

		const data = {
			isLoading,
			recipe,
			canModifyServings,
			modifiedServings,
			isFavoriteRecipe,
			isOwnRecipe,
			toggleFavRecipe,
			gallery,
			showTab,
			isMobile,
		};

		onMounted(() => {
			if (route.query.random) {
				getRandomRecipe();
			} else {
				getRecipeDetails();
			}
		});

		watch(route, () => {
			if (route.query.random) {
				getRandomRecipe();
			}
		});

		const ingredientsToShow = computed(() => {
			if (canModifyServings.value) {
				const clonedIngredients: Ingredient[] = JSON.parse(
					JSON.stringify(recipe.value.ingredients)
				);
				return clonedIngredients.map((ingredient) => {
					if (ingredient.quantity) {
						ingredient.quantity =
							(ingredient.quantity / recipe.value.servings) *
							modifiedServings.value!;
					}

					return ingredient;
				});
			}

			return recipe.value.ingredients;
		});

		const recipeHasImages = computed(
			() => recipe.value.images && recipe.value.images.length > 0
		);

		const totalTime = computed(() => {
			return getFormattedTime(
				(recipe.value.time.preparation ?? 0) + recipe.value.time.cooking
			);
		});

		const formattedURL = computed(() => new URL(recipe.value.url!).hostname);

		const canGoBack = computed(() => props.embedded || !!route.query.cgb);

		function getRecipeDetails() {
			const id = props.id ?? route.query.id?.toString();

			if (!id) {
				console.error('ID not provided');
				return;
			}

			getRecipe(id).catch((err) => {
				console.error(err);
				// TODO: show custom error page && display error on floating modal
				router.push({
					name: 'RecipesMainView',
				});
			});
		}

		function getRandomRecipe() {
			useRecipeState()
				.getRandomRecipe()
				.then(() => {
					const formattedTitle = recipe.value.title
						.toLowerCase()
						.replaceAll(' ', '-');

					router.push({
						name: 'RecipeDetails',
						params: { title: formattedTitle },
						query: { id: recipe.value._id },
					});
				})
				.catch((err) => {
					console.error(err);
					router.push({
						name: 'RecipesMainView',
					});
				});
		}

		function getFormattedTime(time: number) {
			const hours = Math.floor(time / 60);
			const minutes = time % 60;

			const formattedTime =
				hours > 0 ? `${hours} h  ${minutes} min` : `${minutes} min`;

			return formattedTime;
		}

		function goBack() {
			if (props.embedded) {
				emit('back');
				return;
			}

			router.back();
		}

		function showEditRecipe() {
			router.push({
				name: 'CreateRecipe',
				query: { edit: recipe.value._id },
			});
		}

		return {
			...data,
			ingredientsToShow,
			totalTime,
			formattedURL,
			canGoBack,
			getFormattedTime,
			recipeHasImages,
			editRating,
			getFormattedTitle,
			goBack,
			showEditRecipe,
		};
	},
});
</script>

<style scoped>
.container > * {
	width: 100%;
}
.container * {
	text-align: left;
}
.container.embedded {
	min-height: calc(100vh - 2rem);
	justify-content: center;
}

.brief {
	width: auto;
	background-color: var(--background-contrast-color);
	border-radius: 1rem;
	padding: 1rem;
	margin: 0 1rem;
	margin-top: -50px;
	z-index: 9;
}
.embedded .brief {
	background-color: var(--background-color);
}
.brief.no-image {
	margin-top: calc(2rem + 50px);
}
.title,
.author,
.imported-url {
	width: 100%;
}
.author,
.imported-url,
.imported-url a {
	font-size: 12px;
}
.title > h1 {
	font-family: var(--title-font);
	font-size: 24px;
	margin: 0;
}
.basic-info {
	display: flex;
	justify-content: space-between;
	border-top: 1px solid var(--shadow-color);
	padding: 1rem;
	padding-bottom: 0.5rem;
	margin-top: 2rem;
}
.basic-info > div {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}
.basic-info i {
	color: var(--accent-color);
}
.basic-info span {
	width: 100%;
	text-align: center;
}
.vertical-separator {
	border-left: 1px solid var(--shadow-color);
}

.gallery-and-icons {
	position: relative;
}
.image {
	width: 100%;
	height: 400px;
	margin-top: -50px;
}
.back {
	position: absolute;
	left: 1rem;
	top: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--background-contrast-color);
	border-radius: 50px;
	height: 50px;
	width: 50px;
}
.embedded .back {
	background-color: var(--background-color);
}
.icons {
	position: absolute;
	display: flex;
	flex-direction: column;
	right: 1rem;
	top: 1rem;
}
.icons.no-image {
	flex-direction: row;
}
.icons > button {
	background-color: var(--background-contrast-color);
	border-radius: 50px;
	height: 50px;
	width: 50px;
	margin-bottom: 1rem;
}
.embedded .icons > button {
	background-color: var(--background-color);
}
.icons.no-image > button:not(:last-child) {
	margin-right: 1rem;
}
.icons i {
	color: var(--accent-color);
}
.editButton {
	background-color: var(--accent-color) !important;
}
.editButton > i {
	color: var(--inverted-text-color);
}

.rating-container {
	margin: 1rem auto;
}

.main-info {
	background-color: var(--background-contrast-color);
	padding: 1rem;
	padding-bottom: 2rem;
	flex-grow: 1;
}
.embedded .main-info {
	background-color: var(--background-color);
}

.tabs {
	padding: 0.5rem;
	display: flex;
	justify-content: space-between;
}
.tabs > button {
	padding: 0.5rem 1rem;
	width: 100%;
	color: var(--grey-800);
}
.tabs > button.selected {
	background-color: var(--accent-color);
	border-radius: 50px;
	color: var(--inverted-text-color);
}

.main-info > .content {
	padding: 1rem 0;
}

.modifyServingsInput {
	width: 100px;
}
.ingredients-list > li {
	display: flex;
	align-items: center;
	padding: 0.5rem 0;
	margin-bottom: 5px;
}
.bullet {
	height: 12px;
	width: 12px;
	margin: 5px;
	margin-right: calc(0.5rem + 5px);
	border-radius: 50px;
	background-color: var(--accent-color);
}

.steps-list > li {
	display: flex;
	padding: 0.5rem 0;
	margin-bottom: 5px;
}
.steps-list > li:last-child,
.ingredients-list > li:last-child {
	margin-bottom: 0;
}
.stepHead {
	position: relative;
	display: flex;
	align-items: center;
}
.stepHead::after {
	content: '';
	position: absolute;
	display: block;
	height: calc(100% + 1rem + 5px);
	border-left: 2px solid var(--accent-color-transparent);
	left: 10px;
}
.steps-list > li:first-child > .stepHead::after {
	height: calc(50% + 0.3rem);
	top: calc(50% + 6px);
}
.steps-list > li:last-child > .stepHead::after {
	height: calc(50% + 0.3rem);
	bottom: calc(50% + 6px);
}
.stepContent {
	width: fit-content;
}

.pill {
	background-color: var(--main-color);
	color: var(--main-light-color);
	border-radius: 50px;
	width: fit-content;
	padding-top: 0.2rem;
	padding-bottom: 0.2rem;
	padding-left: 0.6rem;
	padding-right: 0.6rem;
}

@media only screen and (min-width: 769px) {
	.container:not(.thin) {
		width: 70%;
	}
	.container:not(.thin) > * {
		width: 70%;
	}
	.brief {
		width: 600px;
		margin-left: auto;
		margin-right: auto;
		min-height: 200px;
	}
	.brief.no-image {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: 1rem;
	}

	.icons.no-image {
		flex-direction: column;
	}

	.tabs,
	.content {
		width: 80%;
		margin-left: auto;
		margin-right: auto;
	}
	.tabs > button {
		margin: 0 4rem;
	}
}
</style>
