<template>
    <div class="login-container">
        <input
            v-model="user.username"
            type="text"
            placeholder="Username"
            @keypress="autoLogin"
            required
        />

        <input
            v-model="user.password"
            type="password"
            placeholder="Password"
            @keypress="autoLogin"
            required
        />

        <div v-if="false" class="errors">Errors go here</div>

        <button @click="logIn" :disabled="isLoading">
            <span v-if="isLoading">
                <LoadingSpinner />
            </span>
            <span v-else>Login</span>
        </button>

        <div class="alternative">
            No account yet? <router-link to="/register">Register</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { User, UserClass } from '@/api/types/user';
import useAuthState from '@/store/auth-state';
import { EOS_LOADING_ANIMATED as LoadingSpinner } from 'eos-icons-vue3';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Login',

    components: {
        LoadingSpinner,
    },

    setup() {
        const router = useRouter();
        const user = ref<User>(new UserClass());

        const { isLoading } = useAuthState();

        function logIn() {
            if (!isValidUser()) {
                return;
            }

            useAuthState()
                .logIn(user.value)
                .then(() => router.push({ name: 'Home' }));
        }

        function isValidUser(): boolean {
            if (!user.value.username) {
                console.error('Username is mandatory');
                return false;
            }

            if (
                user.value.username.length < 3 ||
                user.value.username.length > 15
            ) {
                console.error('Username must have between 3 and 15 characters');
                return false;
            }

            if (!user.value.password) {
                console.error('Password is mandatory');
                return false;
            }

            if (
                user.value.password.length < 5 ||
                user.value.password.length > 15
            ) {
                console.error('Password must have between 5 and 15 characters');
                return false;
            }

            return true;
        }

        function autoLogin(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                logIn();
            }
        }

        return {
            user,
            isLoading,
            logIn,
            autoLogin,
        };
    },
});
</script>

<style scoped>
@import '~@/assets/styles/login.css';
</style>
