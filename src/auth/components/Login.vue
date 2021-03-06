<template>
	<div class="auth-container">
		<CustomInput
			label="Username"
			v-model="user.username"
			type="text"
			id="userName"
			:autoCapitalize="false"
			@keydown.enter="logIn"
			required
		/>

		<CustomInput
			label="Password"
			v-model="user.password"
			type="password"
			id="password"
			:autoCapitalize="false"
			@keydown.enter="logIn"
			required
		/>

		<div v-if="false" class="errors">Errors go here</div>

		<Button class="action" @click="logIn" :loading="isLoadingAuth" primary>
			Login
		</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';

import CustomInput from '@/shared/CustomInput.vue';

import { notify } from '@/shared/Notifications/NotifiactionState';

import { User, UserInfo } from 'cooklens-types';
import { AuthServiceKey, LoadingStateKey } from '@/injectionKeys';

export default defineComponent({
	name: 'Login',

	components: {
		CustomInput,
	},

	props: {
		nextUrl: String,
	},

	setup(props) {
		const router = useRouter();
		const user = ref<UserInfo>(new User());

		const loadingState = inject(LoadingStateKey)!;
		const { isLoadingAuth } = loadingState;

		const authService = inject(AuthServiceKey)!;

		function logIn() {
			if (!isValidUser()) {
				return;
			}

			authService
				.logIn(user.value)
				.then(() => router.push(props.nextUrl ?? { name: 'Profile' }))
				.catch((err) => notify(err, 'error'));
		}

		function isValidUser(): boolean {
			if (!user.value.username) {
				console.error('Username is mandatory');
				return false;
			}

			if (!user.value.password) {
				console.error('Password is mandatory');
				return false;
			}

			return true;
		}

		return {
			user,
			isLoadingAuth,
			logIn,
		};
	},
});
</script>

<style lang="scss" scoped>
@import '~@/auth/components/style/authentication.scss';
</style>
