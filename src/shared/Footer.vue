<template>
	<footer>
		<Button
			@click="addRecipe"
			v-if="showAddRecipe || showEditRecipe"
			class="add-recipe primary"
		>
			<i v-if="showAddRecipe" class="las la-plus"></i>
			<i v-if="showEditRecipe" class="las la-pen"></i>
		</Button>
		<div v-if="showFooter" id="mobile-sticky-footer">
			<div>
				<router-link to="/">
					<i class="las la-home" :class="{ current: routeName === 'Home' }"></i>
				</router-link>
			</div>
			<div :class="{ 'mr-2': showAddRecipe || showEditRecipe }">
				<router-link to="/recipes">
					<i
						class="las la-search"
						:class="{
							current: routeName === 'RecipesMainView',
						}"
					></i>
				</router-link>
			</div>
			<div :class="{ 'ml-2': showAddRecipe || showEditRecipe }">
				<router-link to="/profile/myMealPlan">
					<i
						class="las la-calendar-week"
						:class="{ current: routeName === 'myMealPlan' }"
					></i>
				</router-link>
			</div>
			<div>
				<router-link to="/profile">
					<i
						class="las la-user-circle"
						:class="{
							current: ['Authentication', 'Profile'].includes(routeName),
						}"
					></i>
				</router-link>
			</div>
		</div>
	</footer>
</template>

<script lang="ts">
import { LoadingStateKey, RecipeStateKey } from '@/injectionKeys';
import { computed, defineComponent, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
	name: 'Footer',

	setup() {
		const route = useRoute();
		const router = useRouter();

		const recipeState = inject(RecipeStateKey)!;
		const { recipe } = recipeState;

		const loadingState = inject(LoadingStateKey)!;
		const { isLoadingRecipes } = loadingState;

		const routeName = computed(() => route.name);

		const showAddRecipe = computed(() => route.meta.showAddRecipe);

		const showEditRecipe = computed(
			() =>
				!isLoadingRecipes.value &&
				route.name === 'RecipeDetails' &&
				recipe.value.isOwnRecipe
		);

		const showFooter = computed(() => !route.meta.noFooter);

		function addRecipe() {
			if (showAddRecipe.value) {
				router.push({
					name: 'CreateRecipe',
				});
				return;
			}
			if (showEditRecipe.value) {
				router.push({
					name: 'CreateRecipe',
					query: { edit: recipe.value._id },
				});
			}
		}
		return {
			routeName,
			showAddRecipe,
			showEditRecipe,
			showFooter,
			addRecipe,
		};
	},
});
</script>

<style lang="scss" scoped>
footer {
	z-index: 10;
}
i.current {
	color: var(--accent-color);
}
.add-recipe {
	position: fixed;
	bottom: calc(1rem - 1px);
	left: 50%;
	transform: translateX(-50%);
	box-shadow: 0px -1px 0px var(--shadow-color);
	border-radius: 60px;
	height: 60px;
	width: 60px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
	& > i {
		margin-bottom: 0.5rem;
		padding-top: 0.5rem;
		color: var(--inverted-text-color);
	}
}

#mobile-sticky-footer {
	display: flex;
	width: 100%;
	height: 55px;
	align-items: center;
	position: fixed;
	bottom: -1px;
	left: 0;
	background-color: var(--background-contrast-color);
	box-shadow: 0px -1px 0px var(--shadow-color);
	z-index: 99;
	& > div {
		display: flex;
		flex-wrap: wrap;
		height: 100%;
		width: 25%;
		align-items: center;
		justify-content: center;
		& > * {
			width: 100%;
		}
	}
}

@media only screen and (min-width: 769px) {
	#mobile-sticky-footer,
	.add-recipe {
		display: none;
	}
}
</style>
