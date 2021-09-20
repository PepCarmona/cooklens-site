<template>
    <CustomModal v-if="isSearching">
        <LoadingModal>Searching ...</LoadingModal>
    </CustomModal>
    <div class="d-flex w-100 searchRow">
        <input
            @keypress="autoSearch"
            ref="searchInput"
            type="text"
            id="search"
            class="w-100"
            :placeholder="'Search by ' + searchType"
        />
        <button
            @click="searchPage(1)"
            class="searchButton p-05"
            ref="searchButton"
        >
            <SearchIcon size="xl" color="white" />
        </button>
    </div>

    <div class="switchSearch">
        <button v-if="searchType !== 'title'" @click="changeSearch('title')">
            Search by title
        </button>
        <button
            v-if="searchType !== 'ingredient'"
            @click="changeSearch('ingredient')"
        >
            Search by ingredient
        </button>
        <button v-if="searchType !== 'tag'" @click="changeSearch('tag')">
            Search by tag
        </button>
    </div>
</template>

<script lang="ts">
import { PaginatedRecipes, Recipe } from '@/api/recipes/recipe';
import {
    computed,
    defineComponent,
    inject,
    onMounted,
    PropType,
    ref,
} from 'vue';
import { EOS_SEARCH as SearchIcon } from 'eos-icons-vue3';
import { useRoute, useRouter } from 'vue-router';
import { AxiosResponse, AxiosStatic } from 'axios';
import { URI } from '@/api/config';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';

type SearchType = 'title' | 'ingredient' | 'tag';

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
        const axios: AxiosStatic | undefined = inject('axios');
        const router = useRouter();
        const route = useRoute();

        const searchResult = ref<Recipe[]>([]);

        const searchInput = ref<HTMLInputElement>();
        const searchButton = ref<HTMLButtonElement>();

        const currentPage = ref(1);
        const nextPage = ref<number | null>(null);

        const isSearching = ref(false);

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
                        searchPage(parseInt(route.query.page.toString()));
                        return;
                    }
                    searchPage(1);
                }
            }

            searchInput.value?.focus();
        });

        const searchType = computed(
            () => (route.query.searchBy?.toString() as SearchType) || 'title'
        );

        function searchPage(page: number) {
            if (searchInput.value!.value === '') {
                router.push({
                    name: 'RecipeList',
                });

                emit('searchResult', []);

                return;
            }

            isSearching.value = true;

            router.push({
                name: 'RecipeList',
                query: {
                    searchBy: searchType.value,
                    searchText: searchInput.value!.value,
                    page: page > 1 ? page : undefined,
                },
            });

            const url = new URL(URI.recipes.search);
            url.searchParams.append('searchType', searchType.value);
            url.searchParams.append('searchText', searchInput.value!.value);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', URI.recipes.defaultLimit);

            axios
                ?.get(url.toString())
                .then((response: AxiosResponse<PaginatedRecipes>) => {
                    currentPage.value = page;
                    nextPage.value = response.data.next
                        ? currentPage.value + 1
                        : null;

                    emit('searchResult', response.data.recipes);
                })
                .catch((err) => {
                    emit('searchResult', []);
                    console.error(err);
                })
                .finally(() => (isSearching.value = false));
        }

        function changeSearch(type: SearchType) {
            router.push({
                query: {
                    searchBy: type,
                    searchText: searchInput.value!.value,
                },
            });

            if (searchInput.value!.value.length > 0) {
                setTimeout(() => searchPage(1), 10);
            }
        }

        function autoSearch(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                searchPage(1);
            }
        }

        return {
            searchResult,
            searchPage,
            searchType,
            changeSearch,
            searchInput,
            searchButton,
            autoSearch,
            isSearching,
            currentPage,
            nextPage,
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
    box-shadow: 0 0 5px black;
}
input:focus + button {
    box-shadow: 0 0 4px black;
}
.searchButton {
    background-color: grey !important;
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
