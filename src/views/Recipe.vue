<template>
    <div>
        <div v-if="isSearching">Loading...</div>
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
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Recipe',

    setup() {
        const axios: AxiosStatic | undefined = inject('axios');
        const route = useRoute();

        const isSearching = ref(true);

        const recipe = ref<Recipe | null>(null);

        const data = {
            isSearching,
            recipe,
        };

        onMounted(() => getRecipeDetails());

        watch(route, () => getRecipeDetails());

        function getRecipeDetails() {
            const id = route.query.id?.toString();

            isSearching.value = true;

            const url = new URL(URI.recipes.get);
            url.searchParams.append('id', id!);

            if (axios) {
                axios
                    .get<Recipe>(url.toString())
                    .then((response: AxiosResponse<Recipe>) => {
                        recipe.value = response.data;
                    })
                    .catch((err) => console.error(err))
                    .finally(() => (isSearching.value = false));
            }
        }
        return {
            ...data,
        };
    },
});
</script>
