<template>
    <div
        class="card-container"
        :class="{ column: isWeekPlan, thin, 'pb-3': !isComponent }"
    >
        <div v-if="isLoading" class="loadingCard">Loading...</div>
        <template v-else v-for="recipe in recipes" :key="recipe._id">
            <RecipeCard
                :recipe="recipe"
                :isWeekPlan="isWeekPlan"
                @selectedRecipe="selectRecipe"
                @seeMoreInfoAboutRecipe="seeMoreInfoAboutRecipe"
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
import { computed, defineComponent, PropType } from 'vue';
import { Recipe } from '@/api/types/recipe';
import RecipeCard from '@/components/recipes/RecipeCard.vue';
import Pagination from '@/components/shared/Pagination.vue';
import usePaginationState from '@/store/pagination-state';
import useRecipeState from '@/store/recipe-state';
import { useRoute } from 'vue-router';

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
        thin: Boolean,
    },

    components: {
        RecipeCard,
        Pagination,
    },

    emits: [
        'showAllRecipes',
        'goToPage',
        'selectedRecipe',
        'seeMoreInfoAboutRecipe',
    ],

    setup(_, { emit }) {
        const route = useRoute();
        const { currentPage, nextPageExists } = usePaginationState();
        const { isLoading } = useRecipeState();

        const isComponent = computed(
            () => route.name?.toString() !== 'RecipesMainView'
        );

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

        function seeMoreInfoAboutRecipe(recipe: Recipe) {
            emit('seeMoreInfoAboutRecipe', recipe);
        }

        return {
            currentPage,
            nextPageExists,
            isLoading,
            isComponent,
            goToPreviousPage,
            goToNextPage,
            showAllRecipes,
            selectRecipe,
            seeMoreInfoAboutRecipe,
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
    padding: 1rem;
    max-width: 1000px;
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
    .card-container:not(.thin) > .card:nth-child(2) {
        margin-top: 0;
    }
}
</style>
