<template>
	<LoadingSpinner v-if="isLoading" />
	<div v-else-if="authenticatedUser">
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LoadingSpinner from '@/shared/LoadingSpinner.vue';

import createAuthenticationState from '@/auth/state/AuthenticationState';

export default defineComponent({
	name: 'ProfileWrapper',

	components: {
		LoadingSpinner,
	},

	setup() {
		const { authenticatedUser, isLoading } = createAuthenticationState();
		return {
			authenticatedUser,
			isLoading,
		};
	},
});
</script>

<style lang="scss" scoped>
.links {
	margin-top: 1rem;
	justify-content: center;
	& > button {
		padding: 0.5rem 1rem;
		margin: 0 0.5rem;
		border: 1px solid var(--main-color);
		& > *:last-child {
			margin-left: 0.5rem;
		}
	}
}
</style>
