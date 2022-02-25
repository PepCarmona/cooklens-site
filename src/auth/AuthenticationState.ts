import { ref } from 'vue';

import { UserInfo } from 'cooklens-types';

const authenticatedUser = ref<UserInfo | null>();
const token = ref(localStorage.getItem('userToken') || '');

export const authState = {
	authenticatedUser,
	token,
};

export type AuthenticationState = typeof authState;
