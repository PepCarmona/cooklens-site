<template>
    <LoadingModal v-if="isLoading" />
    <template v-else>
        <div class="title">
            <button @click="back" class="back">
                <ArrowBackIcon size="l" />
            </button>
            <h2>My Recipes</h2>
        </div>
        <div class="createRecipe">
            <router-link :to="{ name: 'CreateRecipe' }">
                <button>
                    <span>Create Recipe</span>
                    <AddIcon />
                </button>
            </router-link>
        </div>
        <RecipeList :recipes="myRecipes" />
    </template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';
import { EOS_WEST as ArrowBackIcon, EOS_ADD as AddIcon } from 'eos-icons-vue3';
import { useRouter } from 'vue-router';
import useUserState from '@/store/user-state';

export default defineComponent({
    name: 'MyRecipes',

    components: {
        LoadingModal,
        RecipeList,
        ArrowBackIcon,
        AddIcon,
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

.title,
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
    border: 1px solid grey;
}
.createRecipe button > *:last-child {
    margin-left: 0.5rem;
}
</style>
