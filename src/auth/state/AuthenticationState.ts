import { AuthEndpoint } from '@/api/endpoints/auth';
import { User } from '@/profile/types/UserTypes';
import { readonly, ref, computed } from 'vue';

const authService = new AuthEndpoint();

const isLoading = ref(false);
const authenticatedUser = ref<User | null>();
const token = ref(localStorage.getItem('userToken') || '');

function register(user: User) {
    isLoading.value = true;

    return authService
        .register(user)
        .then((authResponse) => {
            localStorage.setItem('userToken', authResponse.token);
            authenticatedUser.value = authResponse.user;
        })
        .finally(() => (isLoading.value = false));
}

function logIn(user: User) {
    isLoading.value = true;

    return authService
        .logIn(user)
        .then((authResponse) => {
            localStorage.setItem('userToken', authResponse.token);
            authenticatedUser.value = authResponse.user;
        })
        .finally(() => (isLoading.value = false));
}

async function logOut() {
    authenticatedUser.value = null;

    await authService.logOut();
}

function checkSession() {
    isLoading.value = true;

    return authService
        .checkSession()
        .then((loggedUser) => (authenticatedUser.value = loggedUser))
        .finally(() => (isLoading.value = false));
}

export default function useAuthenticationState() {
    return {
        isLoading: readonly(isLoading),
        authenticatedUser: computed(() => authenticatedUser.value),
        token: readonly(token),

        register,
        logIn,
        logOut,
        checkSession,
    };
}
