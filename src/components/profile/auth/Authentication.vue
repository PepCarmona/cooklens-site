<template>
    <div>
        <Login v-if="showLogin" />
        <Register v-else />
        <div class="alternative">
            <span v-if="showLogin">
                No account yet?
                <span @click="showLogin = false">Register</span>
            </span>
            <span v-else>
                Already have an account?
                <span @click="showLogin = true">Sign in</span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Login from '@/components/profile/auth/Login.vue';
import Register from '@/components/profile/auth/Register.vue';

export default defineComponent({
    name: 'Authentication',

    components: {
        Login,
        Register,
    },

    setup() {
        const showLogin = ref(true);

        return {
            showLogin,
        };
    },
});
</script>

<style scoped>
@import '~@/assets/styles/authentication.css';
</style>
