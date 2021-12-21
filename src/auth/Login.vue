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

		<button class="action" @click="logIn" :disabled="isLoading">
			<span v-if="isLoading">
				<i class="las la-circle-notch"></i>
			</span>
			<span v-else>Login</span>
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import CustomInput from '@/shared/CustomInput.vue';

import useAuthenticationState from '@/auth/state/AuthenticationState';

import { User, UserInfo } from 'cooklens-types';

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

		const { isLoading, logIn: authLogin } = useAuthenticationState();

		function logIn() {
			if (!isValidUser()) {
				return;
			}

			authLogin(user.value).then(() =>
				router.push(props.nextUrl ?? { name: 'Profile' })
			);
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
			isLoading,
			logIn,
		};
	},
});
</script>

<style scoped>
@import '~@/auth/style/authentication.css';
</style>
