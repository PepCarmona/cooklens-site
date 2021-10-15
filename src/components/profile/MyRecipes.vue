<template>
    <div class="row align-center justify-center">
        <button @click="back" class="back"><ArrowBackIcon size="l" /></button>
        <h2>My Recipes</h2>
    </div>
    <LoadingModal v-if="isLoading" />
    <RecipeList v-else :recipes="myRecipes" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';
import { EOS_WEST as ArrowBackIcon } from 'eos-icons-vue3';
import { useRouter } from 'vue-router';
import useUserState from '@/store/user-state';

export default defineComponent({
    name: 'MyRecipes',

    components: {
        LoadingModal,
        RecipeList,
        ArrowBackIcon,
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
.back {
    padding: 0.5rem 1rem;
    position: absolute;
    left: 1rem;
}
</style>
