<template>
    <div class="d-flex w-100 searchRow" :class="{ focus: isFocus }">
        <input
            @input="changeSearchText"
            @keypress="autoSearch"
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
        <button @click="doSearch()" class="searchButton">
            <i class="las la-search"></i>
        </button>
    </div>

    <div class="switchSearch">
        <button
            v-if="searchQuery.type !== 'title'"
            @click="changeSearchType('title')"
        >
            Search by title
        </button>
        <button
            v-if="searchQuery.type !== 'ingredient'"
            @click="changeSearchType('ingredient')"
        >
            Search by ingredient
        </button>
        <button
            v-if="searchQuery.type !== 'tag'"
            @click="changeSearchType('tag')"
        >
            Search by tag
        </button>
    </div>
</template>

<script lang="ts">
import { SearchType } from '@/api/types/recipe';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import useRecipeState from '@/store/recipe-state';

export default defineComponent({
    name: 'SearchRecipe',

    emits: ['doSearch'],

    setup(_, { emit }) {
        const { setSearch, searchQuery } = useRecipeState();

        const router = useRouter();

        const searchInput = ref<HTMLInputElement>();

        const isFocus = ref(false);

        onMounted(() => {
            searchInput.value?.focus();
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

        function updateQueryString(page?: number) {
            router.push({
                name: 'RecipesMainView',
                query: {
                    searchBy: searchQuery.value.type,
                    searchText: searchQuery.value.text,
                    page: page && page > 1 ? page : undefined,
                },
            });
        }

        function autoSearch(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                doSearch();
            }
        }

        return {
            doSearch,
            changeSearchType,
            updateQueryString,
            searchInput,
            isFocus,
            autoSearch,
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
input {
    background-color: transparent;
    padding: 1rem;
    border: none;
    outline: none;
}
.searchButton {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
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
