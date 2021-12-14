<template>
    <div class="card-container" :class="{ column: slim, thin, 'pb-3': !slim }">
        <div v-if="isLoading" class="loadingCard">Loading...</div>
        <template v-else>
            <RecipeCard
                v-for="recipe in recipes"
                :key="recipe._id"
                :recipe="recipe"
                :slim="slim"
                :showActions="showActions"
                @see-more-info="$emit('see-more-info', $event)"
                @select-recipe="$emit('select-recipe', $event)"
            />
        </template>
        <div v-if="recipes.length === 0">No recipes match this search</div>
        <Pagination
            v-if="!(currentPage === 1 && !nextPageExists) && !isLoading"
            class="mt-1"
            :nextPageExists="nextPageExists"
            @previousPage="goToPreviousPage"
            @nextPage="goToNextPage"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import RecipeCard from '@/recipes/RecipeCard.vue';
import Pagination from '@/shared/Pagination/Pagination.vue';

import usePaginationState from '@/shared/Pagination/PaginationState';
import useRecipeState from '@/recipes/state/RecipeState';

import { Recipe } from '@/recipes/types/RecipeTypes';

export default defineComponent({
    name: 'RecipeList',

    props: {
        recipes: {
            type: Array as PropType<Recipe[]>,
            required: true,
        },
        thin: Boolean,
        slim: Boolean,
        showActions: Boolean,
    },

    components: {
        RecipeCard,
        Pagination,
    },

    emits: ['goToPage', 'select-recipe', 'see-more-info'],

    setup(_, { emit }) {
        const { currentPage, nextPageExists } = usePaginationState();
        const { isLoading } = useRecipeState();

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

<style scoped>
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 1rem;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}
.card-container.column {
    flex-direction: column;
    width: fit-content;
    flex-wrap: nowrap;
    padding: 0;
}
.card-container > .card:first-child {
    margin-top: 0;
}

.loadingCard {
    width: 400px;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

@media only screen and (min-width: 906px) {
    .card-container:not(.thin) > .card:nth-child(2) {
        margin-top: 0;
    }
}
</style>
