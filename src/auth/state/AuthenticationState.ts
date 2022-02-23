import { readonly, ref, computed } from 'vue';

import { AuthEndpoint } from '@/api/endpoints/auth';

import { UserInfo } from 'cooklens-types';

export default function createAuthenticationState() {
	const authService = new AuthEndpoint();

	const isLoading = ref(false);
	const authenticatedUser = ref<UserInfo | null>();
	const token = ref(localStorage.getItem('userToken') || '');

	function register(user: UserInfo, nextUrl?: string) {
		isLoading.value = true;

		return authService
			.register(user, nextUrl)
			.finally(() => (isLoading.value = false));
	}

	function logIn(user: UserInfo) {
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
		isLoading.value = true;

		return authService
			.verifyUser(code)
			.then((authResponse) => {
				localStorage.setItem('userToken', authResponse.token);
				authenticatedUser.value = authResponse.user;
			})
			.finally(() => (isLoading.value = false));
	}

	return {
		isLoading: readonly(isLoading),
		authenticatedUser: computed(() => authenticatedUser.value),
		token: readonly(token),

		register,
		logIn,
		logOut,
		checkSession,
		validatePassword,
		verifyUser,
	};
}
