<template>
	<div :class="{ embedded }">
		<div class="search">
			<SearchRecipe @back="$emit('back')" :embedded="embedded" />
		</div>
		<LoadingSpinner v-if="isLoadingRecipes" />
		<template v-else>
			<Button
				v-if="showCreateRecipe"
				class="create-recipe"
				@click="$emit('create-recipe')"
			>
				<span>Create new recipe</span>
				<i class="las la-arrow-right"></i>
			</Button>
			<RecipeList
				:recipes="recipes"
				:embedded="embedded"
				:showActions="showActions"
				@see-more-info="$emit('see-more-info', $event)"
				@select-recipe="$emit('select-recipe', $event)"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import SearchRecipe from '@/recipes/components/SearchRecipe.vue';
import RecipeList from '@/recipes/components/RecipeList.vue';
import LoadingSpinner from '@/shared/LoadingSpinner.vue';

import { SearchType } from 'cooklens-types';
import {
	LoadingStateKey,
	PaginationStatekey,
	RecipeServiceKey,
	RecipeStateKey,
} from '@/injectionKeys';

export default defineComponent({
	name: 'RecipesListAndSearch',

	props: {
		embedded: Boolean,
		showActions: Boolean,
		showCreateRecipe: Boolean,
	},

	components: {
		SearchRecipe,
		RecipeList,
		LoadingSpinner,
	},

	emits: ['back', 'select-recipe', 'see-more-info', 'create-recipe'],

	setup(props) {
		const recipeState = inject(RecipeStateKey)!;
		const { recipes, setSearch, resetSearch, searchQuery } = recipeState;

		const loadingState = inject(LoadingStateKey)!;
		const { isLoadingRecipes } = loadingState;

		const paginationState = inject(PaginationStatekey)!;
		const { currentPage } = paginationState;

		const recipeService = inject(RecipeServiceKey)!;

		const router = useRouter();
		const route = useRoute();

		const mounted = ref(false);

		// const cachedRecipes = ref<Recipe[]>([]);

		const data = {
			isLoadingRecipes,
		};

		onMounted(() => {
			if (props.embedded) {
				resetSearch();
				return;
			}

			if (route.query.searchBy && route.query.searchText) {
				setSearch(
					route.query.searchBy.toString() as SearchType,
					route.query.searchText.toString()
				);
			}

			currentPage.value = parseInt(route.query.page?.toString() ?? '1');
			mounted.value = true;
		});

		watch(
			[currentPage, searchQuery, mounted],
			() => {
				if (!mounted.value) {
					return;
				}

				updateQueryString();

				recipeService.searchRecipes(currentPage.value);
			},
			{ immediate: true, deep: true }
		);

		function updateQueryString() {
			if (props.embedded) {
				return;
			}

			router.push({
				name: 'RecipesMainView',
				query: {
					...route.query,
					searchBy:
						searchQuery && searchQuery.value.text !== ''
							? searchQuery.value.type
							: undefined,
					searchText:
						searchQuery && searchQuery.value.text !== ''
							? searchQuery.value.text
							: undefined,
					page: currentPage.value > 1 ? currentPage.value : undefined,
				},
			});
		}

		function doSearch() {
			updateQueryString();

			recipeService.searchRecipes(currentPage.value);
		}

		return {
			...data,
			doSearch,
			recipes,
			searchQuery,
		};
	},
});
</script>

<style lang="scss" scoped>
.embedded {
	display: flex;
	flex-direction: column;
	height: 100%;
	& > .search {
		margin-bottom: 1.5rem;
	}
}

div:not(.embedded) > .search {
	padding: 1rem;
	padding-top: calc(2rem + 50px);
	margin-top: -50px;
}

.create-recipe {
	position: relative;
	background-color: var(--grey-800);
	padding: 1rem;
	margin-bottom: 1rem;
	display: flex;
	border-radius: 0.5rem;
	justify-content: space-between;
	&:hover {
		background-color: var(--grey-700);
	}
	& > * {
		color: var(--inverted-text-color);
	}
}

@media only screen and (min-width: 769px) {
	.search {
		padding-top: calc(2rem + 60px);
		margin-top: -60px;
	}
}
</style>
