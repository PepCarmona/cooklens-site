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
			<button class="closeModal" @click="isShowingVerifyMail = false">
				Got it!
			</button>
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

		<button class="action" @click="register" :disabled="isLoading">
			<span v-if="isLoading">
				<i class="las la-circle-notch"></i>
			</span>
			<span v-else>Register</span>
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import CustomInput from '@/shared/CustomInput.vue';
import CustomModal from '@/shared/CustomModal.vue';

import useAuthenticationState from '@/auth/state/AuthenticationState';

import { User, UserInfo } from 'cooklens-types';
import { notify } from '@/shared/Notifications/NotifiactionState';

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

		const {
			isLoading,
			register: authRegister,
			validatePassword,
		} = useAuthenticationState();

		const isShowingVerifyMail = ref(false);

		function register() {
			if (!isValidUser()) {
				return;
			}

			authRegister(user.value, props.nextUrl)
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

			const validatedPassword = validatePassword(user.value.password);

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

<style scoped>
@import '~@/auth/style/authentication.css';
</style>
