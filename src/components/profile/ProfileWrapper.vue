<template>
    <div v-if="isLoading"><i class="las la-circle-notch"></i></div>
    <div v-else-if="authenticatedUser">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated } from 'vue';
import useAuthState from '@/store/auth-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'ProfileWrapper',

    setup() {
        const router = useRouter();
        const { authenticatedUser, isLoading } = useAuthState();

        onMounted(() =>
            router.replace({
                params: { user: authenticatedUser.value?.username },
            })
        );
        onUpdated(() =>
            router.replace({
                params: { user: authenticatedUser.value?.username },
            })
        );
        return {
            authenticatedUser,
            isLoading,
        };
    },
});
</script>

<style scoped>
.links {
    margin-top: 1rem;
    justify-content: center;
}
.links > button {
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    border: 1px solid var(--main-color);
}
.links > button > *:last-child {
    margin-left: 0.5rem;
}
</style>
