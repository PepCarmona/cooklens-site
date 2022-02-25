import { AuthEndpoint } from '@/api/endpoints/auth';
import { loadingState } from '@/LoadingState';
import { UserInfo } from 'cooklens-types';
import { AuthenticationState } from './AuthenticationState';

const authEndpoint = new AuthEndpoint();

export default function createAuthenticationService(
	authState: AuthenticationState
) {
	const { isLoadingAuth } = loadingState;
	function register(user: UserInfo, nextUrl?: string) {
		isLoadingAuth.value = true;

		return authEndpoint
			.register(user, nextUrl)
			.finally(() => (isLoadingAuth.value = false));
	}

	function logIn(user: UserInfo) {
		isLoadingAuth.value = true;

		return authEndpoint
			.logIn(user)
			.then((authResponse) => {
				localStorage.setItem('userToken', authResponse.token);
				authState.authenticatedUser.value = authResponse.user;
			})
			.finally(() => (isLoadingAuth.value = false));
	}

	async function logOut() {
		authState.authenticatedUser.value = null;

		await authEndpoint.logOut();
	}

	function checkSession() {
		isLoadingAuth.value = true;

		return authEndpoint
			.checkSession()
			.then((loggedUser) => (authState.authenticatedUser.value = loggedUser))
			.finally(() => (isLoadingAuth.value = false));
	}

	function validatePassword(password: string) {
		if (password.length < 5 || password.length > 15) {
			return {
				isValid: false,
				error: 'Password must have between 5 and 15 characters',
			};
		}
		if (!password.match(/[0-9]/)) {
			return {
				isValid: false,
				error: 'Password must include at least one digit',
			};
		}
		if (!password.match(/[^A-Za-z0-9]/)) {
			return {
				isValid: false,
				error: 'Password must include at least one special character',
			};
		}
		return { isValid: true };
	}

	function verifyUser(code: string) {
		isLoadingAuth.value = true;

		return authEndpoint
			.verifyUser(code)
			.then((authResponse) => {
				localStorage.setItem('userToken', authResponse.token);
				authState.authenticatedUser.value = authResponse.user;
			})
			.finally(() => (isLoadingAuth.value = false));
	}

	return {
		register,
		logIn,
		logOut,
		checkSession,
		validatePassword,
		verifyUser,
	};
}

export type AuthService = ReturnType<typeof createAuthenticationService>;
