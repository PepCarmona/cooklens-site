<template>
	<div class="profile-container">
		<PageHeader :canGoBack="false">
			<template v-slot:title>My Profile</template>
			<template v-slot:actions>
				<span class="settings">
					<i class="las la-sliders-h"></i>
				</span>
			</template>
		</PageHeader>
		<div class="user-info-container">
			<div class="user-info">
				<div class="info">
					<div class="username">
						{{ authenticatedUser.username }}
					</div>
					<div class="mail">
						<span v-if="authenticatedUser.email">
							{{ authenticatedUser.email }}
						</span>
						<span v-else>Add email</span>
					</div>
				</div>
				<div class="image"></div>
			</div>
			<div class="links">
				<router-link :to="{ name: 'ownRecipes' }">
					<Button>
						<i class="las la-book"></i>
						<span>My Recipes</span>
					</Button>
				</router-link>
				<router-link :to="{ name: 'favRecipes' }">
					<Button>
						<i class="lar la-heart"></i>
						<span>Favorites</span>
					</Button>
				</router-link>
				<router-link :to="{ name: 'myMealPlan' }">
					<Button>
						<i class="las la-calendar-week"></i>
						<span>Meal Plan</span>
					</Button>
				</router-link>
			</div>
			<div class="more-info">
				<!-- <span class="title">More…</span> -->
				<Button @click="logOut">
					<span>Logout</span>
					<i class="las la-sign-out-alt"></i>
				</Button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import PageHeader from '@/shared/PageHeader.vue';

import useAuthenticationState from '@/auth/state/AuthenticationState';

export default defineComponent({
	name: 'Profile',

	components: {
		PageHeader,
	},

	setup() {
		const router = useRouter();
		const { authenticatedUser, logOut: authLogOut } = useAuthenticationState();

		function logOut() {
			authLogOut().then(() => {
				router.push({ name: 'Home' });
			});
		}

		return {
			authenticatedUser,
			logOut,
		};
	},
});
</script>

<style scoped>
.user-info-container {
	margin: 0 1rem;
}
.user-info {
	display: flex;
	padding: 1rem 0;
}
.info {
	text-align: left;
	flex-grow: 1;
}
.username {
	font-size: 20px;
	font-weight: 600;
	margin-bottom: 0.5rem;
	letter-spacing: 1.2px;
}
.mail {
	font-size: 14px;
	color: var(--grey-800);
}
.image {
	height: 60px;
	width: 60px;
	border-radius: 60px;
	background-image: url('https://randomuser.me/api/portraits/men/46.jpg');
	background-size: cover;
	background-position: center;
}
.links {
	display: flex;
	justify-content: space-around;
	padding: 1rem 0;
	border-top: 1px solid var(--border-color);
	border-bottom: 1px solid var(--border-color);
}
.links button {
	flex-wrap: wrap;
	margin: auto;
}
.links i {
	display: block;
	width: 100%;
	margin-bottom: 1rem;
	font-size: 28px;
}
.links span {
	display: block;
	font-size: 14px;
	color: var(--grey-800);
}

.more-info {
	text-align: left;
	margin-top: 4rem;
}
.more-info .title {
	display: block;
	margin: 20px 0;
	font-size: 20px;
	font-family: var(--title-font);
}
.more-info > button {
	width: 100%;
	display: flex;
	justify-content: space-between;
}
.la-arrow-right {
	font-size: 16px;
}
</style>
