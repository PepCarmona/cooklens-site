import { Endpoint } from '.';
import { URI } from '@/api/config';
import { User } from 'cooklens-types';
import { authState } from '@/main';

interface AuthResponse {
	user: User;
	token: string;
}

export class AuthEndpoint extends Endpoint {
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
		const { token } = authState;

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

	public verifyUser(code: string): Promise<AuthResponse> {
		const url = new URL(URI.auth.verify);
		url.searchParams.append('code', code);

		return this.get(url.toString()).then((x) => {
			return x;
		});
	}
}
