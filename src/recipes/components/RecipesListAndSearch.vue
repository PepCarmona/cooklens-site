<template>
	<div :class="{ embedded }">
		<div class="search">
			<SearchRecipe
				@doSearch="doSearch($event.page, $event.searchQuery)"
				@back="$emit('back')"
				:embedded="embedded"
			/>
		</div>
		<LoadingSpinner v-if="isLoading" />
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
				@goToPage="goToPage"
				:embedded="embedded"
				:showActions="showActions"
				@see-more-info="$emit('see-more-info', $event)"
				@select-recipe="$emit('select-recipe', $event)"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import SearchRecipe from '@/recipes/components/SearchRecipe.vue';
import RecipeList from '@/recipes/components/RecipeList.vue';
import LoadingSpinner from '@/shared/LoadingSpinner.vue';

import { SearchType, SearchQuery } from 'cooklens-types';
import { RecipeStateKey } from '@/injectionKeys';

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
		const { isLoading, recipes, searchRecipes, setSearch, searchQuery } =
			recipeState;

		const router = useRouter();
		const route = useRoute();

		const showFilteredRecipes = ref(false);

		// const cachedRecipes = ref<Recipe[]>([]);

		const data = {
			isLoading,
			showFilteredRecipes,
		};

		onMounted(() => {
			if (props.embedded) {
				showAllRecipes();
				return;
			}

			if (route.query.searchBy && route.query.searchText) {
				setSearch(
					route.query.searchBy.toString() as SearchType,
					route.query.searchText.toString()
				);

				doSearch(
					parseInt(route.query.page?.toString() ?? '1'),
					searchQuery.value
				);
			}

			doSearch(parseInt(route.query.page?.toString() ?? '1'));
		});

		function updateQueryString(page?: number, searchQuery?: SearchQuery) {
			if (props.embedded) {
				return;
			}

			router.push({
				name: 'RecipesMainView',
				query: {
					...route.query,
					searchBy:
						searchQuery && searchQuery.text !== ''
							? searchQuery.type
							: undefined,
					searchText:
						searchQuery && searchQuery.text !== ''
							? searchQuery.text
							: undefined,
					page: page && page > 1 ? page : undefined,
				},
			});
		}

		function doSearch(page?: number, searchQuery?: SearchQuery) {
			showFilteredRecipes.value = !!searchQuery && searchQuery.text.length > 0;

			updateQueryString(page, searchQuery);

			searchRecipes(page);
		}

		function showAllRecipes() {
			updateQueryString();

			setSearch('title', '');

			doSearch();
		}

		function goToPage(page: number) {
			window.scrollTo({ top: 0 });
			if (showFilteredRecipes.value) {
				doSearch(page, searchQuery.value);
				return;
			}
			doSearch(page);
		}

		return {
			...data,
			doSearch,
			recipes,
			searchQuery,
			goToPage,
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
