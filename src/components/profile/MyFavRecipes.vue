<template>
    <div class="row align-center justify-center">
        <button @click="back" class="back">
            <i class="las la-arrow-left"></i>
        </button>
        <h2>My Favorite Recipes</h2>
    </div>
    <LoadingModal v-if="isLoading" />
    <RecipeList v-else :recipes="favRecipes" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';

import LoadingModal from '@/components/shared/LoadingModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';

import useUserState from '@/store/user-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'MyFavRecipes',

    components: {
        LoadingModal,
        RecipeList,
    },

    setup() {
        const { getFavRecipes, favRecipes, isLoading } = useUserState();

        const router = useRouter();

        onBeforeMount(() => getFavRecipes());

        function back() {
            router.push({
                name: 'Profile',
            });
        }

        return {
            favRecipes,
            isLoading,
            back,
        };
    },
});
</script>

<style scoped>
.back {
    padding: 0.5rem 1rem;
    position: absolute;
    left: 1rem;
}
</style>
