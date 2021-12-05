<template>
    <PageHeader @go-back="back">
        <template v-slot:title>My Recipes</template>
    </PageHeader>
    <div class="createRecipe">
        <router-link :to="{ name: 'CreateRecipe' }">
            <button>
                <span>Create Recipe</span>
                <i class="las la-plus"></i>
            </button>
        </router-link>
    </div>
    <LoadingModal v-if="isLoading" />
    <RecipeList :recipes="myRecipes" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';
import { useRouter } from 'vue-router';
import useUserState from '@/store/user-state';
import PageHeader from '@/components/shared/PageHeader.vue';

export default defineComponent({
    name: 'MyRecipes',

    components: {
        LoadingModal,
        RecipeList,
        PageHeader,
    },

    setup() {
        const { getMyRecipes, myRecipes, isLoading } = useUserState();

        const router = useRouter();

        onBeforeMount(() => getMyRecipes());

        function back() {
            router.push({
                name: 'Profile',
            });
        }

        return {
            myRecipes,
            isLoading,
            back,
        };
    },
});
</script>

<style scoped>
.createRecipe {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.createRecipe > a {
    margin: 0 0.5rem;
}
.createRecipe button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--main-color);
}
.createRecipe button > *:last-child {
    margin-left: 0.5rem;
}
</style>
