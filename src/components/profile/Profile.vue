<template>
    <h1>My Profile</h1>
    <div>
        {{ authenticatedUser.username }}
    </div>
    <div class="row links">
        <router-link :to="{ name: 'myRecipes' }">
            <button>
                <span>My Recipes</span>
                <i class="las la-arrow-right"></i>
            </button>
        </router-link>
        <router-link :to="{ name: 'favRecipes' }">
            <button>
                <span>Favorite Recipes</span>
                <i class="las la-arrow-right"></i>
            </button>
        </router-link>
        <router-link :to="{ name: 'myWeekPlan' }">
            <button>
                <span>My Week Plans</span>
                <i class="las la-arrow-right"></i>
            </button>
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAuthState from '@/store/auth-state';

export default defineComponent({
    name: 'Profile',

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
    border: 1px solid var(--main-color);
}
.links button > *:last-child {
    margin-left: 0.5rem;
}
.la-arrow-right {
    font-size: 16px;
}
</style>
