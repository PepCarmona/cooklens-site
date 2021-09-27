import { URI } from '@/api/config';
import { User } from '@/api/user';
import axios, { AxiosResponse } from 'axios';
import { readonly, Ref, ref } from 'vue';

interface AuthState {
    isLoading: Readonly<Ref<boolean>>;
    authenticatedUser: Readonly<Ref<User | null>>;
    token: Readonly<Ref<string>>;
}

interface AuthResponse {
    user: User;
    token: string;
}

const isLoading = ref(false);
const authenticatedUser = ref<User | null>(null);
const token = ref(localStorage.getItem('userToken') || '');

export function checkSession(): void {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.warn('No token found');
        return;
    }

    isLoading.value = true;

    axios
        .post(URI.auth.login, { token })
        .then((response: AxiosResponse<User>) => {
            authenticatedUser.value = response.data;
        })
        .catch((err) => console.error(err))
        .finally(() => (isLoading.value = false));
}

export function logIn(user: User): Promise<void> {
    isLoading.value = true;

    return axios
        .post(URI.auth.login, user)
        .then((response: AxiosResponse<AuthResponse>) => {
            localStorage.setItem('userToken', response.data.token);

            authenticatedUser.value = response.data.user;
        })
        .catch((err) => console.error(err))
        .finally(() => (isLoading.value = false));
}

export function logOut(): void {
    localStorage.removeItem('userToken');

    authenticatedUser.value = null;
}

export function register(user: User): Promise<void> {
    isLoading.value = true;
    return axios
        .post(URI.auth.register, user)
        .then((response: AxiosResponse<AuthResponse>) => {
            localStorage.setItem(
                'userToken',
                JSON.stringify(response.data.token)
            );

            authenticatedUser.value = response.data.user;
        })
        .catch((err) => console.error(err))
        .finally(() => (isLoading.value = false));
}

export default function useAuth(): AuthState {
    return {
        isLoading: readonly(isLoading),
        authenticatedUser: readonly(authenticatedUser),
        token: readonly(token),
    };
}
