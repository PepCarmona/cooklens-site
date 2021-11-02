<template>
    <div class="d-flex w-100 searchRow">
        <input
            @input="updateSearchQuery"
            @keypress="autoSearch"
            ref="searchInput"
            type="text"
            id="search"
            class="w-100"
            :placeholder="'Search by ' + searchQuery.type"
            :value="searchQuery.text"
        />
        <button @click="doSearch()" class="searchButton p-05">
            <SearchIcon size="xl" color="white" />
        </button>
    </div>

    <div class="switchSearch">
        <button
            v-if="searchQuery.type !== 'title'"
            @click="changeSearch('title')"
        >
            Search by title
        </button>
        <button
            v-if="searchQuery.type !== 'ingredient'"
            @click="changeSearch('ingredient')"
        >
            Search by ingredient
        </button>
        <button v-if="searchQuery.type !== 'tag'" @click="changeSearch('tag')">
            Search by tag
        </button>
    </div>
</template>

<script lang="ts">
import { SearchType } from '@/api/types/recipe';
import { defineComponent, onMounted, ref } from 'vue';
import { EOS_SEARCH as SearchIcon } from 'eos-icons-vue3';
import { useRouter } from 'vue-router';
import useRecipeState from '@/store/recipe-state';

export default defineComponent({
    name: 'SearchRecipe',

    components: {
        SearchIcon,
    },

    emits: ['doSearch'],

    setup(_, { emit }) {
        const { setSearch, searchQuery } = useRecipeState();

        const router = useRouter();

        const searchInput = ref<HTMLInputElement>();

        onMounted(() => {
            searchInput.value?.focus();
        });

        function doSearch(page?: number) {
            emit('doSearch', {
                page,
                searchQuery: searchQuery.value,
            });
        }

        function changeSearch(type: SearchType) {
            setSearch(type, searchQuery.value.text);

            if (searchQuery.value.text.length > 0) {
                doSearch();
            }
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

        function updateSearchQuery() {
            const searchBy = searchQuery.value.type;
            const searchText =
                searchInput.value!.value.length > 0
                    ? searchInput.value!.value
                    : undefined;

            setSearch(searchBy || 'title', searchText || '');
        }

        function autoSearch(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                doSearch();
            }
        }

        return {
            doSearch,
            changeSearch,
            updateQueryString,
            searchInput,
            autoSearch,
            searchQuery,
            updateSearchQuery,
        };
    },
});
</script>

<style scoped>
input {
    /* background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); */
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    padding: 0.5rem;
    border: none;
    outline: none;
}
input:focus {
    box-shadow: 0 0 5px var(--main-dark-color);
}
input:focus + button {
    box-shadow: 0 0 4px var(--main-dark-color);
}
.searchButton {
    background-color: var(--main-color) !important;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.switchSearch {
    display: flex;
    width: fit-content;
    justify-content: space-between;
    margin-top: 0.5rem;
}
.switchSearch > button {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    text-decoration: underline;
}
.switchSearch > button:first-child {
    margin-right: 2rem;
}
</style>
