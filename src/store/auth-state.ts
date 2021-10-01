import { AuthEndpoint } from '@/api/endpoints/auth';
import { User } from '@/api/types/user';
import { readonly, Ref, ref } from 'vue';

interface AuthState {
    isLoading: Readonly<Ref<boolean>>;
    authenticatedUser: Readonly<Ref<User | null>>;
    token: Readonly<Ref<string>>;

    register(user: User): Promise<void>;
    logIn(user: User): Promise<void>;
    logOut(): Promise<void>;
    checkSession(): Promise<User | null>;
}

const authService = new AuthEndpoint();

const isLoading = ref(false);
const authenticatedUser = ref<User | null>(null);
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

export default function useAuthState(): AuthState {
    return {
        isLoading: readonly(isLoading),
        authenticatedUser: readonly(authenticatedUser),
        token: readonly(token),

        register,
        logIn,
        logOut,
        checkSession,
    };
}
