<template>
    <div class="my-fav-recipes-container">
        <PageHeader @go-back="back">
            <template v-slot:title>My Favorite Recipes</template>
        </PageHeader>
        <LoadingModal v-if="isLoading" />
        <RecipeList v-else :recipes="favRecipes" slim />
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import LoadingModal from '@/shared/LoadingModal.vue';
import PageHeader from '@/shared/PageHeader.vue';
import RecipeList from '@/recipes/RecipeList.vue';

import useUserState from '@/profile/state/UserState';

export default defineComponent({
    name: 'MyFavRecipes',

    components: {
        LoadingModal,
        RecipeList,
        PageHeader,
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
.my-fav-recipes-container {
    background-color: var(--background-color);
}
</style>
