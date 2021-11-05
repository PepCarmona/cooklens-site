<template>
    <div class="card-container" :class="{ column: isWeekPlan }">
        <div v-if="isLoading" class="loadingCard">Loading...</div>
        <template v-else v-for="recipe in recipes" :key="recipe._id">
            <RecipeCard
                :recipe="recipe"
                :isWeekPlan="isWeekPlan"
                @selectedRecipe="selectRecipe"
            />
        </template>
        <button
            v-if="showFilteredRecipes"
            @click="showAllRecipes"
            class="seeAll"
        >
            See all
        </button>
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
import { Recipe } from '@/api/types/recipe';
import RecipeCard from '@/components/recipes/RecipeCard.vue';
import Pagination from '@/components/shared/Pagination.vue';
import usePaginationState from '@/store/pagination-state';
import useRecipeState from '@/store/recipe-state';

export default defineComponent({
    name: 'RecipeList',

    props: {
        recipes: {
            type: Array as PropType<Recipe[]>,
            required: true,
        },
        showFilteredRecipes: {
            type: Boolean,
            default: false,
        },
        isWeekPlan: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        RecipeCard,
        Pagination,
    },

    emits: ['showAllRecipes', 'goToPage', 'selectedRecipe'],

    setup(_, { emit }) {
        const { currentPage, nextPageExists } = usePaginationState();
        const { isLoading } = useRecipeState();

        function goToPreviousPage() {
            emit('goToPage', currentPage.value - 1);
        }

        function goToNextPage() {
            emit('goToPage', currentPage.value + 1);
        }

        function showAllRecipes() {
            emit('showAllRecipes');
        }

        function selectRecipe(recipe: Recipe) {
            emit('selectedRecipe', recipe);
        }

        return {
            currentPage,
            nextPageExists,
            isLoading,
            goToPreviousPage,
            goToNextPage,
            showAllRecipes,
            selectRecipe,
        };
    },
});
</script>

<style scoped>
.seeAll {
    position: absolute;
    background-color: var(--main-dark-color);
    color: var(--main-light-color);
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    border-radius: 50px;
    font-size: 1.05rem;
    margin-top: -2rem;
    cursor: pointer;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 90%;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
}
.card-container.column {
    flex-direction: column;
    width: fit-content;
    flex-wrap: nowrap;
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
    .card-container > .card:nth-child(2) {
        margin-top: 0;
    }
}
@media only screen and (min-width: 1350px) {
    .card-container > .card:nth-child(3) {
        margin-top: 0;
    }
}
</style>
