<template>
    <div>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <h1>{{ recipe.title }}</h1>
            <div>{{ recipe.body }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { URI } from '@/api/config';
import { Recipe } from '@/api/recipes/recipe';
import { AxiosResponse, AxiosStatic } from 'axios';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    name: 'Recipe',

    setup() {
        const axios: AxiosStatic | undefined = inject('axios');
        const route = useRoute();
        const router = useRouter();

        const isLoading = ref(true);

        const recipe = ref<Recipe | null>(null);

        const data = {
            isLoading,
            recipe,
        };

        onMounted(() => {
            if (route.query.random) {
                getRandomRecipe();
            } else {
                getRecipeDetails();
            }
        });

        watch(route, () => {
            if (route.query.random) {
                getRandomRecipe();
            }
        });

        function getRecipeDetails() {
            const id = route.query.id?.toString();

            isLoading.value = true;

            const url = new URL(URI.recipes.get);
            url.searchParams.append('id', id!);

            axios
                ?.get<Recipe>(url.toString())
                .then((response: AxiosResponse<Recipe>) => {
                    recipe.value = response.data;
                })
                .catch((err) => console.error(err))
                .finally(() => (isLoading.value = false));
        }

        function getRandomRecipe() {
            const url = new URL(URI.recipes.get);
            url.searchParams.append('random', 'true');

            axios
                ?.get<Recipe>(url.toString())
                .then((response: AxiosResponse<Recipe>) => {
                    const formattedTitle = response.data.title
                        .toLowerCase()
                        .replaceAll(' ', '-');

                    router.push({
                        name: 'Recipe',
                        params: { title: formattedTitle },
                        query: { id: response.data._id },
                    });

                    recipe.value = response.data;
                })
                .catch((err) => console.error(err))
                .finally(() => (isLoading.value = false));
        }
        return {
            ...data,
        };
    },
});
</script>
