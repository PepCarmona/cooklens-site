import { AuthEndpoint } from '@/api/endpoints/auth';
import { User } from '@/api/types/user';
import { readonly, Ref, ref } from 'vue';

interface AuthState {
    isLoading: Readonly<Ref<boolean>>;
    authenticatedUser: Readonly<Ref<User | null>>;
    token: Readonly<Ref<string>>;
}

const authService = new AuthEndpoint();

const isLoading = ref(false);
const authenticatedUser = ref<User | null>(null);
const token = ref(localStorage.getItem('userToken') || '');

export async function register(user: User): Promise<void> {
    isLoading.value = true;

    const authResponse = await authService.register(user);

    localStorage.setItem('userToken', authResponse.token);
    authenticatedUser.value = authResponse.user;
}
export async function logIn(user: User): Promise<void> {
    isLoading.value = true;

    const authResponse = await authService.logIn(user);

    localStorage.setItem('userToken', authResponse.token);
    authenticatedUser.value = authResponse.user;
    isLoading.value = false;
}

export async function logOut(): Promise<void> {
    await authService.logOut();

    authenticatedUser.value = null;
}

export async function checkSession(): Promise<void> {
    isLoading.value = true;

    const loggedUser = await authService.checkSession();

    authenticatedUser.value = loggedUser;
}

export default function useAuth(): AuthState {
    return {
        isLoading: readonly(isLoading),
        authenticatedUser: readonly(authenticatedUser),
        token: readonly(token),
    };
}
