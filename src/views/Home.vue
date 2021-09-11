<template>
    <div>
        <div v-if="selectedView === 'add'">
            <CreateRecipe
                @saved="showAllRecipes"
                @cancel="selectedView = 'view'"
            />
        </div>
        <div
            class="card-container d-flex mt-1 m-auto justify-around"
            v-if="selectedView === 'view'"
        >
            <div v-if="isSearching">Loading...</div>
            <template
                v-else
                v-for="(recipe, index) in recipes"
                :key="recipe._id"
            >
                <RecipeCard
                    :recipe="recipe"
                    @click="openRecipeDetails(index)"
                />
                <div
                    v-if="index < recipes.length - 1"
                    class="horizontal-separator w-60 my-2 m-auto"
                ></div>
            </template>
        </div>
        <div v-if="selectedView === 'search'">
            <SearchRecipe :recipes="recipes" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import { Recipe } from '@/api/recipes/recipe';
import { AxiosResponse, AxiosStatic } from 'axios';
import { URI } from '@/api/config/index';
import CreateRecipe from '@/components/CreateRecipe.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import SearchRecipe from '@/components/SearchRecipe.vue';
import { useRouter } from 'vue-router';

type View = 'add' | 'edit' | 'view' | 'search';

export default defineComponent({
    name: 'Home',

    components: {
        CreateRecipe,
        RecipeCard,
        SearchRecipe,
    },

    setup() {
        const axios: AxiosStatic | undefined = inject('axios');
        const router = useRouter();

        const selectedView = ref<View | null>(null);

        const recipes = ref<Recipe[]>([]);

        const isSearching = ref(false);

        const data = {
            selectedView,
            recipes,
            isSearching,
        };

        onMounted(() => showAllRecipes());

        const selectedIndex = ref<number | null>(null);

        const selectedRecipe = computed<Recipe | null>(() => {
            if (selectedIndex.value === null) {
                return null;
            }
            return recipes.value[selectedIndex.value];
        });

        function showAddRecipe() {
            selectedView.value = selectedView.value === 'add' ? null : 'add';
        }

        function showAllRecipes() {
            if (selectedView.value === 'view') {
                selectedView.value = null;
                return;
            }

            getAllRecipes();

            selectedView.value = 'view';
        }

        function getAllRecipes() {
            isSearching.value = true;

            axios
                ?.get<Recipe[]>(URI.recipes.get)
                .then((response: AxiosResponse<Recipe[]>) => {
                    recipes.value = response.data;
                })
                .catch((err) => console.error(err))
                .finally(() => (isSearching.value = false));
        }

        function showSearchRecipe() {
            selectedView.value =
                selectedView.value === 'search' ? null : 'search';
        }

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
                name: 'Recipe',
                params: { title: formattedTitle },
                query: { id: selectedRecipe.value._id! },
            });
        }

        return {
            ...data,
            showAddRecipe,
            showAllRecipes,
            getAllRecipes,
            showSearchRecipe,
            openRecipeDetails,
        };
    },
});
</script>

<style scoped>
.card-container {
    flex-wrap: wrap;
    width: 90%;
}
@media only screen and (min-width: 1024px) {
    .horizontal-separator {
        display: none;
    }
}
</style>
