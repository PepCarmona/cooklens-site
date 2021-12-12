<template>
    <div class="authentication">
        <div class="auth-back" @click="goBack">
            <i class="las la-angle-left"></i>
        </div>
        <div class="cover-image"></div>
        <div class="form">
            <router-link class="title" to="/">Cooklens</router-link>
            <div class="subtitle">Just enjoy cooking</div>
            <Login v-if="showLogin" :nextUrl="nextUrl" />
            <Register v-else :nextUrl="nextUrl" />
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
import { useRouter } from 'vue-router';

import Login from '@/auth/Login.vue';
import Register from '@/auth/Register.vue';

let prevRoute: string | undefined;
export default defineComponent({
    name: 'Authentication',

    components: {
        Login,
        Register,
    },

    beforeRouteEnter(to, from) {
        prevRoute = from.name?.toString();
    },

    setup(_, { attrs }) {
        const router = useRouter();
        const showLogin = ref(true);
        const nextUrl = attrs.nextUrl;

        function goBack() {
            if (prevRoute) {
                router.back();
            } else {
                router.push({ name: 'Home' });
            }
        }

        return {
            showLogin,
            nextUrl,
            goBack,
        };
    },
});
</script>

<style scoped>
@import '~@/auth/style/authentication.css';
</style>
