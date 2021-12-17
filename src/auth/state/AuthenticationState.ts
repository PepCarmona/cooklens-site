import { readonly, ref, computed } from 'vue';

import { AuthEndpoint } from '@/api/endpoints/auth';

import { UserInfo } from 'cooklens-types';

const authService = new AuthEndpoint();

const isLoading = ref(false);
const authenticatedUser = ref<UserInfo | null>();
const token = ref(localStorage.getItem('userToken') || '');

function register(user: UserInfo) {
	isLoading.value = true;

	return authService
		.register(user)
		.then((authResponse) => {
			localStorage.setItem('userToken', authResponse.token);
			authenticatedUser.value = authResponse.user;
		})
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

export default function useAuthenticationState() {
	return {
		isLoading: readonly(isLoading),
		authenticatedUser: computed(() => authenticatedUser.value),
		token: readonly(token),

		register,
		logIn,
		logOut,
		checkSession,
	};
}
