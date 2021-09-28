import axios, { AxiosResponse } from 'axios';
import { URI } from '@/api/config';
import { User } from '@/api/types/user';
import {
    startLoading,
    finishLoading,
    setAuthenticatedUser,
} from '@/store/auth-state';

interface AuthResponse {
    user: User;
    token: string;
}

export function checkSession(): Promise<void> | undefined {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.warn('No token found');
        return;
    }

    startLoading();

    return axios
        .post(URI.auth.login, { token })
        .then((response: AxiosResponse<User>) => {
            setAuthenticatedUser(response.data);
        })
        .catch((err) => console.error(err))
        .finally(() => finishLoading());
}

export function logIn(user: User): Promise<void> {
    startLoading();

    return axios
        .post(URI.auth.login, user)
        .then((response: AxiosResponse<AuthResponse>) => {
            localStorage.setItem('userToken', response.data.token);

            setAuthenticatedUser(response.data.user);
        })
        .catch((err) => console.error(err))
        .finally(() => finishLoading());
}

export function logOut(): void {
    localStorage.removeItem('userToken');

    setAuthenticatedUser(null);
}

export function register(user: User): Promise<void> {
    startLoading();
    return axios
        .post(URI.auth.register, user)
        .then((response: AxiosResponse<AuthResponse>) => {
            localStorage.setItem(
                'userToken',
                JSON.stringify(response.data.token)
            );

            setAuthenticatedUser(response.data.user);
        })
        .catch((err) => console.error(err))
        .finally(() => finishLoading());
}
