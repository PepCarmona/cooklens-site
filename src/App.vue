<template>
	<Header />
	<main>
		<FloatingNotification />
		<router-view />
	</main>
	<Footer />
</template>

<script lang="ts">
import { defineComponent, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import FloatingNotification from '@/shared/Notifications/FloatingNotification.vue';
import Header from '@/shared/Header.vue';
import Footer from '@/shared/Footer.vue';
import { AuthServiceKey, AuthStateKey } from './injectionKeys';

export default defineComponent({
	components: {
		FloatingNotification,
		Header,
		Footer,
	},

	setup() {
		const route = useRoute();
		const router = useRouter();

		const authState = inject(AuthStateKey)!;
		const { authenticatedUser } = authState;

		const authService = inject(AuthServiceKey)!;

		router.beforeEach(async (to, from, next) => {
			if (to.meta.requireAuth) {
				if (authenticatedUser.value === undefined) {
					await authService.checkSession();
				}
				if (!authenticatedUser.value) {
					next({
						name: 'Authentication',
						query: { nextUrl: to.fullPath },
					});
				} else {
					next();
				}
			} else {
				if (authenticatedUser.value === undefined) {
					authService.checkSession();
				}
				next();
			}
		});

		watch(route, () => {
			const app = document.getElementById('app');
			if (route.meta.invertedBG) {
				app?.classList.add('invertedBG');
			} else {
				app?.classList.remove('invertedBG');
			}

			if (route.meta.noFooter) {
				app?.classList.add('no-footer');
			} else {
				app?.classList.remove('no-footer');
			}
		});
		return {};
	},
});
</script>

<style lang="scss">
@import './assets/global.scss';
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: var(--text-main-color);
	background-color: var(--background-contrast-color);
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	padding-bottom: 55px;
	&.invertedBG {
		background-color: var(--background-color);
	}
	&.no-footer {
		padding-bottom: 0;
	}
	& > main {
		position: relative;
		display: flex;
		flex-grow: 1;
		& > div {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			height: auto;
			width: 100%;
		}
	}
}

@media only screen and (min-width: 769px) {
	#app {
		padding-bottom: 0;
	}
}
</style>
