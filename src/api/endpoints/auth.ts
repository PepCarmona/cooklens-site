import { URI } from '@/api/config';
import { User } from '@/api/types/user';
import useAuth from '@/store/auth-state';
import { Endpoint } from '.';

interface AuthResponse {
    user: User;
    token: string;
}
interface AuthEndpointInterface {
    register(user: User): Promise<AuthResponse>;

    logIn(user: User): Promise<AuthResponse>;

    logOut(): Promise<void>;

    checkSession(): Promise<User> | null;
}

export class AuthEndpoint extends Endpoint implements AuthEndpointInterface {
    public register(user: User): Promise<AuthResponse> {
        return this.post(URI.auth.register, user);
    }

    public logIn(user: User): Promise<AuthResponse> {
        return this.post(URI.auth.login, user);
    }

    public logOut(): Promise<void> {
        return new Promise((resolve: any) => {
            localStorage.removeItem('userToken');
            return resolve;
        });
    }

    public checkSession(): Promise<User> | null {
        const { token } = useAuth();

        if (token.value === '') {
            console.warn('No token found');
            return null;
        }

        return this.post(URI.auth.login, { token: token.value });
    }
}
