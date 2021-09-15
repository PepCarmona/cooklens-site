<template>
    <div class="import-container row p-1 justify-center">
        <span class="row justify-center mb-05"
            >Import recipe from one of our &nbsp;
            <span class="dotted">supported sites</span></span
        >
        <div class="row mt-05 justify-center">
            <div class="d-flex w-100">
                <template v-if="isLoading">
                    <span class="w-100 p-05">Loading...</span>
                </template>
                <template v-else>
                    <input
                        ref="input"
                        class="w-100 p-05"
                        type="text"
                        placeholder="Url"
                    />
                    <button @click="importFromUrl" class="ml-05">Import</button>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { URI } from '@/api/config';
import { Recipe } from '@/api/recipes/recipe';
import { AxiosResponse, AxiosStatic } from 'axios';
import { defineComponent, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'ImportRecipe',

    setup() {
        const axios: AxiosStatic | undefined = inject('axios');
        const router = useRouter();

        const input = ref<HTMLInputElement>();

        const isLoading = ref(false);

        onMounted(() => input.value?.focus());

        function importFromUrl() {
            const inputUrl = input.value?.value ?? '';

            if (inputUrl === '') {
                console.error('Input URL is empty');
                return;
            }

            isLoading.value = true;

            const url = new URL(URI.recipes.import);
            url.searchParams.append('url', inputUrl);

            axios
                ?.get(url.toString())
                .then((response: AxiosResponse<Recipe>) => {
                    const formattedTitle = response.data.title
                        .toLowerCase()
                        .replaceAll(' ', '-');

                    router.push({
                        name: 'Recipe',
                        params: { title: formattedTitle },
                        query: { id: response.data._id },
                    });
                })
                .catch((err) => console.error(err))
                .finally(() => (isLoading.value = false));
        }
        return {
            input,
            importFromUrl,
            isLoading,
        };
    },
});
</script>

<style scoped>
.import-container {
    background-color: lightgrey;
}

span {
    font-size: 0.95rem;
}
span.dotted {
    border-bottom: 1px dotted black;
}
input {
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
    outline: none;
}
input:focus {
    border: 2px solid orange;
    border-radius: 2px;
}
button {
    background-color: grey;
    color: white;
    border: 1px solid black;
    border-radius: 2px;
    padding: 1rem;
}
</style>
