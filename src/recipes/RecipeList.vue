<template>
	<div class="card-container" :class="{ embedded, thin, 'pb-3': !embedded }">
		<LoadingSpinner v-if="isLoading" class="loadingCard" />
		<div class="grid" v-else>
			<RecipeCard
				v-for="recipe in recipes"
				:key="recipe._id"
				:recipe="recipe"
				:embedded="embedded"
				:showActions="showActions"
				@see-more-info="$emit('see-more-info', $event)"
				@select-recipe="$emit('select-recipe', $event)"
			/>
		</div>
		<div v-if="recipes.length === 0">No recipes match this search</div>
		<Pagination
			v-if="!(currentPage === 1 && !nextPageExists) && !isLoading"
			class="mt-2"
			:nextPageExists="nextPageExists"
			@previousPage="goToPreviousPage"
			@nextPage="goToNextPage"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue';

import RecipeCard from '@/recipes/RecipeCard.vue';
import Pagination from '@/shared/Pagination/Pagination.vue';
import LoadingSpinner from '@/shared/LoadingSpinner.vue';

import { Recipe } from 'cooklens-types';
import { PaginationStatekey, RecipeStateKey } from '@/injectionKeys';

export default defineComponent({
	name: 'RecipeList',

	props: {
		recipes: {
			type: Array as PropType<Recipe[]>,
			required: true,
		},
		thin: Boolean,
		embedded: Boolean,
		showActions: Boolean,
	},

	components: {
		RecipeCard,
		Pagination,
		LoadingSpinner,
	},

	emits: ['goToPage', 'select-recipe', 'see-more-info'],

	setup(_, { emit }) {
		const paginationState = inject(PaginationStatekey)!;
		const { currentPage, nextPageExists } = paginationState;

		const recipeState = inject(RecipeStateKey)!;
		const { isLoading } = recipeState;

		function goToPreviousPage() {
			emit('goToPage', currentPage.value - 1);
		}

		function goToNextPage() {
			emit('goToPage', currentPage.value + 1);
		}

		return {
			currentPage,
			nextPageExists,
			isLoading,
			goToPreviousPage,
			goToNextPage,
		};
	},
});
</script>

<style lang="scss" scoped>
.seeAll {
	background-color: var(--accent-color-complementary);
	color: var(--inverted-text-color);
	padding-top: 0.2rem;
	padding-bottom: 0.2rem;
	padding-left: 0.6rem;
	padding-right: 0.6rem;
	border-radius: 50px;
	width: fit-content;
	margin: auto;
	cursor: pointer;
}

.card-container {
	padding: 1rem;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	&.embedded {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		width: fit-content;
		flex-wrap: nowrap;
		padding: 0;
	}
}

.grid {
	display: grid;
	grid-gap: 60px;
	justify-content: center;
	justify-items: center;
	align-items: center;
}

.loadingCard {
	width: 400px;
	margin-top: 1rem;
	margin-bottom: 1rem;
}

@media only screen and (min-width: 900px) {
	.grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media only screen and (min-width: 1400px) {
	.grid {
		grid-template-columns: repeat(3, 1fr);
	}
}
</style>
