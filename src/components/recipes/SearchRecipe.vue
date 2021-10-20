<template>
    <CustomModal v-if="isLoading">
        <LoadingModal>Searching ...</LoadingModal>
    </CustomModal>
    <div class="d-flex w-100 searchRow">
        <input
            @keypress="autoSearch"
            ref="searchInput"
            type="text"
            id="search"
            class="w-100"
            :placeholder="'Search by ' + search.type"
        />
        <button
            @click="doSearch()"
            class="searchButton p-05"
            ref="searchButton"
        >
            <SearchIcon size="xl" color="white" />
        </button>
    </div>

    <div class="switchSearch">
        <button v-if="search.type !== 'title'" @click="changeSearch('title')">
            Search by title
        </button>
        <button
            v-if="search.type !== 'ingredient'"
            @click="changeSearch('ingredient')"
        >
            Search by ingredient
        </button>
        <button v-if="search.type !== 'tag'" @click="changeSearch('tag')">
            Search by tag
        </button>
    </div>
</template>

<script lang="ts">
import { Recipe, SearchType } from '@/api/types/recipe';
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { EOS_SEARCH as SearchIcon } from 'eos-icons-vue3';
import { useRoute, useRouter } from 'vue-router';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import useRecipeState from '@/store/recipe-state';

export default defineComponent({
    name: 'SearchRecipe',

    props: {
        recipes: {
            type: Array as PropType<Recipe[]>,
            required: true,
        },
    },

    components: {
        SearchIcon,
        CustomModal,
        LoadingModal,
    },

    emits: ['searchResult'],

    setup(_, { emit }) {
        const { isLoading, recipes, search, setSearch, searchRecipes } =
            useRecipeState();

        const router = useRouter();
        const route = useRoute();

        const searchResult = ref<Recipe[]>([]);

        const searchInput = ref<HTMLInputElement>();
        const searchButton = ref<HTMLButtonElement>();

        onMounted(() => {
            if (searchInput.value) {
                searchInput.value.value =
                    route.query.searchText?.toString() || '';

                if (
                    route.query.searchBy !== undefined &&
                    route.query.searchText !== undefined
                ) {
                    searchInput.value!.value =
                        route.query.searchText!.toString();
                    if (route.query.page) {
                        doSearch(parseInt(route.query.page.toString()));
                        return;
                    }
                    doSearch();
                }
            }

            searchInput.value?.focus();
        });

        function doSearch(page?: number) {
            if (searchInput.value!.value === '') {
                router.push({
                    name: 'RecipesMainView',
                });

                emit('searchResult', []);

                return;
            }

            updateQueryString(page);

            searchRecipes(page)
                .then(() => {
                    emit('searchResult', recipes);
                })
                .catch(() => {
                    emit('searchResult', []);
                });
        }

        function changeSearch(type: SearchType) {
            setSearch(type, search.value.text);

            if (searchInput.value!.value.length > 0) {
                setTimeout(() => doSearch(), 10);
            }
        }

        function updateQueryString(page?: number) {
            const searchBy = search.value.type;
            const searchText =
                searchInput.value!.value.length > 0
                    ? searchInput.value!.value
                    : undefined;

            router.push({
                name: 'RecipesMainView',
                query: {
                    searchBy,
                    searchText,
                    page: page && page > 1 ? page : undefined,
                },
            });

            setSearch(searchBy || 'title', searchText || '');
        }

        function autoSearch(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                doSearch();
            }
        }

        return {
            searchResult,
            doSearch,
            search,
            changeSearch,
            updateQueryString,
            searchInput,
            searchButton,
            autoSearch,
            isLoading,
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
