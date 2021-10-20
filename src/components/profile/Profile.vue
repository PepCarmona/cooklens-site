<template>
    <h1>My Profile</h1>
    <div>
        {{ authenticatedUser.username }}
    </div>
    <div class="row links">
        <router-link :to="{ name: 'myRecipes' }">
            <button>
                <span>My Recipes</span>
                <ArrowIcon />
            </button>
        </router-link>
        <router-link :to="{ name: 'favRecipes' }">
            <button>
                <span>Favorite Recipes</span>
                <ArrowIcon />
            </button>
        </router-link>
        <router-link :to="{ name: 'myWeekPlan' }">
            <button>
                <span>My Week Plans</span>
                <ArrowIcon />
            </button>
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAuthState from '@/store/auth-state';
import { EOS_ARROW_FORWARD_OUTLINED as ArrowIcon } from 'eos-icons-vue3';

export default defineComponent({
    name: 'Profile',

    components: {
        ArrowIcon,
    },

    setup() {
        const { authenticatedUser } = useAuthState();

        return {
            authenticatedUser,
        };
    },
});
</script>

<style scoped>
.links {
    margin-top: 1rem;
    justify-content: center;
}
.links > a {
    margin: 0 0.5rem;
}
.links button {
    padding: 0.5rem 1rem;
    border: 1px solid grey;
}
.links button > *:last-child {
    margin-left: 0.5rem;
}
</style>
