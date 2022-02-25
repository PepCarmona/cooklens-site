import { ref } from 'vue';

import { UserInfo } from 'cooklens-types';

export default function createAuthenticationState() {
	const authenticatedUser = ref<UserInfo | null>();
	const token = ref(localStorage.getItem('userToken') || '');

	return {
		authenticatedUser,
		token,
	};
}

export type AuthenticationState = ReturnType<typeof createAuthenticationState>;
