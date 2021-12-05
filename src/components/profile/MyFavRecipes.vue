<template>
    <div>
        <PageHeader @go-back="back">
            <template v-slot:title>My Favorite Recipes</template>
        </PageHeader>
        <LoadingModal v-if="isLoading" />
        <RecipeList v-else :recipes="favRecipes" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';

import LoadingModal from '@/components/shared/LoadingModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';
import PageHeader from '@/components/shared/PageHeader.vue';

import useUserState from '@/store/user-state';
import { useRouter } from 'vue-router';

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
