<template>
    <div class="authentication">
        <div class="cover-image"></div>
        <div class="form">
            <div class="title">Cooklens</div>
            <div class="subtitle">Just enjoy cooking</div>
            <Login v-if="showLogin" />
            <Register v-else />
            <div class="alternative">
                <span v-if="showLogin">
                    No account yet?
                    <span class="toggle-login" @click="showLogin = false">
                        Register
                    </span>
                </span>
                <span v-else>
                    Already have an account?
                    <span class="toggle-login" @click="showLogin = true">
                        Sign in
                    </span>
                </span>
            </div>
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
