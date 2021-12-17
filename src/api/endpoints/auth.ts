import { Endpoint } from '.';
import { URI } from '@/api/config';
import useAuthenticationState from '@/auth/state/AuthenticationState';
import { User } from 'cooklens-types';

interface AuthResponse {
	user: User;
	token: string;
}
interface AuthEndpointInterface {
	register(user: User): Promise<void>;

	logIn(user: User): Promise<AuthResponse>;

	logOut(): Promise<void>;

	checkSession(): Promise<User | null>;
}

export class AuthEndpoint extends Endpoint implements AuthEndpointInterface {
	public register(user: User, nextUrl?: string): Promise<void> {
		return this.post(URI.auth.register, { user, nextUrl });
	}

	public logIn(user: User): Promise<AuthResponse> {
		return this.post(URI.auth.login, user);
	}

	public logOut(): Promise<void> {
		return new Promise((resolve) => {
			localStorage.removeItem('userToken');
			resolve();
		});
	}

	public checkSession(): Promise<User | null> {
		const { token } = useAuthenticationState();

		if (token.value === '') {
			console.warn('No token found');
			return new Promise((resolve) => resolve(null));
		}

		return this.post(URI.auth.loginFromToken, { token: token.value }).catch(
			(err) => {
				if (err === 'Token expired') {
					// TODO: handle refreshToken
					this.logOut();
				}
			}
		);
	}
}
