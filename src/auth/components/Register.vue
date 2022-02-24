<template>
	<div class="auth-container">
		<CustomModal
			:showIf="isShowingVerifyMail"
			@close="isShowingVerifyMail = false"
		>
			<i class="mail-icon las la-envelope"></i>
			<div class="verify-mail">
				We have sent you an email to confirm your account. Please check your
				inbox.
			</div>
			<Button class="closeModal" @click="isShowingVerifyMail = false">
				Got it!
			</Button>
		</CustomModal>
		<CustomInput
			label="Username"
			v-model="user.username"
			type="text"
			id="userName"
			:autoCapitalize="false"
			@keydown.enter="register"
			required
		/>

		<CustomInput
			label="Email"
			v-model="user.email"
			type="email"
			id="email"
			:autoCapitalize="false"
			@keydown.enter="register"
			required
		/>

		<CustomInput
			label="Password"
			v-model="user.password"
			type="password"
			id="password"
			:autoCapitalize="false"
			@keydown.enter="register"
			required
		/>

		<div v-if="false" class="errors">Errors go here</div>

		<Button class="action" @click="register" :loading="isLoading" primary>
			Register
		</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';

import CustomInput from '@/shared/CustomInput.vue';
import CustomModal from '@/shared/CustomModal.vue';

import { User, UserInfo } from 'cooklens-types';
import { notify } from '@/shared/Notifications/NotifiactionState';
import { AuthServiceKey, AuthStateKey } from '@/injectionKeys';

export default defineComponent({
	name: 'Register',

	components: {
		CustomInput,
		CustomModal,
	},

	props: {
		nextUrl: String,
	},

	setup(props) {
		const user = ref<UserInfo>(new User());

		const authState = inject(AuthStateKey)!;
		const { isLoading } = authState;

		const authService = inject(AuthServiceKey)!;

		const isShowingVerifyMail = ref(false);

		function register() {
			if (!isValidUser()) {
				return;
			}

			authService
				.register(user.value, props.nextUrl)
				.then(() => (isShowingVerifyMail.value = true))
				.catch((err) => notify(err, 'error'));
		}

		function isValidUser(): boolean {
			if (!user.value.username) {
				console.error('Username is mandatory');
				return false;
			}

			if (user.value.username.length < 3 || user.value.username.length > 15) {
				console.error('Username must have between 3 and 15 characters');
				return false;
			}

			if (!user.value.password) {
				console.error('Password is mandatory');
				return false;
			}

			const validatedPassword = authService.validatePassword(
				user.value.password
			);

			if (!validatedPassword.isValid) {
				console.error(validatedPassword.error);
				return false;
			}

			if (!user.value.email) {
				console.error('Email is mandatory');
				return false;
			}

			return true;
		}

		return {
			user,
			isLoading,
			isShowingVerifyMail,
			register,
		};
	},
});
</script>

<style lang="scss" scoped>
@import '~@/auth/components/style/authentication.scss';
</style>
