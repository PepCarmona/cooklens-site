<template>
	<div class="d-flex w-100 searchRow" :class="{ focus: isFocus }">
		<Button v-if="embedded" class="back" @click="$emit('back')">
			<i class="las la-angle-left"></i>
		</Button>
		<input
			@input="changeSearchText"
			@focus="isFocus = true"
			@blur="isFocus = false"
			ref="searchInput"
			type="text"
			id="search"
			class="w-100"
			:placeholder="'Search by ' + searchQuery.type"
			:value="searchQuery.text"
			autocomplete="off"
		/>
		<Button @click="doSearch()" class="searchButton">
			<i class="las la-search"></i>
		</Button>
	</div>

	<div class="switchSearch">
		<Button
			v-if="searchQuery.type !== 'title'"
			@click="changeSearchType('title')"
		>
			Search by title
		</Button>
		<Button
			v-if="searchQuery.type !== 'ingredient'"
			@click="changeSearchType('ingredient')"
		>
			Search by ingredient
		</Button>
		<Button v-if="searchQuery.type !== 'tag'" @click="changeSearchType('tag')">
			Search by tag
		</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { SearchType } from 'cooklens-types';

import useRecipeState from '@/recipes/state/RecipeState';

import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isMobile } from '@/helpers/media';

export default defineComponent({
	name: 'SearchRecipe',

	props: {
		embedded: Boolean,
	},

	emits: ['doSearch', 'back'],

	setup(_, { emit }) {
		const { setSearch, searchQuery } = useRecipeState();

		const searchInput = ref<HTMLInputElement>();

		const isFocus = ref(false);

		onMounted(() => {
			if (!searchInput.value) {
				return;
			}

			if (!isMobile) {
				searchInput.value.focus();
			}

			const searchInputTyping = fromEvent(
				searchInput.value,
				'keydown'
			) as Observable<KeyboardEvent>;

			searchInputTyping.pipe(debounceTime(200)).subscribe(() => doSearch());
		});

		function doSearch(page?: number) {
			emit('doSearch', {
				page,
				searchQuery: searchQuery.value,
			});
		}

		function changeSearchType(type: SearchType) {
			setSearch(type, searchQuery.value.text);

			if (searchQuery.value.text.length > 0) {
				doSearch();
			}
		}

		function changeSearchText() {
			const searchBy = searchQuery.value.type;
			const searchText =
				searchInput.value!.value.length > 0
					? searchInput.value!.value
					: undefined;

			setSearch(searchBy || 'title', searchText || '');
		}

		return {
			doSearch,
			changeSearchType,
			searchInput,
			isFocus,
			searchQuery,
			changeSearchText,
		};
	},
});
</script>

<style scoped>
.searchRow {
	position: relative;
	background-color: var(--background-contrast-color);
	border-radius: 1rem;
	border: 1px solid var(--border-color);
	/* background: linear-gradient(45deg, #f9fffd 20%, #c8f5e6 100%); */
}
.back:hover {
	background-color: transparent;
}
.back * {
	color: var(--accent-color);
}
input {
	background-color: transparent;
	padding: 1rem;
	border: none;
	outline: none;
}
.searchButton {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
}
.searchButton:hover {
	background-color: transparent;
}
.searchButton > i {
	color: var(--accent-color);
	font-size: 24px;
}

.switchSearch {
	display: flex;
	width: fit-content;
	justify-content: space-between;
	margin-top: 0.5rem;
}
.switchSearch > button {
	text-decoration: underline;
	font-size: 14px;
	color: var(--grey-800);
}
.switchSearch > button:first-child {
	margin-right: 2rem;
	margin-left: 1rem;
}

@media only screen and (min-width: 768px) {
	.searchRow {
		width: 600px;
	}
	.searchRow,
	.switchSearch {
		margin-left: auto;
		margin-right: auto;
	}
}
</style>
