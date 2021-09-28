<template>
    <div v-if="isLoading">Loading</div>
    <div v-else-if="authenticatedUser">
        {{ authenticatedUser.username }}
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import useAuthState from '@/store/auth-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Profile',

    setup() {
        const router = useRouter();

        const { authenticatedUser, isLoading } = useAuthState();

        onBeforeMount(() => {
            if (!authenticatedUser.value) {
                router.push({ name: 'Login' });
            }
        });
        return {
            authenticatedUser,
            isLoading,
        };
    },
});
</script>
