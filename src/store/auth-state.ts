import { User } from '@/api/types/user';
import { readonly, Ref, ref } from 'vue';

interface AuthState {
    isLoading: Readonly<Ref<boolean>>;
    authenticatedUser: Readonly<Ref<User | null>>;
    token: Readonly<Ref<string>>;
}

const isLoading = ref(false);
const authenticatedUser = ref<User | null>(null);
const token = ref(localStorage.getItem('userToken') || '');

export function startLoading(): void {
    isLoading.value = true;
}

export function finishLoading(): void {
    isLoading.value = false;
}

export function setAuthenticatedUser(user: User | null): void {
    authenticatedUser.value = user;
}

export default function useAuth(): AuthState {
    return {
        isLoading: readonly(isLoading),
        authenticatedUser: readonly(authenticatedUser),
        token: readonly(token),
    };
}
