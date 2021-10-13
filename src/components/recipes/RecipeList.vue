<template>
    <div class="card-container">
        <template v-for="(recipe, index) in recipes" :key="recipe._id">
            <RecipeCard :recipe="recipe" @click="openRecipeDetails(index)" />
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
            v-if="!(currentPage === 1 && !nextPageExists)"
            class="mt-1"
            :nextPageExists="nextPageExists"
            @previousPage="goToPreviousPage"
            @nextPage="goToNextPage"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { Recipe } from '@/api/types/recipe';
import RecipeCard from '@/components/recipes/RecipeCard.vue';
import Pagination from '@/components/shared/Pagination.vue';
import { useRouter } from 'vue-router';
import usePaginationState from '@/store/pagination-state';

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
    },

    components: {
        RecipeCard,
        Pagination,
    },

    emits: ['showAllRecipes', 'goToPage'],

    setup(props, { emit }) {
        const { currentPage, nextPageExists } = usePaginationState();

        const router = useRouter();

        const selectedIndex = ref<number | null>(null);

        const selectedRecipe = computed<Recipe | null>(() => {
            if (selectedIndex.value === null) {
                return null;
            }
            return props.recipes[selectedIndex.value];
        });

        function openRecipeDetails(index: number) {
            selectedIndex.value = index;

            if (selectedIndex.value === null || selectedRecipe.value === null) {
                console.error('No selected recipe');
                return;
            }

            const formattedTitle = selectedRecipe.value.title
                .toLowerCase()
                .replaceAll(' ', '-');

            router.push({
                name: 'RecipeDetails',
                params: { title: formattedTitle },
                query: { id: selectedRecipe.value._id! },
            });
        }

        function goToPreviousPage() {
            emit('goToPage', currentPage.value - 1);
        }

        function goToNextPage() {
            emit('goToPage', currentPage.value + 1);
        }

        function showAllRecipes() {
            emit('showAllRecipes');
        }

        return {
            currentPage,
            nextPageExists,
            openRecipeDetails,
            goToPreviousPage,
            goToNextPage,
            showAllRecipes,
        };
    },
});
</script>

<style scoped>
.seeAll {
    position: absolute;
    background-color: black;
    color: white;
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
.card-container > .card:first-child {
    margin-top: 0;
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
